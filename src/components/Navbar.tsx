import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogOut, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AccessRequestModal from "@/components/AccessRequestModal";
import logo from "@/assets/logo_npp.png";
import { PACK_COLORS } from "@/lib/api";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPack,  setUserPack]   = useState("");

  useEffect(() => {
    const update = () => {
      const token = localStorage.getItem("npp_token");
      setIsLoggedIn(!!token);
      setUserPack(localStorage.getItem("npp_pack") || "");
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
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
    setUserPack("");
    navigate("/login");
  };

  const packMeta = userPack ? PACK_COLORS[userPack] : null;

  const links = [
    { label: t("nav.features"),  href: "#features" },
    { label: t("nav.usecases"),  href: "#usecases" },
    { label: t("nav.access"),    href: "#access" },
    { label: t("nav.news"),      href: "/actualites", isRoute: true },
  ];

  const linkCls = "text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[hsl(215_28%_9%/0.97)] backdrop-blur-md border-b border-[hsl(var(--code-border))] shadow-lg"
            : "bg-[hsl(215_28%_7%/0.85)] backdrop-blur-sm border-b border-[hsl(215_28%_14%/0.6)]"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center group">
            <img src={logo} alt="API Nomenclature NPP" className="h-12 w-auto transition-all duration-200 group-hover:opacity-90" />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) =>
              l.isRoute ? (
                <Link key={l.href} to={l.href} className={linkCls}>{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} className={linkCls}>{l.label}</a>
              )
            )}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Lang switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-[hsl(215_28%_20%)] text-[hsl(215_20%_65%)] hover:border-primary hover:text-primary transition-all duration-200"
            >
              {i18n.language === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>

            {isLoggedIn ? (
              /* ── Connected state ─────────────────────── */
              <div className="flex items-center gap-2 pl-2 border-l border-[hsl(215_28%_20%)]">
                {/* Pack badge */}
                {packMeta && userPack && (
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: packMeta.bg, color: packMeta.color, border: `1px solid ${packMeta.border}` }}
                  >
                    {userPack}
                  </span>
                )}
                {/* Mon Espace */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-[hsl(215_28%_17%)] hover:bg-[hsl(215_28%_22%)] px-3 py-1.5 rounded-lg border border-[hsl(215_28%_25%)] transition-all duration-200"
                >
                  <LayoutDashboard size={14} />
                  Mon Espace
                </Link>
                {/* Déconnexion */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-[hsl(215_20%_60%)] hover:text-[hsl(0_72%_60%)] px-3 py-1.5 rounded-lg border border-transparent hover:border-[hsl(0_72%_37%/0.35)] hover:bg-[hsl(0_72%_37%/0.08)] transition-all duration-200"
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </div>
            ) : (
              /* ── Guest state ─────────────────────────── */
              <div className="flex items-center gap-2 pl-2 border-l border-[hsl(215_28%_20%)]">
                {/* Login */}
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm text-[hsl(215_20%_70%)] hover:text-white px-3 py-1.5 rounded-lg border border-[hsl(215_28%_20%)] hover:border-[hsl(215_28%_35%)] transition-all duration-200"
                >
                  <LogIn size={14} />
                  Connexion
                </Link>
                {/* Signup / Request access */}
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-1.5 text-sm gradient-primary text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-all duration-200 glow-primary hover:scale-105"
                >
                  <UserPlus size={14} />
                  {t("nav.requestAccess")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[hsl(215_28%_9%)] border-t border-[hsl(var(--code-border))] px-6 py-4 flex flex-col gap-3 animate-fade-in">
            {links.map((l) =>
              l.isRoute ? (
                <Link key={l.href} to={l.href} onClick={() => setMenuOpen(false)} className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors py-1">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors py-1">
                  {l.label}
                </a>
              )
            )}

            <div className="border-t border-[hsl(215_28%_18%)] pt-3 flex flex-col gap-2">
              {/* Lang */}
              <button
                onClick={toggleLang}
                className="text-sm border border-[hsl(215_28%_20%)] text-[hsl(215_20%_65%)] px-4 py-2 rounded-lg font-bold uppercase tracking-widest text-center hover:border-primary hover:text-primary transition-all"
              >
                {i18n.language === "fr" ? "🇬🇧 Switch to English" : "🇫🇷 Passer en Français"}
              </button>

              {isLoggedIn ? (
                <>
                  {packMeta && userPack && (
                    <div className="flex justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: packMeta.bg, color: packMeta.color, border: `1px solid ${packMeta.border}` }}>
                        {userPack}
                      </span>
                    </div>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-[hsl(215_28%_17%)] border border-[hsl(215_28%_25%)] px-4 py-2.5 rounded-lg text-center transition-all"
                  >
                    <LayoutDashboard size={14} /> Mon Espace
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="flex items-center justify-center gap-2 text-sm text-[hsl(0_72%_60%)] border border-[hsl(0_72%_37%/0.4)] px-4 py-2.5 rounded-lg text-center hover:bg-[hsl(0_72%_37%/0.12)] transition-all"
                  >
                    <LogOut size={14} /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm text-[hsl(215_20%_70%)] border border-[hsl(215_28%_22%)] px-4 py-2.5 rounded-lg text-center hover:text-white hover:border-[hsl(215_28%_35%)] transition-all"
                  >
                    <LogIn size={14} /> Connexion
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); setModalOpen(true); }}
                    className="flex items-center justify-center gap-2 text-sm gradient-primary text-white px-4 py-2.5 rounded-lg font-medium text-center glow-primary"
                  >
                    <UserPlus size={14} /> {t("nav.requestAccess")}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <AccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
