import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, Trash2, X, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function DashboardDelete() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ password: "", confirm_email: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) { navigate("/login"); return; }
    authApi.me().then(setUser).catch(() => navigate("/login")).finally(() => setLoading(false));
  }, [navigate]);

  const handleDelete = async () => {
    setError("");
    setSaving(true);
    try {
      await authApi.deleteAccount(form.password, form.confirm_email);
      localStorage.removeItem("npp_token");
      localStorage.removeItem("npp_pack");
      localStorage.removeItem("npp_approved");
      navigate("/login?deleted=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] px-4 py-2.5 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:border-[hsl(0_72%_50%)] focus:outline-none focus:ring-1 focus:ring-[hsl(0_72%_37%/0.3)] transition-colors";
  const labelCls = "block text-xs font-semibold text-[hsl(215_20%_70%)] mb-1.5 uppercase tracking-wider";

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout user={user}>
      <div className="max-w-md space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-white mb-1">Supprimer mon compte</h1>
          <p className="text-sm text-[hsl(215_20%_55%)]">Zone de danger — action irréversible</p>
        </div>

        {/* Danger banner */}
        <div className="rounded-2xl border border-[hsl(0_72%_37%/0.5)] bg-[hsl(0_72%_37%/0.08)] p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[hsl(0_72%_60%)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[hsl(0_72%_65%)]">Cette action est irréversible.</p>
            <p className="text-xs text-[hsl(215_20%_55%)] mt-1">
              La suppression de votre compte entraîne la perte définitive de toutes vos données, clés d'API et statistiques.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[hsl(0_72%_37%/0.35)] bg-[hsl(0_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(0_72%_65%)]">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-[hsl(0_72%_37%/0.3)] bg-[hsl(215_28%_11%)] p-6 space-y-5">
          <div>
            <label className={labelCls}>Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className={inputCls + " pr-10"}
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
          <div>
            <label className={labelCls}>Confirmer votre email</label>
            <input
              type="email"
              required
              value={form.confirm_email}
              onChange={(e) => setForm((p) => ({ ...p, confirm_email: e.target.value }))}
              placeholder={user?.email}
              className={inputCls}
            />
            <p className="text-[10px] text-[hsl(215_20%_45%)] mt-1">
              Tapez <strong className="text-[hsl(215_20%_60%)]">{user?.email}</strong> pour confirmer
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            disabled={!form.password || !form.confirm_email}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[hsl(0_72%_37%/0.5)] bg-[hsl(0_72%_37%/0.12)] py-3 text-sm font-bold text-[hsl(0_72%_60%)] hover:bg-[hsl(0_72%_37%/0.2)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            Supprimer définitivement mon compte
          </button>
        </div>
      </div>

      {/* Confirmation modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[hsl(0_72%_37%/0.5)] bg-[hsl(215_28%_10%)] p-6 animate-fade-up">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-extrabold text-white">Êtes-vous sûr ?</h3>
              <button onClick={() => setModalOpen(false)} className="text-[hsl(215_20%_50%)] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-[hsl(215_20%_60%)] mb-6">
              Cette action supprimera votre compte de manière <strong className="text-[hsl(0_72%_60%)]">permanente et irréversible</strong>. Toutes vos données seront perdues.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[hsl(var(--code-border))] text-sm text-[hsl(215_20%_65%)] hover:text-white hover:border-[hsl(215_28%_35%)] transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[hsl(0_72%_37%)] text-sm font-bold text-white hover:bg-[hsl(0_72%_45%)] transition-all disabled:opacity-50"
              >
                <Trash2 size={13} />
                {saving ? "Suppression…" : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
