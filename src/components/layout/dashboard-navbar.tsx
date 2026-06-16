"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Moon, Sun, Search, Activity, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebarStore } from "@/store/sidebar-store";
import { useNotificationStore } from "@/store/notification-store";
import { useAuthStore } from "@/store/auth-store";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { logOut } from "@/features/auth/auth-service";

export function DashboardNavbar() {
  const { theme, setTheme } = useTheme();
  const { setMobileOpen, setActivityDrawerOpen } = useSidebarStore();
  const { unreadCount, setDrawerOpen } = useNotificationStore();
  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="relative hidden flex-1 max-w-md md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search screens, campaigns, media..." className="pl-9 bg-muted/50 border-0" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setActivityDrawerOpen(true)}>
          <Activity className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" className="relative" onClick={() => setDrawerOpen(true)}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <UserDropdown onLogout={handleLogout} />
      </div>
    </header>
  );
}

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="text-lg font-bold">
          AdFlow <span className="text-primary">Enterprise</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
          <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
