import { useEffect, useRef, useState } from "react";
import { Building2, Stethoscope, Smartphone, FileText, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import accessBg from "@/assets/access-section-bg.jpg";
import AccessRequestModal from "@/components/AccessRequestModal";

const plans = [
  {
    icon: Building2,
    type: "Établissements de santé",
    desc: "Hôpitaux publics, cliniques privées et structures sanitaires.",
    image: null,
    features: [
      "Accès illimité à la nomenclature nationale",
      "Consultation en temps réel des disponibilités",
      "Vérification des statuts d'enregistrement",
      "Données certifiées MSPRH",
    ],
    badge: "Institutionnel",
    badgeColor: "hsl(142 72% 37%)",
    delay: 0,
  },
  {
    icon: Stethoscope,
    type: "Pharmacies",
    desc: "Officines et grossistes répartiteurs.",
    image: null,
    features: [
      "Recherche par DCI, marque ou code AMM",
      "Historique des retraits et non-renouvellements",
      "Export CSV pour la gestion de stock",
      "Intégration logiciel de gestion",
    ],
    badge: "Pro",
    badgeColor: "hsl(210 80% 45%)",
    delay: 100,
  },
  {
    icon: Smartphone,
    type: "Éditeurs logiciels",
    desc: "Applications santé, systèmes HIS et plateformes de prescription.",
    image: null,
    features: [
      "API RESTful JSON, documentation complète",
      "Sandbox de test disponible",
      "SLA & support technique dédié",
      "Mises à jour automatiques des données",
    ],
    badge: "Développeur",
    badgeColor: "hsl(280 70% 48%)",
    delay: 200,
  },
];

const stats = [
  { value: "7 000+", label: "Médicaments", sub: "base nationale" },
  { value: "99.9%", label: "Disponibilité", sub: "uptime garanti" },
  { value: "<100ms", label: "Latence", sub: "temps de réponse" },
  { value: "24/7", label: "Support", sub: "équipe dédiée" },
];

export default function AccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const openModal = (type: string) => {
    setSelectedType(type);
    setModalOpen(true);
  };

  return (
    <>
      <section id="access" ref={sectionRef} className="py-24 bg-background section-fade overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Accès & Tarification
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Une solution pour chaque acteur de santé
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Accès sécurisé sur demande institutionnelle. Choisissez le profil
              correspondant à votre organisation.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan, i) => (
              <div
                key={plan.type}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden card-hover flex flex-col"
                style={{ transitionDelay: `${plan.delay}ms` }}
              >
                {/* Top color bar */}
                <div className="h-1 w-full" style={{ background: plan.badgeColor }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${plan.badgeColor}18` }}
                    >
                      <plan.icon className="w-6 h-6" style={{ color: plan.badgeColor }} />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: `${plan.badgeColor}18`, color: plan.badgeColor }}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1">{plan.type}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: plan.badgeColor }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => openModal(plan.type)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
                    style={{
                      background: `${plan.badgeColor}18`,
                      color: plan.badgeColor,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = plan.badgeColor;
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${plan.badgeColor}18`;
                      (e.currentTarget as HTMLButtonElement).style.color = plan.badgeColor;
                    }}
                  >
                    Demander l'accès
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Stats banner */}
          <div
            ref={statsRef}
            className="section-fade relative rounded-3xl overflow-hidden"
            style={{ transitionDelay: "300ms" }}
          >
            {/* BG image */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url(${accessBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 gradient-hero opacity-90" />

            <div className="relative px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((s, i) => (
                <div key={s.label} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="text-3xl font-black text-gradient mb-1">{s.value}</div>
                  <div className="text-sm font-semibold text-white">{s.label}</div>
                  <div className="text-xs text-[hsl(215_20%_55%)] mt-0.5">{s.sub}</div>
                </div>
              ))}
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
