import { PlaylistEditorPage } from "@/components/playlists/playlist-editor";

export default function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  return <PlaylistEditorPage params={params} mode="view" />;
}
