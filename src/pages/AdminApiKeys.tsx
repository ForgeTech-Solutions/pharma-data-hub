import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, AdminApiKey } from "@/lib/api";
import { toast } from "sonner";
import { KeyRound, Trash2, Power, PowerOff, Search } from "lucide-react";

export default function AdminApiKeys() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<AdminApiKey[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [userId, setUserId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [selected, setSelected] = useState<AdminApiKey | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.apiKeys({
        page,
        page_size: pageSize,
        user_id: userId ? Number(userId) : undefined,
        is_active: isActive === "" ? undefined : isActive === "true",
      });
      setItems(res.api_keys || []);
      setTotal(res.total || 0);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Impossible de charger les clés API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, userId, isActive]);

  const toggleStatus = async (k: AdminApiKey) => {
    try {
      await adminApi.setApiKeyStatus(k.id, !k.is_active);
      toast.success(k.is_active ? "Clé désactivée" : "Clé activée");
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action impossible");
    }
  };

  const removeKey = async (k: AdminApiKey) => {
    if (!window.confirm(`Supprimer définitivement la clé ${k.name} ?`)) return;
    try {
      await adminApi.deleteApiKeyAdmin(k.id);
      toast.success("Clé supprimée");
      if (selected?.id === k.id) setSelected(null);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Suppression impossible");
    }
  };

  const openDetail = async (k: AdminApiKey) => {
    try {
      const detail = await adminApi.apiKeyDetail(k.id);
      setSelected(detail);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Détail indisponible");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AdminLayout
      title="Gestion des clés API"
      subtitle="Supervision globale, activation/révocation et traçabilité par utilisateur"
    >
      <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(215_20%_45%)]" />
            <input
              value={userId}
              onChange={(e) => { setPage(1); setUserId(e.target.value); }}
              placeholder="Filtrer par user_id"
              className="w-full rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] pl-9 pr-3 py-2 text-sm text-white"
            />
          </div>
          <select
            value={isActive}
            onChange={(e) => { setPage(1); setIsActive(e.target.value); }}
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          >
            <option value="">Statut: tous</option>
            <option value="true">Actives</option>
            <option value="false">Inactives</option>
          </select>
          <select
            value={pageSize}
            onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          >
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
          <button
            onClick={() => { setPage(1); setPageSize(20); setUserId(""); setIsActive(""); }}
            className="rounded-xl border border-[hsl(215_28%_24%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-[hsl(215_20%_68%)] hover:text-white"
          >
            Réinitialiser
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] overflow-hidden">
        {loading ? (
          <div className="p-6"><div className="w-8 h-8 rounded-full border-2 border-[hsl(210_80%_55%)] border-t-transparent animate-spin" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="bg-[hsl(215_28%_12%)] text-[hsl(215_20%_58%)] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Clé</th>
                    <th className="text-left px-4 py-3">Utilisateur</th>
                    <th className="text-left px-4 py-3">Pack</th>
                    <th className="text-left px-4 py-3">Statut</th>
                    <th className="text-left px-4 py-3">Requêtes</th>
                    <th className="text-left px-4 py-3">Dernière utilisation</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((k) => (
                    <tr key={k.id} className="border-t border-[hsl(215_28%_18%)]">
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-white inline-flex items-center gap-2">
                          <KeyRound className="w-3.5 h-3.5 text-[hsl(210_80%_62%)]" />
                          {k.name}
                        </div>
                        <div className="text-xs text-[hsl(215_20%_58%)] font-mono mt-0.5">{k.key_prefix}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[hsl(215_20%_70%)]">{k.user_email || `User #${k.user_id}`}</td>
                      <td className="px-4 py-3 text-sm text-[hsl(215_20%_70%)]">{k.user_pack || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${k.is_active ? "bg-[hsl(142_72%_37%/0.16)] text-[hsl(142_72%_60%)]" : "bg-[hsl(0_72%_45%/0.16)] text-[hsl(0_72%_66%)]"}`}>
                          {k.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-[hsl(215_20%_70%)]">{k.requests_count.toLocaleString("fr-FR")}</td>
                      <td className="px-4 py-3 text-sm text-[hsl(215_20%_62%)]">
                        {k.last_used_at ? new Date(k.last_used_at).toLocaleString("fr-FR") : "Jamais"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openDetail(k)} className="px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] hover:text-white">Détail</button>
                          <button
                            onClick={() => toggleStatus(k)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${k.is_active ? "border-[hsl(38_90%_40%/0.35)] text-[hsl(38_90%_62%)]" : "border-[hsl(142_72%_37%/0.35)] text-[hsl(142_72%_60%)]"}`}
                          >
                            {k.is_active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                            {k.is_active ? "Désactiver" : "Activer"}
                          </button>
                          <button onClick={() => removeKey(k)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(0_72%_45%/0.35)] text-[hsl(0_72%_66%)]">
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-[hsl(215_28%_18%)] flex items-center justify-between">
              <div className="text-xs text-[hsl(215_20%_58%)]">Page {page} / {totalPages} · {total} clés</div>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] disabled:opacity-40">Précédent</button>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] disabled:opacity-40">Suivant</button>
              </div>
            </div>
          </>
        )}
      </section>

      {selected && (
        <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)]">Détail clé API</h2>
            <button onClick={() => setSelected(null)} className="px-2.5 py-1 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)]">Fermer</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <Detail label="ID" value={String(selected.id)} />
            <Detail label="Nom" value={selected.name} />
            <Detail label="User ID" value={String(selected.user_id)} />
            <Detail label="Email" value={selected.user_email || "—"} />
            <Detail label="Pack" value={selected.user_pack || "—"} />
            <Detail label="Prefix" value={selected.key_prefix} mono />
            <Detail label="Statut" value={selected.is_active ? "Active" : "Inactive"} />
            <Detail label="Requests" value={selected.requests_count.toLocaleString("fr-FR")} />
            <Detail label="Créée le" value={new Date(selected.created_at).toLocaleString("fr-FR")} />
            <Detail label="Last used" value={selected.last_used_at ? new Date(selected.last_used_at).toLocaleString("fr-FR") : "Jamais"} />
            <Detail label="IP" value={selected.last_used_ip || "—"} />
          </div>
        </section>
      )}
    </AdminLayout>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-[hsl(215_20%_50%)] mb-1">{label}</div>
      <div className={`${mono ? "font-mono" : ""} text-[hsl(215_20%_78%)] break-all`}>{value}</div>
    </div>
  );
}
