"use client";

import { PageHeader } from "@/components/layout/page-header";
import { RevenueChart } from "@/components/analytics/analytics-chart";
import { revenueChartData } from "@/lib/mock-data";

export default function RevenueReportPage() {
  return (
    <div>
      <PageHeader title="Revenue Report" breadcrumbs={[{ label: "Reports", href: "/portal/reports" }, { label: "Revenue" }]} />
      <RevenueChart data={revenueChartData} />
    </div>
  );
}
