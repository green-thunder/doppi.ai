// Bilingual content for Do'ppi.ai. The `SiteCopy` interface enforces that the
// Uzbek and English trees stay in perfect structural parity (TS fails the build
// if a key is missing in either language).

export type Lang = "uz" | "en";

export interface IconItem {
  icon: string; // lucide icon key, mapped in components
  title: string;
  desc: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Step {
  icon: string;
  title: string;
  desc: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  popular: boolean;
  cta: string;
  features: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface SiteCopy {
  langName: string; // label of the *other* language for the toggle
  a11y: {
    mute: string;
    endCall: string;
    openMenu: string;
    closeMenu: string;
    switchLang: string;
    lightMode: string;
    darkMode: string;
  };
  nav: {
    links: { href: string; label: string }[];
    signIn: string;
    cta: string;
  };
  hero: {
    badge: string;
    titleTop: string;
    titleHighlight: string;
    titleBottom: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Stat[];
    agentName: string;
    agentStatus: string;
    agentCaption: string;
  };
  trust: {
    label: string;
    channels: string[];
  };
  problem: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: IconItem[];
  };
  solution: {
    eyebrow: string;
    title: string;
    subtitle: string;
    centerLabel: string;
    modules: { icon: string; label: string }[];
    note: string;
  };
  features: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: IconItem[];
  };
  how: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: Step[];
  };
  voice: {
    eyebrow: string;
    title: string;
    subtitle: string;
    points: string[];
    transcript: { role: "agent" | "user"; text: string }[];
    callLabel: string;
  };
  results: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stats: Stat[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    trialNote: string;
    perMonth: string;
    popularLabel: string;
    tiers: PricingTier[];
  };
  about: {
    eyebrow: string;
    title: string;
    lead: string;
    vision: string;
    points: { icon: string; title: string; desc: string }[];
    facts: { label: string; value: string }[];
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      phone: string;
      email: string;
      business: string;
      message: string;
      submit: string;
      privacy: string;
    };
    success: {
      title: string;
      subtitle: string;
    };
    email: string;
    phone: string;
    website: string;
    location: string;
    reachTitle: string;
    reachSubtitle: string;
  };
  footer: {
    tagline: string;
    columns: { title: string; links: { href: string; label: string }[] }[];
    contactTitle: string;
    rights: string;
    madeIn: string;
    legal: { label: string; href: string }[];
  };
}

// ---------------------------------------------------------------------------
// UZBEK (default)
// ---------------------------------------------------------------------------
const uz: SiteCopy = {
  langName: "EN",
  a11y: {
    mute: "Mikrofonni o'chirish",
    endCall: "Qo'ng'iroqni tugatish",
    openMenu: "Menyuni ochish",
    closeMenu: "Menyuni yopish",
    switchLang: "Ingliz tiliga o'tish",
    lightMode: "Yorug' rejimga o'tish",
    darkMode: "Tungi rejimga o'tish",
  },
  nav: {
    links: [
      { href: "#features", label: "Imkoniyatlar" },
      { href: "#how", label: "Qanday ishlaydi" },
      { href: "#pricing", label: "Narxlar" },
      { href: "#about", label: "Biz haqimizda" },
      { href: "#contact", label: "Aloqa" },
    ],
    signIn: "Kirish",
    cta: "Bepul boshlash",
  },
  hero: {
    badge: "O'zbekiston uchun AI Marketing tizimi",
    titleTop: "Reklamadan sotuvgacha —",
    titleHighlight: "barchasi bir tizimda",
    titleBottom: "sun'iy intellekt bilan",
    subtitle:
      "Do'ppi.ai — biznesingiz uchun AI marketing operatsion tizimi. Ovozli agent, ijtimoiy tarmoq avtomatizatsiyasi, video va kontent, CRM va chatbotlar — hammasi bitta joyda ishlaydi.",
    ctaPrimary: "Bepul sinovni boshlash",
    ctaSecondary: "Demoni ko'rish",
    stats: [
      { value: "2–5×", label: "ko'proq lead" },
      { value: "70%", label: "vaqt tejaladi" },
      { value: "24/7", label: "AI agentlar ishlaydi" },
    ],
    agentName: "AI Ovozli Agent",
    agentStatus: "Qo'ng'iroq davom etmoqda",
    agentCaption: "Inson kabi gaplashadi, mijozni malakalab, uchrashuv belgilaydi.",
  },
  trust: {
    label: "Barcha kanallar bitta tizimda birlashadi",
    channels: [
      "Instagram",
      "Telegram",
      "WhatsApp",
      "Facebook",
      "SIP Telefoniya",
      "Google Ads",
      "TikTok",
      "YouTube",
    ],
  },
  problem: {
    eyebrow: "Muammo",
    title: "O'zbekistondagi marketing muammolari",
    subtitle:
      "Reklamaga pul ketadi, lekin natija tizimli emas. Ko'p bizneslar bir xil to'siqlarga duch keladi.",
    items: [
      {
        icon: "megaphone-off",
        title: "Reklama ketadi, mijoz yo'qoladi",
        desc: "Reklama ishlaydi, lekin leadlar to'planmaydi va yo'qolib ketadi.",
      },
      {
        icon: "clock-alert",
        title: "Qo'lda ishlash — vaqt va xato",
        desc: "Leadlarni qo'lda boshqarish sekin, charchatadi va xatolarga olib keladi.",
      },
      {
        icon: "unplug",
        title: "Mijoz bilan aloqa uziladi",
        desc: "Follow-up qilinmaydi, mijoz sovib qoladi va raqobatchiga ketadi.",
      },
      {
        icon: "phone-missed",
        title: "Qo'ng'iroqlar javobsiz",
        desc: "Kelgan qo'ng'iroqlarning bir qismi umuman javobsiz qoladi.",
      },
      {
        icon: "split",
        title: "Kanallar alohida ishlaydi",
        desc: "Instagram, Telegram, telefon — hammasi bir-biridan uzilgan.",
      },
      {
        icon: "chart-column-decreasing",
        title: "Natijani tahlil qilish qiyin",
        desc: "Qaysi kanal ishlayapti — aniq emas, qarorlar taxminga asoslanadi.",
      },
    ],
  },
  solution: {
    eyebrow: "Yechim",
    title: "Do'ppi.ai — hammasi bitta AI tizimida",
    subtitle:
      "Reklama, aloqa, sotuv va tahlil — bitta operatsion tizimda birlashtirilgan All-in-One AI marketing platformasi.",
    centerLabel: "Do'ppi.ai",
    modules: [
      { icon: "phone", label: "AI Ovozli Agent" },
      { icon: "share-2", label: "Ijtimoiy tarmoq" },
      { icon: "clapperboard", label: "AI Video & Kontent" },
      { icon: "database", label: "CRM & Lead" },
      { icon: "bot", label: "Chatbotlar" },
      { icon: "headset", label: "SIP Call-markaz" },
    ],
    note: "Bitta panel, bitta baza, bitta jamoa — barcha jarayonlar nazorat ostida.",
  },
  features: {
    eyebrow: "Imkoniyatlar",
    title: "Bitta platforma, oltita kuchli modul",
    subtitle: "Har bir modul sizning o'rningizga ishlaydi va natijani CRM'ga yozadi.",
    items: [
      {
        icon: "phone",
        title: "AI Ovozli Agent",
        desc: "Inson kabi gaplashadi, savollarga javob beradi, mijozni malakalaydi va uchrashuv belgilaydi.",
      },
      {
        icon: "share-2",
        title: "Ijtimoiy tarmoq avtomatizatsiyasi",
        desc: "Instagram, Telegram va WhatsApp'da DM, komment va follow-up avtomatik boshqariladi.",
      },
      {
        icon: "headset",
        title: "SIP Call-markaz",
        desc: "Inbound va outbound qo'ng'iroqlar — barchasi yozib olinadi va CRM'ga saqlanadi.",
      },
      {
        icon: "clapperboard",
        title: "AI Video & Kontent",
        desc: "Reels, reklama, rasm, matn va ovozli dublyaj — kontentni AI yaratadi.",
      },
      {
        icon: "database",
        title: "CRM & Lead boshqaruvi",
        desc: "Har bir lead bazada saqlanadi, malakalanadi va sotuvgacha kuzatiladi.",
      },
      {
        icon: "bot",
        title: "Chatbotlar",
        desc: "Har bir kanalda 24/7 avtomatik javoblar va aqlli suhbatlar.",
      },
    ],
  },
  how: {
    eyebrow: "Qanday ishlaydi",
    title: "Reklamadan sotuvgacha — avtomatik oqim",
    subtitle: "Har bir qadam avtomatlashtirilgan, hech bir lead yo'qolmaydi.",
    steps: [
      { icon: "megaphone", title: "Reklama", desc: "Targetlangan reklama kampaniyasi ishga tushadi." },
      { icon: "user-plus", title: "Lead yig'ish", desc: "Barcha kanallardan leadlar yig'iladi." },
      { icon: "message-square", title: "AI Chatbot & forma", desc: "Chatbot javob beradi, ma'lumot to'playdi." },
      { icon: "phone", title: "AI Ovozli qo'ng'iroq", desc: "Voice agent qo'ng'iroq qilib, mijozni malakalaydi." },
      { icon: "database", title: "CRM'ga saqlash", desc: "Ma'lumot CRM'ga yoziladi va menejerga yetkaziladi." },
      { icon: "handshake", title: "Uchrashuv / sotuv", desc: "Malakalangan lead sotuvga aylanadi." },
      { icon: "life-buoy", title: "Sotuvdan keyingi xizmat", desc: "Avtomatik follow-up va qo'llab-quvvatlash." },
      { icon: "bar-chart-3", title: "Tahlil & hisobot", desc: "Har bir bosqich bo'yicha aniq analitika." },
    ],
  },
  voice: {
    eyebrow: "Asosiy modul",
    title: "AI Ovozli Agent — inson kabi gaplashadi",
    subtitle:
      "Tabiiy ovoz bilan qo'ng'iroq qiladi, mijozni tinglaydi, ma'lumot yig'adi va sotuvni boshlaydi — kechayu kunduz.",
    points: [
      "Tabiiy va ravon suhbat",
      "Savol va ehtiyojni aniqlaydi",
      "Kerakli ma'lumotni yig'adi",
      "Uchrashuvni avtomatik belgilaydi",
      "Hammasini CRM'ga yozadi",
      "Natijani tahlil qilib, hisobot beradi",
    ],
    transcript: [
      { role: "agent", text: "Assalomu alaykum! Do'ppi.ai'dan aloqaga chiqdim. Xizmatimiz haqida gaplashsak bo'ladimi?" },
      { role: "user", text: "Ha, albatta. Narxlari qanday?" },
      { role: "agent", text: "Ajoyib! Bir necha savol berib, sizga mos rejani tavsiya qilaman va uchrashuvga yozib qo'yaman." },
    ],
    callLabel: "Jonli qo'ng'iroq",
  },
  results: {
    eyebrow: "Natijalar",
    title: "Biznesingizni keyingi bosqichga olib chiqing",
    subtitle: "Do'ppi.ai bilan ishlagan bizneslar birinchi oylardanoq o'sishni ko'radi.",
    stats: [
      { value: "2–5×", label: "ko'proq malakali lead" },
      { value: "70%", label: "qo'lda ishga sarflangan vaqt kamayadi" },
      { value: "50%", label: "marketing xarajati qisqaradi" },
      { value: "24/7", label: "uzluksiz avtomatlashtirish" },
      { value: "90%+", label: "mijozlar mamnunligi" },
      { value: "100%", label: "sotuv jarayoni nazorati" },
    ],
  },
  pricing: {
    eyebrow: "Narxlar",
    title: "Biznesingizga mos rejani tanlang",
    subtitle: "Kichik jamoadan yirik korxonagacha — har bir bosqich uchun aniq reja.",
    trialNote: "Barcha rejalar uchun 14 kunlik bepul sinov. Karta talab qilinmaydi.",
    perMonth: "/oy",
    popularLabel: "Eng ommabop",
    tiers: [
      {
        id: "starter",
        name: "Starter",
        price: "$19",
        period: "/oy",
        tagline: "Yangi bizneslar va kichik jamoalar uchun",
        popular: false,
        cta: "Boshlash",
        features: [
          "1 000 tagacha lead boshqaruvi",
          "Kontaktlar bazasi",
          "Oyiga 5 000 ta email",
          "Asosiy hisobotlar",
          "Mobil ilova",
          "1 foydalanuvchi",
        ],
      },
      {
        id: "growth",
        name: "Growth",
        price: "$49",
        period: "/oy",
        tagline: "O'sayotgan bizneslar uchun",
        popular: false,
        cta: "Boshlash",
        features: [
          "10 000 tagacha lead boshqaruvi",
          "Avtomatik email & SMS",
          "Kengaytirilgan hisobotlar",
          "5 tagacha foydalanuvchi",
          "24/7 qo'llab-quvvatlash",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: "$99",
        period: "/oy",
        tagline: "Professional jamoalar uchun",
        popular: true,
        cta: "Boshlash",
        features: [
          "Cheksiz lead boshqaruvi",
          "Marketing avtomatlashuvi",
          "AI tahlil va bashoratlar",
          "Maxsus hisobot paneli",
          "Cheksiz foydalanuvchi",
          "24/7 ustuvor qo'llab-quvvatlash",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: "Maxsus",
        period: "",
        tagline: "Yirik korxonalar va maxsus yechimlar uchun",
        popular: false,
        cta: "Aloqaga chiqish",
        features: [
          "Barcha Pro imkoniyatlari",
          "Maxsus integratsiyalar",
          "AI assistant sozlamalari",
          "Xavfsizlik va kirish darajalari",
          "SLA kafolati",
          "Shaxsiy menejer va trening",
        ],
      },
    ],
  },
  about: {
    eyebrow: "Biz haqimizda",
    title: "O'zbekiston bizneslari uchun kelajak — AI bilan bugundan",
    lead:
      "Do'ppi.ai — har bir biznes uchun sun'iy intellekt orqali marketingni avtomatlashtirishni maksimal darajada osonlashtiruvchi platforma.",
    vision:
      "Bizning vazifamiz — O'zbekistondagi har bir biznesni global darajaga olib chiqish. Mahalliy til, kanallar va telefoniya uchun maxsus qurilgan AI tizimi bilan.",
    points: [
      { icon: "target", title: "Mahalliy bozorga moslangan", desc: "O'zbek va rus tili, mahalliy kanallar va SIP telefoniya bilan ishlaydi." },
      { icon: "sparkles", title: "AI-native texnologiya", desc: "Zamonaviy sun'iy intellekt modellari asosida qurilgan." },
      { icon: "shield-check", title: "Xavfsiz bulut", desc: "Ma'lumotlar himoyalangan, zaxiralanadi va 24/7 mavjud." },
    ],
    facts: [
      { label: "Tashkil topgan", value: "2025" },
      { label: "Joylashuv", value: "Toshkent, O'zbekiston" },
      { label: "Yo'nalish", value: "AI Marketing SaaS" },
    ],
  },
  faq: {
    eyebrow: "Savol-javob",
    title: "Ko'p so'raladigan savollar",
    subtitle: "Do'ppi.ai haqida eng ko'p beriladigan savollarga javoblar.",
    items: [
      {
        q: "Do'ppi.ai o'zbek tilida ishlaydimi?",
        a: "Ha. Ovozli agent, chatbot va kontent o'zbek va rus tillarida ishlaydi — mahalliy bozor uchun maxsus sozlangan.",
      },
      {
        q: "Tizimni ishga tushirish qancha vaqt oladi?",
        a: "Odatda bir necha kun. Jamoamiz kanallaringizni ulab, ovozli agent va CRM'ni biznesingizga moslab beradi.",
      },
      {
        q: "Mavjud CRM yoki kanallarim bilan integratsiya bo'ladimi?",
        a: "Ha. Instagram, Telegram, WhatsApp, SIP telefoniya va boshqa xizmatlar bilan integratsiya qilinadi. Enterprise rejada maxsus integratsiyalar mavjud.",
      },
      {
        q: "Ma'lumotlarim xavfsizmi?",
        a: "Ma'lumotlaringiz himoyalangan bulutda saqlanadi, muntazam zaxiralanadi va faqat sizga tegishli bo'ladi.",
      },
      {
        q: "Bepul sinov qanday ishlaydi?",
        a: "Barcha rejalar uchun 14 kunlik bepul sinov mavjud, karta talab qilinmaydi. Istalgan vaqtda bekor qilishingiz mumkin.",
      },
    ],
  },
  contact: {
    eyebrow: "Aloqa",
    title: "Keling, marketingni birga avtomatlashtiramiz",
    subtitle: "Demoga yoziling — jamoamiz biznesingiz uchun tizimni ko'rsatadi.",
    form: {
      name: "Ismingiz",
      phone: "Telefon raqamingiz",
      email: "Email",
      business: "Biznesingiz nomi",
      message: "Xabaringiz",
      submit: "Demo olish",
      privacy: "Yuborish orqali siz bilan bog'lanishimizga rozilik bildirasiz.",
    },
    success: {
      title: "Rahmat! So'rovingiz qabul qilindi.",
      subtitle: "Jamoamiz bir ish kuni ichida siz bilan bog'lanib, demo uchun vaqt belgilaydi.",
    },
    email: "admin@doppi.ai",
    phone: "+998 93 903 33 01",
    website: "www.doppi.ai",
    location: "Toshkent, O'zbekiston",
    reachTitle: "To'g'ridan-to'g'ri bog'laning",
    reachSubtitle: "Savollaringiz bo'lsa, biz doim aloqadamiz.",
  },
  footer: {
    tagline: "O'zbekiston bizneslari uchun kelajak — AI bilan bugundan.",
    columns: [
      {
        title: "Mahsulot",
        links: [
          { href: "#features", label: "Imkoniyatlar" },
          { href: "#how", label: "Qanday ishlaydi" },
          { href: "#voice", label: "Ovozli agent" },
          { href: "#pricing", label: "Narxlar" },
        ],
      },
      {
        title: "Kompaniya",
        links: [
          { href: "#about", label: "Biz haqimizda" },
          { href: "#results", label: "Natijalar" },
          { href: "#contact", label: "Aloqa" },
        ],
      },
    ],
    contactTitle: "Aloqa",
    rights: "© 2026 Do'ppi.ai. Barcha huquqlar himoyalangan.",
    madeIn: "Toshkentda mehr bilan yaratilgan",
    legal: [
      { label: "Maxfiylik siyosati", href: "/privacy" },
      { label: "Foydalanish shartlari", href: "/terms" },
    ],
  },
};

// ---------------------------------------------------------------------------
// ENGLISH
// ---------------------------------------------------------------------------
const en: SiteCopy = {
  langName: "UZ",
  a11y: {
    mute: "Mute microphone",
    endCall: "End call",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchLang: "Switch to Uzbek",
    lightMode: "Switch to light mode",
    darkMode: "Switch to dark mode",
  },
  nav: {
    links: [
      { href: "#features", label: "Features" },
      { href: "#how", label: "How it works" },
      { href: "#pricing", label: "Pricing" },
      { href: "#about", label: "About" },
      { href: "#contact", label: "Contact" },
    ],
    signIn: "Sign in",
    cta: "Start free",
  },
  hero: {
    badge: "The AI Marketing OS for Uzbekistan",
    titleTop: "From ad to sale —",
    titleHighlight: "all in one system",
    titleBottom: "powered by AI",
    subtitle:
      "Do'ppi.ai is the AI marketing operating system for your business. Voice agent, social media automation, video & content, CRM and chatbots — all working together in one place.",
    ctaPrimary: "Start free trial",
    ctaSecondary: "Watch demo",
    stats: [
      { value: "2–5×", label: "more leads" },
      { value: "70%", label: "time saved" },
      { value: "24/7", label: "AI agents working" },
    ],
    agentName: "AI Voice Agent",
    agentStatus: "Call in progress",
    agentCaption: "Talks like a human, qualifies the lead, and books the meeting.",
  },
  trust: {
    label: "Every channel, unified in one system",
    channels: [
      "Instagram",
      "Telegram",
      "WhatsApp",
      "Facebook",
      "SIP Telephony",
      "Google Ads",
      "TikTok",
      "YouTube",
    ],
  },
  problem: {
    eyebrow: "The problem",
    title: "Marketing is broken for most businesses",
    subtitle:
      "Ad budgets are spent, but results aren't systematic. Most teams hit the same walls again and again.",
    items: [
      {
        icon: "megaphone-off",
        title: "Ads run, customers slip away",
        desc: "Campaigns drive traffic, but leads aren't captured and quietly disappear.",
      },
      {
        icon: "clock-alert",
        title: "Manual work — slow and error-prone",
        desc: "Handling leads by hand is slow, exhausting, and full of mistakes.",
      },
      {
        icon: "unplug",
        title: "Conversations go cold",
        desc: "No follow-up means prospects lose interest and go to a competitor.",
      },
      {
        icon: "phone-missed",
        title: "Calls go unanswered",
        desc: "A share of inbound calls are never picked up — and never called back.",
      },
      {
        icon: "split",
        title: "Channels work in silos",
        desc: "Instagram, Telegram, phone — everything is disconnected.",
      },
      {
        icon: "chart-column-decreasing",
        title: "Results are hard to measure",
        desc: "It's unclear what's working, so decisions are based on guesswork.",
      },
    ],
  },
  solution: {
    eyebrow: "The solution",
    title: "Do'ppi.ai — everything in one AI system",
    subtitle:
      "An all-in-one AI marketing platform that unifies advertising, conversations, sales and analytics into a single operating system.",
    centerLabel: "Do'ppi.ai",
    modules: [
      { icon: "phone", label: "AI Voice Agent" },
      { icon: "share-2", label: "Social Automation" },
      { icon: "clapperboard", label: "AI Video & Content" },
      { icon: "database", label: "CRM & Leads" },
      { icon: "bot", label: "Chatbots" },
      { icon: "headset", label: "SIP Call Center" },
    ],
    note: "One dashboard, one database, one team — every process under control.",
  },
  features: {
    eyebrow: "Features",
    title: "One platform, six powerful modules",
    subtitle: "Each module works on your behalf and writes the result straight to your CRM.",
    items: [
      {
        icon: "phone",
        title: "AI Voice Agent",
        desc: "Talks like a human, answers questions, qualifies leads and books meetings.",
      },
      {
        icon: "share-2",
        title: "Social Media Automation",
        desc: "DMs, comments and follow-ups on Instagram, Telegram and WhatsApp — automated.",
      },
      {
        icon: "headset",
        title: "SIP Call Center",
        desc: "Inbound and outbound calls, all recorded and logged into your CRM.",
      },
      {
        icon: "clapperboard",
        title: "AI Video & Content",
        desc: "Reels, ads, images, copy and voiceover — content generated by AI.",
      },
      {
        icon: "database",
        title: "CRM & Lead Management",
        desc: "Every lead captured, scored and tracked from first touch to sale.",
      },
      {
        icon: "bot",
        title: "Chatbots",
        desc: "24/7 automated replies and smart conversations across every channel.",
      },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "From ad to sale — one automated flow",
    subtitle: "Every step is automated, so no lead ever falls through the cracks.",
    steps: [
      { icon: "megaphone", title: "Advertising", desc: "A targeted ad campaign goes live." },
      { icon: "user-plus", title: "Lead capture", desc: "Leads are collected from every channel." },
      { icon: "message-square", title: "AI chatbot & form", desc: "The chatbot replies and gathers details." },
      { icon: "phone", title: "AI voice call", desc: "The voice agent calls and qualifies the lead." },
      { icon: "database", title: "Save to CRM", desc: "Data is logged to CRM and routed to a manager." },
      { icon: "handshake", title: "Meeting / sale", desc: "A qualified lead turns into a sale." },
      { icon: "life-buoy", title: "After-sales service", desc: "Automated follow-up and support." },
      { icon: "bar-chart-3", title: "Analytics & reports", desc: "Clear analytics for every stage." },
    ],
  },
  voice: {
    eyebrow: "Flagship module",
    title: "AI Voice Agent that talks like a human",
    subtitle:
      "It calls with a natural voice, listens to the customer, collects information and starts the sale — around the clock.",
    points: [
      "Natural, fluent conversation",
      "Understands questions and intent",
      "Collects exactly the info you need",
      "Books meetings automatically",
      "Writes everything to your CRM",
      "Analyzes results and reports back",
    ],
    transcript: [
      { role: "agent", text: "Hi! This is Do'ppi.ai reaching out. Do you have a moment to talk about our service?" },
      { role: "user", text: "Sure. What does it cost?" },
      { role: "agent", text: "Great! I'll ask a couple of questions, recommend the right plan, and book you a meeting." },
    ],
    callLabel: "Live call",
  },
  results: {
    eyebrow: "Results",
    title: "Take your business to the next level",
    subtitle: "Businesses running on Do'ppi.ai see growth from the very first months.",
    stats: [
      { value: "2–5×", label: "more qualified leads" },
      { value: "70%", label: "less time on manual work" },
      { value: "50%", label: "lower marketing cost" },
      { value: "24/7", label: "always-on automation" },
      { value: "90%+", label: "customer satisfaction" },
      { value: "100%", label: "pipeline visibility" },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Choose the plan that fits your business",
    subtitle: "From a small team to a large enterprise — a clear plan for every stage.",
    trialNote: "14-day free trial on every plan. No credit card required.",
    perMonth: "/mo",
    popularLabel: "Most popular",
    tiers: [
      {
        id: "starter",
        name: "Starter",
        price: "$19",
        period: "/mo",
        tagline: "For new businesses and small teams",
        popular: false,
        cta: "Get started",
        features: [
          "Up to 1,000 leads managed",
          "Contacts database",
          "5,000 emails per month",
          "Core reports",
          "Mobile app",
          "1 user",
        ],
      },
      {
        id: "growth",
        name: "Growth",
        price: "$49",
        period: "/mo",
        tagline: "For growing businesses",
        popular: false,
        cta: "Get started",
        features: [
          "Up to 10,000 leads managed",
          "Automated email & SMS",
          "Advanced reports",
          "Up to 5 users",
          "24/7 support",
        ],
      },
      {
        id: "pro",
        name: "Pro",
        price: "$99",
        period: "/mo",
        tagline: "For professional teams",
        popular: true,
        cta: "Get started",
        features: [
          "Unlimited lead management",
          "Marketing automation",
          "AI analytics & forecasting",
          "Custom reporting dashboard",
          "Unlimited users",
          "24/7 priority support",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: "Custom",
        period: "",
        tagline: "For large enterprises and custom solutions",
        popular: false,
        cta: "Contact us",
        features: [
          "Everything in Pro",
          "Custom integrations",
          "AI assistant configuration",
          "Security & access levels",
          "SLA guarantee",
          "Dedicated manager & training",
        ],
      },
    ],
  },
  about: {
    eyebrow: "About us",
    title: "The future for Uzbekistan's businesses — with AI, starting today",
    lead:
      "Do'ppi.ai makes AI-powered marketing automation effortless for every business — from the first ad to the closed sale.",
    vision:
      "Our mission is to take every business in Uzbekistan to the global stage, with an AI system purpose-built for local language, channels and telephony.",
    points: [
      { icon: "target", title: "Built for the local market", desc: "Works in Uzbek and Russian, with local channels and SIP telephony." },
      { icon: "sparkles", title: "AI-native technology", desc: "Built on modern artificial-intelligence models." },
      { icon: "shield-check", title: "Secure cloud", desc: "Data is protected, backed up and available 24/7." },
    ],
    facts: [
      { label: "Founded", value: "2025" },
      { label: "Location", value: "Tashkent, Uzbekistan" },
      { label: "Category", value: "AI Marketing SaaS" },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Answers to the most common questions about Do'ppi.ai.",
    items: [
      {
        q: "Does Do'ppi.ai work in Uzbek?",
        a: "Yes. The voice agent, chatbot and content work in Uzbek and Russian — tuned specifically for the local market.",
      },
      {
        q: "How long does it take to get set up?",
        a: "Usually a few days. Our team connects your channels and configures the voice agent and CRM for your business.",
      },
      {
        q: "Does it integrate with my existing CRM and channels?",
        a: "Yes. It integrates with Instagram, Telegram, WhatsApp, SIP telephony and more. Custom integrations are available on the Enterprise plan.",
      },
      {
        q: "Is my data secure?",
        a: "Your data is stored in a protected cloud, backed up regularly, and always belongs to you.",
      },
      {
        q: "How does the free trial work?",
        a: "Every plan includes a 14-day free trial with no credit card required. You can cancel anytime.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's automate your marketing together",
    subtitle: "Book a demo — our team will show you the system built for your business.",
    form: {
      name: "Your name",
      phone: "Phone number",
      email: "Email",
      business: "Business name",
      message: "Your message",
      submit: "Get a demo",
      privacy: "By submitting, you agree to let us contact you.",
    },
    success: {
      title: "Thank you! Your request has been received.",
      subtitle: "Our team will reach out within one business day to schedule your demo.",
    },
    email: "admin@doppi.ai",
    phone: "+998 93 903 33 01",
    website: "www.doppi.ai",
    location: "Tashkent, Uzbekistan",
    reachTitle: "Reach us directly",
    reachSubtitle: "Have a question? We're always in touch.",
  },
  footer: {
    tagline: "The future for Uzbekistan's businesses — with AI, starting today.",
    columns: [
      {
        title: "Product",
        links: [
          { href: "#features", label: "Features" },
          { href: "#how", label: "How it works" },
          { href: "#voice", label: "Voice agent" },
          { href: "#pricing", label: "Pricing" },
        ],
      },
      {
        title: "Company",
        links: [
          { href: "#about", label: "About" },
          { href: "#results", label: "Results" },
          { href: "#contact", label: "Contact" },
        ],
      },
    ],
    contactTitle: "Contact",
    rights: "© 2026 Do'ppi.ai. All rights reserved.",
    madeIn: "Made with care in Tashkent",
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
};

export const content: Record<Lang, SiteCopy> = { uz, en };
