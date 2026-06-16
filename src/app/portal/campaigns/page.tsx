import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Button } from "@/components/ui/button";
import { mockCampaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader
        title="Campaigns"
        description="Create and manage advertisement campaigns"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Campaigns" }]}
        actions={
          <Button size="sm" asChild>
            <Link href="/portal/campaigns/create"><Plus className="h-4 w-4 mr-2" />Create Campaign</Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCampaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
      </div>
    </div>
  );
}
