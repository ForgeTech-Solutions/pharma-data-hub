import { ArrowLeft, Scale, Building2, Globe, Mail, Phone, FileText, ShieldAlert, Gavel, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const SECTIONS = [
  { id: "editeur",      label: "Éditeur",                 icon: Building2,   color: "hsl(142 72% 37%)",  colorLight: "hsl(142 72% 55%)",  colorBg: "hsl(142 72% 37% / 0.08)",  border: "hsl(142 72% 37% / 0.3)" },
  { id: "hebergement",  label: "Hébergement",             icon: Globe,       color: "hsl(210 80% 50%)",  colorLight: "hsl(210 80% 65%)",  colorBg: "hsl(210 80% 50% / 0.08)",  border: "hsl(210 80% 50% / 0.3)" },
  { id: "propriete",    label: "Propriété intellectuelle", icon: Scale,       color: "hsl(262 72% 55%)",  colorLight: "hsl(262 72% 70%)",  colorBg: "hsl(262 72% 55% / 0.08)",  border: "hsl(262 72% 55% / 0.3)" },
  { id: "responsabilite", label: "Responsabilité",        icon: ShieldAlert, color: "hsl(38 90% 38%)",   colorLight: "hsl(38 90% 55%)",   colorBg: "hsl(38 90% 38% / 0.08)",   border: "hsl(38 90% 38% / 0.3)" },
  { id: "contact",      label: "Contact légal",           icon: Mail,        color: "hsl(0 72% 50%)",    colorLight: "hsl(0 72% 65%)",    colorBg: "hsl(0 72% 50% / 0.08)",    border: "hsl(0 72% 50% / 0.3)" },
];

export default function MentionsLegales() {
  const [active, setActive] = useState("editeur");

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
            style={{ background: "hsl(262 72% 55%)" }} />
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
                  <Gavel className="w-6 h-6" style={{ color: "hsl(142 72% 55%)" }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(142 72% 50%)" }}>
                    Légal
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-black text-white">Mentions légales</h1>
                </div>
              </div>
              <p className="text-base leading-relaxed max-w-xl" style={{ color: "hsl(215 20% 55%)" }}>
                Informations légales relatives à l'API Nomenclature des Produits Pharmaceutiques (NPP) — éditée par le{" "}
                <span className="text-white font-semibold">MSPRH</span>.
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
          <div className="flex-1 space-y-6 min-w-0">

            {/* Éditeur */}
            <LegalSection id="editeur" icon={Building2} title="Éditeur de l'API" accent={SECTIONS[0]}>
              <Row label="Organisme">Ministère de la Santé, de la Population et de la Réforme Hospitalière (MSPRH)</Row>
              <Row label="Adresse">DNC PREMIÈRE TRANCHÉ DERGANA, BORDJ EL KIFFAN, ALGER — Algérie</Row>
              <Row label="Téléphone">
                <a href="tel:+213557231187" className="hover:underline underline-offset-2" style={{ color: "hsl(142 72% 55%)" }}>
                  0557 23 11 87
                </a>
              </Row>
              <Row label="Email">
                <a href="mailto:contact@nhaddag.net" className="hover:underline underline-offset-2" style={{ color: "hsl(142 72% 55%)" }}>
                  contact@nhaddag.net
                </a>
              </Row>
              <Row label="Site officiel">
                <a href="https://www.msprh.dz" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline underline-offset-2"
                  style={{ color: "hsl(142 72% 55%)" }}>
                  www.msprh.dz <ExternalLink className="w-3 h-3" />
                </a>
              </Row>
            </LegalSection>

            {/* Hébergement */}
            <LegalSection id="hebergement" icon={Globe} title="Hébergement" accent={SECTIONS[1]}>
              <Row label="Fournisseur">Forge Solutions — Infrastructure cloud souveraine</Row>
              <Row label="Localisation des données">Algérie</Row>
              <Row label="URL de base">
                <code className="text-xs px-2 py-0.5 rounded-md font-mono"
                  style={{ background: "hsl(215 28% 13%)", color: "hsl(210 80% 65%)" }}>
                  https://nnp.forge-solutions.tech/v1
                </code>
              </Row>
            </LegalSection>

            {/* Propriété intellectuelle */}
            <LegalSection id="propriete" icon={Scale} title="Propriété intellectuelle & Données" accent={SECTIONS[2]}>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 60%)" }}>
                Les données de la Nomenclature des Produits Pharmaceutiques sont la propriété exclusive du{" "}
                <span className="text-white font-semibold">Ministère de la Santé, de la Population et de la Réforme Hospitalière</span>{" "}
                de la République Algérienne Démocratique et Populaire.
              </p>
              <p className="text-sm leading-relaxed pt-3" style={{ color: "hsl(215 20% 60%)", borderTop: "1px solid hsl(215 28% 13%)" }}>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des données,
                quel que soit le moyen ou le procédé utilisé, est{" "}
                <span className="font-bold text-white">interdite sans autorisation préalable écrite</span> du MSPRH.
              </p>
              <p className="text-sm leading-relaxed pt-3" style={{ color: "hsl(215 20% 60%)", borderTop: "1px solid hsl(215 28% 13%)" }}>
                L'accès à l'API est conditionné à l'acceptation des{" "}
                <Link to="/conditions-utilisation" className="underline underline-offset-2" style={{ color: "hsl(262 72% 70%)" }}>
                  conditions d'utilisation
                </Link>{" "}
                et à l'obtention d'un token d'accès valide.
              </p>
            </LegalSection>

            {/* Responsabilité */}
            <LegalSection id="responsabilite" icon={ShieldAlert} title="Limitation de responsabilité" accent={SECTIONS[3]}>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 60%)" }}>
                Le MSPRH met tout en œuvre pour maintenir l'exactitude et la mise à jour des données disponibles via l'API.
                Cependant, il ne peut être tenu responsable des erreurs ou omissions dans les données fournies,
                ni des conséquences de leur utilisation.
              </p>
              <p className="text-sm leading-relaxed pt-3" style={{ color: "hsl(215 20% 60%)", borderTop: "1px solid hsl(215 28% 13%)" }}>
                L'utilisateur de l'API est <span className="font-bold text-white">seul responsable</span> de l'interprétation
                et de l'utilisation des données dans ses propres applications.
              </p>
            </LegalSection>

            {/* Contact légal */}
            <LegalSection id="contact" icon={Mail} title="Contact légal" accent={SECTIONS[4]}>
              <Row label="Email légal">
                <a href="mailto:contact@nhaddag.net" className="hover:underline underline-offset-2" style={{ color: "hsl(0 72% 65%)" }}>
                  contact@nhaddag.net
                </a>
              </Row>
              <Row label="Pour toute question">Propriété intellectuelle, licences, signalements d'abus ou demandes de dérogation</Row>
            </LegalSection>

          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

function LegalSection({
  id, icon: Icon, title, accent, children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  accent: typeof SECTIONS[0];
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="rounded-2xl overflow-hidden scroll-mt-28"
      style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}
    >
      {/* Card header with left accent bar */}
      <div className="flex items-center gap-3 px-6 py-4 relative" style={{ borderBottom: "1px solid hsl(215 28% 13%)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: accent.color }} />
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: accent.colorBg }}>
          <Icon className="w-4 h-4" style={{ color: accent.colorLight }} />
        </div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2.5"
      style={{ borderBottom: "1px solid hsl(215 28% 11%)" }}>
      <span className="text-[10px] font-black uppercase tracking-widest shrink-0 sm:w-40 pt-0.5"
        style={{ color: "hsl(215 20% 40%)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: "hsl(215 20% 65%)" }}>{children}</span>
    </div>
  );
}
