"use client";

import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";

export function UserDropdown({ onLogout }: { onLogout: () => void }) {
  const user = useAuthStore((s) => s.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl p-1 hover:bg-accent transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getInitials(user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{user?.name}</span>
            <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
            <span className="text-xs font-normal text-primary mt-0.5">
              {ROLE_LABELS[user?.role ?? "operator"]}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/portal/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/portal/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
