import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserProfile, PACK_COLORS } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import {
  User, Building2, Phone, Mail, Calendar, Clock,
  Check, AlertTriangle, Infinity,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) { navigate("/login"); return; }
    authApi.me().then(setUser).catch(() => navigate("/login")).finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!user) return null;

  const packKey = user.pack || "FREE";
  const packMeta = PACK_COLORS[packKey] || PACK_COLORS["FREE"];
  const pd = user.pack_detail;
  const q = user.quota;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Welcome banner */}
        <div className="rounded-2xl border p-6" style={{ background: `${packMeta.color}08`, borderColor: packMeta.border }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[hsl(215_20%_55%)] uppercase tracking-widest mb-1">Bonjour 👋</p>
              <h1 className="text-2xl font-extrabold text-white">{user.full_name}</h1>
              <p className="text-sm text-[hsl(215_20%_60%)] mt-0.5">{user.organisation}</p>
            </div>
            <span
              className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: packMeta.bg, color: packMeta.color, border: `1px solid ${packMeta.border}` }}
            >
              {packKey}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Profile card */}
          <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)] mb-4 flex items-center gap-2">
              <User size={13} /> Mon Profil
            </h2>
            <div className="space-y-3">
              {[
                { icon: Mail,     val: user.email },
                { icon: Building2,val: user.organisation },
                { icon: Phone,    val: user.phone || "—" },
                { icon: User,     val: user.role },
                { icon: Calendar, val: `Membre depuis ${formatDate(user.created_at)}` },
                { icon: Clock,    val: `${daysSince(user.created_at)} jours d'ancienneté` },
              ].map(({ icon: Icon, val }, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <Icon size={13} className="shrink-0 text-[hsl(215_20%_45%)]" />
                  <span className="text-[hsl(215_20%_75%)] truncate">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pack card */}
          {pd && (
            <div className="rounded-2xl border p-5" style={{ borderColor: packMeta.border, background: packMeta.bg }}>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: packMeta.color }}>
                {pd.name}
              </h2>
              <p className="text-xs text-[hsl(215_20%_55%)] mb-4">{pd.target}</p>
              <ul className="space-y-1.5 mb-4">
                {pd.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-white/80">
                    <Check size={12} style={{ color: packMeta.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              {pd.limitations.length > 0 && (
                <div className="border-t border-[hsl(215_28%_20%)] pt-3 mt-3 space-y-1.5">
                  {pd.limitations.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[hsl(215_20%_50%)]">
                      <AlertTriangle size={11} className="text-[hsl(38_72%_50%)]" />
                      {l}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quota card (FREE only) */}
          {q && (
            <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)] mb-4 flex items-center gap-2">
                <Infinity size={13} /> Quotas
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[hsl(215_20%_65%)]">Aujourd'hui</span>
                    <span className="font-bold text-white">{q.requests_today} / {q.limit_day}</span>
                  </div>
                  <Progress value={(q.requests_today / q.limit_day) * 100} className="h-2 bg-[hsl(215_28%_18%)]" />
                  <p className="text-[10px] text-[hsl(215_20%_45%)] mt-1">
                    <span style={{ color: "hsl(142 72% 50%)" }} className="font-bold">{q.remaining_today}</span> restantes aujourd'hui
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[hsl(215_20%_65%)]">Ce mois</span>
                    <span className="font-bold text-white">{q.requests_month} / {q.limit_month}</span>
                  </div>
                  <Progress value={(q.requests_month / q.limit_month) * 100} className="h-2 bg-[hsl(215_28%_18%)]" />
                  <p className="text-[10px] text-[hsl(215_20%_45%)] mt-1">
                    <span style={{ color: "hsl(142 72% 50%)" }} className="font-bold">{q.remaining_month}</span> restantes ce mois · reset {formatDate(q.reset_date)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
