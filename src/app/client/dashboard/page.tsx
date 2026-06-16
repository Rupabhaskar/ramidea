"use client";

import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ClientBudgetCard } from "@/components/client/client-budget-card";
import { ClientAccountGate } from "@/components/client/client-account-gate";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookings, useClientAccount } from "@/hooks/use-bookings";
import { getCampaignsForAdvertiser } from "@/lib/client-data";
import { mockScreens, mockZones } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ClientDashboardPage() {
  const { client, loading, error } = useClientAccount();
  const { bookings } = useBookings();

  return (
    <ClientAccountGate loading={loading} error={error}>
      {client && (
        <DashboardContent client={client} bookings={bookings} />
      )}
    </ClientAccountGate>
  );
}

function DashboardContent({
  client,
  bookings,
}: {
  client: NonNullable<ReturnType<typeof useClientAccount>["client"]>;
  bookings: ReturnType<typeof useBookings>["bookings"];
}) {
  const campaigns = getCampaignsForAdvertiser(client.id);
  const upcomingBookings = bookings
    .filter((b) => b.advertiserId === client.id && b.status === "confirmed")
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${client.companyName}`}
        description="Manage your ads, book time slots, and track your budget"
        breadcrumbs={[{ label: "Client", href: "/client" }, { label: "Dashboard" }]}
        actions={
          <Button size="sm" asChild>
            <Link href="/client/schedule"><Calendar className="h-4 w-4 mr-2" />Book Slots</Link>
          </Button>
        }
      />

      <ClientBudgetCard client={client} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Active Ads</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/client/ads/create"><Plus className="h-4 w-4 mr-1" />New</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ads yet.</p>
            ) : (
              campaigns.map((c) => <CampaignCard key={c.id} campaign={c} />)
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming slots.</p>
            ) : (
              upcomingBookings.map((b) => {
                const screen = mockScreens.find((s) => s.id === b.screenId);
                const zone = mockZones.find((z) => z.id === b.zoneId);
                return (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{zone?.name} · {screen?.name}</p>
                      <p className="text-xs text-muted-foreground">{b.date} · {b.startTime}–{b.endTime}</p>
                    </div>
                    <Badge variant="success">{formatCurrency(b.cost)}</Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
