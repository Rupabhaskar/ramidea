"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockScreens } from "@/lib/mock-data";
import { toast } from "sonner";

export default function EditScreenPage({ params }: { params: Promise<{ screenId: string }> }) {
  const { screenId } = use(params);
  const router = useRouter();
  const screen = mockScreens.find((s) => s.id === screenId) ?? mockScreens[0];

  return (
    <div>
      <PageHeader
        title="Edit Screen"
        breadcrumbs={[
          { label: "Screens", href: "/portal/screens" },
          { label: screen.name, href: `/portal/screens/${screen.id}` },
          { label: "Edit" },
        ]}
      />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Name</Label><Input defaultValue={screen.name} className="mt-1.5" /></div>
          <div><Label>Location</Label><Input defaultValue={screen.location} className="mt-1.5" /></div>
          <div><Label>Resolution</Label><Input defaultValue={screen.resolution} className="mt-1.5" /></div>
          <Button onClick={() => { toast.success("Screen updated"); router.push(`/portal/screens/${screen.id}`); }}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
