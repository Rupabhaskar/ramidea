import {
  mockAdvertisers,
  mockClientPayments,
  mockSupportTickets,
} from "@/lib/mock-data";
import { toDate } from "@/lib/utils";
import type { Advertiser, ClientPayment, SupportTicket } from "@/types";

export interface ClientBillingRow {
  clientName: string;
  client: Advertiser;
  lastPayment?: ClientPayment;
  pendingPayment?: ClientPayment;
  openTickets: number;
  totalTickets: number;
}

export function getPaymentsForClient(advertiserId: string): ClientPayment[] {
  return mockClientPayments
    .filter((p) => p.advertiserId === advertiserId)
    .sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime());
}

export function getLastPayment(advertiserId: string): ClientPayment | undefined {
  return getPaymentsForClient(advertiserId)[0];
}

export function getPendingPayment(advertiserId: string): ClientPayment | undefined {
  return getPaymentsForClient(advertiserId).find((p) => p.status === "pending");
}

export function getTicketsForClient(advertiserId: string): SupportTicket[] {
  return mockSupportTickets
    .filter((t) => t.advertiserId === advertiserId)
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
}

export function getOpenTicketsForClient(advertiserId: string): SupportTicket[] {
  return getTicketsForClient(advertiserId).filter((t) => t.status !== "resolved");
}

export function getClientBillingRows(): ClientBillingRow[] {
  return mockAdvertisers.map((client) => ({
    clientName: client.companyName,
    client,
    lastPayment: getLastPayment(client.id),
    pendingPayment: getPendingPayment(client.id),
    openTickets: getOpenTicketsForClient(client.id).length,
    totalTickets: getTicketsForClient(client.id).length,
  }));
}

export function getBillingSummary() {
  const rows = getClientBillingRows();
  const monthlyRecurring = rows.reduce((sum, r) => sum + r.client.planPrice, 0);
  const pendingPayments = mockClientPayments.filter((p) => p.status === "pending");
  const openTickets = mockSupportTickets.filter((t) => t.status !== "resolved");

  return {
    activeClients: rows.filter((r) => r.client.status === "active").length,
    monthlyRecurring,
    pendingAmount: pendingPayments.reduce((sum, p) => sum + p.amount, 0),
    pendingCount: pendingPayments.length,
    openTickets: openTickets.length,
  };
}

export function getAdvertiserName(advertiserId: string): string {
  return mockAdvertisers.find((a) => a.id === advertiserId)?.companyName ?? "Unknown Client";
}
