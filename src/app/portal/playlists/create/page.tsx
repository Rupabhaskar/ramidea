"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PlaylistBuilder } from "@/components/playlists/playlist-builder";
import { mockMedia } from "@/lib/mock-data";

export default function CreatePlaylistPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Playlist"
        description="Add media from your library to build a new playlist"
        breadcrumbs={[
          { label: "Playlists", href: "/portal/playlists" },
          { label: "Create" },
        ]}
      />
      <PlaylistBuilder items={[]} media={mockMedia} />
      <p className="text-sm text-muted-foreground text-center">
        Save playlist naming coming soon —{" "}
        <Link href="/portal/playlists" className="text-primary hover:underline">
          return to playlists
        </Link>
      </p>
    </div>
  );
}
