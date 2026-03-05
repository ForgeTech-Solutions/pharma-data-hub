import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api";
import logo from "@/assets/logo_npp.png";
import {
  UserPlus, AlertCircle, CheckCircle2,
  Sparkles, Code2, Shield, Crown,
} from "lucide-react";

const PACKS = [
  { id: "FREE",           label: "FREE",           sub: "100 req/j · gratuit",         icon: Sparkles, color: "hsl(215 28% 55%)" },
  { id: "PRO",            label: "PRO",            sub: "Illimité · export CSV",        icon: Code2,    color: "hsl(210 80% 50%)" },
  { id: "INSTITUTIONNEL", label: "INSTITUTIONNEL", sub: "Illimité · stats & dashboard", icon: Shield,   color: "hsl(142 72% 37%)" },
  { id: "DEVELOPPEUR",    label: "DÉVELOPPEUR",    sub: "Illimité · accès complet",     icon: Crown,    color: "hsl(262 72% 55%)" },
];

export default function Signup() {
  const [searchParams] = useSearchParams();
  const initialPack = searchParams.get("pack") || "FREE";
  const [form, setForm] = useState({
    email: "", full_name: "", organisation: "",
    phone: "", message: "", pack: initialPack,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.signup({
        email: form.email,
        full_name: form.full_name,
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

  const inputCls =
    "w-full rounded-xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] px-4 py-2.5 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)] transition-colors";
  const labelCls = "block text-xs font-semibold text-[hsl(215_20%_70%)] mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <a href="/">
            <img src={logo} alt="NPP" className="h-14 w-auto mb-4" />
          </a>
          <h1 className="text-2xl font-extrabold text-white">Demande d'accès</h1>
          <p className="text-sm text-[hsl(215_20%_60%)] mt-1 text-center max-w-xs">
            Votre demande sera examinée par un administrateur sous 48h.
          </p>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-8">
          {success ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[hsl(142_72%_37%/0.15)] border border-[hsl(142_72%_37%/0.4)]">
                <CheckCircle2 size={28} style={{ color: "hsl(142 72% 37%)" }} />
              </div>
              <h2 className="text-lg font-bold text-white">Demande enregistrée !</h2>
              <p className="text-sm text-[hsl(215_20%_60%)] max-w-sm">
                Votre demande a été enregistrée. Un administrateur vous contactera à{" "}
                <strong className="text-white">{form.email}</strong> sous 48h ouvrées.
              </p>
              <Link
                to="/login"
                className="mt-2 text-sm text-[hsl(var(--primary))] hover:underline font-medium"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[hsl(0_72%_37%/0.35)] bg-[hsl(0_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(0_72%_65%)]">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Email <span className="text-[hsl(0_72%_60%)]">*</span></label>
                    <input type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="karim@chu-mustapha.dz" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nom complet <span className="text-[hsl(0_72%_60%)]">*</span></label>
                    <input type="text" required value={form.full_name} onChange={(e) => handleChange("full_name", e.target.value)} placeholder="Dr. Karim Benali" className={inputCls} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Organisation <span className="text-[hsl(0_72%_60%)]">*</span></label>
                    <input type="text" required value={form.organisation} onChange={(e) => handleChange("organisation", e.target.value)} placeholder="CHU Mustapha Pacha" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Téléphone <span className="text-[hsl(215_20%_45%)] normal-case font-normal">(optionnel)</span></label>
                    <input type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+213 555 00 00 00" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Message <span className="text-[hsl(215_20%_45%)] normal-case font-normal">(optionnel)</span></label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Décrivez brièvement votre cas d'usage…"
                    className={inputCls + " resize-none"}
                  />
                </div>

                {/* Pack selector */}
                <div>
                  <label className={labelCls}>Pack souhaité</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PACKS.map((p) => {
                      const selected = form.pack === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleChange("pack", p.id)}
                          className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200"
                          style={{
                            borderColor: selected ? p.color : "hsl(215 28% 20%)",
                            background: selected ? `${p.color}18` : "hsl(215 28% 8%)",
                          }}
                        >
                          <p.icon size={14} className="mt-0.5 shrink-0" style={{ color: p.color }} />
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: p.color }}>{p.label}</div>
                            <div className="text-[10px] text-[hsl(215_20%_50%)] mt-0.5">{p.sub}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold text-white glow-primary hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus size={15} />
                  {loading ? "Envoi en cours…" : "Soumettre ma demande"}
                </button>
              </form>
            </>
          )}

          {!success && (
            <div className="mt-5 text-center text-xs text-[hsl(215_20%_50%)]">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-[hsl(var(--primary))] hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-[hsl(215_20%_45%)] hover:text-white transition-colors">
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
