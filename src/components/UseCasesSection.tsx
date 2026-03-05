import { useEffect, useRef } from "react";
import { Building2, Pill, Smartphone, ClipboardList, ArrowRight } from "lucide-react";

const cases = [
  {
    icon: Building2,
    title: "Hôpitaux & Cliniques",
    tag: "Institutionnel",
    desc: "Accédez à la liste complète des médicaments autorisés pour alimenter vos systèmes de gestion hospitalière, vérifier les disponibilités et mettre à jour les formulaires thérapeutiques.",
    benefits: ["Vérification en temps réel", "Données officielles MSPRH", "Intégration HIS/LIS"],
    color: "hsl(210 80% 45%)",
    bg: "hsl(210 60% 97%)",
    border: "hsl(210 60% 87%)",
    accent: "hsl(210 60% 92%)",
  },
  {
    icon: Pill,
    title: "Pharmacies & Officines",
    tag: "Commerce",
    desc: "Consultez la nomenclature nationale pour valider les références produits, afficher les équivalences génériques et informer vos clients sur les médicaments disponibles.",
    benefits: ["Recherche par DCI ou marque", "Statut & disponibilité", "Export pour logiciels métier"],
    color: "hsl(142 72% 37%)",
    bg: "hsl(142 60% 97%)",
    border: "hsl(142 60% 85%)",
    accent: "hsl(142 60% 92%)",
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles Santé",
    tag: "Digital",
    desc: "Intégrez une base médicamenteuse complète dans votre app : fiches médicaments, alertes interactions, recherche intelligente — tout en un seul appel REST.",
    benefits: ["API REST standard", "Réponses JSON légères", "Pagination optimisée mobile"],
    color: "hsl(262 72% 50%)",
    bg: "hsl(262 60% 97%)",
    border: "hsl(262 60% 87%)",
    accent: "hsl(262 60% 92%)",
  },
  {
    icon: ClipboardList,
    title: "Systèmes de Prescription",
    tag: "Médical",
    desc: "Fiabilisez la prescription médicale en interrogeant la nomenclature officielle lors de la rédaction d'ordonnances : auto-complétion, validation et données de référence.",
    benefits: ["Auto-complétion DCI", "Validation des codes AMM", "Données catégories thérapeutiques"],
    color: "hsl(0 70% 45%)",
    bg: "hsl(0 60% 97%)",
    border: "hsl(0 60% 88%)",
    accent: "hsl(0 60% 93%)",
  },
];

export default function UseCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="usecases" ref={sectionRef} className="py-24 bg-background section-fade">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Cas d'usage
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Conçue pour les acteurs du secteur
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            De l'hôpital public à l'application mobile, l'API NPP s'intègre dans tous les systèmes de santé numériques.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <div
              key={c.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="section-fade group relative bg-card border rounded-2xl overflow-hidden card-hover cursor-default"
              style={{ borderColor: c.border, transitionDelay: `${i * 90}ms` }}
            >
              {/* Top color bar */}
              <div className="h-1 w-full" style={{ background: c.color }} />

              <div className="p-6">
                {/* Header row */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: c.accent }}
                  >
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: c.accent, color: c.color }}
                      >
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{c.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.desc}</p>

                {/* Benefits */}
                <ul className="space-y-1.5">
                  {c.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3 h-3 shrink-0" style={{ color: c.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
