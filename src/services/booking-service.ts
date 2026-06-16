import { COLLECTIONS, PLAN_DEFINITIONS } from "@/lib/constants";
import { isFirebaseConfigured } from "@/lib/firebase";
import { hasBookingConflict } from "@/lib/booking-utils";
import { mockAdBookings, mockAdvertisers } from "@/lib/mock-data";
import { getLiveScreens, getZoneById } from "@/services/screen-management-service";
import { normalizeAdvertiser } from "@/lib/client-account";
import { advertiserRepo } from "@/services/index";
import type { AdBooking, Advertiser, SubscriptionPlan } from "@/types";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

type BookingInput = {
  advertiserId: string;
  title: string;
  screenId: string;
  zoneId: string;
  date: string;
  startTime: string;
  endTime: string;
  createdBy: "admin" | "client";
};

type Listener = (bookings: AdBooking[]) => void;
type AdvertiserListener = (advertisers: Advertiser[]) => void;

let liveBookings: AdBooking[] = [...mockAdBookings];
let liveAdvertisers: Advertiser[] = mockAdvertisers.map((a) => normalizeAdvertiser({ ...a }));
const bookingListeners = new Set<Listener>();
const advertiserListeners = new Set<AdvertiserListener>();

function dedupeBookings(bookings: AdBooking[]): AdBooking[] {
  const byId = new Map<string, AdBooking>();
  for (const booking of bookings) {
    byId.set(booking.id, booking);
  }
  return Array.from(byId.values());
}

function setLiveBookings(bookings: AdBooking[]) {
  liveBookings = dedupeBookings(bookings);
  notifyBookings();
}

function upsertBooking(booking: AdBooking) {
  setLiveBookings([...liveBookings.filter((b) => b.id !== booking.id), booking]);
}

function notifyBookings() {
  bookingListeners.forEach((cb) => cb([...liveBookings]));
}

function notifyAdvertisers() {
  advertiserListeners.forEach((cb) => cb([...liveAdvertisers]));
}

/** Keep mock demo bookings visible until Firestore has its own data for today */
function mergeBookings(fromFirestore: AdBooking[]): AdBooking[] {
  if (fromFirestore.length === 0) return dedupeBookings([...mockAdBookings]);
  const ids = new Set(fromFirestore.map((b) => b.id));
  const extras = mockAdBookings.filter((b) => !ids.has(b.id));
  return dedupeBookings([...fromFirestore, ...extras]);
}

export function getLiveBookings(): AdBooking[] {
  return [...liveBookings];
}

export function getLiveAdvertiser(advertiserId: string): Advertiser | undefined {
  return liveAdvertisers.find((a) => a.id === advertiserId);
}

export async function upgradeClientPlan(
  advertiserId: string,
  plan: SubscriptionPlan
): Promise<Advertiser> {
  const existing = liveAdvertisers.find((a) => a.id === advertiserId);
  if (!existing) throw new Error("Client not found");

  const definition = PLAN_DEFINITIONS[plan];
  const updated = normalizeAdvertiser({
    ...existing,
    plan,
    planPrice: definition.price,
    maxAds: definition.maxAds,
  });

  liveAdvertisers = liveAdvertisers.map((a) => (a.id === advertiserId ? updated : a));
  notifyAdvertisers();

  if (isFirebaseConfigured() && app) {
    try {
      await advertiserRepo.update(advertiserId, {
        plan,
        planPrice: definition.price,
        maxAds: definition.maxAds,
      });
    } catch {
      // In-memory update still applies for demo
    }
  }

  return updated;
}

export async function updateClientZones(
  advertiserId: string,
  zoneIds: string[]
): Promise<Advertiser> {
  const existing = liveAdvertisers.find((a) => a.id === advertiserId);
  if (!existing) throw new Error("Client not found");
  if (zoneIds.length === 0) throw new Error("Select at least one zone");

  const updated = normalizeAdvertiser({ ...existing, zoneIds });
  liveAdvertisers = liveAdvertisers.map((a) => (a.id === advertiserId ? updated : a));
  notifyAdvertisers();

  if (isFirebaseConfigured() && app) {
    try {
      await advertiserRepo.update(advertiserId, { zoneIds });
    } catch {
      // In-memory update still applies for demo
    }
  }

  return updated;
}

export function subscribeToBookings(callback: Listener): () => void {
  callback([...liveBookings]);
  bookingListeners.add(callback);

  if (isFirebaseConfigured() && app) {
    const db = getFirestore(app);
    const unsub = onSnapshot(collection(db, COLLECTIONS.adBookings), (snap) => {
      const fromFirestore = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdBooking);
      const merged = mergeBookings(fromFirestore);
      liveBookings = merged;
      notifyBookings();
    });
    return () => {
      bookingListeners.delete(callback);
      unsub();
    };
  }

  return () => bookingListeners.delete(callback);
}

export function subscribeToAdvertisers(callback: AdvertiserListener): () => void {
  callback([...liveAdvertisers]);
  advertiserListeners.add(callback);

  if (isFirebaseConfigured() && app) {
    const db = getFirestore(app);
    const unsub = onSnapshot(collection(db, COLLECTIONS.advertisers), (snap) => {
      const fromFirestore = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Advertiser);
      liveAdvertisers =
        fromFirestore.length > 0
          ? fromFirestore.map((a) => normalizeAdvertiser(a))
          : mockAdvertisers.map((a) => normalizeAdvertiser({ ...a }));
      notifyAdvertisers();
    });
    return () => {
      advertiserListeners.delete(callback);
      unsub();
    };
  }

  return () => advertiserListeners.delete(callback);
}

export async function bookAdSlot(
  input: BookingInput
): Promise<{ success: boolean; booking?: AdBooking; error?: string }> {
  const zone = getZoneById(input.zoneId);
  const screen = getLiveScreens().find((s) => s.id === input.screenId);

  if (!zone) return { success: false, error: "Zone not found" };
  if (!screen) return { success: false, error: "Screen not found" };
  if (screen.zoneId !== input.zoneId) return { success: false, error: "Screen is not in this zone" };

  let client = liveAdvertisers.find((a) => a.id === input.advertiserId);

  if (!client && isFirebaseConfigured() && app) {
    try {
      const db = getFirestore(app);
      const snap = await getDoc(doc(db, COLLECTIONS.advertisers, input.advertiserId));
      if (snap.exists()) {
        client = normalizeAdvertiser({ id: snap.id, ...snap.data() } as Advertiser);
        liveAdvertisers = [
          ...liveAdvertisers.filter((a) => a.id !== client!.id),
          client,
        ];
        notifyAdvertisers();
      }
    } catch {
      // fall through to not-found error
    }
  }

  if (!client) return { success: false, error: "Client account not found" };
  if (client.status !== "active") return { success: false, error: "Client account is not active" };
  if (!client.zoneIds.includes(input.zoneId)) return { success: false, error: "You cannot book in this zone" };
  if (client.activeAds >= client.maxAds) {
    return { success: false, error: `Ad limit reached (${client.maxAds} max). Cancel a booking or contact admin.` };
  }

  const cost = zone.hourlyRate * hourSpan(input.startTime, input.endTime);
  const budgetRemaining = client.budget - client.budgetUsed;

  if (cost > budgetRemaining) {
    return { success: false, error: `Insufficient budget. Need ${cost}, have ${budgetRemaining} remaining.` };
  }

  if (hasBookingConflict(liveBookings, input.screenId, input.date, input.startTime, input.endTime)) {
    return { success: false, error: "This slot was just booked by someone else. Pick another time." };
  }

  const bookingData: Omit<AdBooking, "id"> = {
    ...input,
    cost,
    status: "confirmed",
    createdAt: new Date(),
  };

  if (isFirebaseConfigured() && app) {
    try {
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, COLLECTIONS.adBookings), {
        ...bookingData,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, COLLECTIONS.advertisers, input.advertiserId), {
        budgetUsed: client.budgetUsed + cost,
        activeAds: client.activeAds + 1,
        updatedAt: serverTimestamp(),
      });

      const booking: AdBooking = { id: docRef.id, ...bookingData };
      upsertBooking(booking);
      liveAdvertisers = liveAdvertisers.map((a) =>
        a.id === input.advertiserId
          ? { ...a, budgetUsed: a.budgetUsed + cost, activeAds: a.activeAds + 1 }
          : a
      );
      notifyAdvertisers();
      return { success: true, booking };
    } catch (err) {
      console.error("Firebase booking failed:", err);
      return { success: false, error: "Failed to save booking. Please try again." };
    }
  }

  const booking: AdBooking = {
    id: `book-${Date.now()}`,
    ...bookingData,
  };

  upsertBooking(booking);
  liveAdvertisers = liveAdvertisers.map((a) =>
    a.id === input.advertiserId
      ? { ...a, budgetUsed: a.budgetUsed + cost, activeAds: a.activeAds + 1 }
      : a
  );

  notifyAdvertisers();

  try {
    await advertiserRepo.update(input.advertiserId, {
      budgetUsed: client.budgetUsed + cost,
      activeAds: client.activeAds + 1,
    } as Partial<Advertiser>);
  } catch {
    // mock repo sync optional
  }

  return { success: true, booking };
}

function hourSpan(start: string, end: string): number {
  const [sh] = start.split(":").map(Number);
  const [eh] = end.split(":").map(Number);
  return Math.max(1, eh - sh);
}

export async function cancelBooking(
  bookingId: string,
  advertiserId: string
): Promise<{ success: boolean; error?: string }> {
  const booking = liveBookings.find((b) => b.id === bookingId);
  if (!booking) return { success: false, error: "Booking not found" };
  if (booking.advertiserId !== advertiserId) return { success: false, error: "Not your booking" };
  if (booking.status === "cancelled") return { success: false, error: "Already cancelled" };

  if (isFirebaseConfigured() && app) {
    try {
      const db = getFirestore(app);
      await updateDoc(doc(db, COLLECTIONS.adBookings, bookingId), { status: "cancelled" });
      const client = liveAdvertisers.find((a) => a.id === advertiserId);
      if (client) {
        await updateDoc(doc(db, COLLECTIONS.advertisers, advertiserId), {
          budgetUsed: Math.max(0, client.budgetUsed - booking.cost),
          activeAds: Math.max(0, client.activeAds - 1),
        });
      }
      setLiveBookings(
        liveBookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" as const } : b
        )
      );
      liveAdvertisers = liveAdvertisers.map((a) =>
        a.id === advertiserId
          ? {
              ...a,
              budgetUsed: Math.max(0, a.budgetUsed - booking.cost),
              activeAds: Math.max(0, a.activeAds - 1),
            }
          : a
      );
      notifyAdvertisers();
      return { success: true };
    } catch {
      return { success: false, error: "Failed to cancel booking" };
    }
  }

  setLiveBookings(
    liveBookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled" as const } : b
    )
  );
  liveAdvertisers = liveAdvertisers.map((a) =>
    a.id === advertiserId
      ? {
          ...a,
          budgetUsed: Math.max(0, a.budgetUsed - booking.cost),
          activeAds: Math.max(0, a.activeAds - 1),
        }
      : a
  );

  notifyAdvertisers();
  return { success: true };
}
