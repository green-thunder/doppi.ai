"use client";

import { ArrowLeft, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Container, GoldGlow } from "@/components/primitives";

type Section = { h: string; p: string };

type PrivacyCopy = {
  title: string;
  updated: string;
  back: string;
  sections: Section[];
  contact: { h: string; p: string; email: string; phone: string; location: string };
  disclaimer: { h: string; p: string };
};

// ---------------------------------------------------------------------------
// UZBEK (default)
// ---------------------------------------------------------------------------
const uz: PrivacyCopy = {
  title: "Maxfiylik siyosati",
  updated: "Oxirgi yangilanish: 2026-yil 7-iyul",
  back: "Bosh sahifaga qaytish",
  sections: [
    {
      h: "Kirish",
      p: "Do'ppi.ai (“biz”) O'zbekistondagi bizneslar uchun sun'iy intellektga asoslangan marketing platformasini taqdim etadi. Ushbu Maxfiylik siyosati biz qanday ma'lumotlarni yig'ishimizni, ulardan qanday foydalanishimizni va veb-saytimizga tashrif buyurganingizda yoki demo so'raganingizda qanday tanlovlaringiz borligini tushuntiradi.",
    },
    {
      h: "Biz yig'adigan ma'lumotlar",
      p: "Demo so'rovi formasini to'ldirganingizda siz kiritgan ma'lumotlarni yig'amiz: ismingiz, telefon raqamingiz, elektron pochta manzilingiz va biznesingiz haqidagi ma'lumot. Shuningdek, veb-saytimiz qanday ishlatilayotganini tushunish va uni xavfsiz saqlash uchun cheklangan foydalanish va analitika ma'lumotlarini — masalan, ko'rilgan sahifalar, qurilma va brauzer turi hamda taxminiy joylashuv — avtomatik ravishda to'playmiz.",
    },
    {
      h: "Ma'lumotlardan qanday foydalanamiz",
      p: "Ma'lumotlaringizdan demo so'rovlaringiz va murojaatlaringizga javob berish, Do'ppi.ai xizmatini taqdim etish va ishlatish hamda mahsulotimiz, kontentimiz va mijozlar tajribasini yaxshilash uchun foydalanamiz. So'rovingiz va tegishli mahsulot yangiliklari yuzasidan siz bilan bog'lanishimiz mumkin.",
    },
    {
      h: "Ma'lumotlarni ulashish",
      p: "Biz shaxsiy ma'lumotlaringizni sotmaymiz. Ularni faqat platformamizni ishlatishga yordam beradigan ishonchli xizmat ko'rsatuvchilar bilan — masalan, hosting, aloqa va analitika provayderlari bilan — va faqat xizmatni taqdim etish uchun zarur bo'lgan darajada ulashamiz. Shuningdek, amaldagi qonun talab qilgan hollarda ma'lumotlarni oshkor qilishimiz mumkin.",
    },
    {
      h: "Ma'lumotlar xavfsizligi",
      p: "Ma'lumotlaringiz kirish nazorati va muntazam zaxira nusxalari bilan himoyalangan bulut infratuzilmasida saqlanadi. Biz ularni ruxsatsiz kirish, yo'qotish yoki noto'g'ri foydalanishdan himoya qilish uchun asosli texnik va tashkiliy choralarni ko'ramiz.",
    },
    {
      h: "Sizning huquqlaringiz",
      p: "Siz o'zingiz haqingizda saqlanayotgan shaxsiy ma'lumotlarga kirishni so'rashingiz, ularni tuzatishni yoki o'chirishni talab qilishingiz mumkin. Ushbu huquqlardan foydalanish uchun quyidagi ma'lumotlar orqali biz bilan bog'laning — biz asosli muddat ichida javob beramiz.",
    },
  ],
  contact: {
    h: "Aloqa",
    p: "Ushbu Maxfiylik siyosati yoki ma'lumotlaringizni qanday boshqarishimiz yuzasidan savollaringiz bo'lsa, biz bilan bog'laning:",
    email: "admin@doppi.ai",
    phone: "+998 93 903 33 01",
    location: "Toshkent, O'zbekiston",
  },
  disclaimer: {
    h: "Umumiy shablon — yuridik maslahat emas",
    p: "Ushbu Maxfiylik siyosati Do'ppi.ai'ning mahsulot va muvofiqlik ishlarini qo'llab-quvvatlash uchun umumiy shablon sifatida taqdim etilgan. U yuridik maslahat hisoblanmaydi va unga tayanishdan oldin malakali yuristlar tomonidan ko'rib chiqilishi va biznesingizga moslashtirilishi lozim.",
  },
};

// ---------------------------------------------------------------------------
// ENGLISH
// ---------------------------------------------------------------------------
const en: PrivacyCopy = {
  title: "Privacy Policy",
  updated: "Last updated: 7 July 2026",
  back: "Back to home",
  sections: [
    {
      h: "Introduction",
      p: "Do'ppi.ai (“we”, “us”, or “our”) operates an AI marketing platform for businesses in Uzbekistan. This Privacy Policy explains what information we collect, how we use it, and the choices you have when you visit our website or request a demo of our service.",
    },
    {
      h: "Information We Collect",
      p: "When you submit our demo request form, we collect the details you provide: your name, phone number, email address, and information about your business. We also automatically collect limited usage and analytics data — such as pages viewed, device and browser type, and approximate location — to understand how our website is used and to keep it secure.",
    },
    {
      h: "How We Use It",
      p: "We use your information to respond to your demo requests and enquiries, to provide and operate the Do'ppi.ai service, and to improve our product, content, and customer experience. We may contact you about your request and about relevant product updates.",
    },
    {
      h: "Data Sharing",
      p: "We do not sell your personal data. We share it only with trusted service providers who help us run our platform — for example hosting, communication, and analytics providers — and only to the extent needed to deliver the service. We may also disclose information where required by applicable law.",
    },
    {
      h: "Data Security",
      p: "Your data is stored on protected cloud infrastructure with access controls and regular backups. We take reasonable technical and organizational measures to safeguard it against unauthorized access, loss, or misuse.",
    },
    {
      h: "Your Rights",
      p: "You may request access to the personal data we hold about you, ask us to correct it, or request its deletion. To exercise any of these rights, contact us using the details below and we will respond within a reasonable time.",
    },
  ],
  contact: {
    h: "Contact",
    p: "If you have any questions about this Privacy Policy or how we handle your data, please reach out:",
    email: "admin@doppi.ai",
    phone: "+998 93 903 33 01",
    location: "Tashkent, Uzbekistan",
  },
  disclaimer: {
    h: "General template — not legal advice",
    p: "This Privacy Policy is provided as a general template to support Do'ppi.ai's ongoing product and compliance work. It does not constitute legal advice and should be reviewed and tailored by qualified legal counsel before it is relied upon.",
  },
};

export default function PrivacyPage() {
  const { lang } = useI18n();
  const c = lang === "uz" ? uz : en;

  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden pt-32 pb-20">
        <GoldGlow className="-top-24 left-1/2 h-72 w-72 -translate-x-1/2 opacity-60" />

        <Container>
          <div className="mx-auto max-w-3xl">
            <a
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm text-muted-foreground transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {c.back}
            </a>

            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground">
              {c.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{c.updated}</p>

            {c.sections.map((s) => (
              <section key={s.h}>
                <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
                  {s.h}
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.p}</p>
              </section>
            ))}

            {/* Contact */}
            <section>
              <h2 className="mt-10 font-display text-xl font-semibold text-foreground">
                {c.contact.h}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.contact.p}</p>
              <ul className="mt-4 space-y-1 text-muted-foreground">
                <li>
                  <a
                    href={`mailto:${c.contact.email}`}
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-lg transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Mail className="size-4 text-gold-400" aria-hidden="true" />
                    {c.contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${c.contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-lg transition-colors hover:text-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Phone className="size-4 text-gold-400" aria-hidden="true" />
                    {c.contact.phone}
                  </a>
                </li>
                <li className="inline-flex min-h-11 items-center gap-2.5">
                  <MapPin className="size-4 text-gold-400" aria-hidden="true" />
                  {c.contact.location}
                </li>
              </ul>
            </section>

            {/* Disclaimer / not legal advice */}
            <div className="mt-12 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-gold-300">
                <ShieldCheck className="size-5 shrink-0" aria-hidden="true" />
                {c.disclaimer.h}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.disclaimer.p}
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
