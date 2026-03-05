import { useEffect, useRef, useState } from "react";
import { Building2, Stethoscope, Smartphone, CheckCircle2, ArrowRight, Zap, Shield, RefreshCw, BarChart3 } from "lucide-react";
import AccessRequestModal from "@/components/AccessRequestModal";

const plans = [
  {
    icon: Building2,
    type: "Établissements de santé",
    desc: "Hôpitaux publics, cliniques privées et structures sanitaires.",
    features: [
      "Accès illimité à la nomenclature nationale",
      "Consultation en temps réel des disponibilités",
      "Vérification des statuts d'enregistrement",
      "Données certifiées MSPRH",
    ],
    badge: "Institutionnel",
    color: "hsl(142 72% 37%)",
    delay: 0,
  },
  {
    icon: Stethoscope,
    type: "Pharmacies",
    desc: "Officines et grossistes répartiteurs.",
    features: [
      "Recherche par DCI, marque ou code AMM",
      "Historique des retraits et non-renouvellements",
      "Export CSV pour la gestion de stock",
      "Intégration logiciel de gestion",
    ],
    badge: "Pro",
    color: "hsl(210 80% 45%)",
    delay: 100,
    featured: true,
  },
  {
    icon: Smartphone,
    type: "Éditeurs logiciels",
    desc: "Applications santé, systèmes HIS et plateformes de prescription.",
    features: [
      "API RESTful JSON, documentation complète",
      "Sandbox de test disponible",
      "SLA & support technique dédié",
      "Mises à jour automatiques des données",
    ],
    badge: "Développeur",
    color: "hsl(262 72% 50%)",
    delay: 200,
  },
];

const stats = [
  { icon: BarChart3, value: "7 000+", label: "Médicaments", sub: "base nationale complète" },
  { icon: Zap,       value: "99.9%",  label: "Disponibilité", sub: "uptime garanti" },
  { icon: RefreshCw, value: "<100ms", label: "Latence",       sub: "temps de réponse" },
  { icon: Shield,    value: "24/7",   label: "Support",       sub: "équipe dédiée" },
];

export default function AccessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
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
      <section id="access" ref={sectionRef} className="py-28 bg-background section-fade overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              Accès & Tarification
              <span className="w-6 h-px bg-primary inline-block" />
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">
              Une solution pour chaque
              <br />
              <span className="text-gradient">acteur de santé</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
              Accès sécurisé sur demande institutionnelle. Choisissez le profil correspondant à votre organisation.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-3 gap-5 mb-20">
            {plans.map((plan, i) => (
              <div
                key={plan.type}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2"
                style={{
                  transitionDelay: `${plan.delay}ms`,
                  boxShadow: plan.featured ? `0 0 0 2px ${plan.color}50, 0 20px 50px -15px ${plan.color}30` : undefined,
                }}
              >
                {/* Featured ribbon */}
                {plan.featured && (
                  <div
                    className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                    style={{ background: plan.color }}
                  >
                    Populaire
                  </div>
                )}

                {/* Top bar */}
                <div className="h-1 w-full" style={{ background: plan.color }} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${plan.color}12` }}
                  >
                    <plan.icon className="w-6 h-6" style={{ color: plan.color }} />
                  </div>

                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: `${plan.color}12`, color: plan.color }}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1 mt-1">{plan.type}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.desc}</p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: plan.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => openModal(plan.type)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 group/btn overflow-hidden relative"
                    style={{ background: `${plan.color}12`, color: plan.color }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = plan.color;
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${plan.color}12`;
                      (e.currentTarget as HTMLButtonElement).style.color = plan.color;
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
            className="section-fade relative rounded-3xl overflow-hidden gradient-hero"
            style={{ transitionDelay: "250ms" }}
          >
            {/* Grid lines decoration */}
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
                    className="text-center cursor-default group transition-all duration-300"
                    style={{
                      animationDelay: `${i * 80}ms`,
                      transform: isH ? "translateY(-4px)" : "none",
                    }}
                    onMouseEnter={() => setHoveredStat(i)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div
                      className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all duration-300"
                      style={{ background: isH ? "hsl(142 72% 37% / 0.25)" : "hsl(0 0% 100% / 0.06)" }}
                    >
                      <s.icon className="w-5 h-5 transition-colors duration-300" style={{ color: isH ? "hsl(142 72% 60%)" : "hsl(215 20% 55%)" }} />
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
