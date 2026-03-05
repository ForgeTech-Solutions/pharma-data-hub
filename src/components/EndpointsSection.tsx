import { useEffect, useRef } from "react";

const groups = [
  {
    name: "Auth",
    color: "hsl(0 70% 45%)",
    bg: "hsl(0 60% 97%)",
    border: "hsl(0 60% 88%)",
    endpoints: [
      { method: "POST", path: "/auth/token", desc: "Obtenir un token JWT" },
      { method: "POST", path: "/auth/register", desc: "Créer un compte (Admin)" },
      { method: "POST", path: "/auth/refresh", desc: "Renouveler le token" },
    ],
  },
  {
    name: "Médicaments",
    color: "hsl(142 72% 37%)",
    bg: "hsl(142 60% 97%)",
    border: "hsl(142 60% 85%)",
    endpoints: [
      { method: "GET", path: "/medicaments", desc: "Liste paginée avec filtres" },
      { method: "GET", path: "/medicaments/{id}", desc: "Détail d'un médicament" },
      { method: "GET", path: "/medicaments/search", desc: "Recherche full-text" },
      { method: "GET", path: "/medicaments/export/csv", desc: "Export CSV filtré" },
      { method: "GET", path: "/medicaments/stats", desc: "Statistiques & dashboard" },
    ],
  },
  {
    name: "Import",
    color: "hsl(210 80% 45%)",
    bg: "hsl(210 60% 97%)",
    border: "hsl(210 60% 87%)",
    endpoints: [
      { method: "POST", path: "/import/excel", desc: "Importer un fichier Excel" },
      { method: "GET", path: "/import/status/{job_id}", desc: "Statut d'import" },
      { method: "GET", path: "/import/history", desc: "Historique des imports" },
    ],
  },
];

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: "hsl(142 60% 92%)", text: "hsl(142 72% 30%)" },
  POST: { bg: "hsl(196 60% 90%)", text: "hsl(196 80% 35%)" },
};

export default function EndpointsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="endpoints" ref={sectionRef} className="py-24 bg-secondary section-fade">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Endpoints
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Référence des routes principales
          </h2>
          <p className="mt-4 text-muted-foreground">
            Trois groupes cohérents pour une intégration simple et prévisible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.name}
              className="bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300"
              style={{ borderColor: group.border }}
            >
              {/* Group header */}
              <div
                className="px-5 py-4 border-b flex items-center gap-3"
                style={{ backgroundColor: group.bg, borderColor: group.border }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{ color: group.color }}
                >
                  {group.name}
                </span>
                <span
                  className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${group.color}18`,
                    color: group.color,
                  }}
                >
                  {group.endpoints.length} routes
                </span>
              </div>

              {/* Endpoints */}
              <ul className="divide-y divide-border">
                {group.endpoints.map((ep) => (
                  <li
                    key={ep.path}
                    className="px-5 py-3.5 flex items-start gap-3 hover:bg-secondary/60 transition-colors duration-150"
                  >
                    <span
                      className="shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
                      style={{
                        backgroundColor: methodColors[ep.method]?.bg,
                        color: methodColors[ep.method]?.text,
                      }}
                    >
                      {ep.method}
                    </span>
                    <div>
                      <code className="text-xs font-mono text-foreground font-medium">
                        {ep.path}
                      </code>
                      <p className="text-xs text-muted-foreground mt-0.5">{ep.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
