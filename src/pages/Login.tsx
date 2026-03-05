import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { scheduleTokenRefresh } from "@/lib/api";
import logo from "@/assets/logo_npp.png";
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle2, Clock, Info, Shield, Zap, Database } from "lucide-react";

// Mini trust badges shown on the side panel
const TRUST = [
  { icon: Shield,   label: "JWT sécurisé",      sub: "Token Bearer 30 min"  },
  { icon: Database, label: "7 000+ médicaments", sub: "Base nationale MSPRH" },
  { icon: Zap,      label: "< 100ms",            sub: "Latence moyenne"       },
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveSession } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [touched,  setTouched]  = useState({ email: false, password: false });
  const formRef = useRef<HTMLDivElement>(null);

  const isDeleted = searchParams.get("deleted") === "1";
  const isPending = searchParams.get("pending") === "1";
  const isExpired = searchParams.get("expired") === "1";
  const isRenew   = searchParams.get("renew")   === "1";

  // Fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => formRef.current?.classList.add("visible"), 50);
    return () => clearTimeout(t);
  }, []);

  const emailValid    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!emailValid || !passwordValid) return;
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      saveSession(res.access_token, res.pack, res.is_approved);
      scheduleTokenRefresh(res.access_token);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      if (msg.toLowerCase().includes("attente") || msg.toLowerCase().includes("validation")) {
        setError("Votre compte est en attente de validation par un administrateur.");
      } else if (msg.toLowerCase().includes("désactivé") || msg.toLowerCase().includes("disabled")) {
        setError("Votre compte a été désactivé. Contactez l'administrateur.");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "hsl(215 28% 7%)" }}>

      {/* ── Left decorative panel (hidden on mobile) ──────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(215 28% 9%) 0%, hsl(142 40% 10%) 100%)" }}>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px,transparent 1px),linear-gradient(90deg,hsl(0 0% 100%) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />

        {/* Glow blob */}
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[130px] pointer-events-none"
          style={{ background: "hsl(142 72% 37%)" }} />

        {/* Top: logo */}
        <div className="relative z-10">
          <a href="/">
            <img src={logo} alt="API NPP" className="h-12 w-auto opacity-90" />
          </a>
        </div>

        {/* Middle: headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center gap-8 py-12">
          <div>
            <h2 className="text-2xl font-extrabold text-white leading-tight mb-3">
              La Nomenclature<br />
              <span className="text-gradient">Pharmaceutique</span><br />
              Nationale via API
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "hsl(215 20% 55%)" }}>
              Accédez à 7 000+ médicaments référencés, en temps réel, avec authentification JWT sécurisée.
            </p>
          </div>

          {/* Trust badges */}
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

        {/* Bottom: legal */}
        <p className="relative z-10 text-[10px]" style={{ color: "hsl(215 20% 35%)" }}>
          © 2025–2026 API NPP · MSPRH · République Algérienne
        </p>
      </div>

      {/* ── Right: login form ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div ref={formRef} className="section-fade w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <a href="/"><img src={logo} alt="NPP" className="h-12 w-auto mb-4 opacity-90" /></a>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white mb-1">Connexion</h1>
            <p className="text-sm" style={{ color: "hsl(215 20% 55%)" }}>
              Accédez à votre espace client
            </p>
          </div>

          {/* Contextual banners */}
          {isDeleted && <Banner icon={CheckCircle2} color="142 72% 37%" title="Compte supprimé" body="Votre compte a été supprimé définitivement." />}
          {isPending  && <Banner icon={Clock}       color="38 72% 50%"  title="Demande en attente" body="Un administrateur vous contactera sous 48h." />}
          {isExpired  && <Banner icon={Clock}       color="38 72% 50%"  title="Session expirée" body="Votre token JWT a expiré. Reconnectez-vous." />}
          {isRenew    && <Banner icon={Info}        color="210 80% 50%" title="Régénération token" body="Reconnectez-vous pour un nouveau token valable 30 min." />}
          {error      && <Banner icon={AlertCircle} color="0 72% 55%"   title="" body={error} />}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <Field
              label="Email"
              error={touched.email && !emailValid ? "Email invalide" : ""}
              valid={touched.email && emailValid}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                placeholder="karim@chu-mustapha.dz"
                className={inputCls(touched.email && !emailValid, touched.email && emailValid)}
              />
            </Field>

            {/* Password */}
            <Field
              label="Mot de passe"
              error={touched.password && !passwordValid ? "Min. 6 caractères" : ""}
              valid={touched.password && passwordValid}
            >
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  placeholder="••••••••"
                  className={inputCls(touched.password && !passwordValid, touched.password && passwordValid) + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "hsl(215 20% 45%)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "hsl(215 20% 45%)")}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold text-white glow-primary transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={15} />
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs" style={{ color: "hsl(215 20% 50%)" }}>
            Pas encore de compte ?{" "}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: "hsl(var(--primary))" }}>
              Faire une demande d'accès
            </Link>
          </div>

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

// ── Helpers ────────────────────────────────────────────────────────────────────
function inputCls(hasError: boolean, isValid: boolean) {
  const base = "w-full rounded-xl border bg-[hsl(215_28%_10%)] px-4 py-3 text-sm text-white placeholder:text-[hsl(215_20%_30%)] focus:outline-none focus:ring-1 transition-all duration-200";
  if (hasError) return `${base} border-[hsl(0_72%_55%)] focus:border-[hsl(0_72%_55%)] focus:ring-[hsl(0_72%_55%/0.25)]`;
  if (isValid)  return `${base} border-[hsl(142_72%_37%)] focus:border-[hsl(142_72%_37%)] focus:ring-[hsl(142_72%_37%/0.25)]`;
  return `${base} border-[hsl(215_28%_20%)] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary)/0.25)]`;
}

function Field({ label, error, valid, children }: { label: string; error: string; valid: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 20% 65%)" }}>
          {label}
        </label>
        {error && <span className="text-[10px] font-medium" style={{ color: "hsl(0 72% 65%)" }}>{error}</span>}
        {valid && !error && <CheckCircle2 size={12} style={{ color: "hsl(142 72% 45%)" }} />}
      </div>
      {children}
    </div>
  );
}

function Banner({ icon: Icon, color, title, body }: { icon: React.ElementType; color: string; title: string; body: string }) {
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm"
      style={{ borderColor: `hsl(${color} / 0.35)`, background: `hsl(${color} / 0.06)`, color: `hsl(${color})` }}>
      <Icon size={15} className="mt-0.5 shrink-0" />
      <div>
        {title && <strong className="text-white block mb-0.5">{title}</strong>}
        <span style={{ color: `hsl(${color})` }}>{body}</span>
      </div>
    </div>
  );
}
