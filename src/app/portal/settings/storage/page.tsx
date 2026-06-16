import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { STORAGE_PATHS } from "@/lib/constants";

export default function StorageSettingsPage() {
  const used = 45;
  const total = 100;

  return (
    <div>
      <PageHeader title="Storage" breadcrumbs={[{ label: "Settings", href: "/portal/settings/general" }, { label: "Storage" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Storage Used</span>
              <span>{used} GB / {total} GB</span>
            </div>
            <Progress value={(used / total) * 100} />
          </div>
          <div className="space-y-2 text-sm">
            {Object.entries(STORAGE_PATHS).map(([key, path]) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{key}</span>
                <span className="font-mono text-xs">{path}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
