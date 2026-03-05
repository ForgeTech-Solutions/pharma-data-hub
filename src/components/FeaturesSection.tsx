import { useEffect, useRef } from "react";
import {
  Shield,
  FileSpreadsheet,
  Search,
  SlidersHorizontal,
  BarChart3,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Authentification JWT",
    desc: "Sécurisé avec gestion des rôles Admin / Lecteur. Tokens d'accès et de rafraîchissement intégrés.",
    tag: "Sécurité",
  },
  {
    icon: FileSpreadsheet,
    title: "Import Excel multi-feuilles",
    desc: "Nomenclature, Non Renouvelés et Retraits détectés automatiquement. Support .xlsx natif.",
    tag: "Import",
  },
  {
    icon: Search,
    title: "Recherche full-text",
    desc: "Par DCI, nom de marque, code AMM, laboratoire ou catégorie. Résultats instantanés.",
    tag: "Recherche",
  },
  {
    icon: SlidersHorizontal,
    title: "Pagination & Tri",
    desc: "Contrôle total sur les résultats : page, taille, champ de tri, ordre croissant ou décroissant.",
    tag: "Performance",
  },
  {
    icon: BarChart3,
    title: "Dashboard & Statistiques",
    desc: "Top laboratoires, répartition par type, pays d'origine, catégorie thérapeutique.",
    tag: "Analytics",
  },
  {
    icon: Download,
    title: "Export CSV",
    desc: "Données filtrées téléchargeables en un seul appel API. Format standard, prêt pour l'analyse.",
    tag: "Export",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 bg-background section-fade">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Fonctionnalités
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Une API conçue pour les développeurs et les institutions de santé,
            avec des fonctionnalités adaptées aux exigences du secteur pharmaceutique.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="section-fade group relative bg-card border border-border rounded-2xl p-6 card-hover cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 group-hover:gradient-primary transition-all duration-300">
                  <f.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-accent px-2 py-0.5 rounded-full mb-2">
                    {f.tag}
                  </span>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
