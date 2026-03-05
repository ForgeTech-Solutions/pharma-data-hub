import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Building2, Pill, Smartphone, ClipboardList } from "lucide-react";

const ICONS = [Building2, Pill, Smartphone, ClipboardList];
const ACCENTS = [
  "hsl(210 80% 45%)",
  "hsl(142 72% 37%)",
  "hsl(262 72% 50%)",
  "hsl(25 85% 50%)",
];
const TAG_COLORS = ACCENTS;
const NUMS = ["01", "02", "03", "04"];

export default function UseCasesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const items = t("usecases.items", { returnObjects: true }) as Array<{
    title: string; tag: string; desc: string; benefits: string[];
  }>;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="usecases" ref={sectionRef} className="py-28 bg-background section-fade overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((c, i) => {
            const isHovered = hovered === i;
            const Icon = ICONS[i];
            const accent = ACCENTS[i];
            const tagColor = TAG_COLORS[i];
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden cursor-default transition-all duration-500"
                style={{
                  transitionDelay: `${i * 80}ms`,
                  boxShadow: isHovered ? `0 20px 60px -15px ${accent}40` : "none",
                  borderColor: isHovered ? `${accent}50` : undefined,
                  transform: isHovered ? "translateY(-4px)" : "none",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className="absolute -bottom-6 -right-6 pointer-events-none select-none transition-all duration-500"
                  style={{ opacity: isHovered ? 0.1 : 0.05, transform: isHovered ? "scale(1.08) rotate(-6deg)" : "scale(1) rotate(-6deg)" }}
                >
                  <Icon style={{ width: 160, height: 160, color: accent }} strokeWidth={1} />
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300" style={{ background: accent, opacity: isHovered ? 1 : 0.4 }} />

                <div className="relative z-10 p-7 pl-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0"
                      style={{ background: `${accent}15`, boxShadow: isHovered ? `0 0 0 6px ${accent}10` : "none" }}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: accent }} />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: `${tagColor}12`, color: tagColor }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.desc}</p>
                  <ul className="space-y-2">
                    {c.benefits.map((b, bi) => (
                      <li key={bi} className="flex items-center gap-2.5 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
