import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { scheduleTokenRefresh } from "@/lib/api";
import logo from "@/assets/logo_npp.png";
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle2, Clock, Info } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { saveSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL-based contextual messages
  const isDeleted  = searchParams.get("deleted") === "1";
  const isPending  = searchParams.get("pending") === "1";
  const isExpired  = searchParams.get("expired") === "1";
  const isRenew    = searchParams.get("renew")   === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <a href="/">
            <img src={logo} alt="NPP" className="h-14 w-auto mb-4" />
          </a>
          <h1 className="text-2xl font-extrabold text-white">Connexion</h1>
          <p className="text-sm text-[hsl(215_20%_60%)] mt-1">Accédez à votre espace client</p>
        </div>

        {/* Contextual banners */}
        {isDeleted && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[hsl(142_72%_37%/0.35)] bg-[hsl(142_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(142_72%_60%)]">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">Compte supprimé</strong>
              Votre compte a été supprimé définitivement. Merci d'avoir utilisé l'API NPP.
            </div>
          </div>
        )}
        {isPending && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[hsl(38_72%_50%/0.4)] bg-[hsl(38_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(38_72%_65%)]">
            <Clock size={16} className="mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">Demande en attente</strong>
              Votre inscription a bien été reçue. Un administrateur vous contactera sous 48h pour activer votre compte.
            </div>
          </div>
        )}
        {isExpired && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[hsl(38_72%_50%/0.4)] bg-[hsl(38_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(38_72%_65%)]">
            <Clock size={16} className="mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">Session expirée</strong>
              Votre token JWT a expiré après 30 minutes. Reconnectez-vous pour obtenir un nouveau token.
            </div>
          </div>
        )}
        {isRenew && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[hsl(210_80%_50%/0.35)] bg-[hsl(210_80%_50%/0.08)] px-4 py-3 text-sm text-[hsl(210_80%_65%)]">
            <Info size={16} className="mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block mb-0.5">Régénération du token</strong>
              Reconnectez-vous pour obtenir un nouveau token Bearer actif valable 30 minutes.
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-8">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[hsl(0_72%_37%/0.35)] bg-[hsl(0_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(0_72%_65%)]">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[hsl(215_20%_70%)] mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="karim@chu-mustapha.dz"
                className="w-full rounded-xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] px-4 py-2.5 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[hsl(215_20%_70%)] mb-1.5 uppercase tracking-wider">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] px-4 py-2.5 pr-10 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(215_20%_45%)] hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold text-white glow-primary hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn size={15} />
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[hsl(215_20%_50%)]">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-[hsl(var(--primary))] hover:underline font-medium">
              Faire une demande d'accès
            </Link>
          </div>
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
