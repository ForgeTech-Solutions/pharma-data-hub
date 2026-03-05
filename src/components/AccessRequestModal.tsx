import { useEffect, useRef, useState } from "react";
import { X, CheckCircle2, Send, Loader2, Sparkles, Code2, Shield, Crown } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  nom: z.string().trim().min(2, "Le nom est requis").max(100),
  organisation: z.string().trim().min(2, "L'organisation est requise").max(150),
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().max(30).optional(),
  pack: z.string().min(1, "Veuillez sélectionner un pack"),
  message: z.string().trim().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

const PACKS = [
  {
    id: "FREE",
    label: "FREE",
    sub: "100 req/j · 1 000 req/mois",
    icon: Sparkles,
    color: "hsl(215 28% 50%)",
    bg: "hsl(215 28% 50% / 0.08)",
  },
  {
    id: "PRO",
    label: "PRO",
    sub: "Illimité · + DCI & export CSV",
    icon: Code2,
    color: "hsl(210 80% 50%)",
    bg: "hsl(210 80% 50% / 0.08)",
  },
  {
    id: "INSTITUTIONNEL",
    label: "INSTITUTIONNEL",
    sub: "Illimité · + Stats & dashboard",
    icon: Shield,
    color: "hsl(142 72% 37%)",
    bg: "hsl(142 72% 37% / 0.08)",
  },
  {
    id: "DÉVELOPPEUR",
    label: "DÉVELOPPEUR",
    sub: "Illimité · Accès complet + sandbox",
    icon: Crown,
    color: "hsl(262 72% 55%)",
    bg: "hsl(262 72% 55% / 0.08)",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
  defaultType?: string;
}

export default function AccessRequestModal({ open, onClose, defaultType = "" }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({
    nom: "", organisation: "", email: "", telephone: "", pack: defaultType, message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, pack: defaultType }));
      setErrors({});
      setStatus("idle");
    }
  }, [open, defaultType]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const set = (key: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const setPack = (id: string) => {
    setForm((f) => ({ ...f, pack: id }));
    setErrors((er) => ({ ...er, pack: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormData;
        if (!errs[key]) errs[key] = issue.message;
      });
      setErrors(errs);
      return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  const selectedPack = PACKS.find((p) => p.id === form.pack);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-[scale-in_0.25s_ease-out] max-h-[90vh] flex flex-col">

        {/* Top accent */}
        <div
          className="h-1 w-full shrink-0 transition-colors duration-300"
          style={{ background: selectedPack ? selectedPack.color : "hsl(var(--primary))" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs glow-primary">
                Rx
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">API NPP</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Demande d'accès institutionnel</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Votre demande sera traitée sous 48h ouvrées.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {status === "success" ? (
            /* ── Success state ── */
            <div className="px-6 pb-8 pt-4 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 transition-colors duration-300"
                style={{ background: selectedPack ? selectedPack.bg : "hsl(var(--accent))" }}
              >
                <CheckCircle2
                  className="w-9 h-9"
                  style={{ color: selectedPack ? selectedPack.color : "hsl(var(--primary))" }}
                />
              </div>

              {selectedPack && (
                <div
                  className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
                  style={{ background: selectedPack.bg, color: selectedPack.color }}
                >
                  <selectedPack.icon className="w-3.5 h-3.5" />
                  Pack {selectedPack.label}
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground mb-2">Demande envoyée !</h3>
              <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                Nous avons bien reçu la demande d'accès <strong className="text-foreground">{form.pack}</strong> pour{" "}
                <strong className="text-foreground">{form.organisation}</strong>.
              </p>
              <p className="text-sm text-muted-foreground mb-7">
                Notre équipe vous contactera à{" "}
                <strong className="text-foreground">{form.email}</strong> sous 48h ouvrées.
              </p>

              <button
                onClick={onClose}
                className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity glow-primary"
              >
                Fermer
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

              {/* Pack selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">
                  Pack souhaité <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PACKS.map((p) => {
                    const isSelected = form.pack === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPack(p.id)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200"
                        style={{
                          background: isSelected ? p.bg : "transparent",
                          borderColor: isSelected ? p.color : "hsl(var(--border))",
                          boxShadow: isSelected ? `0 0 0 1px ${p.color}40` : "none",
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: isSelected ? p.bg : "hsl(var(--secondary))" }}
                        >
                          <p.icon
                            className="w-3.5 h-3.5"
                            style={{ color: isSelected ? p.color : "hsl(var(--muted-foreground))" }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div
                            className="text-[11px] font-black uppercase tracking-widest leading-none"
                            style={{ color: isSelected ? p.color : "hsl(var(--foreground))" }}
                          >
                            {p.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight truncate">
                            {p.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.pack && <p className="text-xs text-destructive mt-1.5">{errors.pack}</p>}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nom complet <span className="text-destructive">*</span>
                </label>
                <input
                  value={form.nom}
                  onChange={set("nom")}
                  placeholder="Dr. Karim Benali"
                  className={`w-full text-sm rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.nom ? "border-destructive" : "border-border"}`}
                />
                {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
              </div>

              {/* Organisation */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Organisation <span className="text-destructive">*</span>
                </label>
                <input
                  value={form.organisation}
                  onChange={set("organisation")}
                  placeholder="CHU Mustapha Pacha, Alger"
                  className={`w-full text-sm rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.organisation ? "border-destructive" : "border-border"}`}
                />
                {errors.organisation && <p className="text-xs text-destructive mt-1">{errors.organisation}</p>}
              </div>

              {/* Email + Téléphone row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="karim@chu-mustapha.dz"
                    className={`w-full text-sm rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.email ? "border-destructive" : "border-border"}`}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={set("telephone")}
                    placeholder="+213 555 00 00 00"
                    className="w-full text-sm rounded-xl border border-border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Message <span className="text-muted-foreground font-normal">(optionnel)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Décrivez brièvement votre cas d'usage, votre contexte ou vos besoins spécifiques…"
                  rows={3}
                  className="w-full text-sm rounded-xl border border-border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all duration-300 glow-primary disabled:opacity-60 mt-1"
                style={{
                  background: selectedPack
                    ? `linear-gradient(135deg, ${selectedPack.color}, ${selectedPack.color}cc)`
                    : "var(--gradient-primary, hsl(var(--primary)))",
                  boxShadow: selectedPack ? `0 4px 20px -4px ${selectedPack.color}60` : undefined,
                }}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer la demande
                    {selectedPack && (
                      <span className="text-[10px] font-black uppercase opacity-80 ml-1">
                        · {selectedPack.label}
                      </span>
                    )}
                  </>
                )}
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                Vos informations sont traitées de manière confidentielle et ne seront pas partagées.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
