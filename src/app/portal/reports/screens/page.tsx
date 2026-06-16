"use client";

import { PageHeader } from "@/components/layout/page-header";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { screenActivityData } from "@/lib/mock-data";

export default function ScreenReportsPage() {
  return (
    <div>
      <PageHeader title="Screen Reports" breadcrumbs={[{ label: "Reports", href: "/portal/reports" }, { label: "Screens" }]} />
      <AnalyticsChart data={screenActivityData} title="Screen Uptime" dataKey="online" type="line" color="#16A34A" />
    </div>
  );
}
