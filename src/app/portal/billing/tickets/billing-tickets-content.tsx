"use client";

import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { SupportTicketsTable } from "@/components/billing/support-tickets-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { getAdvertiserName } from "@/lib/billing-utils";
import { mockSupportTickets } from "@/lib/mock-data";
import { formatDate, formatRelative, toDate } from "@/lib/utils";

export default function BillingTicketsPageContent() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticket");
  const selected = ticketId
    ? mockSupportTickets.find((t) => t.id === ticketId)
    : undefined;

  const sortedTickets = [...mockSupportTickets].sort(
    (a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime()
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Support Tickets"
        description="Tickets raised by clients — billing, ads, and technical issues"
        breadcrumbs={[
          { label: "Billing", href: "/portal/billing" },
          { label: "Tickets" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card>
            <CardContent className="pt-6">
              <SupportTicketsTable tickets={sortedTickets} />
            </CardContent>
          </Card>
        </div>

        {selected && (
          <Card className="h-fit">
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Ticket</p>
                <p className="font-semibold mt-1">{selected.subject}</p>
                <p className="text-sm text-muted-foreground mt-2">{selected.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Client</p>
                <p className="text-sm font-medium mt-1">{getAdvertiserName(selected.advertiserId)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selected.status} />
                <Badge variant="outline" className="capitalize">{selected.category}</Badge>
                <Badge
                  variant={
                    selected.priority === "high"
                      ? "destructive"
                      : selected.priority === "medium"
                        ? "warning"
                        : "default"
                  }
                  className="capitalize"
                >
                  {selected.priority}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Message</p>
                <p className="text-sm mt-1 leading-relaxed">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Raised</p>
                <p className="text-sm mt-1">{formatDate(selected.createdAt)}</p>
                <p className="text-xs text-muted-foreground">{formatRelative(selected.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
