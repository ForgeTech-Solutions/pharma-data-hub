import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api";
import logo from "@/assets/logo_npp.png";
import {
  UserPlus, AlertCircle, CheckCircle2,
  Sparkles, Code2, Shield, Crown, ArrowRight, Zap, Database,
} from "lucide-react";

const PACKS = [
  { id: "FREE",           label: "FREE",           sub: "100 req/j · gratuit",         icon: Sparkles, color: "hsl(215 28% 55%)", colorRaw: "215 28% 55%" },
  { id: "PRO",            label: "PRO",            sub: "Illimité · export CSV",        icon: Code2,    color: "hsl(210 80% 50%)", colorRaw: "210 80% 50%" },
  { id: "INSTITUTIONNEL", label: "INSTITUTIONNEL", sub: "Illimité · stats & dashboard", icon: Shield,   color: "hsl(142 72% 37%)", colorRaw: "142 72% 37%" },
  { id: "DEVELOPPEUR",    label: "DÉVELOPPEUR",    sub: "Illimité · accès complet",     icon: Crown,    color: "hsl(262 72% 55%)", colorRaw: "262 72% 55%" },
];

const TRUST = [
  { icon: Shield,   label: "Accès institutionnel",  sub: "Validé par MSPRH"      },
  { icon: Database, label: "7 000+ médicaments",    sub: "Base nationale officielle" },
  { icon: Zap,      label: "Réponse sous 48h",      sub: "Après examen du dossier"  },
];

// ── Inline validation ──────────────────────────────────────────────────────────
function inputCls(hasError: boolean, isValid: boolean) {
  const base = "w-full rounded-xl border bg-[hsl(215_28%_10%)] px-4 py-3 text-sm text-white placeholder:text-[hsl(215_20%_30%)] focus:outline-none focus:ring-1 transition-all duration-200";
  if (hasError) return `${base} border-[hsl(0_72%_55%)] focus:border-[hsl(0_72%_55%)] focus:ring-[hsl(0_72%_55%/0.25)]`;
  if (isValid)  return `${base} border-[hsl(142_72%_37%)] focus:border-[hsl(142_72%_37%)] focus:ring-[hsl(142_72%_37%/0.25)]`;
  return `${base} border-[hsl(215_28%_20%)] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary)/0.25)]`;
}

function Field({ label, required: req, error, valid, hint, children }: {
  label: string; required?: boolean; error: string; valid: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 20% 65%)" }}>
          {label}{req && <span className="ml-1" style={{ color: "hsl(0 72% 60%)" }}>*</span>}
          {hint && <span className="ml-1 normal-case font-normal" style={{ color: "hsl(215 20% 45%)" }}>{hint}</span>}
        </label>
        {error && <span className="text-[10px] font-medium" style={{ color: "hsl(0 72% 65%)" }}>{error}</span>}
        {valid && !error && <CheckCircle2 size={12} style={{ color: "hsl(142 72% 45%)" }} />}
      </div>
      {children}
    </div>
  );
}

export default function Signup() {
  const [searchParams] = useSearchParams();
  const initialPack = searchParams.get("pack") || "FREE";
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    email: "", full_name: "", organisation: "",
    phone: "", message: "", pack: initialPack,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => formRef.current?.classList.add("visible"), 50);
    return () => clearTimeout(t);
  }, []);

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));
  const blur = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const validate = {
    email:        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    full_name:    form.full_name.trim().length >= 2,
    organisation: form.organisation.trim().length >= 2,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, full_name: true, organisation: true });
    if (!validate.email || !validate.full_name || !validate.organisation) return;
    setError("");
    setLoading(true);
    try {
      await authApi.signup({
        email: form.email, full_name: form.full_name,
        organisation: form.organisation,
        phone: form.phone || undefined,
        message: form.message || undefined,
        pack: form.pack,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "hsl(215 28% 7%)" }}>

      {/* ── Left decorative panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(215 28% 9%) 0%, hsl(142 40% 10%) 100%)" }}>

        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px,transparent 1px),linear-gradient(90deg,hsl(0 0% 100%) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[130px] pointer-events-none"
          style={{ background: "hsl(142 72% 37%)" }} />

        <div className="relative z-10">
          <a href="/"><img src={logo} alt="API NPP" className="h-12 w-auto opacity-90" /></a>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center gap-8 py-12">
          <div>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
              Rejoignez les acteurs<br />
              <span className="text-gradient">de santé numérique</span><br />
              en Algérie
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "hsl(215 20% 55%)" }}>
              Intégrez la nomenclature nationale des médicaments dans vos systèmes en quelques heures.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "hsl(142 72% 37% / 0.12)", border: "1px solid hsl(142 72% 37% / 0.25)" }}>
                  <Icon className="w-4 h-4" style={{ color: "hsl(142 72% 50%)" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white leading-none mb-0.5">{label}</div>
                  <div className="text-[11px]" style={{ color: "hsl(215 20% 50%)" }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[10px]" style={{ color: "hsl(215 20% 35%)" }}>
          © 2025–2026 API NPP · MSPRH · République Algérienne
        </p>
      </div>

      {/* ── Right: signup form ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 overflow-y-auto">
        <div ref={formRef} className="section-fade w-full max-w-lg">

          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <a href="/"><img src={logo} alt="NPP" className="h-12 w-auto mb-4 opacity-90" /></a>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white mb-1">Demande d'accès</h1>
            <p className="text-sm" style={{ color: "hsl(215 20% 55%)" }}>
              Votre demande sera examinée par un administrateur sous 48h.
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="rounded-2xl border p-8 flex flex-col items-center gap-5 text-center"
              style={{ background: "hsl(215 28% 10%)", borderColor: "hsl(142 72% 37% / 0.3)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "hsl(142 72% 37% / 0.12)", border: "2px solid hsl(142 72% 37% / 0.4)" }}>
                <CheckCircle2 size={30} style={{ color: "hsl(142 72% 45%)" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white mb-2">Demande enregistrée !</h2>
                <p className="text-sm max-w-sm leading-relaxed" style={{ color: "hsl(215 20% 60%)" }}>
                  Nous avons bien reçu votre demande. Un administrateur vous contactera à{" "}
                  <strong className="text-white">{form.email}</strong> sous 48h ouvrées.
                </p>
              </div>
              <Link to="/login"
                className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
                style={{ background: "hsl(142 72% 37% / 0.12)", color: "hsl(142 72% 55%)", border: "1px solid hsl(142 72% 37% / 0.3)" }}>
                <ArrowRight size={14} />
                Accéder à la connexion
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "hsl(0 72% 55% / 0.35)", background: "hsl(0 72% 37% / 0.06)", color: "hsl(0 72% 65%)" }}>
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Email" required error={touched.email && !validate.email ? "Email invalide" : ""} valid={touched.email && validate.email}>
                    <input type="email" value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      onBlur={() => blur("email")}
                      placeholder="karim@chu-mustapha.dz"
                      className={inputCls(touched.email && !validate.email, touched.email && validate.email)} />
                  </Field>
                  <Field label="Nom complet" required error={touched.full_name && !validate.full_name ? "Obligatoire" : ""} valid={touched.full_name && validate.full_name}>
                    <input type="text" value={form.full_name}
                      onChange={(e) => set("full_name", e.target.value)}
                      onBlur={() => blur("full_name")}
                      placeholder="Dr. Karim Benali"
                      className={inputCls(touched.full_name && !validate.full_name, touched.full_name && validate.full_name)} />
                  </Field>
                </div>

                {/* Row 2 */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Organisation" required error={touched.organisation && !validate.organisation ? "Obligatoire" : ""} valid={touched.organisation && validate.organisation}>
                    <input type="text" value={form.organisation}
                      onChange={(e) => set("organisation", e.target.value)}
                      onBlur={() => blur("organisation")}
                      placeholder="CHU Mustapha Pacha"
                      className={inputCls(touched.organisation && !validate.organisation, touched.organisation && validate.organisation)} />
                  </Field>
                  <Field label="Téléphone" error="" valid={false} hint="(optionnel)">
                    <input type="tel" value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+213 555 00 00 00"
                      className={inputCls(false, false)} />
                  </Field>
                </div>

                {/* Message */}
                <Field label="Message" error="" valid={false} hint="(optionnel)">
                  <textarea rows={3} value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Décrivez brièvement votre cas d'usage…"
                    className={inputCls(false, false) + " resize-none"} />
                </Field>

                {/* Pack selector */}
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "hsl(215 20% 65%)" }}>Pack souhaité</div>
                  <div className="grid grid-cols-2 gap-3">
                    {PACKS.map((p) => {
                      const selected = form.pack === p.id;
                      return (
                        <button key={p.id} type="button" onClick={() => set("pack", p.id)}
                          className="flex items-start gap-2.5 rounded-xl border px-3 py-3 text-left transition-all duration-200 hover:scale-[1.02]"
                          style={{
                            borderColor: selected ? p.color : "hsl(215 28% 20%)",
                            background:  selected ? `hsl(${p.colorRaw} / 0.1)` : "hsl(215 28% 10%)",
                            boxShadow:   selected ? `0 0 0 1px ${p.color}40` : "none",
                          }}>
                          <p.icon size={14} className="mt-0.5 shrink-0" style={{ color: p.color }} />
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-widest leading-none mb-0.5" style={{ color: p.color }}>{p.label}</div>
                            <div className="text-[10px]" style={{ color: "hsl(215 20% 50%)" }}>{p.sub}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold text-white glow-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  <UserPlus size={15} />
                  {loading ? "Envoi en cours…" : "Soumettre ma demande"}
                </button>
              </form>

              <div className="mt-5 text-center text-xs" style={{ color: "hsl(215 20% 50%)" }}>
                Déjà un compte ?{" "}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: "hsl(var(--primary))" }}>
                  Se connecter
                </Link>
              </div>
            </>
          )}

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs transition-colors" style={{ color: "hsl(215 20% 40%)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 40%)")}>
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
