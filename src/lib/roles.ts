import type { UserRole } from "@/types";

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin", "manager", "operator"];
export const CLIENT_ROLES: UserRole[] = ["advertiser"];

export function isAdminRole(role?: string): boolean {
  return ADMIN_ROLES.includes(role as UserRole);
}

export function isClientRole(role?: string): boolean {
  return role === "advertiser";
}

export function getPortalHome(role?: string): string {
  return isClientRole(role) ? "/client/dashboard" : "/portal/dashboard";
}

export function canAccessAdminPortal(role?: string): boolean {
  return isAdminRole(role);
}

export function canAccessClientPortal(role?: string): boolean {
  return isClientRole(role);
}
