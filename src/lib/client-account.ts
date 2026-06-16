import { PLAN_PRICES } from "@/lib/constants";
import { getLiveZones } from "@/services/screen-management-service";
import type { Advertiser, SubscriptionPlan } from "@/types";

export const DEFAULT_ZONE_IDS = ["zone-vizag", "zone-vijayawada", "zone-tirupati"];

function validZoneIds(): Set<string> {
  return new Set(getLiveZones().map((z) => z.id));
}

/** Ensure client has valid AP zone ids and required billing fields */
export function normalizeAdvertiser(advertiser: Advertiser): Advertiser {
  const allowedZoneIds = validZoneIds();
  const rawZoneIds = Array.isArray(advertiser.zoneIds) ? advertiser.zoneIds : [];
  const matched = rawZoneIds.filter((id) => allowedZoneIds.has(id));
  const zoneIds = matched.length > 0 ? matched : DEFAULT_ZONE_IDS;

  const plan = (advertiser.plan ?? "starter") as SubscriptionPlan;
  const planPrice = advertiser.planPrice ?? PLAN_PRICES[plan] ?? PLAN_PRICES.starter;

  return {
    ...advertiser,
    plan,
    planPrice,
    zoneIds,
    budget: advertiser.budget ?? 1_000_000,
    budgetUsed: advertiser.budgetUsed ?? 0,
    maxAds: advertiser.maxAds ?? 5,
    activeAds: advertiser.activeAds ?? 0,
    status: advertiser.status ?? "active",
  };
}
