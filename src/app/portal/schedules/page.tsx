"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CalendarScheduler } from "@/components/schedules/calendar-scheduler";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockSchedules, mockCampaigns } from "@/lib/mock-data";

export default function SchedulesPage() {
  const events = mockSchedules.map((s, i) => ({
    id: s.id,
    title: mockCampaigns.find((c) => c.id === s.campaignId)?.name ?? "Campaign",
    startHour: 9,
    endHour: 21,
    day: i % 7,
    color: "#2563EB",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedules"
        description="Manage campaign scheduling across your network"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Schedules" }]}
        actions={
          <Button size="sm" asChild>
            <Link href="/portal/schedules/create"><Plus className="h-4 w-4 mr-2" />Create Schedule</Link>
          </Button>
        }
      />
      <CalendarScheduler events={events} />
      <div className="grid gap-4 md:grid-cols-2">
        {mockSchedules.map((s) => (
          <Link key={s.id} href={`/portal/schedules/${s.id}`}>
            <Card className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <p className="font-medium">{mockCampaigns.find((c) => c.id === s.campaignId)?.name}</p>
                <p className="text-sm text-muted-foreground">{s.startTime} — {s.endTime}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
