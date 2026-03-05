import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile, decodeJwt, tokenSecondsLeft, JwtPayload } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import {
  Key, Copy, Check, RefreshCw, Clock, ShieldCheck,
  Info, LogIn, Eye, EyeOff,
} from "lucide-react";

function formatExpiry(secsLeft: number): { label: string; urgent: boolean } {
  if (secsLeft <= 0) return { label: "Expiré", urgent: true };
  const m = Math.floor(secsLeft / 60);
  const s = secsLeft % 60;
  if (m < 1) return { label: `${s}s restante(s)`, urgent: true };
  if (m < 5) return { label: `${m} min ${s}s`, urgent: true };
  return { label: `${m} min ${s}s`, urgent: false };
}

function formatAbsDate(exp?: number): string {
  if (!exp) return "—";
  return new Date(exp * 1000).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

export default function DashboardTokens() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [secsLeft, setSecsLeft] = useState(0);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("npp_token");
    if (!t) { navigate("/login"); return; }
    setToken(t);
    setPayload(decodeJwt(t));
    authApi.me().then(setUser).catch(() => navigate("/login")).finally(() => setLoading(false));
  }, [navigate]);

  // Live countdown
  useEffect(() => {
    if (!token) return;
    setSecsLeft(tokenSecondsLeft(token));
    const interval = setInterval(() => {
      const s = tokenSecondsLeft(token);
      setSecsLeft(s);
      if (s <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [token]);

  const handleCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    toast.success("Token copié dans le presse-papiers !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    navigate("/login?renew=1");
  };

  const maskedToken = token
    ? `${token.slice(0, 20)}${"•".repeat(32)}${token.slice(-12)}`
    : "";

  const { label: expiryLabel, urgent } = formatExpiry(secsLeft);
  const expiryPct = Math.max(0, Math.min(100, (secsLeft / (30 * 60)) * 100));

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={user}>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-white mb-1">Mes tokens</h1>
          <p className="text-sm text-[hsl(215_20%_55%)]">Gérez votre token d'accès JWT actif</p>
        </div>

        {/* Token expiry card */}
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: urgent ? "hsl(0 72% 37% / 0.45)" : "hsl(142 72% 37% / 0.35)",
            background: urgent ? "hsl(0 72% 37% / 0.06)" : "hsl(142 72% 37% / 0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={15} style={{ color: urgent ? "hsl(0 72% 60%)" : "hsl(142 72% 50%)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: urgent ? "hsl(0 72% 60%)" : "hsl(142 72% 50%)" }}>
                Expiration du token
              </span>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background: urgent ? "hsl(0 72% 37% / 0.15)" : "hsl(142 72% 37% / 0.15)",
                color: urgent ? "hsl(0 72% 65%)" : "hsl(142 72% 55%)",
              }}
            >
              {expiryLabel}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-[hsl(215_28%_18%)] overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${expiryPct}%`,
                background: urgent
                  ? "linear-gradient(90deg, hsl(0 72% 37%), hsl(0 72% 55%))"
                  : "linear-gradient(90deg, hsl(142 72% 37%), hsl(142 72% 55%))",
              }}
            />
          </div>

          <p className="text-xs text-[hsl(215_20%_50%)]">
            Expire le <strong className="text-[hsl(215_20%_70%)]">{formatAbsDate(payload?.exp)}</strong>
            {" · "}Le token JWT est valide <strong className="text-[hsl(215_20%_70%)]">30 minutes</strong> après connexion.
          </p>
        </div>

        {/* Token value card */}
        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-[hsl(215_20%_50%)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)]">
                Bearer Token actif
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRevealed(!revealed)}
                className="flex items-center gap-1.5 text-xs text-[hsl(215_20%_55%)] hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-[hsl(215_28%_18%)]"
              >
                {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                {revealed ? "Masquer" : "Afficher"}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: copied ? "hsl(142 72% 37% / 0.15)" : "hsl(215 28% 18%)",
                  color: copied ? "hsl(142 72% 55%)" : "hsl(215 20% 65%)",
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copié !" : "Copier"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)] p-3 font-mono text-[11px] text-[hsl(215_20%_55%)] break-all select-all">
            {revealed ? token : maskedToken}
          </div>

          <p className="mt-2 text-[10px] text-[hsl(215_20%_40%)] flex items-center gap-1">
            <Info size={11} />
            Utilisez ce token dans le header : <code className="text-[hsl(215_20%_55%)]">Authorization: Bearer &lt;token&gt;</code>
          </p>
        </div>

        {/* JWT payload card */}
        {payload && (
          <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-[hsl(215_20%_50%)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)]">
                Contenu du JWT (décodé)
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { k: "Email",    v: payload.email || payload.sub || "—" },
                { k: "Pack",     v: payload.pack || localStorage.getItem("npp_pack") || "—" },
                { k: "Rôle",     v: payload.role || "—" },
                { k: "Émis le",  v: payload.iat ? new Date(payload.iat * 1000).toLocaleString("fr-FR") : "—" },
              ].map(({ k, v }) => (
                <div key={k} className="rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-widest text-[hsl(215_20%_40%)] mb-0.5">{k}</div>
                  <div className="text-sm text-white font-medium truncate">{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regenerate */}
        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Régénérer le token</h3>
            <p className="text-xs text-[hsl(215_20%_55%)]">
              Un nouveau token est généré à chaque connexion. Pour régénérer, reconnectez-vous.
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border border-[hsl(var(--code-border))] text-[hsl(215_20%_65%)] hover:text-white hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--primary)/0.08)]"
          >
            <LogIn size={14} />
            Se reconnecter
          </button>
        </div>

        {/* Usage example */}
        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw size={13} className="text-[hsl(215_20%_50%)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)]">
              Utilisation
            </span>
          </div>
          <pre className="rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)] p-3 text-[11px] text-[hsl(215_20%_65%)] overflow-x-auto">
{`curl -X GET \\
  https://nnp.forge-solutions.tech/v1/auth/me \\
  -H "Authorization: Bearer <votre_token>"`}
          </pre>
        </div>
      </div>
    </DashboardLayout>
  );
}
