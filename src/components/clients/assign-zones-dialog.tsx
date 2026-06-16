"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateClientZones } from "@/services/booking-service";
import { useZones } from "@/hooks/use-screen-management";
import { formatCurrency } from "@/lib/utils";
import type { Advertiser } from "@/types";

interface AssignZonesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Advertiser | null;
}

export function AssignZonesDialog({ open, onOpenChange, client }: AssignZonesDialogProps) {
  const { zones } = useZones();
  const [zoneIds, setZoneIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && client) {
      setZoneIds([...client.zoneIds]);
    } else if (!open) {
      setZoneIds([]);
    }
  }, [open, client]);

  function toggleZone(zoneId: string) {
    setZoneIds((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!client) return;
    if (zoneIds.length === 0) {
      toast.error("Select at least one zone");
      return;
    }

    setLoading(true);
    try {
      await updateClientZones(client.id, zoneIds);
      toast.success(`Zones updated for ${client.companyName}`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to update zones");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pr-8">
          <DialogTitle>Assign Zones</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {client
              ? `Choose which zones ${client.companyName} can book ads in`
              : "Select zones for this client"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
          <div className="min-w-0">
            <Label>Allowed zones</Label>
            <div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-border p-3">
              {zones.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No zones available. Create zones under Screens → Zones.
                </p>
              ) : (
                zones.map((zone) => (
                  <label
                    key={zone.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 rounded shrink-0"
                      checked={zoneIds.includes(zone.id)}
                      onChange={() => toggleZone(zone.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        {zone.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {zone.city} · {zone.screenIds.length}{" "}
                        {zone.screenIds.length === 1 ? "screen" : "screens"} ·{" "}
                        {formatCurrency(zone.hourlyRate)}/hr
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {zoneIds.length} {zoneIds.length === 1 ? "zone" : "zones"} selected
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 min-w-0"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 min-w-0" disabled={loading || !client}>
              {loading ? "Saving..." : "Save Zones"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
