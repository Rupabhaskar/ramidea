import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCampaigns } from "@/lib/mock-data";

export default async function EditCampaignPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const campaign = mockCampaigns.find((c) => c.id === campaignId) ?? mockCampaigns[0];

  return (
    <div>
      <PageHeader title="Edit Campaign" breadcrumbs={[{ label: "Campaigns", href: "/portal/campaigns" }, { label: campaign.name, href: `/portal/campaigns/${campaign.id}` }, { label: "Edit" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Name</Label><Input defaultValue={campaign.name} className="mt-1.5" /></div>
          <div><Label>Priority</Label><Input type="number" defaultValue={campaign.priority} className="mt-1.5" /></div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
