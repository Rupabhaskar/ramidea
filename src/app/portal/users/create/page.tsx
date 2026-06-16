import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateUserPage() {
  return (
    <div>
      <PageHeader title="Add User" breadcrumbs={[{ label: "Users", href: "/portal/users" }, { label: "Create" }]} />
      <Card className="max-w-lg">
        <CardContent className="p-6 space-y-4">
          <div><Label>Name</Label><Input className="mt-1.5" /></div>
          <div><Label>Email</Label><Input type="email" className="mt-1.5" /></div>
          <div><Label>Role</Label>
            <Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="operator">Operator</SelectItem>
                <SelectItem value="advertiser">Advertiser</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>Create User</Button>
        </CardContent>
      </Card>
    </div>
  );
}
