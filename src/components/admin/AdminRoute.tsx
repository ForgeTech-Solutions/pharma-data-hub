import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authApi, UserProfile } from "@/lib/api";

type Props = {
  children: ReactNode;
};

export default function AdminRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<UserProfile | null>(null);
  const token = localStorage.getItem("npp_token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .me()
      .then((profile) => {
        setMe(profile);
        localStorage.setItem("npp_role", profile.role || "");
      })
      .catch(() => {
        setMe(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[hsl(var(--primary))] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  const canAccessAdmin =
    me?.role === "ADMIN" && me?.is_active === true && me?.is_approved === true;

  if (!canAccessAdmin) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
