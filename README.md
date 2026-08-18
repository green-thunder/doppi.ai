# Do'ppi.ai — Landing Page

The marketing site for **Do'ppi.ai**, the all-in-one AI marketing operating system for Uzbekistan (AI voice agent, social-media automation, AI video & content, CRM & lead management, chatbots).

Bilingual (Uzbek default, English toggle), dark gold-on-black brand, built as a single high-conversion landing page plus Privacy & Terms pages.

## Tech stack

- **Next.js 15** (App Router) · **React 18** · **TypeScript** (strict)
- **Tailwind CSS 3** with a custom brand token layer
- shadcn-style UI primitives (Radix + CVA) · **framer-motion** · **lucide-react**
- Fonts via `next/font`: Space Grotesk (display) + DM Sans (body)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.tsx           # SEO metadata, JSON-LD, fonts, i18n provider, skip link
  page.tsx             # section composition
  globals.css          # brand tokens + utilities
  opengraph-image.tsx  # dynamic OG image (next/og)
  robots.ts, sitemap.ts, manifest.ts, icon.svg
  privacy/page.tsx     # Privacy Policy (bilingual)
  terms/page.tsx       # Terms of Service (bilingual)
components/
  sections/            # navbar, hero, trust-bar, problem, solution, features,
                       # how-it-works, voice-agent, results, pricing, faq,
                       # about, contact, footer
  ui/                  # button, card, badge, accordion (shadcn-style)
  primitives.tsx       # Section, Container, SectionHeading, Reveal, GoldGlow
  brand.tsx            # Do'ppi mark, medallion & ornament SVGs
  icons.tsx            # content-key → lucide icon mapper
lib/
  content.ts           # bilingual copy (UZ/EN) — one typed tree, parity-enforced
  i18n.tsx             # language provider + useCopy() / useI18n() hooks
  utils.ts             # cn()
```

## Editing content

All copy lives in `lib/content.ts` as a single `SiteCopy` interface with `uz` and
`en` implementations. The TypeScript interface **forces both languages to stay in
structural parity** — a missing key fails the build. Prices, features, FAQ,
contact details, etc. are all edited here (no copy is hardcoded in components).

## Deployment & Google for Startups notes

The site is configured for the apex domain **doppi.ai** (metadata, canonical,
robots, sitemap, JSON-LD Organization with `admin@doppi.ai`). To qualify for the
Google for Startups Cloud Program, deploy this at `https://doppi.ai` and ensure
the billing-admin email is on the `@doppi.ai` domain. See the handoff notes for
the remaining business actions (mailbox, Search Console verification, wiring the
contact form to a real endpoint, adding social profiles / founder bio).

The contact form currently submits via a `mailto:` link to `admin@doppi.ai`.
For production, wire `components/sections/contact.tsx`'s `onSubmit` to a real
endpoint (e.g. a Next.js Route Handler with Resend, or Formspree).

> Privacy & Terms pages are general templates and should be reviewed by legal counsel.
