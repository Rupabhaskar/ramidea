"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Crown, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  PLAN_DEFINITIONS,
  PLAN_LABELS,
  PLAN_ORDER,
} from "@/lib/constants";
import { upgradeClientPlan } from "@/services/booking-service";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Advertiser, SubscriptionPlan } from "@/types";

function planRank(plan: SubscriptionPlan): number {
  return PLAN_ORDER.indexOf(plan);
}

interface ClientPlanSectionProps {
  client: Advertiser;
}

export function ClientPlanSection({ client }: ClientPlanSectionProps) {
  const [upgrading, setUpgrading] = useState<SubscriptionPlan | null>(null);
  const current = PLAN_DEFINITIONS[client.plan];
  const zonesUsed = client.zoneIds.length;

  const limits = [
    {
      label: "Active ads",
      used: client.activeAds,
      max: client.maxAds,
      format: (v: number) => String(v),
    },
    {
      label: "Zones",
      used: zonesUsed,
      max: current.maxZones,
      format: (v: number) => String(v),
    },
    {
      label: "Ad budget",
      used: client.budgetUsed,
      max: client.budget,
      format: (v: number) => formatCurrency(v),
    },
  ];

  async function handleUpgrade(plan: SubscriptionPlan) {
    if (plan === client.plan) return;
    if (planRank(plan) < planRank(client.plan)) {
      toast.info("Contact your account manager to downgrade your plan");
      return;
    }

    setUpgrading(plan);
    try {
      await upgradeClientPlan(client.id, plan);
      toast.success(`Upgraded to ${PLAN_LABELS[plan]} plan`);
    } catch {
      toast.error("Failed to upgrade plan");
    } finally {
      setUpgrading(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current plan
              </p>
              <CardTitle className="text-2xl mt-1 flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {PLAN_LABELS[client.plan]}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(client.planPrice)}/month
                {client.nextPaymentDue && (
                  <> · Next payment {formatDate(client.nextPaymentDue)}</>
                )}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {client.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium mb-3">Your plan limits</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {limits.map((item) => {
              const pct = item.max > 0 ? Math.min((item.used / item.max) * 100, 100) : 0;
              return (
                <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-semibold mt-1">
                    {item.format(item.used)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {item.format(item.max)}
                    </span>
                  </p>
                  <Progress value={pct} className="mt-3 h-1.5" />
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <LimitStat label="Screens" value={String(current.maxScreens)} />
            <LimitStat
              label="Campaigns"
              value={
                current.maxCampaigns === "unlimited"
                  ? "Unlimited"
                  : String(current.maxCampaigns)
              }
            />
            <LimitStat label="Media storage" value={`${current.mediaStorageGb} GB`} />
            <LimitStat label="Support" value={current.support} />
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Upgrade your plan</h2>
          <p className="text-sm text-muted-foreground">
            Compare limits and upgrade for more ads, zones, and screens
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {PLAN_ORDER.map((planId) => {
            const plan = PLAN_DEFINITIONS[planId];
            const isCurrent = client.plan === planId;
            const isUpgrade = planRank(planId) > planRank(client.plan);
            const isDowngrade = planRank(planId) < planRank(client.plan);

            return (
              <Card
                key={planId}
                className={
                  isCurrent
                    ? "border-primary ring-2 ring-primary/20"
                    : plan.popular
                      ? "border-primary/40"
                      : ""
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{plan.label}</CardTitle>
                    {isCurrent && <Badge>Current</Badge>}
                    {!isCurrent && plan.popular && (
                      <Badge variant="secondary">Popular</Badge>
                    )}
                  </div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(plan.price)}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <PlanLimitRow label="Active ads" value={String(plan.maxAds)} />
                    <PlanLimitRow label="Zones" value={String(plan.maxZones)} />
                    <PlanLimitRow label="Screens" value={String(plan.maxScreens)} />
                    <PlanLimitRow
                      label="Campaigns"
                      value={
                        plan.maxCampaigns === "unlimited"
                          ? "Unlimited"
                          : String(plan.maxCampaigns)
                      }
                    />
                    <PlanLimitRow label="Storage" value={`${plan.mediaStorageGb} GB`} />
                  </ul>

                  <ul className="space-y-1.5 border-t border-border pt-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : isUpgrade ? "default" : "outline"}
                    disabled={isCurrent || upgrading !== null}
                    onClick={() => handleUpgrade(planId)}
                  >
                    {upgrading === planId ? (
                      "Upgrading..."
                    ) : isCurrent ? (
                      "Current plan"
                    ) : isUpgrade ? (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Upgrade
                      </>
                    ) : isDowngrade ? (
                      "Contact to downgrade"
                    ) : (
                      "Select plan"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LimitStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium mt-0.5">{value}</p>
    </div>
  );
}

function PlanLimitRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </li>
  );
}
