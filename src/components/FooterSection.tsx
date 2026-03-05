import logo from "@/assets/logo_npp.png";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const { t } = useTranslation();
  const links = t("footer.links", { returnObjects: true }) as string[];

  return (
    <footer className="gradient-hero border-t border-[hsl(var(--code-border))]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <img src={logo} alt="API Nomenclature NPP" className="h-20 w-auto opacity-95" />
          </div>

          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a key={link} href="#" className="text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors duration-200">
                {link}
              </a>
            ))}
          </div>

          <div className="text-xs text-[hsl(215_20%_40%)] text-center md:text-right">
            {t("footer.copyright")}<br />
            <span className="text-[hsl(215_20%_30%)]">{t("footer.ministry")}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[hsl(215_28%_14%)] text-center">
          <p className="text-[10px] text-[hsl(215_20%_35%)] tracking-wide uppercase">
            {t("footer.bottom")}
          </p>
        </div>
      </div>
    </footer>
  );
}
