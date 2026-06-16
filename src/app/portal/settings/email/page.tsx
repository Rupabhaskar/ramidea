import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailSettingsPage() {
  return (
    <div>
      <PageHeader title="Email / SMTP" breadcrumbs={[{ label: "Settings", href: "/portal/settings/general" }, { label: "Email" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>SMTP Host</Label><Input placeholder="smtp.example.com" className="mt-1.5" /></div>
          <div><Label>SMTP Port</Label><Input placeholder="587" className="mt-1.5" /></div>
          <div><Label>From Email</Label><Input placeholder="noreply@adflow.in" className="mt-1.5" /></div>
          <Button>Save SMTP Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
