"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SlotBookingCalendar } from "@/components/client/slot-booking-calendar";
import { ClientBudgetCard } from "@/components/client/client-budget-card";
import { ClientAccountGate } from "@/components/client/client-account-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBookings, useClientAccount } from "@/hooks/use-bookings";
import { bookAdSlot, cancelBooking } from "@/services/booking-service";
import { getZonesForClient, getScreensForClient } from "@/lib/client-data";
import { normalizeAdvertiser } from "@/lib/client-account";
import { mockScreens, mockZones } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const statusVariant: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
  completed: "default",
};

export default function ClientSchedulePage() {
  const { client, loading, error } = useClientAccount();
  const { bookings, loading: bookingsLoading } = useBookings();

  return (
    <ClientAccountGate loading={loading || bookingsLoading} error={error}>
      {client && (
        <ScheduleContent client={normalizeAdvertiser(client)} bookings={bookings} />
      )}
    </ClientAccountGate>
  );
}

function ScheduleContent({
  client,
  bookings,
}: {
  client: ReturnType<typeof normalizeAdvertiser>;
  bookings: ReturnType<typeof useBookings>["bookings"];
}) {
  const zones = getZonesForClient(client.id);
  const screens = getScreensForClient(client.id);
  const budgetRemaining = client.budget - client.budgetUsed;
  const myBookings = useMemo(() => {
    const seen = new Set<string>();
    return bookings
      .filter((b) => b.advertiserId === client.id && b.status !== "cancelled")
      .filter((b) => {
        if (seen.has(b.id)) return false;
        seen.add(b.id);
        return true;
      })
      .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));
  }, [bookings, client.id]);

  const handleBook = async (input: Parameters<typeof bookAdSlot>[0]) => {
    const result = await bookAdSlot(input);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true };
  };

  const handleCancel = async (bookingId: string) => {
    const result = await cancelBooking(bookingId, client.id);
    if (result.success) toast.success("Booking cancelled — budget refunded");
    else toast.error(result.error);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Book Time Slots"
        description="View other clients' ads, free slots, and book by zone and screen"
        breadcrumbs={[{ label: "Client", href: "/client/dashboard" }, { label: "Book Slots" }]}
      />

      <ClientBudgetCard client={client} />

      <SlotBookingCalendar
        zones={zones.length > 0 ? zones : mockZones}
        screens={screens.length > 0 ? screens : mockScreens}
        bookings={bookings}
        currentAdvertiserId={client.id}
        allowedZoneIds={client.zoneIds}
        budgetRemaining={budgetRemaining}
        onBook={handleBook}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Booked Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {myBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet. Click a free slot above.</p>
          ) : (
            <div className="space-y-2">
              {myBookings.map((b) => {
                const screen = mockScreens.find((s) => s.id === b.screenId);
                const zone = mockZones.find((z) => z.id === b.zoneId);
                return (
                  <div
                    key={b.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {zone?.name} · {screen?.name} · {b.date} {b.startTime}–{b.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatCurrency(b.cost)}</span>
                      <Badge variant={statusVariant[b.status] ?? "secondary"} className="capitalize">
                        {b.status}
                      </Badge>
                      {b.status === "confirmed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-7 text-xs"
                          onClick={() => handleCancel(b.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
