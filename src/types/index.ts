import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "super_admin" | "manager" | "operator" | "advertiser";

export type ScreenStatus = "online" | "offline";
export type MediaType = "image" | "video" | "gif" | "poster";
export type CampaignStatus = "draft" | "active" | "scheduled" | "paused" | "completed" | "expired";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  advertiserId?: string;
  avatar?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Screen {
  id: string;
  name: string;
  pairingCode: string;
  location: string;
  city?: string;
  zoneId?: string;
  status: ScreenStatus;
  resolution: string;
  currentPlaylistId?: string;
  currentMediaId?: string;
  groupId?: string;
  lastSeen: Timestamp | Date;
  health?: ScreenHealth;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface ScreenHealth {
  cpu: number;
  ram: number;
  storage: number;
  temperature?: number;
}

export interface ScreenGroup {
  id: string;
  name: string;
  description?: string;
  screenIds: string[];
  /** Playlist assigned to all screens in this group */
  playlistId?: string;
  createdAt: Timestamp | Date;
}

export interface Media {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  size: number;
  duration?: number;
  tags: string[];
  category?: string;
  uploadedBy: string;
  /** Client advertiser that owns this media */
  advertiserId?: string;
  createdAt: Timestamp | Date;
}

export interface PlaylistItem {
  mediaId: string;
  duration: number;
  order: number;
}

export interface Playlist {
  id: string;
  name: string;
  items: PlaylistItem[];
  loop: boolean;
  shuffle: boolean;
  createdAt: Timestamp | Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  advertiserId: string;
  priority: number;
  status: CampaignStatus;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  screenIds: string[];
  playlistId: string;
  createdAt: Timestamp | Date;
}

export interface Schedule {
  id: string;
  campaignId: string;
  startTime: string;
  endTime: string;
  days: string[];
  createdAt: Timestamp | Date;
}

export type SubscriptionPlan = "starter" | "professional" | "enterprise";

export interface Advertiser {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  /** Subscription plan */
  plan: SubscriptionPlan;
  /** Monthly plan price (INR) */
  planPrice: number;
  /** Next subscription payment due */
  nextPaymentDue?: Timestamp | Date;
  /** Total budget allocated by admin (INR) */
  budget: number;
  /** Amount already spent / booked */
  budgetUsed: number;
  /** Max concurrent ads allowed */
  maxAds: number;
  /** Currently active ad count */
  activeAds: number;
  /** Zone IDs this client can book in */
  zoneIds: string[];
  status: "active" | "suspended" | "pending";
  createdAt?: Timestamp | Date;
}

export interface ClientPayment {
  id: string;
  advertiserId: string;
  amount: number;
  date: Timestamp | Date;
  method: string;
  status: "paid" | "pending" | "failed";
  invoiceId?: string;
}

export type TicketCategory = "billing" | "ads" | "technical" | "other";
export type TicketStatus = "open" | "in_progress" | "resolved";

export interface SupportTicket {
  id: string;
  advertiserId: string;
  subject: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface Zone {
  id: string;
  name: string;
  city: string;
  description?: string;
  screenIds: string[];
  /** Playlist assigned to all screens in this zone */
  playlistId?: string;
  /** Hourly rate for this zone (INR) */
  hourlyRate: number;
  createdAt: Timestamp | Date;
}

export interface AdBooking {
  id: string;
  advertiserId: string;
  campaignId?: string;
  title: string;
  screenId: string;
  zoneId: string;
  date: string;
  startTime: string;
  endTime: string;
  cost: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdBy: "admin" | "client";
  createdAt: Timestamp | Date;
}

export interface PlayLog {
  id: string;
  screenId: string;
  mediaId: string;
  campaignId: string;
  playedAt: Timestamp | Date;
  duration: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "system";
  userId: string;
  read: boolean;
  createdAt: Timestamp | Date;
}

export interface Invoice {
  id: string;
  advertiserId: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export interface AnalyticsSummary {
  totalScreens: number;
  onlineScreens: number;
  offlineScreens: number;
  activeCampaigns: number;
  scheduledCampaigns: number;
  revenue: number;
  todayPlays: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

export interface PlayerCommand {
  screenId: string;
  action: "play" | "pause" | "stop" | "restart" | "refresh" | "mute" | "volume";
  value?: number;
  timestamp: Date;
}
