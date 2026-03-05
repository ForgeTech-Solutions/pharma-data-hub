import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Pill, Smartphone, ClipboardList, ArrowRight, Check } from "lucide-react";

const ICONS = [Building2, Pill, Smartphone, ClipboardList];

const ACCENTS = [
  { color: "hsl(210 80% 50%)",  bg: "hsl(210 80% 50% / 0.08)",  border: "hsl(210 80% 50% / 0.25)",  glow: "hsl(210 80% 50% / 0.3)"  },
  { color: "hsl(142 72% 37%)",  bg: "hsl(142 72% 37% / 0.08)",  border: "hsl(142 72% 37% / 0.25)",  glow: "hsl(142 72% 37% / 0.3)"  },
  { color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.08)",  border: "hsl(262 72% 55% / 0.25)",  glow: "hsl(262 72% 55% / 0.3)"  },
  { color: "hsl(25 85% 52%)",   bg: "hsl(25 85% 52% / 0.08)",   border: "hsl(25 85% 52% / 0.25)",   glow: "hsl(25 85% 52% / 0.3)"   },
];

export default function UseCasesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const items = t("usecases.items", { returnObjects: true }) as Array<{
    title: string; tag: string; desc: string; benefits: string[];
  }>;

  useEffect(() => {
    // Staggered per-card IntersectionObserver
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => card.classList.add("visible"), i * 120);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(card);
      observers.push(obs);
    });
    const sectionObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) sectionRef.current?.classList.add("visible"); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) sectionObs.observe(sectionRef.current);
    return () => { observers.forEach((o) => o.disconnect()); sectionObs.disconnect(); };
  }, []);

  return (
    <section id="usecases" ref={sectionRef} className="py-14 bg-background section-fade overflow-hidden relative">

      {/* Background dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-6xl mx-auto px-6 relative">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{ color: "hsl(var(--primary))" }}>
              <span className="w-6 h-px" style={{ background: "hsl(var(--primary))" }} />
              {t("usecases.label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {t("usecases.title1")}
              <br />
              <span className="text-gradient">{t("usecases.title2")}</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed md:text-right">
            {t("usecases.subtitle")}
          </p>
        </div>

        {/* Asymmetric bento grid — card 0 spans 2 rows on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-2">
          {items.map((c, i) => {
            const accent = ACCENTS[i];
            const Icon   = ICONS[i];
            const isH    = hovered === i;
            const isTall = i === 0;

            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`section-fade group relative rounded-2xl border overflow-hidden cursor-default
                  transition-all duration-500 flex flex-col
                  ${isTall ? "md:row-span-2" : ""}`}
                style={{
                  background: "hsl(var(--card))",
                  borderColor: isH ? accent.border : "hsl(var(--border))",
                  boxShadow: isH ? `0 24px 64px -16px ${accent.glow}` : "none",
                  transform: isH ? "translateY(-4px)" : "none",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top accent line */}
                <div className="h-0.5 w-full transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${accent.color}, transparent)`, opacity: isH ? 1 : 0.4 }} />

                {/* Side accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-300"
                  style={{ background: accent.color, opacity: isH ? 1 : 0.3 }} />

                {/* Watermark icon */}
                <div className="absolute -bottom-4 -right-4 pointer-events-none select-none transition-all duration-500"
                  style={{
                    opacity: isH ? 0.1 : 0.04,
                    transform: isH ? "scale(1.1) rotate(-8deg)" : "scale(1) rotate(-8deg)",
                  }}>
                  <Icon style={{ width: isTall ? 180 : 130, height: isTall ? 180 : 130, color: accent.color }} strokeWidth={1} />
                </div>

                <div className={`relative z-10 p-7 pl-9 flex flex-col ${isTall ? "flex-1" : ""}`}>
                  {/* Index */}
                  <div className="text-[10px] font-black tabular-nums mb-4 tracking-[0.2em]"
                    style={{ color: accent.color, opacity: 0.5 }}>
                    0{i + 1}
                  </div>

                  {/* Icon + tag */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        background: accent.bg,
                        border: `1px solid ${accent.border}`,
                        boxShadow: isH ? `0 0 0 6px ${accent.bg}` : "none",
                      }}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: accent.color }} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: accent.bg, color: accent.color }}>
                      {c.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{c.desc}</p>

                  {/* Benefits */}
                  <ul className="space-y-2.5 flex-1">
                    {c.benefits.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2.5 text-xs">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: accent.bg, border: `1px solid ${accent.border}` }}>
                          <Check className="w-2.5 h-2.5" style={{ color: accent.color }} />
                        </div>
                        <span className="text-muted-foreground leading-relaxed">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA — tall card only */}
                  {isTall && (
                    <div className="mt-8 pt-5" style={{ borderTop: `1px solid ${accent.border}` }}>
                      <button className="flex items-center gap-2 text-xs font-bold transition-all duration-200 group/cta"
                        style={{ color: accent.color }}>
                        En savoir plus
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
