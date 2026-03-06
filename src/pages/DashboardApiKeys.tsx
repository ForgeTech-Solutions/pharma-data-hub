import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  authApi,
  PACK_COLORS,
  UserApiKey,
  UserApiKeysResponse,
  UserProfile,
} from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  Terminal,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

function formatRelativeDate(iso?: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const diffMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

  const minutes = Math.round(diffMs / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");

  const hours = Math.round(diffMs / 3600000);
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");

  const days = Math.round(diffMs / 86400000);
  if (Math.abs(days) < 30) return rtf.format(days, "day");

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardApiKeys() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [data, setData] = useState<UserApiKeysResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [oneTimeOpen, setOneTimeOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [copied, setCopied] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<UserApiKey | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [guideOpen, setGuideOpen] = useState(false);

  const load = async () => {
    const [me, keys] = await Promise.all([authApi.me(), authApi.listApiKeys()]);
    setUser(me);
    setData(keys);
  };

  useEffect(() => {
    if (!localStorage.getItem("npp_token")) {
      navigate("/login");
      return;
    }

    load()
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const packMeta = useMemo(() => {
    const key = user?.pack || "FREE";
    return PACK_COLORS[key] || PACK_COLORS.FREE;
  }, [user?.pack]);

  const usedPct = useMemo(() => {
    if (!data?.max_keys) return 0;
    return Math.round((data.total / data.max_keys) * 100);
  }, [data]);

  const disabledCreate = !data || data.remaining_slots <= 0;

  const activeCount = useMemo(
    () => (data?.api_keys || []).filter((item) => item.is_active).length,
    [data?.api_keys]
  );

  const lastUsedLabel = useMemo(() => {
    const latest = (data?.api_keys || [])
      .filter((item) => item.last_used_at)
      .sort((a, b) => new Date(b.last_used_at || 0).getTime() - new Date(a.last_used_at || 0).getTime())[0];
    return latest?.last_used_at ? formatRelativeDate(latest.last_used_at) : "Jamais utilisée";
  }, [data?.api_keys]);

  const handleCreate = async () => {
    if (!keyName.trim()) {
      setCreateError("Le nom de la clé est obligatoire.");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const created = await authApi.createApiKey(keyName.trim());
      setNewApiKey(created.api_key);
      setNewApiKeyName(created.name);
      setOneTimeOpen(true);
      setCreateOpen(false);
      setKeyName("");
      setCopied(false);
      await load();
      toast.success("Clé API créée avec succès.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Impossible de créer la clé API.";
      setCreateError(message);
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!newApiKey) return;
    await navigator.clipboard.writeText(newApiKey);
    setCopied(true);
    toast.success("Clé API copiée dans le presse-papiers.");
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await authApi.deleteApiKey(deleteTarget.id);
      setDeleteTarget(null);
      await load();
      toast.success("Clé API révoquée avec succès.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Impossible de révoquer la clé API.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="rounded-2xl border p-5" style={{ borderColor: packMeta.border, background: "hsl(215 28% 11%)" }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-white">Mes clés API</h1>
              <p className="text-sm text-[hsl(215_20%_55%)] mt-1">
                Utilisez ces clés pour accéder à l'API depuis vos scripts et applications.
              </p>
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              disabled={disabledCreate}
              title={
                disabledCreate
                  ? "Limite atteinte pour votre pack. Contactez un administrateur pour changer de pack."
                  : "Créer une nouvelle clé API"
              }
              className="gap-2"
              style={{
                background: disabledCreate ? "hsl(215 28% 16%)" : packMeta.color,
                color: disabledCreate ? "hsl(215 20% 45%)" : "white",
              }}
            >
              <Plus className="w-4 h-4" />
              Créer une clé
            </Button>
          </div>

          <div className="mt-4 rounded-xl border p-3" style={{ borderColor: packMeta.border, background: packMeta.bg }}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="uppercase tracking-widest font-bold" style={{ color: packMeta.color }}>
                {data.total} / {data.max_keys} clés utilisées
              </span>
              <span className="text-[hsl(215_20%_60%)]">{data.remaining_slots} slot(s) restant(s)</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(215_28%_16%)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${usedPct}%`, background: packMeta.color }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl bg-[hsl(215_28%_8%)] border border-[hsl(215_28%_16%)] px-3 py-2.5">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(215_20%_45%)]">Clés actives</div>
              <div className="text-lg font-black text-white">{activeCount}</div>
            </div>
            <div className="rounded-xl bg-[hsl(215_28%_8%)] border border-[hsl(215_28%_16%)] px-3 py-2.5">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(215_20%_45%)]">Requêtes totales</div>
              <div className="text-lg font-black text-white">
                {(data.api_keys || []).reduce((sum, item) => sum + item.requests_count, 0).toLocaleString("fr-FR")}
              </div>
            </div>
            <div className="rounded-xl bg-[hsl(215_28%_8%)] border border-[hsl(215_28%_16%)] px-3 py-2.5">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(215_20%_45%)]">Dernière utilisation</div>
              <div className="text-sm font-semibold text-white truncate">{lastUsedLabel}</div>
            </div>
          </div>

          {data.api_keys.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[hsl(215_28%_20%)] bg-[hsl(215_28%_9%)] py-12 px-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center bg-[hsl(215_28%_14%)] mb-3">
                <Key className="w-6 h-6 text-[hsl(215_20%_45%)]" />
              </div>
              <p className="text-sm text-white font-semibold">Vous n'avez pas encore de clé API.</p>
              <p className="text-xs text-[hsl(215_20%_55%)] mt-1">
                Créez-en une pour intégrer l'API dans vos applications.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.api_keys.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[hsl(215_28%_17%)] bg-[hsl(215_28%_9%)] p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{item.name}</div>
                      <code className="text-xs font-mono text-[hsl(215_20%_65%)] break-all">{item.key_prefix}</code>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            background: item.is_active ? "hsl(142 72% 37% / 0.14)" : "hsl(0 72% 50% / 0.14)",
                            color: item.is_active ? "hsl(142 72% 55%)" : "hsl(0 72% 65%)",
                            border: `1px solid ${item.is_active ? "hsl(142 72% 37% / 0.35)" : "hsl(0 72% 50% / 0.35)"}`,
                          }}
                        >
                          {item.is_active ? "Active" : "Désactivée"}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setDeleteTarget(item)}
                      className="gap-2 border-[hsl(0_72%_37%/0.35)] text-[hsl(0_72%_65%)] hover:bg-[hsl(0_72%_37%/0.12)] hover:text-[hsl(0_72%_70%)]"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    <div className="rounded-lg bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_14%)] px-2.5 py-2">
                      <p className="text-[hsl(215_20%_45%)]">Créée</p>
                      <p className="text-[hsl(215_20%_70%)] mt-0.5" title={new Date(item.created_at).toLocaleString("fr-FR")}>
                        {formatRelativeDate(item.created_at)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_14%)] px-2.5 py-2">
                      <p className="text-[hsl(215_20%_45%)]">Dernière utilisation</p>
                      <p className="text-[hsl(215_20%_70%)] mt-0.5" title={item.last_used_at ? new Date(item.last_used_at).toLocaleString("fr-FR") : "—"}>
                        {item.last_used_at ? formatRelativeDate(item.last_used_at) : "Jamais utilisée"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_14%)] px-2.5 py-2">
                      <p className="text-[hsl(215_20%_45%)]">Dernière IP</p>
                      <p className="text-[hsl(215_20%_70%)] mt-0.5 font-mono">{item.last_used_ip || "—"}</p>
                    </div>
                    <div className="rounded-lg bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_14%)] px-2.5 py-2">
                      <p className="text-[hsl(215_20%_45%)]">Requêtes</p>
                      <p className="text-[hsl(215_20%_70%)] mt-0.5">{item.requests_count.toLocaleString("fr-FR")} requêtes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
          <div className="rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_11%)] p-5">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between text-left">
                <div>
                  <h2 className="text-sm font-bold text-white">Guide d'utilisation (API Key)</h2>
                  <p className="text-xs text-[hsl(215_20%_55%)] mt-0.5">Exemples curl et Python pour intégration machine-to-machine.</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-[hsl(215_20%_55%)] transition-transform ${guideOpen ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[hsl(215_20%_50%)] mb-2">
                  <Terminal className="w-3.5 h-3.5" />
                  Bash
                </div>
                <pre className="rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)] p-3 text-[12px] text-[hsl(215_20%_65%)] overflow-x-auto font-mono">
{`curl -H "X-API-Key: npp_sk_votre_cle_ici" \\
  https://npp.forge-solutions.tech/v1/medicaments?search=paracetamol`}
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[hsl(215_20%_50%)] mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  Python
                </div>
                <pre className="rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)] p-3 text-[12px] text-[hsl(215_20%_65%)] overflow-x-auto font-mono">
{`import requests
headers = {"X-API-Key": "npp_sk_votre_cle_ici"}
response = requests.get(
    "https://npp.forge-solutions.tech/v1/medicaments",
    params={"search": "paracetamol"},
    headers=headers
)
print(response.json())`}
                </pre>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--code-border))] bg-[hsl(215_28%_10%)] p-6">
            <h3 className="text-lg font-extrabold text-white mb-1">Créer une clé API</h3>
            <p className="text-sm text-[hsl(215_20%_55%)] mb-4">La clé complète sera affichée une seule fois.</p>

            <label className="block text-xs font-semibold text-[hsl(215_20%_70%)] mb-1.5 uppercase tracking-wider">
              Nom de la clé
            </label>
            <Input
              value={keyName}
              onChange={(event) => setKeyName(event.target.value)}
              placeholder="Ex: Script import ERP"
              className="border-[hsl(var(--code-border))] bg-[hsl(215_28%_8%)] text-white"
            />

            {createError && (
              <div className="mt-3 rounded-xl border border-[hsl(0_72%_50%/0.35)] bg-[hsl(0_72%_50%/0.08)] px-3 py-2.5 text-xs text-[hsl(0_72%_70%)]">
                {createError}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setCreateError("");
                  setCreateOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={creating || !keyName.trim()}>
                {creating ? "Génération…" : "Générer la clé"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {oneTimeOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-[hsl(38_90%_45%/0.45)] bg-[hsl(215_28%_10%)] p-6">
            <h3 className="text-lg font-extrabold text-white">Votre nouvelle clé API</h3>
            <p className="text-sm text-[hsl(215_20%_55%)] mt-1 mb-4">
              Clé générée pour <span className="text-white font-semibold">{newApiKeyName}</span>
            </p>

            <div className="rounded-xl border border-[hsl(38_90%_45%/0.35)] bg-[hsl(38_90%_45%/0.12)] px-4 py-3 text-[13px] text-[hsl(38_95%_70%)] flex items-start gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>⚠️ Cette clé ne sera plus affichée. Copiez-la maintenant.</span>
            </div>

            <div className="rounded-xl bg-[hsl(215_28%_7%)] border border-[hsl(215_28%_16%)] p-3">
              <code className="text-[12px] font-mono text-[hsl(215_20%_70%)] break-all">{newApiKey}</code>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="gap-2"
                style={{
                  borderColor: copied ? "hsl(142 72% 37% / 0.45)" : undefined,
                  color: copied ? "hsl(142 72% 55%)" : undefined,
                }}
              >
                {copied ? <Check className="w-4 h-4 animate-pulse" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiée" : "Copier"}
              </Button>
              <Button
                onClick={() => {
                  setOneTimeOpen(false);
                  setNewApiKey("");
                  setNewApiKeyName("");
                }}
              >
                J'ai copié ma clé
              </Button>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la clé '{deleteTarget?.name}' ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les applications qui l'utilisent perdront l'accès.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-[hsl(0_72%_50%)] hover:bg-[hsl(0_72%_55%)]"
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
