"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { Advertiser } from "@/types";
import { DollarSign, Megaphone } from "lucide-react";

export function ClientBudgetCard({ client }: { client: Advertiser }) {
  const budgetRemaining = client.budget - client.budgetUsed;
  const budgetPercent = (client.budgetUsed / client.budget) * 100;
  const adsRemaining = client.maxAds - client.activeAds;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget Remaining</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(budgetRemaining)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                of {formatCurrency(client.budget)} total
              </p>
            </div>
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <Progress value={budgetPercent} className="mt-4" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ads Available</p>
              <p className="text-3xl font-bold mt-1">{adsRemaining}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {client.activeAds} of {client.maxAds} running
              </p>
            </div>
            <Megaphone className="h-5 w-5 text-secondary" />
          </div>
          <Progress value={(client.activeAds / client.maxAds) * 100} className="mt-4" indicatorClassName="bg-secondary" />
        </CardContent>
      </Card>
    </div>
  );
}
