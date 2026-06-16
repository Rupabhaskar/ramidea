import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { mockCampaigns } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default async function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const campaign = mockCampaigns.find((c) => c.id === campaignId) ?? mockCampaigns[0];

  return (
    <div>
      <PageHeader
        title={campaign.name}
        breadcrumbs={[{ label: "Campaigns", href: "/portal/campaigns" }, { label: campaign.name }]}
        actions={<StatusBadge status={campaign.status} />}
      />
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="screens">Assigned Screens</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card><CardContent className="p-6 space-y-3">
            <p className="text-muted-foreground">{campaign.description}</p>
            <p><span className="text-muted-foreground">Period: </span>{formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}</p>
            <p><span className="text-muted-foreground">Priority: </span>{campaign.priority}</p>
            <p><span className="text-muted-foreground">Screens: </span>{campaign.screenIds.length}</p>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="ads"><p className="text-muted-foreground">Campaign ads and media.</p></TabsContent>
        <TabsContent value="schedule"><p className="text-muted-foreground">Campaign schedule configuration.</p></TabsContent>
        <TabsContent value="analytics"><p className="text-muted-foreground">Campaign performance analytics.</p></TabsContent>
        <TabsContent value="screens"><p className="text-muted-foreground">{campaign.screenIds.length} screens assigned.</p></TabsContent>
      </Tabs>
    </div>
  );
}
