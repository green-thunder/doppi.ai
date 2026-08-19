import Image from "next/image";
import type { SiteCopy } from "@/lib/content";
import { Container, Section, SectionHeading, GoldGlow } from "@/components/layout";
import { Reveal, InteractiveCard } from "@/components/primitives";
import { Icon } from "@/components/icons";

export function Team({ t }: { t: SiteCopy["team"] }) {

  return (
    <Section id="team" className="relative overflow-hidden">
      <GoldGlow className="left-1/4 top-0 h-64 w-[30rem]" />

      <Container className="relative">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          subtitle={t.subtitle}
          align="center"
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {t.members.map((member, i) => {
            // Only render socials that point somewhere real — placeholder "#"
            // entries would otherwise open a broken blank tab.
            const socials = member.socials?.filter((s) => s.href && s.href !== "#");
            return (
              <Reveal key={member.name} as="li" delayIndex={i}>
                <InteractiveCard
                  tilt={false}
                  className="h-full p-6"
                  contentClassName="flex flex-col items-center text-center"
                >
                  {/* Avatar — local photo from /public if provided, else a gold
                      initials disc. Drop files in public/team and set the member's
                      `image` to e.g. "/team/sardor.jpg". */}
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      quality={70}
                      className="size-20 rounded-full object-cover ring-2 ring-gold-500/20 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-gold-400/25 to-gold-600/10 font-display text-xl font-bold text-gold-300 ring-1 ring-gold-500/20 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
                    >
                      {member.initials}
                    </span>
                  )}

                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gold-400">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>

                  {socials?.length ? (
                    <div className="mt-5 flex items-center gap-2">
                      {socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${member.name} — ${s.label}`}
                          className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-[transform,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-gold-500/40 hover:text-gold-300 motion-reduce:hover:translate-y-0"
                        >
                          <Icon name={s.icon} className="size-4" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                </InteractiveCard>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
