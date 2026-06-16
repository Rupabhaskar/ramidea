import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TopNavbar } from "@/components/layout/dashboard-navbar";
import { Monitor, Megaphone, BarChart3, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Andhra Pradesh Digital Signage Network
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Manage screens across <span className="text-primary">Andhra Pradesh</span> with one dashboard
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
              AdFlow Enterprise powers digital signage from Visakhapatnam to Amaravati.
              Upload ads, run campaigns, book slots by zone, and control screens remotely — built for Indian businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Built for scale</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Monitor, title: "Screen Management", desc: "Monitor displays across Vizag, Vijayawada, Guntur, Tirupati and Amaravati with real-time health." },
              { icon: Megaphone, title: "Campaign Builder", desc: "Run Sankranti, Ugadi and seasonal campaigns with zone-wise scheduling across AP." },
              { icon: BarChart3, title: "Analytics & Reports", desc: "Track impressions, revenue in ₹, proof-of-play and screen uptime for Indian advertisers." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-8 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
