import { ArrowLeft, ShieldCheck, Database, Lock, Eye, Trash2, Mail, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const SECTIONS = [
  {
    icon: Database,
    title: "Données collectées",
    color: "hsl(142 72% 37%)",
    colorLight: "hsl(142 72% 55%)",
    colorBg: "hsl(142 72% 37% / 0.09)",
    border: "hsl(142 72% 37% / 0.3)",
    content: [
      {
        subtitle: "Lors de l'inscription",
        text: "Nous collectons votre adresse e-mail, votre nom d'organisation ou d'établissement (optionnel) et un mot de passe chiffré (bcrypt). Aucune donnée bancaire ou personnelle sensible n'est requise pour l'inscription.",
      },
      {
        subtitle: "Lors de l'utilisation de l'API",
        text: "Nous enregistrons les métadonnées d'utilisation : endpoint appelé, timestamp, code de réponse, durée de la requête. Ces données sont utilisées exclusivement à des fins de monitoring, de quota et de sécurité.",
      },
    ],
  },
  {
    icon: Lock,
    title: "Sécurité des données",
    color: "hsl(210 80% 50%)",
    colorLight: "hsl(210 80% 65%)",
    colorBg: "hsl(210 80% 50% / 0.09)",
    border: "hsl(210 80% 50% / 0.3)",
    content: [
      {
        subtitle: "Authentification JWT",
        text: "Toutes les routes protégées nécessitent un token JWT signé, avec expiration automatique après 30 minutes. Les tokens ne sont jamais stockés côté serveur.",
      },
      {
        subtitle: "Chiffrement",
        text: "Les mots de passe sont hachés via bcrypt. Les communications sont sécurisées par TLS/HTTPS. L'infrastructure est hébergée en Algérie.",
      },
    ],
  },
  {
    icon: Eye,
    title: "Utilisation des données",
    color: "hsl(262 72% 55%)",
    colorLight: "hsl(262 72% 70%)",
    colorBg: "hsl(262 72% 55% / 0.09)",
    border: "hsl(262 72% 55% / 0.3)",
    content: [
      {
        subtitle: "Finalités",
        text: "Vos données sont utilisées uniquement pour : la gestion de votre compte, l'application des quotas par pack, la communication relative à l'API (mises à jour, incidents), et la sécurité de la plateforme.",
      },
      {
        subtitle: "Partage",
        text: "Vos données personnelles ne sont jamais vendues, louées ou partagées avec des tiers à des fins commerciales. Elles peuvent être transmises aux autorités compétentes sur réquisition judiciaire.",
      },
    ],
  },
  {
    icon: Trash2,
    title: "Conservation & Suppression",
    color: "hsl(38 90% 38%)",
    colorLight: "hsl(38 90% 55%)",
    colorBg: "hsl(38 90% 38% / 0.09)",
    border: "hsl(38 90% 38% / 0.3)",
    content: [
      {
        subtitle: "Durée de conservation",
        text: "Les données de compte sont conservées pendant la durée d'activité du compte. Les logs d'utilisation sont conservés 90 jours glissants.",
      },
      {
        subtitle: "Droit à l'effacement",
        text: "Vous pouvez demander la suppression de votre compte et de vos données à tout moment via votre espace personnel ou en contactant api@msprh.dz. La suppression est effective sous 30 jours.",
      },
    ],
  },
];

export default function PolitiqueConfidentialite() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.05]"
            style={{ background: "hsl(210 80% 50%)" }} />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-[0.04]"
            style={{ background: "hsl(262 72% 50%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(215 28% 18%), transparent)" }} />
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

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "hsl(210 80% 50% / 0.10)", border: "1px solid hsl(210 80% 50% / 0.25)" }}>
                  <ShieldCheck className="w-6 h-6" style={{ color: "hsl(210 80% 65%)" }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(210 80% 60%)" }}>
                    Confidentialité
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-black text-white">Politique de confidentialité</h1>
                </div>
              </div>
              <p className="text-base leading-relaxed max-w-xl" style={{ color: "hsl(215 20% 55%)" }}>
                Comment l'API NPP collecte, utilise et protège vos données personnelles, conformément à la{" "}
                <span className="text-white font-semibold">législation algérienne</span> en vigueur.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0"
              style={{ background: "hsl(210 80% 50% / 0.08)", border: "1px solid hsl(210 80% 50% / 0.2)" }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "hsl(210 80% 65%)" }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(210 80% 65%)" }}>
                RGPD-DZ
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Mobile accordion / Desktop timeline */}
          <div className="relative">
            {/* Vertical connector line (desktop) */}
            <div className="hidden lg:block absolute left-[23px] top-8 bottom-8 w-px"
              style={{ background: "linear-gradient(to bottom, hsl(142 72% 37% / 0.5), hsl(38 90% 38% / 0.5))" }} />

            <div className="space-y-5">
              {SECTIONS.map((section, idx) => {
                const isExpanded = expanded === idx;
                return (
                  <div key={section.title} className="flex gap-6">

                    {/* Timeline dot (desktop) */}
                    <div className="hidden lg:flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base z-10"
                        style={{ background: section.colorBg, border: `2px solid ${section.border}`, color: section.colorLight }}>
                        {idx + 1}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 rounded-2xl overflow-hidden transition-all duration-300"
                      style={{ background: "hsl(215 28% 9%)", border: `1px solid ${isExpanded ? section.border : "hsl(215 28% 14%)"}` }}>

                      {/* Header */}
                      <button
                        className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 group"
                        style={{ borderBottom: isExpanded ? `1px solid hsl(215 28% 13%)` : "none" }}
                        onClick={() => setExpanded(isExpanded ? null : idx)}
                      >
                        {/* Mobile number badge */}
                        <div className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                          style={{ background: section.colorBg, color: section.colorLight }}>
                          {idx + 1}
                        </div>
                        <div className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center shrink-0"
                          style={{ background: section.colorBg }}>
                          <section.icon className="w-4 h-4" style={{ color: section.colorLight }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                            style={{ color: section.colorLight }}>
                            Étape {idx + 1}
                          </p>
                          <h2 className="text-sm font-bold text-white">{section.title}</h2>
                        </div>
                        <div className="shrink-0 transition-transform duration-200" style={{ color: "hsl(215 20% 40%)" }}>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-6 py-5 space-y-5">
                          {section.content.map((item) => (
                            <div key={item.subtitle} className="flex gap-4">
                              <div className="w-1 rounded-full shrink-0 mt-1"
                                style={{ background: section.color, minHeight: 40 }} />
                              <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                                  style={{ color: section.colorLight }}>
                                  {item.subtitle}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 58%)" }}>
                                  {item.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DPO contact */}
          <div className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background: "hsl(210 80% 50% / 0.06)", border: "1px solid hsl(210 80% 50% / 0.18)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(210 80% 50% / 0.12)" }}>
              <Mail className="w-5 h-5" style={{ color: "hsl(210 80% 65%)" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white mb-1">Exercer vos droits (accès, rectification, suppression)</p>
              <p className="text-sm" style={{ color: "hsl(215 20% 55%)" }}>
                Contactez notre délégué à la protection des données :{" "}
                <a href="mailto:api@msprh.dz" className="underline underline-offset-2 transition-colors font-semibold"
                  style={{ color: "hsl(210 80% 65%)" }}>
                  api@msprh.dz
                </a>
                . Nous traitons votre demande sous <span className="text-white font-semibold">30 jours</span>.
              </p>
            </div>
          </div>

          {/* Version bar */}
          <div className="mt-5 flex items-center justify-between px-5 py-4 rounded-xl"
            style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
            <span className="text-xs font-mono" style={{ color: "hsl(215 20% 40%)" }}>
              Politique mise à jour le 5 mars 2026
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
              style={{ background: "hsl(210 80% 50% / 0.1)", color: "hsl(210 80% 65%)", border: "1px solid hsl(210 80% 50% / 0.2)" }}>
              RGPD-DZ
            </span>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
