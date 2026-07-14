// Shared, framework-agnostic i18n for the CRM. Safe to import from both server
// and client components (no next/headers here).
//
// Two layers:
//   • `dictionaries` — a typed tree of SHARED strings (nav, common actions,
//     enum labels). The `uz` object is the source of truth; `en` must match its
//     shape or the build fails.
//   • `tr(locale, uz, en)` — an inline escape hatch for module-specific strings.
//     Feature modules use this so they never have to edit the shared dictionary
//     (keeps parallel work conflict-free).

export type Locale = "uz" | "en";

export const LOCALES = ["uz", "en"] as const;
export const DEFAULT_LOCALE: Locale = "uz";
export const LOCALE_COOKIE = "doppi_locale";

export function isLocale(v: unknown): v is Locale {
  return v === "uz" || v === "en";
}

/** Pick between an Uzbek and an English string for a given locale. */
export function tr(locale: Locale, uz: string, en: string): string {
  return locale === "en" ? en : uz;
}

const uz = {
  brand: "Do'ppi CRM",
  nav: {
    dashboard: "Boshqaruv paneli",
    contacts: "Kontaktlar",
    companies: "Kompaniyalar",
    deals: "Bitimlar",
    activities: "Vazifalar",
    assistant: "AI yordamchi",
    settings: "Sozlamalar",
    team: "Jamoa",
    pipeline: "Voronka",
    profile: "Profil",
  },
  action: {
    save: "Saqlash",
    saveChanges: "O'zgarishlarni saqlash",
    cancel: "Bekor qilish",
    delete: "O'chirish",
    edit: "Tahrirlash",
    create: "Yaratish",
    add: "Qo'shish",
    new: "Yangi",
    search: "Qidirish",
    filter: "Filtr",
    back: "Orqaga",
    close: "Yopish",
    confirm: "Tasdiqlash",
    remove: "Olib tashlash",
    clear: "Tozalash",
    viewAll: "Barchasini ko'rish",
    export: "Eksport",
    open: "Ochish",
    more: "Yana",
    apply: "Qo'llash",
    invite: "Taklif qilish",
  },
  common: {
    loading: "Yuklanmoqda...",
    saving: "Saqlanmoqda...",
    noResults: "Ma'lumot topilmadi",
    empty: "Hozircha bo'sh",
    required: "Majburiy",
    optional: "ixtiyoriy",
    all: "Barchasi",
    none: "Yo'q",
    unassigned: "Biriktirilmagan",
    owner: "Mas'ul",
    status: "Holat",
    actions: "Amallar",
    createdAt: "Yaratilgan",
    updatedAt: "Yangilangan",
    yes: "Ha",
    no: "Yo'q",
    name: "Nomi",
    email: "Email",
    phone: "Telefon",
    date: "Sana",
    total: "Jami",
    of: "dan",
    results: "natija",
    deleteConfirm: "Rostdan ham o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.",
  },
  auth: {
    signIn: "Kirish",
    signUp: "Ro'yxatdan o'tish",
    signOut: "Chiqish",
    email: "Email",
    password: "Parol",
    name: "Ism",
    fullName: "To'liq ism",
    companyName: "Kompaniya nomi",
    forgotPassword: "Parolni unutdingizmi?",
    noAccount: "Akkauntingiz yo'qmi?",
    haveAccount: "Akkauntingiz bormi?",
    createAccount: "Akkaunt yaratish",
    signingIn: "Kirilmoqda...",
    creating: "Yaratilmoqda...",
    welcomeBack: "Xush kelibsiz",
    getStarted: "Boshlash",
  },
  role: {
    OWNER: "Egasi",
    ADMIN: "Administrator",
    AGENT: "Agent",
  },
  dealStatus: {
    OPEN: "Ochiq",
    WON: "Yutildi",
    LOST: "Yo'qotildi",
  },
  activityType: {
    CALL: "Qo'ng'iroq",
    MEETING: "Uchrashuv",
    EMAIL: "Email",
    TASK: "Vazifa",
    NOTE: "Eslatma",
  },
  source: {
    WEBSITE: "Vebsayt",
    MANUAL: "Qo'lda",
    IMPORT: "Import",
    REFERRAL: "Tavsiya",
    SOCIAL: "Ijtimoiy tarmoq",
    OTHER: "Boshqa",
  },
  toast: {
    created: "Muvaffaqiyatli yaratildi",
    updated: "Muvaffaqiyatli yangilandi",
    deleted: "O'chirildi",
    error: "Xatolik yuz berdi",
    saved: "Saqlandi",
  },
};

export type Dict = typeof uz;

// English must match the Uzbek shape exactly (typed as Dict).
const en: Dict = {
  brand: "Do'ppi CRM",
  nav: {
    dashboard: "Dashboard",
    contacts: "Contacts",
    companies: "Companies",
    deals: "Deals",
    activities: "Activities",
    assistant: "AI assistant",
    settings: "Settings",
    team: "Team",
    pipeline: "Pipeline",
    profile: "Profile",
  },
  action: {
    save: "Save",
    saveChanges: "Save changes",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    add: "Add",
    new: "New",
    search: "Search",
    filter: "Filter",
    back: "Back",
    close: "Close",
    confirm: "Confirm",
    remove: "Remove",
    clear: "Clear",
    viewAll: "View all",
    export: "Export",
    open: "Open",
    more: "More",
    apply: "Apply",
    invite: "Invite",
  },
  common: {
    loading: "Loading...",
    saving: "Saving...",
    noResults: "No results found",
    empty: "Nothing here yet",
    required: "Required",
    optional: "optional",
    all: "All",
    none: "None",
    unassigned: "Unassigned",
    owner: "Owner",
    status: "Status",
    actions: "Actions",
    createdAt: "Created",
    updatedAt: "Updated",
    yes: "Yes",
    no: "No",
    name: "Name",
    email: "Email",
    phone: "Phone",
    date: "Date",
    total: "Total",
    of: "of",
    results: "results",
    deleteConfirm: "Are you sure? This action cannot be undone.",
  },
  auth: {
    signIn: "Sign in",
    signUp: "Sign up",
    signOut: "Sign out",
    email: "Email",
    password: "Password",
    name: "Name",
    fullName: "Full name",
    companyName: "Company name",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccount: "Create account",
    signingIn: "Signing in...",
    creating: "Creating...",
    welcomeBack: "Welcome back",
    getStarted: "Get started",
  },
  role: {
    OWNER: "Owner",
    ADMIN: "Admin",
    AGENT: "Agent",
  },
  dealStatus: {
    OPEN: "Open",
    WON: "Won",
    LOST: "Lost",
  },
  activityType: {
    CALL: "Call",
    MEETING: "Meeting",
    EMAIL: "Email",
    TASK: "Task",
    NOTE: "Note",
  },
  source: {
    WEBSITE: "Website",
    MANUAL: "Manual",
    IMPORT: "Import",
    REFERRAL: "Referral",
    SOCIAL: "Social",
    OTHER: "Other",
  },
  toast: {
    created: "Created successfully",
    updated: "Updated successfully",
    deleted: "Deleted",
    error: "Something went wrong",
    saved: "Saved",
  },
};

export const dictionaries: Record<Locale, Dict> = { uz, en };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}
