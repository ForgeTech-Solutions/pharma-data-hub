import { useEffect, useMemo, useState, type ElementType } from "react";
import {
  adminApi,
  authApi,
  AdminStats,
  AdminEmailStatus,
  AdminOverview,
  UserProfile,
} from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users,
  UserCheck,
  UserX,
  Clock3,
  Mail,
  ShieldCheck,
  Server,
  AlertTriangle,
  Dot,
  Database,
  FlaskConical,
  Building2,
  Gauge,
  GitBranch,
} from "lucide-react";

type LoadState = "loading" | "ready" | "error";

const PANEL_CLASS = "rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] shadow-[0_10px_40px_hsl(215_40%_3%/0.35)]";
const INNER_PANEL_CLASS = "rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)]";

export default function AdminDashboard() {
  const [state, setState] = useState<LoadState>("loading");
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [me, setMe] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [emailStatus, setEmailStatus] = useState<AdminEmailStatus | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    Promise.allSettled([authApi.me(), adminApi.stats(), adminApi.emailStatus(), adminApi.overview(period)])
      .then((results) => {
        const profileRes = results[0];
        const statsRes = results[1];
        const emailRes = results[2];
        const overviewRes = results[3];

        if (profileRes.status === "fulfilled") setMe(profileRes.value);
        if (statsRes.status === "fulfilled") setStats(statsRes.value);
        if (emailRes.status === "fulfilled") setEmailStatus(emailRes.value);
        if (overviewRes.status === "fulfilled") setOverview(overviewRes.value);

        if (statsRes.status === "fulfilled" && emailRes.status === "fulfilled") {
          setState("ready");
          return;
        }

        setState("error");
      })
      .catch(() => setState("error"));
  }, [period]);

  const packRows = useMemo(() => {
    if (!stats?.by_pack) return [] as Array<{ key: string; value: number }>;
    return Object.entries(stats.by_pack)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  const health = useMemo(() => {
    const server = overview?.server;
    const status = server?.status || "online";
    const runtime = server?.runtime || "N/A";
    const lastDowntime = server?.last_downtime || "N/A";

    const statusLabel =
      status === "online" ? "Online" : status === "degraded" ? "Degraded" : "Offline";

    const statusColor =
      status === "online"
        ? "hsl(142 72% 60%)"
        : status === "degraded"
          ? "hsl(38 90% 62%)"
          : "hsl(0 72% 66%)";

    return { status, statusLabel, statusColor, runtime, lastDowntime, server };
  }, [overview]);

  const serverFacts = useMemo(() => {
    const s = health.server;
    if (!s) return [] as Array<{ icon: ElementType; label: string; value: string; tone?: "good" | "warn" | "bad" }>;

    const uptimeTone: "good" | "warn" | "bad" =
      typeof s.uptime_percent !== "number"
        ? "warn"
        : s.uptime_percent >= 99.9
          ? "good"
          : s.uptime_percent >= 99
            ? "warn"
            : "bad";

    const latencyTone: "good" | "warn" | "bad" =
      typeof s.db_latency_ms !== "number"
        ? "warn"
        : s.db_latency_ms < 20
          ? "good"
          : s.db_latency_ms < 80
            ? "warn"
            : "bad";

    return [
      {
        icon: GitBranch,
        label: "Version",
        value: s.version || "N/A",
      },
      {
        icon: Gauge,
        label: "Uptime",
        value: formatUptime(s.uptime_seconds, s.runtime, s.uptime_percent),
        tone: uptimeTone,
      },
      {
        icon: Database,
        label: "DB latency",
        value:
          typeof s.db_latency_ms === "number"
            ? `${s.db_latency_ms.toFixed(2)} ms`
            : "N/A",
        tone: latencyTone,
      },
      {
        icon: FlaskConical,
        label: "Médicaments",
        value:
          typeof s.total_medicaments === "number"
            ? s.total_medicaments.toLocaleString("fr-FR")
            : "N/A",
      },
      {
        icon: Building2,
        label: "Laboratoires",
        value:
          typeof s.total_laboratoires === "number"
            ? s.total_laboratoires.toLocaleString("fr-FR")
            : "N/A",
      },
      {
        icon: Clock3,
        label: "Dernière MAJ",
        value:
          (s.derniere_mise_a_jour_date && formatDateTime(s.derniere_mise_a_jour_date)) ||
          s.derniere_mise_a_jour ||
          "N/A",
      },
    ];
  }, [health.server]);

  const topMetrics = useMemo(() => {
    const trend = overview?.metrics?.trend_percent;
    return {
      apiCalls: overview?.metrics?.api_calls ?? 0,
      activeUsers: overview?.metrics?.active_users ?? stats?.active ?? 0,
      newUsers: overview?.metrics?.new_users ?? stats?.pending_approval ?? 0,
      trends: {
        apiCalls: trend?.api_calls,
        activeUsers: trend?.active_users,
        newUsers: trend?.new_users,
      },
    };
  }, [overview, stats]);

  const activitySeries = useMemo(() => {
    const labels = overview?.activity?.labels;
    const values = overview?.activity?.values;
    if (labels?.length && values?.length && labels.length === values.length) {
      return { labels, values };
    }
    return {
      labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
      values: [38, 30, 42, 65, 58, 49, 54],
    };
  }, [overview]);

  const incidents = useMemo(() => {
    if (overview?.incidents?.length) return overview.incidents;
    return [
      {
        id: 1,
        title: "Timeout incidents",
        message: "Quelques requêtes lentes détectées sur les dernières 24h.",
        reporter: "Système",
        severity: "medium" as const,
      },
      {
        id: 2,
        title: "Network interruptions",
        message: "Instabilité intermittente observée sur un fournisseur réseau.",
        reporter: "Monitoring",
        severity: "high" as const,
      },
      {
        id: 3,
        title: "Mail provider warnings",
        message: "Des erreurs temporaires côté provider email ont été enregistrées.",
        reporter: "Email Service",
        severity: "low" as const,
      },
    ];
  }, [overview]);

  return (
    <AdminLayout
      title="Dashboard Admin"
      subtitle={`Bienvenue ${me?.full_name || "Admin"} · Pilotage global de la plateforme`}
      headerMeta={health.server?.version ? `API v${health.server.version}` : undefined}
    >
      {state === "loading" && (
        <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-6">
          <div className="w-8 h-8 rounded-full border-2 border-[hsl(210_80%_55%)] border-t-transparent animate-spin" />
        </div>
      )}

      {state === "error" && (
        <div className="rounded-2xl border border-[hsl(0_72%_50%/0.35)] bg-[hsl(0_72%_37%/0.08)] p-5 text-[hsl(0_72%_70%)]">
          Impossible de charger les données admin pour le moment.
        </div>
      )}

      {state === "ready" && stats && emailStatus && (
        <>
          <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_2fr] gap-4 items-stretch">
            <div className={`${PANEL_CLASS} border-[hsl(142_72%_37%/0.28)] bg-[linear-gradient(160deg,hsl(142_50%_17%/0.92)_0%,hsl(210_38%_11%/0.94)_100%)] p-5 h-full`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-white tracking-tight">Server {health.statusLabel}</h2>
                <Dot className="w-6 h-6" style={{ color: health.statusColor }} />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className={`${INNER_PANEL_CLASS} border-white/10 bg-white/5 p-4 flex items-start gap-3`}>
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                    <Server className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="text-[hsl(142_30%_85%)]">
                      <span className="font-semibold text-white">Running time:</span> {health.runtime}
                    </div>
                    <div className="text-[hsl(142_30%_85%)]">
                      <span className="font-semibold text-white">Last down time:</span> {health.lastDowntime}
                    </div>
                    {health.server?.deployed_since && (
                      <div className="text-[hsl(142_30%_85%)]">
                        <span className="font-semibold text-white">Deployed since:</span> {formatDateTime(health.server.deployed_since)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {serverFacts.slice(0, 2).map((f) => (
                    <div
                      key={f.label}
                      className={`${INNER_PANEL_CLASS} px-3 py-2`}
                      style={{
                        borderColor:
                          f.tone === "good"
                            ? "hsl(142 72% 55% / 0.35)"
                            : f.tone === "bad"
                              ? "hsl(0 72% 60% / 0.35)"
                              : "hsl(38 90% 58% / 0.32)",
                        background:
                          f.tone === "good"
                            ? "hsl(142 72% 37% / 0.10)"
                            : f.tone === "bad"
                              ? "hsl(0 72% 37% / 0.10)"
                              : "hsl(38 90% 38% / 0.10)",
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-[hsl(142_30%_78%)] mb-1 inline-flex items-center gap-1.5">
                        <f.icon className="w-3.5 h-3.5" />
                        {f.label}
                      </div>
                      <div className="text-sm font-semibold text-white break-all">{f.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {serverFacts.slice(2, 6).map((f) => (
                    <div
                      key={f.label}
                      className={`${INNER_PANEL_CLASS} px-3 py-2`}
                      style={{
                        borderColor:
                          f.tone === "good"
                            ? "hsl(142 72% 55% / 0.35)"
                            : f.tone === "bad"
                              ? "hsl(0 72% 60% / 0.35)"
                              : "hsl(38 90% 58% / 0.32)",
                        background:
                          f.tone === "good"
                            ? "hsl(142 72% 37% / 0.10)"
                            : f.tone === "bad"
                              ? "hsl(0 72% 37% / 0.10)"
                              : "hsl(38 90% 38% / 0.10)",
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-[hsl(142_30%_78%)] mb-1 inline-flex items-center gap-1.5">
                        <f.icon className="w-3.5 h-3.5" />
                        {f.label}
                      </div>
                      <div className="text-sm font-semibold text-white break-all">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${PANEL_CLASS} p-5 grid grid-cols-1 md:grid-cols-3 gap-4 h-full`}>
              <TopMetric title="Api Calls" value={topMetrics.apiCalls} subtitle="Trafic cumulé" trend={topMetrics.trends.apiCalls} />
              <TopMetric title="Active users" value={topMetrics.activeUsers} subtitle="Utilisateurs actifs" trend={topMetrics.trends.activeUsers} />
              <TopMetric title="New users" value={topMetrics.newUsers} subtitle="Nouveaux inscrits" trend={topMetrics.trends.newUsers} />
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
            <div className={`${PANEL_CLASS} p-5`}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-4xl leading-none font-black text-white tracking-tight">Activity</h2>
                <div className="inline-flex items-center rounded-lg border border-[hsl(215_28%_24%)] bg-[hsl(215_28%_12%)] p-1">
                  <button
                    onClick={() => setPeriod("week")}
                    className={`text-xs px-2 py-1 rounded-md transition-all ${period === "week" ? "bg-[hsl(210_80%_50%/0.18)] text-[hsl(210_80%_65%)]" : "text-[hsl(215_20%_66%)]"}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setPeriod("month")}
                    className={`text-xs px-2 py-1 rounded-md transition-all ${period === "month" ? "bg-[hsl(210_80%_50%/0.18)] text-[hsl(210_80%_65%)]" : "text-[hsl(215_20%_66%)]"}`}
                  >
                    Month
                  </button>
                </div>
              </div>
              <p className="text-xs text-[hsl(215_20%_55%)] mb-4">Mise à jour automatique toutes les 3 heures</p>
              <ActivityChart labels={activitySeries.labels} values={activitySeries.values} />
              {overview?.updated_at && (
                <div className="text-[11px] text-[hsl(215_20%_52%)] mt-2">
                  Dernière mise à jour: {new Date(overview.updated_at).toLocaleString("fr-FR")}
                </div>
              )}
              {typeof health.server?.uptime_seconds === "number" && (
                <div className="text-[11px] text-[hsl(215_20%_52%)] mt-1">
                  Uptime cumulé: {formatDuration(health.server.uptime_seconds)}
                </div>
              )}
            </div>

            <div className={`${PANEL_CLASS} p-5`}>
              <h2 className="text-xl font-black text-white mb-4">Errors and complaints</h2>
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    title={incident.title}
                    message={incident.message}
                    reporter={incident.reporter}
                    severity={incident.severity}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <KpiCard icon={Users} title="Total utilisateurs" value={stats.total_users} color="hsl(210 80% 60%)" />
            <KpiCard icon={UserCheck} title="Comptes approuvés" value={stats.approved} color="hsl(142 72% 55%)" />
            <KpiCard icon={Clock3} title="En attente" value={stats.pending_approval} color="hsl(38 90% 58%)" />
            <KpiCard icon={UserX} title="Inactifs" value={stats.inactive} color="hsl(0 72% 63%)" />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className={`${PANEL_CLASS} p-5`}>
              <h2 className="text-sm font-bold text-white mb-4">Répartition par pack</h2>
              <div className="space-y-3">
                {packRows.map((row) => {
                  const ratio = stats.total_users > 0 ? (row.value / stats.total_users) * 100 : 0;
                  return (
                    <div key={row.key}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[hsl(215_20%_68%)] font-semibold">{row.key}</span>
                        <span className="text-white font-bold">{row.value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[hsl(215_28%_16%)] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${ratio}%`, background: "linear-gradient(90deg, hsl(210 80% 55%), hsl(142 72% 50%))" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${PANEL_CLASS} p-5`}>
              <h2 className="text-sm font-bold text-white mb-4">Santé du service Email</h2>
              <div className="space-y-3 text-sm">
                <StatusRow icon={Mail} label="Provider" value={emailStatus.provider || "N/A"} />
                <StatusRow icon={ShieldCheck} label="Configuration" value={emailStatus.configured ? "Configuré" : "Incomplet"} />
                <StatusRow icon={Mail} label="Expéditeur" value={`${emailStatus.mail_from_name} <${emailStatus.mail_from}>`} />
                <StatusRow icon={Clock3} label="Templates" value={String(emailStatus.templates?.length || 0)} />
              </div>
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-lg border"
                style={{
                  color: emailStatus.enabled ? "hsl(142 72% 60%)" : "hsl(0 72% 65%)",
                  borderColor: emailStatus.enabled ? "hsl(142 72% 37% / 0.35)" : "hsl(0 72% 50% / 0.35)",
                  background: emailStatus.enabled ? "hsl(142 72% 37% / 0.08)" : "hsl(0 72% 37% / 0.08)",
                }}>
                {emailStatus.enabled ? "Service email actif" : "Service email désactivé"}
              </div>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

function KpiCard({ icon: Icon, title, value, color }: { icon: ElementType; title: string; value: number; color: string }) {
  return (
    <div className={`${PANEL_CLASS} p-5 h-full`}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}1F` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="text-[11px] uppercase tracking-[0.14em] font-bold text-[hsl(215_20%_55%)] mb-1">{title}</div>
      <div className="text-2xl font-extrabold text-white">{value.toLocaleString("fr-FR")}</div>
    </div>
  );
}

function StatusRow({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-[hsl(210_80%_60%)]" />
      <span className="text-[hsl(215_20%_60%)]">{label}:</span>
      <span className="text-white font-medium truncate">{value}</span>
    </div>
  );
}

function TopMetric({ title, value, subtitle, trend }: { title: string; value: number; subtitle: string; trend?: number }) {
  const trendUp = typeof trend === "number" ? trend >= 0 : undefined;
  return (
    <div className={`${INNER_PANEL_CLASS} px-4 py-3 min-h-[168px] flex flex-col justify-between`}> 
      <div>
        <div className="text-xs font-semibold text-[hsl(215_20%_62%)] mb-1">{title}</div>
        <div className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">{value.toLocaleString("fr-FR")}</div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-xs text-[hsl(215_20%_52%)]">{subtitle}</div>
        {typeof trend === "number" && (
          <div
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: trendUp ? "hsl(142 72% 62%)" : "hsl(0 72% 68%)",
              background: trendUp ? "hsl(142 72% 37% / 0.14)" : "hsl(0 72% 37% / 0.14)",
            }}
          >
            {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityChart({ labels, values }: { labels: string[]; values: number[] }) {
  const width = 900;
  const height = 240;
  const padding = 16;
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const spread = Math.max(1, maxVal - minVal);

  const points = values
    .map((v, i) => {
      const x = padding + (i * (width - padding * 2)) / Math.max(1, values.length - 1);
      const y = height - padding - ((v - minVal) / spread) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[220px] rounded-xl border border-[hsl(215_28%_18%)] bg-[linear-gradient(180deg,hsl(215_28%_12%)_0%,hsl(215_28%_10%)_100%)]">
        <defs>
          <linearGradient id="activity-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142 72% 54%)" />
            <stop offset="100%" stopColor="hsl(210 80% 60%)" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#activity-stroke)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
      <div className="grid grid-cols-7 gap-2 mt-2 text-xs text-[hsl(215_20%_62%)]">
        {labels.map((l) => (
          <span key={l} className="text-center">{l}</span>
        ))}
      </div>
    </div>
  );
}

function IncidentCard({
  title,
  message,
  reporter,
  severity,
}: {
  title: string;
  message: string;
  reporter: string;
  severity: "low" | "medium" | "high";
}) {
  const tone =
    severity === "high"
      ? "border-[hsl(0_72%_48%/0.45)] bg-[hsl(0_72%_35%/0.12)] text-[hsl(0_72%_72%)]"
      : severity === "medium"
        ? "border-[hsl(38_90%_45%/0.45)] bg-[hsl(38_90%_35%/0.12)] text-[hsl(38_90%_70%)]"
        : "border-[hsl(142_72%_37%/0.4)] bg-[hsl(142_72%_35%/0.12)] text-[hsl(142_72%_70%)]";

  return (
    <div className={`rounded-xl border p-3 transition-all duration-200 hover:translate-y-[-1px] ${tone}`}>
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-4 h-4" />
        <div className="text-sm font-bold">{title}</div>
      </div>
      <div className="text-xs leading-relaxed mb-2">{message}</div>
      <div className="text-[11px] opacity-80">{reporter}</div>
    </div>
  );
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("fr-FR");
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "N/A";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

function formatUptime(uptimeSeconds?: number, fallbackRuntime?: string, uptimePercent?: number) {
  const duration = typeof uptimeSeconds === "number" ? formatDuration(uptimeSeconds) : fallbackRuntime || "N/A";
  const percent = typeof uptimePercent === "number" ? `${uptimePercent.toFixed(2)}%` : "N/A";
  return `${percent} • ${duration}`;
}
