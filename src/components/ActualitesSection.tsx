import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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

const NEWS_IMAGES = [newsV1Release, newsDashboard, newsCsvExport, newsJwtSecurity];
const NEWS_TYPES: NewsItem["type"][] = ["release", "feature", "feature", "security"];
const NEWS_BADGES = ["v1.0", undefined, undefined, undefined];

export const latestNews: NewsItem[] = NEWS_IMAGES.map((img, i) => ({
  id: `news-${i}`,
  date: "",
  type: NEWS_TYPES[i],
  title: "",
  excerpt: "",
  badge: NEWS_BADGES[i],
  image: img,
}));

export default function ActualitesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  const newsItems = t("news.items", { returnObjects: true }) as Array<{
    date: string; title: string; excerpt: string; highlight: string;
  }>;
  const typeLabels = t("news.typeLabels", { returnObjects: true }) as Record<string, string>;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const preview = newsItems.slice(0, 3);

  return (
    <section id="actualites" ref={sectionRef} className="py-14 bg-secondary section-fade overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              {t("news.label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {t("news.title1")}
              <br />
              <span className="text-gradient">{t("news.title2")}</span>
            </h2>
          </div>
          <Link to="/actualites" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0">
            {t("news.allNews")}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {preview.map((item, i) => {
            const type = NEWS_TYPES[i];
            const cfg = TYPE_CONFIG[type];
            const TypeIcon = cfg.icon;
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-300 cursor-default"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative h-40 overflow-hidden shrink-0">
                  <img src={NEWS_IMAGES[i]} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm backdrop-blur-sm" style={{ background: `${cfg.bg}ee`, color: cfg.color }}>
                    <TypeIcon className="w-3 h-3" />
                    {typeLabels[type]}
                  </span>
                  {NEWS_BADGES[i] && (
                    <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-sm" style={{ background: "hsl(var(--muted) / 0.9)", color: "hsl(var(--muted-foreground))" }}>
                      {NEWS_BADGES[i]}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 p-5 flex-1">
                  <span className="text-[11px] text-muted-foreground font-mono">{item.date}</span>
                  <h3 className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                    {item.excerpt}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: cfg.color }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
