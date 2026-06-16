"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  GripVertical,
  Play,
  Trash2,
  Shuffle,
  Repeat,
  Plus,
  FileImage,
  FileVideo,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/ui/data-table";
import { updatePlaylist } from "@/services/playlist-management-service";
import type { Media, MediaType, PlaylistItem } from "@/types";

interface PlaylistBuilderProps {
  playlistId?: string;
  items: PlaylistItem[];
  loop?: boolean;
  shuffle?: boolean;
  media: Media[];
  onItemsChange?: (items: PlaylistItem[]) => void;
}

const MEDIA_FILTERS: Array<MediaType | "all"> = ["all", "image", "video", "poster", "gif"];

export function PlaylistBuilder({
  playlistId,
  items: initialItems,
  loop: initialLoop = true,
  shuffle: initialShuffle = false,
  media,
  onItemsChange,
}: PlaylistBuilderProps) {
  const [items, setItems] = useState(initialItems);
  const [loop, setLoop] = useState(initialLoop);
  const [shuffle, setShuffle] = useState(initialShuffle);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");

  useEffect(() => {
    setItems(initialItems);
    setLoop(initialLoop);
    setShuffle(initialShuffle);
  }, [initialItems, initialLoop, initialShuffle]);

  const mediaById = useMemo(
    () => Object.fromEntries(media.map((m) => [m.id, m])),
    [media]
  );

  const usedMediaIds = useMemo(() => new Set(items.map((i) => i.mediaId)), [items]);

  const filteredMedia = useMemo(() => {
    return media.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || m.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [media, search, typeFilter]);

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  const persist = useCallback(
    async (nextItems: PlaylistItem[], nextLoop = loop, nextShuffle = shuffle) => {
      onItemsChange?.(nextItems);
      if (!playlistId) return;
      try {
        await updatePlaylist(playlistId, {
          items: nextItems,
          loop: nextLoop,
          shuffle: nextShuffle,
        });
      } catch {
        toast.error("Failed to save playlist");
      }
    },
    [playlistId, loop, shuffle, onItemsChange]
  );

  const moveItem = (from: number, to: number) => {
    const next = [...items];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    const reordered = next.map((item, i) => ({ ...item, order: i }));
    setItems(reordered);
    persist(reordered);
  };

  const removeItem = (index: number) => {
    const next = items
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i }));
    setItems(next);
    persist(next);
    toast.success("Removed from playlist");
  };

  const addMedia = (mediaItem: Media) => {
    if (usedMediaIds.has(mediaItem.id)) {
      toast.info("This media is already in the playlist");
      return;
    }
    const next = [
      ...items,
      {
        mediaId: mediaItem.id,
        duration: mediaItem.duration ?? 10,
        order: items.length,
      },
    ];
    setItems(next);
    persist(next);
    toast.success(`Added "${mediaItem.name}"`);
  };

  const handleLoopChange = (checked: boolean) => {
    setLoop(checked);
    persist(items, checked, shuffle);
  };

  const handleShuffleChange = (checked: boolean) => {
    setShuffle(checked);
    persist(items, loop, checked);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Playlist Items</CardTitle>
            <p className="text-sm text-muted-foreground">
              Reorder, remove, or add media from your library below
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-10 text-center">
                <p className="text-sm text-muted-foreground">No items yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pick media from your library on the right
                </p>
              </div>
            ) : (
              items.map((item, index) => {
                const mediaItem = mediaById[item.mediaId];
                return (
                  <div
                    key={`${item.mediaId}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />
                    <span className="text-xs text-muted-foreground w-6 shrink-0">{index + 1}</span>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {mediaItem?.type === "video" ? (
                        <FileVideo className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <FileImage className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {mediaItem?.name ?? item.mediaId}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {mediaItem?.type ?? "media"} · {item.duration}s
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {index > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => moveItem(index, index - 1)}>
                          ↑
                        </Button>
                      )}
                      {index < items.length - 1 && (
                        <Button variant="ghost" size="sm" onClick={() => moveItem(index, index + 1)}>
                          ↓
                        </Button>
                      )}
                      {mediaItem && (
                        <Button variant="ghost" size="icon" asChild title="View media">
                          <Link href={`/portal/media/${mediaItem.id}`}>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="Preview">
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        title="Remove"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-base">Media Library</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Browse your uploaded media and add to this playlist
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/portal/media/upload">Upload</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <SearchBar
              placeholder="Search media..."
              value={search}
              onChange={setSearch}
            />
            <div className="flex flex-wrap gap-2">
              {MEDIA_FILTERS.map((filter) => (
                <Button
                  key={filter}
                  variant={typeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTypeFilter(filter)}
                  className="capitalize"
                >
                  {filter === "all" ? "All" : filter}
                </Button>
              ))}
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
              {filteredMedia.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No media found.{" "}
                  <Link href="/portal/media/upload" className="text-primary hover:underline">
                    Upload media
                  </Link>
                </p>
              ) : (
                filteredMedia.map((m) => {
                  const inPlaylist = usedMediaIds.has(m.id);
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {m.type === "video" ? (
                          <FileVideo className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <FileImage className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/portal/media/${m.id}`}
                          className="text-sm font-medium hover:text-primary truncate block"
                        >
                          {m.name}
                        </Link>
                        <p className="text-xs text-muted-foreground capitalize">
                          {m.type} · {m.duration ?? 10}s
                          {m.category ? ` · ${m.category}` : ""}
                        </p>
                      </div>
                      {inPlaylist ? (
                        <Badge variant="secondary" className="shrink-0">
                          Added
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={() => addMedia(m)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/portal/media">
                Open full media library
                <ExternalLink className="h-3 w-3 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Repeat className="h-4 w-4" /> Loop
              </Label>
              <Switch checked={loop} onCheckedChange={handleLoopChange} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" /> Shuffle
              </Label>
              <Switch checked={shuffle} onCheckedChange={handleShuffleChange} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Duration</p>
            <p className="text-2xl font-bold">
              {Math.floor(totalDuration / 60)}m {totalDuration % 60}s
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="text-sm font-medium">Quick stats</p>
            <p className="text-xs text-muted-foreground">
              {media.length} files in your media library
            </p>
            <p className="text-xs text-muted-foreground">
              {filteredMedia.length} shown with current filters
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
