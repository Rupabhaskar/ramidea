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
import { createZone } from "@/services/screen-management-service";
import { formatCurrency } from "@/lib/utils";

interface CreateZoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateZoneDialog({ open, onOpenChange }: CreateZoneDialogProps) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [hourlyRate, setHourlyRate] = useState("3000");
  const [loading, setLoading] = useState(false);

  function reset() {
    setName("");
    setCity("");
    setDescription("");
    setHourlyRate("3000");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !city.trim()) {
      toast.error("Zone name and city are required");
      return;
    }
    const rate = Number(hourlyRate);
    if (!rate || rate <= 0) {
      toast.error("Enter a valid hourly rate");
      return;
    }

    setLoading(true);
    try {
      await createZone({
        name,
        city,
        description,
        hourlyRate: rate,
      });
      toast.success(`Zone "${name}" created · ${formatCurrency(rate)}/hr`);
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create zone");
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Zone</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add a city or area for screens and client slot booking
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Zone Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Visakhapatnam Central"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Visakhapatnam"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="RK Beach to Jagadamba corridor"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Hourly Slot Rate (INR)</Label>
            <Input
              type="number"
              min={1}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Zone"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
