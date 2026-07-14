import type { ActivityType, LeadSource, Role } from "@prisma/client";
import { tr, type Locale } from "./i18n";

export const ROLES: Role[] = ["OWNER", "ADMIN", "AGENT"];
export const ASSIGNABLE_ROLES: Role[] = ["ADMIN", "AGENT"]; // OWNER is not assignable via UI
export const LEAD_SOURCES: LeadSource[] = [
  "WEBSITE",
  "MANUAL",
  "REFERRAL",
  "SOCIAL",
  "IMPORT",
  "OTHER",
];
export const ACTIVITY_TYPES: ActivityType[] = ["CALL", "MEETING", "EMAIL", "TASK", "NOTE"];

export const CURRENCIES = ["UZS", "USD", "EUR", "RUB"] as const;

/** Palette used for user avatars and stage colors. */
export const AVATAR_COLORS = [
  "#E6A92C",
  "#6366F1",
  "#0EA5E9",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B5CF6",
  "#14B8A6",
];

export const INDUSTRIES = [
  "Retail",
  "E-commerce",
  "Restaurant",
  "Beauty & Health",
  "Real Estate",
  "Education",
  "Logistics",
  "Manufacturing",
  "Services",
  "Finance",
  "IT & Software",
  "Other",
];

/**
 * Default pipeline seeded for every new organization. Names are localized to the
 * creator's chosen locale (free-text afterwards; users can rename in Settings).
 */
export function defaultStages(locale: Locale) {
  const s = (uz: string, en: string) => tr(locale, uz, en);
  return [
    { name: s("Yangi", "New"), color: "#6366F1", isWon: false, isLost: false },
    { name: s("Bog'lanildi", "Contacted"), color: "#0EA5E9", isWon: false, isLost: false },
    { name: s("Taklif yuborildi", "Proposal sent"), color: "#E6A92C", isWon: false, isLost: false },
    { name: s("Muzokara", "Negotiation"), color: "#F59E0B", isWon: false, isLost: false },
    { name: s("Yutildi", "Won"), color: "#22C55E", isWon: true, isLost: false },
    { name: s("Yo'qotildi", "Lost"), color: "#EF4444", isWon: false, isLost: true },
  ];
}

/** Tailwind-ish color chips for deal status badges. */
export function dealStatusColor(status: string): string {
  switch (status) {
    case "WON":
      return "#22C55E";
    case "LOST":
      return "#EF4444";
    default:
      return "#E6A92C";
  }
}

/** Icon key (lucide) per activity type — resolved in components. */
export const ACTIVITY_ICON: Record<ActivityType, string> = {
  CALL: "Phone",
  MEETING: "Users",
  EMAIL: "Mail",
  TASK: "CheckSquare",
  NOTE: "StickyNote",
};
