import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Play, ArrowLeft, Copy, CheckCheck, Key, AlertCircle, Lock, Unlock, X } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Param {
  name: string;
  in: "query" | "path" | "body";
  required?: boolean;
  type: string;
  description: string;
  default?: string;
}
interface Endpoint {
  id: string;
  method: "GET" | "POST";
  path: string;
  summary: string;
  description: string;
  params: Param[];
  requiresAuth: boolean;
  exampleResponse: object;
}
interface Group {
  name: string;
  color: string;
  border: string;
  endpoints: Endpoint[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const groups: Group[] = [
  {
    name: "Authentification",
    color: "hsl(0 70% 45%)",
    border: "hsl(0 60% 88%)",
    endpoints: [
      {
        id: "auth-token",
        method: "POST",
        path: "/auth/token",
        summary: "Obtenir un token JWT",
        description: "Génère un token d'accès valide 30 minutes à partir de vos identifiants institutionnels.",
        requiresAuth: false,
        params: [
          { name: "username", in: "body", required: true, type: "string", description: "Identifiant utilisateur" },
          { name: "password", in: "body", required: true, type: "string", description: "Mot de passe" },
        ],
        exampleResponse: {
          access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImV4cCI6MTc0MTIwMDAwMH0...",
          refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInR5cGUiOiJyZWZyZXNoIn0...",
          token_type: "bearer",
          expires_in: 1800,
        },
      },
      {
        id: "auth-refresh",
        method: "POST",
        path: "/auth/refresh",
        summary: "Renouveler le token",
        description: "Renouvelle un token d'accès expiré via le refresh token.",
        requiresAuth: false,
        params: [
          { name: "refresh_token", in: "body", required: true, type: "string", description: "Token de rafraîchissement" },
        ],
        exampleResponse: {
          access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          token_type: "bearer",
          expires_in: 1800,
        },
      },
    ],
  },
  {
    name: "Médicaments",
    color: "hsl(142 72% 37%)",
    border: "hsl(142 60% 85%)",
    endpoints: [
      {
        id: "med-list",
        method: "GET",
        path: "/medicaments",
        summary: "Liste paginée des médicaments",
        description: "Retourne la liste complète des médicaments avec pagination, filtres et tri.",
        requiresAuth: true,
        params: [
          { name: "page", in: "query", type: "integer", description: "Numéro de page", default: "1" },
          { name: "size", in: "query", type: "integer", description: "Éléments par page (max 100)", default: "20" },
          { name: "sort_by", in: "query", type: "string", description: "Champ de tri", default: "nom_marque" },
          { name: "order", in: "query", type: "string", description: "asc ou desc", default: "asc" },
        ],
        exampleResponse: {
          total: 7234, page: 1, size: 20,
          items: [{ id: 1, nom_marque: "AMOXICILLINE 500MG", dci: "Amoxicilline", laboratoire: "SAIDAL", statut: "Actif" }],
        },
      },
      {
        id: "med-search",
        method: "GET",
        path: "/medicaments/search",
        summary: "Recherche full-text",
        description: "Recherche par DCI, nom de marque, code AMM, laboratoire ou catégorie thérapeutique.",
        requiresAuth: true,
        params: [
          { name: "q", in: "query", required: true, type: "string", description: "Terme de recherche", default: "amoxicilline" },
          { name: "page", in: "query", type: "integer", description: "Page", default: "1" },
          { name: "size", in: "query", type: "integer", description: "Taille", default: "10" },
        ],
        exampleResponse: {
          total: 12, query: "amoxicilline",
          items: [{ id: 1, nom_marque: "AMOXICILLINE 500MG", dci: "Amoxicilline", code_amm: "AM-2021-001", categorie: "Antibiotique" }],
        },
      },
      {
        id: "med-detail",
        method: "GET",
        path: "/medicaments/{id}",
        summary: "Détail d'un médicament",
        description: "Retourne les informations complètes d'un médicament par son identifiant.",
        requiresAuth: true,
        params: [
          { name: "id", in: "path", required: true, type: "integer", description: "Identifiant du médicament", default: "1" },
        ],
        exampleResponse: {
          id: 1, nom_marque: "AMOXICILLINE 500MG CAPS", dci: "Amoxicilline",
          laboratoire: "SAIDAL", code_amm: "AM-2021-001", forme: "Gélule",
          dosage: "500 mg", categorie: "Antibiotique", pays_origine: "Algérie",
          statut: "Actif", date_enregistrement: "2021-03-15",
        },
      },
      {
        id: "med-export",
        method: "GET",
        path: "/medicaments/export/csv",
        summary: "Export CSV",
        description: "Télécharge les données filtrées au format CSV.",
        requiresAuth: true,
        params: [
          { name: "q", in: "query", type: "string", description: "Filtre de recherche", default: "" },
          { name: "statut", in: "query", type: "string", description: "Filtre par statut", default: "" },
        ],
        exampleResponse: {
          message: "Fichier CSV généré",
          filename: "medicaments_export_2026-03-05.csv",
          rows: 7234,
        },
      },
      {
        id: "med-stats",
        method: "GET",
        path: "/medicaments/stats",
        summary: "Statistiques & Dashboard",
        description: "Retourne les statistiques agrégées : top laboratoires, répartition par catégorie, pays d'origine.",
        requiresAuth: true,
        params: [],
        exampleResponse: {
          total_medicaments: 7234,
          top_laboratoires: [{ nom: "SAIDAL", count: 312 }, { nom: "SANOFI", count: 245 }],
          by_statut: { Actif: 6891, "Non renouvelé": 212, Retiré: 131 },
          top_categories: [{ categorie: "Antibiotique", count: 890 }],
        },
      },
    ],
  },
];

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET:  { bg: "hsl(142 55% 90%)", text: "hsl(142 72% 25%)" },
  POST: { bg: "hsl(210 65% 90%)", text: "hsl(210 80% 32%)" },
};

// ─── JWT Banner ───────────────────────────────────────────────────────────────
const JWT_KEY = "npp_jwt_token";

function JwtPanel({ token, onChange }: { token: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const hasToken = token.trim().length > 0;

  return (
    <div
      className="rounded-2xl border overflow-hidden mb-8 transition-all duration-300"
      style={{
        borderColor: hasToken ? "hsl(142 60% 80%)" : "hsl(var(--border))",
        background: hasToken ? "hsl(142 60% 98%)" : "hsl(var(--card))",
        boxShadow: hasToken ? "0 0 0 1px hsl(142 60% 80%)" : "none",
      }}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: hasToken ? "hsl(142 60% 90%)" : "hsl(0 60% 92%)" }}
        >
          {hasToken
            ? <Unlock className="w-4 h-4" style={{ color: "hsl(142 72% 35%)" }} />
            : <Lock   className="w-4 h-4" style={{ color: "hsl(0 70% 45%)" }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: hasToken ? "hsl(142 72% 30%)" : "hsl(var(--foreground))" }}>
              Token JWT
            </span>
            {hasToken
              ? <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "hsl(142 60% 88%)", color: "hsl(142 72% 28%)" }}>Actif</span>
              : <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "hsl(0 60% 93%)", color: "hsl(0 70% 42%)" }}>Requis pour les routes protégées</span>
            }
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {hasToken ? `${token.slice(0, 36)}…` : "Collez votre token Bearer ci-dessous"}
          </p>
        </div>
        {hasToken && (
          <button
            onClick={() => { onChange(""); localStorage.removeItem(JWT_KEY); }}
            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            title="Effacer le token"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
      <div className="px-5 pb-4">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={token}
            onChange={(e) => {
              onChange(e.target.value);
              localStorage.setItem(JWT_KEY, e.target.value);
            }}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
            className="w-full text-xs font-mono rounded-xl border border-border bg-background px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ "--tw-ring-color": "hsl(142 72% 37% / 0.25)" } as React.CSSProperties}
          />
          <button
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
          >
            {show ? "Masquer" : "Afficher"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CopyButton ───────────────────────────────────────────────────────────────
function CopyButton({ text, size = "sm" }: { text: string; size?: "sm" | "xs" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded-lg border transition-all duration-200 font-medium"
      style={{
        fontSize: size === "xs" ? "10px" : "11px",
        padding: size === "xs" ? "3px 8px" : "4px 10px",
        borderColor: "hsl(var(--code-border))",
        color: copied ? "hsl(142 72% 55%)" : "hsl(215 20% 55%)",
        background: "hsl(var(--code-bg))",
      }}
    >
      {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

// ─── ParamRow ─────────────────────────────────────────────────────────────────
function ParamRow({ param, value, onChange }: { param: Param; value: string; onChange: (v: string) => void }) {
  const inColors: Record<string, { bg: string; color: string }> = {
    query:  { bg: "hsl(210 60% 93%)", color: "hsl(210 80% 38%)" },
    path:   { bg: "hsl(0 60% 93%)",   color: "hsl(0 70% 42%)" },
    body:   { bg: "hsl(262 55% 93%)", color: "hsl(262 72% 45%)" },
  };
  const ic = inColors[param.in] ?? { bg: "hsl(215 20% 92%)", color: "hsl(215 20% 45%)" };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5 border-b border-border last:border-0">
      <div className="sm:w-48 shrink-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <code className="text-xs font-mono font-bold text-foreground">{param.name}</code>
          {param.required && (
            <span className="text-[9px] font-black text-destructive">REQUIS</span>
          )}
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: ic.bg, color: ic.color }}
          >
            {param.in}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">{param.description}</p>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.default ?? `${param.type}…`}
        className="flex-1 text-xs font-mono rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
        style={{ "--tw-ring-color": "hsl(142 72% 37% / 0.25)" } as React.CSSProperties}
      />
    </div>
  );
}

// ─── EndpointCard ─────────────────────────────────────────────────────────────
function EndpointCard({ endpoint, jwtToken }: { endpoint: Endpoint; jwtToken: string }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(endpoint.params.map((p) => [p.name, p.default ?? ""]))
  );
  const [result, setResult] = useState<null | { status: number; body: object; error?: boolean }>(null);
  const [loading, setLoading] = useState(false);

  const ms = METHOD_STYLES[endpoint.method];

  const buildPath = () => {
    let path = endpoint.path;
    endpoint.params
      .filter((p) => p.in === "path")
      .forEach((p) => { path = path.replace(`{${p.name}}`, values[p.name] || p.default || "1"); });
    const qp = endpoint.params
      .filter((p) => p.in === "query" && values[p.name])
      .map((p) => `${p.name}=${encodeURIComponent(values[p.name])}`)
      .join("&");
    return qp ? `${path}?${qp}` : path;
  };

  const curlSnippet = () => {
    const path = buildPath();
    const tokenVal = jwtToken.trim() || "<votre_token_jwt>";
    const base = `curl -X ${endpoint.method} "https://api.npp.dz${path}" \\\n  -H "Authorization: Bearer ${tokenVal}" \\\n  -H "Accept: application/json"`;
    const bodyParams = endpoint.params.filter((p) => p.in === "body");
    if (bodyParams.length) {
      const data = Object.fromEntries(bodyParams.map((p) => [p.name, values[p.name] || p.default || ""]));
      return `${base} \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(data)}'`;
    }
    return base;
  };

  const execute = async () => {
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));

    // Simulate 401 if auth required and token missing
    if (endpoint.requiresAuth && !jwtToken.trim()) {
      setResult({
        status: 401,
        error: true,
        body: {
          error: "Unauthorized",
          message: "Token JWT manquant ou invalide. Veuillez fournir un token Bearer valide.",
          code: 401,
        },
      });
    } else {
      setResult({ status: 200, body: endpoint.exampleResponse });
    }
    setLoading(false);
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card mb-3 transition-all duration-200 hover:shadow-md hover:border-primary/20">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary/30 transition-colors duration-150"
      >
        <span
          className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg font-mono min-w-[46px] text-center tracking-wider"
          style={{ background: ms.bg, color: ms.text }}
        >
          {endpoint.method}
        </span>
        <code className="text-sm font-mono text-foreground font-semibold flex-1 min-w-0 truncate">
          {endpoint.path}
        </code>
        <span className="text-sm text-muted-foreground hidden md:block flex-shrink-0 max-w-xs truncate">
          {endpoint.summary}
        </span>
        {endpoint.requiresAuth && (
          <Lock className="w-3.5 h-3.5 shrink-0 text-muted-foreground/50" aria-label="Authentification requise" />
        )}
        {open
          ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-border">
          {/* Description */}
          <div className="px-5 py-3 bg-secondary/20 border-b border-border">
            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
          </div>

          <div className="p-5 grid lg:grid-cols-2 gap-6">
            {/* Left: params */}
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Paramètres
              </h4>
              {endpoint.params.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
                  <p className="text-xs text-muted-foreground">Aucun paramètre requis.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-background overflow-hidden">
                  {endpoint.params.map((p) => (
                    <div key={p.name} className="px-4">
                      <ParamRow
                        param={p}
                        value={values[p.name] ?? ""}
                        onChange={(v) => setValues((prev) => ({ ...prev, [p.name]: v }))}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Auth warning */}
              {endpoint.requiresAuth && !jwtToken.trim() && (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs" style={{ background: "hsl(0 60% 97%)", border: "1px solid hsl(0 60% 88%)", color: "hsl(0 70% 40%)" }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Token JWT non renseigné. L'exécution retournera une erreur <strong>401 Unauthorized</strong>.</span>
                </div>
              )}

              {/* Execute */}
              <button
                onClick={execute}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 gradient-primary text-white text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-60 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Exécution en cours…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Exécuter la requête
                  </>
                )}
              </button>
            </div>

            {/* Right: curl + response */}
            <div className="space-y-4">
              {/* cURL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">cURL</span>
                  <CopyButton text={curlSnippet()} size="xs" />
                </div>
                <pre
                  className="text-xs font-mono leading-relaxed rounded-xl p-4 overflow-x-auto"
                  style={{ background: "hsl(var(--code-bg))", color: "hsl(215 20% 65%)", border: "1px solid hsl(var(--code-border))" }}
                >
                  <code>{curlSnippet()}</code>
                </pre>
              </div>

              {/* Response */}
              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Réponse</span>
                      <span
                        className="text-xs font-black px-2.5 py-0.5 rounded-full"
                        style={result.error
                          ? { background: "hsl(0 60% 93%)", color: "hsl(0 70% 40%)" }
                          : { background: "hsl(142 55% 90%)", color: "hsl(142 72% 25%)" }
                        }
                      >
                        {result.status} {result.error ? "Unauthorized" : "OK"}
                      </span>
                    </div>
                    <CopyButton text={JSON.stringify(result.body, null, 2)} size="xs" />
                  </div>
                  <pre
                    className="text-xs font-mono leading-relaxed rounded-xl p-4 overflow-x-auto max-h-72"
                    style={{
                      background: "hsl(var(--code-bg))",
                      color: result.error ? "hsl(0 70% 60%)" : "hsl(142 60% 62%)",
                      border: `1px solid ${result.error ? "hsl(0 60% 25%)" : "hsl(var(--code-border))"}`,
                    }}
                  >
                    <code>{JSON.stringify(result.body, null, 2)}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ApiExplorer() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.name, true]))
  );
  const [jwtToken, setJwtToken] = useState<string>(() => localStorage.getItem(JWT_KEY) ?? "");
  const toggle = (name: string) => setOpenGroups((p) => ({ ...p, [name]: !p[name] }));

  const totalEndpoints = groups.reduce((a, g) => a + g.endpoints.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="gradient-hero border-b sticky top-0 z-40" style={{ borderColor: "hsl(var(--code-border))" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium hover:text-white transition-colors"
            style={{ color: "hsl(215 20% 55%)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white font-black text-xs glow-primary shrink-0">
              Rx
            </span>
            <span className="text-white font-bold text-sm tracking-tight">
              API NPP <span className="text-gradient font-extrabold">Explorateur</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(215 20% 60%)" }}>
              <Key className="w-3 h-3" />
              {jwtToken.trim() ? <span style={{ color: "hsl(142 60% 55%)" }}>Token actif</span> : "Aucun token"}
            </div>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-green" />
            <span className="text-xs hidden sm:block" style={{ color: "hsl(142 60% 55%)" }}>Démo interactive</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
            Référence de l'API
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Explorez et testez les endpoints directement depuis cette page. Renseignez votre token JWT pour accéder aux routes protégées.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {[
              { label: "Base URL", value: "https://api.npp.dz" },
              { label: "Version",  value: "v1.0" },
              { label: "Format",   value: "JSON" },
              { label: "Auth",     value: "Bearer JWT" },
              { label: "Endpoints", value: String(totalEndpoints) },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs rounded-xl px-3 py-2 border border-border bg-secondary/60"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="w-px h-3 bg-border" />
                <code className="font-mono font-bold text-foreground">{item.value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* JWT Panel */}
        <JwtPanel token={jwtToken} onChange={setJwtToken} />

        {/* Groups */}
        {groups.map((group) => (
          <div key={group.name} className="mb-10">
            {/* Group header */}
            <button
              onClick={() => toggle(group.name)}
              className="flex items-center gap-3 w-full text-left mb-4 group py-2"
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                style={{ background: group.color }}
              />
              <span className="text-sm font-bold tracking-wide" style={{ color: group.color }}>
                {group.name}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${group.color}12`, color: group.color }}
              >
                {group.endpoints.length} endpoint{group.endpoints.length > 1 ? "s" : ""}
              </span>
              <div className="flex-1 h-px" style={{ background: `${group.color}20` }} />
              {openGroups[group.name]
                ? <ChevronDown className="w-4 h-4 shrink-0 transition-transform" style={{ color: group.color }} />
                : <ChevronRight className="w-4 h-4 shrink-0 transition-transform" style={{ color: group.color }} />
              }
            </button>

            {openGroups[group.name] && (
              <div>
                {group.endpoints.map((ep) => (
                  <EndpointCard key={ep.id} endpoint={ep} jwtToken={jwtToken} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div className="mt-4 rounded-2xl border border-border bg-secondary/40 px-6 py-4 flex flex-col sm:flex-row items-center gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Les réponses affichées sont des <strong className="text-foreground">exemples de démonstration</strong>. Pour accéder à l'API en production, un token JWT institutionnel valide est requis.
          </p>
        </div>
      </div>
    </div>
  );
}
