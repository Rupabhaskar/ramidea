"use client";

import Link from "next/link";
import { Monitor, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import type { Screen } from "@/types";
import { formatRelative } from "@/lib/utils";

export function ScreenCard({ screen, compact = false }: { screen: Screen; compact?: boolean }) {
  return (
    <Card className="group h-full hover:border-primary/30 transition-colors">
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <Link
                href={`/portal/screens/${screen.id}`}
                className="font-semibold hover:text-primary transition-colors line-clamp-1"
              >
                {screen.name}
              </Link>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 min-w-0">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{screen.location}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={screen.status} className="shrink-0" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
          <div className="min-w-0">
            <p className="text-muted-foreground">Resolution</p>
            <p className="font-medium mt-0.5 truncate">{screen.resolution}</p>
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground">Last Seen</p>
            <p className="font-medium mt-0.5 truncate">{formatRelative(screen.lastSeen)}</p>
          </div>
        </div>

        {screen.health && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">CPU</span>
              <span className="font-medium">{screen.health.cpu}%</span>
            </div>
            <Progress value={screen.health.cpu} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RealtimeScreenGrid({
  screens,
  compact = false,
}: {
  screens: Screen[];
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "grid gap-3 grid-cols-1"
          : "grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      }
    >
      {screens.map((screen) => (
        <ScreenCard key={screen.id} screen={screen} compact={compact} />
      ))}
    </div>
  );
}
