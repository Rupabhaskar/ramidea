"use client";

import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { onAuthChange } from "@/features/auth/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { subscribeToNotifications } from "@/services";
import { useNotificationStore } from "@/store/notification-store";

function AuthListener({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, user } = useAuthStore();
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  useEffect(() => {
    const unsubscribe = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  useEffect(() => {
    if (!user?.id) return;
    return subscribeToNotifications(user.id, setNotifications);
  }, [user?.id, setNotifications]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthListener>
        {children}
        <Toaster richColors position="top-right" />
      </AuthListener>
    </ThemeProvider>
  );
}
