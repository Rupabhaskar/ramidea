"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScreenGroupDialog } from "@/components/screens/screen-group-dialog";
import { useOpenFromSearchParam } from "@/hooks/use-open-from-search-param";
import { useScreenGroups, useScreens } from "@/hooks/use-screen-management";
import type { ScreenGroup } from "@/types";

function ScreenGroupsPageContent() {
  const searchParams = useSearchParams();
  const wantsCreate = searchParams.get("create") === "1";
  const { groups } = useScreenGroups();
  const { screens } = useScreens();
  const [dialogOpen, setDialogOpen] = useOpenFromSearchParam("create", "1", "/portal/screens/groups");
  const [editingGroup, setEditingGroup] = useState<ScreenGroup | null>(null);
  const [prevWantsCreate, setPrevWantsCreate] = useState(wantsCreate);

  if (wantsCreate !== prevWantsCreate) {
    setPrevWantsCreate(wantsCreate);
    if (wantsCreate) setEditingGroup(null);
  }

  function openCreate() {
    setEditingGroup(null);
    setDialogOpen(true);
  }

  function openEdit(group: ScreenGroup, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditingGroup(group);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Screen Groups"
        description="Organize screens by region or campaign for bulk scheduling"
        breadcrumbs={[{ label: "Screens", href: "/portal/screens" }, { label: "Groups" }]}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {groups.map((group) => {
          const groupScreens = screens.filter((s) => group.screenIds.includes(s.id));
          const screenCount = group.screenIds.length;
          return (
            <Card
              key={group.id}
              className="flex h-full flex-col hover:border-primary/30 transition-colors"
            >
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="min-w-0">
                  <Link
                    href={`/portal/screens/groups/${group.id}`}
                    className="font-semibold hover:text-primary line-clamp-1"
                  >
                    {group.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
                    {group.description || "\u00A0"}
                  </p>
                </div>

                <Badge variant="secondary" className="mt-4 w-fit">
                  {screenCount} {screenCount === 1 ? "screen" : "screens"}
                </Badge>

                <ul className="mt-4 flex-1 min-h-[5.5rem] space-y-1.5 border-t border-border pt-3">
                  {groupScreens.length === 0 ? (
                    <li className="text-sm text-muted-foreground">No screens in this group</li>
                  ) : (
                    <>
                      {groupScreens.slice(0, 3).map((s) => (
                        <li
                          key={s.id}
                          className="text-sm text-muted-foreground truncate leading-snug"
                        >
                          {s.name}
                        </li>
                      ))}
                      {groupScreens.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          +{groupScreens.length - 3} more
                        </li>
                      )}
                    </>
                  )}
                </ul>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full shrink-0"
                  onClick={(e) => openEdit(group, e)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit Group
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ScreenGroupDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        screens={screens}
        group={editingGroup}
      />
    </div>
  );
}

export default function ScreenGroupsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
      <ScreenGroupsPageContent />
    </Suspense>
  );
}
