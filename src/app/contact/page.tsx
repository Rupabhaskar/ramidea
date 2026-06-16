import { TopNavbar } from "@/components/layout/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="mx-auto max-w-xl px-4 py-16 lg:px-8">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-muted-foreground">
          Reach our Andhra Pradesh sales team in Vijayawada or Visakhapatnam.
        </p>
        <Card className="mt-8">
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Name</Label><Input placeholder="Rajesh Kumar" className="mt-1.5" /></div>
              <div><Label>Email</Label><Input type="email" placeholder="you@company.ap.in" className="mt-1.5" /></div>
            </div>
            <div><Label>Company</Label><Input placeholder="Heritage Foods Ltd." className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input placeholder="+91 98765 43210" className="mt-1.5" /></div>
            <div><Label>Message</Label><textarea className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]" placeholder="Tell us about your signage network in Andhra Pradesh..." /></div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
