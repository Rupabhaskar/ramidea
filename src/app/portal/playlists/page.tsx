"use client";

import Link from "next/link";
import { Plus, ListMusic, MapPin, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlaylistAssignmentPanel } from "@/components/playlists/playlist-assignment-panel";
import { usePlaylists } from "@/hooks/use-playlists";
import { useZones, useScreenGroups } from "@/hooks/use-screen-management";

export default function PlaylistsPage() {
  const { playlists } = usePlaylists();
  const { zones } = useZones();
  const { groups } = useScreenGroups();

  function countZoneAssignments(playlistId: string) {
    return zones.filter((z) => z.playlistId === playlistId).length;
  }

  function countGroupAssignments(playlistId: string) {
    return groups.filter((g) => g.playlistId === playlistId).length;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Playlists"
        description="Build playlists and deploy them to zones and screen groups"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Playlists" }]}
        actions={
          <Button size="sm" asChild>
            <Link href="/portal/playlists/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {playlists.map((pl) => {
          const zoneCount = countZoneAssignments(pl.id);
          const groupCount = countGroupAssignments(pl.id);
          return (
            <Link key={pl.id} href={`/portal/playlists/${pl.id}`} className="block h-full">
              <Card className="flex h-full flex-col hover:border-primary/30 transition-colors">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                      <ListMusic className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold line-clamp-1">{pl.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pl.items.length} {pl.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {pl.loop && <Badge variant="outline">Loop</Badge>}
                    {pl.shuffle && <Badge variant="outline">Shuffle</Badge>}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {zoneCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {zoneCount} {zoneCount === 1 ? "zone" : "zones"}
                      </span>
                    )}
                    {groupCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {groupCount} {groupCount === 1 ? "group" : "groups"}
                      </span>
                    )}
                    {zoneCount === 0 && groupCount === 0 && (
                      <span>Not assigned yet</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <PlaylistAssignmentPanel playlists={playlists} zones={zones} groups={groups} />
    </div>
  );
}
