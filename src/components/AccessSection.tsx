import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, Zap, Shield, RefreshCw, BarChart3,
  Sparkles, Lock, Crown, Code2, Infinity, Check, X,
} from "lucide-react";
import AccessRequestModal from "@/components/AccessRequestModal";

const PACK_META = [
  { id: "FREE",          color: "hsl(215 28% 50%)",  colorBg: "hsl(215 28% 50% / 0.08)",  colorBorder: "hsl(215 28% 50% / 0.25)", icon: Sparkles, featured: false, delay: 0   },
  { id: "PRO",           color: "hsl(210 80% 50%)",  colorBg: "hsl(210 80% 50% / 0.08)",  colorBorder: "hsl(210 80% 50% / 0.3)",  icon: Code2,    featured: false, delay: 80  },
  { id: "INSTITUTIONNEL",color: "hsl(142 72% 37%)",  colorBg: "hsl(142 72% 37% / 0.08)",  colorBorder: "hsl(142 72% 37% / 0.35)", icon: Shield,   featured: true,  delay: 160 },
  { id: "DÉVELOPPEUR",   color: "hsl(262 72% 55%)",  colorBg: "hsl(262 72% 55% / 0.08)",  colorBorder: "hsl(262 72% 55% / 0.3)",  icon: Crown,    featured: false, delay: 240 },
];

const STAT_ICONS = [BarChart3, Zap, RefreshCw, Shield];

export default function AccessSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef   = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [hoveredStat, setHoveredStat]   = useState<number | null>(null);

  const packs = t("access.packs", { returnObjects: true }) as Array<{
    tagline: string; desc: string; quotaLabel: string; cta: string;
    features: Array<{ label: string; ok: boolean }>;
  }>;
  const stats = t("access.stats", { returnObjects: true }) as Array<{ value: string; label: string; sub: string }>;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    [sectionRef, statsRef].forEach((r) => r.current && observer.observe(r.current));
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const openModal = (packId: string) => { setSelectedType(packId); setModalOpen(true); };

  return (
    <>
      <section id="access" ref={sectionRef} className="py-28 bg-background section-fade overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              {t("access.label")}
              <span className="w-6 h-px bg-primary inline-block" />
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">
              {t("access.title1")}
              <br />
              <span className="text-gradient">{t("access.title2")}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              {t("access.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-14">
            {PACK_META.map((meta, i) => {
              const pack = packs[i];
              if (!pack) return null;
              return (
                <div
                  key={meta.id}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  className="section-fade group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2"
                  style={{
                    transitionDelay: `${meta.delay}ms`,
                    background: meta.featured ? `linear-gradient(160deg, hsl(215 28% 9%), hsl(142 40% 10%))` : "hsl(var(--card))",
                    borderColor: meta.featured ? meta.color : "hsl(var(--border))",
                    boxShadow: meta.featured ? `0 0 0 1px ${meta.colorBorder}, 0 32px 64px -16px ${meta.colorBg}` : undefined,
                  }}
                >
                  {meta.featured && (
                    <div className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 text-white rounded-bl-xl z-10" style={{ background: meta.color }}>
                      {t("access.recommended")}
                    </div>
                  )}
                  <div className="h-1 w-full shrink-0" style={{ background: meta.color }} />
                  <div className="absolute bottom-4 right-4 pointer-events-none select-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-100" style={{ opacity: 0.06 }}>
                    <meta.icon style={{ width: 80, height: 80, color: meta.color }} />
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-10">
                    <div className="flex items-start gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: meta.colorBg }}>
                        <meta.icon className="w-5 h-5" style={{ color: meta.color }} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-widest leading-none mb-0.5" style={{ color: meta.color }}>
                          {meta.id}
                        </div>
                        <div className={`text-xs ${meta.featured ? "text-white/60" : "text-muted-foreground"}`}>
                          {pack.tagline}
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg mb-5 w-fit" style={{ background: meta.colorBg, color: meta.color }}>
                      {pack.quotaLabel === t("access.unlimited") || pack.quotaLabel === "Unlimited" || pack.quotaLabel === "Illimité"
                        ? <><Infinity className="w-3.5 h-3.5" /> {pack.quotaLabel}</>
                        : <><Zap className="w-3 h-3" /> {pack.quotaLabel}</>
                      }
                    </div>

                    <p className={`text-xs mb-6 leading-relaxed ${meta.featured ? "text-white/60" : "text-muted-foreground"}`}>
                      {pack.desc}
                    </p>

                    <ul className="space-y-2.5 mb-7 flex-1">
                      {pack.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-xs">
                          {f.ok
                            ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
                            : <X className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40" />
                          }
                          <span className={f.ok ? (meta.featured ? "text-white/85" : "text-foreground") : "text-muted-foreground/40 line-through"}>
                            {f.label}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => openModal(meta.id)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300 group/btn"
                      style={{ background: meta.colorBg, color: meta.color }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = meta.color; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = meta.colorBg; (e.currentTarget as HTMLButtonElement).style.color = meta.color; }}
                    >
                      {pack.cta}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Auth notice */}
          <div className="section-fade mb-14 flex items-start gap-3 text-sm px-5 py-4 rounded-xl border" style={{ transitionDelay: "280ms", background: "hsl(142 72% 37% / 0.05)", borderColor: "hsl(142 72% 37% / 0.2)" }}>
            <Lock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "hsl(142 72% 37%)" }} />
            <p className="text-muted-foreground text-xs leading-relaxed">
              <span className="font-semibold text-foreground">{t("access.authRequired")}</span>{" "}
              {t("access.authBody1")}{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">/health</code>,{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">/packs</code>{" "}
              {t("access.authBody2")}{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">/auth/signup</code>{")"}{" "}
              {t("access.authBody3")}{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Authorization: Bearer &lt;token&gt;</code>.{" "}
              {t("access.authBody4")}{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">POST /auth/login</code>{" "}
              {t("access.authBody5")} <strong className="text-foreground">{t("access.authBody6")}</strong>.
            </p>
          </div>

          {/* Stats banner */}
          <div ref={statsRef} className="section-fade relative rounded-3xl overflow-hidden gradient-hero" style={{ transitionDelay: "320ms" }}>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => {
                const isH = hoveredStat === i;
                const StatIcon = STAT_ICONS[i];
                return (
                  <div key={i} className="text-center cursor-default transition-all duration-300" style={{ transform: isH ? "translateY(-4px)" : "none" }} onMouseEnter={() => setHoveredStat(i)} onMouseLeave={() => setHoveredStat(null)}>
                    <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-300" style={{ background: isH ? "hsl(142 72% 37% / 0.25)" : "hsl(0 0% 100% / 0.06)" }}>
                      <StatIcon className="w-5 h-5 transition-colors duration-300" style={{ color: isH ? "hsl(142 72% 60%)" : "hsl(215 20% 55%)" }} />
                    </div>
                    <div className="text-3xl font-black text-gradient mb-1">{s.value}</div>
                    <div className="text-sm font-semibold text-white">{s.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: "hsl(215 20% 55%)" }}>{s.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <AccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} defaultType={selectedType} />
    </>
  );
}
