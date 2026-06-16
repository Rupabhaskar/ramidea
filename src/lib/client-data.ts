import { getLiveAdvertiser } from "@/services/booking-service";
import { getLiveScreens, getLiveZones } from "@/services/screen-management-service";
import { normalizeAdvertiser } from "@/lib/client-account";
import { mockCampaigns } from "@/lib/mock-data";
import type { Campaign } from "@/types";

function getClient(advertiserId: string) {
  const client = getLiveAdvertiser(advertiserId);
  return client ? normalizeAdvertiser(client) : undefined;
}

export function getCampaignsForAdvertiser(advertiserId: string): Campaign[] {
  return mockCampaigns.filter((c) => c.advertiserId === advertiserId);
}

export function getZonesForClient(advertiserId: string) {
  const client = getClient(advertiserId);
  if (!client) return [];
  return getLiveZones().filter((z) => client.zoneIds.includes(z.id));
}

export function getScreensForClient(advertiserId: string) {
  const client = getClient(advertiserId);
  if (!client) return [];
  return getLiveScreens().filter((s) => s.zoneId && client.zoneIds.includes(s.zoneId));
}
