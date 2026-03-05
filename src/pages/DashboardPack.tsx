import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, UserPackDetail, PACK_COLORS } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Check, AlertTriangle, Mail, ArrowUpRight } from "lucide-react";

const ALL_PACK_ORDER = ["FREE", "PRO", "INSTITUTIONNEL", "DEVELOPPEUR", "DÉVELOPPEUR"];

export default function DashboardPack() {
  const navigate = useNavigate();
  const [data, setData] = useState<UserPackDetail | null>(null);
  const [user, setUser] = useState<{ full_name?: string; pack?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) { navigate("/login"); return; }
    Promise.all([authApi.pack(), authApi.me()])
      .then(([p, u]) => { setData(p); setUser(u); })
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
  if (!data) return null;

  const packKey = data.current_pack;
  const packMeta = PACK_COLORS[packKey] || PACK_COLORS["FREE"];
  const d = data.detail;

  const sortedPacks = data.all_packs.slice().sort(
    (a, b) => ALL_PACK_ORDER.indexOf(a) - ALL_PACK_ORDER.indexOf(b)
  );

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold text-white mb-1">Mon pack</h1>
          <p className="text-sm text-[hsl(215_20%_55%)]">Détail de votre abonnement actuel</p>
        </div>

        {/* Current pack detail */}
        <div className="rounded-2xl border p-6" style={{ borderColor: packMeta.border, background: `${packMeta.color}08` }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: packMeta.color }}>
                Pack actuel
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{d.name}</h2>
              <p className="text-sm text-[hsl(215_20%_55%)] mt-1">{d.target}</p>
            </div>
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest" style={{ background: packMeta.bg, color: packMeta.color, border: `1px solid ${packMeta.border}` }}>
              {packKey}
            </span>
          </div>

          <p className="text-sm text-[hsl(215_20%_65%)] mb-5">{d.description}</p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_50%)] mb-3">Fonctionnalités</h3>
              <ul className="space-y-2">
                {d.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <Check size={13} style={{ color: packMeta.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {d.limitations.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_50%)] mb-3">Limitations</h3>
                <ul className="space-y-2">
                  {d.limitations.map((l, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[hsl(215_20%_55%)]">
                      <AlertTriangle size={13} className="text-[hsl(38_72%_50%)] shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-[hsl(215_28%_20%)] grid grid-cols-2 gap-4 text-xs text-[hsl(215_20%_55%)]">
            <div>Limite journalière : <strong className="text-white">{d.rate_limit_day === 0 ? "Illimitée" : `${d.rate_limit_day} req`}</strong></div>
            <div>Limite mensuelle : <strong className="text-white">{d.rate_limit_month === 0 ? "Illimitée" : `${d.rate_limit_month} req`}</strong></div>
          </div>
        </div>

        {/* All packs comparison */}
        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[hsl(215_20%_55%)] mb-4">
            Comparaison des packs
          </h2>
          <div className="flex flex-wrap gap-2">
            {sortedPacks.map((p) => {
              const pm = PACK_COLORS[p] || PACK_COLORS["FREE"];
              const isCurrent = p === packKey;
              return (
                <span
                  key={p}
                  className="px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{
                    background: isCurrent ? pm.bg : "hsl(215 28% 15%)",
                    color: isCurrent ? pm.color : "hsl(215 20% 45%)",
                    border: `1px solid ${isCurrent ? pm.border : "hsl(215 28% 20%)"}`,
                  }}
                >
                  {isCurrent ? `✓ ${p}` : p}
                </span>
              );
            })}
          </div>
        </div>

        {/* Upgrade CTA */}
        {data.upgrade_message && (
          <div className="rounded-2xl border border-[hsl(142_72%_37%/0.35)] bg-[hsl(142_72%_37%/0.06)] p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ArrowUpRight size={18} style={{ color: "hsl(142 72% 37%)" }} className="mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Changer de pack</h3>
                <p className="text-xs text-[hsl(215_20%_60%)]">{data.upgrade_message}</p>
              </div>
            </div>
            <a
              href="mailto:contact@forge-solutions.tech"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-primary glow-primary hover:opacity-90 transition-all"
            >
              <Mail size={13} />
              Contacter l'équipe
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
