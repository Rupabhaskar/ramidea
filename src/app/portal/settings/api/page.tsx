import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ApiSettingsPage() {
  return (
    <div>
      <PageHeader title="API Keys" breadcrumbs={[{ label: "Settings", href: "/portal/settings/general" }, { label: "API" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>API Key</Label>
            <Input readOnly value="adflow_sk_live_••••••••••••••••" className="mt-1.5 font-mono" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Regenerate</Button>
            <Button variant="outline">Copy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
