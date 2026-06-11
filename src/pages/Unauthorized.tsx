import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-[hsl(0_72%_50%/0.35)] bg-[hsl(215_28%_10%)] p-7 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "hsl(0 72% 37% / 0.12)", border: "1px solid hsl(0 72% 37% / 0.35)" }}>
          <ShieldAlert className="w-7 h-7 text-[hsl(0_72%_65%)]" />
        </div>
        <h1 className="text-xl font-extrabold text-white mb-2">Accès refusé</h1>
        <p className="text-sm text-[hsl(215_20%_62%)] mb-6">
          Votre compte ne dispose pas des permissions nécessaires pour accéder à l'espace administration.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-semibold border border-[hsl(215_28%_22%)] text-[hsl(215_20%_68%)] hover:text-white hover:border-[hsl(215_28%_34%)] transition-all"
          >
            Retour espace user
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all"
          >
            Se reconnecter
          </Link>
        </div>
      </div>
    </div>
  );
}
