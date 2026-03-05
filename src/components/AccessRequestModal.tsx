import { useEffect, useRef, useState } from "react";
import { X, Building2, CheckCircle2, Send, Loader2 } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  nom: z.string().trim().min(2, "Le nom est requis").max(100),
  organisation: z.string().trim().min(2, "L'organisation est requise").max(150),
  email: z.string().trim().email("Email invalide").max(255),
  type: z.string().min(1, "Veuillez sélectionner un type d'usage"),
  message: z.string().trim().max(500).optional(),
});

type FormData = z.infer<typeof schema>;
type Errors = Partial<Record<keyof FormData, string>>;

const usageTypes = [
  "Établissement de santé (hôpital, clinique)",
  "Pharmacie / Grossiste répartiteur",
  "Éditeur de logiciel santé",
  "Application mobile santé",
  "Système de prescription médicale",
  "Recherche & développement",
  "Autre",
];

interface Props {
  open: boolean;
  onClose: () => void;
  defaultType?: string;
}

export default function AccessRequestModal({ open, onClose, defaultType = "" }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>({ nom: "", organisation: "", email: "", type: defaultType, message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  // Sync default type
  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, type: defaultType }));
      setErrors({});
      setStatus("idle");
    }
  }, [open, defaultType]);

  // Trap scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
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
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-[scale-in_0.25s_ease-out]">

        {/* Top accent */}
        <div className="h-1 w-full gradient-primary" />

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xs glow-primary">
                Rx
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">API NPP</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Demande d'accès institutionnel</h2>
            <p className="text-sm text-muted-foreground mt-1">
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

        {status === "success" ? (
          /* Success state */
          <div className="px-6 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Demande envoyée !</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Nous avons bien reçu votre demande pour <strong>{form.organisation}</strong>.
              Notre équipe vous contactera à l'adresse <strong>{form.email}</strong> sous 48h ouvrées.
            </p>
            <button
              onClick={onClose}
              className="gradient-primary text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity glow-primary"
            >
              Fermer
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

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

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email professionnel <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="karim.benali@chu-mustapha.dz"
                className={`w-full text-sm rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.email ? "border-destructive" : "border-border"}`}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            {/* Type d'usage */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Type d'usage <span className="text-destructive">*</span>
              </label>
              <select
                value={form.type}
                onChange={set("type")}
                className={`w-full text-sm rounded-xl border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${errors.type ? "border-destructive" : "border-border"}`}
              >
                <option value="">Sélectionner…</option>
                {usageTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.type && <p className="text-xs text-destructive mt-1">{errors.type}</p>}
            </div>

            {/* Message optionnel */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Message <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <textarea
                value={form.message}
                onChange={set("message")}
                placeholder="Décrivez brièvement votre cas d'usage…"
                rows={3}
                className="w-full text-sm rounded-xl border border-border px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 gradient-primary text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity glow-primary disabled:opacity-60 mt-2"
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
                </>
              )}
            </button>

            <p className="text-[11px] text-muted-foreground text-center pt-1">
              Vos informations sont traitées de manière confidentielle et ne seront pas partagées.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
