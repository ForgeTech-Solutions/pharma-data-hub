import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function DashboardPassword() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) { navigate("/login"); return; }
    authApi.me().then(setUser).catch(() => navigate("/login")).finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");
    if (form.next !== form.confirm) {
      setFieldError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    if (form.next.length < 8) {
      setFieldError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setSaving(true);
    try {
      const res = await authApi.changePassword(form.current, form.next);
      toast.success(res.message || "Mot de passe modifié avec succès !");
      setForm({ current: "", next: "", confirm: "" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du changement");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] px-4 py-2.5 pr-10 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)] transition-colors";
  const labelCls = "block text-xs font-semibold text-[hsl(215_20%_70%)] mb-1.5 uppercase tracking-wider";

  const PwdField = ({ field, label, placeholder }: { field: "current" | "next" | "confirm"; label: string; placeholder?: string }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="relative">
        <input
          type={show[field] ? "text" : "password"}
          required
          value={form[field]}
          onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
          placeholder={placeholder || "••••••••"}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(215_20%_45%)] hover:text-white transition-colors"
        >
          {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

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
          <h1 className="text-xl font-extrabold text-white mb-1">Changer mon mot de passe</h1>
          <p className="text-sm text-[hsl(215_20%_55%)]">Sécurisez votre compte avec un nouveau mot de passe</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-6 space-y-5">
          {fieldError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[hsl(0_72%_37%/0.35)] bg-[hsl(0_72%_37%/0.08)] px-4 py-3 text-sm text-[hsl(0_72%_65%)]">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {fieldError}
            </div>
          )}

          <PwdField field="current" label="Mot de passe actuel" />
          <PwdField field="next" label="Nouveau mot de passe" placeholder="Min. 8 caractères" />
          <PwdField field="confirm" label="Confirmer le nouveau mot de passe" />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold text-white glow-primary hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <KeyRound size={14} />
            {saving ? "Modification…" : "Changer mon mot de passe"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
