import { useEffect, useRef, useState } from "react";
import { Building2, Pill, Smartphone, ClipboardList } from "lucide-react";

const cases = [
  {
    icon: Building2,
    title: "Hôpitaux & Cliniques",
    tag: "Institutionnel",
    tagColor: "hsl(210 80% 45%)",
    desc: "Alimentez vos systèmes de gestion hospitalière avec la nomenclature nationale officielle. Vérifiez disponibilités et statuts en temps réel.",
    benefits: ["Accès à 7 000+ médicaments référencés", "Données certifiées MSPRH", "Intégration HIS/LIS simplifiée"],
    accent: "hsl(210 80% 45%)",
    num: "01",
  },
  {
    icon: Pill,
    title: "Pharmacies & Officines",
    tag: "Commerce",
    tagColor: "hsl(142 72% 37%)",
    desc: "Validez vos références produits, consultez les équivalences génériques et exportez vos données vers vos logiciels métier.",
    benefits: ["Recherche par DCI, marque ou code AMM", "Statut & disponibilité en direct", "Export CSV pour logiciels de stock"],
    accent: "hsl(142 72% 37%)",
    num: "02",
  },
  {
    icon: Smartphone,
    title: "Applications Mobiles Santé",
    tag: "Digital",
    tagColor: "hsl(262 72% 50%)",
    desc: "Intégrez une base médicamenteuse complète dans votre application via un seul appel REST — fiches, recherche intelligente, pagination.",
    benefits: ["API REST standard JSON", "Réponses légères & rapides", "Pagination optimisée mobile"],
    accent: "hsl(262 72% 50%)",
    num: "03",
  },
  {
    icon: ClipboardList,
    title: "Systèmes de Prescription",
    tag: "Médical",
    tagColor: "hsl(25 85% 50%)",
    desc: "Fiabilisez la prescription médicale en interrogeant la nomenclature officielle lors de la rédaction d'ordonnances.",
    benefits: ["Auto-complétion DCI & marque", "Validation des codes AMM", "Catégories thérapeutiques complètes"],
    accent: "hsl(25 85% 50%)",
    num: "04",
  },
];

export default function UseCasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="usecases" ref={sectionRef} className="py-28 bg-background section-fade overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              Cas d'usage
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Conçue pour chaque acteur
              <br />
              <span className="text-gradient">du secteur de santé</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed md:text-right">
            De l'hôpital public à l'application mobile, l'API NPP s'intègre dans tous les systèmes de santé numériques.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cases.map((c, i) => {
            const isHovered = hovered === i;
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden cursor-default transition-all duration-500"
                style={{
                  transitionDelay: `${i * 80}ms`,
                  boxShadow: isHovered ? `0 20px 60px -15px ${c.accent}40` : "none",
                  borderColor: isHovered ? `${c.accent}50` : undefined,
                  transform: isHovered ? "translateY(-4px)" : "none",
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Large background icon */}
                <div
                  className="absolute -bottom-6 -right-6 pointer-events-none select-none transition-all duration-500"
                  style={{
                    opacity: isHovered ? 0.1 : 0.05,
                    transform: isHovered ? "scale(1.08) rotate(-6deg)" : "scale(1) rotate(-6deg)",
                  }}
                >
                  <Icon style={{ width: 160, height: 160, color: c.accent }} strokeWidth={1} />
                </div>

                {/* Left color bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300"
                  style={{ background: c.accent, opacity: isHovered ? 1 : 0.4 }}
                />

                <div className="relative z-10 p-7 pl-8">
                  {/* Icon + tag */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0"
                      style={{
                        background: `${c.accent}15`,
                        boxShadow: isHovered ? `0 0 0 6px ${c.accent}10` : "none",
                      }}
                    >
                      <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" style={{ color: c.accent }} />
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: `${c.accent}12`, color: c.accent }}
                    >
                      {c.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.desc}</p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {c.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-xs">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: c.accent }}
                        />
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
