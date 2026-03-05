import { ArrowLeft, ShieldCheck, Database, Lock, Eye, Trash2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const sections = [
  {
    icon: Database,
    title: "Données collectées",
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-5"
            style={{ background: "hsl(210 80% 50%)" }} />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{ background: "hsl(262 72% 50%)" }} />
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
              style={{ background: "hsl(210 80% 50% / 0.10)", border: "1px solid hsl(210 80% 50% / 0.25)" }}>
              <ShieldCheck className="w-6 h-6" style={{ color: "hsl(210 80% 65%)" }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(210 80% 60%)" }}>
                Confidentialité
              </p>
              <h1 className="text-3xl font-black text-white">Politique de confidentialité</h1>
            </div>
          </div>
          <p className="text-base leading-relaxed" style={{ color: "hsl(215 20% 55%)" }}>
            Cette politique décrit comment l'API NPP collecte, utilise et protège vos données personnelles, conformément à la législation algérienne en vigueur.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl p-6"
              style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
              <div className="flex items-center gap-3 pb-4 mb-4"
                style={{ borderBottom: "1px solid hsl(215 28% 13%)" }}>
                <section.icon className="w-4 h-4" style={{ color: "hsl(210 80% 60%)" }} />
                <h2 className="text-base font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-5">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <h3 className="text-sm font-bold mb-2" style={{ color: "hsl(215 20% 70%)" }}>
                      {item.subtitle}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 50%)" }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Contact DPO */}
          <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
            style={{ background: "hsl(210 80% 50% / 0.06)", border: "1px solid hsl(210 80% 50% / 0.18)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(210 80% 50% / 0.12)" }}>
              <Mail className="w-5 h-5" style={{ color: "hsl(210 80% 65%)" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">Exercer vos droits</p>
              <p className="text-sm" style={{ color: "hsl(215 20% 55%)" }}>
                Pour toute demande d'accès, de rectification ou de suppression de vos données, contactez :{" "}
                <a href="mailto:api@msprh.dz" className="underline underline-offset-2 transition-colors"
                  style={{ color: "hsl(210 80% 65%)" }}>
                  api@msprh.dz
                </a>
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="flex items-center justify-between px-5 py-4 rounded-xl"
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
