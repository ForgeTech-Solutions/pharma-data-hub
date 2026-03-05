import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function DashboardProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", organisation: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) { navigate("/login"); return; }
    authApi.me()
      .then((u) => {
        setUser(u);
        setForm({ full_name: u.full_name || "", phone: u.phone || "", organisation: u.organisation || "" });
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await authApi.updateMe({
        full_name: form.full_name,
        phone: form.phone || undefined,
        organisation: form.organisation,
      });
      setUser(updated);
      toast.success("Profil mis à jour avec succès !");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] px-4 py-2.5 text-sm text-white placeholder:text-[hsl(215_20%_35%)] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-1 focus:ring-[hsl(var(--primary)/0.3)] transition-colors";
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
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-white mb-1">Mon profil</h1>
          <p className="text-sm text-[hsl(215_20%_55%)]">Modifiez vos informations personnelles</p>
        </div>

        {/* Read-only info */}
        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5 space-y-3">
          <div>
            <span className={labelCls}>Email</span>
            <div className="text-sm text-[hsl(215_20%_50%)] px-4 py-2.5 rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)]">
              {user?.email}
            </div>
          </div>
          <div>
            <span className={labelCls}>Rôle</span>
            <div className="text-sm text-[hsl(215_20%_50%)] px-4 py-2.5 rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)]">
              {user?.role}
            </div>
          </div>
        </div>

        {/* Editable form */}
        <form onSubmit={handleSave} className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5 space-y-5">
          <div>
            <label className={labelCls}>Nom complet</label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Organisation</label>
            <input
              type="text"
              value={form.organisation}
              onChange={(e) => setForm((p) => ({ ...p, organisation: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Téléphone <span className="text-[hsl(215_20%_45%)] normal-case font-normal">(optionnel)</span></label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+213 555 00 00 00"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-bold text-white glow-primary hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
