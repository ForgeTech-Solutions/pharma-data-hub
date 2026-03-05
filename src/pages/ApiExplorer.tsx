import { useState } from "react";
import { ChevronDown, ChevronRight, Play, ArrowLeft, Copy, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ──────────────────────────────────────────────────────────────────
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
  exampleResponse: object;
}

interface Group {
  name: string;
  color: string;
  bg: string;
  border: string;
  endpoints: Endpoint[];
}

// ─── Data ────────────────────────────────────────────────────────────────────
const groups: Group[] = [
  {
    name: "Authentification",
    color: "hsl(0 70% 45%)",
    bg: "hsl(0 60% 97%)",
    border: "hsl(0 60% 88%)",
    endpoints: [
      {
        id: "auth-token",
        method: "POST",
        path: "/auth/token",
        summary: "Obtenir un token JWT",
        description: "Génère un token d'accès et un token de rafraîchissement valides 30 minutes.",
        params: [
          { name: "username", in: "body", required: true, type: "string", description: "Nom d'utilisateur" },
          { name: "password", in: "body", required: true, type: "string", description: "Mot de passe" },
        ],
        exampleResponse: {
          access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
    bg: "hsl(142 60% 97%)",
    border: "hsl(142 60% 85%)",
    endpoints: [
      {
        id: "med-list",
        method: "GET",
        path: "/medicaments",
        summary: "Liste paginée des médicaments",
        description: "Retourne la liste complète des médicaments avec pagination, filtres et tri.",
        params: [
          { name: "page", in: "query", type: "integer", description: "Numéro de page", default: "1" },
          { name: "size", in: "query", type: "integer", description: "Éléments par page (max 100)", default: "20" },
          { name: "sort_by", in: "query", type: "string", description: "Champ de tri", default: "nom_marque" },
          { name: "order", in: "query", type: "string", description: "asc ou desc", default: "asc" },
        ],
        exampleResponse: {
          total: 7234,
          page: 1,
          size: 20,
          items: [
            { id: 1, nom_marque: "AMOXICILLINE 500MG", dci: "Amoxicilline", laboratoire: "SAIDAL", statut: "Actif" },
          ],
        },
      },
      {
        id: "med-search",
        method: "GET",
        path: "/medicaments/search",
        summary: "Recherche full-text",
        description: "Recherche par DCI, nom de marque, code AMM, laboratoire ou catégorie thérapeutique.",
        params: [
          { name: "q", in: "query", required: true, type: "string", description: "Terme de recherche", default: "amoxicilline" },
          { name: "page", in: "query", type: "integer", description: "Page", default: "1" },
          { name: "size", in: "query", type: "integer", description: "Taille", default: "10" },
        ],
        exampleResponse: {
          total: 12,
          query: "amoxicilline",
          items: [
            { id: 1, nom_marque: "AMOXICILLINE 500MG", dci: "Amoxicilline", code_amm: "AM-2021-001", categorie: "Antibiotique" },
          ],
        },
      },
      {
        id: "med-detail",
        method: "GET",
        path: "/medicaments/{id}",
        summary: "Détail d'un médicament",
        description: "Retourne les informations complètes d'un médicament par son identifiant.",
        params: [
          { name: "id", in: "path", required: true, type: "integer", description: "Identifiant du médicament", default: "1" },
        ],
        exampleResponse: {
          id: 1,
          nom_marque: "AMOXICILLINE 500MG CAPS",
          dci: "Amoxicilline",
          laboratoire: "SAIDAL",
          code_amm: "AM-2021-001",
          forme: "Gélule",
          dosage: "500 mg",
          categorie: "Antibiotique",
          pays_origine: "Algérie",
          statut: "Actif",
          date_enregistrement: "2021-03-15",
        },
      },
      {
        id: "med-stats",
        method: "GET",
        path: "/medicaments/stats",
        summary: "Statistiques & Dashboard",
        description: "Retourne les statistiques agrégées : top laboratoires, répartition par catégorie, pays d'origine.",
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

// ─── Method badge ─────────────────────────────────────────────────────────────
const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET: { bg: "hsl(142 60% 92%)", text: "hsl(142 72% 28%)" },
  POST: { bg: "hsl(196 60% 90%)", text: "hsl(196 80% 32%)" },
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200"
      style={{
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

function ParamRow({ param, value, onChange }: { param: Param; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-border last:border-0">
      <div className="sm:w-44 shrink-0">
        <div className="flex items-center gap-1.5">
          <code className="text-xs font-mono font-semibold text-foreground">{param.name}</code>
          {param.required && <span className="text-[10px] text-destructive font-bold">*</span>}
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium"
            style={{ background: "hsl(215 20% 93%)", color: "hsl(215 20% 45%)" }}
          >
            {param.in}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5">{param.description}</p>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.default ?? `${param.type}…`}
        className="flex-1 text-xs font-mono rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(endpoint.params.map((p) => [p.name, p.default ?? ""]))
  );
  const [result, setResult] = useState<null | { status: number; body: object }>(null);
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
    const base = `curl -X ${endpoint.method} "https://api.npp.dz${path}" \\\n  -H "Authorization: Bearer <token>" \\\n  -H "Accept: application/json"`;
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
    await new Promise((r) => setTimeout(r, 800));
    setResult({ status: 200, body: endpoint.exampleResponse });
    setLoading(false);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card mb-3 transition-shadow duration-200 hover:shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary/40 transition-colors duration-150"
      >
        <span
          className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded font-mono min-w-[42px] text-center"
          style={{ background: ms.bg, color: ms.text }}
        >
          {endpoint.method}
        </span>
        <code className="text-sm font-mono text-foreground font-medium flex-1">{endpoint.path}</code>
        <span className="text-sm text-muted-foreground hidden sm:block">{endpoint.summary}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-border">
          {/* Description */}
          <div className="px-5 py-4 bg-secondary/30">
            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
          </div>

          <div className="p-5 grid lg:grid-cols-2 gap-6">
            {/* Left: params */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Paramètres
              </h4>
              {endpoint.params.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Aucun paramètre requis.</p>
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

              {/* Execute */}
              <button
                onClick={execute}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 gradient-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Exécution…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Exécuter
                  </>
                )}
              </button>
            </div>

            {/* Right: curl + response */}
            <div className="space-y-4">
              {/* cURL */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">cURL</span>
                  <CopyButton text={curlSnippet()} />
                </div>
                <pre
                  className="text-xs font-mono leading-relaxed rounded-xl p-4 overflow-x-auto"
                  style={{ background: "hsl(var(--code-bg))", color: "hsl(215 20% 70%)", border: "1px solid hsl(var(--code-border))" }}
                >
                  <code>{curlSnippet()}</code>
                </pre>
              </div>

              {/* Response */}
              {result && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Réponse</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "hsl(142 60% 92%)", color: "hsl(142 72% 28%)" }}>
                        {result.status} OK
                      </span>
                    </div>
                    <CopyButton text={JSON.stringify(result.body, null, 2)} />
                  </div>
                  <pre
                    className="text-xs font-mono leading-relaxed rounded-xl p-4 overflow-x-auto max-h-64"
                    style={{ background: "hsl(var(--code-bg))", color: "hsl(142 60% 65%)", border: "1px solid hsl(var(--code-border))" }}
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ApiExplorer() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.name, true]))
  );
  const toggle = (name: string) => setOpenGroups((p) => ({ ...p, [name]: !p[name] }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="gradient-hero border-b border-[hsl(var(--code-border))]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-[hsl(215_20%_60%)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="w-px h-5 bg-[hsl(215_28%_25%)]" />
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs glow-primary">
              Rx
            </span>
            <span className="text-white font-semibold text-sm">
              API NPP — <span className="text-gradient">Explorateur</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-green" />
            <span className="text-xs text-[hsl(142_60%_55%)]">Démo interactive</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Référence de l'API
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Explorez et testez les endpoints directement depuis cette page. Les réponses affichées sont des exemples représentatifs de la structure de l'API.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { label: "Base URL", value: "https://api.npp.dz" },
              { label: "Version", value: "v1.0" },
              { label: "Format", value: "JSON" },
              { label: "Auth", value: "Bearer JWT" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs rounded-lg px-3 py-2 border border-border bg-secondary/50"
              >
                <span className="text-muted-foreground">{item.label} :</span>
                <code className="font-mono font-semibold text-foreground">{item.value}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Groups */}
        {groups.map((group) => (
          <div key={group.name} className="mb-8">
            {/* Group header */}
            <button
              onClick={() => toggle(group.name)}
              className="flex items-center gap-3 w-full text-left mb-3 group"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: group.color }} />
              <span className="text-sm font-bold tracking-wide" style={{ color: group.color }}>
                {group.name}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${group.color}18`, color: group.color }}
              >
                {group.endpoints.length} endpoints
              </span>
              <div className="flex-1 h-px" style={{ background: group.border }} />
              {openGroups[group.name] ? (
                <ChevronDown className="w-4 h-4 shrink-0" style={{ color: group.color }} />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" style={{ color: group.color }} />
              )}
            </button>

            {openGroups[group.name] && (
              <div>
                {group.endpoints.map((ep) => (
                  <EndpointCard key={ep.id} endpoint={ep} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Les réponses présentées sont des exemples de démonstration. Pour accéder à l'API en production, un token JWT valide est requis.
          </p>
        </div>
      </div>
    </div>
  );
}
