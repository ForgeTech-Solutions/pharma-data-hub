import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(142 72% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(142 72% 50% / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 bg-[hsl(142_72%_37%/0.15)] border border-[hsl(142_72%_37%/0.3)] rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full gradient-primary animate-pulse-green" />
            <span className="text-xs font-medium text-[hsl(142_72%_60%)] tracking-wide uppercase">
              API REST · Algérie · v1.0
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-up-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            La Nomenclature{" "}
            <span className="text-gradient">Pharmaceutique</span>{" "}
            Nationale, accessible via API
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up-2 text-lg text-[hsl(215_20%_65%)] leading-relaxed max-w-2xl mb-10">
            Importez, recherchez et exploitez les données officielles des
            médicaments algériens en quelques lignes de code. Une source de
            vérité unique, sécurisée et performante.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-3 flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 glow-primary shadow-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Documentation Swagger
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 transition-all duration-200 backdrop-blur-sm"
            >
              Démarrer gratuitement
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-4 mt-16 flex flex-wrap gap-8">
            {[
              { value: "7 000+", label: "Médicaments indexés" },
              { value: "REST", label: "Architecture standard" },
              { value: "JWT", label: "Authentification sécurisée" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-[hsl(215_20%_55%)] mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
