import { FirestoreRepository } from "@/services/firestore-repository";
import { COLLECTIONS } from "@/lib/constants";
import { mockScreens, mockAdvertisers, mockNotifications } from "@/lib/mock-data";
import type { Screen, Advertiser, Notification, PlayerCommand } from "@/types";
import { generatePairingCode, toDate } from "@/lib/utils";
import { orderBy, where } from "firebase/firestore";

export const screenRepo = new FirestoreRepository<Screen>(
  COLLECTIONS.screens,
  [...mockScreens]
);

export const advertiserRepo = new FirestoreRepository<Advertiser>(
  COLLECTIONS.advertisers,
  [...mockAdvertisers]
);

export const notificationRepo = new FirestoreRepository<Notification>(
  COLLECTIONS.notifications,
  [...mockNotifications]
);

export const playerCommandRepo = new FirestoreRepository<PlayerCommand & { id: string }>(
  COLLECTIONS.playerCommands,
  []
);

export async function pairScreen(pairingCode: string, name: string, location: string) {
  const screens = await screenRepo.getAll([where("pairingCode", "==", pairingCode)]);
  if (screens.length > 0) {
    await screenRepo.update(screens[0].id, { name, location, status: "online" });
    return screens[0];
  }

  return screenRepo.create({
    name,
    pairingCode,
    location,
    status: "offline",
    resolution: "1920x1080",
    lastSeen: new Date(),
    createdAt: new Date(),
  } as Omit<Screen, "id">);
}

export async function registerPlayerDevice() {
  const pairingCode = generatePairingCode();
  return screenRepo.create({
    name: "Unpaired Device",
    pairingCode,
    location: "Pending",
    status: "offline",
    resolution: "1920x1080",
    lastSeen: new Date(),
    createdAt: new Date(),
  } as Omit<Screen, "id">);
}

export function subscribeToScreens(callback: (screens: Screen[]) => void) {
  return screenRepo.subscribe(callback, [orderBy("lastSeen", "desc")]);
}

export function subscribeToNotifications(userId: string, callback: (n: Notification[]) => void) {
  return notificationRepo.subscribe(
    (notifications) => {
      const sorted = [...notifications].sort(
        (a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime()
      );
      callback(sorted);
    },
    [where("userId", "==", userId)]
  );
}

export async function sendPlayerCommand(
  screenId: string,
  action: PlayerCommand["action"],
  value?: number
) {
  return playerCommandRepo.create({
    screenId,
    action,
    value,
    timestamp: new Date(),
  } as Omit<PlayerCommand & { id: string }, "id">);
}
