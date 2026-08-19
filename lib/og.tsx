import { content } from "@/lib/content";
import type { Lang } from "@/lib/lang";

export const ogSize = { width: 1200, height: 630 };

/**
 * The share card, rendered per language. Telegram is the dominant sharing
 * surface in this market, so an Uzbek page must not hand it an English card.
 */
export function ogTemplate(lang: Lang) {
  const t = content[lang];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0A0A0B",
        backgroundImage:
          "radial-gradient(1000px 500px at 50% -10%, rgba(230,169,44,0.22), rgba(10,10,11,0) 60%)",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <svg width="86" height="66" viewBox="0 0 52 40" fill="none" stroke="#E9B63F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8,33 L8,25 C8,17 14,10.5 26,10.5 C38,10.5 44,17 44,25 L44,33 Q44,34.5 42.5,34.5 L9.5,34.5 Q8,34.5 8,33 Z" />
          <path d="M8,25 H44" />
          <path d="M9.5,32.5 H42.5" />
          <path d="M11,32 V30 H14 V32 H17 V30 H20 V32 H23 V30 H26 V32 H29 V30 H32 V32 H35 V30 H38 V32 H41 V30" />
          <path d="M14.5,22 C11,18.5 13,14.8 18,14.3 C22,13.9 23.8,15.6 22.5,18 C21.2,20.4 17.6,22.4 14.5,22 Z" />
          <path d="M37.5,22 C41,18.5 39,14.8 34,14.3 C30,13.9 28.2,15.6 29.5,18 C30.8,20.4 34.4,22.4 37.5,22 Z" />
          <circle cx="15.8" cy="18.6" r="1" fill="#E9B63F" stroke="none" />
          <circle cx="36.2" cy="18.6" r="1" fill="#E9B63F" stroke="none" />
        </svg>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#F6F4EF" }}>
          Do&apos;ppi<span style={{ color: "#E9B63F" }}>.ai</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            color: "#F6F4EF",
            maxWidth: "960px",
          }}
        >
          {`${t.hero.titleTop} ${t.hero.titleHighlight}`}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9E9EA6", maxWidth: "900px" }}>
          {t.hero.subtitle}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 24, color: "#C98E1E" }}>
        <div style={{ display: "flex", width: 10, height: 10, borderRadius: 9999, background: "#E9B63F" }} />
        <div style={{ display: "flex" }}>doppi.ai</div>
      </div>
    </div>
  );
}
