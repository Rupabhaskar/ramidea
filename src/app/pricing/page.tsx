import Link from "next/link";
import { TopNavbar } from "@/components/layout/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const plans = [
  { name: "Starter", price: 7999, screens: 50, features: ["50 screens", "Basic analytics", "Email support", "5 campaigns", "AP city zones"] },
  { name: "Professional", price: 24999, screens: 500, popular: true, features: ["500 screens", "Advanced analytics", "Priority support", "Unlimited campaigns", "All Andhra Pradesh zones"] },
  { name: "Enterprise", price: 79999, screens: 1000, features: ["1,000+ screens", "Custom analytics", "Dedicated support", "SLA guarantee", "White-label", "Pan-India rollout"] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="mt-4 text-muted-foreground">Plans for businesses across Andhra Pradesh — prices in INR</p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? "border-primary ring-2 ring-primary/20" : ""}>
              <CardHeader>
                {plan.popular && <span className="text-xs font-medium text-primary">Most Popular</span>}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{formatCurrency(plan.price)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />{f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
