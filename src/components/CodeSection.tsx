import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check, Terminal, Code2, FileCode2, ArrowRight } from "lucide-react";

// ─── Snippets per language ────────────────────────────────────────────────────
const SNIPPETS = {
  curl: {
    label: "cURL",
    icon: Terminal,
    color: "hsl(142 72% 37%)",
    bg:    "hsl(142 72% 37% / 0.08)",
    border:"hsl(142 72% 37% / 0.3)",
    lines: [
      { text: "# 1. Authentification — obtenir un token JWT", type: "comment" },
      { text: "curl -X POST \\", type: "keyword" },
      { text: '  "https://nnp.forge-solutions.tech/v1/auth/login" \\', type: "string" },
      { text: '  -H "Content-Type: application/json" \\', type: "string" },
      { text: `  -d '{"email":"user@sante.dz","password":"••••••••"}'`, type: "value" },
      { text: "", type: "blank" },
      { text: "# Réponse", type: "comment" },
      { text: '{ "access_token": "eyJhbGci...", "token_type": "bearer" }', type: "json" },
      { text: "", type: "blank" },
      { text: "# 2. Rechercher un médicament par DCI", type: "comment" },
      { text: "curl -X GET \\", type: "keyword" },
      { text: '  "https://nnp.forge-solutions.tech/v1/medicaments/search?q=amoxicilline" \\', type: "string" },
      { text: '  -H "Authorization: Bearer eyJhbGci..."', type: "string" },
      { text: "", type: "blank" },
      { text: '{ "total": 12, "results": [ { "id": 189,', type: "json" },
      { text: '    "nom_commercial": "Amoxil 500mg", "dci": "Amoxicilline" } ] }', type: "json" },
    ],
  },
  python: {
    label: "Python",
    icon: Code2,
    color: "hsl(210 80% 55%)",
    bg:    "hsl(210 80% 55% / 0.08)",
    border:"hsl(210 80% 55% / 0.3)",
    lines: [
      { text: "import requests", type: "keyword" },
      { text: "", type: "blank" },
      { text: "BASE = \"https://nnp.forge-solutions.tech/v1\"", type: "value" },
      { text: "", type: "blank" },
      { text: "# 1. Authentification", type: "comment" },
      { text: "res = requests.post(f\"{BASE}/auth/login\", json={", type: "plain" },
      { text: "    \"email\": \"user@sante.dz\",", type: "string" },
      { text: "    \"password\": \"••••••••\"", type: "string" },
      { text: "})", type: "plain" },
      { text: "token = res.json()[\"access_token\"]", type: "value" },
      { text: "", type: "blank" },
      { text: "# 2. Recherche médicament", type: "comment" },
      { text: "headers = {\"Authorization\": f\"Bearer {token}\"}", type: "plain" },
      { text: "data = requests.get(", type: "keyword" },
      { text: "    f\"{BASE}/medicaments/search\",", type: "string" },
      { text: "    params={\"q\": \"amoxicilline\"},", type: "value" },
      { text: "    headers=headers", type: "plain" },
      { text: ").json()", type: "plain" },
      { text: "print(data[\"total\"], \"résultats\")", type: "json" },
    ],
  },
  js: {
    label: "JavaScript",
    icon: FileCode2,
    color: "hsl(38 90% 55%)",
    bg:    "hsl(38 90% 55% / 0.08)",
    border:"hsl(38 90% 55% / 0.3)",
    lines: [
      { text: "const BASE = \"https://nnp.forge-solutions.tech/v1\";", type: "value" },
      { text: "", type: "blank" },
      { text: "// 1. Authentification", type: "comment" },
      { text: "const { access_token } = await fetch(", type: "keyword" },
      { text: "  `${BASE}/auth/login`,", type: "string" },
      { text: "  { method: \"POST\",", type: "plain" },
      { text: "    headers: { \"Content-Type\": \"application/json\" },", type: "string" },
      { text: "    body: JSON.stringify({", type: "plain" },
      { text: "      email: \"user@sante.dz\",", type: "string" },
      { text: "      password: \"••••••••\"", type: "string" },
      { text: "    })", type: "plain" },
      { text: "  }).then(r => r.json());", type: "plain" },
      { text: "", type: "blank" },
      { text: "// 2. Recherche médicament", type: "comment" },
      { text: "const data = await fetch(", type: "keyword" },
      { text: "  `${BASE}/medicaments/search?q=amoxicilline`,", type: "string" },
      { text: "  { headers: { Authorization: `Bearer ${access_token}` } }", type: "value" },
      { text: ").then(r => r.json());", type: "plain" },
      { text: "console.log(data.total, \"résultats\");", type: "json" },
    ],
  },
};

type Lang = keyof typeof SNIPPETS;

// ─── Syntax token colors ───────────────────────────────────────────────────────
const TOKEN_COLORS: Record<string, string> = {
  comment: "hsl(215 20% 40%)",
  keyword: "hsl(142 72% 55%)",
  string:  "hsl(38 80% 65%)",
  value:   "hsl(196 70% 65%)",
  json:    "hsl(262 72% 75%)",
  plain:   "hsl(215 20% 72%)",
  blank:   "transparent",
};

const FEATURES = [
  "Authentification en 1 appel POST",
  "Réponses JSON normalisées",
  "Codes HTTP standard (200/401/429)",
  "Documentation OpenAPI 3.0 intégrée",
  "SDKs Python · JS · PHP disponibles",
];

export default function CodeSection() {
  const { t } = useTranslation();
  const sectionRef  = useRef<HTMLElement>(null);
  const [lang, setLang]       = useState<Lang>("curl");
  const [copied, setCopied]   = useState(false);
  const [visible, setVisible] = useState(false);

  const snippet = SNIPPETS[lang];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const rawCode = snippet.lines.map((l) => l.text).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="py-28 bg-background overflow-hidden relative">

      {/* Background dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* ── Left: Info panel ─────────────────────────────────────────────── */}
          <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{ color: "hsl(var(--primary))" }}>
              <span className="w-6 h-px" style={{ background: "hsl(var(--primary))" }} />
              Intégration rapide
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">
              Opérationnel en{" "}
              <span className="text-gradient">quelques minutes</span>
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
              Une API RESTful intuitive documentée via Swagger UI. Authentifiez-vous, interrogez
              la base nationale et intégrez les données dans vos systèmes sans friction.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {FEATURES.map((f, i) => (
                <li key={i}
                  className="flex items-center gap-3 text-sm transition-all duration-300"
                  style={{ transitionDelay: `${i * 60}ms`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateX(-8px)" }}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "hsl(var(--accent))" }}>
                    <Check className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <span className="text-foreground">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <a href="/docs"
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border transition-all duration-200 group"
              style={{ background: "hsl(var(--accent))", borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--primary))"; (e.currentTarget as HTMLAnchorElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "hsl(var(--accent))"; (e.currentTarget as HTMLAnchorElement).style.color = "hsl(var(--primary))"; }}
            >
              Voir la documentation complète
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* ── Right: Code window ───────────────────────────────────────────── */}
          <div className={`transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl overflow-hidden border shadow-2xl"
              style={{ background: "hsl(215 28% 7%)", borderColor: "hsl(215 28% 18%)" }}>

              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ background: "hsl(215 28% 10%)", borderColor: "hsl(215 28% 16%)" }}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: "hsl(0 72% 55%)" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "hsl(38 72% 55%)" }} />
                  <span className="w-3 h-3 rounded-full" style={{ background: "hsl(142 72% 45%)" }} />
                  <span className="ml-2 text-[11px] font-mono" style={{ color: "hsl(215 20% 40%)" }}>
                    api-npp · example
                  </span>
                </div>
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg transition-all duration-200"
                  style={{ background: copied ? "hsl(142 72% 37% / 0.15)" : "hsl(215 28% 15%)", color: copied ? "hsl(142 72% 60%)" : "hsl(215 20% 55%)" }}
                  onMouseEnter={(e) => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = "hsl(0 0% 90%)"; }}
                  onMouseLeave={(e) => { if (!copied) (e.currentTarget as HTMLButtonElement).style.color = "hsl(215 20% 55%)"; }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>

              {/* Language tabs */}
              <div className="flex border-b" style={{ background: "hsl(215 28% 9%)", borderColor: "hsl(215 28% 14%)" }}>
                {(Object.keys(SNIPPETS) as Lang[]).map((l) => {
                  const s = SNIPPETS[l];
                  const LIcon = s.icon;
                  const isActive = lang === l;
                  return (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-bold transition-all duration-200 relative"
                      style={{ color: isActive ? s.color : "hsl(215 20% 40%)" }}
                    >
                      <LIcon className="w-3.5 h-3.5" />
                      {s.label}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t"
                          style={{ background: s.color }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Code area */}
              <div className="overflow-x-auto">
                <pre className="p-5 font-mono text-[12px] leading-[1.8] min-h-[340px]">
                  {snippet.lines.map((line, i) => (
                    <div key={`${lang}-${i}`}
                      className="flex gap-4 transition-all duration-300"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "none" : "translateX(6px)",
                        transitionDelay: `${200 + i * 25}ms`,
                      }}
                    >
                      {/* Line number */}
                      <span className="select-none w-6 text-right shrink-0 tabular-nums"
                        style={{ color: "hsl(215 20% 25%)" }}>
                        {line.type !== "blank" ? i + 1 : ""}
                      </span>
                      {/* Code content */}
                      <span style={{ color: TOKEN_COLORS[line.type] || TOKEN_COLORS.plain }}>
                        {line.text || "\u00A0"}
                      </span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-5 py-2 border-t"
                style={{ background: "hsl(215 28% 9%)", borderColor: "hsl(215 28% 14%)" }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-green"
                    style={{ background: snippet.color }} />
                  <span className="text-[10px] font-mono" style={{ color: "hsl(215 20% 40%)" }}>
                    {snippet.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono" style={{ color: "hsl(215 20% 30%)" }}>
                  {snippet.lines.filter(l => l.type !== "blank").length} lignes
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
