"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard, StatsCards } from "@/components/dashboard/stats-card";
import { BillingClientsTable } from "@/components/billing/billing-clients-table";
import { SupportTicketsTable } from "@/components/billing/support-tickets-table";
import { getBillingSummary, getClientBillingRows } from "@/lib/billing-utils";
import { mockSupportTickets } from "@/lib/mock-data";
import { toDate } from "@/lib/utils";
import { Building2, CreditCard, Ticket, Clock } from "lucide-react";

export default function BillingPage() {
  const summary = getBillingSummary();
  const clients = getClientBillingRows();
  const recentTickets = [...mockSupportTickets]
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing Overview"
        description="Client plans, ad limits, payments, and support tickets"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Billing" }]}
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link href="/portal/billing/clients">All Clients</Link>
          </Button>
        }
      />

      <StatsCards>
        <StatsCard title="Active Clients" value={summary.activeClients} icon={Building2} />
        <StatsCard title="Monthly Recurring" value={summary.monthlyRecurring} icon={CreditCard} format="currency" />
        <StatsCard
          title="Pending Payments"
          value={summary.pendingAmount}
          icon={Clock}
          format="currency"
          change={summary.pendingCount > 0 ? undefined : 0}
        />
        <StatsCard title="Open Tickets" value={summary.openTickets} icon={Ticket} />
      </StatsCards>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <h3 className="text-lg font-semibold">Clients & Plans</h3>
            <p className="text-sm text-muted-foreground">
              Subscription plan, allowed ads vs current ads, and payment status
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/portal/billing/clients">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <BillingClientsTable data={clients} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <h3 className="text-lg font-semibold">Recent Support Tickets</h3>
            <p className="text-sm text-muted-foreground">Issues raised by clients</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/portal/billing/tickets">All tickets</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <SupportTicketsTable tickets={recentTickets} />
        </CardContent>
      </Card>
    </div>
  );
}
