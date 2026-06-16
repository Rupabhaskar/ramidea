import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAdvertiserName } from "@/lib/billing-utils";
import { mockClientPayments } from "@/lib/mock-data";

const invoices = mockClientPayments.map((p) => ({
  id: p.invoiceId ?? p.id,
  advertiserId: p.advertiserId,
  amount: p.amount,
  status: p.status === "failed" ? "overdue" as const : p.status,
  dueDate: p.date,
}));

export default function InvoicesPage() {
  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Client subscription and ad spend invoices"
        breadcrumbs={[{ label: "Billing", href: "/portal/billing" }, { label: "Invoices" }]}
      />
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Invoice</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Client</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Amount</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Due Date</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border">
                <td className="px-4 py-3 font-medium">{inv.id}</td>
                <td className="px-4 py-3">{getAdvertiserName(inv.advertiserId)}</td>
                <td className="px-4 py-3">{formatCurrency(inv.amount)}</td>
                <td className="px-4 py-3">{formatDate(inv.dueDate)}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3"><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
