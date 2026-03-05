import { useEffect, useRef, useState } from "react";
import { Copy, Check } from "lucide-react";

const curlExample = `# 1. Obtenir un token JWT
curl -X POST https://api-npp.dz/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"username": "user@sante.dz", "password": "••••••••"}'

# Réponse
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
  "token_type": "bearer"
}

# 2. Rechercher un médicament par DCI
curl -X GET "https://api-npp.dz/medicaments?q=amoxicilline&page=1&size=20" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."

# Réponse
{
  "total": 47,
  "page": 1,
  "items": [
    {
      "id": 1042,
      "dci": "Amoxicilline",
      "nom_commercial": "AMOXIL 500mg",
      "laboratoire": "GSK Algérie",
      "code_amm": "DZ-2018-1042",
      "statut": "Enregistré",
      "categorie": "Antibiotique"
    }
  ]
}`;

export default function CodeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="py-24 bg-background section-fade">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Intégration rapide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Opérationnel en quelques minutes
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Une API RESTful intuitive documentée via Swagger UI. Authentifiez-vous,
              interrogez la base nationale et intégrez les données dans vos applications
              métier sans friction.
            </p>
            <ul className="space-y-3">
              {[
                "Authentification en 1 appel POST",
                "Réponses JSON normalisées",
                "Codes d'erreur HTTP standard",
                "Documentation OpenAPI 3.0 intégrée",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Code block */}
          <div className="relative rounded-2xl overflow-hidden border border-[hsl(var(--code-border))] shadow-2xl">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[hsl(220_30%_12%)] border-b border-[hsl(var(--code-border))]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[hsl(0_70%_60%)]" />
                <span className="w-3 h-3 rounded-full bg-[hsl(40_90%_60%)]" />
                <span className="w-3 h-3 rounded-full bg-[hsl(142_60%_50%)]" />
              </div>
              <span className="text-xs text-[hsl(215_20%_50%)] font-mono">curl · bash</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors"
              >
                {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
                {copied ? "Copié" : "Copier"}
              </button>
            </div>
            {/* Code */}
            <pre className="bg-[hsl(var(--code-bg))] p-5 overflow-x-auto text-xs leading-relaxed font-mono">
              <code className="text-[hsl(215_20%_75%)]">
                {curlExample.split("\n").map((line, i) => {
                  if (line.startsWith("#")) {
                    return (
                      <span key={i} className="text-[hsl(215_20%_45%)]">
                        {line}{"\n"}
                      </span>
                    );
                  }
                  if (line.includes("curl")) {
                    return (
                      <span key={i}>
                        <span className="text-[hsl(142_60%_55%)]">curl</span>
                        <span>{line.replace("curl", "")}</span>{"\n"}
                      </span>
                    );
                  }
                  if (line.includes('"access_token"') || line.includes('"dci"') || line.includes('"total"')) {
                    return (
                      <span key={i} className="text-[hsl(196_70%_65%)]">
                        {line}{"\n"}
                      </span>
                    );
                  }
                  return <span key={i}>{line}{"\n"}</span>;
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
