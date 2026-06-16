"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { ClientBudgetCard } from "@/components/client/client-budget-card";
import { ClientAccountGate } from "@/components/client/client-account-gate";
import { Button } from "@/components/ui/button";
import { useClientAccount } from "@/hooks/use-bookings";
import { getCampaignsForAdvertiser } from "@/lib/client-data";

export default function ClientAdsPage() {
  const { client, loading, error } = useClientAccount();

  return (
    <ClientAccountGate loading={loading} error={error}>
      {client && <AdsContent client={client} />}
    </ClientAccountGate>
  );
}

function AdsContent({ client }: { client: NonNullable<ReturnType<typeof useClientAccount>["client"]> }) {
  const campaigns = getCampaignsForAdvertiser(client.id);
  const canCreate = client.activeAds < client.maxAds;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Ads"
        description={`${client.activeAds} of ${client.maxAds} ads running`}
        breadcrumbs={[{ label: "Client", href: "/client/dashboard" }, { label: "My Ads" }]}
        actions={
          canCreate ? (
            <Button size="sm" asChild>
              <Link href="/client/ads/create"><Plus className="h-4 w-4 mr-2" />Create Ad</Link>
            </Button>
          ) : (
            <Button size="sm" disabled>Ad limit reached</Button>
          )
        }
      />
      <ClientBudgetCard client={client} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
}
