import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2, ArrowRight, Zap, Shield, RefreshCw, BarChart3,
  Sparkles, Lock, Crown, Code2, Infinity, Check, X, ChevronRight
} from "lucide-react";
import AccessRequestModal from "@/components/AccessRequestModal";

const packs = [
  {
    id: "FREE",
    name: "FREE",
    tagline: "Pour découvrir",
    desc: "Accès de base à la nomenclature nationale.",
    color: "hsl(215 28% 50%)",
    colorBg: "hsl(215 28% 50% / 0.08)",
    colorBorder: "hsl(215 28% 50% / 0.25)",
    icon: Sparkles,
    quota: { day: "100 req/j", month: "1 000 req/mois" },
    features: [
      { label: "Liste des médicaments", ok: true },
      { label: "Recherche (nom, DCI, labo)", ok: true },
      { label: "Détail par ID", ok: true },
      { label: "DCI groupée", ok: false },
      { label: "Export CSV", ok: false },
      { label: "Statistiques & dashboard", ok: false },
    ],
    cta: "Créer un compte",
    featured: false,
    delay: 0,
  },
  {
    id: "PRO",
    name: "PRO",
    tagline: "Pour les professionnels",
    desc: "Requêtes illimitées et accès DCI & export.",
    color: "hsl(210 80% 50%)",
    colorBg: "hsl(210 80% 50% / 0.08)",
    colorBorder: "hsl(210 80% 50% / 0.3)",
    icon: Code2,
    quota: { day: "Illimité", month: "Illimité" },
    features: [
      { label: "Liste des médicaments", ok: true },
      { label: "Recherche (nom, DCI, labo)", ok: true },
      { label: "Détail par ID", ok: true },
      { label: "DCI groupée", ok: true },
      { label: "Export CSV", ok: true },
      { label: "Statistiques & dashboard", ok: false },
    ],
    cta: "Demander l'accès",
    featured: false,
    delay: 80,
  },
  {
    id: "INSTITUTIONNEL",
    name: "INSTITUTIONNEL",
    tagline: "Pour les établissements",
    desc: "Accès complet avec stats et tableau de bord.",
    color: "hsl(142 72% 37%)",
    colorBg: "hsl(142 72% 37% / 0.08)",
    colorBorder: "hsl(142 72% 37% / 0.35)",
    icon: Shield,
    quota: { day: "Illimité", month: "Illimité" },
    features: [
      { label: "Liste des médicaments", ok: true },
      { label: "Recherche (nom, DCI, labo)", ok: true },
      { label: "Détail par ID", ok: true },
      { label: "DCI groupée", ok: true },
      { label: "Export CSV", ok: true },
      { label: "Statistiques & dashboard", ok: true },
    ],
    cta: "Demander l'accès",
    featured: true,
    delay: 160,
  },
  {
    id: "DÉVELOPPEUR",
    name: "DÉVELOPPEUR",
    tagline: "Pour les éditeurs logiciels",
    desc: "Accès complet, sandbox et SLA dédié.",
    color: "hsl(262 72% 55%)",
    colorBg: "hsl(262 72% 55% / 0.08)",
    colorBorder: "hsl(262 72% 55% / 0.3)",
    icon: Crown,
    quota: { day: "Illimité", month: "Illimité" },
    features: [
      { label: "Liste des médicaments", ok: true },
      { label: "Recherche (nom, DCI, labo)", ok: true },
      { label: "Détail par ID", ok: true },
      { label: "DCI groupée", ok: true },
      { label: "Export CSV", ok: true },
      { label: "Statistiques & dashboard", ok: true },
    ],
    cta: "Demander l'accès",
    featured: false,
    delay: 240,
  },
];

const stats = [
  { icon: BarChart3, value: "7 000+", label: "Médicaments", sub: "base nationale complète" },
  { icon: Zap,       value: "99.9%",  label: "Disponibilité", sub: "uptime garanti" },
  { icon: RefreshCw, value: "<100ms", label: "Latence",       sub: "temps de réponse" },
  { icon: Shield,    value: "24/7",   label: "Support",       sub: "équipe dédiée" },
];

const quotaRows = [
  { pack: "FREE",          color: "hsl(215 28% 50%)", day: "100",       month: "1 000",    access: "Liste, recherche, détail" },
  { pack: "PRO",           color: "hsl(210 80% 50%)", day: "Illimité",  month: "Illimité", access: "+ DCI groupée, export CSV" },
  { pack: "INSTITUTIONNEL",color: "hsl(142 72% 37%)", day: "Illimité",  month: "Illimité", access: "+ Statistiques, dashboard" },
  { pack: "DÉVELOPPEUR",   color: "hsl(262 72% 55%)", day: "Illimité",  month: "Illimité", access: "Accès complet + sandbox" },
];

export default function AccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const tableRef   = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen]   = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [hoveredStat, setHoveredStat]   = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    [sectionRef, statsRef, tableRef].forEach((r) => r.current && observer.observe(r.current));
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const openModal = (packId: string) => { setSelectedType(packId); setModalOpen(true); };

  return (
    <>
      <section id="access" ref={sectionRef} className="py-28 bg-background section-fade overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* ── Header ── */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              Accès & Tarification
              <span className="w-6 h-px bg-primary inline-block" />
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">
              Choisissez votre niveau d'accès
              <br />
              <span className="text-gradient">selon votre usage</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Quatre packs adaptés à chaque acteur de santé. Inscription ouverte sur demande institutionnelle.
            </p>
          </div>

          {/* ── Pack cards ── */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-14">
            {packs.map((pack, i) => (
              <div
                key={pack.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{
                  transitionDelay: `${pack.delay}ms`,
                  background: pack.featured ? `linear-gradient(160deg, hsl(215 28% 9%), hsl(142 40% 10%))` : "hsl(var(--card))",
                  borderColor: pack.featured ? pack.color : "hsl(var(--border))",
                  boxShadow: pack.featured ? `0 0 0 1px ${pack.colorBorder}, 0 24px 60px -12px ${pack.colorBg}` : undefined,
                }}
              >
                {/* Featured ribbon */}
                {pack.featured && (
                  <div
                    className="absolute top-0 right-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 text-white rounded-bl-xl"
                    style={{ background: pack.color }}
                  >
                    Recommandé
                  </div>
                )}

                {/* Color accent top bar */}
                <div className="h-[3px] w-full shrink-0" style={{ background: pack.color }} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + pack name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: pack.colorBg }}
                    >
                      <pack.icon className="w-4 h-4" style={{ color: pack.color }} />
                    </div>
                    <div>
                      <div
                        className="text-[10px] font-black uppercase tracking-widest leading-none"
                        style={{ color: pack.color }}
                      >
                        {pack.name}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${pack.featured ? "text-white/60" : "text-muted-foreground"}`}>
                        {pack.tagline}
                      </div>
                    </div>
                  </div>

                  {/* Quota pill */}
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg mb-4 w-fit"
                    style={{ background: pack.colorBg, color: pack.color }}
                  >
                    {pack.quota.day === "Illimité"
                      ? <><Infinity className="w-3.5 h-3.5" /> Illimité</>
                      : <><Zap className="w-3 h-3" /> {pack.quota.day}</>
                    }
                  </div>

                  <p className={`text-xs mb-5 leading-relaxed ${pack.featured ? "text-white/60" : "text-muted-foreground"}`}>
                    {pack.desc}
                  </p>

                  {/* Feature list */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {pack.features.map((f) => (
                      <li key={f.label} className="flex items-center gap-2 text-xs">
                        {f.ok
                          ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: pack.color }} />
                          : <X className="w-3.5 h-3.5 shrink-0 text-muted-foreground/40" />
                        }
                        <span className={f.ok
                          ? pack.featured ? "text-white/80" : "text-foreground"
                          : "text-muted-foreground/40 line-through"
                        }>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => openModal(pack.name)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group/btn"
                    style={{ background: pack.colorBg, color: pack.color }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = pack.color;
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = pack.colorBg;
                      (e.currentTarget as HTMLButtonElement).style.color = pack.color;
                    }}
                  >
                    {pack.cta}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Quota comparison table ── */}
          <div
            ref={tableRef}
            className="section-fade mb-14 rounded-2xl border border-border overflow-hidden"
            style={{ transitionDelay: "200ms" }}
          >
            {/* Table header */}
            <div className="grid grid-cols-4 bg-muted/60 border-b border-border text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              <div className="px-5 py-3.5">Pack</div>
              <div className="px-5 py-3.5 text-center">Req / jour</div>
              <div className="px-5 py-3.5 text-center">Req / mois</div>
              <div className="px-5 py-3.5">Accès inclus</div>
            </div>

            {quotaRows.map((row, i) => (
              <div
                key={row.pack}
                className={`grid grid-cols-4 text-sm items-center transition-colors duration-150 hover:bg-muted/30 ${i < quotaRows.length - 1 ? "border-b border-border" : ""}`}
              >
                {/* Pack name */}
                <div className="px-5 py-4 flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: row.color }}
                  />
                  <span className="font-bold text-foreground text-xs tracking-wide">{row.pack}</span>
                </div>

                {/* Day quota */}
                <div className="px-5 py-4 text-center">
                  {row.day === "Illimité"
                    ? <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: row.color }}>
                        <Infinity className="w-3.5 h-3.5" /> Illimité
                      </span>
                    : <span className="inline-flex items-center justify-center w-16 mx-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${row.color}15`, color: row.color }}>
                        {row.day}
                      </span>
                  }
                </div>

                {/* Month quota */}
                <div className="px-5 py-4 text-center">
                  {row.month === "Illimité"
                    ? <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: row.color }}>
                        <Infinity className="w-3.5 h-3.5" /> Illimité
                      </span>
                    : <span className="inline-flex items-center justify-center w-20 mx-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${row.color}15`, color: row.color }}>
                        {row.month}
                      </span>
                  }
                </div>

                {/* Access */}
                <div className="px-5 py-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ChevronRight className="w-3 h-3 shrink-0" style={{ color: row.color }} />
                  {row.access}
                </div>
              </div>
            ))}
          </div>

          {/* ── Auth notice ── */}
          <div
            className="section-fade mb-14 flex items-start gap-3 text-sm px-5 py-4 rounded-xl border"
            style={{
              transitionDelay: "280ms",
              background: "hsl(142 72% 37% / 0.05)",
              borderColor: "hsl(142 72% 37% / 0.2)",
            }}
          >
            <Lock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "hsl(142 72% 37%)" }} />
            <p className="text-muted-foreground text-xs leading-relaxed">
              <span className="font-semibold text-foreground">Authentification requise.</span>{" "}
              Toutes les routes (sauf <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">/health</code>,{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">/packs</code> et{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">/auth/signup</code>) nécessitent un header{" "}
              <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Authorization: Bearer &lt;token&gt;</code>.{" "}
              Le token est obtenu via <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">POST /auth/login</code> et expire après <strong className="text-foreground">30 minutes</strong>.
            </p>
          </div>

          {/* ── Stats banner ── */}
          <div
            ref={statsRef}
            className="section-fade relative rounded-3xl overflow-hidden gradient-hero"
            style={{ transitionDelay: "320ms" }}
          >
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => {
                const isH = hoveredStat === i;
                return (
                  <div
                    key={s.label}
                    className="text-center cursor-default transition-all duration-300"
                    style={{ transform: isH ? "translateY(-4px)" : "none" }}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div
                      className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-300"
                      style={{ background: isH ? "hsl(142 72% 37% / 0.25)" : "hsl(0 0% 100% / 0.06)" }}
                    >
                      <s.icon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: isH ? "hsl(142 72% 60%)" : "hsl(215 20% 55%)" }}
                      />
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

      <AccessRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={selectedType}
      />
    </>
  );
}
