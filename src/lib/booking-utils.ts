import type { AdBooking } from "@/types";

function timeRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function slotCoversHour(startTime: string, endTime: string, hour: number): boolean {
  const slotStart = `${hour.toString().padStart(2, "0")}:00`;
  const nextHour = `${(hour + 1).toString().padStart(2, "0")}:00`;
  return startTime <= slotStart && endTime > slotStart;
}

export function hasBookingConflict(
  bookings: AdBooking[],
  screenId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: string
): boolean {
  return bookings.some(
    (b) =>
      b.id !== excludeId &&
      b.screenId === screenId &&
      b.date === date &&
      b.status !== "cancelled" &&
      timeRangesOverlap(b.startTime, b.endTime, startTime, endTime)
  );
}
