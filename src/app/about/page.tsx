import { TopNavbar } from "@/components/layout/dashboard-navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <h1 className="text-4xl font-bold">About AdFlow Enterprise</h1>
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>
            AdFlow Enterprise is a production-grade cloud Digital Signage & Advertisement Management Platform
            built for Indian businesses, with deep coverage across Andhra Pradesh — from Visakhapatnam and Vijayawada
            to Guntur, Tirupati, and Amaravati.
          </p>
          <p>
            Built on Firebase with Next.js, our platform delivers real-time screen monitoring,
            campaign management, zone-wise slot booking, playlist building, and analytics in INR —
            all in a modern SaaS experience tailored for the Indian market.
          </p>
          <p>
            Whether you manage 50 screens in one city or hundreds across the state, AdFlow scales with your network.
          </p>
        </div>
      </div>
    </div>
  );
}
