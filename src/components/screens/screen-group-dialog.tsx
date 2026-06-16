"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createScreenGroup,
  updateScreenGroup,
  deleteScreenGroup,
} from "@/services/screen-management-service";
import type { Screen, ScreenGroup } from "@/types";

interface ScreenGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  screens: Screen[];
  /** When set, dialog opens in edit mode */
  group?: ScreenGroup | null;
}

function ScreenGroupForm({
  group,
  screens,
  onClose,
}: {
  group: ScreenGroup | null;
  screens: Screen[];
  onClose: () => void;
}) {
  const isEdit = Boolean(group);
  const [name, setName] = useState(() => group?.name ?? "");
  const [description, setDescription] = useState(() => group?.description ?? "");
  const [screenIds, setScreenIds] = useState<string[]>(() =>
    group ? [...group.screenIds] : []
  );
  const [loading, setLoading] = useState(false);

  function toggleScreen(id: string) {
    setScreenIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (screenIds.length === 0) {
      toast.error("Select at least one screen");
      return;
    }

    setLoading(true);
    try {
      if (isEdit && group) {
        await updateScreenGroup(group.id, { name, description, screenIds });
        toast.success(`Group "${name}" updated`);
      } else {
        await createScreenGroup({ name, description, screenIds });
        toast.success(`Group "${name}" created with ${screenIds.length} screens`);
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update group" : "Failed to create group");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!group) return;
    if (!confirm(`Delete group "${group.name}"? This cannot be undone.`)) return;

    setLoading(true);
    try {
      await deleteScreenGroup(group.id);
      toast.success(`Group "${group.name}" deleted`);
      onClose();
    } catch {
      toast.error("Failed to delete group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Group Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Coastal Andhra"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Vizag and Kakinada corridor"
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Screens in group</Label>
        <div className="mt-2 max-h-48 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
          {screens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No screens available</p>
          ) : (
            screens.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={screenIds.includes(s.id)}
                  onChange={() => toggleScreen(s.id)}
                />
                <span>{s.name}</span>
                <span className="text-muted-foreground text-xs">({s.city})</span>
              </label>
            ))
          )}
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        {isEdit && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            Delete
          </Button>
        )}
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Group"}
        </Button>
      </div>
    </form>
  );
}

export function ScreenGroupDialog({
  open,
  onOpenChange,
  screens,
  group = null,
}: ScreenGroupDialogProps) {
  const isEdit = Boolean(group);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Screen Group" : "Create Screen Group"}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {isEdit
              ? "Update name, description, or screens in this group"
              : "Bundle screens for campaigns and scheduling"}
          </p>
        </DialogHeader>
        {open ? (
          <ScreenGroupForm
            key={group?.id ?? "new"}
            group={group}
            screens={screens}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/** @deprecated Use ScreenGroupDialog */
export function CreateGroupDialog(props: Omit<ScreenGroupDialogProps, "group">) {
  return <ScreenGroupDialog {...props} group={null} />;
}
