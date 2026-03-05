import { useState, useEffect } from "react";
import {
  ChevronDown, ChevronRight, Play, ArrowLeft, Copy, CheckCheck,
  Key, AlertCircle, Lock, Unlock, X, Info,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────
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
  pack?: string;
  packColor?: string;
  exampleResponse: object;
}

// ─── Data — single flat list ──────────────────────────────────────────────────
const endpoints: Endpoint[] = [
  {
    id: "health",
    method: "GET",
    path: "/health",
    summary: "Statut de l'API",
    description: "Vérifie que l'API est opérationnelle. Accessible sans token JWT.",
    requiresAuth: false,
    params: [],
    exampleResponse: {
      status: "ok",
      version: "1.0.0",
      uptime: "2h 14m 37s",
      uptime_seconds: 8077,
      uptime_percent: 99.87,
      deployed_since: "2026-03-05T17:14:11",
      db_latency_ms: 3.21,
      total_medicaments: 12483,
      total_laboratoires: 347,
      derniere_mise_a_jour: "Nomenclature 2026-01",
      derniere_mise_a_jour_date: "2026-03-01T10:22:00",
    },
  },
  {
    id: "packs",
    method: "GET",
    path: "/packs",
    summary: "Catalogue des packs",
    description: "Retourne le catalogue complet des offres d'accès disponibles : FREE, PRO, INSTITUTIONNEL, DÉVELOPPEUR.",
    requiresAuth: false,
    params: [],
    exampleResponse: {
      packs: [
        { id: "FREE",          label: "FREE",          req_day: 100,         req_month: 1000,      features: ["Liste","Recherche","Détail"] },
        { id: "PRO",           label: "PRO",           req_day: "illimité",  req_month: "illimité", features: ["FREE+","DCI","Export CSV"] },
        { id: "INSTITUTIONNEL",label: "INSTITUTIONNEL",req_day: "illimité",  req_month: "illimité", features: ["PRO+","Stats","Dashboard"] },
        { id: "DÉVELOPPEUR",   label: "DÉVELOPPEUR",   req_day: "illimité",  req_month: "illimité", features: ["Accès complet"] },
      ],
    },
  },
  {
    id: "auth-signup",
    method: "POST",
    path: "/auth/signup",
    summary: "Créer un compte",
    description: "Crée un nouveau compte. Le compte sera en attente d'approbation par un administrateur avant de pouvoir se connecter.",
    requiresAuth: false,
    params: [
      { name: "username",     in: "body", required: true, type: "string", description: "Adresse e-mail", default: "votre@email.com" },
      { name: "password",     in: "body", required: true, type: "string", description: "Mot de passe (min. 8 caractères)", default: "motdepasse" },
      { name: "organisation", in: "body", type: "string", description: "Nom de l'organisation / établissement", default: "" },
    ],
    exampleResponse: {
      message: "Compte créé. En attente d'approbation admin.",
      user_id: "usr_abc123",
      status: "pending",
    },
  },
  {
    id: "auth-login",
    method: "POST",
    path: "/auth/login",
    summary: "Se connecter — obtenir un token JWT",
    description: "Génère un token d'accès JWT à partir de vos identifiants. Envoyez username et password en form-data. Le token expire après 30 minutes.",
    requiresAuth: false,
    params: [
      { name: "username", in: "body", required: true, type: "string", description: "Adresse e-mail", default: "votre@email.com" },
      { name: "password", in: "body", required: true, type: "string", description: "Mot de passe", default: "motdepasse" },
    ],
    exampleResponse: {
      access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsInBhY2siOiJQUk8iLCJleHAiOjE3NDEyMDAwMDB9...",
      token_type: "bearer",
      expires_in: 1800,
    },
  },
  {
    id: "auth-me",
    method: "GET",
    path: "/auth/me",
    summary: "Mon profil, pack & quotas",
    description: "Retourne les informations du compte connecté : identifiant, pack souscrit, quotas consommés et restants.",
    requiresAuth: true,
    params: [],
    exampleResponse: {
      user_id: "usr_abc123",
      email: "votre@email.com",
      organisation: "CHU Mustapha",
      pack: "INSTITUTIONNEL",
      quotas: {
        today: { used: 48, limit: "illimité" },
        month: { used: 1204, limit: "illimité" },
      },
      approved: true,
    },
  },
  {
    id: "med-list",
    method: "GET",
    path: "/medicaments/",
    summary: "Liste paginée des médicaments",
    description: "Retourne la liste des médicaments avec pagination. Paramètres : skip (offset) et limit (max 200 par page).",
    requiresAuth: true,
    pack: "FREE+",
    packColor: "hsl(142 72% 37%)",
    params: [
      { name: "skip",  in: "query", type: "integer", description: "Nombre d'éléments à ignorer (offset)", default: "0" },
      { name: "limit", in: "query", type: "integer", description: "Résultats par page (max 200)", default: "20" },
    ],
    exampleResponse: {
      total: 9847,
      skip: 0,
      limit: 20,
      items: [
        { id: 1, nom_marque: "AMOXICILLINE 500MG GÉLULE", dci: "Amoxicilline", laboratoire: "SAIDAL", pays_laboratoire: "Algérie", type: "GE", categorie: "NOMENCLATURE" },
        { id: 2, nom_marque: "DOLIPRANE 1000MG COMPRIMÉ",  dci: "Paracetamol",  laboratoire: "SANOFI", pays_laboratoire: "France",  type: "Princeps", categorie: "NOMENCLATURE" },
      ],
    },
  },
  {
    id: "med-search",
    method: "GET",
    path: "/medicaments/search",
    summary: "Recherche par nom, DCI ou laboratoire",
    description: "Recherche full-text sur le nom commercial, la DCI (molécule active) ou le laboratoire fabricant.",
    requiresAuth: true,
    pack: "FREE+",
    packColor: "hsl(142 72% 37%)",
    params: [
      { name: "q",     in: "query", required: true, type: "string",  description: "Terme de recherche (nom, DCI, laboratoire)", default: "amoxicilline" },
      { name: "skip",  in: "query",                 type: "integer", description: "Offset de pagination", default: "0" },
      { name: "limit", in: "query",                 type: "integer", description: "Nombre de résultats (max 200)", default: "20" },
    ],
    exampleResponse: {
      query: "amoxicilline",
      total: 24,
      items: [
        { id: 1, nom_marque: "AMOXICILLINE 500MG GÉLULE", dci: "Amoxicilline", laboratoire: "SAIDAL" },
        { id: 8, nom_marque: "CLAMOXYL 1G COMPRIMÉ",      dci: "Amoxicilline", laboratoire: "GSK" },
      ],
    },
  },
  {
    id: "med-detail",
    method: "GET",
    path: "/medicaments/{id}",
    summary: "Détail complet d'un médicament",
    description: "Retourne toutes les informations d'un médicament identifié par son ID.",
    requiresAuth: true,
    pack: "FREE+",
    packColor: "hsl(142 72% 37%)",
    params: [
      { name: "id", in: "path", required: true, type: "integer", description: "Identifiant unique du médicament", default: "1" },
    ],
    exampleResponse: {
      id: 1,
      nom_marque: "AMOXICILLINE 500MG GÉLULE",
      dci: "Amoxicilline",
      laboratoire: "SAIDAL",
      pays_laboratoire: "Algérie",
      forme: "Gélule",
      dosage: "500 mg",
      type: "GE",
      categorie: "NOMENCLATURE",
      statut: "Actif",
      date_enregistrement: "2021-03-15",
    },
  },
  {
    id: "med-dci",
    method: "GET",
    path: "/medicaments/dci/{dci}",
    summary: "Médicaments par molécule (DCI)",
    description: "Retourne tous les médicaments partageant la même molécule active (DCI). Disponible à partir du pack PRO.",
    requiresAuth: true,
    pack: "PRO+",
    packColor: "hsl(262 72% 45%)",
    params: [
      { name: "dci", in: "path", required: true, type: "string", description: "Nom de la molécule active (DCI)", default: "paracetamol" },
    ],
    exampleResponse: {
      dci: "Paracetamol",
      total: 18,
      items: [
        { id: 12, nom_marque: "PARACETAMOL 500MG ALGÉRIE", laboratoire: "SAIDAL" },
        { id: 47, nom_marque: "DOLIPRANE 1000MG",           laboratoire: "SANOFI" },
      ],
    },
  },
  {
    id: "med-export",
    method: "GET",
    path: "/medicaments/export/csv",
    summary: "Export complet au format CSV",
    description: "Télécharge la base complète des médicaments en fichier CSV. Disponible à partir du pack PRO.",
    requiresAuth: true,
    pack: "PRO+",
    packColor: "hsl(262 72% 45%)",
    params: [
      { name: "categorie",        in: "query", type: "string", description: "NOMENCLATURE | NON_RENOUVELE | RETRAIT", default: "" },
      { name: "pays_laboratoire", in: "query", type: "string", description: "Ex : France", default: "" },
      { name: "laboratoire",      in: "query", type: "string", description: "Ex : SAIDAL", default: "" },
    ],
    exampleResponse: {
      message: "Fichier CSV généré",
      filename: "medicaments_export_2026-03-05.csv",
      total_rows: 9847,
      download_url: "https://nnp.forge-solutions.tech/v1/medicaments/export/csv?token=...",
    },
  },
  {
    id: "med-stats",
    method: "GET",
    path: "/medicaments/stats",
    summary: "Statistiques globales",
    description: "Répartition par forme, laboratoire, pays, type et catégorie. Réservé aux packs INSTITUTIONNEL et DÉVELOPPEUR.",
    requiresAuth: true,
    pack: "INSTITUTIONNEL+",
    packColor: "hsl(38 90% 38%)",
    params: [],
    exampleResponse: {
      total_medicaments: 9847,
      by_categorie: { NOMENCLATURE: 7234, NON_RENOUVELE: 1521, RETRAIT: 1092 },
      by_type: { GE: 5412, Princeps: 4435 },
      top_pays: [{ pays: "Algérie", count: 3210 }, { pays: "France", count: 1845 }],
      top_laboratoires: [{ nom: "SAIDAL", count: 512 }, { nom: "SANOFI", count: 387 }],
    },
  },
  {
    id: "med-dashboard",
    method: "GET",
    path: "/medicaments/dashboard",
    summary: "Tableau de bord enrichi",
    description: "Top 10 laboratoires et pays, chiffres globaux pour tableaux de bord et visualisations avancées. Réservé INSTITUTIONNEL+.",
    requiresAuth: true,
    pack: "INSTITUTIONNEL+",
    packColor: "hsl(38 90% 38%)",
    params: [],
    exampleResponse: {
      total: 9847,
      top10_laboratoires: [{ nom: "SAIDAL", count: 512 }, { nom: "SANOFI", count: 387 }],
      top10_pays: [{ pays: "Algérie", count: 3210 }, { pays: "France", count: 1845 }],
      by_forme: { Gélule: 3201, Comprimé: 2987, Sirop: 1204 },
    },
  },
];

const METHOD_STYLES: Record<string, { bg: string; text: string }> = {
  GET:  { bg: "hsl(142 55% 90%)", text: "hsl(142 72% 25%)" },
  POST: { bg: "hsl(210 65% 90%)", text: "hsl(210 80% 32%)" },
};

// ─── JWT Panel ────────────────────────────────────────────────────────────────
const JWT_KEY = "npp_jwt_token";

function JwtPanel({ token, onChange }: { token: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const hasToken = token.trim().length > 0;

  return (
    <div
      className="rounded-2xl border overflow-hidden mb-8 transition-all duration-300"
      style={{
        borderColor: hasToken ? "hsl(142 60% 75%)" : "hsl(var(--border))",
        background: hasToken ? "hsl(142 60% 98%)" : "hsl(var(--card))",
        boxShadow: hasToken ? "0 0 0 1px hsl(142 60% 80% / 0.5)" : "none",
      }}
    >
      <div className="flex items-center gap-3 px-5 py-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{ background: hasToken ? "hsl(142 60% 90%)" : "hsl(0 60% 92%)" }}
        >
          {hasToken
            ? <Unlock className="w-4 h-4" style={{ color: "hsl(142 72% 35%)" }} />
            : <Lock   className="w-4 h-4" style={{ color: "hsl(0 70% 45%)" }} />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold" style={{ color: hasToken ? "hsl(142 72% 30%)" : "hsl(var(--foreground))" }}>
              Token JWT
            </span>
            {hasToken
              ? <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "hsl(142 60% 88%)", color: "hsl(142 72% 28%)" }}>● Actif</span>
              : <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: "hsl(0 60% 93%)", color: "hsl(0 70% 42%)" }}>Requis pour les routes protégées</span>
            }
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              · Expire après 30 min · Obtenu via POST /auth/login
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
            {hasToken ? `${token.slice(0, 48)}…` : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"}
          </p>
        </div>
        {hasToken && (
          <button
            onClick={() => { onChange(""); localStorage.removeItem(JWT_KEY); }}
            className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors group"
            title="Effacer le token"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-destructive transition-colors" />
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
            placeholder="Collez votre token JWT ici…"
            className="w-full text-xs font-mono rounded-xl border border-border bg-background px-4 py-3 pr-20 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ "--tw-ring-color": "hsl(142 72% 37% / 0.3)" } as React.CSSProperties}
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
      {copied ? "Copié !" : "Copier"}
    </button>
  );
}

// ─── ParamRow ─────────────────────────────────────────────────────────────────
function ParamRow({ param, value, onChange }: { param: Param; value: string; onChange: (v: string) => void }) {
  const inColors: Record<string, { bg: string; color: string }> = {
    query: { bg: "hsl(210 60% 93%)", color: "hsl(210 80% 38%)" },
    path:  { bg: "hsl(0 60% 93%)",   color: "hsl(0 70% 42%)" },
    body:  { bg: "hsl(262 55% 93%)", color: "hsl(262 72% 45%)" },
  };
  const ic = inColors[param.in] ?? { bg: "hsl(215 20% 92%)", color: "hsl(215 20% 45%)" };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5 border-b border-border last:border-0">
      <div className="sm:w-52 shrink-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <code className="text-xs font-mono font-bold text-foreground">{param.name}</code>
          {param.required && <span className="text-[9px] font-black text-destructive">REQUIS</span>}
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: ic.bg, color: ic.color }}
          >
            {param.in}
          </span>
          <span className="text-[9px] text-muted-foreground">{param.type}</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{param.description}</p>
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
    const bodyParams = endpoint.params.filter((p) => p.in === "body");
    if (bodyParams.length) {
      const data = Object.fromEntries(bodyParams.map((p) => [p.name, values[p.name] || p.default || ""]));
      return `curl -X ${endpoint.method} "https://nnp.forge-solutions.tech/v1${path}" \\\n  -H "Content-Type: application/x-www-form-urlencoded" \\\n  -d "${bodyParams.map((p) => `${p.name}=${data[p.name]}`).join("&")}"`;
    }
    if (!endpoint.requiresAuth) {
      return `curl -X ${endpoint.method} "https://nnp.forge-solutions.tech/v1${path}" \\\n  -H "Accept: application/json"`;
    }
    return `curl -X ${endpoint.method} "https://nnp.forge-solutions.tech/v1${path}" \\\n  -H "Authorization: Bearer ${tokenVal}" \\\n  -H "Accept: application/json"`;
  };

  const execute = async () => {
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    if (endpoint.requiresAuth && !jwtToken.trim()) {
      setResult({
        status: 401,
        error: true,
        body: {
          error: "Unauthorized",
          message: "Token JWT manquant ou invalide. Veuillez fournir un token Bearer valide dans le panneau ci-dessus.",
          hint: "Obtenez un token via POST /auth/login puis collez-le dans le champ Token JWT.",
          code: 401,
        },
      });
    } else {
      setResult({ status: 200, body: endpoint.exampleResponse });
    }
    setLoading(false);
  };

  return (
    <div
      className="border border-border rounded-2xl overflow-hidden bg-card mb-3 transition-all duration-200"
      style={{ boxShadow: open ? "0 4px 20px -4px hsl(var(--primary) / 0.08)" : "none" }}
    >
      {/* Row header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-secondary/30 transition-colors duration-150"
      >
        {/* Auth indicator */}
        <span className="shrink-0">
          {endpoint.requiresAuth
            ? <Lock   className="w-3.5 h-3.5 text-muted-foreground/50" />
            : <Unlock className="w-3.5 h-3.5 text-muted-foreground/40" />
          }
        </span>

        {/* Method */}
        <span
          className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg font-mono min-w-[46px] text-center tracking-wider"
          style={{ background: ms.bg, color: ms.text }}
        >
          {endpoint.method}
        </span>

        {/* Path */}
        <code className="text-sm font-mono text-foreground font-semibold flex-1 min-w-0 truncate">
          {endpoint.path}
        </code>

        {/* Pack badge */}
        {endpoint.pack && (
          <span
            className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 hidden sm:block"
            style={{
              background: `${endpoint.packColor}20`,
              color: endpoint.packColor,
            }}
          >
            {endpoint.pack}
          </span>
        )}

        {/* Summary */}
        <span className="text-xs text-muted-foreground hidden md:block shrink-0 max-w-xs truncate">
          {endpoint.summary}
        </span>

        {open
          ? <ChevronDown  className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>

      {open && (
        <div className="border-t border-border">
          {/* Description bar */}
          <div className="px-5 py-3 bg-secondary/20 border-b border-border flex items-start gap-2.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
          </div>

          <div className="p-5 grid lg:grid-cols-2 gap-6">
            {/* Left: params + execute */}
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

              {/* 401 warning */}
              {endpoint.requiresAuth && !jwtToken.trim() && (
                <div
                  className="mt-3 flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs"
                  style={{ background: "hsl(0 60% 97%)", border: "1px solid hsl(0 60% 88%)", color: "hsl(0 70% 40%)" }}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Token JWT non renseigné. L'exécution retournera une erreur{" "}
                    <strong>401 Unauthorized</strong>.
                  </span>
                </div>
              )}

              {/* Execute button */}
              <button
                onClick={execute}
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center gap-2 gradient-primary text-white text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-60 shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    Exécution…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Exécuter la requête
                  </>
                )}
              </button>
            </div>

            {/* Right: cURL + response */}
            <div className="space-y-4">
              {/* cURL snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">cURL</span>
                  <CopyButton text={curlSnippet()} size="xs" />
                </div>
                <pre
                  className="text-xs font-mono leading-relaxed rounded-xl p-4 overflow-x-auto"
                  style={{
                    background: "hsl(var(--code-bg))",
                    color: "hsl(215 20% 65%)",
                    border: "1px solid hsl(var(--code-border))",
                  }}
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
                        style={
                          result.error
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
  const [jwtToken, setJwtToken] = useState<string>(() => localStorage.getItem(JWT_KEY) ?? "");

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header
        className="gradient-hero border-b sticky top-0 z-40"
        style={{ borderColor: "hsl(var(--code-border))" }}
      >
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
            <div
              className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ background: "hsl(0 0% 100% / 0.06)", color: "hsl(215 20% 60%)" }}
            >
              <Key className="w-3 h-3" />
              {jwtToken.trim()
                ? <span style={{ color: "hsl(142 60% 55%)" }}>● Token actif</span>
                : <span>Aucun token</span>
              }
            </div>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-green" />
            <span className="text-xs hidden sm:block" style={{ color: "hsl(142 60% 55%)" }}>
              Démo interactive
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
            Référence de l'API
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Explorez et testez les {endpoints.length} endpoints directement depuis cette page.
            Renseignez votre token JWT pour accéder aux routes protégées.
          </p>

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            {[
              { label: "Base URL",   value: "https://nnp.forge-solutions.tech/v1" },
              { label: "Version",    value: "v1.0" },
              { label: "Format",     value: "JSON" },
              { label: "Auth",       value: "Bearer JWT · 30 min" },
              { label: "Endpoints",  value: String(endpoints.length) },
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

        {/* JWT panel */}
        <JwtPanel token={jwtToken} onChange={setJwtToken} />

        {/* Flat endpoint list */}
        <div>
          {endpoints.map((ep) => (
            <EndpointCard key={ep.id} endpoint={ep} jwtToken={jwtToken} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-4 rounded-2xl border border-border bg-secondary/40 px-6 py-4 flex flex-col sm:flex-row items-center gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            Les réponses affichées sont des{" "}
            <strong className="text-foreground">exemples de démonstration</strong>.
            Pour accéder à l'API en production, un token JWT institutionnel valide est requis.
            Token obtenu via{" "}
            <code className="font-mono text-foreground">POST /auth/login</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
