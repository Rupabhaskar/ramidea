"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  /** When true, sidebar stays narrow (unpinned). When false, sidebar is pinned open on desktop. */
  collapsed: boolean;
  mobileOpen: boolean;
  activityDrawerOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  setActivityDrawerOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: true,
      mobileOpen: false,
      activityDrawerOpen: false,
      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
      setActivityDrawerOpen: (activityDrawerOpen) => set({ activityDrawerOpen }),
    }),
    { name: "adflow-sidebar-v2", partialize: (s) => ({ collapsed: s.collapsed }) }
  )
);
