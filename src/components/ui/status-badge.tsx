import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "default" | "secondary" }> = {
  online: { label: "Online", variant: "success" },
  offline: { label: "Offline", variant: "destructive" },
  active: { label: "Active", variant: "success" },
  scheduled: { label: "Scheduled", variant: "warning" },
  draft: { label: "Draft", variant: "secondary" },
  paused: { label: "Paused", variant: "warning" },
  completed: { label: "Completed", variant: "default" },
  expired: { label: "Expired", variant: "destructive" },
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  open: { label: "Open", variant: "warning" },
  in_progress: { label: "In Progress", variant: "default" },
  resolved: { label: "Resolved", variant: "success" },
  suspended: { label: "Suspended", variant: "destructive" },
  failed: { label: "Failed", variant: "destructive" },
  overdue: { label: "Overdue", variant: "destructive" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = statusConfig[status] ?? { label: status, variant: "default" as const };
  return (
    <Badge variant={config.variant} className={cn("capitalize", className)}>
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
