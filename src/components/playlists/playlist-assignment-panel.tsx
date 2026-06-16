"use client";

import { toast } from "sonner";
import { MapPin, Layers, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignPlaylistToZone,
  assignPlaylistToGroup,
} from "@/services/screen-management-service";
import type { Playlist, ScreenGroup, Zone } from "@/types";

const NONE_VALUE = "__none__";

interface PlaylistAssignmentPanelProps {
  playlists: Playlist[];
  zones: Zone[];
  groups: ScreenGroup[];
}

export function PlaylistAssignmentPanel({
  playlists,
  zones,
  groups,
}: PlaylistAssignmentPanelProps) {
  async function handleZoneAssign(zoneId: string, value: string, zoneName: string) {
    const playlistId = value === NONE_VALUE ? null : value;
    try {
      await assignPlaylistToZone(zoneId, playlistId);
      const playlistName = playlistId
        ? playlists.find((p) => p.id === playlistId)?.name
        : null;
      toast.success(
        playlistName
          ? `"${playlistName}" assigned to zone ${zoneName}`
          : `Playlist removed from zone ${zoneName}`
      );
    } catch {
      toast.error("Failed to assign playlist to zone");
    }
  }

  async function handleGroupAssign(groupId: string, value: string, groupName: string) {
    const playlistId = value === NONE_VALUE ? null : value;
    try {
      await assignPlaylistToGroup(groupId, playlistId);
      const playlistName = playlistId
        ? playlists.find((p) => p.id === playlistId)?.name
        : null;
      toast.success(
        playlistName
          ? `"${playlistName}" assigned to group ${groupName}`
          : `Playlist removed from group ${groupName}`
      );
    } catch {
      toast.error("Failed to assign playlist to group");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assign to Zones & Groups</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose a playlist for each zone or group. All screens in that zone or group will play it.
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="zones">
          <TabsList className="mb-4">
            <TabsTrigger value="zones" className="gap-2">
              <MapPin className="h-4 w-4" />
              Zones ({zones.length})
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2">
              <Layers className="h-4 w-4" />
              Groups ({groups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-3">
            {zones.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No zones yet. Create zones under Screens → Zones.
              </p>
            ) : (
              zones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{zone.name}</p>
                    <p className="text-sm text-muted-foreground">{zone.city}</p>
                    <Badge variant="secondary" className="mt-2">
                      <Monitor className="h-3 w-3 mr-1" />
                      {zone.screenIds.length}{" "}
                      {zone.screenIds.length === 1 ? "screen" : "screens"}
                    </Badge>
                  </div>
                  <div className="w-full sm:w-64 shrink-0">
                    <Select
                      value={zone.playlistId ?? NONE_VALUE}
                      onValueChange={(value) => handleZoneAssign(zone.id, value, zone.name)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select playlist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>No playlist</SelectItem>
                        {playlists.map((pl) => (
                          <SelectItem key={pl.id} value={pl.id}>
                            {pl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="groups" className="space-y-3">
            {groups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No screen groups yet. Create groups under Screens → Groups.
              </p>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{group.name}</p>
                    {group.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    <Badge variant="secondary" className="mt-2">
                      <Monitor className="h-3 w-3 mr-1" />
                      {group.screenIds.length}{" "}
                      {group.screenIds.length === 1 ? "screen" : "screens"}
                    </Badge>
                  </div>
                  <div className="w-full sm:w-64 shrink-0">
                    <Select
                      value={group.playlistId ?? NONE_VALUE}
                      onValueChange={(value) => handleGroupAssign(group.id, value, group.name)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select playlist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE}>No playlist</SelectItem>
                        {playlists.map((pl) => (
                          <SelectItem key={pl.id} value={pl.id}>
                            {pl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
