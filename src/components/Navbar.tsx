import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Cas d'usage", href: "#usecases" },
    { label: "Endpoints", href: "#endpoints" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[hsl(215_28%_9%/0.95)] backdrop-blur-md border-b border-[hsl(var(--code-border))]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm glow-primary animate-pulse-green">
            Rx
          </span>
          <span className="text-white font-semibold text-sm tracking-tight">
            API <span className="text-gradient">NPP</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/docs"
            className="text-sm text-[hsl(215_20%_70%)] hover:text-white transition-colors px-3 py-1.5"
          >
            Explorateur API
          </Link>
          <Link
            to="/docs"
            className="text-sm gradient-primary text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity glow-primary"
          >
            Démarrer
          </Link>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[hsl(215_28%_9%)] border-t border-[hsl(var(--code-border))] px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[hsl(215_20%_70%)] hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a href="#" className="text-sm gradient-primary text-white px-4 py-2 rounded-lg font-medium text-center">
            Démarrer gratuitement
          </a>
        </div>
      )}
    </nav>
  );
}
