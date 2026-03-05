import { useEffect, useRef } from "react";
import { ArrowLeft, Rss } from "lucide-react";
import { Link } from "react-router-dom";
import { latestNews, TYPE_CONFIG, type NewsItem } from "@/components/ActualitesSection";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = TYPE_CONFIG[item.type];
  const TypeIcon = cfg.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && el.classList.add("visible"),
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="section-fade group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-border/80 hover:shadow-lg transition-all duration-300"
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image banner */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/30 to-transparent" />

        {/* Badges over image */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow backdrop-blur-sm"
            style={{ background: `${cfg.bg}ee`, color: cfg.color }}
          >
            <TypeIcon className="w-3 h-3" />
            {cfg.label}
          </span>
          {item.badge && (
            <span
              className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm border"
              style={{
                background: "hsl(var(--muted) / 0.85)",
                color: "hsl(var(--muted-foreground))",
                borderColor: "hsl(var(--border))",
              }}
            >
              {item.badge}
            </span>
          )}
        </div>

        {/* Date bottom-left of image */}
        <span className="absolute bottom-3 left-4 text-xs text-muted-foreground font-mono">
          {item.date}
        </span>
      </div>

      {/* Content */}
      <div className="p-7">
        <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {item.excerpt}
        </p>

        {/* Highlight pill */}
        {item.highlight && (
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: cfg.color }}
            />
            {item.highlight}
          </div>
        )}

        {/* Detail bullets */}
        {item.details && item.details.length > 0 && (
          <ul className="space-y-2.5 border-t border-border pt-5 mt-1">
            {item.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: cfg.color }}
                />
                {detail}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"
        style={{ background: cfg.color }}
      />
    </article>
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
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 gap-8">
          {latestNews.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
