import { PageHeader } from "@/components/layout/page-header";
import { CalendarScheduler } from "@/components/schedules/calendar-scheduler";
import { Card, CardContent } from "@/components/ui/card";
import { mockSchedules, mockCampaigns } from "@/lib/mock-data";

export default async function ScheduleDetailPage({ params }: { params: Promise<{ scheduleId: string }> }) {
  const { scheduleId } = await params;
  const schedule = mockSchedules.find((s) => s.id === scheduleId) ?? mockSchedules[0];
  const campaign = mockCampaigns.find((c) => c.id === schedule.campaignId);

  return (
    <div className="space-y-6">
      <PageHeader title={campaign?.name ?? "Schedule"} breadcrumbs={[{ label: "Schedules", href: "/portal/schedules" }, { label: "Detail" }]} />
      <Card><CardContent className="p-6">
        <p>{schedule.startTime} — {schedule.endTime}</p>
        <p className="text-muted-foreground mt-2">Days: {schedule.days.join(", ")}</p>
      </CardContent></Card>
      <CalendarScheduler events={[{ id: schedule.id, title: campaign?.name ?? "", startHour: 9, endHour: 21, day: 0 }]} />
    </div>
  );
}
