import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, Building2, MessageSquare, CheckCircle2, Timer, Users2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email API",
    value: "contact@nhaddag.net",
    href: "mailto:contact@nhaddag.net",
    accentColor: "hsl(142 72% 37%)",
    accentLight: "hsl(142 72% 55%)",
    bg: "hsl(142 72% 37% / 0.08)",
    border: "hsl(142 72% 37% / 0.22)",
    borderHover: "hsl(142 72% 37% / 0.45)",
  },
  {
    icon: Building2,
    label: "Adresse",
    value: "DNC PREMIÈRE TRANCHÉ DERGANA, BORDJ EL KIFFAN, ALGER",
    href: undefined,
    accentColor: "hsl(210 80% 50%)",
    accentLight: "hsl(210 80% 65%)",
    bg: "hsl(210 80% 50% / 0.08)",
    border: "hsl(210 80% 50% / 0.22)",
    borderHover: "hsl(210 80% 50% / 0.45)",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "0557 23 11 87",
    href: "tel:+213557231187",
    accentColor: "hsl(262 72% 45%)",
    accentLight: "hsl(262 72% 65%)",
    bg: "hsl(262 72% 45% / 0.08)",
    border: "hsl(262 72% 45% / 0.22)",
    borderHover: "hsl(262 72% 45% / 0.45)",
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
    borderHover: "hsl(38 90% 38% / 0.45)",
  },
];

const STATS = [
  { icon: Timer, label: "Réponse sous", value: "48h", color: "hsl(142 72% 55%)" },
  { icon: Users2, label: "Équipe", value: "dédiée", color: "hsl(210 80% 65%)" },
  { icon: Zap, label: "Support", value: "technique", color: "hsl(262 72% 65%)" },
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
      <section className="pt-32 pb-14 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.06]"
            style={{ background: "hsl(142 72% 50%)" }} />
          <div className="absolute top-32 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-[0.05]"
            style={{ background: "hsl(210 80% 50%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(215 28% 18%), transparent)" }} />
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

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center"
                  style={{ background: "hsl(142 72% 37% / 0.12)", border: "1px solid hsl(142 72% 37% / 0.3)" }}>
                  <MessageSquare className="w-6 h-6" style={{ color: "hsl(142 72% 55%)" }} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "hsl(142 72% 50%)" }}>
                    Contact
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-black text-white">Nous contacter</h1>
                </div>
              </div>
              <p className="text-base leading-relaxed max-w-xl" style={{ color: "hsl(215 20% 55%)" }}>
                Une question sur l'API, une demande de partenariat ou un problème technique ?{" "}
                <span className="text-white font-semibold">Notre équipe vous répondra sous 48h ouvrées.</span>
              </p>
            </div>

            {/* Stat badges */}
            <div className="flex flex-wrap sm:flex-col gap-2">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                  style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  <span className="text-xs" style={{ color: "hsl(215 20% 55%)" }}>{s.label}{" "}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Info cards */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: "hsl(215 20% 38%)" }}>Coordonnées</p>
            {CONTACT_ITEMS.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-4 flex items-start gap-4 transition-all duration-300 group"
                style={{ background: "hsl(215 28% 9%)", border: `1px solid ${item.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = item.borderHover)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = item.border)}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: item.bg }}>
                  <item.icon className="w-4 h-4" style={{ color: item.accentLight }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: item.accentLight }}>
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="text-sm font-medium text-white hover:underline underline-offset-2 transition-colors break-all">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: "hsl(215 20% 70%)" }}>{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="mt-3 rounded-xl overflow-hidden relative"
              style={{ border: "1px solid hsl(215 28% 14%)", height: 200 }}>
              <iframe
                title="Localisation ForgeTech Solutions"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.0!2d3.2022!3d36.7478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fae123456789%3A0x0!2sDergana%2C%20Bordj%20El%20Kiffan%2C%20Alger%2C%20Algeria!5e0!3m2!1sfr!2sdz!4v1700000000000!5m2!1sfr!2sdz&q=Dergana,+Bordj+El+Kiffan,+Alger,+Algeria"
                width="100%"
                height="200"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) saturate(0.5) brightness(0.85)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://maps.google.com/?q=Dergana,+Bordj+El+Kiffan,+Alger,+Algeria"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-200"
                style={{ background: "hsl(215 28% 10% / 0.9)", color: "hsl(142 72% 55%)", border: "1px solid hsl(215 28% 18%)", backdropFilter: "blur(4px)" }}
              >
                <MapPin className="w-3 h-3" />
                Ouvrir dans Maps
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden"
            style={{ background: "hsl(215 28% 9%)", border: "1px solid hsl(215 28% 14%)" }}>

            {/* Card header */}
            <div className="px-8 pt-7 pb-5" style={{ borderBottom: "1px solid hsl(215 28% 13%)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-white">Envoyer un message</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                  style={{ background: "hsl(142 72% 37% / 0.1)", color: "hsl(142 72% 55%)", border: "1px solid hsl(142 72% 37% / 0.2)" }}>
                  Réponse 48h
                </span>
              </div>
            </div>

            <div className="p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
                      style={{ background: "hsl(142 72% 37% / 0.08)", border: "2px solid hsl(142 72% 37% / 0.2)" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(142 72% 50%)" }} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white mb-2">Message envoyé !</h2>
                    <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "hsl(215 20% 55%)" }}>
                      Notre équipe vous répondra à{" "}
                      <span className="font-bold" style={{ color: "hsl(142 72% 55%)" }}>{form.email}</span>{" "}
                      dans les <span className="font-bold text-white">48h ouvrées</span>.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", org: "", subject: "", message: "" }); }}
                      className="text-sm px-6 py-2.5 rounded-xl border transition-all duration-200 hover:text-white"
                      style={{ borderColor: "hsl(215 28% 22%)", color: "hsl(215 20% 60%)" }}
                    >
                      Envoyer un autre message
                    </button>
                    <Link
                      to="/"
                      className="text-sm px-6 py-2.5 rounded-xl font-bold transition-all duration-200"
                      style={{ background: "hsl(142 72% 30% / 0.15)", color: "hsl(142 72% 55%)", border: "1px solid hsl(142 72% 37% / 0.3)" }}
                    >
                      Retour à l'accueil
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div className="relative">
                      <select
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        required
                        className="w-full text-sm rounded-xl px-4 py-3 outline-none transition-all duration-200 appearance-none pr-10"
                        style={{
                          background: "hsl(215 28% 12%)",
                          border: "1px solid hsl(215 28% 20%)",
                          color: form.subject ? "hsl(215 20% 75%)" : "hsl(215 20% 40%)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(142 72% 37% / 0.6)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(215 28% 20%)")}
                      >
                        <option value="" disabled style={{ background: "hsl(215 28% 12%)" }}>Sélectionner un sujet…</option>
                        <option value="Demande d'accès à l'API" style={{ background: "hsl(215 28% 12%)" }}>Demande d'accès à l'API</option>
                        <option value="Question technique" style={{ background: "hsl(215 28% 12%)" }}>Question technique</option>
                        <option value="Signalement d'incident" style={{ background: "hsl(215 28% 12%)" }}>Signalement d'incident</option>
                        <option value="Partenariat / Intégration" style={{ background: "hsl(215 28% 12%)" }}>Partenariat / Intégration</option>
                        <option value="Autre" style={{ background: "hsl(215 28% 12%)" }}>Autre</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "hsl(215 20% 45%)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                    </div>
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
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl transition-all duration-300"
                    style={{
                      background: loading ? "hsl(215 28% 13%)" : "linear-gradient(135deg, hsl(142 72% 30%), hsl(162 72% 35%))",
                      color: loading ? "hsl(215 20% 40%)" : "white",
                      border: loading ? "1px solid hsl(215 28% 18%)" : "1px solid hsl(142 72% 37% / 0.4)",
                      boxShadow: loading ? "none" : "0 0 24px hsl(142 72% 37% / 0.18)",
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: "hsl(215 20% 35%)", borderTopColor: "transparent" }} />
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
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "hsl(215 20% 50%)" }}>
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
