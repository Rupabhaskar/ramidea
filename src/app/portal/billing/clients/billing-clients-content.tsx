"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BillingClientsTable } from "@/components/billing/billing-clients-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PLAN_LABELS } from "@/lib/constants";
import {
  getClientBillingRows,
  getPaymentsForClient,
  getTicketsForClient,
} from "@/lib/billing-utils";
import { mockAdvertisers } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BillingClientsPageContent() {
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("client");
  const rows = getClientBillingRows();
  const selected = selectedId
    ? mockAdvertisers.find((a) => a.id === selectedId)
    : undefined;

  const payments = selected ? getPaymentsForClient(selected.id) : [];
  const tickets = selected ? getTicketsForClient(selected.id) : [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Client Billing"
        description="Plans, ad usage limits, payment history, and tickets per client"
        breadcrumbs={[
          { label: "Billing", href: "/portal/billing" },
          { label: "Clients" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className={selected ? "lg:col-span-2" : "lg:col-span-3"}>
          <Card>
            <CardContent className="pt-6">
              <BillingClientsTable data={rows} />
            </CardContent>
          </Card>
        </div>

        {selected && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="font-semibold">{selected.companyName}</h3>
                <p className="text-sm text-muted-foreground">{selected.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{PLAN_LABELS[selected.plan]}</Badge>
                    <span className="text-sm">{formatCurrency(selected.planPrice)}/month</span>
                  </div>
                  {selected.nextPaymentDue && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Next due: {formatDate(selected.nextPaymentDue)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Ads</p>
                  <div className="flex justify-between text-sm mt-1 mb-1">
                    <span>{selected.activeAds} running</span>
                    <span className="text-muted-foreground">{selected.maxAds} allowed</span>
                  </div>
                  <Progress
                    value={selected.maxAds > 0 ? (selected.activeAds / selected.maxAds) * 100 : 0}
                  />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Ad Budget</p>
                  <p className="text-sm mt-1">
                    {formatCurrency(selected.budgetUsed)} used of {formatCurrency(selected.budget)}
                  </p>
                </div>

                <StatusBadge status={selected.status} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Payment History</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments recorded.</p>
                ) : (
                  payments.map((p) => (
                    <div key={p.id} className="flex justify-between items-start border-b border-border pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-muted-foreground">{p.method}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(p.date)}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="font-semibold">Tickets Raised</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tickets from this client.</p>
                ) : (
                  tickets.map((t) => (
                    <Link
                      key={t.id}
                      href={`/portal/billing/tickets?ticket=${t.id}`}
                      className="block rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                    >
                      <p className="font-medium text-sm">{t.subject}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={t.status} />
                        <span className="text-xs text-muted-foreground capitalize">{t.category}</span>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
