import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  const token = localStorage.getItem("npp_token");
  const pack = localStorage.getItem("npp_pack") || "";
  const isApproved = localStorage.getItem("npp_approved") === "true";
  const isAuthenticated = !!token;

  const logout = useCallback(() => {
    localStorage.removeItem("npp_token");
    localStorage.removeItem("npp_pack");
    localStorage.removeItem("npp_approved");
    navigate("/login");
  }, [navigate]);

  const saveSession = useCallback(
    (access_token: string, packName: string, approved: boolean) => {
      localStorage.setItem("npp_token", access_token);
      localStorage.setItem("npp_pack", packName);
      localStorage.setItem("npp_approved", String(approved));
    },
    []
  );

  return { token, pack, isApproved, isAuthenticated, logout, saveSession };
}
