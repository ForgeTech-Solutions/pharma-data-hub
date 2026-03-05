import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserStats, PACK_COLORS } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { BarChart3, Calendar, TrendingUp, TrendingDown, Tag } from "lucide-react";

export default function DashboardStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [user, setUser] = useState<{ full_name?: string; pack?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) { navigate("/login"); return; }
    Promise.all([authApi.stats(), authApi.me()])
      .then(([s, u]) => { setStats(s); setUser(u); })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    </DashboardLayout>
  );
  if (!stats) return null;

  const packKey = stats.pack || "FREE";
  const packMeta = PACK_COLORS[packKey] || PACK_COLORS["FREE"];

  const cards = [
    { label: "Requêtes aujourd'hui", value: stats.requests_today, icon: BarChart3, color: "hsl(210 80% 50%)" },
    { label: "Requêtes ce mois",     value: stats.requests_month, icon: TrendingUp, color: "hsl(142 72% 37%)" },
    { label: "Restantes aujourd'hui",value: stats.remaining_today, icon: TrendingDown, color: "hsl(38 72% 50%)" },
    { label: "Restantes ce mois",    value: stats.remaining_month, icon: TrendingDown, color: "hsl(262 72% 55%)" },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-white mb-1">Mes statistiques</h1>
          <p className="text-sm text-[hsl(215_20%_55%)]">Votre utilisation de l'API NPP</p>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <div className="text-2xl font-black text-white">{value.toLocaleString()}</div>
              <div className="text-xs text-[hsl(215_20%_55%)] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Account info row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[hsl(215_28%_18%)]">
              <Calendar size={18} className="text-[hsl(215_20%_55%)]" />
            </div>
            <div>
              <div className="text-xl font-black text-white">{stats.account_age_days} jours</div>
              <div className="text-xs text-[hsl(215_20%_55%)]">Ancienneté du compte</div>
            </div>
          </div>

          <div className="rounded-2xl border p-5 flex items-center gap-4" style={{ borderColor: packMeta.border, background: packMeta.bg }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: packMeta.bg }}>
              <Tag size={18} style={{ color: packMeta.color }} />
            </div>
            <div>
              <div className="text-lg font-black uppercase" style={{ color: packMeta.color }}>{packKey}</div>
              <div className="text-xs text-[hsl(215_20%_55%)]">{stats.pack_name}</div>
            </div>
          </div>
        </div>

        {/* Available features */}
        {stats.available_features?.length > 0 && (
          <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)] mb-4">
              Fonctionnalités disponibles
            </h2>
            <div className="flex flex-wrap gap-2">
              {stats.available_features.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold"
                  style={{ background: packMeta.bg, color: packMeta.color, border: `1px solid ${packMeta.border}` }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
