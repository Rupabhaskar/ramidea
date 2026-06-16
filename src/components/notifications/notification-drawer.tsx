"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/store/notification-store";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function NotificationDrawer() {
  const { notifications, drawerOpen, setDrawerOpen, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-card shadow-soft"
          >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{unreadCount}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all read</Button>
                <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="p-4 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "w-full text-left rounded-xl p-4 transition-colors hover:bg-muted/50",
                        !n.read && "bg-primary/5 border border-primary/10"
                      )}
                    >
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatRelative(n.createdAt)}</p>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function NotificationCenter() {
  return <NotificationDrawer />;
}
