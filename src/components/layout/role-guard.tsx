"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { canAccessAdminPortal, canAccessClientPortal, isClientRole } from "@/lib/roles";
import { LoadingSkeleton } from "@/components/ui/empty-state";

interface RoleGuardProps {
  children: React.ReactNode;
  allowed: "admin" | "client";
}

export function RoleGuard({ children, allowed }: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowed === "admin" && !canAccessAdminPortal(user.role)) {
      router.replace(isClientRole(user.role) ? "/client/dashboard" : "/login");
      return;
    }

    if (allowed === "client" && !canAccessClientPortal(user.role)) {
      router.replace(canAccessAdminPortal(user.role) ? "/portal/dashboard" : "/login");
    }
  }, [user, loading, allowed, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center p-8">
        <LoadingSkeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) return null;
  if (allowed === "admin" && !canAccessAdminPortal(user.role)) return null;
  if (allowed === "client" && !canAccessClientPortal(user.role)) return null;

  return <>{children}</>;
}
