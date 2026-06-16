"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { ClientAccountGate } from "@/components/client/client-account-gate";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClientAccount } from "@/hooks/use-bookings";
import { getZonesForClient } from "@/lib/client-data";
import { formatCurrency } from "@/lib/utils";

export default function ClientCreateAdPage() {
  const router = useRouter();
  const { client, loading, error } = useClientAccount();
  const [submitting, setSubmitting] = useState(false);

  return (
    <ClientAccountGate loading={loading} error={error}>
      {client && (
        <CreateAdForm
          client={client}
          submitting={submitting}
          setSubmitting={setSubmitting}
          onDone={() => router.push("/client/ads")}
        />
      )}
    </ClientAccountGate>
  );
}

function CreateAdForm({
  client,
  submitting,
  setSubmitting,
  onDone,
}: {
  client: NonNullable<ReturnType<typeof useClientAccount>["client"]>;
  submitting: boolean;
  setSubmitting: (v: boolean) => void;
  onDone: () => void;
}) {
  const zones = getZonesForClient(client.id);
  const budgetRemaining = client.budget - client.budgetUsed;

  const handleCreate = () => {
    if (client.activeAds >= client.maxAds) {
      toast.error("You have reached your ad limit. Contact admin to increase.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Ad submitted for approval");
      onDone();
    }, 800);
  };

  return (
    <div>
      <PageHeader
        title="Create Ad"
        description={`Budget remaining: ${formatCurrency(budgetRemaining)}`}
        breadcrumbs={[
          { label: "My Ads", href: "/client/ads" },
          { label: "Create" },
        ]}
      />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Ad Name</Label><Input placeholder="Summer Promotion" className="mt-1.5" /></div>
          <div><Label>Description</Label><Input placeholder="Brief description" className="mt-1.5" /></div>
          <div>
            <Label>Target Zone</Label>
            <Select>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select zone" /></SelectTrigger>
              <SelectContent>
                {zones.map((z) => (
                  <SelectItem key={z.id} value={z.id}>
                    {z.name} ({formatCurrency(z.hourlyRate)}/hr)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Date</Label><Input type="date" className="mt-1.5" /></div>
            <div><Label>End Date</Label><Input type="date" className="mt-1.5" /></div>
          </div>
          <Button onClick={handleCreate} disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Ad"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
