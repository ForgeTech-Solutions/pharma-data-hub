import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Shield, FileSpreadsheet, Search, SlidersHorizontal, BarChart3, Download } from "lucide-react";

const ICONS = [Shield, Search, SlidersHorizontal, BarChart3, Download, FileSpreadsheet];

const ACCENT_COLORS = [
  { color: "hsl(142 72% 37%)", bg: "hsl(142 72% 37% / 0.08)", border: "hsl(142 72% 37% / 0.25)" },
  { color: "hsl(210 80% 50%)", bg: "hsl(210 80% 50% / 0.08)", border: "hsl(210 80% 50% / 0.25)" },
  { color: "hsl(262 72% 55%)", bg: "hsl(262 72% 55% / 0.08)", border: "hsl(262 72% 55% / 0.25)" },
  { color: "hsl(38 80% 52%)",  bg: "hsl(38 80% 52% / 0.08)",  border: "hsl(38 80% 52% / 0.25)"  },
  { color: "hsl(142 72% 37%)", bg: "hsl(142 72% 37% / 0.08)", border: "hsl(142 72% 37% / 0.25)" },
  { color: "hsl(210 80% 50%)", bg: "hsl(210 80% 50% / 0.08)", border: "hsl(210 80% 50% / 0.25)" },
];

// Asymmetric grid: card 0 and 5 are wide (col-span-2) on md+
const GRID_SPANS = [
  "md:col-span-2",
  "",
  "",
  "",
  "",
  "md:col-span-2",
];

export default function FeaturesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const items = t("features.items", { returnObjects: true }) as Array<{ title: string; desc: string; tag: string }>;

  useEffect(() => {
    // Staggered per-card observer — each card gets its own threshold callback
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Apply delay via setTimeout so it actually staggers visually
            setTimeout(() => card.classList.add("visible"), i * 100);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(card);
      observers.push(obs);
    });
    // Section header fade
    const sectionObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) sectionRef.current?.classList.add("visible"); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) sectionObs.observe(sectionRef.current);
    return () => { observers.forEach((o) => o.disconnect()); sectionObs.disconnect(); };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-14 bg-background section-fade overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-4"
            style={{ color: "hsl(var(--primary))" }}>
            <span className="w-6 h-px" style={{ background: "hsl(var(--primary))" }} />
            {t("features.label")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight mb-4">
            {t("features.title")}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Asymmetric bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((f, i) => {
            const Icon   = ICONS[i];
            const accent = ACCENT_COLORS[i];
            const isWide = i === 0 || i === 5;

            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`section-fade group relative rounded-2xl border overflow-hidden cursor-default
                  transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
                  ${GRID_SPANS[i]}`}
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = accent.border;
                  el.style.boxShadow = `0 20px 60px -15px ${accent.bg.replace("0.08", "0.4")}`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = "hsl(var(--border))";
                  el.style.boxShadow = "";
                }}
              >
                {/* Top entry line */}
                <div className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${accent.color}, transparent)` }} />

                {/* Watermark */}
                <div className="absolute bottom-3 right-4 pointer-events-none select-none opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-500">
                  <Icon style={{ width: isWide ? 96 : 72, height: isWide ? 96 : 72, color: accent.color }} />
                </div>

                <div className={`p-6 flex ${isWide ? "md:flex-row md:items-center" : "flex-col"} gap-5 relative`}>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{ background: accent.bg, border: `1px solid ${accent.border}` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: accent.color }} />
                  </div>

                  <div className={isWide ? "flex-1" : ""}>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2"
                      style={{ background: accent.bg, color: accent.color }}>
                      {f.tag}
                    </span>
                    <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>

                {/* Bottom slide line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                  style={{ background: `linear-gradient(90deg, ${accent.color}, transparent)` }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
