"use client";

import { motion } from "framer-motion";
import { formatRelative } from "@/lib/utils";
import type { ActivityItem } from "@/types";
import { Monitor, Megaphone, Image, AlertTriangle } from "lucide-react";

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  screen: Monitor,
  campaign: Megaphone,
  media: Image,
  alert: AlertTriangle,
};

export function ActivityTimeline({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-4">
      {activities.map((activity, i) => {
        const Icon = typeIcons[activity.type] ?? Monitor;
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">{formatRelative(activity.timestamp)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
