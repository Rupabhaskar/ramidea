import Link from "next/link";
import { FileText, Monitor, DollarSign, Download } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  { title: "Proof of Play", href: "/portal/reports/proof-of-play", icon: FileText, desc: "Verify ad playback across all screens" },
  { title: "Screen Activity", href: "/portal/reports/screens", icon: Monitor, desc: "Uptime and performance reports" },
  { title: "Revenue", href: "/portal/reports/revenue", icon: DollarSign, desc: "Financial performance and billing" },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" description="Generate and export enterprise reports" breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Reports" }]} />
      <div className="grid gap-4 md:grid-cols-3">
        {reports.map((r) => (
          <Link key={r.href} href={r.href}>
            <Card className="hover:border-primary/30 transition-colors h-full">
              <CardContent className="p-6">
                <r.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ReportPage({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <PageHeader title={title} description={description} breadcrumbs={[{ label: "Reports", href: "/portal/reports" }, { label: title }]} actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />PDF</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />CSV</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Excel</Button>
        </div>
      } />
      <Card><CardContent className="p-6 text-muted-foreground">Report data will be generated from Firestore playLogs collection.</CardContent></Card>
    </div>
  );
}

export function ProofOfPlayReport() {
  return <ReportPage title="Proof of Play" description="Detailed playback verification report" />;
}
