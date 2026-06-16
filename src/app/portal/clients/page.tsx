"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { MapPin, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateClientDialog } from "@/components/clients/create-client-dialog";
import { AssignZonesDialog } from "@/components/clients/assign-zones-dialog";
import { useAdvertisers } from "@/hooks/use-bookings";
import { useOpenFromSearchParam } from "@/hooks/use-open-from-search-param";
import { useZones } from "@/hooks/use-screen-management";
import { getZoneName } from "@/services/screen-management-service";
import { formatCurrency } from "@/lib/utils";
import type { Advertiser } from "@/types";

function ClientsPageContent() {
  const { advertisers, loading } = useAdvertisers();
  const { zones } = useZones();
  const [createOpen, setCreateOpen] = useOpenFromSearchParam("create", "1", "/portal/clients");
  const [assignClient, setAssignClient] = useState<Advertiser | null>(null);

  const columns = useMemo<ColumnDef<Advertiser>[]>(
    () => [
      {
        accessorKey: "companyName",
        header: "Client",
        cell: ({ row }) => (
          <Link
            href={`/portal/clients/${row.original.id}`}
            className="font-medium hover:text-primary"
          >
            {row.original.companyName}
          </Link>
        ),
      },
      { accessorKey: "contactName", header: "Contact" },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <span>
            {formatCurrency(row.original.budgetUsed)} / {formatCurrency(row.original.budget)}
          </span>
        ),
      },
      {
        accessorKey: "maxAds",
        header: "Ads",
        cell: ({ row }) => (
          <span>
            {row.original.activeAds} / {row.original.maxAds}
          </span>
        ),
      },
      {
        accessorKey: "zoneIds",
        header: "Zones",
        cell: ({ row }) => {
          const ids = row.original.zoneIds;
          if (ids.length === 0) {
            return <span className="text-muted-foreground text-sm">None</span>;
          }
          return (
            <div className="flex flex-wrap gap-1 max-w-[220px]">
              {ids.slice(0, 3).map((id) => (
                <Badge key={id} variant="secondary" className="text-xs font-normal">
                  {getZoneName(id)}
                </Badge>
              ))}
              {ids.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{ids.length - 3}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignClient(row.original)}
            >
              <MapPin className="h-3.5 w-3.5 mr-1" />
              Zones
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/portal/clients/${row.original.id}/ads/create`}>Create Ad</Link>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description="Manage client accounts, budgets, ad limits, and zone access"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Clients" }]}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading clients...</p>
      ) : (
        <DataTable
          columns={columns}
          data={advertisers}
          searchKey="companyName"
          searchPlaceholder="Search clients..."
        />
      )}

      {zones.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {zones.length} zones available · Click <strong>Zones</strong> on any client to assign access
        </p>
      )}

      <CreateClientDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AssignZonesDialog
        open={Boolean(assignClient)}
        onOpenChange={(open) => {
          if (!open) setAssignClient(null);
        }}
        client={assignClient}
      />
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
      <ClientsPageContent />
    </Suspense>
  );
}
