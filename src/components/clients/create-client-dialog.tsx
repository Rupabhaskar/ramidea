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
import { mockZones } from "@/lib/mock-data";
import { DEFAULT_ZONE_IDS } from "@/lib/client-account";
import { formatCurrency } from "@/lib/utils";

interface CreateClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateClientDialog({ open, onOpenChange }: CreateClientDialogProps) {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("5000000");
  const [maxAds, setMaxAds] = useState("10");
  const [zoneIds, setZoneIds] = useState<string[]>([...DEFAULT_ZONE_IDS]);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setCompanyName("");
    setContactName("");
    setEmail("");
    setPhone("");
    setBudget("5000000");
    setMaxAds("10");
    setZoneIds([...DEFAULT_ZONE_IDS]);
  }

  function toggleZone(zoneId: string) {
    setZoneIds((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim()) {
      toast.error("Company name, contact name, and email are required");
      return;
    }
    if (zoneIds.length === 0) {
      toast.error("Select at least one zone");
      return;
    }

    setLoading(true);
    try {
      // TODO: persist to Firestore via advertiserRepo
      await new Promise((r) => setTimeout(r, 400));
      toast.success(`Client "${companyName}" created`);
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error("Failed to create client");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set budget, ad limits, and allowed zones
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Company Name</Label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1.5"
              placeholder="Heritage Foods Ltd."
            />
          </div>
          <div>
            <Label>Contact Name</Label>
            <Input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="mt-1.5"
              placeholder="Priya Reddy"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              placeholder="client@company.ap.in"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5"
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Budget (INR)</Label>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1.5"
                min={0}
              />
            </div>
            <div>
              <Label>Max Ads</Label>
              <Input
                type="number"
                value={maxAds}
                onChange={(e) => setMaxAds(e.target.value)}
                className="mt-1.5"
                min={1}
              />
            </div>
          </div>
          <div>
            <Label>Allowed Zones</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto rounded-lg border border-border p-3">
              {mockZones.map((z) => (
                <label key={z.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={zoneIds.includes(z.id)}
                    onChange={() => toggleZone(z.id)}
                  />
                  {z.name} — {formatCurrency(z.hourlyRate)}/hr
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Client Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
