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

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <VoiceAgent />
        <Results />
        <Pricing />
        <Faq />
        <About />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
