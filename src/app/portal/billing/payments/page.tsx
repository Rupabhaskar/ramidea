import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate, toDate } from "@/lib/utils";
import { getAdvertiserName } from "@/lib/billing-utils";
import { mockClientPayments } from "@/lib/mock-data";

const payments = [...mockClientPayments].sort(
  (a, b) => toDate(b.date).getTime() - toDate(a.date).getTime()
);

export default function PaymentsPage() {
  return (
    <div>
      <PageHeader
        title="Payments"
        description="All client subscription and ad payments"
        breadcrumbs={[{ label: "Billing", href: "/portal/billing" }, { label: "Payments" }]}
      />
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Transaction</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Client</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Amount</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Date</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Method</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{p.id}</td>
                <td className="px-4 py-3">{getAdvertiserName(p.advertiserId)}</td>
                <td className="px-4 py-3">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3">{formatDate(p.date)}</td>
                <td className="px-4 py-3">{p.method}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
