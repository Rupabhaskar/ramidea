"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { mockPlayLogs, mockScreens, mockMedia } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import type { PlayLog } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<PlayLog>[] = [
  { accessorKey: "screenId", header: "Screen", cell: ({ row }) => mockScreens.find((s) => s.id === row.original.screenId)?.name ?? row.original.screenId },
  { accessorKey: "mediaId", header: "Media", cell: ({ row }) => mockMedia.find((m) => m.id === row.original.mediaId)?.name ?? row.original.mediaId },
  { accessorKey: "playedAt", header: "Played At", cell: ({ row }) => formatDateTime(row.original.playedAt) },
  { accessorKey: "duration", header: "Duration", cell: ({ row }) => `${row.original.duration}s` },
];

export default function ProofOfPlayPage() {
  return (
    <div>
      <PageHeader
        title="Proof of Play"
        breadcrumbs={[{ label: "Reports", href: "/portal/reports" }, { label: "Proof of Play" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          </div>
        }
      />
      <DataTable columns={columns} data={mockPlayLogs} />
    </div>
  );
}
