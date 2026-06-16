"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <PageHeader title="Profile" breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Profile" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials(user?.name ?? "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-primary">{ROLE_LABELS[user?.role ?? "operator"]}</p>
            </div>
          </div>
          <div><Label>Name</Label><Input defaultValue={user?.name} className="mt-1.5" /></div>
          <div><Label>Email</Label><Input defaultValue={user?.email} type="email" className="mt-1.5" disabled /></div>
          <Button>Update Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
