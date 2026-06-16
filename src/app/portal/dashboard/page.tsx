"use client";

import {
  Monitor,
  Wifi,
  WifiOff,
  Megaphone,
  Calendar,
  DollarSign,
  Play,
} from "lucide-react";
import { DashboardHeader } from "@/components/layout/page-header";
import { StatsCard, StatsCards } from "@/components/dashboard/stats-card";
import { RevenueChart, AnalyticsChart } from "@/components/analytics/analytics-chart";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { RealtimeScreenGrid } from "@/components/screens/screen-card";
import { CampaignCard } from "@/components/campaigns/campaign-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  mockAnalytics,
  mockActivities,
  revenueChartData,
  screenActivityData,
  mockScreens,
  mockCampaigns,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Dashboard"
        description="Overview of your digital signage network"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Dashboard" }]}
      />

      <StatsCards>
        <StatsCard title="Total Screens" value={mockAnalytics.totalScreens} icon={Monitor} format="number" change={12} />
        <StatsCard title="Online Screens" value={mockAnalytics.onlineScreens} icon={Wifi} format="number" change={8} />
        <StatsCard title="Offline Screens" value={mockAnalytics.offlineScreens} icon={WifiOff} format="number" change={-3} />
        <StatsCard title="Active Campaigns" value={mockAnalytics.activeCampaigns} icon={Megaphone} change={5} />
      </StatsCards>

      <StatsCards>
        <StatsCard title="Scheduled Campaigns" value={mockAnalytics.scheduledCampaigns} icon={Calendar} />
        <StatsCard title="Revenue" value={mockAnalytics.revenue} icon={DollarSign} format="currency" change={18} />
        <StatsCard title="Today's Plays" value={mockAnalytics.todayPlays} icon={Play} format="number" change={22} />
      </StatsCards>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueChartData} />
        <AnalyticsChart data={revenueChartData} title="Ad Plays" dataKey="plays" color="#7C3AED" type="bar" />
      </div>

      <AnalyticsChart data={screenActivityData} title="Screen Activity" dataKey="online" color="#16A34A" type="line" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent><ActivityTimeline activities={mockActivities} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Campaign Performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {mockCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Screen Status</CardTitle></CardHeader>
        <CardContent>
          <RealtimeScreenGrid screens={mockScreens.slice(0, 3)} />
        </CardContent>
      </Card>
    </div>
  );
}
