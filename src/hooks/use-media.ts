"use client";

import { useEffect, useState } from "react";
import type { Media } from "@/types";
import { subscribeToMedia } from "@/services/media-management-service";

export function useMedia(advertiserId?: string) {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToMedia((all) => {
      setMedia(
        advertiserId ? all.filter((m) => m.advertiserId === advertiserId) : all
      );
      setLoading(false);
    });
  }, [advertiserId]);

  return { media, loading };
}
