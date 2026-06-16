"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Ticket } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PLAN_LABELS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ClientBillingRow } from "@/lib/billing-utils";

const columns: ColumnDef<ClientBillingRow>[] = [
  {
    accessorKey: "client.companyName",
    header: "Client",
    cell: ({ row }) => (
      <div>
        <Link
          href={`/portal/clients/${row.original.client.id}`}
          className="font-medium hover:text-primary"
        >
          {row.original.client.companyName}
        </Link>
        <p className="text-xs text-muted-foreground">{row.original.client.contactName}</p>
      </div>
    ),
  },
  {
    id: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <div>
        <Badge variant="outline">{PLAN_LABELS[row.original.client.plan]}</Badge>
        <p className="text-xs text-muted-foreground mt-1">
          {formatCurrency(row.original.client.planPrice)}/mo
        </p>
      </div>
    ),
  },
  {
    id: "ads",
    header: "Ads (current / allowed)",
    cell: ({ row }) => {
      const { activeAds, maxAds } = row.original.client;
      const pct = maxAds > 0 ? Math.round((activeAds / maxAds) * 100) : 0;
      return (
        <div className="min-w-[120px]">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{activeAds}</span>
            <span className="text-muted-foreground">/ {maxAds}</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
      );
    },
  },
  {
    id: "budget",
    header: "Ad Spend",
    cell: ({ row }) => (
      <span className="text-sm">
        {formatCurrency(row.original.client.budgetUsed)}
        <span className="text-muted-foreground"> / {formatCurrency(row.original.client.budget)}</span>
      </span>
    ),
  },
  {
    id: "lastPayment",
    header: "Last Payment",
    cell: ({ row }) => {
      const payment = row.original.lastPayment;
      if (!payment) return <span className="text-muted-foreground">—</span>;
      return (
        <div>
          <p className="font-medium">{formatCurrency(payment.amount)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(payment.date)}</p>
        </div>
      );
    },
  },
  {
    id: "currentPayment",
    header: "Current Payment",
    cell: ({ row }) => {
      const pending = row.original.pendingPayment;
      if (pending) {
        return (
          <div>
            <p className="font-medium text-amber-600 dark:text-amber-400">
              {formatCurrency(pending.amount)}
            </p>
            <StatusBadge status="pending" />
          </div>
        );
      }
      const due = row.original.client.nextPaymentDue;
      return due ? (
        <div>
          <p className="text-sm">Due {formatDate(due)}</p>
          <StatusBadge status="paid" />
        </div>
      ) : (
        <StatusBadge status="paid" />
      );
    },
  },
  {
    id: "tickets",
    header: "Tickets",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.openTickets > 0 ? (
          <Badge variant="warning" className="gap-1">
            <Ticket className="h-3 w-3" />
            {row.original.openTickets} open
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">None open</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "client.status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.client.status} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/portal/billing/clients?client=${row.original.client.id}`}>Details</Link>
      </Button>
    ),
  },
];

interface BillingClientsTableProps {
  data: ClientBillingRow[];
  searchPlaceholder?: string;
}

export function BillingClientsTable({ data, searchPlaceholder = "Search clients..." }: BillingClientsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="clientName"
      searchPlaceholder={searchPlaceholder}
    />
  );
}
