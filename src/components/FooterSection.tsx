import logo from "@/assets/logo_npp.png";

export default function FooterSection() {
  return (
    <footer className="gradient-hero border-t border-[hsl(var(--code-border))]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="API Nomenclature NPP"
              className="h-20 w-auto opacity-95"
            />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {["Documentation", "Swagger UI", "GitHub", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-xs text-[hsl(215_20%_40%)] text-center md:text-right">
            © 2025–2026 API NPP · Données officielles MSPRH<br />
            <span className="text-[hsl(215_20%_30%)]">Ministère de la Santé · République Algérienne</span>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-8 border-t border-[hsl(215_28%_14%)] text-center">
          <p className="text-[10px] text-[hsl(215_20%_35%)] tracking-wide uppercase">
            API Nomenclature Produits Pharmaceutiques · v1.0 · 2025–2026
          </p>
        </div>
      </div>
    </footer>
  );
}
