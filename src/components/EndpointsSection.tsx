import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Terminal, Zap, Lock, Code2, ArrowRight,
  Search, Database, BarChart3, Download,
} from "lucide-react";

const FEATURE_CHIPS = [
  { icon: Search,    label: "Recherche full-text",    color: "hsl(142 72% 37%)",  bg: "hsl(142 72% 37% / 0.1)",  border: "hsl(142 72% 37% / 0.3)" },
  { icon: Database,  label: "7 000+ médicaments",    color: "hsl(210 80% 50%)",  bg: "hsl(210 80% 50% / 0.1)",  border: "hsl(210 80% 50% / 0.3)" },
  { icon: Lock,      label: "JWT Bearer Auth",        color: "hsl(38 72% 55%)",   bg: "hsl(38 72% 37% / 0.1)",   border: "hsl(38 72% 37% / 0.3)"  },
  { icon: Download,  label: "Export CSV",             color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.1)",  border: "hsl(262 72% 55% / 0.3)" },
  { icon: BarChart3, label: "Dashboard & Stats",      color: "hsl(142 72% 37%)",  bg: "hsl(142 72% 37% / 0.1)",  border: "hsl(142 72% 37% / 0.3)" },
  { icon: Zap,       label: "< 100ms",               color: "hsl(210 80% 50%)",  bg: "hsl(210 80% 50% / 0.1)",  border: "hsl(210 80% 50% / 0.3)" },
];

const CODE_LINES = [
  { prompt: "$", cmd: "curl -X GET", accent: false },
  { prompt: " ", cmd: "  https://nnp.forge-solutions.tech/v1/medicaments/search?q=paracetamol", accent: false },
  { prompt: " ", cmd: '  -H "Authorization: Bearer <token>"', accent: true },
  { prompt: " ", cmd: "", accent: false },
  { prompt: "#", cmd: "← 200 OK · JSON · < 80ms", accent: true },
];

export default function EndpointsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    [sectionRef, cardRef].forEach((r) => r.current && observer.observe(r.current));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="endpoints"
      ref={sectionRef}
      className="py-14 section-fade overflow-hidden relative"
      style={{ background: "hsl(215 28% 7%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[120px] pointer-events-none" style={{ background: "hsl(142 72% 37%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[100px] pointer-events-none" style={{ background: "hsl(210 80% 50%)" }} />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Label */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            <span className="w-6 h-px bg-primary inline-block" />
            API REST · v1
            <span className="w-6 h-px bg-primary inline-block" />
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Explorez l'API en{" "}
            <span className="text-gradient">temps réel</span>
          </h2>
          <p className="text-[hsl(215_20%_60%)] text-base leading-relaxed">
            Testez chaque endpoint directement depuis le navigateur. Authentification, paramètres, réponses en direct — sans quitter votre navigateur.
          </p>
        </div>

        {/* Main card */}
        <div
          ref={cardRef}
          className="section-fade relative rounded-3xl border overflow-hidden"
          style={{ borderColor: "hsl(215 28% 20%)", background: "hsl(215 28% 10%)" }}
        >
          {/* Card top stripe */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, hsl(142 72% 37%), hsl(210 80% 50%), hsl(262 72% 55%))" }} />

          <div className="grid lg:grid-cols-2 gap-0">

            {/* Left: Terminal mockup */}
            <div className="p-8 border-r border-[hsl(215_28%_18%)]">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-[hsl(0_72%_55%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(38_72%_55%)]" />
                <div className="w-3 h-3 rounded-full bg-[hsl(142_72%_45%)]" />
                <span className="ml-3 text-[11px] font-mono text-[hsl(215_20%_40%)]">terminal · API NPP</span>
              </div>

              <div className="font-mono text-sm space-y-1.5">
                {CODE_LINES.map((line, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span
                      className="shrink-0 text-[11px] font-bold select-none"
                      style={{ color: line.prompt === "$" ? "hsl(142 72% 50%)" : line.prompt === "#" ? "hsl(38 72% 55%)" : "transparent" }}
                    >
                      {line.prompt}
                    </span>
                    <span
                      className="text-[13px] break-all"
                      style={{ color: line.accent ? "hsl(142 72% 60%)" : "hsl(215 20% 70%)" }}
                    >
                      {line.cmd}
                    </span>
                  </div>
                ))}

                {/* Animated response */}
                <div className="mt-4 pt-4 border-t border-[hsl(215_28%_18%)] space-y-1">
                  {[
                    '{ "total": 3, "results": [',
                    '  { "id": 42, "nom_commercial": "Doliprane",',
                    '    "dci": "Paracétamol", "pack": "500mg",',
                    '    "laboratoire": "Sanofi", ... }',
                    ']}'
                  ].map((l, i) => (
                    <div
                      key={i}
                      className="text-[12px] font-mono"
                      style={{
                        color: l.includes('"') ? "hsl(210 80% 70%)" : "hsl(215 20% 55%)",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Info + CTA */}
            <div className="p-8 flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[hsl(142_72%_37%/0.12)] border border-[hsl(142_72%_37%/0.3)]">
                    <Terminal size={17} style={{ color: "hsl(142 72% 50%)" }} />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">Explorateur interactif</h3>
                </div>
                <p className="text-sm text-[hsl(215_20%_55%)] leading-relaxed mb-6">
                  Notre interface Swagger intégrée vous permet de tester chaque route en live, visualiser les schémas de données et copier des exemples cURL prêts à l'emploi.
                </p>

                {/* Feature chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {FEATURE_CHIPS.map(({ icon: Icon, label, color, bg, border }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"
                      style={{ color, background: bg, border: `1px solid ${border}` }}
                    >
                      <Icon size={11} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/docs"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white gradient-primary glow-primary hover:opacity-90 hover:scale-[1.02] transition-all duration-200 group"
                >
                  <Code2 size={16} />
                  Ouvrir l'Explorateur API
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 border"
                  style={{
                    color: "hsl(215 20% 70%)",
                    borderColor: "hsl(215 28% 22%)",
                    background: "hsl(215 28% 13%)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(215 28% 32%)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 70%)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(215 28% 22%)";
                  }}
                >
                  Demander l'accès
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="border-t border-[hsl(215_28%_18%)] px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-[hsl(215_28%_8%)]">
            <div className="flex items-center gap-2 text-[11px] text-[hsl(215_20%_45%)]">
              <Lock size={11} />
              <span>Routes protégées :</span>
              <code className="text-[hsl(215_20%_60%)]">Authorization: Bearer &lt;token&gt;</code>
            </div>
            <code className="text-[11px] text-[hsl(215_20%_45%)] font-mono">
              https://nnp.forge-solutions.tech/v1
            </code>
          </div>
        </div>

      </div>
    </section>
  );
}
