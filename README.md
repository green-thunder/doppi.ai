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

## CRM (multi-tenant SaaS)

Beyond the marketing site, this repo ships a full **multi-tenant sales CRM** product
(the "CRM & lead management" pillar of Do'ppi.ai), built on the same stack.

- **Multi-tenant**: every record is scoped to an `Organization`. Users belong to one
  org with a role (`OWNER` / `ADMIN` / `AGENT`). All data access is filtered by
  `orgId` in the data layer (`lib/crm/`).
- **Auth**: email + password (scrypt via `node:crypto`), DB-backed sessions in an
  httpOnly cookie. No third-party auth dependency.
- **Bilingual UZ/EN** end-to-end, reusing the brand tokens + dark/light theme.
- **Entities**: Contacts · Companies · Deals · Activities/Tasks, each with list +
  detail + create/edit/delete, owners, tags, and search.
- **Deals kanban** with **drag-and-drop** between stages (plus a menu fallback).
- **Dashboard** with pipeline value, win rate, deals-by-stage chart, and upcoming tasks.
- **Settings**: org profile, team management, configurable pipeline stages, personal
  profile / password change.
- **Team invites**: invite by email — a one-time token link lets the invitee set their
  own password (no admin-set passwords). Emails via Resend when `RESEND_API_KEY` is set,
  otherwise the link is shown to copy/share. Pending invites are listed and revocable.
- **CSV import/export**: export Contacts / Companies / Deals to CSV (Excel-safe UTF-8),
  and bulk-import Contacts from a CSV.
- **AI assistant** (`/crm/assistant`): ask your CRM in plain language (Uzbek/English).
  Powered by Claude (Anthropic API) with org-scoped, read-only tools. Enabled by setting
  `ANTHROPIC_API_KEY`; otherwise the UI shows a "not configured" message.
- **Custom fields**: each org can add extra fields (text/number/date/select/boolean) to
  Contacts / Companies / Deals (Settings → Fields), stored per-record as JSON.
- **Saved views + filters**: filter Contacts / Companies / Activities by owner, source,
  industry, type, etc., and save named views (URL-driven).
- **Automation rules** (Settings → Automation): event-driven — when a deal changes stage
  or is won/lost, a contact is created, or a website lead arrives, run an action
  (create a task, assign an owner, add a tag).
- **Website leads**: the landing contact form posts to `POST /api/leads`, which creates
  a `WEBSITE`-sourced Contact (+ an OPEN Deal in the first stage) in the org configured
  by `LEADS_ORG_SLUG` (default `doppi`).

### Routes

```
/login, /register        # auth (register creates an org + OWNER + default pipeline)
/crm                     # dashboard
/crm/contacts   [/:id]   # contacts
/crm/companies  [/:id]   # companies
/crm/deals      [/:id]   # deals — kanban board
/crm/activities          # tasks / activities
/crm/assistant           # AI assistant (natural-language Q&A over your CRM)
/crm/settings            # general · team · pipeline · fields · automation · profile
/invite/:token           # accept a team invitation (set your own password)
/api/leads               # public lead-capture endpoint (POST)
/api/crm/export/:entity  # CSV export (contacts | companies | deals)
/api/crm/fields/:entity  # custom field definitions (GET)
/api/crm/chat            # AI assistant endpoint (POST)
```

### Local setup

```bash
createdb doppi_ai                 # local Postgres
cp .env.example .env              # set DATABASE_URL (+ LEADS_ORG_SLUG)
npm run db:push                   # sync schema
npm run db:seed                   # demo org + sample data
npm run dev
```

Seeded login (all three users share the password `doppi1234`):

| Email             | Role  |
| ----------------- | ----- |
| `admin@doppi.ai`  | OWNER |
| `sales@doppi.ai`  | ADMIN |
| `agent@doppi.ai`  | AGENT |

Handy scripts: `npm run db:studio` (Prisma Studio), `npm run db:reset`
(force-reset schema + re-seed), `npm run typecheck`.

### CRM layout

```
prisma/schema.prisma     # Organization, User, Session, Company, Contact, Stage, Deal, Activity
prisma/seed.ts           # demo tenant + sample data
lib/crm/                 # db, auth (scrypt+sessions), rbac, i18n (UZ/EN), format, constants, forms
  data/                  # per-entity data access, all orgId-scoped
app/(auth)/              # login / register + server actions
app/crm/                 # authenticated app (layout guard + shell, one folder per module)
components/crm/          # shared CRM UI (page-header, field, select-field, confirm-delete, …)
components/ui/           # shadcn-style primitives (input, dialog, select, table, tabs, …)
```

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
