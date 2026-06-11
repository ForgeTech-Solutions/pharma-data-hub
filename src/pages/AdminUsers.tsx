import { useCallback, useEffect, useMemo, useState, type ElementType, type ReactNode } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, AdminPack, AdminUser, AdminUsersResponse, ApproveUserResponse } from "@/lib/api";
import { toast } from "sonner";
import { CheckCircle2, RotateCcw, UserX, Users, Clock3, Plus } from "lucide-react";

type Filters = {
  page: number;
  page_size: number;
  pack: string;
  is_approved: string;
  is_active: string;
};

export default function AdminUsers() {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    page_size: 20,
    pack: "",
    is_approved: "",
    is_active: "",
  });
  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState<AdminPack[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [usersData, setUsersData] = useState<AdminUsersResponse | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<AdminUser | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "LECTEUR",
    pack: "PRO",
    organisation: "",
    phone: "",
  });

  const [packModalUser, setPackModalUser] = useState<AdminUser | null>(null);
  const [nextPack, setNextPack] = useState("");

  const [approveModalUser, setApproveModalUser] = useState<AdminUser | null>(null);
  const [approvePack, setApprovePack] = useState("PRO");
  const [approvePassword, setApprovePassword] = useState("");

  const [resetModalUser, setResetModalUser] = useState<AdminUser | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState("");

  const [deactivateModalUser, setDeactivateModalUser] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        page_size: filters.page_size,
        pack: filters.pack || undefined,
        is_approved: filters.is_approved === "" ? undefined : filters.is_approved === "true",
        is_active: filters.is_active === "" ? undefined : filters.is_active === "true",
      };

      const [usersRes, pendingRes] = await Promise.all([
        adminApi.users(params),
        adminApi.pendingUsers(),
      ]);
      setUsersData(usersRes);
      setPendingCount(pendingRes.total || 0);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    adminApi
      .packs()
      .then((res) => setPacks(res.packs || []))
      .catch(() => {
        setPacks([]);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = usersData?.total_pages || 1;

  const packOptions = useMemo(
    () => packs.map((p) => p.slug),
    [packs]
  );

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === "page" ? Number(value) : 1 }));
  };

  const refreshWithToast = async (successMsg: string, action: () => Promise<unknown>, userId?: number) => {
    try {
      if (userId) setActionLoadingId(userId);
      const result = await action();
      toast.success(successMsg);
      await load();
      return result;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Action impossible");
      return null;
    } finally {
      setActionLoadingId(null);
    }
  };

  const approveUser = async (u: AdminUser, pack: string, password?: string) => {
    const res = (await refreshWithToast(
      `Utilisateur ${u.email} approuvé`,
      () => adminApi.approveUser(u.id, { pack, password }),
      u.id
    )) as ApproveUserResponse | null;

    if (res?.generated_password && res?.email_sent === false) {
      toast.info(`Mot de passe généré: ${res.generated_password}`);
    }
  };

  const changePack = async (u: AdminUser, pack: string) => {
    if (!pack || pack === u.pack) return;
    await refreshWithToast(`Pack mis à jour pour ${u.email}`, () => adminApi.changeUserPack(u.id, pack), u.id);
  };

  const resetPassword = async (u: AdminUser, custom?: string) => {
    const res = await refreshWithToast(
      `Mot de passe réinitialisé pour ${u.email}`,
      () => adminApi.resetUserPassword(u.id, custom),
      u.id
    );
    const generated = (res as { generated_password?: string; email_sent?: boolean } | null)?.generated_password;
    const emailSent = (res as { generated_password?: string; email_sent?: boolean } | null)?.email_sent;
    if (generated && emailSent === false) toast.info(`Mot de passe généré: ${generated}`);
  };

  const deactivate = async (u: AdminUser) => {
    await refreshWithToast(`Utilisateur ${u.email} désactivé`, () => adminApi.deactivateUser(u.id), u.id);
  };

  const submitCreateUser = async () => {
    if (!createForm.email || !createForm.password || !createForm.full_name) {
      toast.error("Email, mot de passe et nom complet sont obligatoires.");
      return;
    }

    try {
      await adminApi.createUser({
        email: createForm.email.trim(),
        password: createForm.password,
        full_name: createForm.full_name.trim(),
        role: createForm.role,
        pack: createForm.pack,
        organisation: createForm.organisation.trim() || undefined,
        phone: createForm.phone.trim() || undefined,
      });
      toast.success("Utilisateur créé avec succès");
      setCreateOpen(false);
      setCreateForm({
        email: "",
        password: "",
        full_name: "",
        role: "LECTEUR",
        pack: "PRO",
        organisation: "",
        phone: "",
      });
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Création impossible");
    }
  };

  const submitChangePack = async () => {
    if (!packModalUser) return;
    await changePack(packModalUser, nextPack);
    setPackModalUser(null);
    setNextPack("");
  };

  const submitApprove = async () => {
    if (!approveModalUser) return;
    await approveUser(approveModalUser, approvePack, approvePassword.trim() || undefined);
    setApproveModalUser(null);
    setApprovePack("PRO");
    setApprovePassword("");
  };

  const submitResetPassword = async () => {
    if (!resetModalUser) return;
    await resetPassword(resetModalUser, resetPasswordValue.trim() || undefined);
    setResetModalUser(null);
    setResetPasswordValue("");
  };

  const submitDeactivate = async () => {
    if (!deactivateModalUser) return;
    await deactivate(deactivateModalUser);
    setDeactivateModalUser(null);
  };

  const openDetail = async (id: number) => {
    try {
      const detail = await adminApi.userDetail(id);
      setSelectedDetail(detail);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Impossible de charger le détail utilisateur");
    }
  };

  return (
    <AdminLayout
      title="Gestion des utilisateurs"
      subtitle="Filtrer, approuver et administrer les comptes en un seul espace"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatBox icon={Users} label="Total" value={usersData?.total || 0} color="hsl(210 80% 60%)" />
        <StatBox icon={Clock3} label="En attente" value={pendingCount} color="hsl(38 90% 58%)" />
      </section>

      <section className="flex justify-end">
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(142_72%_37%/0.35)] bg-[hsl(142_72%_37%/0.10)] text-[hsl(142_72%_62%)] text-sm"
        >
          <Plus className="w-4 h-4" /> Ajouter un utilisateur
        </button>
      </section>

      <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={filters.pack}
            onChange={(e) => setFilter("pack", e.target.value)}
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          >
            <option value="">Tous packs</option>
            {packOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.is_approved}
            onChange={(e) => setFilter("is_approved", e.target.value)}
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          >
            <option value="">Approbation: tous</option>
            <option value="true">Approuvés</option>
            <option value="false">En attente</option>
          </select>

          <select
            value={filters.is_active}
            onChange={(e) => setFilter("is_active", e.target.value)}
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          >
            <option value="">Statut: tous</option>
            <option value="true">Actifs</option>
            <option value="false">Inactifs</option>
          </select>

          <select
            value={filters.page_size}
            onChange={(e) => setFilter("page_size", Number(e.target.value))}
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          >
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={200}>200 / page</option>
          </select>

          <button
            onClick={() => setFilters({ page: 1, page_size: 20, pack: "", is_approved: "", is_active: "" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[hsl(215_28%_24%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-[hsl(215_20%_68%)] hover:text-white"
          >
            <RotateCcw className="w-4 h-4" /> Réinitialiser
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] overflow-hidden">
        {loading ? (
          <div className="p-6"><div className="w-8 h-8 rounded-full border-2 border-[hsl(210_80%_55%)] border-t-transparent animate-spin" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px]">
                <thead className="bg-[hsl(215_28%_12%)] text-[hsl(215_20%_58%)] text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Utilisateur</th>
                    <th className="text-left px-4 py-3">Rôle</th>
                    <th className="text-left px-4 py-3">Pack</th>
                    <th className="text-left px-4 py-3">Statut</th>
                    <th className="text-left px-4 py-3">Créé le</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(usersData?.items || []).map((u) => {
                    const disabled = actionLoadingId === u.id;
                    return (
                      <tr key={u.id} className="border-t border-[hsl(215_28%_18%)]">
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-white">{u.email}</div>
                          <div className="text-xs text-[hsl(215_20%_58%)]">{u.full_name || "—"}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[hsl(215_20%_70%)]">{u.role}</td>
                        <td className="px-4 py-3 text-sm text-[hsl(215_20%_70%)]">{u.pack}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 text-[10px] uppercase tracking-wider">
                            <span className={`px-2 py-0.5 rounded-full ${u.is_approved ? "bg-[hsl(142_72%_37%/0.16)] text-[hsl(142_72%_60%)]" : "bg-[hsl(38_90%_40%/0.16)] text-[hsl(38_90%_62%)]"}`}>
                              {u.is_approved ? "Approuvé" : "Pending"}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full ${u.is_active ? "bg-[hsl(210_80%_50%/0.16)] text-[hsl(210_80%_66%)]" : "bg-[hsl(0_72%_45%/0.16)] text-[hsl(0_72%_66%)]"}`}>
                              {u.is_active ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[hsl(215_20%_62%)]">{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {!u.is_approved && (
                              <button
                                disabled={disabled}
                                onClick={() => {
                                  setApproveModalUser(u);
                                  setApprovePack(u.pack || "PRO");
                                  setApprovePassword("");
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(142_72%_37%/0.35)] bg-[hsl(142_72%_37%/0.12)] text-[hsl(142_72%_60%)] disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approuver
                              </button>
                            )}
                            <button
                              disabled={disabled}
                              onClick={() => {
                                setPackModalUser(u);
                                setNextPack(u.pack);
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] hover:text-white disabled:opacity-50"
                            >
                              Changer pack
                            </button>
                            <button
                              disabled={disabled}
                              onClick={() => {
                                setResetModalUser(u);
                                setResetPasswordValue("");
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(210_80%_50%/0.35)] text-[hsl(210_80%_66%)] disabled:opacity-50"
                            >
                              Reset MDP
                            </button>
                            <button
                              disabled={disabled || !u.is_active}
                              onClick={() => setDeactivateModalUser(u)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(0_72%_45%/0.35)] text-[hsl(0_72%_66%)] disabled:opacity-40"
                            >
                              <UserX className="w-3.5 h-3.5" /> Désactiver
                            </button>
                            <button
                              disabled={disabled}
                              onClick={() => openDetail(u.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] hover:text-white disabled:opacity-50"
                            >
                              Détail
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-[hsl(215_28%_18%)] flex items-center justify-between">
              <div className="text-xs text-[hsl(215_20%_58%)]">
                Page {filters.page} / {totalPages} · {usersData?.total || 0} utilisateurs
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={filters.page <= 1}
                  onClick={() => setFilter("page", filters.page - 1)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] disabled:opacity-40"
                >
                  Précédent
                </button>
                <button
                  disabled={filters.page >= totalPages}
                  onClick={() => setFilter("page", filters.page + 1)}
                  className="px-3 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)] disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {selectedDetail && (
        <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)]">Détail utilisateur</h2>
            <button
              onClick={() => setSelectedDetail(null)}
              className="px-2.5 py-1 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)]"
            >
              Fermer
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <DetailField label="Email" value={selectedDetail.email} />
            <DetailField label="Nom" value={selectedDetail.full_name || "—"} />
            <DetailField label="Rôle" value={selectedDetail.role} />
            <DetailField label="Pack" value={selectedDetail.pack} />
            <DetailField label="Organisation" value={selectedDetail.organisation || "—"} />
            <DetailField label="Téléphone" value={selectedDetail.phone || "—"} />
            <DetailField label="Actif" value={selectedDetail.is_active ? "Oui" : "Non"} />
            <DetailField label="Approuvé" value={selectedDetail.is_approved ? "Oui" : "Non"} />
            <DetailField label="Créé le" value={new Date(selectedDetail.created_at).toLocaleString("fr-FR")} />
          </div>
        </section>
      )}

      {createOpen && (
        <ModalShell title="Créer un utilisateur" onClose={() => setCreateOpen(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} placeholder="Email" className={modalInputClass} />
            <input value={createForm.password} onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} placeholder="Mot de passe" className={modalInputClass} />
            <input value={createForm.full_name} onChange={(e) => setCreateForm((p) => ({ ...p, full_name: e.target.value }))} placeholder="Nom complet" className={modalInputClass} />
            <select value={createForm.role} onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))} className={modalInputClass}>
              <option value="LECTEUR">LECTEUR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select value={createForm.pack} onChange={(e) => setCreateForm((p) => ({ ...p, pack: e.target.value }))} className={modalInputClass}>
              {packOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={createForm.organisation} onChange={(e) => setCreateForm((p) => ({ ...p, organisation: e.target.value }))} placeholder="Organisation (optionnel)" className={modalInputClass} />
            <input value={createForm.phone} onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Téléphone (optionnel)" className={modalInputClass + " md:col-span-2"} />
          </div>
          <ModalActions
            onClose={() => setCreateOpen(false)}
            onConfirm={submitCreateUser}
            confirmLabel="Créer"
          />
        </ModalShell>
      )}

      {packModalUser && (
        <ModalShell title={`Changer pack · ${packModalUser.email}`} onClose={() => setPackModalUser(null)}>
          <select value={nextPack} onChange={(e) => setNextPack(e.target.value)} className={modalInputClass}>
            {packOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ModalActions onClose={() => setPackModalUser(null)} onConfirm={submitChangePack} confirmLabel="Appliquer" />
        </ModalShell>
      )}

      {approveModalUser && (
        <ModalShell title={`Approuver · ${approveModalUser.email}`} onClose={() => setApproveModalUser(null)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select value={approvePack} onChange={(e) => setApprovePack(e.target.value)} className={modalInputClass}>
              {packOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input value={approvePassword} onChange={(e) => setApprovePassword(e.target.value)} placeholder="Mot de passe (optionnel)" className={modalInputClass} />
          </div>
          <ModalActions onClose={() => setApproveModalUser(null)} onConfirm={submitApprove} confirmLabel="Approuver" />
        </ModalShell>
      )}

      {resetModalUser && (
        <ModalShell title={`Réinitialiser MDP · ${resetModalUser.email}`} onClose={() => setResetModalUser(null)}>
          <input
            value={resetPasswordValue}
            onChange={(e) => setResetPasswordValue(e.target.value)}
            placeholder="Nouveau mot de passe (laisser vide = génération automatique)"
            className={modalInputClass}
          />
          <ModalActions onClose={() => setResetModalUser(null)} onConfirm={submitResetPassword} confirmLabel="Réinitialiser" />
        </ModalShell>
      )}

      {deactivateModalUser && (
        <ModalShell title="Confirmer la désactivation" onClose={() => setDeactivateModalUser(null)}>
          <p className="text-sm text-[hsl(215_20%_66%)]">
            Voulez-vous vraiment désactiver <span className="text-white font-semibold">{deactivateModalUser.email}</span> ?
          </p>
          <ModalActions onClose={() => setDeactivateModalUser(null)} onConfirm={submitDeactivate} confirmLabel="Désactiver" destructive />
        </ModalShell>
      )}
    </AdminLayout>
  );
}

const modalInputClass = "rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white";

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)]">{title}</h2>
          <button onClick={onClose} className="px-2.5 py-1 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)]">Fermer</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  onConfirm,
  confirmLabel,
  destructive,
}: {
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs border border-[hsl(215_28%_24%)] text-[hsl(215_20%_66%)]">Annuler</button>
      <button
        onClick={onConfirm}
        className={`px-3 py-1.5 rounded-lg text-xs border ${destructive ? "border-[hsl(0_72%_45%/0.35)] text-[hsl(0_72%_66%)]" : "border-[hsl(142_72%_37%/0.35)] text-[hsl(142_72%_60%)]"}`}
      >
        {confirmLabel}
      </button>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: ElementType; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}1F` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="text-[11px] uppercase tracking-wider font-bold text-[hsl(215_20%_58%)]">{label}</div>
      <div className="text-2xl font-extrabold text-white">{value.toLocaleString("fr-FR")}</div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-[hsl(215_20%_50%)] mb-1">{label}</div>
      <div className="text-[hsl(215_20%_78%)] break-all">{value}</div>
    </div>
  );
}
