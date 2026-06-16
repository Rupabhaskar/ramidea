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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createScreen, pairScreenByCode } from "@/services/screen-management-service";
import type { Zone } from "@/types";

interface AddScreenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zones: Zone[];
  defaultZoneId?: string;
}

export function AddScreenDialog({
  open,
  onOpenChange,
  zones,
  defaultZoneId,
}: AddScreenDialogProps) {
  const [pairingCode, setPairingCode] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [zoneId, setZoneId] = useState(defaultZoneId ?? zones[0]?.id ?? "");
  const [resolution, setResolution] = useState("1920x1080");
  const [loading, setLoading] = useState(false);

  function reset() {
    setPairingCode("");
    setName("");
    setLocation("");
    setZoneId(defaultZoneId ?? zones[0]?.id ?? "");
    setResolution("1920x1080");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !zoneId) {
      toast.error("Name, location, and zone are required");
      return;
    }

    setLoading(true);
    try {
      if (pairingCode.trim()) {
        await pairScreenByCode(pairingCode, name, location, zoneId, resolution);
        toast.success("Screen paired successfully");
      } else {
        await createScreen({
          name,
          location,
          city: zones.find((z) => z.id === zoneId)?.city ?? "",
          zoneId,
          resolution,
        });
        toast.success("Screen added — install player and enter pairing code from device");
      }
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to add screen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Screen</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Pair a player device or register a new display in a zone
          </p>
        </DialogHeader>

        {zones.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            Create a zone first before adding screens.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Pairing Code (from player)</Label>
              <Input
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                placeholder="A7KD92 — leave blank to auto-generate"
                className="mt-1.5 font-mono tracking-widest"
                maxLength={6}
              />
            </div>
            <div>
              <Label>Screen Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vizag RK Beach LED"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="RK Beach Road, Visakhapatnam"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Zone</Label>
              <Select value={zoneId} onValueChange={setZoneId}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z.id} value={z.id}>
                      {z.name} ({z.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resolution</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920x1080">1920×1080 (Full HD)</SelectItem>
                  <SelectItem value="2560x1440">2560×1440 (QHD)</SelectItem>
                  <SelectItem value="3840x2160">3840×2160 (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Saving..." : "Add Screen"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
