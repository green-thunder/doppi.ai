import { content } from "@/lib/content";
import type { Lang } from "@/lib/lang";
import { homeJsonLd } from "@/lib/seo";
import { AnchorScrollFix } from "@/components/anchor-scroll-fix";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { VoiceAgent } from "@/components/sections/voice-agent";
import { Results } from "@/components/sections/results";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { About } from "@/components/sections/about";
import { Team } from "@/components/sections/team";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

/**
 * The whole page for one language. Copy is threaded down as props rather than
 * read from a context, so only the language actually being rendered reaches the
 * client — and the nine sections that needed no interactivity stay on the server.
 */
export function Landing({ lang }: { lang: Lang }) {
  const t = content[lang];

  return (
    <>
      {/* Product + FAQ structured data — home pages only (the FAQ is visible
          here); the Organization/WebSite graph ships from the root layout. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }}
      />
      <AnchorScrollFix />
      <Navbar t={t.nav} a11y={t.a11y} lang={lang} />
      <main id="main" tabIndex={-1}>
        <Hero t={t.hero} />
        <TrustBar t={t.trust} />
        <Problem t={t.problem} />
        <Solution t={t.solution} />
        <Features t={t.features} />
        <HowItWorks t={t.how} />
        <VoiceAgent t={t.voice} />
        <Results t={t.results} />
        <Pricing t={t.pricing} />
        <Faq t={t.faq} />
        <About t={t.about} />
        <Team t={t.team} />
        <Contact t={t.contact} privacyHref={lang === "en" ? "/en/privacy" : "/privacy"} />
      </main>
      <Footer t={t.footer} contact={t.contact} />
    </>
  );
}
