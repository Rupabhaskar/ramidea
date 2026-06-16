import { doc, getDoc, setDoc, getDocs, collection, query, where, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/constants";
import { mockAdvertisers } from "@/lib/mock-data";
import { normalizeAdvertiser, DEFAULT_ZONE_IDS } from "@/lib/client-account";
import { getLiveAdvertiser } from "@/services/booking-service";
import type { User, Advertiser } from "@/types";

function findAdvertiserByEmail(email: string): Advertiser | undefined {
  const normalized = email.toLowerCase();
  return mockAdvertisers.find((a) => a.email.toLowerCase() === normalized);
}

/** Resolve which advertiserId a client user should use */
export async function resolveAdvertiserId(user: User): Promise<string | null> {
  if (user.advertiserId) {
    const existing = getLiveAdvertiser(user.advertiserId);
    if (existing) return user.advertiserId;
  }

  const byEmail = findAdvertiserByEmail(user.email);
  if (byEmail) {
    await linkUserToAdvertiser(user.id, byEmail.id);
    return byEmail.id;
  }

  if (!isFirebaseConfigured() || !db) {
    return mockAdvertisers[0]?.id ?? null;
  }

  try {
    const q = query(collection(db, COLLECTIONS.advertisers), where("email", "==", user.email));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const advertiserId = snap.docs[0].id;
      await linkUserToAdvertiser(user.id, advertiserId);
      return advertiserId;
    }

    const advertiserId = await createAdvertiserForUser(user);
    await linkUserToAdvertiser(user.id, advertiserId);
    return advertiserId;
  } catch (err) {
    console.error("resolveAdvertiserId failed:", err);
    return mockAdvertisers[0]?.id ?? null;
  }
}

async function linkUserToAdvertiser(userId: string, advertiserId: string) {
  if (!db) return;
  await setDoc(
    doc(db, COLLECTIONS.users, userId),
    { advertiserId, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

async function createAdvertiserForUser(user: User): Promise<string> {
  if (!db) return mockAdvertisers[0].id;

  const advertiserData: Omit<Advertiser, "id"> = {
    companyName: user.name || "My Company",
    contactName: user.name || "Contact",
    email: user.email,
    phone: "",
    address: "",
    plan: "starter",
    planPrice: 7999,
    nextPaymentDue: new Date(Date.now() + 30 * 86400000),
    budget: 1000000,
    budgetUsed: 0,
    maxAds: 5,
    activeAds: 0,
    zoneIds: DEFAULT_ZONE_IDS,
    status: "active",
  };

  const ref = doc(collection(db, COLLECTIONS.advertisers));
  await setDoc(ref, { ...advertiserData, createdAt: serverTimestamp() });
  return ref.id;
}

export async function getOrCreateClientAccount(user: User): Promise<Advertiser | null> {
  const advertiserId = await resolveAdvertiserId(user);
  if (!advertiserId) return null;

  let client = getLiveAdvertiser(advertiserId);
  if (client) return normalizeAdvertiser(client);

  const mockMatch = mockAdvertisers.find((a) => a.id === advertiserId);
  if (mockMatch) return normalizeAdvertiser(mockMatch);

  if (db) {
    const snap = await getDoc(doc(db, COLLECTIONS.advertisers, advertiserId));
    if (snap.exists()) return normalizeAdvertiser({ id: snap.id, ...snap.data() } as Advertiser);
  }

  const byEmail = findAdvertiserByEmail(user.email);
  return byEmail ? normalizeAdvertiser(byEmail) : null;
}
