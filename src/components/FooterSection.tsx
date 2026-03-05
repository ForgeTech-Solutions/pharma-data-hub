import logo from "@/assets/logo_npp.png";
import { useTranslation } from "react-i18next";
import { Github, FileText, Mail, ExternalLink, Heart } from "lucide-react";

const LINK_GROUPS = [
  {
    titleKey: "footer.col1.title",
    items: [
      { labelKey: "footer.col1.link1", href: "/docs",      icon: FileText   },
      { labelKey: "footer.col1.link2", href: "/docs",      icon: ExternalLink },
      { labelKey: "footer.col1.link3", href: "/#features", icon: null        },
      { labelKey: "footer.col1.link4", href: "/#access",   icon: null        },
    ],
  },
  {
    titleKey: "footer.col2.title",
    items: [
      { labelKey: "footer.col2.link1", href: "/#usecases", icon: null },
      { labelKey: "footer.col2.link2", href: "/actualites", icon: null },
      { labelKey: "footer.col2.link3", href: "/#access",   icon: null },
      { labelKey: "footer.col2.link4", href: "mailto:api@msprh.dz", icon: Mail },
    ],
  },
  {
    titleKey: "footer.col3.title",
    items: [
      { labelKey: "footer.col3.link1", href: "#", icon: null },
      { labelKey: "footer.col3.link2", href: "#", icon: null },
      { labelKey: "footer.col3.link3", href: "#", icon: Github },
      { labelKey: "footer.col3.link4", href: "#", icon: null },
    ],
  },
];

export default function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer style={{ background: "hsl(215 28% 7%)", borderTop: "1px solid hsl(215 28% 14%)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Main grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column — spans 2 on lg */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img src={logo} alt="API NPP" className="h-14 w-auto opacity-90" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "hsl(215 20% 50%)" }}>
              {t("footer.slogan")}
            </p>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit"
              style={{ background: "hsl(142 72% 37% / 0.08)", border: "1px solid hsl(142 72% 37% / 0.25)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-green"
                style={{ background: "hsl(142 72% 50%)" }} />
              <span className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "hsl(142 72% 60%)" }}>
                {t("footer.apiStatus")}
              </span>
            </div>
          </div>

          {/* Link columns */}
          {LINK_GROUPS.map((group) => (
            <div key={group.titleKey} className="flex flex-col gap-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.16em]"
                style={{ color: "hsl(215 20% 55%)" }}>
                {t(group.titleKey)}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.labelKey}>
                    <a
                      href={item.href}
                      className="flex items-center gap-1.5 text-sm transition-colors duration-200 group"
                      style={{ color: "hsl(215 20% 45%)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 90%)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 45%)")}
                    >
                      {item.icon && <item.icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />}
                      {t(item.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid hsl(215 28% 13%)" }} />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px]" style={{ color: "hsl(215 20% 35%)" }}>
            {t("footer.copyright")}
          </p>
          <p className="text-[11px] flex items-center gap-1.5" style={{ color: "hsl(215 20% 30%)" }}>
            {t("footer.madeWith")}
            <Heart className="w-3 h-3 inline" style={{ color: "hsl(142 72% 37%)", fill: "hsl(142 72% 37%)" }} />
            {t("footer.ministry")}
          </p>
          <div className="flex items-center gap-4">
            {["v1.0", "REST", "JWT"].map((tag) => (
              <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded"
                style={{ background: "hsl(215 28% 13%)", color: "hsl(215 20% 40%)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
