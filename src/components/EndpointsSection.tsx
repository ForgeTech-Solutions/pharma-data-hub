import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const groups = [
  {
    name: "Auth",
    label: "Authentification",
    color: "hsl(0 70% 45%)",
    accent: "hsl(0 70% 45%)",
    endpoints: [
      { method: "POST", path: "/auth/login", desc: "Obtenir un token JWT d'accès" },
    ],
  },
  {
    name: "Médicaments",
    label: "Médicaments",
    color: "hsl(142 72% 37%)",
    accent: "hsl(142 72% 37%)",
    endpoints: [
      { method: "GET",  path: "/medicaments",                    desc: "Liste paginée avec filtres et tri" },
      { method: "GET",  path: "/medicaments?q=amoxicilline",     desc: "Recherche par nom, DCI, code, labo" },
      { method: "GET",  path: "/medicaments?categorie=RETRAIT",  desc: "Filtrer par catégorie" },
      { method: "GET",  path: "/medicaments/{id}",               desc: "Fiche détaillée par identifiant" },
      { method: "GET",  path: "/medicaments/par-dci/{dci}",      desc: "Tous les médicaments d'une molécule" },
      { method: "GET",  path: "/medicaments/statistiques",       desc: "Répartition labo, pays, type, catégorie" },
      { method: "GET",  path: "/medicaments/dashboard",          desc: "Top 10 labos & pays, chiffres globaux" },
      { method: "GET",  path: "/medicaments/export",             desc: "Export CSV complet (avec filtres)" },
    ],
  },
  {
    name: "Système",
    label: "Système",
    color: "hsl(210 70% 45%)",
    accent: "hsl(210 70% 45%)",
    endpoints: [
      { method: "GET", path: "/health", desc: "Statut de l'API (sans token)" },
    ],
  },
];

const METHOD_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  GET:  { bg: "hsl(142 50% 92%)", text: "hsl(142 72% 28%)", label: "GET" },
  POST: { bg: "hsl(210 70% 92%)", text: "hsl(210 80% 38%)", label: "POST" },
};

export default function EndpointsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeGroup, setActiveGroup] = useState(groups[0].name);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.06 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // animate rows on tab change
  useEffect(() => {
    rowRefs.current.forEach((r, i) => {
      if (!r) return;
      r.style.opacity = "0";
      r.style.transform = "translateY(12px)";
      setTimeout(() => {
        if (r) { r.style.opacity = "1"; r.style.transform = "translateY(0)"; }
      }, i * 60 + 50);
    });
  }, [activeGroup]);

  const currentGroup = groups.find((g) => g.name === activeGroup)!;

  return (
    <section id="endpoints" ref={sectionRef} className="py-28 bg-secondary section-fade overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              Endpoints
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Référence des routes
              <br />
              <span className="text-gradient">disponibles</span>
            </h2>
          </div>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            Explorateur interactif
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar tabs */}
          <div className="lg:w-52 shrink-0 flex lg:flex-col gap-2">
            {groups.map((g) => {
              const isActive = g.name === activeGroup;
              return (
                <button
                  key={g.name}
                  onClick={() => setActiveGroup(g.name)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full"
                  style={{
                    background: isActive ? `${g.color}12` : "transparent",
                    color: isActive ? g.color : "hsl(var(--muted-foreground))",
                    boxShadow: isActive ? `inset 3px 0 0 ${g.color}` : "none",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      background: isActive ? g.color : "hsl(var(--border))",
                      transform: isActive ? "scale(1.4)" : "scale(1)",
                    }}
                  />
                  {g.label}
                  <span
                    className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `${g.color}18`, color: g.color }}
                  >
                    {g.endpoints.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Endpoint list */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Panel header */}
              <div
                className="px-6 py-4 border-b border-border flex items-center gap-3"
                style={{ background: `${currentGroup.color}08` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: currentGroup.color }} />
                <span className="text-sm font-bold" style={{ color: currentGroup.color }}>
                  {currentGroup.label}
                </span>
                <code className="ml-auto text-xs text-muted-foreground font-mono">
                  nnp.forge-solutions.tech/v1
                </code>
              </div>

              <ul>
                {currentGroup.endpoints.map((ep, i) => {
                  const mc = METHOD_CONFIG[ep.method];
                  return (
                    <li
                      key={ep.path}
                      ref={(el) => { rowRefs.current[i] = el; }}
                      className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-secondary/60 transition-all duration-200"
                      style={{ transition: "opacity 0.3s ease, transform 0.3s ease, background 0.15s ease" }}
                    >
                      {/* Method badge */}
                      <span
                        className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg font-mono min-w-[46px] text-center tracking-wider"
                        style={{ background: mc.bg, color: mc.text }}
                      >
                        {mc.label}
                      </span>

                      {/* Path */}
                      <code className="text-sm font-mono text-foreground font-semibold flex-1 min-w-0 truncate">
                        {ep.path}
                      </code>

                      {/* Desc */}
                      <span className="text-sm text-muted-foreground hidden md:block whitespace-nowrap">
                        {ep.desc}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Base URL note */}
            <p className="mt-4 text-xs text-muted-foreground text-right">
              Base URL : <code className="font-mono text-foreground">https://nnp.forge-solutions.tech/v1</code>
              {" · "}Format : <code className="font-mono text-foreground">JSON</code>
              {" · "}Auth : <code className="font-mono text-foreground">Bearer JWT</code>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
