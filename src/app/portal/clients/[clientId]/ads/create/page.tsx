"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { SlotBookingCalendar } from "@/components/client/slot-booking-calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookings, useClientAccountById } from "@/hooks/use-bookings";
import { bookAdSlot } from "@/services/booking-service";
import { mockZones, mockScreens } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminCreateClientAdPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const router = useRouter();
  const client = useClientAccountById(clientId);
  const { bookings } = useBookings();
  const [title, setTitle] = useState("");

  if (!client) return null;

  const handleCreate = () => {
    toast.success(`Ad "${title || "New Ad"}" created for ${client.companyName}`);
    router.push(`/portal/clients/${client.id}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Create Ad for ${client.companyName}`}
        description={`Budget remaining: ${formatCurrency(client.budget - client.budgetUsed)} · ${client.activeAds}/${client.maxAds} ads`}
        breadcrumbs={[
          { label: "Clients", href: "/portal/clients" },
          { label: client.companyName, href: `/portal/clients/${client.id}` },
          { label: "Create Ad" },
        ]}
      />

      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Ad / Campaign Name</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Holiday Campaign" className="mt-1.5" /></div>
          <div><Label>Description</Label><Input className="mt-1.5" /></div>
          <div>
            <Label>Priority</Label>
            <Select defaultValue="1">
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">High (1)</SelectItem>
                <SelectItem value="2">Medium (2)</SelectItem>
                <SelectItem value="3">Low (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Date</Label><Input type="date" className="mt-1.5" /></div>
            <div><Label>End Date</Label><Input type="date" className="mt-1.5" /></div>
          </div>
          <Button onClick={handleCreate}>Create Ad</Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-4">Set Ad Schedule (zone & screen slots)</h3>
        <SlotBookingCalendar
          zones={mockZones}
          screens={mockScreens}
          bookings={bookings}
          currentAdvertiserId={client.id}
          allowedZoneIds={client.zoneIds}
          budgetRemaining={client.budget - client.budgetUsed}
          onBook={(input) => bookAdSlot({ ...input, title: title || input.title, createdBy: "admin" })}
        />
      </div>
    </div>
  );
}
