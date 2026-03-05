import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccessRequestModal from "@/components/AccessRequestModal";
import logo from "@/assets/logo_npp.png";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    setIsLoggedIn(!!localStorage.getItem("npp_token"));
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
  };

  const handleLogout = () => {
    localStorage.removeItem("npp_token");
    localStorage.removeItem("npp_pack");
    localStorage.removeItem("npp_approved");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const links = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.usecases"), href: "#usecases" },
    { label: t("nav.access"), href: "#access" },
    { label: t("nav.endpoints"), href: "#endpoints" },
    { label: t("nav.news"), href: "/actualites", isRoute: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[hsl(215_28%_9%/0.95)] backdrop-blur-md border-b border-[hsl(var(--code-border))] shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center group">
            <img
              src={logo}
              alt="API Nomenclature NPP"
              className="h-12 w-auto transition-all duration-200 group-hover:opacity-90"
            />
          </a>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {l.label}
                </a>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[hsl(215_28%_20%)] text-[hsl(215_20%_65%)] hover:border-primary hover:text-primary transition-all duration-200"
            >
              {i18n.language === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>
            <Link
              to="/docs"
              className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors px-3 py-1.5"
            >
              {t("nav.explorer")}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors px-3 py-1.5"
                >
                  <LayoutDashboard size={14} />
                  Mon Espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-[hsl(215_20%_65%)] hover:text-[hsl(0_72%_60%)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[hsl(0_72%_37%/0.1)] border border-transparent hover:border-[hsl(0_72%_37%/0.3)]"
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="text-sm gradient-primary text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 glow-primary hover:scale-105"
              >
                {t("nav.requestAccess")}
              </button>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[hsl(215_28%_9%)] border-t border-[hsl(var(--code-border))] px-6 py-4 flex flex-col gap-4 animate-fade-in">
            {links.map((l) =>
              l.isRoute ? (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              )
            )}
            <button
              onClick={toggleLang}
              className="text-sm border border-[hsl(215_28%_20%)] text-[hsl(215_20%_65%)] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-center hover:border-primary hover:text-primary transition-all"
            >
              {i18n.language === "fr" ? "🇬🇧 Switch to English" : "🇫🇷 Passer en Français"}
            </button>
            <button
              onClick={() => { setMenuOpen(false); setModalOpen(true); }}
              className="text-sm gradient-primary text-white px-4 py-2 rounded-lg font-medium text-center glow-primary"
            >
              {t("nav.requestAccess")}
            </button>
          </div>
        )}
      </nav>

      <AccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
