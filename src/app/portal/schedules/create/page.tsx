import { PageHeader } from "@/components/layout/page-header";
import { CalendarScheduler } from "@/components/schedules/calendar-scheduler";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateSchedulePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Create Schedule" breadcrumbs={[{ label: "Schedules", href: "/portal/schedules" }, { label: "Create" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Campaign</Label>
            <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select campaign" /></SelectTrigger>
              <SelectContent><SelectItem value="camp-1">Summer Sale 2026</SelectItem></SelectContent>
            </Select>
          </div>
          <Button>Create Schedule</Button>
        </CardContent>
      </Card>
      <CalendarScheduler />
    </div>
  );
}
