import { useEffect, useRef } from "react";

const stack = [
  { name: "FastAPI", color: "hsl(142 72% 37%)", bg: "hsl(142 60% 92%)" },
  { name: "PostgreSQL", color: "hsl(210 80% 45%)", bg: "hsl(210 60% 94%)" },
  { name: "SQLAlchemy", color: "hsl(215 28% 30%)", bg: "hsl(215 20% 92%)" },
  { name: "API Keys", color: "hsl(0 70% 45%)", bg: "hsl(0 60% 94%)" },
  { name: "Docker", color: "hsl(196 80% 45%)", bg: "hsl(196 60% 94%)" },
  { name: "Alembic", color: "hsl(35 90% 45%)", bg: "hsl(35 70% 94%)" },
  { name: "Python 3.11", color: "hsl(215 60% 45%)", bg: "hsl(215 40% 94%)" },
];

export default function StackSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="py-20 bg-secondary section-fade">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Stack Technique
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Technologies éprouvées, architecture solide
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {stack.map((tech) => (
            <span
              key={tech.name}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default"
              style={{
                color: tech.color,
                backgroundColor: tech.bg,
                borderColor: `${tech.color}30`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tech.color }}
              />
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
