import { mockScreens, mockZones, mockScreenGroups } from "@/lib/mock-data";
import { generatePairingCode } from "@/lib/utils";
import type { Screen, ScreenGroup, Zone } from "@/types";

type ScreenListener = (screens: Screen[]) => void;
type ZoneListener = (zones: Zone[]) => void;
type GroupListener = (groups: ScreenGroup[]) => void;

let liveScreens: Screen[] = mockScreens.map((s) => ({ ...s }));
let liveZones: Zone[] = mockZones.map((z) => ({ ...z }));
let liveGroups: ScreenGroup[] = mockScreenGroups.map((g) => ({ ...g }));

const screenListeners = new Set<ScreenListener>();
const zoneListeners = new Set<ZoneListener>();
const groupListeners = new Set<GroupListener>();

function notifyScreens() {
  screenListeners.forEach((cb) => cb([...liveScreens]));
}

function notifyZones() {
  zoneListeners.forEach((cb) => cb([...liveZones]));
}

function notifyGroups() {
  groupListeners.forEach((cb) => cb([...liveGroups]));
}

function syncZoneScreenIds() {
  liveZones = liveZones.map((zone) => ({
    ...zone,
    screenIds: liveScreens.filter((s) => s.zoneId === zone.id).map((s) => s.id),
  }));
}

export function getLiveScreens(): Screen[] {
  return [...liveScreens];
}

export function getLiveZones(): Zone[] {
  return [...liveZones];
}

export function getLiveScreenGroups(): ScreenGroup[] {
  return [...liveGroups];
}

export function getZoneById(zoneId: string): Zone | undefined {
  return liveZones.find((z) => z.id === zoneId);
}

export function getZoneName(zoneId: string): string {
  return getZoneById(zoneId)?.name ?? zoneId;
}

export function subscribeToScreens(callback: ScreenListener): () => void {
  callback([...liveScreens]);
  screenListeners.add(callback);
  return () => screenListeners.delete(callback);
}

export function subscribeToZones(callback: ZoneListener): () => void {
  callback([...liveZones]);
  zoneListeners.add(callback);
  return () => zoneListeners.delete(callback);
}

export function subscribeToScreenGroups(callback: GroupListener): () => void {
  callback([...liveGroups]);
  groupListeners.add(callback);
  return () => groupListeners.delete(callback);
}

export type CreateZoneInput = {
  name: string;
  city: string;
  description?: string;
  hourlyRate: number;
};

export async function createZone(input: CreateZoneInput): Promise<Zone> {
  const zone: Zone = {
    id: `zone-${Date.now()}`,
    name: input.name.trim(),
    city: input.city.trim(),
    description: input.description?.trim(),
    screenIds: [],
    hourlyRate: input.hourlyRate,
    createdAt: new Date(),
  };
  liveZones = [...liveZones, zone];
  notifyZones();
  return zone;
}

export type CreateScreenInput = {
  name: string;
  location: string;
  city: string;
  zoneId: string;
  pairingCode?: string;
  resolution?: string;
};

export async function createScreen(input: CreateScreenInput): Promise<Screen> {
  const zone = getZoneById(input.zoneId);
  if (!zone) throw new Error("Zone not found");

  const screen: Screen = {
    id: `scr-${Date.now()}`,
    name: input.name.trim(),
    pairingCode: (input.pairingCode?.trim().toUpperCase() || generatePairingCode()),
    location: input.location.trim(),
    city: input.city.trim() || zone.city,
    zoneId: input.zoneId,
    status: "offline",
    resolution: input.resolution ?? "1920x1080",
    lastSeen: new Date(),
    createdAt: new Date(),
  };

  liveScreens = [...liveScreens, screen];
  syncZoneScreenIds();
  notifyScreens();
  notifyZones();
  return screen;
}

export async function pairScreenByCode(
  pairingCode: string,
  name: string,
  location: string,
  zoneId: string,
  resolution = "1920x1080"
): Promise<Screen> {
  const existing = liveScreens.find(
    (s) => s.pairingCode.toUpperCase() === pairingCode.toUpperCase()
  );
  if (existing) {
    liveScreens = liveScreens.map((s) =>
      s.id === existing.id
        ? {
            ...s,
            name,
            location,
            zoneId,
            resolution,
            status: "online" as const,
            lastSeen: new Date(),
          }
        : s
    );
    syncZoneScreenIds();
    notifyScreens();
    notifyZones();
    return liveScreens.find((s) => s.id === existing.id)!;
  }
  return createScreen({
    name,
    location,
    city: getZoneById(zoneId)?.city ?? "",
    zoneId,
    pairingCode,
    resolution,
  });
}

export type CreateGroupInput = {
  name: string;
  description?: string;
  screenIds: string[];
};

export function getScreenGroupById(groupId: string): ScreenGroup | undefined {
  return liveGroups.find((g) => g.id === groupId);
}

export async function updateScreenGroup(
  groupId: string,
  input: CreateGroupInput
): Promise<ScreenGroup> {
  const existing = liveGroups.find((g) => g.id === groupId);
  if (!existing) throw new Error("Group not found");

  const updated: ScreenGroup = {
    ...existing,
    name: input.name.trim(),
    description: input.description?.trim(),
    screenIds: input.screenIds,
  };
  liveGroups = liveGroups.map((g) => (g.id === groupId ? updated : g));
  notifyGroups();
  return updated;
}

export async function deleteScreenGroup(groupId: string): Promise<void> {
  liveGroups = liveGroups.filter((g) => g.id !== groupId);
  notifyGroups();
}

export async function createScreenGroup(input: CreateGroupInput): Promise<ScreenGroup> {
  const group: ScreenGroup = {
    id: `grp-${Date.now()}`,
    name: input.name.trim(),
    description: input.description?.trim(),
    screenIds: input.screenIds,
    createdAt: new Date(),
  };
  liveGroups = [...liveGroups, group];
  notifyGroups();
  return group;
}

export async function assignPlaylistToZone(
  zoneId: string,
  playlistId: string | null
): Promise<void> {
  const zone = liveZones.find((z) => z.id === zoneId);
  if (!zone) throw new Error("Zone not found");

  liveZones = liveZones.map((z) =>
    z.id === zoneId ? { ...z, playlistId: playlistId ?? undefined } : z
  );
  liveScreens = liveScreens.map((s) =>
    s.zoneId === zoneId
      ? { ...s, currentPlaylistId: playlistId ?? undefined }
      : s
  );
  notifyZones();
  notifyScreens();
}

export async function assignPlaylistToGroup(
  groupId: string,
  playlistId: string | null
): Promise<void> {
  const group = liveGroups.find((g) => g.id === groupId);
  if (!group) throw new Error("Group not found");

  const screenIdSet = new Set(group.screenIds);
  liveGroups = liveGroups.map((g) =>
    g.id === groupId ? { ...g, playlistId: playlistId ?? undefined } : g
  );
  liveScreens = liveScreens.map((s) =>
    screenIdSet.has(s.id)
      ? { ...s, currentPlaylistId: playlistId ?? undefined }
      : s
  );
  notifyGroups();
  notifyScreens();
}

export function getScreenManagementSummary() {
  const online = liveScreens.filter((s) => s.status === "online").length;
  return {
    totalScreens: liveScreens.length,
    onlineScreens: online,
    offlineScreens: liveScreens.length - online,
    totalZones: liveZones.length,
    totalGroups: liveGroups.length,
  };
}
