import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, AdminEmailDebugResponse, AdminEmailStatus } from "@/lib/api";
import { toast } from "sonner";
import { Bug, Mail, Send, ShieldCheck } from "lucide-react";

export default function AdminEmail() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<AdminEmailStatus | null>(null);
  const [debug, setDebug] = useState<AdminEmailDebugResponse | null>(null);
  const [toTest, setToTest] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("<p>Bonjour,</p><p>Email envoyé depuis l'administration NPP.</p>");
  const [busy, setBusy] = useState<"none" | "debug" | "test" | "send">("none");

  const loadStatus = async () => {
    setLoading(true);
    try {
      const s = await adminApi.emailStatus();
      setStatus(s);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Impossible de charger le statut email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const runDebug = async () => {
    setBusy("debug");
    try {
      const d = await adminApi.emailDebug();
      setDebug(d);
      toast.success("Diagnostic récupéré");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Diagnostic impossible");
    } finally {
      setBusy("none");
    }
  };

  const sendTest = async () => {
    if (!toTest.trim()) {
      toast.error("Renseignez un email de test");
      return;
    }
    setBusy("test");
    try {
      const res = await adminApi.emailTest(toTest.trim());
      if (res.success) toast.success(res.message || "Email de test envoyé");
      else toast.error(res.message || "Échec envoi test");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Échec envoi test");
    } finally {
      setBusy("none");
    }
  };

  const sendCustom = async () => {
    if (!toEmail.trim() || !subject.trim() || !bodyHtml.trim()) {
      toast.error("to_email, subject et body_html sont requis");
      return;
    }
    setBusy("send");
    try {
      const res = await adminApi.emailSend(toEmail.trim(), subject.trim(), bodyHtml);
      if (res.success) toast.success(`Email envoyé à ${res.to}`);
      else toast.error("Échec envoi email");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Échec envoi email");
    } finally {
      setBusy("none");
    }
  };

  return (
    <AdminLayout
      title="Administration Email"
      subtitle="Monitoring, diagnostic et envoi de messages depuis le back-office"
    >
      {loading ? (
        <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-6">
          <div className="w-8 h-8 rounded-full border-2 border-[hsl(210_80%_55%)] border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5">
            <h2 className="text-sm font-bold text-white mb-4 inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[hsl(210_80%_62%)]" /> État service email</h2>
            {status && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 text-sm">
                <Row label="Enabled" value={status.enabled ? "true" : "false"} />
                <Row label="Configured" value={status.configured ? "true" : "false"} />
                <Row label="Provider" value={status.provider || "N/A"} />
                <Row label="Mail from" value={status.mail_from || "N/A"} />
                <Row label="Mail from name" value={status.mail_from_name || "N/A"} />
                <Row label="Admin email" value={status.admin_notification_email || "N/A"} />
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-3">
              <h3 className="text-sm font-bold text-white inline-flex items-center gap-2"><Bug className="w-4 h-4 text-[hsl(38_90%_58%)]" /> Diagnostic</h3>
              <button
                onClick={runDebug}
                disabled={busy !== "none"}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(38_90%_40%/0.35)] text-[hsl(38_90%_62%)] disabled:opacity-50"
              >
                <Bug className="w-4 h-4" />
                {busy === "debug" ? "Diagnostic..." : "Lancer diagnostic"}
              </button>

              {debug && (
                <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] p-3 text-xs space-y-1.5">
                  <DebugRow label="token_acquired" value={String(debug.token_acquired)} />
                  <DebugRow label="mail_send_granted" value={String(debug.mail_send_granted)} />
                  <DebugRow label="token_audience" value={debug.token_audience || "—"} />
                  <DebugRow label="mailbox_check" value={debug.mailbox_check || "—"} />
                  <div className="pt-2">
                    <div className="text-[hsl(215_20%_58%)] uppercase tracking-wider mb-1">diagnosis</div>
                    <ul className="space-y-1 text-[hsl(215_20%_72%)]">
                      {(debug.diagnosis || []).map((d, i) => <li key={i}>• {d}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-3">
              <h3 className="text-sm font-bold text-white inline-flex items-center gap-2"><Mail className="w-4 h-4 text-[hsl(210_80%_62%)]" /> Email de test</h3>
              <input
                value={toTest}
                onChange={(e) => setToTest(e.target.value)}
                placeholder="contact@domaine.dz"
                className="w-full rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
              />
              <button
                onClick={sendTest}
                disabled={busy !== "none"}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(210_80%_50%/0.35)] text-[hsl(210_80%_65%)] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {busy === "test" ? "Envoi..." : "Envoyer test"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-5 space-y-3">
            <h3 className="text-sm font-bold text-white">Email personnalisé</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="to_email"
                className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
              />
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="subject"
                className="rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white"
              />
            </div>
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-[hsl(215_28%_22%)] bg-[hsl(215_28%_12%)] px-3 py-2 text-sm text-white font-mono"
            />
            <button
              onClick={sendCustom}
              disabled={busy !== "none"}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[hsl(142_72%_37%/0.35)] text-[hsl(142_72%_60%)] disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {busy === "send" ? "Envoi..." : "Envoyer email"}
            </button>
          </section>
        </>
      )}
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[hsl(215_28%_20%)] bg-[hsl(215_28%_12%)] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-[hsl(215_20%_50%)] mb-1">{label}</div>
      <div className="text-[hsl(215_20%_78%)] break-all">{value}</div>
    </div>
  );
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-2">
      <span className="text-[hsl(215_20%_56%)]">{label}</span>
      <span className="text-[hsl(215_20%_78%)] break-all">{value}</span>
    </div>
  );
}
