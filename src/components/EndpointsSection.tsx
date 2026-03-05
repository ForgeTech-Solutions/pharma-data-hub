import { useEffect, useRef, useState } from "react";
import { ExternalLink, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";

type Pack = "PUBLIC" | "FREE" | "PRO" | "INSTITUTIONNEL" | "DÉVELOPPEUR";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  desc: string;
  pack?: Pack;
  noAuth?: boolean;
}

interface Group {
  name: string;
  label: string;
  color: string;
  desc: string;
  endpoints: Endpoint[];
}

const PACK_CONFIG: Record<Pack, { label: string; bg: string; color: string }> = {
  PUBLIC:        { label: "Public",        bg: "hsl(210 60% 93%)", color: "hsl(210 80% 38%)" },
  FREE:          { label: "FREE+",         bg: "hsl(142 55% 90%)", color: "hsl(142 72% 28%)" },
  PRO:           { label: "PRO+",          bg: "hsl(262 55% 91%)", color: "hsl(262 72% 42%)" },
  INSTITUTIONNEL:{ label: "INSTITUTIONNEL+",bg:"hsl(38 90% 90%)",  color: "hsl(38 90% 32%)" },
  DÉVELOPPEUR:   { label: "DÉVELOPPEUR",   bg: "hsl(0 60% 93%)",   color: "hsl(0 70% 40%)" },
};

const groups: Group[] = [
  {
    name: "Publics",
    label: "Sans authentification",
    color: "hsl(210 70% 45%)",
    desc: "Accessible sans token",
    endpoints: [
      { method: "GET",  path: "/health", desc: "Vérifier que l'API est en ligne",                       noAuth: true, pack: "PUBLIC" },
      { method: "GET",  path: "/packs",  desc: "Consulter le catalogue des packs disponibles",           noAuth: true, pack: "PUBLIC" },
    ],
  },
  {
    name: "Auth",
    label: "Authentification",
    color: "hsl(0 70% 45%)",
    desc: "Gestion des comptes & tokens",
    endpoints: [
      { method: "POST", path: "/auth/signup", desc: "Créer un compte (en attente d'approbation admin)",  noAuth: true },
      { method: "POST", path: "/auth/login",  desc: "Se connecter et obtenir un token JWT (30 min)",     noAuth: true },
      { method: "GET",  path: "/auth/me",     desc: "Voir son profil, son pack et ses quotas restants" },
    ],
  },
  {
    name: "FREE",
    label: "Médicaments — FREE+",
    color: "hsl(142 72% 37%)",
    desc: "100 req/j · 1 000 req/mois",
    endpoints: [
      { method: "GET", path: "/medicaments/",          desc: "Liste paginée (params : skip, limit)",       pack: "FREE" },
      { method: "GET", path: "/medicaments/search?q=", desc: "Recherche par nom commercial, DCI ou labo",  pack: "FREE" },
      { method: "GET", path: "/medicaments/{id}",      desc: "Détail complet d'un médicament par son ID",  pack: "FREE" },
    ],
  },
  {
    name: "PRO",
    label: "Médicaments — PRO+",
    color: "hsl(262 72% 45%)",
    desc: "Illimité · + DCI & export",
    endpoints: [
      { method: "GET", path: "/medicaments/dci/{dci}",  desc: "Tous les médicaments d'une même DCI",  pack: "PRO" },
      { method: "GET", path: "/medicaments/export/csv", desc: "Export complet de la base au format CSV", pack: "PRO" },
    ],
  },
  {
    name: "INSTITUTIONNEL",
    label: "Médicaments — INSTITUTIONNEL+",
    color: "hsl(38 90% 38%)",
    desc: "Illimité · + Stats & dashboard",
    endpoints: [
      { method: "GET", path: "/medicaments/stats",     desc: "Statistiques globales (total, par forme, par labo…)", pack: "INSTITUTIONNEL" },
      { method: "GET", path: "/medicaments/dashboard", desc: "Tableau de bord enrichi",                             pack: "INSTITUTIONNEL" },
    ],
  },
];

const METHOD_CONFIG: Record<string, { bg: string; text: string }> = {
  GET:  { bg: "hsl(142 50% 90%)", text: "hsl(142 72% 26%)" },
  POST: { bg: "hsl(210 70% 91%)", text: "hsl(210 80% 36%)" },
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

  useEffect(() => {
    rowRefs.current.forEach((r, i) => {
      if (!r) return;
      r.style.opacity = "0";
      r.style.transform = "translateY(10px)";
      setTimeout(() => {
        if (r) { r.style.opacity = "1"; r.style.transform = "translateY(0)"; }
      }, i * 55 + 40);
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
            <p className="mt-3 text-sm text-muted-foreground max-w-md">
              Toutes les routes sauf <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">/health</code>,{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">/packs</code> et{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">/auth/signup</code> nécessitent un Bearer JWT.
              Le token expire après <strong>30 minutes</strong>.
            </p>
          </div>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            Explorateur interactif
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Quota strip */}
        <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { pack: "FREE",           reqs: "100 / jour",    month: "1 000 / mois",   color: "hsl(142 72% 37%)", bg: "hsl(142 55% 96%)" },
            { pack: "PRO",            reqs: "Illimité",      month: "Illimité",        color: "hsl(262 72% 45%)", bg: "hsl(262 55% 96%)" },
            { pack: "INSTITUTIONNEL", reqs: "Illimité",      month: "Illimité",        color: "hsl(38 90% 38%)",  bg: "hsl(38 90% 96%)"  },
            { pack: "DÉVELOPPEUR",    reqs: "Illimité",      month: "Accès complet",   color: "hsl(0 70% 45%)",   bg: "hsl(0 60% 97%)"   },
          ].map((q) => (
            <div
              key={q.pack}
              className="rounded-xl px-4 py-3 border"
              style={{ background: q.bg, borderColor: `${q.color}30` }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: q.color }}>{q.pack}</span>
              <p className="text-sm font-bold text-foreground mt-1">{q.reqs}</p>
              <p className="text-[11px] text-muted-foreground">{q.month}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-60 shrink-0 flex lg:flex-col gap-2">
            {groups.map((g) => {
              const isActive = g.name === activeGroup;
              return (
                <button
                  key={g.name}
                  onClick={() => setActiveGroup(g.name)}
                  className="flex flex-col items-start gap-0.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left w-full relative overflow-hidden"
                  style={{
                    background: isActive ? `${g.color}0f` : "transparent",
                    color: isActive ? g.color : "hsl(var(--muted-foreground))",
                    boxShadow: isActive ? `inset 3px 0 0 ${g.color}` : "none",
                  }}
                >
                  <div className="flex items-center gap-2.5 w-full">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 transition-all duration-200"
                      style={{
                        background: isActive ? g.color : "hsl(var(--border))",
                        boxShadow: isActive ? `0 0 6px ${g.color}` : "none",
                      }}
                    />
                    <span className="flex-1 min-w-0 truncate text-sm">{g.label}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: `${g.color}18`, color: g.color }}
                    >
                      {g.endpoints.length}
                    </span>
                  </div>
                  <span
                    className="text-[10px] pl-4.5 ml-4"
                    style={{ color: isActive ? `${g.color}99` : "hsl(var(--muted-foreground) / 0.6)" }}
                  >
                    {g.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {/* Panel header */}
              <div
                className="px-6 py-4 border-b border-border flex items-center gap-3"
                style={{ background: `${currentGroup.color}08` }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: currentGroup.color, boxShadow: `0 0 8px ${currentGroup.color}60` }}
                />
                <span className="text-sm font-bold" style={{ color: currentGroup.color }}>
                  {currentGroup.label}
                </span>
                <span className="text-xs text-muted-foreground ml-1">— {currentGroup.desc}</span>
                <code className="ml-auto text-xs text-muted-foreground font-mono hidden md:block">
                  nnp.forge-solutions.tech/v1
                </code>
              </div>

              <ul>
                {currentGroup.endpoints.map((ep, i) => {
                  const mc = METHOD_CONFIG[ep.method];
                  const pc = ep.pack ? PACK_CONFIG[ep.pack] : null;
                  return (
                    <li
                      key={ep.path}
                      ref={(el) => { rowRefs.current[i] = el; }}
                      className="flex items-center gap-3 px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/50 group cursor-default"
                      style={{ transition: "opacity 0.3s ease, transform 0.3s ease, background 0.15s ease" }}
                    >
                      {/* Auth lock icon */}
                      <span className="shrink-0 w-4 flex justify-center">
                        {ep.noAuth
                          ? <Unlock className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                          : <Lock   className="w-3 h-3 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors" />
                        }
                      </span>

                      {/* Method badge */}
                      <span
                        className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg font-mono min-w-[46px] text-center tracking-wider"
                        style={{ background: mc.bg, color: mc.text }}
                      >
                        {ep.method}
                      </span>

                      {/* Path */}
                      <code className="text-sm font-mono text-foreground font-semibold flex-1 min-w-0 truncate">
                        {ep.path}
                      </code>

                      {/* Pack badge */}
                      {pc && (
                        <span
                          className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 hidden sm:block"
                          style={{ background: pc.bg, color: pc.color }}
                        >
                          {pc.label}
                        </span>
                      )}

                      {/* Desc */}
                      <span className="text-xs text-muted-foreground hidden lg:block whitespace-nowrap max-w-[200px] truncate">
                        {ep.desc}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Footer note */}
            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3 shrink-0" />
                Routes protégées :
                <code className="font-mono text-foreground">Authorization: Bearer &lt;token&gt;</code>
                — expire dans <strong>30 min</strong>
              </p>
              <p className="text-xs text-muted-foreground text-right">
                Base URL : <code className="font-mono text-foreground">https://nnp.forge-solutions.tech/v1</code>
                {" · "}<code className="font-mono text-foreground">JSON</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
