"use client";

import { useEffect, useState } from "react";
import { Monitor, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { subscribeToScreens } from "@/services";
import type { Screen } from "@/types";
import { formatRelative } from "@/lib/utils";

export default function PlayerPlayPage() {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const unsubscribe = subscribeToScreens((screens) => {
      const online = screens.find((s) => s.status === "online") ?? screens[0];
      setScreen(online ?? null);
      setLastSync(new Date());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => i + 1);
      setLastSync(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center relative">
        <div className="text-center">
          <Monitor className="h-24 w-24 text-white/20 mx-auto mb-4" />
          <p className="text-2xl font-light">Now Playing</p>
          <p className="text-white/60 mt-2">Ad #{currentIndex + 1}</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              {screen?.status === "online" ? (
                <Wifi className="h-4 w-4 text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm text-white/70">{screen?.name ?? "Unpaired Device"}</span>
            </div>
            <div className="text-sm text-white/50 flex items-center gap-2">
              <RefreshCw className="h-3 w-3" />
              Last sync: {formatRelative(lastSync)}
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-3 flex justify-between text-xs text-white/40">
            <span>Current Playlist: {screen?.currentPlaylistId ?? "—"}</span>
            <span>Next Ad: #{currentIndex + 2}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
