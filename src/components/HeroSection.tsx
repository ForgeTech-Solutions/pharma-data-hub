import { useState } from "react";
import { useTranslation } from "react-i18next";
import heroBg from "@/assets/hero-bg.jpg";
import AccessRequestModal from "@/components/AccessRequestModal";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(hsl(142 72% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(142 72% 50% / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl animate-pulse" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-5 blur-3xl animate-pulse" style={{ background: "hsl(142 60% 60%)", animationDelay: "1s" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24">
          <div className="max-w-3xl">
            <div className="animate-fade-up inline-flex items-center gap-2 bg-[hsl(142_72%_37%/0.15)] border border-[hsl(142_72%_37%/0.3)] rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full gradient-primary animate-pulse-green" />
              <span className="text-xs font-medium text-[hsl(142_72%_60%)] tracking-wide uppercase">
                {t("hero.badge")}
              </span>
            </div>

            <h1 className="animate-fade-up-1 text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t("hero.title1")}{" "}
              <span className="text-gradient">{t("hero.title2")}</span>{" "}
              {t("hero.title3")}
            </h1>

            <p className="animate-fade-up-2 text-lg text-[hsl(215_20%_65%)] leading-relaxed max-w-2xl mb-10">
              {t("hero.subtitle")}
            </p>

            <div className="animate-fade-up-3 flex flex-wrap gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 glow-primary shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {t("hero.cta_access")}
              </button>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                {t("hero.cta_explorer")}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="animate-fade-up-4 mt-16 flex flex-wrap gap-8">
              {[
                { value: t("hero.stat1_value"), label: t("hero.stat1_label") },
                { value: t("hero.stat2_value"), label: t("hero.stat2_label") },
                { value: t("hero.stat3_value"), label: t("hero.stat3_label") },
              ].map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <div className="text-2xl font-bold text-gradient group-hover:scale-110 transition-transform duration-200">{stat.value}</div>
                  <div className="text-sm text-[hsl(215_20%_55%)] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <AccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
