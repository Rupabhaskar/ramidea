import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/constants";
import { mockUser } from "@/lib/mock-data";

export default async function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = { ...mockUser, id: userId };

  return (
    <div>
      <PageHeader title={user.name} breadcrumbs={[{ label: "Users", href: "/portal/users" }, { label: user.name }]} />
      <Card><CardContent className="p-6 space-y-3">
        <p><span className="text-muted-foreground">Email: </span>{user.email}</p>
        <p><span className="text-muted-foreground">Role: </span><Badge variant="outline">{ROLE_LABELS[user.role]}</Badge></p>
      </CardContent></Card>
    </div>
  );
}
