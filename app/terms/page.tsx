"use client";

import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Container, Eyebrow, GoldGlow } from "@/components/primitives";
import { Button } from "@/components/ui/button";

interface TermsBlock {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface TermsCopy {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  disclaimerNote: string;
  sections: TermsBlock[];
  contactHeading: string;
  contactLead: string;
  backHome: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
}

const TERMS: Record<"uz" | "en", TermsCopy> = {
  uz: {
    eyebrow: "Huquqiy",
    title: "Foydalanish shartlari",
    updated: "Oxirgi yangilanish: 2026-yil 7-iyul",
    intro:
      "Ushbu Foydalanish shartlari (“Shartlar”) Do'ppi.ai platformasi va u bilan bog'liq veb-sayt hamda xizmatlardan (“Xizmat”) foydalanishingizni tartibga soladi. Xizmatdan foydalanishdan oldin ushbu shartlarni diqqat bilan o'qib chiqing.",
    disclaimerNote:
      "Ushbu hujjat umumiy namuna sifatida taqdim etilgan va yuridik maslahat hisoblanmaydi. Yakuniy foydalanishdan oldin uni malakali yuridik maslahatchi ko'rib chiqishi tavsiya etiladi.",
    sections: [
      {
        heading: "Kirish va shartlarni qabul qilish",
        paragraphs: [
          "Do'ppi.ai xizmatidan ro'yxatdan o'tib yoki undan foydalanib, siz ushbu Shartlarga va Maxfiylik siyosatiga rozilik bildirasiz. Agar siz ushbu shartlarga rozi bo'lmasangiz, Xizmatdan foydalanmang.",
          "Agar siz Xizmatdan tashkilot nomidan foydalanayotgan bo'lsangiz, siz ushbu tashkilotni ushbu Shartlar bilan bog'lash vakolatiga ega ekanligingizni tasdiqlaysiz.",
        ],
      },
      {
        heading: "Xizmat tavsifi",
        paragraphs: [
          "Do'ppi.ai — bu marketing jarayonlarini avtomatlashtirishga mo'ljallangan All-in-One AI marketing platformasi. Xizmat quyidagi asosiy modullarni o'z ichiga oladi:",
        ],
        bullets: [
          "AI ovozli agent — mijozlar bilan tabiiy suhbat, malakalash va uchrashuv belgilash.",
          "Ijtimoiy tarmoq avtomatizatsiyasi — DM, komment va follow-up boshqaruvi.",
          "AI kontent va video generatsiyasi.",
          "CRM va lead boshqaruvi.",
          "Ko'p kanalli chatbotlar.",
        ],
      },
      {
        heading: "Hisoblar va muvofiqlik",
        paragraphs: [
          "Xizmatdan foydalanish uchun kamida 18 yoshda bo'lishingiz va amaldagi qonunlarga muvofiq shartnoma tuzish qobiliyatiga ega bo'lishingiz kerak.",
          "Siz hisob ma'lumotlaringiz (login va parol) maxfiyligini saqlash va hisobingiz orqali amalga oshirilgan barcha faoliyat uchun javobgar bo'lasiz. Ruxsatsiz foydalanish aniqlansa, bizni zudlik bilan xabardor qiling.",
        ],
      },
      {
        heading: "Obuna, sinov va to'lovlar",
        paragraphs: [
          "Do'ppi.ai obuna asosidagi rejalarni taklif qiladi: Starter ($19/oy), Growth ($49/oy), Pro ($99/oy) va yirik korxonalar uchun maxsus narxdagi Enterprise reja.",
          "Barcha rejalar uchun 14 kunlik bepul sinov mavjud. To'lovlar tanlangan reja asosida davriy (oylik) tarzda undiriladi. Obunani istalgan vaqtda bekor qilishingiz mumkin — bekor qilish joriy to'lov davri oxirida kuchga kiradi.",
          "Narxlar va tarkib oldindan xabar berilgan holda o'zgarishi mumkin. Qonun bilan talab qilinmagan hollarda, to'langan summalar qaytarilmaydi.",
        ],
      },
      {
        heading: "Foydalanish qoidalari",
        paragraphs: [
          "Siz Xizmatdan faqat qonuniy maqsadlarda va ushbu Shartlarga muvofiq foydalanishga rozilik bildirasiz. Xususan, siz quyidagilarga yo'l qo'ymaslikka rozisiz:",
        ],
        bullets: [
          "Qonunga xilof, aldov yoki spam xarakteridagi xabarlar yuborish.",
          "Boshqa shaxslarning huquqlarini yoki maxfiyligini buzish.",
          "Xizmatni buzish, unga ruxsatsiz kirish yoki uni teskari muhandislik qilish.",
          "Zararli dastur yoki avtomatlashtirilgan so'rovlar orqali tizimga ortiqcha yuk berish.",
          "Xizmat orqali qonun taqiqlagan tovar yoki xizmatlarni targ'ib qilish.",
        ],
      },
      {
        heading: "Intellektual mulk",
        paragraphs: [
          "Xizmat, uning dizayni, dasturiy ta'minoti, brendi va barcha tegishli intellektual mulk huquqlari Do'ppi.ai yoki uning litsenziarlariga tegishli. Ushbu Shartlar sizga cheklangan, eksklyuziv bo'lmagan va o'tkazib bo'lmaydigan foydalanish huquqini beradi.",
          "Siz Xizmatga yuklagan yoki u orqali yaratgan kontentga (“Foydalanuvchi kontenti”) egaligingiz saqlanib qoladi. Xizmatni taqdim etish uchun zarur bo'lgan darajada uni qayta ishlashimizga ruxsat berasiz.",
        ],
      },
      {
        heading: "Kafolatlardan voz kechish va javobgarlik cheklovi",
        paragraphs: [
          "Xizmat “boribori holida” va “mavjud bo'lgani bo'yicha” taqdim etiladi. Qonun ruxsat bergan darajada biz uning uzluksiz, xatosiz yoki har qanday muayyan maqsadga mos kelishini kafolatlamaymiz.",
          "Qonun ruxsat bergan maksimal darajada Do'ppi.ai bilvosita, tasodifiy yoki oqibatli zararlar, shu jumladan foyda yoki ma'lumot yo'qotilishi uchun javobgar bo'lmaydi. Bizning umumiy javobgarligimiz da'vodan oldingi 12 oy ichida Xizmat uchun to'langan summadan oshmaydi.",
        ],
      },
      {
        heading: "Bekor qilish",
        paragraphs: [
          "Siz istalgan vaqtda hisobingizni bekor qilishingiz mumkin. Ushbu Shartlar buzilgan taqdirda biz Xizmatga kirishni to'xtatib qo'yish yoki hisobni bekor qilish huquqini o'zimizda saqlab qolamiz.",
          "Bekor qilingandan so'ng Xizmatdan foydalanish huquqingiz darhol tugaydi. Ayrim qoidalar (masalan, intellektual mulk va javobgarlik cheklovi) bekor qilingandan keyin ham amal qiladi.",
        ],
      },
      {
        heading: "Shartlarga o'zgartirishlar",
        paragraphs: [
          "Biz ushbu Shartlarni vaqti-vaqti bilan yangilashimiz mumkin. Muhim o'zgarishlar to'g'risida veb-sayt orqali yoki boshqa oqilona usulda xabar beramiz. O'zgarishlardan keyin Xizmatdan foydalanishni davom ettirish yangilangan Shartlarni qabul qilishni anglatadi.",
        ],
      },
      {
        heading: "Amaldagi qonun",
        paragraphs: [
          "Ushbu Shartlar O'zbekiston Respublikasi qonunlariga muvofiq tartibga solinadi va talqin qilinadi. Har qanday nizolar O'zbekiston Respublikasining vakolatli sudlari tomonidan ko'rib chiqiladi.",
        ],
      },
    ],
    contactHeading: "Aloqa",
    contactLead:
      "Ushbu Shartlar bo'yicha savollaringiz bo'lsa, biz bilan bog'laning:",
    backHome: "Bosh sahifaga qaytish",
    ctaTitle: "Yana savollaringiz bormi?",
    ctaBody: "Jamoamiz Xizmat va shartlar bo'yicha savollaringizga yordam berishga tayyor.",
    ctaButton: "Bosh sahifaga qaytish",
  },
  en: {
    eyebrow: "Legal",
    title: "Terms of Service",
    updated: "Last updated: 7 July 2026",
    intro:
      "These Terms of Service (“Terms”) govern your access to and use of the Do'ppi.ai platform and its related website and services (the “Service”). Please read these Terms carefully before using the Service.",
    disclaimerNote:
      "This document is provided as a general template and does not constitute legal advice. We recommend it be reviewed by qualified legal counsel before final use.",
    sections: [
      {
        heading: "Introduction & acceptance of terms",
        paragraphs: [
          "By registering for or using Do'ppi.ai, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with these Terms, do not use the Service.",
          "If you use the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.",
        ],
      },
      {
        heading: "Description of service",
        paragraphs: [
          "Do'ppi.ai is an all-in-one AI marketing platform designed to automate your marketing operations. The Service includes the following core modules:",
        ],
        bullets: [
          "AI voice agent — natural conversations, lead qualification and meeting booking.",
          "Social media automation — DMs, comments and follow-up management.",
          "AI content and video generation.",
          "CRM and lead management.",
          "Multi-channel chatbots.",
        ],
      },
      {
        heading: "Accounts & eligibility",
        paragraphs: [
          "To use the Service you must be at least 18 years old and legally capable of entering into a binding contract under applicable law.",
          "You are responsible for keeping your account credentials (login and password) confidential and for all activity that occurs under your account. Notify us promptly if you detect any unauthorized use.",
        ],
      },
      {
        heading: "Subscriptions, trial & billing",
        paragraphs: [
          "Do'ppi.ai offers subscription-based plans: Starter ($19/mo), Growth ($49/mo), Pro ($99/mo) and an Enterprise plan with custom pricing for larger organizations.",
          "Every plan includes a 14-day free trial. Fees are billed on a recurring (monthly) basis according to the plan you select. You may cancel anytime — cancellation takes effect at the end of the current billing period.",
          "Prices and features may change with prior notice. Except where required by law, amounts already paid are non-refundable.",
        ],
      },
      {
        heading: "Acceptable use",
        paragraphs: [
          "You agree to use the Service only for lawful purposes and in accordance with these Terms. In particular, you agree not to:",
        ],
        bullets: [
          "Send unlawful, deceptive or spam messages.",
          "Violate the rights or privacy of others.",
          "Disrupt, gain unauthorized access to, or reverse-engineer the Service.",
          "Overload the system with malware or automated requests.",
          "Promote goods or services prohibited by law through the Service.",
        ],
      },
      {
        heading: "Intellectual property",
        paragraphs: [
          "The Service, including its design, software, branding and all related intellectual property rights, belongs to Do'ppi.ai or its licensors. These Terms grant you a limited, non-exclusive and non-transferable right to use the Service.",
          "You retain ownership of the content you upload to or create through the Service (“User Content”). You grant us permission to process it to the extent necessary to provide the Service.",
        ],
      },
      {
        heading: "Disclaimers & limitation of liability",
        paragraphs: [
          "The Service is provided “as is” and “as available.” To the extent permitted by law, we do not warrant that it will be uninterrupted, error-free, or fit for any particular purpose.",
          "To the maximum extent permitted by law, Do'ppi.ai shall not be liable for any indirect, incidental or consequential damages, including loss of profits or data. Our total liability shall not exceed the amount paid for the Service in the 12 months preceding the claim.",
        ],
      },
      {
        heading: "Termination",
        paragraphs: [
          "You may cancel your account at any time. We reserve the right to suspend or terminate access to the Service in the event of a breach of these Terms.",
          "Upon termination, your right to use the Service ends immediately. Certain provisions (such as intellectual property and limitation of liability) survive termination.",
        ],
      },
      {
        heading: "Changes to these terms",
        paragraphs: [
          "We may update these Terms from time to time. We will notify you of material changes through the website or by other reasonable means. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.",
        ],
      },
      {
        heading: "Governing law",
        paragraphs: [
          "These Terms are governed by and construed in accordance with the laws of the Republic of Uzbekistan. Any disputes shall be resolved by the competent courts of the Republic of Uzbekistan.",
        ],
      },
    ],
    contactHeading: "Contact",
    contactLead:
      "If you have any questions about these Terms, please get in touch:",
    backHome: "Back to home",
    ctaTitle: "Still have questions?",
    ctaBody: "Our team is here to help with any questions about the Service and these Terms.",
    ctaButton: "Back to home",
  },
};

export default function TermsPage() {
  const { lang, t } = useI18n();
  const copy = TERMS[lang];

  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden pt-32 pb-20">
        <GoldGlow className="left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 opacity-60" />

        <Container>
          <div className="relative mx-auto max-w-3xl">
            {/* Back link */}
            <a
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-gold-300"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              {copy.backHome}
            </a>

            {/* Header */}
            <header className="mt-4">
              <Eyebrow>{copy.eyebrow}</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 text-sm text-muted-foreground">{copy.updated}</p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {copy.intro}
              </p>
            </header>

            {/* Legal-counsel disclaimer callout */}
            <div className="mt-8 rounded-2xl border border-gold-500/30 bg-gold-500/10 p-5">
              <p className="text-sm leading-relaxed text-gold-100/90">
                {copy.disclaimerNote}
              </p>
            </div>

            {/* Sections */}
            <div className="mt-12 space-y-12">
              {copy.sections.map((section, i) => (
                <section key={section.heading}>
                  <h2 className="flex items-baseline gap-3 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    <span
                      aria-hidden="true"
                      className="text-sm font-semibold text-gold-500/60"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{section.heading}</span>
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {section.paragraphs?.map((p, pi) => (
                      <p key={pi}>{p}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="space-y-2.5">
                        {section.bullets.map((b, bi) => (
                          <li key={bi} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-400"
                            />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}

              {/* Contact section */}
              <section>
                <h2 className="flex items-baseline gap-3 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  <span
                    aria-hidden="true"
                    className="text-sm font-semibold text-gold-500/60"
                  >
                    {String(copy.sections.length + 1).padStart(2, "0")}
                  </span>
                  <span>{copy.contactHeading}</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {copy.contactLead}
                </p>
                <ul className="mt-4 space-y-3 text-sm sm:text-base">
                  <li>
                    <a
                      href={`mailto:${t.contact.email}`}
                      className="inline-flex min-h-11 items-center gap-2.5 text-muted-foreground transition-colors hover:text-gold-300"
                    >
                      <Mail className="size-4 text-gold-400" aria-hidden="true" />
                      {t.contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:${t.contact.phone.replace(/\s/g, "")}`}
                      className="inline-flex min-h-11 items-center gap-2.5 text-muted-foreground transition-colors hover:text-gold-300"
                    >
                      <Phone className="size-4 text-gold-400" aria-hidden="true" />
                      {t.contact.phone}
                    </a>
                  </li>
                </ul>
              </section>
            </div>

            {/* Closing CTA */}
            <div className="mt-16 rounded-2xl border border-border bg-card/60 p-8 text-center shadow-card">
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {copy.ctaTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {copy.ctaBody}
              </p>
              <Button asChild variant="outlineGold" size="md" className="mt-6">
                <a href="/">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  {copy.ctaButton}
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
