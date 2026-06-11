import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Users, BarChart3, KeyRound, Mail, LogOut, Layers, FileUp } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  headerMeta?: string;
  children: ReactNode;
};

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: "/admin", icon: BarChart3 },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
  { label: "Packs", href: "/admin/packs", icon: Layers },
  { label: "Clés API", href: "/admin/api-keys", icon: KeyRound },
  { label: "Email", href: "/admin/email", icon: Mail },
  { label: "Import", href: "/admin/import", icon: FileUp },
];

export default function AdminLayout({ title, subtitle, headerMeta, children }: Props) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(155deg, hsl(215 28% 7%) 0%, hsl(215 28% 10%) 55%, hsl(210 42% 12%) 100%)" }}>
      <header className="sticky top-0 z-40 border-b border-[hsl(215_28%_18%)] bg-[hsl(215_28%_9%/0.95)] backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-[hsl(210_80%_50%/0.35)] bg-[hsl(210_80%_50%/0.12)]">
              <Shield className="w-4 h-4 text-[hsl(210_80%_60%)]" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[hsl(215_20%_55%)]">Administration</div>
              <div className="text-sm font-bold text-white">NPP Control Center</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {headerMeta && (
              <span className="hidden md:inline-flex text-[11px] px-2.5 py-1 rounded-lg border border-[hsl(210_80%_50%/0.35)] bg-[hsl(210_80%_50%/0.10)] text-[hsl(210_80%_68%)] font-semibold">
                {headerMeta}
              </span>
            )}
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs px-3 py-1.5 rounded-lg border border-[hsl(215_28%_22%)] text-[hsl(215_20%_68%)] hover:text-white hover:border-[hsl(215_28%_35%)] transition-all"
            >
              Espace user
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[hsl(0_72%_37%/0.35)] text-[hsl(0_72%_65%)] hover:bg-[hsl(0_72%_37%/0.12)] transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-5 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] p-3 h-fit">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? "bg-[hsl(210_80%_50%/0.16)] border border-[hsl(210_80%_50%/0.35)] text-[hsl(210_80%_65%)]"
                      : "text-[hsl(215_20%_68%)] hover:text-white hover:bg-[hsl(215_28%_14%)]"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="space-y-5">
          <div className="rounded-2xl border border-[hsl(215_28%_18%)] bg-[hsl(215_28%_10%)] px-5 py-4">
            <h1 className="text-xl md:text-2xl font-extrabold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-[hsl(215_20%_62%)] mt-1">{subtitle}</p>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
