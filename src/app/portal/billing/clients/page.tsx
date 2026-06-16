import { Suspense } from "react";
import BillingClientsPageContent from "./billing-clients-content";

export default function BillingClientsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading...</div>}>
      <BillingClientsPageContent />
    </Suspense>
  );
}
