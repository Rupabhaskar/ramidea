"use client";

import Link from "next/link";
import { use } from "react";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { PlaylistBuilder } from "@/components/playlists/playlist-builder";
import { usePlaylists } from "@/hooks/use-playlists";
import { getPlaylistById } from "@/services/playlist-management-service";
import { mockMedia } from "@/lib/mock-data";

interface PlaylistEditorProps {
  playlistId: string;
  mode?: "view" | "edit";
}

export function PlaylistEditor({ playlistId, mode = "view" }: PlaylistEditorProps) {
  const { playlists } = usePlaylists();
  const playlist = playlists.find((p) => p.id === playlistId) ?? getPlaylistById(playlistId);

  if (!playlist) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Playlist not found.{" "}
        <Link href="/portal/playlists" className="text-primary hover:underline">
          Back to playlists
        </Link>
      </div>
    );
  }

  const isEdit = mode === "edit";

  return (
    <div className="space-y-8">
      <PageHeader
        title={isEdit ? `Edit ${playlist.name}` : playlist.name}
        description={
          isEdit
            ? "Update playlist items from your media library"
            : "Manage playlist content from your media library"
        }
        breadcrumbs={[
          { label: "Playlists", href: "/portal/playlists" },
          ...(isEdit
            ? [
                { label: playlist.name, href: `/portal/playlists/${playlist.id}` },
                { label: "Edit" },
              ]
            : [{ label: playlist.name }]),
        ]}
        actions={
          !isEdit ? (
            <Button size="sm" asChild>
              <Link href={`/portal/playlists/${playlist.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Playlist
              </Link>
            </Button>
          ) : undefined
        }
      />
      <PlaylistBuilder
        playlistId={playlist.id}
        items={playlist.items}
        loop={playlist.loop}
        shuffle={playlist.shuffle}
        media={mockMedia}
      />
    </div>
  );
}

export function PlaylistEditorPage({
  params,
  mode = "view",
}: {
  params: Promise<{ playlistId: string }>;
  mode?: "view" | "edit";
}) {
  const { playlistId } = use(params);
  return <PlaylistEditor playlistId={playlistId} mode={mode} />;
}
