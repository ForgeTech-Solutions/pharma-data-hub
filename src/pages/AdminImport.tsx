import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  adminApi,
  BASE_URL,
  ImportPreviewResponse,
  ImportNomenclatureResponse,
  ImportDuplicatesResponse,
  ImportCleanDuplicatesResponse,
} from "@/lib/api";
import { toast } from "sonner";
import { Upload, FileSpreadsheet, Sparkles, ShieldAlert, Trash2 } from "lucide-react";

export default function AdminImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreviewResponse | null>(null);
  const [importResult, setImportResult] = useState<ImportNomenclatureResponse | null>(null);
  const [duplicates, setDuplicates] = useState<ImportDuplicatesResponse | null>(null);
  const [cleanResult, setCleanResult] = useState<ImportCleanDuplicatesResponse | null>(null);

  const [version, setVersion] = useState("");
  const [sheetNames, setSheetNames] = useState("");
  const [replaceVersion, setReplaceVersion] = useState(false);
  const [dupVersion, setDupVersion] = useState("");
  const [cleanVersion, setCleanVersion] = useState("");
  const [keepStrategy, setKeepStrategy] = useState<"latest" | "first">("latest");
  const [dryRun, setDryRun] = useState(true);
  const [busy, setBusy] = useState<"none" | "preview" | "import" | "dups" | "clean">("none");
  const [importProgress, setImportProgress] = useState(0);
  const [importStage, setImportStage] = useState<"idle" | "upload" | "processing" | "done">("idle");

  const canRun = useMemo(() => !!file, [file]);
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  useEffect(() => {
    if (busy !== "import" || importStage !== "processing") return;
    const id = setInterval(() => {
      setImportProgress((p) => (p < 94 ? p + 1 : p));
    }, 220);
    return () => clearInterval(id);
  }, [busy, importStage]);

  const importWithProgress = (payload: {
    file: File;
    version: string;
    sheetNames?: string;
    replaceVersion?: boolean;
  }) =>
    new Promise<ImportNomenclatureResponse>((resolve, reject) => {
      const body = new FormData();
      body.append("file", payload.file);
      body.append("version", payload.version);
      if (payload.sheetNames) body.append("sheet_names", payload.sheetNames);
      if (typeof payload.replaceVersion === "boolean") body.append("remplacer_version", String(payload.replaceVersion));

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/import/nomenclature`);

      const token = localStorage.getItem("npp_token");
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const uploadPct = Math.round((event.loaded / event.total) * 70);
        setImportStage("upload");
        setImportProgress(Math.max(5, uploadPct));
      };

      xhr.onload = () => {
        setImportStage("processing");
        setImportProgress((p) => Math.max(75, p));

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText) as ImportNomenclatureResponse;
            resolve(data);
          } catch {
            reject(new Error("Réponse import invalide"));
          }
          return;
        }

        try {
          const errorJson = JSON.parse(xhr.responseText || "{}");
          const message =
            typeof errorJson?.detail === "string"
              ? errorJson.detail
              : typeof errorJson?.message === "string"
                ? errorJson.message
                : `Import impossible (${xhr.status})`;
          reject(new Error(message));
        } catch {
          reject(new Error(`Import impossible (${xhr.status})`));
        }
      };

      xhr.onerror = () => reject(new Error("Erreur réseau pendant l'import"));
      xhr.send(body);
    });

  const runPreview = async () => {
    if (!file) {
      toast.error("Sélectionnez un fichier .xlsx/.xls");
      return;
    }
    setBusy("preview");
    try {
      const res = await adminApi.importSheetsPreview(file);
      setPreview(res);
      toast.success("Preview généré");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Preview impossible");
    } finally {
      setBusy("none");
    }
  };

  const runImport = async () => {
    if (!file) {
      toast.error("Sélectionnez un fichier");
      return;
    }
    if (!version.trim()) {
      toast.error("Le champ version est obligatoire");
      return;
    }
    if (!DATE_RE.test(version.trim())) {
      toast.error("Le format doit être YYYY-MM-DD");
      return;
    }
    setBusy("import");
    setImportStage("upload");
    setImportProgress(5);
    try {
      const res = await importWithProgress({
        file,
        version: version.trim(),
        sheetNames: sheetNames.trim() || undefined,
        replaceVersion,
      });
      setImportStage("done");
      setImportProgress(100);
      setImportResult(res);
      toast.success("Import terminé");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Import impossible");
    } finally {
      setBusy("none");
      setTimeout(() => {
        setImportStage("idle");
        setImportProgress(0);
      }, 1000);
    }
  };

  const runDuplicates = async () => {
    setBusy("dups");
    try {
      const res = await adminApi.importDuplicates(dupVersion.trim() || undefined);
      setDuplicates(res);
      toast.success("Analyse des doublons terminée");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Lecture des doublons impossible");
    } finally {
      setBusy("none");
    }
  };

  const runClean = async () => {
    setBusy("clean");
    try {
      const res = await adminApi.importCleanDuplicates({
        version: cleanVersion.trim() || undefined,
        keep_strategy: keepStrategy,
        dry_run: dryRun,
      });
      setCleanResult(res);
      toast.success(dryRun ? "Simulation terminée" : "Nettoyage exécuté");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Nettoyage impossible");
    } finally {
      setBusy("none");
    }
  };

  return (
    <AdminLayout
      title="Import Nomenclature"
      subtitle="Preview Excel, import multi-feuilles et nettoyage des doublons"
    >
      <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-4 transition-all duration-300 hover:border-[hsl(210_80%_50%/0.28)]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)] inline-flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[hsl(210_80%_62%)]" /> Source Excel
        </h2>

        <label className="block rounded-xl border border-dashed border-[hsl(215_28%_28%)] bg-[hsl(215_28%_12%)] p-4 cursor-pointer hover:border-[hsl(210_80%_50%/0.45)] transition-all duration-300 hover:-translate-y-0.5">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <div className="flex items-center gap-3 text-sm text-[hsl(215_20%_68%)]">
            <Upload className="w-4 h-4" />
            {file ? `${file.name} (${Math.round(file.size / 1024)} Ko)` : "Choisir un fichier Excel (.xlsx/.xls)"}
          </div>
        </label>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={runPreview}
            disabled={!canRun || busy !== "none"}
            className="px-3 py-2 rounded-xl border border-[hsl(210_80%_50%/0.35)] text-[hsl(210_80%_65%)] text-sm disabled:opacity-50"
          >
            {busy === "preview" ? "Preview..." : "Preview des feuilles"}
          </button>
          <button
            onClick={() => {
              setPreview(null);
              setImportResult(null);
              setDuplicates(null);
              setCleanResult(null);
            }}
            className="px-3 py-2 rounded-xl border border-[hsl(215_28%_24%)] text-[hsl(215_20%_68%)] text-sm"
          >
            Réinitialiser le rapport
          </button>
        </div>

        {preview && (
          <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[hsl(215_28%_18%)] text-xs text-[hsl(215_20%_58%)]">{preview.filename}</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="text-[hsl(215_20%_56%)]">
                  <tr>
                    <th className="text-left px-4 py-2">Sheet</th>
                    <th className="text-left px-4 py-2">Rows</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-left px-4 py-2">Category</th>
                    <th className="text-left px-4 py-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.sheets.map((s) => (
                    <tr key={s.name} className="border-t border-[hsl(215_28%_18%)]">
                      <td className="px-4 py-2 text-white font-semibold">{s.name}</td>
                      <td className="px-4 py-2 text-[hsl(215_20%_70%)]">{s.rows}</td>
                      <td className="px-4 py-2 text-[hsl(215_20%_70%)]">{s.detected_type || "-"}</td>
                      <td className="px-4 py-2 text-[hsl(215_20%_70%)]">{s.detected_category || "-"}</td>
                      <td className="px-4 py-2 text-[hsl(0_72%_68%)]">{s.error || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-4 transition-all duration-300 hover:border-[hsl(142_72%_37%/0.3)]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)] inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[hsl(142_72%_60%)]" /> Import nomenclature
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="date"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            pattern="\d{4}-\d{2}-\d{2}"
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          />
          <input
            value={sheetNames}
            onChange={(e) => setSheetNames(e.target.value)}
            placeholder="sheet_names optionnel (ex: Nomenclature,Retraits)"
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-[hsl(215_20%_66%)]">
          <input
            type="checkbox"
            checked={replaceVersion}
            onChange={(e) => setReplaceVersion(e.target.checked)}
          />
          Remplacer version existante
        </label>

        <p className="text-xs text-[hsl(215_20%_55%)]">Format version requis: YYYY-MM-DD</p>

        {(busy === "import" || importStage === "done") && (
          <div className="rounded-xl border border-[hsl(142_72%_37%/0.28)] bg-[hsl(142_72%_37%/0.08)] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[hsl(142_72%_70%)]">
                {importStage === "upload" && "Upload en cours..."}
                {importStage === "processing" && "Traitement serveur..."}
                {importStage === "done" && "Import terminé"}
              </span>
              <span className="text-white font-semibold">{importProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[hsl(215_28%_16%)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 animate-pulse"
                style={{
                  width: `${importProgress}%`,
                  background: "linear-gradient(90deg, hsl(142 72% 54%), hsl(210 80% 60%))",
                }}
              />
            </div>
          </div>
        )}

        <button
          onClick={runImport}
          disabled={!canRun || busy !== "none"}
          className="px-3 py-2 rounded-xl border border-[hsl(142_72%_37%/0.35)] text-[hsl(142_72%_60%)] text-sm disabled:opacity-50"
        >
          {busy === "import" ? "Import en cours..." : "Lancer import"}
        </button>

        {importResult && (
          <div className="rounded-xl border border-[hsl(142_72%_37%/0.35)] bg-[hsl(142_72%_37%/0.08)] p-4 text-sm">
            <div className="text-white font-semibold mb-2">Import terminé: {importResult.version_nomenclature}</div>
            <div className="text-[hsl(142_72%_70%)]">Inserted: {importResult.total_rows_inserted} · Updated: {importResult.total_rows_updated}</div>
            <div className="text-[hsl(215_20%_66%)] mt-1">Sheets: {importResult.available_sheets.join(", ")}</div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-3 transition-all duration-300 hover:border-[hsl(38_90%_45%/0.30)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)] inline-flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[hsl(38_90%_62%)]" /> Doublons
          </h2>
          <input
            value={dupVersion}
            onChange={(e) => setDupVersion(e.target.value)}
            placeholder="version optionnelle"
            className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
          />
          <button
            onClick={runDuplicates}
            disabled={busy !== "none"}
            className="px-3 py-2 rounded-xl border border-[hsl(38_90%_45%/0.35)] text-[hsl(38_90%_68%)] text-sm disabled:opacity-50"
          >
            {busy === "dups" ? "Analyse..." : "Analyser les doublons"}
          </button>

          {duplicates && (
            <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] p-3 text-sm">
              <div className="text-white mb-2">Total groupes: {duplicates.total_duplicates}</div>
              <div className="space-y-2 max-h-56 overflow-auto pr-1">
                {duplicates.duplicates.map((d, idx) => (
                  <div key={`${d.code}-${idx}`} className="rounded-lg border border-[hsl(215_28%_18%)] px-3 py-2">
                    <div className="text-[hsl(215_20%_75%)] font-semibold">{d.code}</div>
                    <div className="text-xs text-[hsl(215_20%_58%)]">{d.version} · {d.categorie} · count={d.count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-3 transition-all duration-300 hover:border-[hsl(0_72%_45%/0.30)]">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[hsl(215_20%_58%)] inline-flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[hsl(0_72%_66%)]" /> Clean duplicates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={cleanVersion}
              onChange={(e) => setCleanVersion(e.target.value)}
              placeholder="version optionnelle"
              className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
            />
            <select
              value={keepStrategy}
              onChange={(e) => setKeepStrategy(e.target.value as "latest" | "first")}
              className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
            >
              <option value="latest">latest</option>
              <option value="first">first</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-[hsl(215_20%_66%)]">
            <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
            dry_run (recommandé avant exécution réelle)
          </label>

          <button
            onClick={runClean}
            disabled={busy !== "none"}
            className="px-3 py-2 rounded-xl border border-[hsl(0_72%_45%/0.35)] text-[hsl(0_72%_66%)] text-sm disabled:opacity-50"
          >
            {busy === "clean" ? "Traitement..." : dryRun ? "Simuler nettoyage" : "Nettoyer maintenant"}
          </button>

          {cleanResult && (
            <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] p-3 text-sm">
              <div className="text-white mb-1">dry_run: {String(cleanResult.dry_run)}</div>
              <div className="text-[hsl(215_20%_68%)]">groups: {cleanResult.total_groups} · deleted: {cleanResult.total_entries_deleted}</div>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}
