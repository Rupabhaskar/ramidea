"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ClientBudgetCard } from "@/components/client/client-budget-card";
import { ClientPlanSection } from "@/components/client/client-plan-section";
import { ClientAccountGate } from "@/components/client/client-account-gate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClientAccount } from "@/hooks/use-bookings";
import { getPaymentsForClient } from "@/lib/billing-utils";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientBillingPage() {
  const { client, loading, error } = useClientAccount();

  return (
    <ClientAccountGate loading={loading} error={error}>
      {client && <BillingContent client={client} />}
    </ClientAccountGate>
  );
}

function BillingContent({ client }: { client: NonNullable<ReturnType<typeof useClientAccount>["client"]> }) {
  const payments = getPaymentsForClient(client.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Your subscription plan, usage limits, and payment history"
        breadcrumbs={[{ label: "Client", href: "/client/dashboard" }, { label: "Billing" }]}
      />

      <ClientPlanSection client={client} />

      <div>
        <h2 className="text-lg font-semibold mb-4">Budget & usage</h2>
        <ClientBudgetCard client={client} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold">Payment history</h3>
          </div>
          {payments.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="h-11 px-4 text-left font-medium text-muted-foreground">Invoice</th>
                  <th className="h-11 px-4 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="h-11 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="h-11 px-4 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border">
                    <td className="px-4 py-3 font-medium">{payment.invoiceId ?? payment.id}</td>
                    <td className="px-4 py-3">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3">{formatDate(payment.date)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={payment.status === "paid" ? "success" : "secondary"} className="capitalize">
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
