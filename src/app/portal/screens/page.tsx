"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Monitor, Wifi, WifiOff, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard, StatsCards } from "@/components/dashboard/stats-card";
import { AddScreenDialog } from "@/components/screens/add-screen-dialog";
import { useOpenFromSearchParam } from "@/hooks/use-open-from-search-param";
import { useScreens, useZones } from "@/hooks/use-screen-management";
import { getZoneName } from "@/services/screen-management-service";
import { formatRelative } from "@/lib/utils";
import type { Screen } from "@/types";

function ScreensPageContent() {
  const { screens } = useScreens();
  const { zones } = useZones();
  const [addOpen, setAddOpen] = useOpenFromSearchParam("add", "1", "/portal/screens");
  const [zoneFilter, setZoneFilter] = useState<string>("all");

  const filteredScreens = useMemo(
    () => (zoneFilter === "all" ? screens : screens.filter((s) => s.zoneId === zoneFilter)),
    [screens, zoneFilter]
  );

  const online = screens.filter((s) => s.status === "online").length;

  const columns: ColumnDef<Screen>[] = [
    {
      accessorKey: "name",
      header: "Screen",
      cell: ({ row }) => (
        <div>
          <Link
            href={`/portal/screens/${row.original.id}`}
            className="font-medium hover:text-primary"
          >
            {row.original.name}
          </Link>
          <p className="text-xs text-muted-foreground font-mono">{row.original.pairingCode}</p>
        </div>
      ),
    },
    {
      id: "zone",
      header: "Zone",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.zoneId ? getZoneName(row.original.zoneId) : "—"}
        </Badge>
      ),
    },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "resolution", header: "Resolution" },
    {
      accessorKey: "lastSeen",
      header: "Last Seen",
      cell: ({ row }) => formatRelative(row.original.lastSeen),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/portal/screens/${row.original.id}/edit`}>
            <MoreHorizontal className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Screens"
        description="Manage zones, pair players, and monitor displays across Andhra Pradesh"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Screens" }]}
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Screen
          </Button>
        }
      />

      <StatsCards>
        <StatsCard title="Total Screens" value={screens.length} icon={Monitor} />
        <StatsCard title="Online" value={online} icon={Wifi} />
        <StatsCard title="Offline" value={screens.length - online} icon={WifiOff} />
        <StatsCard title="Zones" value={zones.length} icon={MapPin} />
      </StatsCards>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={zoneFilter === "all" ? "default" : "outline"}
          onClick={() => setZoneFilter("all")}
        >
          All zones
        </Button>
        {zones.map((z) => (
          <Button
            key={z.id}
            size="sm"
            variant={zoneFilter === z.id ? "default" : "outline"}
            onClick={() => setZoneFilter(z.id)}
          >
            {z.name}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredScreens}
        searchKey="name"
        searchPlaceholder="Search screens..."
      />

      <AddScreenDialog open={addOpen} onOpenChange={setAddOpen} zones={zones} />
    </div>
  );
}

export default function ScreensPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
      <ScreensPageContent />
    </Suspense>
  );
}
