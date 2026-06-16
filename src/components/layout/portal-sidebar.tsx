"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Monitor,
  Image,
  Megaphone,
  ListMusic,
  Calendar,
  Building2,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Bell,
  Settings,
  ChevronLeft,
  ChevronDown,
  Zap,
  Pin,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { APP_NAME, ADMIN_NAV_ITEMS, CLIENT_NAV_ITEMS } from "@/lib/constants";
import { useSidebarStore } from "@/store/sidebar-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const HOVER_CLOSE_DELAY_MS = 2000;
const RAIL_WIDTH = 72;
const EXPANDED_WIDTH = 256;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Monitor,
  Image,
  Megaphone,
  ListMusic,
  Calendar,
  Building2,
  BarChart3,
  FileText,
  CreditCard,
  Users,
  Bell,
  Settings,
};

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  children?: readonly { title: string; href: string }[];
}

interface PortalSidebarProps {
  navItems: readonly NavItem[];
  badge?: string;
}

interface SidebarPanelProps {
  navItems: readonly NavItem[];
  badge: string;
  expanded: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onNavClick?: () => void;
  showPinButton?: boolean;
}

function SidebarPanel({
  navItems,
  badge,
  expanded,
  isPinned,
  onTogglePin,
  onNavClick,
  showPinButton = true,
}: SidebarPanelProps) {
  const pathname = usePathname();
  const [sections, setSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + "/"))) {
        setSections((prev) => ({ ...prev, [item.title]: true }));
      }
    });
  }, [pathname, navItems]);

  const toggleSection = (title: string) => {
    setSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Zap className="h-5 w-5" />
        </div>
        {expanded && (
          <div className="flex min-w-0 flex-col overflow-hidden">
            <span className="truncate text-sm font-bold tracking-tight">{APP_NAME.split(" ")[0]}</span>
            <span className="truncate text-[10px] text-muted-foreground">{badge}</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] ?? LayoutDashboard;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.href}>
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      title={!expanded ? item.title : undefined}
                      onClick={() => expanded && toggleSection(item.title)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {expanded && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          <ChevronDown
                            className={cn("h-4 w-4 transition-transform", sections[item.title] && "rotate-180")}
                          />
                        </>
                      )}
                    </button>
                    {expanded && sections[item.title] && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onNavClick}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm transition-colors",
                              pathname === child.href
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    title={!expanded ? item.title : undefined}
                    onClick={onNavClick}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {expanded && <span className="truncate">{item.title}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {showPinButton && expanded && (
        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePin}
            className="w-full justify-center"
            title={isPinned ? "Unpin sidebar" : "Pin sidebar open"}
          >
            {isPinned ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Unpin</span>
              </>
            ) : (
              <>
                <Pin className="h-4 w-4" />
                <span className="ml-2">Pin open</span>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
}

export function PortalSidebar({ navItems, badge = "Admin" }: PortalSidebarProps) {
  const { collapsed, toggleCollapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebarStore();
  const [hoverOpen, setHoverOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const isPinned = !collapsed;
  const isDesktopExpanded = isPinned || hoverOpen;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeDesktopSidebar = useCallback(() => {
    clearCloseTimer();
    setHoverOpen(false);
    if (!collapsed) {
      setCollapsed(true);
    }
  }, [clearCloseTimer, collapsed, setCollapsed]);

  const handleMouseEnter = useCallback(() => {
    clearCloseTimer();
    setHoverOpen(true);
  }, [clearCloseTimer]);

  const handleMouseLeave = useCallback(() => {
    if (isPinned) return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setHoverOpen(false);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer, isPinned]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!isDesktopExpanded) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (window.innerWidth < 1024) return;
      const target = event.target as Node;
      if (sidebarRef.current?.contains(target)) return;
      closeDesktopSidebar();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isDesktopExpanded, closeDesktopSidebar]);

  return (
    <>
      {/* Desktop: fixed rail + hover overlay */}
      <div
        className="relative hidden shrink-0 lg:block"
        style={{ width: RAIL_WIDTH }}
      >
        <aside
          ref={sidebarRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/95 glass backdrop-blur-md",
            "transition-[width,box-shadow] duration-200 ease-in-out",
            isDesktopExpanded ? "shadow-xl" : "shadow-none"
          )}
          style={{ width: isDesktopExpanded ? EXPANDED_WIDTH : RAIL_WIDTH }}
        >
          <SidebarPanel
            navItems={navItems}
            badge={badge}
            expanded={isDesktopExpanded}
            isPinned={isPinned}
            onTogglePin={toggleCollapsed}
            onNavClick={() => {
              if (!isPinned) closeDesktopSidebar();
            }}
          />
        </aside>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer — always expanded */}
      <motion.div
        initial={false}
        animate={{ x: mobileOpen ? 0 : -EXPANDED_WIDTH }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card lg:hidden"
      >
        <SidebarPanel
          navItems={navItems}
          badge={badge}
          expanded
          isPinned={false}
          onTogglePin={toggleCollapsed}
          onNavClick={() => setMobileOpen(false)}
          showPinButton={false}
        />
        <div className="border-t border-border p-3">
          <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)} className="w-full justify-center">
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2">Close menu</span>
          </Button>
        </div>
      </motion.div>
    </>
  );
}

export function AppSidebar() {
  return <PortalSidebar navItems={ADMIN_NAV_ITEMS} badge="Admin" />;
}

export function ClientSidebar() {
  return <PortalSidebar navItems={CLIENT_NAV_ITEMS} badge="Client Portal" />;
}
