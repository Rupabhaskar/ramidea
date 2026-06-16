"use client";

import { useEffect, useState } from "react";
import type { Playlist } from "@/types";
import { subscribeToPlaylists } from "@/services/playlist-management-service";

export function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToPlaylists((data) => {
      setPlaylists(data);
      setLoading(false);
    });
  }, []);

  return { playlists, loading };
}
