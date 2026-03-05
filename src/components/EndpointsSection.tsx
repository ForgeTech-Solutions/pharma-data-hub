import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  noAuth?: boolean;
  pack?: { label: string; bg: string; color: string };
}

const METHOD_CONFIG: Record<string, { bg: string; text: string }> = {
  GET:  { bg: "hsl(142 50% 90%)", text: "hsl(142 72% 26%)" },
  POST: { bg: "hsl(210 70% 91%)", text: "hsl(210 80% 36%)" },
};

const endpoints: Endpoint[] = [
  { method: "GET",  path: "/health",               noAuth: true },
  { method: "GET",  path: "/packs",                noAuth: true },
  { method: "POST", path: "/auth/signup",           noAuth: true },
  { method: "POST", path: "/auth/login",            noAuth: true },
  { method: "GET",  path: "/auth/me" },
  { method: "GET",  path: "/medicaments/",          pack: { label: "FREE+", bg: "hsl(142 55% 90%)", color: "hsl(142 72% 28%)" } },
  { method: "GET",  path: "/medicaments/search?q=", pack: { label: "FREE+", bg: "hsl(142 55% 90%)", color: "hsl(142 72% 28%)" } },
  { method: "GET",  path: "/medicaments/{id}",      pack: { label: "FREE+", bg: "hsl(142 55% 90%)", color: "hsl(142 72% 28%)" } },
  { method: "GET",  path: "/medicaments/dci/{dci}", pack: { label: "PRO+",  bg: "hsl(210 70% 91%)", color: "hsl(210 80% 38%)" } },
  { method: "GET",  path: "/medicaments/export/csv",pack: { label: "PRO+",  bg: "hsl(210 70% 91%)", color: "hsl(210 80% 38%)" } },
  { method: "GET",  path: "/medicaments/stats",     pack: { label: "INSTITUTIONNEL+", bg: "hsl(38 90% 90%)", color: "hsl(38 90% 32%)" } },
  { method: "GET",  path: "/medicaments/dashboard", pack: { label: "INSTITUTIONNEL+", bg: "hsl(38 90% 90%)", color: "hsl(38 90% 32%)" } },
];

export default function EndpointsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs    = useRef<(HTMLLIElement | null)[]>([]);

  const descs = t("endpoints.items", { returnObjects: true }) as Array<{ desc: string }>;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          rowRefs.current.forEach((r, i) => {
            if (!r) return;
            r.style.opacity = "0";
            r.style.transform = "translateY(10px)";
            setTimeout(() => { if (r) { r.style.opacity = "1"; r.style.transform = "translateY(0)"; } }, i * 45 + 60);
          });
        }
      }),
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="endpoints" ref={sectionRef} className="py-28 bg-secondary section-fade overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-4">
              <span className="w-6 h-px bg-primary inline-block" />
              {t("endpoints.label")}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              {t("endpoints.title1")}
              <br />
              <span className="text-gradient">{t("endpoints.title2")}</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-md">
              {t("endpoints.subtitle1")}{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/health</code>,{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/packs</code>{" "}
              {t("endpoints.subtitle2")}{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/auth/signup</code>{" "}
              {t("endpoints.subtitle3")} <strong>{t("endpoints.subtitle4")}</strong>.
            </p>
          </div>
          <Link to="/docs" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group shrink-0">
            {t("endpoints.interactiveExplorer")}
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-[20px_56px_1fr_auto_auto] gap-3 items-center px-5 py-2.5 bg-muted/60 border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <span />
            <span>{t("endpoints.method")}</span>
            <span>{t("endpoints.route")}</span>
            <span className="text-right pr-2">{t("endpoints.pack")}</span>
            <span className="text-right">{t("endpoints.description")}</span>
          </div>

          <ul>
            {endpoints.map((ep, i) => {
              const mc = METHOD_CONFIG[ep.method];
              return (
                <li
                  key={ep.path + ep.method}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/60 group cursor-default"
                  style={{ transition: "opacity 0.35s ease, transform 0.35s ease, background 0.15s ease" }}
                >
                  <span className="shrink-0 w-5 flex justify-center">
                    {ep.noAuth
                      ? <Unlock className="w-3 h-3 text-muted-foreground/35 group-hover:text-muted-foreground/70 transition-colors" />
                      : <Lock   className="w-3 h-3 text-muted-foreground/35 group-hover:text-muted-foreground/70 transition-colors" />
                    }
                  </span>
                  <span className="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg font-mono min-w-[48px] text-center tracking-wider" style={{ background: mc.bg, color: mc.text }}>
                    {ep.method}
                  </span>
                  <code className="text-sm font-mono text-foreground font-semibold flex-1 min-w-0 truncate">{ep.path}</code>
                  {ep.pack ? (
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 hidden sm:block whitespace-nowrap" style={{ background: ep.pack.bg, color: ep.pack.color }}>
                      {ep.pack.label}
                    </span>
                  ) : (
                    <span className="hidden sm:block w-[80px]" />
                  )}
                  <span className="text-xs text-muted-foreground hidden lg:block whitespace-nowrap max-w-[220px] truncate text-right">
                    {descs[i]?.desc}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3 h-3 shrink-0" />
            {t("endpoints.protectedRoutes")}{" "}
            <code className="font-mono text-foreground">Authorization: Bearer &lt;token&gt;</code>
            {" "}— {t("endpoints.subtitle4")}
          </p>
          <p className="text-xs text-muted-foreground text-right">
            {t("endpoints.baseUrl")}{" "}
            <code className="font-mono text-foreground">https://nnp.forge-solutions.tech/v1</code>
            {" · "}<code className="font-mono text-foreground">JSON</code>
          </p>
        </div>
      </div>
    </section>
  );
}
