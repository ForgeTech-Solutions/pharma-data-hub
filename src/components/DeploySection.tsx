import { useEffect, useRef } from "react";
import { Container, Cloud, Database } from "lucide-react";

const deployOptions = [
  {
    icon: Container,
    title: "Docker Compose",
    desc: "Déployez l'ensemble de la stack (API + PostgreSQL) en une seule commande.",
    cmd: "docker compose up -d",
  },
  {
    icon: Cloud,
    title: "Render.com ready",
    desc: "Fichier render.yaml inclus. Déploiement cloud en quelques clics, sans serveur.",
    cmd: "render deploy",
  },
  {
    icon: Database,
    title: "PostgreSQL & SQLite",
    desc: "PostgreSQL en production, SQLite pour les tests locaux. Migrations Alembic incluses.",
    cmd: "alembic upgrade head",
  },
];

export default function DeploySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    cardRefs.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="deploy" ref={sectionRef} className="py-24 bg-background section-fade">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Déploiement
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Prêt pour la production
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Infrastructure dockerisée, migrations automatiques et support multi-base.
            Du développement local à la production en quelques minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {deployOptions.map((opt, i) => (
            <div
              key={opt.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="section-fade group bg-card border border-border rounded-2xl p-6 card-hover"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:gradient-primary transition-all duration-300">
                <opt.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{opt.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{opt.desc}</p>
              <div className="bg-[hsl(var(--code-bg))] rounded-lg px-4 py-2.5 border border-[hsl(var(--code-border))]">
                <code className="text-xs font-mono text-[hsl(142_60%_60%)]">
                  $ {opt.cmd}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
