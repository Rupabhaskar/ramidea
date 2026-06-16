import { PageHeader } from "@/components/layout/page-header";
import { CampaignBuilder } from "@/components/campaigns/campaign-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateCampaignPage() {
  return (
    <div>
      <PageHeader title="Create Campaign" breadcrumbs={[{ label: "Campaigns", href: "/portal/campaigns" }, { label: "Create" }]} />
      <CampaignBuilder>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div><Label>Campaign Name</Label><Input placeholder="Summer Sale 2026" className="mt-1.5" /></div>
            <div><Label>Description</Label><Input placeholder="Campaign description" className="mt-1.5" /></div>
            <div><Label>Advertiser</Label>
              <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select advertiser" /></SelectTrigger>
                <SelectContent><SelectItem value="adv-1">Heritage Foods Ltd.</SelectItem><SelectItem value="adv-2">AP Tourism Development</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Start Date</Label><Input type="date" className="mt-1.5" /></div>
              <div><Label>End Date</Label><Input type="date" className="mt-1.5" /></div>
            </div>
            <div><Label>Priority</Label><Input type="number" defaultValue={1} className="mt-1.5" /></div>
            <Button>Create Campaign</Button>
          </CardContent>
        </Card>
      </CampaignBuilder>
    </div>
  );
}
