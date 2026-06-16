"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, formatCurrency } from "@/lib/utils";
import { slotCoversHour } from "@/lib/booking-utils";
import type { AdBooking, Screen, Zone } from "@/types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8);

type BookInput = Omit<AdBooking, "id" | "createdAt" | "status" | "cost">;

interface SlotBookingCalendarProps {
  zones: Zone[];
  screens: Screen[];
  bookings: AdBooking[];
  currentAdvertiserId: string;
  allowedZoneIds: string[];
  budgetRemaining: number;
  onBook?: (booking: BookInput) => Promise<{ success: boolean; error?: string }>;
  readOnly?: boolean;
}

export function SlotBookingCalendar({
  zones,
  screens,
  bookings,
  currentAdvertiserId,
  allowedZoneIds,
  budgetRemaining,
  onBook,
  readOnly = false,
}: SlotBookingCalendarProps) {
  const allowedZones = useMemo(
    () => zones.filter((z) => allowedZoneIds.includes(z.id)),
    [zones, allowedZoneIds]
  );

  const [selectedZone, setSelectedZone] = useState("");
  const [selectedScreen, setSelectedScreen] = useState<string>("all");
  const [bookingKey, setBookingKey] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    if (allowedZones.length === 0) return;
    setSelectedZone((prev) =>
      prev && allowedZoneIds.includes(prev) ? prev : allowedZones[0].id
    );
  }, [allowedZones, allowedZoneIds]);

  useEffect(() => {
    setSelectedScreen("all");
  }, [selectedZone]);

  const zone = allowedZones.find((z) => z.id === selectedZone);

  const screensInZone = useMemo(
    () => screens.filter((s) => s.zoneId === selectedZone),
    [screens, selectedZone]
  );

  const visibleScreens = useMemo(
    () =>
      selectedScreen === "all"
        ? screensInZone
        : screensInZone.filter((s) => s.id === selectedScreen),
    [screensInZone, selectedScreen]
  );

  const zoneBookings = bookings.filter(
    (b) => b.zoneId === selectedZone && b.date === today && b.status !== "cancelled"
  );

  function getSlotBooking(screenId: string, hour: number) {
    return zoneBookings.find(
      (b) => b.screenId === screenId && slotCoversHour(b.startTime, b.endTime, hour)
    );
  }

  function isSlotFree(screenId: string, hour: number) {
    return !getSlotBooking(screenId, hour);
  }

  async function handleBookSlot(screenId: string, hour: number) {
    if (readOnly || !onBook || !zone) return;

    const slotKey = `${screenId}-${hour}`;
    setBookingKey(slotKey);

    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

    if (zone.hourlyRate > budgetRemaining) {
      toast.error("Insufficient budget for this slot");
      setBookingKey(null);
      return;
    }

    const screen = screens.find((s) => s.id === screenId);
    const result = await onBook({
      advertiserId: currentAdvertiserId,
      title: `Ad — ${screen?.name ?? "Screen"} ${startTime}`,
      screenId,
      zoneId: selectedZone,
      date: today,
      startTime,
      endTime,
      createdBy: "client",
    });

    setBookingKey(null);

    if (result.success) {
      toast.success(`Slot confirmed ${startTime}–${endTime} · ${formatCurrency(zone.hourlyRate)}`);
    } else {
      toast.error(result.error ?? "Booking failed");
    }
  }

  if (allowedZones.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No zones assigned to your account. Contact your administrator to enable slot booking.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Slot Availability</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMM d")} — click free slots to book
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              {allowedZones.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.name} ({formatCurrency(z.hourlyRate)}/hr)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedScreen} onValueChange={setSelectedScreen}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Screen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Screens</SelectItem>
              {screensInZone.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-primary/20 border border-primary/40" /> My ads
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-muted border border-border" /> Other clients
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-success/20 border border-success/40" /> Free slot
          </span>
          {zone && (
            <span className="ml-auto text-muted-foreground">
              {formatCurrency(zone.hourlyRate)}/hr · {visibleScreens.length} screen
              {visibleScreens.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {visibleScreens.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No screens in this zone yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div
              className="grid min-w-[700px]"
              style={{ gridTemplateColumns: `140px repeat(${HOURS.length}, 1fr)` }}
            >
              <div className="p-2 text-xs font-medium text-muted-foreground border-b border-border">
                Screen
              </div>
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="p-1 text-center text-[10px] text-muted-foreground border-b border-border"
                >
                  {h}:00
                </div>
              ))}
              {visibleScreens.map((screen) => (
                <div key={screen.id} className="contents">
                  <div className="p-2 text-xs font-medium border-b border-r border-border truncate">
                    {screen.name}
                  </div>
                  {HOURS.map((hour) => {
                    const booking = getSlotBooking(screen.id, hour);
                    const isMine = booking?.advertiserId === currentAdvertiserId;
                    const isFree = isSlotFree(screen.id, hour);
                    const slotKey = `${screen.id}-${hour}`;
                    const isLoading = bookingKey === slotKey;

                    return (
                      <button
                        key={slotKey}
                        type="button"
                        disabled={readOnly || !isFree || isLoading}
                        onClick={() => isFree && handleBookSlot(screen.id, hour)}
                        className={cn(
                          "min-h-[36px] border-b border-r border-border p-0.5 transition-colors relative",
                          isFree && !readOnly && "hover:bg-success/20 cursor-pointer bg-success/10",
                          isFree && readOnly && "bg-success/10",
                          booking && isMine && "bg-primary/20",
                          booking && !isMine && "bg-muted",
                          !isFree && !readOnly && "cursor-default"
                        )}
                        title={
                          booking
                            ? `${booking.title} (${booking.startTime}–${booking.endTime})`
                            : `Book ${hour}:00 — ${formatCurrency(zone?.hourlyRate ?? 0)}`
                        }
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin mx-auto text-primary" />
                        ) : booking ? (
                          <span className="block text-[9px] truncate px-0.5 text-foreground/80">
                            {isMine ? "Mine" : "Booked"}
                          </span>
                        ) : (
                          <span className="block text-[9px] text-success/70">Free</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {!readOnly && (
          <p className="text-xs text-muted-foreground mt-4">
            Budget remaining: <strong>{formatCurrency(budgetRemaining)}</strong>
            {" · "}Ads: <strong>{budgetRemaining > 0 ? "click a green slot" : "top up budget"}</strong>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
