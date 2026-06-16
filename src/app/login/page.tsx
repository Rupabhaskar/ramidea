"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { signIn, signInWithGoogle } from "@/features/auth/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { getPortalHome } from "@/lib/roles";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      const user = await signIn(data.email, data.password);
      setUser(user);
      toast.success("Welcome back!");
      router.push(getPortalHome(user.role));
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      router.push(getPortalHome(user.role));
    } catch {
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign in to AdFlow</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access the portal</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input {...register("email")} type="email" className="mt-1.5" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Password</Label>
              <Input {...register("password")} type="password" className="mt-1.5" />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleGoogle}>Continue with Google</Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Client demo: email with &quot;heritage&quot; or &quot;advertiser&quot; · Admin: rajesh@adflow.in
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
