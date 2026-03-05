import { ArrowLeft, FileText, Key, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const SECTIONS = [
  {
    id: "acces",
    label: "Accès à l'API",
    icon: Key,
    color: "hsl(142 72% 37%)",
    colorLight: "hsl(142 72% 55%)",
    colorBg: "hsl(142 72% 37% / 0.08)",
    border: "hsl(142 72% 37% / 0.3)",
    content: [
      "L'accès à l'API NPP est réservé aux professionnels et établissements du secteur de la santé, aux développeurs d'applications médicales, et aux organismes de recherche accrédités.",
      "Un token d'authentification JWT est requis pour toutes les requêtes. Ce token est obtenu via l'espace personnel après validation de votre demande d'accès par l'équipe MSPRH.",
      "Chaque token est lié à un compte et un pack tarifaire. Il expire automatiquement selon les conditions du pack souscrit.",
    ],
  },
  {
    id: "autorisations",
    label: "Utilisations autorisées",
    icon: CheckCircle2,
    color: "hsl(210 80% 50%)",
    colorLight: "hsl(210 80% 65%)",
    colorBg: "hsl(210 80% 50% / 0.08)",
    border: "hsl(210 80% 50% / 0.3)",
    content: [
      "Consultation des données de la Nomenclature des Produits Pharmaceutiques dans le cadre d'applications de gestion médicale ou pharmaceutique.",
      "Intégration dans des systèmes hospitaliers (HIS), logiciels de pharmacie, plateformes de télémédecine ou outils de recherche clinique.",
      "Développement d'applications mobiles ou web destinées aux professionnels de santé, dans le respect de la législation algérienne.",
      "Utilisation dans des travaux académiques ou de recherche dans le secteur pharmaceutique et médical.",
    ],
  },
  {
    id: "interdictions",
    label: "Utilisations interdites",
    icon: XCircle,
    color: "hsl(0 72% 50%)",
    colorLight: "hsl(0 72% 65%)",
    colorBg: "hsl(0 72% 50% / 0.08)",
    border: "hsl(0 72% 50% / 0.3)",
    content: [
      "Il est strictement interdit de revendre, redistribuer ou publier les données de l'API sans autorisation écrite préalable du MSPRH.",
      "Toute tentative de contournement des mécanismes de sécurité (rate limiting, authentification JWT, etc.) est prohibée et peut entraîner la résiliation immédiate du compte.",
      "L'utilisation des données à des fins commerciales non médicales, de marketing ou de profilage est interdite.",
      "Il est interdit de créer un service API concurrent ou de miroir à partir des données fournies.",
    ],
  },
  {
    id: "quotas",
    label: "Quotas & Tarification",
    icon: RefreshCw,
    color: "hsl(262 72% 55%)",
    colorLight: "hsl(262 72% 70%)",
    colorBg: "hsl(262 72% 55% / 0.08)",
    border: "hsl(262 72% 55% / 0.3)",
    content: [
      "Chaque compte est soumis à des quotas de requêtes définis par le pack souscrit (Starter, Pro ou Institutionnel). Le dépassement de quota entraîne un retour d'erreur 429.",
      "Les quotas se renouvellent mensuellement. Aucun report du quota non consommé n'est effectué d'un mois à l'autre.",
      "Le MSPRH se réserve le droit de modifier les tarifs et conditions des packs avec un préavis de 30 jours communiqué par email.",
    ],
  },
  {
    id: "responsabilites",
    label: "Responsabilités",
    icon: AlertTriangle,
    color: "hsl(38 90% 38%)",
    colorLight: "hsl(38 90% 55%)",
    colorBg: "hsl(38 90% 38% / 0.08)",
    border: "hsl(38 90% 38% / 0.3)",
    content: [
      "L'utilisateur est entièrement responsable de l'utilisation qu'il fait des données de l'API dans ses applications et services.",
      "Le MSPRH ne saurait être tenu responsable des décisions médicales ou pharmaceutiques prises sur la base des données fournies par l'API.",
      "En cas de violation des présentes conditions, l'accès à l'API pourra être suspendu ou définitivement révoqué sans préavis.",
    ],
  },
  {
    id: "modifications",
    label: "Modifications des CGU",
    icon: Scale,
    color: "hsl(190 72% 45%)",
    colorLight: "hsl(190 72% 60%)",
    colorBg: "hsl(190 72% 45% / 0.08)",
    border: "hsl(190 72% 45% / 0.3)",
    content: [
      "Le MSPRH se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs seront notifiés par email en cas de changements substantiels.",
      "La poursuite de l'utilisation de l'API après notification vaut acceptation des nouvelles conditions.",
      "Les présentes conditions sont régies par le droit algérien. Tout différend sera soumis à la compétence exclusive des tribunaux algériens.",
    ],
  },
];

export default function ConditionsUtilisation() {
  const [active, setActive] = useState("acces");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.05]"
            style={{ background: "hsl(142 72% 50%)" }} />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-[0.04]"
            style={{ background: "hsl(210 80% 50%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(215 28% 18%), transparent)" }} />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200"
            style={{ color: "hsl(215 20% 50%)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 90%)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 50%)")}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "hsl(142 72% 37% / 0.12)", border: "1px solid hsl(142 72% 37% / 0.3)" }}>
                  <FileText className="w-6 h-6" style={{ color: "hsl(142 72% 55%)" }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(142 72% 50%)" }}>
                    Légal
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-black text-white">Conditions d'utilisation</h1>
                </div>
              </div>
              <p className="text-base leading-relaxed max-w-xl" style={{ color: "hsl(215 20% 55%)" }}>
                Règles et conditions d'accès à l'API NPP. En utilisant l'API, vous acceptez l'intégralité de ces conditions.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0"
              style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
              <FileText className="w-3.5 h-3.5" style={{ color: "hsl(215 20% 45%)" }} />
              <span className="text-xs font-mono" style={{ color: "hsl(215 20% 45%)" }}>v1.0 · 5 mars 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body: TOC + Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Sticky TOC */}
          <aside className="lg:w-52 shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: "hsl(215 20% 35%)" }}>
                Sommaire
              </p>
              <nav className="flex flex-row lg:flex-col gap-1.5 flex-wrap">
                {SECTIONS.map((s) => {
                  const isActive = active === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 w-full"
                      style={{
                        background: isActive ? s.colorBg : "transparent",
                        color: isActive ? s.colorLight : "hsl(215 20% 50%)",
                        border: `1px solid ${isActive ? s.border : "transparent"}`,
                      }}
                    >
                      <s.icon className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? s.colorLight : "hsl(215 20% 45%)" }} />
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 space-y-5 min-w-0">
            {SECTIONS.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="rounded-2xl overflow-hidden scroll-mt-28"
                style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 px-6 py-4 relative" style={{ borderBottom: "1px solid hsl(215 28% 13%)" }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: section.color }} />
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: section.colorBg }}>
                    <section.icon className="w-4 h-4" style={{ color: section.colorLight }} />
                  </div>
                  <h2 className="text-sm font-bold text-white">{section.label}</h2>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-4">
                  {section.content.map((text, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: section.color }} />
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 60%)" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Version bar */}
            <div className="flex items-center justify-between px-5 py-4 rounded-xl"
              style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
              <span className="text-xs font-mono" style={{ color: "hsl(215 20% 40%)" }}>
                CGU API NPP v1.0 · Dernière mise à jour : 5 mars 2026
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                style={{ background: "hsl(142 72% 37% / 0.1)", color: "hsl(142 72% 55%)", border: "1px solid hsl(142 72% 37% / 0.2)" }}>
                v1.0
              </span>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
