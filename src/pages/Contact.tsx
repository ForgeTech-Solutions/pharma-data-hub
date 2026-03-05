import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, Building2, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email API",
    value: "api@msprh.dz",
    href: "mailto:api@msprh.dz",
    accentColor: "hsl(142 72% 37%)",
    accentLight: "hsl(142 72% 55%)",
    bg: "hsl(142 72% 37% / 0.08)",
    border: "hsl(142 72% 37% / 0.22)",
  },
  {
    icon: Building2,
    label: "Adresse",
    value: "7, rue des Frères Bouadou, Birtouta, Alger",
    href: undefined,
    accentColor: "hsl(210 80% 50%)",
    accentLight: "hsl(210 80% 65%)",
    bg: "hsl(210 80% 50% / 0.08)",
    border: "hsl(210 80% 50% / 0.22)",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+213 (0)23 18 17 00",
    href: "tel:+21323181700",
    accentColor: "hsl(262 72% 45%)",
    accentLight: "hsl(262 72% 65%)",
    bg: "hsl(262 72% 45% / 0.08)",
    border: "hsl(262 72% 45% / 0.22)",
  },
  {
    icon: Clock,
    label: "Horaires de support",
    value: "Dim – Jeu · 08h00 – 16h30",
    href: undefined,
    accentColor: "hsl(38 90% 38%)",
    accentLight: "hsl(38 90% 55%)",
    bg: "hsl(38 90% 38% / 0.08)",
    border: "hsl(38 90% 38% / 0.22)",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", org: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-5"
            style={{ background: "hsl(142 72% 50%)" }} />
          <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{ background: "hsl(210 80% 50%)" }} />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200"
            style={{ color: "hsl(215 20% 50%)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(0 0% 90%)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "hsl(215 20% 50%)")}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "hsl(142 72% 37% / 0.12)", border: "1px solid hsl(142 72% 37% / 0.3)" }}>
              <MessageSquare className="w-6 h-6" style={{ color: "hsl(142 72% 55%)" }} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(142 72% 50%)" }}>
                Contact
              </p>
              <h1 className="text-3xl font-black text-white">Nous contacter</h1>
            </div>
          </div>
          <p className="text-base leading-relaxed max-w-2xl" style={{ color: "hsl(215 20% 55%)" }}>
            Une question sur l'API, une demande de partenariat ou un problème technique ? Notre équipe vous répondra sous 48h ouvrées.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Info cards — left */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {CONTACT_ITEMS.map((item) => (
              <div key={item.label} className="rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 group"
                style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.accentLight }} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: item.accentLight }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-white hover:underline underline-offset-2 transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: "hsl(215 20% 70%)" }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form — right */}
          <div className="lg:col-span-3 rounded-2xl p-8"
            style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "hsl(142 72% 37% / 0.12)", border: "2px solid hsl(142 72% 37% / 0.4)" }}>
                  <Send className="w-7 h-7" style={{ color: "hsl(142 72% 55%)" }} />
                </div>
                <h2 className="text-xl font-black text-white">Message envoyé !</h2>
                <p className="text-sm max-w-xs" style={{ color: "hsl(215 20% 55%)" }}>
                  Notre équipe vous répondra à <strong className="text-white">{form.email}</strong> dans les 48h ouvrées.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", org: "", subject: "", message: "" }); }}
                  className="mt-2 text-sm px-5 py-2 rounded-xl border transition-all duration-200"
                  style={{ borderColor: "hsl(215 28% 22%)", color: "hsl(215 20% 60%)" }}
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-black text-white mb-6">Envoyer un message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Nom complet" required>
                    <Input placeholder="Dr. Karim Benali" value={form.name}
                      onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
                  </Field>
                  <Field label="Email" required>
                    <Input type="email" placeholder="karim@chu-mustapha.dz" value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
                  </Field>
                </div>

                <Field label="Organisation">
                  <Input placeholder="CHU Mustapha Pacha, Alger" value={form.org}
                    onChange={(v) => setForm((f) => ({ ...f, org: v }))} />
                </Field>

                <Field label="Sujet" required>
                  <Input placeholder="Question sur l'API, demande d'accès…" value={form.subject}
                    onChange={(v) => setForm((f) => ({ ...f, subject: v }))} />
                </Field>

                <Field label="Message" required>
                  <textarea
                    rows={5}
                    placeholder="Décrivez votre demande, votre cas d'usage ou votre problème…"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                    className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200 resize-none"
                    style={{
                      background: "hsl(215 28% 12%)",
                      border: "1px solid hsl(215 28% 20%)",
                      color: "hsl(215 20% 75%)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(142 72% 37% / 0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(215 28% 20%)")}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all duration-200"
                  style={{
                    background: loading ? "hsl(215 28% 16%)" : "linear-gradient(135deg, hsl(142 72% 30%), hsl(162 72% 35%))",
                    color: loading ? "hsl(215 20% 45%)" : "white",
                    border: "1px solid hsl(142 72% 37% / 0.4)",
                    boxShadow: loading ? "none" : "0 0 20px hsl(142 72% 37% / 0.2)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(215 20% 40%)", borderTopColor: "transparent" }} />
                      Envoi en cours…
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(215 20% 55%)" }}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ type = "text", placeholder, value, onChange, ...props }: {
  type?: string; placeholder?: string; value: string; onChange: (v: string) => void; [key: string]: unknown;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={props.required as boolean}
      className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200"
      style={{
        background: "hsl(215 28% 12%)",
        border: "1px solid hsl(215 28% 20%)",
        color: "hsl(215 20% 75%)",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(142 72% 37% / 0.6)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(215 28% 20%)")}
    />
  );
}
