import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PACK_COLORS } from "@/lib/api";
import logo from "@/assets/logo_npp.png";
import {
  LayoutDashboard, BarChart3, Package, User, KeyRound,
  Trash2, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Vue d'ensemble",     href: "/dashboard",          icon: LayoutDashboard },
  { label: "Mes statistiques",   href: "/dashboard/stats",    icon: BarChart3 },
  { label: "Mon pack",           href: "/dashboard/pack",     icon: Package },
  { label: "Mes tokens",         href: "/dashboard/tokens",   icon: KeyRound },
  { label: "Mon profil",         href: "/dashboard/profile",  icon: User },
  { label: "Changer le MDP",     href: "/dashboard/password", icon: KeyRound },
  { label: "Supprimer le compte",href: "/dashboard/delete",   icon: Trash2, danger: true },
];

interface Props {
  children: React.ReactNode;
  user?: { full_name?: string; pack?: string } | null;
}

export default function DashboardLayout({ children, user }: Props) {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const packKey = user?.pack || "";
  const packMeta = PACK_COLORS[packKey] || PACK_COLORS["FREE"];

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--code-border))] bg-[hsl(215_28%_9%/0.95)] backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-[hsl(215_20%_65%)] hover:text-white transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/" className="flex items-center gap-2">
              <img src={logo} alt="NPP" className="h-8 w-auto" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-[hsl(215_20%_65%)]">
                  {user.full_name?.split(" ")[0]}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                  style={{ background: packMeta.bg, color: packMeta.color, border: `1px solid ${packMeta.border}` }}
                >
                  {packKey}
                </span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-[hsl(215_20%_65%)] hover:text-[hsl(0_72%_60%)] transition-colors px-2 py-1.5 rounded-lg hover:bg-[hsl(0_72%_37%/0.12)] border border-transparent hover:border-[hsl(0_72%_37%/0.3)]"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full px-4 py-6 gap-6">
        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "flex" : "hidden"} md:flex
            flex-col gap-1 w-56 shrink-0
            fixed md:static top-14 left-0 bottom-0 z-30
            bg-[hsl(215_28%_9%)] md:bg-transparent
            border-r border-[hsl(var(--code-border))] md:border-none
            p-4 md:p-0
          `}
        >
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.href;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] border border-[hsl(var(--primary)/0.3)]"
                    : item.danger
                    ? "text-[hsl(215_20%_55%)] hover:text-[hsl(0_72%_60%)] hover:bg-[hsl(0_72%_37%/0.08)]"
                    : "text-[hsl(215_20%_65%)] hover:text-white hover:bg-[hsl(215_28%_16%)]"
                  }
                `}
              >
                <item.icon size={15} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={12} className="opacity-60" />}
              </NavLink>
            );
          })}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
