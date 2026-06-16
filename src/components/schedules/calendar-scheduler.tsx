"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface ScheduleEvent {
  id: string;
  title: string;
  startHour: number;
  endHour: number;
  day: number;
  color?: string;
}

export function CalendarScheduler({ events = [] }: { events?: ScheduleEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Schedule</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border p-0.5">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 text-xs rounded-md capitalize transition-colors",
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === "month" ? (
          <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-muted p-2 text-center text-xs font-medium">{d}</div>
            ))}
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "bg-card p-2 min-h-[80px] text-sm",
                  !isSameMonth(day, currentDate) && "text-muted-foreground/50",
                  isSameDay(day, new Date()) && "ring-2 ring-primary ring-inset"
                )}
              >
                {format(day, "d")}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[700px]">
              <div />
              {days.slice(0, view === "day" ? 1 : 7).map((day) => (
                <div key={day.toISOString()} className="p-2 text-center text-xs font-medium border-b border-border">
                  {format(day, "EEE d")}
                </div>
              ))}
              {HOURS.map((hour) => (
                <div key={hour} className="contents">
                  <div className="p-1 text-xs text-muted-foreground text-right pr-2 border-r border-border">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  {days.slice(0, view === "day" ? 1 : 7).map((day, dayIndex) => {
                    const dayEvents = events.filter((e) => e.day === dayIndex && e.startHour <= hour && e.endHour > hour);
                    return (
                      <div key={`${day}-${hour}`} className="border-b border-r border-border min-h-[40px] p-0.5 relative">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="absolute inset-x-0.5 rounded px-1 py-0.5 text-[10px] text-white truncate"
                            style={{ background: event.color ?? "#2563EB", top: 2, bottom: 2 }}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
