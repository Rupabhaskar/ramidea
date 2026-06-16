import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { APP_REGION, APP_TIMEZONE } from "@/lib/locale";

const settingsNav = [
  { label: "General", href: "/portal/settings/general" },
  { label: "Security", href: "/portal/settings/security" },
  { label: "Storage", href: "/portal/settings/storage" },
  { label: "Email", href: "/portal/settings/email" },
  { label: "API", href: "/portal/settings/api" },
];

function SettingsLayout({ children, active }: { children: React.ReactNode; active: string }) {
  return (
    <div className="flex gap-8">
      <nav className="hidden w-48 shrink-0 md:block space-y-1">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm transition-colors",
              active === item.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function GeneralSettings() {
  return (
    <SettingsLayout active="/portal/settings/general">
      <PageHeader title="General Settings" breadcrumbs={[{ label: "Settings" }, { label: "General" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Organization Name</Label><Input defaultValue="AdFlow Andhra Pradesh" className="mt-1.5" /></div>
          <div><Label>Region</Label><Input defaultValue={APP_REGION} className="mt-1.5" readOnly /></div>
          <div><Label>Timezone</Label><Input defaultValue={APP_TIMEZONE} className="mt-1.5" /></div>
          <Button>Save</Button>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
}

export default GeneralSettings;
