import { TopNavbar } from "@/components/layout/dashboard-navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Calendar, BarChart3, Shield, Zap, Globe } from "lucide-react";

const features = [
  { icon: Monitor, title: "Screen Management", description: "Pair, monitor, and control displays across Vizag, Vijayawada, Guntur, Tirupati and Amaravati with real-time health metrics." },
  { icon: Calendar, title: "Smart Scheduling", description: "Zone-wise slot booking with conflict detection — book hourly slots on screens in your city." },
  { icon: BarChart3, title: "Enterprise Analytics", description: "Revenue in ₹, ad plays, screen uptime, and campaign performance for Indian advertisers." },
  { icon: Shield, title: "Role-Based Access", description: "Admin, Manager, Operator, and Advertiser roles with granular permissions." },
  { icon: Zap, title: "Realtime Control", description: "Play, pause, stop, and refresh screens instantly via Firestore listeners." },
  { icon: Globe, title: "Andhra Pradesh Coverage", description: "Organize screens into groups across coastal, capital, and temple-town corridors of AP." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="text-4xl font-bold">Features</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Everything you need to run a digital signage network across Andhra Pradesh.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-6">
                <f.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
