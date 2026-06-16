import { Suspense } from "react";
import BillingTicketsPageContent from "./billing-tickets-content";

export default function BillingTicketsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <BillingTicketsPageContent />
    </Suspense>
  );
}
