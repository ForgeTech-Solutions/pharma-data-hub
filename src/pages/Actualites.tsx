import { useEffect, useRef } from "react";
import { ArrowLeft, Zap, Shield, Package, Wrench, Star, Rss } from "lucide-react";
import { Link } from "react-router-dom";
import { latestNews, type NewsItem } from "@/components/ActualitesSection";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const TYPE_CONFIG = {
  feature:     { label: "Nouveauté",    icon: Star,    color: "hsl(262 72% 50%)", bg: "hsl(262 55% 95%)" },
  improvement: { label: "Amélioration", icon: Zap,     color: "hsl(210 80% 48%)", bg: "hsl(210 70% 95%)" },
  fix:         { label: "Correctif",    icon: Wrench,  color: "hsl(38 90% 40%)",  bg: "hsl(38 90% 95%)"  },
  release:     { label: "Version",      icon: Package, color: "hsl(142 72% 37%)", bg: "hsl(142 55% 95%)" },
  security:    { label: "Sécurité",     icon: Shield,  color: "hsl(0 70% 45%)",   bg: "hsl(0 60% 96%)"   },
};

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = TYPE_CONFIG[item.type];
  const TypeIcon = cfg.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("visible"),
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="section-fade group relative bg-card border border-border rounded-2xl p-7 flex flex-col md:flex-row gap-6 hover:border-border/80 hover:shadow-md transition-all duration-300"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Left: date column */}
      <div className="md:w-32 shrink-0 flex md:flex-col items-center md:items-start gap-3 md:gap-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: cfg.bg }}
        >
          <TypeIcon className="w-5 h-5" style={{ color: cfg.color }} />
        </div>
        <span className="text-xs text-muted-foreground mt-1 font-mono">{item.date}</span>
      </div>

      {/* Right: content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
          {item.badge && (
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                background: "hsl(var(--muted))",
                color: "hsl(var(--muted-foreground))",
                borderColor: "hsl(var(--border))",
              }}
            >
              {item.badge}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.excerpt}
        </p>
      </div>

      {/* Accent left bar */}
      <div
        className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
        style={{ background: cfg.color }}
      />
    </div>
  );
}

export default function Actualites() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 border-b" style={{ borderColor: "hsl(var(--code-border))" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-colors"
            style={{ color: "hsl(215 20% 55%)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hover:text-white transition-colors">Retour à l'accueil</span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary shrink-0">
              <Rss className="w-5 h-5 text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">
              Actualités
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Nouveautés &amp; évolutions
            <br />
            <span className="text-gradient">de l'API NPP</span>
          </h1>
          <p className="text-[hsl(215_20%_60%)] text-base max-w-xl leading-relaxed">
            Suivez les mises à jour, nouvelles fonctionnalités, correctifs et améliorations de performance de l'API Nomenclature Produits Pharmaceutiques.
          </p>

          {/* Counts */}
          <div className="mt-8 flex flex-wrap gap-3">
            {(Object.entries(TYPE_CONFIG) as [string, typeof TYPE_CONFIG[keyof typeof TYPE_CONFIG]][]).map(([key, cfg]) => {
              const count = latestNews.filter((n) => n.type === key).length;
              if (!count) return null;
              const Ic = cfg.icon;
              return (
                <div
                  key={key}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
                  style={{ background: "hsl(0 0% 100% / 0.07)", color: "hsl(215 20% 65%)" }}
                >
                  <Ic className="w-3 h-3" style={{ color: cfg.color }} />
                  {count} {cfg.label.toLowerCase()}{count > 1 ? "s" : ""}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News list */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-4">
          {latestNews.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
