import { PlaylistEditorPage } from "@/components/playlists/playlist-editor";

export default function EditPlaylistPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  return <PlaylistEditorPage params={params} mode="edit" />;
}
