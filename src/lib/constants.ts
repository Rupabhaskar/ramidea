export const APP_NAME = "AdFlow Enterprise";
export const APP_DESCRIPTION =
  "Digital Signage & Advertisement Management Platform for Andhra Pradesh and across India";

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  super_admin: "Super Admin",
  manager: "Manager",
  operator: "Operator",
  advertiser: "Advertiser",
};

export const STORAGE_PATHS = {
  images: "media/images",
  videos: "media/videos",
  posters: "media/posters",
  thumbnails: "media/thumbnails",
  playerCache: "player/cache",
} as const;

export const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

export const PLAN_PRICES = {
  starter: 7999,
  professional: 24999,
  enterprise: 79999,
} as const;

export const PLAN_ORDER = ["starter", "professional", "enterprise"] as const;

export interface PlanDefinition {
  id: (typeof PLAN_ORDER)[number];
  label: string;
  price: number;
  maxAds: number;
  maxScreens: number;
  maxZones: number;
  maxCampaigns: number | "unlimited";
  mediaStorageGb: number;
  support: string;
  features: string[];
  popular?: boolean;
}

export const PLAN_DEFINITIONS: Record<(typeof PLAN_ORDER)[number], PlanDefinition> = {
  starter: {
    id: "starter",
    label: "Starter",
    price: PLAN_PRICES.starter,
    maxAds: 5,
    maxScreens: 50,
    maxZones: 3,
    maxCampaigns: 5,
    mediaStorageGb: 5,
    support: "Email support",
    features: [
      "Up to 5 active ads",
      "3 AP city zones",
      "50 screens",
      "5 campaigns",
      "5 GB media storage",
    ],
  },
  professional: {
    id: "professional",
    label: "Professional",
    price: PLAN_PRICES.professional,
    maxAds: 10,
    maxScreens: 500,
    maxZones: 10,
    maxCampaigns: "unlimited",
    mediaStorageGb: 25,
    support: "Priority support",
    popular: true,
    features: [
      "Up to 10 active ads",
      "All Andhra Pradesh zones",
      "500 screens",
      "Unlimited campaigns",
      "25 GB media storage",
    ],
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    price: PLAN_PRICES.enterprise,
    maxAds: 20,
    maxScreens: 1000,
    maxZones: 999,
    maxCampaigns: "unlimited",
    mediaStorageGb: 100,
    support: "Dedicated account manager",
    features: [
      "Up to 20 active ads",
      "Pan-India zones",
      "1,000+ screens",
      "Unlimited campaigns",
      "100 GB media storage",
      "SLA & white-label options",
    ],
  },
};

export const COLLECTIONS = {
  users: "users",
  screens: "screens",
  screenGroups: "screenGroups",
  media: "media",
  campaigns: "campaigns",
  playlists: "playlists",
  schedules: "schedules",
  advertisers: "advertisers",
  playLogs: "playLogs",
  notifications: "notifications",
  playerCommands: "playerCommands",
  adBookings: "adBookings",
} as const;

export const ADMIN_NAV_ITEMS = [
  { title: "Dashboard", href: "/portal/dashboard", icon: "LayoutDashboard" },
  {
    title: "Screens",
    href: "/portal/screens",
    icon: "Monitor",
    children: [
      { title: "All Screens", href: "/portal/screens" },
      // { title: "Add Screen", href: "/portal/screens?add=1" },
      { title: "Screen Groups", href: "/portal/screens/groups" },
      { title: "Zones", href: "/portal/zones" },
      // { title: "Create Zone", href: "/portal/zones?create=1" },
    ],
  },
  { title: "Media Library", href: "/portal/media", icon: "Image" },
  { title: "Campaigns", href: "/portal/campaigns", icon: "Megaphone" },
  { title: "Playlists", href: "/portal/playlists", icon: "ListMusic" },
  { title: "Schedules", href: "/portal/schedules", icon: "Calendar" },
  {
    title: "Clients",
    href: "/portal/clients",
    icon: "Building2",
    children: [
      { title: "All Clients", href: "/portal/clients" },
      // { title: "Add Client", href: "/portal/clients?create=1" },
    ],
  },
  { title: "Analytics", href: "/portal/analytics", icon: "BarChart3" },
  {
    title: "Reports",
    href: "/portal/reports",
    icon: "FileText",
    children: [
      { title: "Proof of Play", href: "/portal/reports/proof-of-play" },
      { title: "Screens", href: "/portal/reports/screens" },
      { title: "Revenue", href: "/portal/reports/revenue" },
    ],
  },
  {
    title: "Billing",
    href: "/portal/billing",
    icon: "CreditCard",
    children: [
      { title: "Overview", href: "/portal/billing" },
      { title: "Clients", href: "/portal/billing/clients" },
      { title: "Invoices", href: "/portal/billing/invoices" },
      { title: "Payments", href: "/portal/billing/payments" },
      { title: "Tickets", href: "/portal/billing/tickets" },
    ],
  },
  { title: "Users", href: "/portal/users", icon: "Users" },
  { title: "Notifications", href: "/portal/notifications", icon: "Bell" },
  {
    title: "Settings",
    href: "/portal/settings",
    icon: "Settings",
    children: [
      { title: "General", href: "/portal/settings/general" },
      { title: "Security", href: "/portal/settings/security" },
      { title: "Storage", href: "/portal/settings/storage" },
      { title: "Email", href: "/portal/settings/email" },
      { title: "API", href: "/portal/settings/api" },
    ],
  },
] as const;

export const CLIENT_NAV_ITEMS = [
  { title: "Dashboard", href: "/client/dashboard", icon: "LayoutDashboard" },
  { title: "My Ads", href: "/client/ads", icon: "Megaphone" },
  { title: "Book Slots", href: "/client/schedule", icon: "Calendar" },
  { title: "My Media", href: "/client/media", icon: "Image" },
  { title: "Billing", href: "/client/billing", icon: "CreditCard" },
  { title: "Notifications", href: "/client/notifications", icon: "Bell" },
] as const;
