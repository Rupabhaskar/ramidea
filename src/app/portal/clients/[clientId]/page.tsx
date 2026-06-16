import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ClientBudgetCard } from "@/components/client/client-budget-card";
import { SlotBookingCalendar } from "@/components/client/slot-booking-calendar";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockAdvertisers,
  mockCampaigns,
  mockAdBookings,
  mockZones,
  mockScreens,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const client = mockAdvertisers.find((a) => a.id === clientId) ?? mockAdvertisers[0];
  const campaigns = mockCampaigns.filter((c) => c.advertiserId === client.id);
  const bookings = mockAdBookings.filter((b) => b.advertiserId === client.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title={client.companyName}
        description={`${client.contactName} · ${client.email}`}
        breadcrumbs={[{ label: "Clients", href: "/portal/clients" }, { label: client.companyName }]}
        actions={
          <Button size="sm" asChild>
            <Link href={`/portal/clients/${client.id}/ads/create`}>
              <Plus className="h-4 w-4 mr-2" />Create Ad for Client
            </Link>
          </Button>
        }
      />

      <ClientBudgetCard client={client} />

      <Tabs defaultValue="ads">
        <TabsList>
          <TabsTrigger value="ads">Ads & Campaigns</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Slots</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="ads" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <SlotBookingCalendar
            zones={mockZones}
            screens={mockScreens}
            bookings={mockAdBookings}
            currentAdvertiserId={client.id}
            allowedZoneIds={client.zoneIds}
            budgetRemaining={client.budget - client.budgetUsed}
            readOnly
          />
          <Card className="mt-4">
            <CardHeader><CardTitle className="text-base">Client Bookings</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="flex justify-between text-sm border border-border rounded-lg p-3">
                  <span>{b.title} — {b.date} {b.startTime}–{b.endTime}</span>
                  <span>{formatCurrency(b.cost)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones">
          <div className="grid gap-3 md:grid-cols-2">
            {mockZones
              .filter((z) => client.zoneIds.includes(z.id))
              .map((z) => (
                <Card key={z.id}>
                  <CardContent className="p-4">
                    <p className="font-medium">{z.name}</p>
                    <p className="text-sm text-muted-foreground">{z.city} · {z.screenIds.length} screens</p>
                    <Badge variant="outline" className="mt-2">{formatCurrency(z.hourlyRate)}/hr</Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="p-6 space-y-2 text-sm">
              <p><span className="text-muted-foreground">Total Budget:</span> {formatCurrency(client.budget)}</p>
              <p><span className="text-muted-foreground">Used:</span> {formatCurrency(client.budgetUsed)}</p>
              <p><span className="text-muted-foreground">Remaining:</span> {formatCurrency(client.budget - client.budgetUsed)}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
