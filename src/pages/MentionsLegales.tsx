import { ArrowLeft, Scale, Building2, Globe, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
            style={{ background: "hsl(142 72% 50%)" }} />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{ background: "hsl(210 80% 50%)" }} />
        </div>
        <div className="max-w-4xl mx-auto relative">
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

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(142 72% 37% / 0.12)", border: "1px solid hsl(142 72% 37% / 0.3)" }}>
              <Scale className="w-6 h-6" style={{ color: "hsl(142 72% 55%)" }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(142 72% 50%)" }}>
                Légal
              </p>
              <h1 className="text-3xl font-black text-white">Mentions légales</h1>
            </div>
          </div>
          <p className="text-base leading-relaxed" style={{ color: "hsl(215 20% 55%)" }}>
            Informations légales relatives à l'API Nomenclature des Produits Pharmaceutiques (NPP).
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Éditeur */}
          <LegalCard icon={Building2} title="Éditeur de l'API">
            <LegalRow label="Organisme">Ministère de la Santé, de la Population et de la Réforme Hospitalière (MSPRH)</LegalRow>
            <LegalRow label="Adresse">7, rue des Frères Bouadou, Birtouta, Alger — Algérie</LegalRow>
            <LegalRow label="Téléphone">+213 (0)23 18 17 00</LegalRow>
            <LegalRow label="Email"><a href="mailto:api@msprh.dz" className="underline underline-offset-2" style={{ color: "hsl(142 72% 55%)" }}>api@msprh.dz</a></LegalRow>
            <LegalRow label="Site officiel"><a href="https://www.msprh.dz" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2" style={{ color: "hsl(142 72% 55%)" }}>www.msprh.dz</a></LegalRow>
          </LegalCard>

          {/* Hébergement */}
          <LegalCard icon={Globe} title="Hébergement">
            <LegalRow label="Fournisseur">Forge Solutions — Infrastructure cloud souveraine</LegalRow>
            <LegalRow label="Localisation des données">Algérie</LegalRow>
            <LegalRow label="URL de base">https://nnp.forge-solutions.tech/v1</LegalRow>
          </LegalCard>

          {/* Propriété intellectuelle */}
          <LegalCard icon={Scale} title="Propriété intellectuelle & Données">
            <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 55%)" }}>
              Les données de la Nomenclature des Produits Pharmaceutiques sont la propriété exclusive du Ministère de la Santé, de la Population et de la Réforme Hospitalière de la République Algérienne Démocratique et Populaire.
            </p>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "hsl(215 20% 55%)" }}>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des données, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation préalable écrite du MSPRH.
            </p>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "hsl(215 20% 55%)" }}>
              L'accès à l'API est conditionné à l'acceptation des conditions d'utilisation et à l'obtention d'un token d'accès valide.
            </p>
          </LegalCard>

          {/* Responsabilité */}
          <LegalCard icon={Scale} title="Limitation de responsabilité">
            <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 55%)" }}>
              Le MSPRH met tout en œuvre pour maintenir l'exactitude et la mise à jour des données disponibles via l'API. Cependant, il ne peut être tenu responsable des erreurs ou omissions dans les données fournies, ni des conséquences de leur utilisation.
            </p>
            <p className="text-sm leading-relaxed mt-3" style={{ color: "hsl(215 20% 55%)" }}>
              L'utilisateur de l'API est seul responsable de l'interprétation et de l'utilisation des données dans ses propres applications.
            </p>
          </LegalCard>

          {/* Version */}
          <div className="flex items-center justify-between px-5 py-4 rounded-xl"
            style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
            <span className="text-xs font-mono" style={{ color: "hsl(215 20% 40%)" }}>
              API NPP v1.0 · Dernière mise à jour : 5 mars 2026
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: "hsl(142 72% 37% / 0.1)", color: "hsl(142 72% 55%)", border: "1px solid hsl(142 72% 37% / 0.2)" }}>
              v1.0
            </span>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

function LegalCard({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>, title: string, children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 space-y-4"
      style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
      <div className="flex items-center gap-3 pb-4"
        style={{ borderBottom: "1px solid hsl(215 28% 13%)" }}>
        <Icon className="w-4 h-4" style={{ color: "hsl(142 72% 50%)" }} />
        <h2 className="text-base font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function LegalRow({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2"
      style={{ borderBottom: "1px solid hsl(215 28% 11%)" }}>
      <span className="text-xs font-bold uppercase tracking-wider shrink-0 sm:w-40" style={{ color: "hsl(215 20% 45%)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: "hsl(215 20% 65%)" }}>{children}</span>
    </div>
  );
}
