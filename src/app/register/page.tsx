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
import { signUp } from "@/features/auth/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { getPortalHome } from "@/lib/roles";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setLoading(true);
    try {
      const user = await signUp(data.email, data.password, data.name, "advertiser");
      setUser(user);
      toast.success("Client account created! Check your email to verify.");
      router.push(getPortalHome(user.role));
    } catch {
      toast.error("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Create client account</h1>
          <p className="text-sm text-muted-foreground">
            Register to book ad slots, manage campaigns, and track your budget
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input {...register("name")} placeholder="Your name" className="mt-1.5" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input {...register("email")} type="email" placeholder="you@company.ap.in" className="mt-1.5" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Password</Label>
              <Input {...register("password")} type="password" placeholder="Min. 8 characters" className="mt-1.5" />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Client Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Admin accounts are created by your platform administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
