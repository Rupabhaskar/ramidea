"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdvertiserName } from "@/lib/billing-utils";
import { formatDate, formatRelative } from "@/lib/utils";
import type { SupportTicket } from "@/types";

const categoryLabels: Record<string, string> = {
  billing: "Billing",
  ads: "Ads",
  technical: "Technical",
  other: "Other",
};

const priorityVariant: Record<string, "default" | "warning" | "destructive"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
};

export function getSupportTicketColumns(showClient = true): ColumnDef<SupportTicket>[] {
  const cols: ColumnDef<SupportTicket>[] = [];

  if (showClient) {
    cols.push({
      id: "client",
      header: "Client",
      cell: ({ row }) => (
        <Link
          href={`/portal/clients/${row.original.advertiserId}`}
          className="font-medium hover:text-primary"
        >
          {getAdvertiserName(row.original.advertiserId)}
        </Link>
      ),
    });
  }

  cols.push(
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.subject}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.original.message}</p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">{categoryLabels[row.original.category] ?? row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <Badge variant={priorityVariant[row.original.priority] ?? "default"} className="capitalize">
          {row.original.priority}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Raised",
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{formatDate(row.original.createdAt)}</p>
          <p className="text-xs text-muted-foreground">{formatRelative(row.original.createdAt)}</p>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/portal/billing/tickets?ticket=${row.original.id}`}>View</Link>
        </Button>
      ),
    }
  );

  return cols;
}

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  showClient?: boolean;
}

export function SupportTicketsTable({ tickets, showClient = true }: SupportTicketsTableProps) {
  return (
    <DataTable
      columns={getSupportTicketColumns(showClient)}
      data={tickets}
      searchKey="subject"
      searchPlaceholder="Search tickets..."
    />
  );
}
