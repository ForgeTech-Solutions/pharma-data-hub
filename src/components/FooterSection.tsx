import logo from "@/assets/logo_npp.png";
import { useTranslation } from "react-i18next";
import { Github, Linkedin, FileText, Mail, ExternalLink, Heart, Activity, Database, FlaskConical } from "lucide-react";
import { useHealth } from "@/hooks/useHealth";
import { Link } from "react-router-dom";

const LINK_GROUPS = [
  {
    titleKey: "footer.col1.title",
    items: [
      { labelKey: "footer.col1.link1", href: "/docs",      icon: FileText, external: false },
      { labelKey: "footer.col1.link3", href: "/#features", icon: null,     external: false },
      { labelKey: "footer.col1.link4", href: "/#access",   icon: null,     external: false },
    ],
  },
  {
    titleKey: "footer.col2.title",
    items: [
      { labelKey: "footer.col2.link1", href: "/#usecases",  icon: null, external: false },
      { labelKey: "footer.col2.link2", href: "/actualites", icon: null, external: false },
      { labelKey: "footer.col2.link3", href: "/#access",    icon: null, external: false },
      { labelKey: "footer.col2.link4", href: "/contact",    icon: Mail, external: false },
    ],
  },
  {
    titleKey: "footer.col3.title",
    items: [
      { labelKey: "footer.col3.link1", href: "/mentions-legales",          icon: null,   external: false },
      { labelKey: "footer.col3.link2", href: "/politique-confidentialite", icon: null,   external: false },
      { labelKey: "footer.col3.link3", href: "https://github.com/ForgeTech-Solutions",       icon: Github,   external: true  },
      { labelKey: "footer.col3.link5", href: "https://www.linkedin.com/in/nhaddag/",           icon: Linkedin, external: true  },
      { labelKey: "footer.col3.link4", href: "/conditions-utilisation",                        icon: null,     external: false },
    ],
  },
];

export default function FooterSection() {
  const { t } = useTranslation();
  const { data: health, loading: healthLoading } = useHealth();

  const ok       = health?.status === "ok";
  const degraded = health?.status === "degraded";
  const dotColor  = ok ? "hsl(142 72% 50%)" : degraded ? "hsl(38 90% 55%)" : "hsl(0 72% 55%)";
  const textColor = ok ? "hsl(142 72% 60%)" : degraded ? "hsl(38 90% 65%)" : "hsl(0 72% 65%)";
  const bgColor   = ok ? "hsl(142 72% 37% / 0.08)" : degraded ? "hsl(38 90% 38% / 0.08)" : "hsl(0 72% 50% / 0.08)";
  const borderC   = ok ? "hsl(142 72% 37% / 0.25)" : degraded ? "hsl(38 90% 38% / 0.3)" : "hsl(0 72% 50% / 0.3)";
  const statusLabel = healthLoading ? "Vérification…" : ok ? t("footer.apiStatus") : degraded ? "API dégradée" : "API indisponible";

  return (
    <footer style={{ background: "hsl(215 28% 7%)", borderTop: "1px solid hsl(215 28% 13%)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-x-8 gap-y-10">

          {/* Brand column */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="API NPP" className="w-full max-w-[200px] h-auto opacity-90" />

            <p className="text-sm leading-relaxed" style={{ color: "hsl(215 20% 48%)", maxWidth: 280 }}>
              {t("footer.slogan")}
            </p>

            {/* Live status pill */}
            <div className="flex flex-col gap-2">
              <div
                className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-lg"
                style={{ background: healthLoading ? "hsl(215 28% 13%)" : bgColor, border: `1px solid ${healthLoading ? "hsl(215 28% 20%)" : borderC}` }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: healthLoading ? "hsl(215 20% 40%)" : dotColor,
                    animation: (!healthLoading && ok) ? "pulse-green 2s cubic-bezier(0.4,0,0.6,1) infinite" : "none",
                  }}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: healthLoading ? "hsl(215 20% 50%)" : textColor }}>
                  {statusLabel}
                </span>
                {!healthLoading && health && ok && (
                  <span className="text-[10px] font-mono" style={{ color: "hsl(142 72% 40%)" }}>
                    · {health.uptime_percent.toFixed(2)}%
                  </span>
                )}
              </div>

              {/* Data mini-stats */}
              {health && (
                <div className="flex flex-wrap gap-2 mt-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: "hsl(215 28% 11%)", border: "1px solid hsl(215 28% 17%)" }}>
                    <Database className="w-3 h-3" style={{ color: "hsl(142 72% 45%)" }} />
                    <span className="text-[10px] font-mono font-semibold" style={{ color: "hsl(215 20% 60%)" }}>
                      {health.total_medicaments.toLocaleString("fr-DZ")} méd.
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: "hsl(215 28% 11%)", border: "1px solid hsl(215 28% 17%)" }}>
                    <FlaskConical className="w-3 h-3" style={{ color: "hsl(210 80% 55%)" }} />
                    <span className="text-[10px] font-mono font-semibold" style={{ color: "hsl(215 20% 60%)" }}>
                      {health.total_laboratoires} labos
                    </span>
                  </div>
                  {health.derniere_mise_a_jour && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: "hsl(215 28% 11%)", border: "1px solid hsl(215 28% 17%)" }}>
                      <Activity className="w-3 h-3" style={{ color: "hsl(262 72% 60%)" }} />
                      <span className="text-[10px] font-mono font-semibold" style={{ color: "hsl(215 20% 60%)" }}>
                        {health.derniere_mise_a_jour}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Link columns ─────────────────────────────── */}
          {LINK_GROUPS.map((group) => (
            <div key={group.titleKey} className="flex flex-col gap-3">
              <h4
                className="text-[10px] font-black uppercase tracking-[0.18em] pb-2"
                style={{ color: "hsl(215 20% 40%)", borderBottom: "1px solid hsl(215 28% 13%)" }}
              >
                {t(group.titleKey)}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.labelKey}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm transition-colors duration-200 group"
                        style={{ color: "hsl(215 20% 43%)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 88%)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 43%)")}
                      >
                        {item.icon && <item.icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-90 transition-opacity shrink-0" />}
                        {t(item.labelKey)}
                        <ExternalLink className="w-2.5 h-2.5 opacity-30 group-hover:opacity-60 transition-opacity ml-0.5" />
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center gap-1.5 text-sm transition-colors duration-200 group"
                        style={{ color: "hsl(215 20% 43%)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 88%)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 43%)")}
                      >
                        {item.icon && <item.icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-90 transition-opacity shrink-0" />}
                        {t(item.labelKey)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ───────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid hsl(215 28% 12%)" }} />

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-[11px] order-2 sm:order-1" style={{ color: "hsl(215 20% 32%)" }}>
            {t("footer.copyright")}
          </p>

          {/* ForgeTech credit — centre */}
          <a
            href="https://nhaddag.net"
            target="_blank"
            rel="noopener noreferrer"
            className="order-1 sm:order-2 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all duration-200 group"
            style={{ background: "hsl(215 28% 10%)", borderColor: "hsl(215 28% 17%)", color: "hsl(215 20% 45%)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(142 72% 37% / 0.45)"; (e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 88%)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "hsl(215 28% 17%)"; (e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 45%)"; }}
          >
            <Heart
              className="w-3 h-3 shrink-0 transition-colors duration-200"
              style={{ color: "hsl(142 72% 40%)", fill: "hsl(142 72% 40%)" }}
            />
            <span className="text-[11px]">{t("footer.madeWith")}</span>
            <span className="text-[11px] font-bold" style={{ color: "hsl(142 72% 55%)" }}>
              ForgeTech Solutions
            </span>
            <ExternalLink className="w-2.5 h-2.5 opacity-35 group-hover:opacity-70 transition-opacity" />
          </a>

          {/* Version tags — right */}
          <div className="order-3 flex items-center gap-1.5">
            {["v1.0", "REST", "API Key"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ background: "hsl(215 28% 12%)", color: "hsl(215 20% 38%)", border: "1px solid hsl(215 28% 16%)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

