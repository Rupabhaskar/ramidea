"use client";

import { PageHeader } from "@/components/layout/page-header";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { StatsCard, StatsCards } from "@/components/dashboard/stats-card";
import { Eye, Play, Monitor, DollarSign } from "lucide-react";
import { revenueChartData, mockAnalytics } from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Comprehensive performance insights" breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Analytics" }]} />
      <StatsCards>
        <StatsCard title="Ad Impressions" value={1250000} icon={Eye} format="number" change={15} />
        <StatsCard title="Ad Plays" value={mockAnalytics.todayPlays * 30} icon={Play} format="number" change={12} />
        <StatsCard title="Screen Uptime" value="99.2%" icon={Monitor} />
        <StatsCard title="Revenue" value={mockAnalytics.revenue} icon={DollarSign} format="currency" change={18} />
      </StatsCards>
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart data={revenueChartData} title="Top Campaigns" dataKey="revenue" type="bar" />
        <AnalyticsChart data={revenueChartData} title="Top Advertisers" dataKey="plays" type="bar" color="#7C3AED" />
      </div>
      <AnalyticsChart data={revenueChartData} title="Revenue Over Time" dataKey="revenue" />
    </div>
  );
}
