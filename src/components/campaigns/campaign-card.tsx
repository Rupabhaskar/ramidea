import Link from "next/link";
import { Megaphone, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Campaign } from "@/types";
import { formatDate } from "@/lib/utils";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <Megaphone className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <Link href={`/portal/campaigns/${campaign.id}`} className="font-semibold hover:text-primary">
                {campaign.name}
              </Link>
              {campaign.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{campaign.description}</p>
              )}
            </div>
          </div>
          <StatusBadge status={campaign.status} />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
        </div>
        <div className="mt-2 text-xs">
          <span className="text-muted-foreground">Screens: </span>
          <span className="font-medium">{campaign.screenIds.length}</span>
          <span className="text-muted-foreground ml-3">Priority: </span>
          <span className="font-medium">{campaign.priority}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function CampaignBuilder({ children }: { children?: React.ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
