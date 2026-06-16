import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SecuritySettingsPage() {
  return (
    <div>
      <PageHeader title="Security" breadcrumbs={[{ label: "Settings", href: "/portal/settings/general" }, { label: "Security" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div><Label>Two-Factor Authentication</Label><p className="text-xs text-muted-foreground">Add an extra layer of security</p></div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Session Timeout</Label><p className="text-xs text-muted-foreground">Auto logout after inactivity</p></div>
            <Switch defaultChecked />
          </div>
          <Button>Update Security</Button>
        </CardContent>
      </Card>
    </div>
  );
}
