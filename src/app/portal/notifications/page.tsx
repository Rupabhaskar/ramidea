"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useNotificationStore } from "@/store/notification-store";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotificationStore();

  return (
    <div>
      <PageHeader
        title="Notifications"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Notifications" }]}
        actions={<button onClick={markAllAsRead} className="text-sm text-primary hover:underline">Mark all read</button>}
      />
      <div className="space-y-2">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => markAsRead(n.id)}
            className={cn(
              "w-full text-left rounded-xl border border-border p-4 transition-colors hover:bg-muted/30",
              !n.read && "bg-primary/5 border-primary/10"
            )}
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
            <p className="text-xs text-muted-foreground mt-2">{formatRelative(n.createdAt)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
