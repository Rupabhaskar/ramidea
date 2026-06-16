import { mockMedia } from "@/lib/mock-data";
import type { Media, MediaType } from "@/types";

type MediaListener = (media: Media[]) => void;

let liveMedia: Media[] = mockMedia.map((m) => ({ ...m }));
const mediaListeners = new Set<MediaListener>();

function notifyMedia() {
  mediaListeners.forEach((cb) => cb([...liveMedia]));
}

const DEFAULT_DURATION: Record<MediaType, number> = {
  image: 10,
  video: 30,
  poster: 15,
  gif: 8,
};

export function getLiveMedia(): Media[] {
  return [...liveMedia];
}

export function getMediaForAdvertiser(advertiserId: string): Media[] {
  return liveMedia.filter((m) => m.advertiserId === advertiserId);
}

export function subscribeToMedia(callback: MediaListener): () => void {
  callback([...liveMedia]);
  mediaListeners.add(callback);
  return () => mediaListeners.delete(callback);
}

export type UploadMediaInput = {
  name: string;
  type: MediaType;
  tags: string[];
  uploadedBy: string;
  advertiserId?: string;
  file?: File;
  duration?: number;
};

export async function uploadMedia(input: UploadMediaInput): Promise<Media> {
  const url = input.file ? URL.createObjectURL(input.file) : "/placeholder-media.jpg";
  const media: Media = {
    id: `med-${Date.now()}`,
    name: input.name.trim(),
    type: input.type,
    url,
    size: input.file?.size ?? 1_000_000,
    duration: input.duration ?? DEFAULT_DURATION[input.type],
    tags: input.tags,
    uploadedBy: input.uploadedBy,
    advertiserId: input.advertiserId,
    createdAt: new Date(),
  };
  liveMedia = [media, ...liveMedia];
  notifyMedia();
  return media;
}
