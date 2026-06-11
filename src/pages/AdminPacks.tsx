import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, AdminPack, AdminPacksResponse } from "@/lib/api";
import { Layers, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

export default function AdminPacks() {
  const [loading, setLoading] = useState(true);
  const [packs, setPacks] = useState<AdminPack[]>([]);
  const [selected, setSelected] = useState<AdminPack | null>(null);

  useEffect(() => {
    adminApi
      .packs()
      .then((res: AdminPacksResponse) => {
        setPacks(res.packs || []);
        if (res.packs?.length) setSelected(res.packs[0]);
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : "Impossible de charger les packs");
      })
      .finally(() => setLoading(false));
  }, []);

  const openDetail = async (slug: string) => {
    try {
      const detail = await adminApi.packDetail(slug);
      setSelected(detail);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Impossible de charger le détail du pack");
    }
  };

  return (
    <AdminLayout
      title="Catalogue des packs"
      subtitle="Référentiel des offres et paramètres disponibles côté administration"
    >
      {loading ? (
        <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-6">
          <div className="w-8 h-8 rounded-full border-2 border-[hsl(210_80%_55%)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-4">
          <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-4 space-y-2">
            {packs.map((pack) => {
              const active = selected?.slug === pack.slug;
              return (
                <button
                  key={pack.slug}
                  onClick={() => openDetail(pack.slug)}
                  className={`w-full text-left rounded-xl px-3.5 py-3 border transition-all ${
                    active
                      ? "border-[hsl(210_80%_50%/0.45)] bg-[hsl(210_80%_50%/0.12)]"
                      : "border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] hover:border-[hsl(215_28%_32%)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{pack.slug}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(215_28%_16%)] text-[hsl(215_20%_60%)]">
                      {pack.name}
                    </span>
                  </div>
                  <p className="text-xs text-[hsl(215_20%_58%)] mt-1">{pack.target}</p>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5">
            {!selected ? (
              <p className="text-sm text-[hsl(215_20%_60%)]">Sélectionnez un pack pour afficher ses détails.</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-white">{selected.name} ({selected.slug})</h2>
                    <p className="text-sm text-[hsl(215_20%_60%)] mt-1">{selected.target}</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border border-[hsl(210_80%_50%/0.35)] bg-[hsl(210_80%_50%/0.12)] text-[hsl(210_80%_65%)]">
                    <Layers className="w-3 h-3" />
                    Pack
                  </div>
                </div>

                {selected.description && (
                  <p className="text-sm text-[hsl(215_20%_70%)] leading-relaxed mb-5">{selected.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] p-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[hsl(215_20%_58%)] mb-3 inline-flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Features
                    </h3>
                    <ul className="space-y-2 text-sm text-[hsl(215_20%_72%)]">
                      {(selected.features || []).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] p-4">
                    <h3 className="text-xs uppercase tracking-wider font-bold text-[hsl(215_20%_58%)] mb-3 inline-flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Paramètres
                    </h3>
                    <div className="space-y-2 text-sm">
                      <Row label="Rate/day" value={formatLimit(selected.rate_limit_day)} />
                      <Row label="Rate/month" value={formatLimit(selected.rate_limit_month)} />
                      <Row label="Approbation" value={selected.requires_approval ? "Requise" : "Non requise"} />
                    </div>
                    {(selected.limitations || []).length > 0 && (
                      <>
                        <div className="h-px bg-[hsl(215_28%_20%)] my-3" />
                        <ul className="space-y-1.5 text-xs text-[hsl(215_20%_58%)]">
                          {(selected.limitations || []).map((l, i) => (
                            <li key={i}>• {l}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function formatLimit(v?: number) {
  if (v === undefined || v === null) return "—";
  if (v >= 99999999) return "Illimité";
  return v.toLocaleString("fr-FR");
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[hsl(215_20%_58%)]">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
