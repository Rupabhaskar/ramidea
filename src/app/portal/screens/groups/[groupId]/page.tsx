"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScreenGroupDialog } from "@/components/screens/screen-group-dialog";
import { useScreenGroups, useScreens } from "@/hooks/use-screen-management";
import { getScreenGroupById } from "@/services/screen-management-service";
import { useRouter } from "next/navigation";

export default function ScreenGroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const router = useRouter();
  const { groups } = useScreenGroups();
  const { screens } = useScreens();
  const [editOpen, setEditOpen] = useState(false);

  const group = groups.find((g) => g.id === groupId) ?? getScreenGroupById(groupId);
  const groupScreens = screens.filter((s) => group?.screenIds.includes(s.id));

  if (!group) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Group not found.{" "}
        <Link href="/portal/screens/groups" className="text-primary hover:underline">
          Back to groups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={group.name}
        description={group.description}
        breadcrumbs={[
          { label: "Screens", href: "/portal/screens" },
          { label: "Groups", href: "/portal/screens/groups" },
          { label: group.name },
        ]}
        actions={
          <Button size="sm" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Group
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{group.screenIds.length} screens</Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Screens in this group</h3>
            {groupScreens.length === 0 ? (
              <p className="text-sm text-muted-foreground">No screens assigned</p>
            ) : (
              <ul className="space-y-2">
                {groupScreens.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <Link href={`/portal/screens/${s.id}`} className="font-medium hover:text-primary">
                      {s.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{s.city}</span>
                      <StatusBadge status={s.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <ScreenGroupDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open && !groups.find((g) => g.id === groupId)) {
            router.push("/portal/screens/groups");
          }
        }}
        screens={screens}
        group={group}
      />
    </div>
  );
}
