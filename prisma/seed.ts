/**
 * Seed a demo CRM tenant for Do'ppi.ai.
 *
 *   npm run db:seed
 *
 * Creates one organization ("Do'ppi.ai", slug "doppi") with three users, the
 * default pipeline, and realistic sample companies / contacts / deals / tasks.
 * Website leads from the landing page also land in this org (LEADS_ORG_SLUG).
 *
 * Login (all users share the same password):  password → "doppi1234"
 *   • admin@doppi.ai  — OWNER
 *   • sales@doppi.ai  — ADMIN
 *   • agent@doppi.ai  — AGENT
 */
import { PrismaClient, type Company, type Contact, type Deal } from "@prisma/client";
import { hashPassword } from "../lib/crm/password";
import { defaultStages } from "../lib/crm/constants";

const db = new PrismaClient();

const DAY = 86_400_000;
const now = Date.now();
const daysFromNow = (d: number) => new Date(now + d * DAY);
const daysAgo = (d: number) => new Date(now - d * DAY);

async function main() {
  // Reset the demo org (cascades to all its data).
  await db.organization.deleteMany({ where: { slug: "doppi" } });

  const password = await hashPassword("doppi1234");

  const org = await db.organization.create({
    data: {
      name: "Do'ppi.ai",
      slug: "doppi",
      currency: "UZS",
      users: {
        create: [
          {
            name: "Nodirbek Kamolov",
            email: "admin@doppi.ai",
            passwordHash: password,
            role: "OWNER",
            locale: "uz",
            avatarColor: "#E6A92C",
            lastLoginAt: daysAgo(0),
          },
          {
            name: "Jaxongir Abduxamidov",
            email: "sales@doppi.ai",
            passwordHash: password,
            role: "ADMIN",
            locale: "uz",
            avatarColor: "#6366F1",
          },
          {
            name: "Abdumalikov Aziz",
            email: "agent@doppi.ai",
            passwordHash: password,
            role: "AGENT",
            locale: "en",
            avatarColor: "#0EA5E9",
          },
        ],
      },
      stages: { create: defaultStages("uz").map((s, i) => ({ ...s, order: i })) },
    },
    include: { users: true, stages: { orderBy: { order: "asc" } } },
  });

  const [owner, admin, agent] = org.users;
  const stages = org.stages;
  const stageByName = (namePart: string) =>
    stages.find((s) => s.name.toLowerCase().includes(namePart.toLowerCase())) ?? stages[0];
  const newStage = stages[0];
  const contacted = stages[1];
  const proposal = stages[2];
  const negotiation = stages[3];
  const won = stages.find((s) => s.isWon) ?? stages[4];
  const lost = stages.find((s) => s.isLost) ?? stages[5];

  // ── Companies ──────────────────────────────────────────────────────────────
  const companyData = [
    { name: "Korzinka", industry: "Retail", phone: "+998 71 200 00 00", website: "korzinka.uz", ownerId: owner.id },
    { name: "Uzum Market", industry: "E-commerce", phone: "+998 71 202 02 02", website: "uzum.uz", ownerId: admin.id },
    { name: "Evos", industry: "Restaurant", phone: "+998 78 140 40 40", website: "evos.uz", ownerId: agent.id },
    { name: "Oqtepa Lavash", industry: "Restaurant", phone: "+998 71 205 05 05", website: "oqtepalavash.uz", ownerId: agent.id },
    { name: "Anhor Medical", industry: "Beauty & Health", phone: "+998 71 209 09 09", website: "anhor.uz", ownerId: admin.id },
    { name: "Golden House", industry: "Real Estate", phone: "+998 71 231 31 31", website: "goldenhouse.uz", ownerId: owner.id },
  ];
  const companies: Company[] = [];
  for (const c of companyData) {
    companies.push(
      await db.company.create({ data: { orgId: org.id, ...c } }),
    );
  }
  const companyByName = (n: string) => companies.find((c) => c.name === n)!;

  // ── Contacts ───────────────────────────────────────────────────────────────
  const contactData = [
    { firstName: "Sardor", lastName: "Rahimov", position: "Marketing Director", email: "sardor@korzinka.uz", phone: "+998 90 111 22 33", company: "Korzinka", source: "REFERRAL", ownerId: owner.id, tags: ["VIP", "hot"] },
    { firstName: "Kamola", lastName: "Yusupova", position: "CEO", email: "kamola@uzum.uz", phone: "+998 90 222 33 44", company: "Uzum Market", source: "WEBSITE", ownerId: admin.id, tags: ["enterprise"] },
    { firstName: "Bekzod", lastName: "Toshmatov", position: "Owner", email: "bekzod@evos.uz", phone: "+998 90 333 44 55", company: "Evos", source: "SOCIAL", ownerId: agent.id, tags: [] },
    { firstName: "Nilufar", lastName: "Karimova", position: "Brand Manager", email: "nilufar@oqtepa.uz", phone: "+998 90 444 55 66", company: "Oqtepa Lavash", source: "WEBSITE", ownerId: agent.id, tags: ["hot"] },
    { firstName: "Jasur", lastName: "Aliyev", position: "COO", email: "jasur@anhor.uz", phone: "+998 90 555 66 77", company: "Anhor Medical", source: "MANUAL", ownerId: admin.id, tags: [] },
    { firstName: "Dilnoza", lastName: "Saidova", position: "Sales Lead", email: "dilnoza@goldenhouse.uz", phone: "+998 90 666 77 88", company: "Golden House", source: "REFERRAL", ownerId: owner.id, tags: ["enterprise", "hot"] },
    { firstName: "Otabek", lastName: "Nazarov", position: "Founder", email: "otabek@startup.uz", phone: "+998 90 777 88 99", company: null, source: "WEBSITE", ownerId: agent.id, tags: [] },
    { firstName: "Malika", lastName: "Ergasheva", position: "CMO", email: "malika@fashion.uz", phone: "+998 90 888 99 00", company: null, source: "SOCIAL", ownerId: admin.id, tags: ["hot"] },
    { firstName: "Sherzod", lastName: "Umarov", position: "Manager", email: "sherzod@retail.uz", phone: "+998 91 100 20 30", company: "Korzinka", source: "MANUAL", ownerId: owner.id, tags: [] },
    { firstName: "Gulnora", lastName: "Ismoilova", position: "Director", email: "gulnora@clinic.uz", phone: "+998 91 200 30 40", company: "Anhor Medical", source: "WEBSITE", ownerId: agent.id, tags: [] },
    { firstName: "Aziz", lastName: "Qodirov", position: "Buyer", email: "aziz@shop.uz", phone: "+998 91 300 40 50", company: "Uzum Market", source: "REFERRAL", ownerId: admin.id, tags: [] },
    { firstName: "Feruza", lastName: "Xolmatova", position: "Owner", email: "feruza@beauty.uz", phone: "+998 91 400 50 60", company: null, source: "SOCIAL", ownerId: agent.id, tags: ["hot"] },
  ] as const;

  const contacts: Contact[] = [];
  for (const c of contactData) {
    contacts.push(
      await db.contact.create({
        data: {
          orgId: org.id,
          firstName: c.firstName,
          lastName: c.lastName,
          position: c.position,
          email: c.email,
          phone: c.phone,
          source: c.source,
          ownerId: c.ownerId,
          tags: [...c.tags],
          companyId: c.company ? companyByName(c.company).id : null,
        },
      }),
    );
  }

  // ── Deals ────────────────────────────────────────────────────────────────
  const dealData = [
    { title: "Korzinka — AI voice agent", amount: 48_000_000, stage: newStage, contact: 0, company: "Korzinka", owner: owner.id, status: "OPEN", close: 20 },
    { title: "Uzum — full marketing OS", amount: 120_000_000, stage: proposal, contact: 1, company: "Uzum Market", owner: admin.id, status: "OPEN", close: 12 },
    { title: "Evos — chatbot + CRM", amount: 24_000_000, stage: contacted, contact: 2, company: "Evos", owner: agent.id, status: "OPEN", close: 30 },
    { title: "Oqtepa — social automation", amount: 18_000_000, stage: negotiation, contact: 3, company: "Oqtepa Lavash", owner: agent.id, status: "OPEN", close: 7 },
    { title: "Anhor — voice + video content", amount: 36_000_000, stage: proposal, contact: 4, company: "Anhor Medical", owner: admin.id, status: "OPEN", close: 15 },
    { title: "Golden House — lead management", amount: 90_000_000, stage: won, contact: 5, company: "Golden House", owner: owner.id, status: "WON", close: -5 },
    { title: "Startup — starter plan", amount: 6_000_000, stage: lost, contact: 6, company: null, owner: agent.id, status: "LOST", close: -10 },
    { title: "Fashion brand — Instagram AI", amount: 15_000_000, stage: contacted, contact: 7, company: null, owner: admin.id, status: "OPEN", close: 25 },
    { title: "Korzinka — expansion phase 2", amount: 60_000_000, stage: newStage, contact: 8, company: "Korzinka", owner: owner.id, status: "OPEN", close: 40 },
    { title: "Clinic — WhatsApp automation", amount: 21_000_000, stage: negotiation, contact: 9, company: "Anhor Medical", owner: agent.id, status: "OPEN", close: 9 },
    { title: "Beauty salon — full package", amount: 12_000_000, stage: won, contact: 11, company: null, owner: agent.id, status: "WON", close: -2 },
  ] as const;

  const deals: Deal[] = [];
  for (let i = 0; i < dealData.length; i++) {
    const d = dealData[i];
    deals.push(
      await db.deal.create({
        data: {
          orgId: org.id,
          title: d.title,
          amount: d.amount,
          currency: "UZS",
          status: d.status,
          stageId: d.stage.id,
          position: i,
          contactId: contacts[d.contact].id,
          companyId: d.company ? companyByName(d.company).id : null,
          ownerId: d.owner,
          expectedCloseDate: daysFromNow(d.close),
          closedAt: d.status === "OPEN" ? null : daysFromNow(d.close),
        },
      }),
    );
  }

  // ── Activities ─────────────────────────────────────────────────────────────
  const activityData = [
    { type: "CALL", subject: "Discovery call", due: 1, done: false, contact: 0, deal: 0, assignee: owner.id },
    { type: "MEETING", subject: "Product demo", due: 2, done: false, contact: 1, deal: 1, assignee: admin.id },
    { type: "EMAIL", subject: "Send proposal PDF", due: -1, done: true, contact: 4, deal: 4, assignee: admin.id },
    { type: "TASK", subject: "Prepare pricing sheet", due: 0, done: false, contact: 3, deal: 3, assignee: agent.id },
    { type: "CALL", subject: "Follow-up call", due: 3, done: false, contact: 2, deal: 2, assignee: agent.id },
    { type: "MEETING", subject: "Contract signing", due: -5, done: true, contact: 5, deal: 5, assignee: owner.id },
    { type: "NOTE", subject: "Interested in video add-on", due: null, done: false, contact: 7, deal: 7, assignee: admin.id },
    { type: "TASK", subject: "Set up onboarding", due: 5, done: false, contact: 9, deal: 9, assignee: agent.id },
    { type: "CALL", subject: "Renewal discussion", due: 4, done: false, contact: 8, deal: 8, assignee: owner.id },
    { type: "EMAIL", subject: "Thank-you note", due: -2, done: true, contact: 11, deal: 10, assignee: agent.id },
  ] as const;

  for (const a of activityData) {
    await db.activity.create({
      data: {
        orgId: org.id,
        type: a.type,
        subject: a.subject,
        dueDate: a.due === null ? null : daysFromNow(a.due),
        completed: a.done,
        completedAt: a.done ? daysAgo(1) : null,
        contactId: contacts[a.contact].id,
        dealId: deals[a.deal].id,
        assigneeId: a.assignee,
        createdById: owner.id,
      },
    });
  }

  console.log("✅ Seeded org 'Do'ppi.ai' (slug: doppi)");
  console.log(`   ${org.users.length} users · ${companies.length} companies · ${contacts.length} contacts · ${deals.length} deals`);
  console.log("   Login: admin@doppi.ai / doppi1234 (OWNER)");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
