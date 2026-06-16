import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/constants";
import { mockUser } from "@/lib/mock-data";

const users = [
  { ...mockUser, id: "user-1", role: "admin" as const },
  { id: "user-2", name: "Lakshmi Devi", email: "lakshmi@adflow.in", role: "manager" as const },
  { id: "user-3", name: "Venkat Rao", email: "venkat@adflow.in", role: "operator" as const },
  { id: "user-4", name: "Priya Reddy", email: "priya@heritagefoods.ap.in", role: "advertiser" as const },
];

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        title="Users"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Users" }]}
        actions={
          <Button size="sm" asChild>
            <Link href="/portal/users/create"><Plus className="h-4 w-4 mr-2" />Add User</Link>
          </Button>
        }
      />
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Name</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Email</th>
              <th className="h-11 px-4 text-left font-medium text-muted-foreground">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/portal/users/${u.id}`} className="font-medium hover:text-primary">{u.name}</Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><Badge variant="outline">{ROLE_LABELS[u.role]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
