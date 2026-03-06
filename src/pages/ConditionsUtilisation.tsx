import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Key, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Scale, Shield, Gavel } from "lucide-react";
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
      "L'accès à l'API NPP est réservé aux professionnels du secteur de la santé, aux développeurs d'applications médicales, et aux organismes de recherche accrédités.",
      "Un token JWT est requis pour toutes les requêtes sécurisées. Ce token est obtenu via votre espace personnel après validation de votre demande.",
      "Chaque token est lié à un compte et un pack tarifaire. Il expire selon les conditions du pack souscrit.",
      "L'inscription est gratuite. L'équipe ForgeTech Solutions examine chaque demande sous 48h ouvrées.",
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
      "Consultation des données NPP dans le cadre d'applications de gestion médicale ou pharmaceutique.",
      "Intégration dans des systèmes hospitaliers (HIS), logiciels de pharmacie, plateformes de télémédecine.",
      "Développement d'applications mobiles ou web destinées aux professionnels de santé.",
      "Utilisation dans des travaux académiques ou de recherche dans le secteur pharmaceutique.",
      "Affichage des données avec indication claire de la source (MSPRH / API NPP).",
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
      "Il est strictement interdit de revendre, redistribuer ou publier les données sans autorisation écrite préalable.",
      "Tout contournement des mécanismes de sécurité (rate limiting, JWT) entraîne la résiliation immédiate du compte.",
      "L'utilisation à des fins commerciales non médicales ou de profilage de patients est interdite.",
      "Il est interdit de créer un service API concurrent ou un miroir des données fournies.",
      "L'accès partagé d'un même token entre plusieurs entités est strictement interdit.",
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
      "Chaque compte est soumis à des quotas définis par le pack souscrit. Le dépassement retourne une erreur HTTP 429.",
      "Les quotas se renouvellent mensuellement. Aucun report du quota non consommé n'est effectué.",
      "Pack Starter (gratuit) : 500 requêtes/mois. Les packs payants offrent des volumes plus élevés.",
      "ForgeTech Solutions se réserve le droit de modifier les tarifs avec un préavis de 30 jours.",
    ],
  },
  {
    id: "securite",
    label: "Sécurité & Confidentialité",
    icon: Shield,
    color: "hsl(38 90% 38%)",
    colorLight: "hsl(38 90% 55%)",
    colorBg: "hsl(38 90% 38% / 0.08)",
    border: "hsl(38 90% 38% / 0.3)",
    content: [
      "Votre token JWT est personnel et confidentiel. Ne le partagez jamais ni ne le commitez dans un dépôt public.",
      "En cas de compromission suspectée, révoquez le token immédiatement depuis votre tableau de bord.",
      "ForgeTech Solutions journalise les accès à des fins de sécurité. Ces logs sont conservés 90 jours.",
      "Toutes les communications se font via HTTPS (TLS 1.2+). Les requêtes HTTP sont rejetées.",
    ],
  },
  {
    id: "responsabilites",
    label: "Responsabilités",
    icon: AlertTriangle,
    color: "hsl(190 72% 45%)",
    colorLight: "hsl(190 72% 60%)",
    colorBg: "hsl(190 72% 45% / 0.08)",
    border: "hsl(190 72% 45% / 0.3)",
    content: [
      "L'utilisateur est entièrement responsable de l'utilisation qu'il fait des données dans ses applications.",
      "ForgeTech Solutions ne saurait être tenu responsable des décisions médicales prises sur la base des données.",
      "Les données sont fournies à titre informatif. Toute décision clinique doit être validée par un professionnel.",
      "En cas de violation des présentes conditions, l'accès pourra être suspendu sans préavis.",
    ],
  },
  {
    id: "modifications",
    label: "Modifications des CGU",
    icon: Scale,
    color: "hsl(262 72% 55%)",
    colorLight: "hsl(262 72% 70%)",
    colorBg: "hsl(262 72% 55% / 0.08)",
    border: "hsl(262 72% 55% / 0.3)",
    content: [
      "ForgeTech Solutions se réserve le droit de modifier ces conditions à tout moment avec notification par email.",
      "La poursuite de l'utilisation après notification des modifications vaut acceptation des nouvelles conditions.",
      "Ces conditions sont régies par le droit algérien. Tout différend sera soumis aux tribunaux d'Alger.",
    ],
  },
  {
    id: "contact",
    label: "Contact & Réclamations",
    icon: Gavel,
    color: "hsl(142 72% 37%)",
    colorLight: "hsl(142 72% 55%)",
    colorBg: "hsl(142 72% 37% / 0.08)",
    border: "hsl(142 72% 37% / 0.3)",
    content: [
      "Pour toute question relative aux présentes conditions : contact@nhaddag.net",
      "Pour signaler un abus, utilisez la même adresse avec « SIGNALEMENT ABUS » en objet.",
      "Les demandes d'autorisation spéciale sont examinées au cas par cas sur présentation d'un dossier.",
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
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
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

      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.05]"
            style={{ background: "hsl(142 72% 50%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(215 28% 18%), transparent)" }} />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <Link to="/"
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
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(142 72% 50%)" }}>Légal</p>
                  <h1 className="text-3xl sm:text-4xl font-black text-white">{"Conditions d'utilisation"}</h1>
                </div>
              </div>
              <p className="text-base leading-relaxed max-w-xl" style={{ color: "hsl(215 20% 55%)" }}>
                {"Règles et conditions d'accès à l'API NPP. En utilisant l'API, vous acceptez l'intégralité de ces conditions."}
              </p>
            </div>
            <span className="text-xs font-mono self-start sm:self-auto px-3 py-1.5 rounded-xl whitespace-nowrap"
              style={{ background: "hsl(215 28% 11%)", color: "hsl(215 20% 45%)", border: "1px solid hsl(215 28% 17%)" }}>
              v1.0 · 6 mars 2026
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto flex gap-8 items-start">
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4 px-1"
              style={{ color: "hsl(215 20% 38%)" }}>
              Sommaire
            </p>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                return (
                  <button key={s.id} onClick={() => scrollTo(s.id)}
                    className="flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 w-full"
                    style={{
                      background: isActive ? s.colorBg : "transparent",
                      color: isActive ? s.colorLight : "hsl(215 20% 45%)",
                      border: isActive ? `1px solid ${s.border}` : "1px solid transparent",
                    }}>
                    <s.icon className="w-3.5 h-3.5 shrink-0" />
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="flex-1 space-y-5 min-w-0">
            {SECTIONS.map((section) => (
              <div key={section.id} id={section.id}
                className="rounded-2xl overflow-hidden scroll-mt-28"
                style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
                <div className="flex items-center gap-3 px-6 py-4 relative"
                  style={{ borderBottom: "1px solid hsl(215 28% 13%)" }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                    style={{ background: section.color }} />
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: section.colorBg }}>
                    <section.icon className="w-4 h-4" style={{ color: section.colorLight }} />
                  </div>
                  <h2 className="text-sm font-bold text-white">{section.label}</h2>
                </div>
                <div className="px-6 py-5 space-y-3">
                  {section.content.map((text, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                        style={{ background: section.color }} />
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 60%)" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 rounded-xl"
              style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
              <span className="text-xs font-mono" style={{ color: "hsl(215 20% 40%)" }}>
                CGU API NPP v1.0 · 6 mars 2026 · ForgeTech Solutions
              </span>
              <Link to="/politique-confidentialite"
                className="text-[11px] font-semibold transition-colors duration-200"
                style={{ color: "hsl(215 20% 45%)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 88%)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 45%)")}
              >
                {"Politique de confidentialité →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
