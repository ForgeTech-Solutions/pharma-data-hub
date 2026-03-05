import { useEffect, useRef } from "react";
import { ArrowRight, Zap, Shield, Package, Wrench, Star } from "lucide-react";
import { Link } from "react-router-dom";

export type NewsItem = {
  id: string;
  date: string;
  type: "feature" | "improvement" | "fix" | "release" | "security";
  title: string;
  excerpt: string;
  badge?: string;
};

const TYPE_CONFIG = {
  feature:     { label: "Nouveauté",    icon: Star,    color: "hsl(262 72% 50%)", bg: "hsl(262 55% 95%)" },
  improvement: { label: "Amélioration", icon: Zap,     color: "hsl(210 80% 48%)", bg: "hsl(210 70% 95%)" },
  fix:         { label: "Correctif",    icon: Wrench,  color: "hsl(38 90% 40%)",  bg: "hsl(38 90% 95%)"  },
  release:     { label: "Version",      icon: Package, color: "hsl(142 72% 37%)", bg: "hsl(142 55% 95%)" },
  security:    { label: "Sécurité",     icon: Shield,  color: "hsl(0 70% 45%)",   bg: "hsl(0 60% 96%)"   },
};

export const latestNews: NewsItem[] = [
  {
    id: "v1-0-release",
    date: "5 mars 2026",
    type: "release",
    title: "Lancement officiel de l'API NPP v1.0",
    excerpt: "Première version stable de l'API Nomenclature Produits Pharmaceutiques. Accès à 7 000+ médicaments référencés, authentification JWT, packs FREE / PRO / INSTITUTIONNEL / DÉVELOPPEUR.",
    badge: "v1.0",
  },
  {
    id: "dashboard-endpoint",
    date: "5 mars 2026",
    type: "feature",
    title: "Nouvel endpoint : tableau de bord enrichi",
    excerpt: "L'endpoint GET /medicaments/dashboard est disponible pour les packs INSTITUTIONNEL et DÉVELOPPEUR. Il retourne le top 10 laboratoires, top 10 pays d'origine et la répartition par forme galénique.",
  },
  {
    id: "csv-export",
    date: "5 mars 2026",
    type: "feature",
    title: "Export CSV de la base complète",
    excerpt: "Les utilisateurs PRO+ peuvent désormais exporter la totalité de la base médicamenteuse au format CSV via GET /medicaments/export/csv avec filtres par catégorie, pays et laboratoire.",
  },
  {
    id: "jwt-security",
    date: "5 mars 2026",
    type: "security",
    title: "Authentification JWT avec expiration 30 min",
    excerpt: "Toutes les routes protégées nécessitent un Bearer Token obtenu via POST /auth/login. Les tokens expirent automatiquement après 30 minutes pour garantir la sécurité des accès institutionnels.",
  },
];

export default function ActualitesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  // Show only 3 on homepage
  const preview = latestNews.slice(0, 3);

  return (
    <section id="actualites" ref={sectionRef} className="py-28 bg-secondary section-fade overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              Actualités
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Nouveautés & évolutions
              <br />
              <span className="text-gradient">de l'API</span>
            </h2>
          </div>
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0"
          >
            Toutes les actualités
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {preview.map((item, i) => {
            const cfg = TYPE_CONFIG[item.type];
            const TypeIcon = cfg.icon;
            return (
              <div
                key={item.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Top row: type badge + date */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  {item.badge && (
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground ml-auto">{item.date}</span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                {/* Accent bottom line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: cfg.color }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
