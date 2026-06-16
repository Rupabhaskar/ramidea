import { AppSidebar } from "@/components/layout/portal-sidebar";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";
import { NotificationDrawer } from "@/components/notifications/notification-drawer";
import { ActivityDrawer } from "@/components/layout/activity-drawer";
import { RoleGuard } from "@/components/layout/role-guard";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowed="admin">
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardNavbar />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        </div>
        <NotificationDrawer />
        <ActivityDrawer />
      </div>
    </RoleGuard>
  );
}
