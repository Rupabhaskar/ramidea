"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, MapPin, Monitor } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateZoneDialog } from "@/components/screens/create-zone-dialog";
import { AddScreenDialog } from "@/components/screens/add-screen-dialog";
import { useScreens, useZones } from "@/hooks/use-screen-management";
import { formatCurrency } from "@/lib/utils";

function ZonesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { zones } = useZones();
  const { screens } = useScreens();
  const [createOpen, setCreateOpen] = useState(false);
  const [addScreenOpen, setAddScreenOpen] = useState(false);
  const [addScreenZoneId, setAddScreenZoneId] = useState<string>();

  useEffect(() => {
    if (searchParams.get("create") === "1") {
      setCreateOpen(true);
      router.replace("/portal/zones", { scroll: false });
    }
  }, [searchParams, router]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Zones"
        description="Geographic zones for screens, campaigns, and client slot booking rates"
        breadcrumbs={[
          { label: "Screens", href: "/portal/screens" },
          { label: "Zones" },
        ]}
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Zone
          </Button>
        }
      />
      {zones.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No zones yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Create a zone to organize screens and set slot booking rates
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Zone
          </Button>
        </div>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => {
          const zoneScreens = screens.filter((s) => s.zoneId === zone.id);
          const online = zoneScreens.filter((s) => s.status === "online").length;

          return (
            <Card key={zone.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{zone.name}</h3>
                    <p className="text-sm text-muted-foreground">{zone.city}</p>
                  </div>
                  <Badge variant="outline">{formatCurrency(zone.hourlyRate)}/hr</Badge>
                </div>
                {zone.description && (
                  <p className="text-xs text-muted-foreground mt-2">{zone.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Monitor className="h-3 w-3 mr-1" />
                    {zoneScreens.length} screens
                  </Badge>
                  <Badge variant={online > 0 ? "success" : "secondary"}>
                    {online} online
                  </Badge>
                </div>
                <ul className="mt-4 space-y-1.5 border-t border-border pt-3">
                  {zoneScreens.length === 0 ? (
                    <li className="text-sm text-muted-foreground">No screens in this zone</li>
                  ) : (
                    zoneScreens.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                        <Link
                          href={`/portal/screens/${s.id}`}
                          className="text-primary hover:underline truncate"
                        >
                          {s.name}
                        </Link>
                        <span className="text-xs text-muted-foreground shrink-0 capitalize">
                          {s.status}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => {
                    setAddScreenZoneId(zone.id);
                    setAddScreenOpen(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add screen to {zone.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}

      <CreateZoneDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AddScreenDialog
        open={addScreenOpen}
        onOpenChange={setAddScreenOpen}
        zones={zones}
        defaultZoneId={addScreenZoneId}
      />
    </div>
  );
}

export default function ZonesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
      <ZonesPageContent />
    </Suspense>
  );
}
