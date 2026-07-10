import {
  Phone,
  Share2,
  Clapperboard,
  Database,
  Bot,
  Headset,
  Megaphone,
  Clock,
  Unplug,
  PhoneMissed,
  Split,
  TrendingDown,
  UserPlus,
  MessageSquare,
  Handshake,
  LifeBuoy,
  BarChart3,
  Target,
  Sparkles,
  ShieldCheck,
  Linkedin,
  Send,
  Github,
  Instagram,
  Twitter,
  Mail,
  Globe,
  type LucideIcon,
} from "lucide-react";

// Maps content-layer string keys to Lucide icon components. Keeps the content
// dictionary free of JSX/imports so it can stay pure data.
const iconMap: Record<string, LucideIcon> = {
  phone: Phone,
  "share-2": Share2,
  clapperboard: Clapperboard,
  database: Database,
  bot: Bot,
  headset: Headset,
  "megaphone-off": Megaphone,
  megaphone: Megaphone,
  "clock-alert": Clock,
  unplug: Unplug,
  "phone-missed": PhoneMissed,
  split: Split,
  "chart-column-decreasing": TrendingDown,
  "user-plus": UserPlus,
  "message-square": MessageSquare,
  handshake: Handshake,
  "life-buoy": LifeBuoy,
  "bar-chart-3": BarChart3,
  target: Target,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
  linkedin: Linkedin,
  telegram: Send,
  github: Github,
  instagram: Instagram,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = iconMap[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
