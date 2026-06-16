import { ClientSidebar } from "@/components/layout/portal-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { NotificationDrawer } from "@/components/notifications/notification-drawer";
import { RoleGuard } from "@/components/layout/role-guard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed="client">
      <div className="flex h-screen overflow-hidden bg-background">
        <ClientSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
        <NotificationDrawer />
      </div>
    </RoleGuard>
  );
}
