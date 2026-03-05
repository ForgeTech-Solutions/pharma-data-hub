import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import AccessRequestModal from "@/components/AccessRequestModal";
import { Link } from "react-router-dom";
import { ArrowRight, UserPlus, Zap, Shield, Database } from "lucide-react";

// ─── Animated counter ──────────────────────────────────────────────────────────
function useCounter(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

// Typewriter code lines shown in the terminal widget
const CODE_SEQUENCE = [
  { text: "$ curl -X GET \\", color: "hsl(215 20% 65%)" },
  { text: '    "https://nnp.forge-solutions.tech/v1/medicaments/search?q=amoxicilline" \\', color: "hsl(215 20% 55%)" },
  { text: '    -H "Authorization: Bearer eyJhbGci..."', color: "hsl(142 72% 55%)" },
  { text: "", color: "" },
  { text: "← 200 OK  · 43ms", color: "hsl(142 72% 45%)" },
  { text: '{', color: "hsl(210 80% 70%)" },
  { text: '  "total": 12,', color: "hsl(215 20% 65%)" },
  { text: '  "results": [', color: "hsl(215 20% 65%)" },
  { text: '    { "id": 189, "nom_commercial": "Amoxil",', color: "hsl(38 72% 65%)" },
  { text: '      "dci": "Amoxicilline", "pack": "500mg",', color: "hsl(38 72% 65%)" },
  { text: '      "laboratoire": "GSK", "statut": "Autorisé" }', color: "hsl(38 72% 65%)" },
  { text: '  ]', color: "hsl(215 20% 65%)" },
  { text: '}', color: "hsl(210 80% 70%)" },
];

function LiveTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Reveal line-by-line with a short delay
    if (visibleLines >= CODE_SEQUENCE.length) { setDone(true); return; }
    timerRef.current = setTimeout(
      () => setVisibleLines((v) => v + 1),
      visibleLines < 3 ? 320 : visibleLines === 4 ? 500 : 90
    );
    return () => clearTimeout(timerRef.current);
  }, [visibleLines]);

  // Blinking cursor on last visible line
  const [cursor, setCursor] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(id);
  }, []);

  // Loop: reset after 6s of completion
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(() => { setVisibleLines(0); setCharIdx(0); setDone(false); }, 5000);
    return () => clearTimeout(id);
  }, [done]);

  return (
    <div className="rounded-2xl overflow-hidden border border-[hsl(215_28%_20%)] shadow-2xl" style={{ background: "hsl(215 28% 7%)" }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(215_28%_15%)]" style={{ background: "hsl(215 28% 10%)" }}>
        <span className="w-3 h-3 rounded-full bg-[hsl(0_72%_55%)]" />
        <span className="w-3 h-3 rounded-full bg-[hsl(38_72%_55%)]" />
        <span className="w-3 h-3 rounded-full bg-[hsl(142_72%_45%)]" />
        <span className="ml-3 text-[11px] font-mono text-[hsl(215_20%_40%)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_72%_45%)] animate-pulse" />
          API NPP · live
        </span>
      </div>
      {/* Code area */}
      <div className="p-5 font-mono text-[12px] leading-relaxed min-h-[260px]">
        {CODE_SEQUENCE.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ color: line.color || "transparent" }}>
            {line.text || "\u00A0"}
            {i === visibleLines - 1 && !done && (
              <span
                className="inline-block w-[7px] h-[13px] ml-0.5 align-middle rounded-sm"
                style={{ background: cursor ? "hsl(142 72% 55%)" : "transparent", transition: "background 0.1s" }}
              />
            )}
          </div>
        ))}
        {done && (
          <div className="mt-3 text-[10px] text-[hsl(215_20%_35%)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(142_72%_40%)]" />
            prêt — relance dans 5s…
          </div>
        )}
      </div>
    </div>
  );
}

const STATS = [
  { icon: Database, value: "7 000+", numTarget: 7000, suffix: "+", label: "Médicaments",      color: "hsl(142 72% 45%)" },
  { icon: Zap,      value: "< 100ms", numTarget: null, suffix: null, label: "Latence",          color: "hsl(210 80% 55%)" },
  { icon: Shield,   value: "JWT",     numTarget: null, suffix: null, label: "Authentification", color: "hsl(262 72% 60%)" },
];

function StatItem({ icon: Icon, value, numTarget, suffix, label, color, triggered }: {
  icon: React.ElementType; value: string; numTarget: number | null; suffix: string | null;
  label: string; color: string; triggered: boolean;
}) {
  const counted = useCounter(numTarget ?? 0, 1600, triggered && numTarget !== null);
  const displayValue = triggered && numTarget !== null
    ? `${(counted / 1000).toFixed(0)} 000${suffix ?? ""}`
    : value;

  return (
    <div className="flex items-center gap-2.5 group cursor-default">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
        style={{ background: color.replace(")", " / 0.12)"), border: `1px solid ${color.replace(")", " / 0.3)")}` }}>
        <Icon size={14} style={{ color }} />
      </div>
      <div>
        <div className="text-sm font-black text-white tabular-nums">{displayValue}</div>
        <div className="text-[10px] text-[hsl(215_20%_45%)] uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const statsRef   = useRef<HTMLDivElement>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setStatsTriggered(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "hsl(215 28% 7%)" }}>

        {/* ── Background layers ───────────────────────────── */}
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px,transparent 1px),linear-gradient(90deg,hsl(0 0% 100%) 1px,transparent 1px)", backgroundSize: "56px 56px" }} />

        {/* Gradient blobs */}
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-[0.07] blur-[140px] pointer-events-none" style={{ background: "hsl(142 72% 37%)" }} />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none" style={{ background: "hsl(210 80% 50%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px] pointer-events-none" style={{ background: "hsl(262 72% 55%)" }} />

        {/* ── Content ─────────────────────────────────────── */}
        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: Text */}
            <div>
              {/* Badge */}
              <div className="animate-fade-up inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-8 border"
                style={{ background: "hsl(142 72% 37% / 0.1)", borderColor: "hsl(142 72% 37% / 0.35)" }}>
                <span className="w-2 h-2 rounded-full animate-pulse-green" style={{ background: "hsl(142 72% 50%)" }} />
                <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "hsl(142 72% 65%)" }}>
                  {t("hero.badge")}
                </span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-up-1 text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.12] mb-6 tracking-tight">
                {t("hero.title1")}{" "}
                <span className="text-gradient">{t("hero.title2")}</span>
                <br />
                <span className="text-white">{t("hero.title3")}</span>
              </h1>

              {/* Subtitle */}
              <p className="animate-fade-up-2 text-base text-[hsl(215_20%_58%)] leading-relaxed max-w-lg mb-10">
                {t("hero.subtitle")}
              </p>

              {/* CTAs */}
              <div className="animate-fade-up-3 flex flex-wrap gap-3 mb-14">
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 gradient-primary text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 glow-primary text-sm"
                >
                  <UserPlus size={15} />
                  {t("hero.cta_access")}
                </button>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl border transition-all duration-200 group"
                  style={{ color: "hsl(215 20% 70%)", borderColor: "hsl(215 28% 22%)", background: "hsl(215 28% 12%)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(215 28% 32%)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 70%)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(215 28% 22%)"; }}
                >
                  {t("hero.cta_explorer")}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* Stats row */}
              <div className="animate-fade-up-4 flex flex-wrap gap-6 pt-6 border-t border-[hsl(215_28%_16%)]">
                {STATS.map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="flex items-center gap-2.5 group cursor-default">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background: color.replace("hsl(", "hsl(").replace(")", " / 0.12)"), border: `1px solid ${color.replace("hsl(", "hsl(").replace(")", " / 0.3)")}` }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{value}</div>
                      <div className="text-[10px] text-[hsl(215_20%_45%)] uppercase tracking-wider">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live terminal */}
            <div className="animate-fade-up-2 hidden lg:block">
              <LiveTerminal />

              {/* Trust badges below terminal */}
              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                {[
                  { label: "REST JSON",    color: "hsl(142 72% 37%)",  bg: "hsl(142 72% 37% / 0.1)",  border: "hsl(142 72% 37% / 0.3)"  },
                  { label: "HTTPS / TLS", color: "hsl(210 80% 50%)",  bg: "hsl(210 80% 50% / 0.1)",  border: "hsl(210 80% 50% / 0.3)"  },
                  { label: "MSPRH officiel", color: "hsl(38 72% 55%)", bg: "hsl(38 72% 37% / 0.1)",   border: "hsl(38 72% 37% / 0.3)"   },
                  { label: "99.9% uptime",color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.1)",  border: "hsl(262 72% 55% / 0.3)"  },
                ].map(({ label, color, bg, border }) => (
                  <span key={label} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                    style={{ color, background: bg, border: `1px solid ${border}` }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(215 28% 7%), transparent)" }} />
      </section>

      <AccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
