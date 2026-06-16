"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebarStore } from "@/store/sidebar-store";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { mockActivities } from "@/lib/mock-data";

export function ActivityDrawer() {
  const { activityDrawerOpen, setActivityDrawerOpen } = useSidebarStore();

  return (
    <AnimatePresence>
      {activityDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setActivityDrawerOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-border bg-card"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <h2 className="font-semibold">Activity Feed</h2>
              <Button variant="ghost" size="icon" onClick={() => setActivityDrawerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)] p-4">
              <ActivityTimeline activities={mockActivities} />
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
