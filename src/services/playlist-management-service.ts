import { mockPlaylists } from "@/lib/mock-data";
import type { Playlist } from "@/types";

type PlaylistListener = (playlists: Playlist[]) => void;

let livePlaylists: Playlist[] = mockPlaylists.map((p) => ({ ...p }));
const playlistListeners = new Set<PlaylistListener>();

function notifyPlaylists() {
  playlistListeners.forEach((cb) => cb([...livePlaylists]));
}

export function getLivePlaylists(): Playlist[] {
  return [...livePlaylists];
}

export function getPlaylistById(playlistId: string): Playlist | undefined {
  return livePlaylists.find((p) => p.id === playlistId);
}

export function subscribeToPlaylists(callback: PlaylistListener): () => void {
  callback([...livePlaylists]);
  playlistListeners.add(callback);
  return () => playlistListeners.delete(callback);
}

export type CreatePlaylistInput = {
  name: string;
  items?: Playlist["items"];
  loop?: boolean;
  shuffle?: boolean;
};

export async function createPlaylist(input: CreatePlaylistInput): Promise<Playlist> {
  const playlist: Playlist = {
    id: `pl-${Date.now()}`,
    name: input.name.trim(),
    items: input.items ?? [],
    loop: input.loop ?? true,
    shuffle: input.shuffle ?? false,
    createdAt: new Date(),
  };
  livePlaylists = [...livePlaylists, playlist];
  notifyPlaylists();
  return playlist;
}

export type UpdatePlaylistInput = {
  name?: string;
  items?: Playlist["items"];
  loop?: boolean;
  shuffle?: boolean;
};

export async function updatePlaylist(
  playlistId: string,
  updates: UpdatePlaylistInput
): Promise<Playlist> {
  const existing = livePlaylists.find((p) => p.id === playlistId);
  if (!existing) throw new Error("Playlist not found");

  const updated: Playlist = {
    ...existing,
    ...updates,
    name: updates.name?.trim() ?? existing.name,
  };
  livePlaylists = livePlaylists.map((p) => (p.id === playlistId ? updated : p));
  notifyPlaylists();
  return updated;
}
