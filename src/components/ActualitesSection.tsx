import { useEffect, useRef } from "react";
import { ArrowRight, Zap, Shield, Package, Wrench, Star } from "lucide-react";
import { Link } from "react-router-dom";
import newsV1Release from "@/assets/news-v1-release.jpg";
import newsDashboard from "@/assets/news-dashboard.jpg";
import newsCsvExport from "@/assets/news-csv-export.jpg";
import newsJwtSecurity from "@/assets/news-jwt-security.jpg";

export type NewsItem = {
  id: string;
  date: string;
  type: "feature" | "improvement" | "fix" | "release" | "security";
  title: string;
  excerpt: string;
  badge?: string;
  image: string;
  details?: string[];
  highlight?: string;
};

const TYPE_CONFIG = {
  feature:     { label: "Nouveauté",    icon: Star,    color: "hsl(262 72% 50%)", bg: "hsl(262 55% 95%)" },
  improvement: { label: "Amélioration", icon: Zap,     color: "hsl(210 80% 48%)", bg: "hsl(210 70% 95%)" },
  fix:         { label: "Correctif",    icon: Wrench,  color: "hsl(38 90% 40%)",  bg: "hsl(38 90% 95%)"  },
  release:     { label: "Version",      icon: Package, color: "hsl(142 72% 37%)", bg: "hsl(142 55% 95%)" },
  security:    { label: "Sécurité",     icon: Shield,  color: "hsl(0 70% 45%)",   bg: "hsl(0 60% 96%)"   },
};

export { TYPE_CONFIG };

export const latestNews: NewsItem[] = [
  {
    id: "v1-0-release",
    date: "5 mars 2026",
    type: "release",
    badge: "v1.0",
    image: newsV1Release,
    title: "Lancement officiel de l'API NPP v1.0",
    excerpt: "Première version stable de l'API Nomenclature Produits Pharmaceutiques. Accès à 7 000+ médicaments référencés, authentification JWT, packs FREE / PRO / INSTITUTIONNEL / DÉVELOPPEUR.",
    highlight: "7 000+ médicaments disponibles dès le lancement",
    details: [
      "Base de données complète avec 7 000+ médicaments référencés en France",
      "Authentification sécurisée via JWT avec expiration configurable à 30 minutes",
      "4 packs tarifaires : FREE (100 req/jour), PRO, INSTITUTIONNEL et DÉVELOPPEUR (illimités)",
      "Documentation complète avec explorateur interactif intégré",
      "Endpoints couvrant : liste paginée, recherche fulltext, détail par CIS, DCI (PRO+), stats & dashboard (INSTITUTIONNEL+)",
      "Taux de disponibilité garanti à 99,9 % avec temps de réponse < 100 ms",
    ],
  },
  {
    id: "dashboard-endpoint",
    date: "5 mars 2026",
    type: "feature",
    image: newsDashboard,
    title: "Nouvel endpoint : tableau de bord enrichi",
    excerpt: "L'endpoint GET /medicaments/dashboard est disponible pour les packs INSTITUTIONNEL et DÉVELOPPEUR. Il retourne le top 10 laboratoires, top 10 pays d'origine et la répartition par forme galénique.",
    highlight: "Disponible dès les packs INSTITUTIONNEL et DÉVELOPPEUR",
    details: [
      "Route : GET /medicaments/dashboard — accès INSTITUTIONNEL+ uniquement",
      "Retourne le Top 10 des laboratoires pharmaceutiques par volume de médicaments",
      "Retourne le Top 10 des pays d'origine des principes actifs",
      "Répartition complète par forme galénique (comprimés, gélules, sirops, injectables…)",
      "Données en temps réel synchronisées avec la base BDPM (Base de données publique des médicaments)",
      "Format JSON structuré, compatible avec les bibliothèques de visualisation (Chart.js, Recharts, D3.js)",
    ],
  },
  {
    id: "csv-export",
    date: "5 mars 2026",
    type: "feature",
    image: newsCsvExport,
    title: "Export CSV de la base complète",
    excerpt: "Les utilisateurs PRO+ peuvent désormais exporter la totalité de la base médicamenteuse au format CSV via GET /medicaments/export/csv avec filtres par catégorie, pays et laboratoire.",
    highlight: "Export filtrable : catégorie, pays, laboratoire",
    details: [
      "Route : GET /medicaments/export/csv — accès PRO et supérieur",
      "Export de la base complète (7 000+ entrées) en un seul fichier CSV optimisé",
      "Filtrage à la volée : paramètres ?categorie=, ?pays=, ?laboratoire= cumulables",
      "Champs inclus : CIS, DCI, nom commercial, laboratoire, pays d'origine, forme, dosage, voie d'administration",
      "Encodage UTF-8 avec BOM pour une compatibilité optimale avec Excel et LibreOffice",
      "En-têtes de colonnes en français, séparateur point-virgule (;) configurable",
    ],
  },
  {
    id: "jwt-security",
    date: "5 mars 2026",
    type: "security",
    image: newsJwtSecurity,
    title: "Authentification JWT avec expiration 30 min",
    excerpt: "Toutes les routes protégées nécessitent un Bearer Token obtenu via POST /auth/login. Les tokens expirent automatiquement après 30 minutes pour garantir la sécurité des accès institutionnels.",
    highlight: "Expiration automatique toutes les 30 minutes",
    details: [
      "Obtention du token : POST /auth/login avec corps JSON {\"email\": \"...\", \"password\": \"...\"}",
      "Transmission via header HTTP : Authorization: Bearer <votre_token>",
      "Expiration automatique après 30 minutes — renouvellement silencieux possible côté client",
      "Algorithme HS256 (HMAC SHA-256) pour la signature des tokens",
      "Gestion des erreurs : HTTP 401 si token absent ou invalide, HTTP 403 si pack insuffisant",
      "Recommandation : stocker le token en mémoire (non persistant) pour les applications institutionnelles",
    ],
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
                className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                  {/* Badge over image */}
                  <span
                    className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm"
                    style={{ background: `${cfg.bg}ee`, color: cfg.color }}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {cfg.label}
                  </span>
                  {item.badge && (
                    <span
                      className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm"
                      style={{ background: "hsl(var(--muted) / 0.9)", color: "hsl(var(--muted-foreground))" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <span className="text-[11px] text-muted-foreground font-mono">{item.date}</span>
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
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
