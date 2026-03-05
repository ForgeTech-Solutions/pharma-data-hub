export const BASE_URL = "https://nnp.forge-solutions.tech/v1";

// ─── JWT helpers ────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub?: string;
  email?: string;
  pack?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns seconds until expiry (negative = already expired) */
export function tokenSecondsLeft(token: string): number {
  const payload = decodeJwt(token);
  if (!payload?.exp) return -1;
  return payload.exp - Math.floor(Date.now() / 1000);
}

// ─── Auto-refresh interceptor ────────────────────────────────────────────────
// Schedules a redirect-to-login 5 min before JWT expiry (token lasts 30 min).

let _refreshTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleTokenRefresh(token: string) {
  if (_refreshTimer) clearTimeout(_refreshTimer);
  const secsLeft = tokenSecondsLeft(token);
  if (secsLeft <= 0) return; // already expired
  const fireIn = Math.max(0, (secsLeft - 5 * 60) * 1000); // 5 min before expiry
  _refreshTimer = setTimeout(() => {
    // Redirect to login with ?expired=1 so the user gets a clear message
    localStorage.removeItem("npp_token");
    localStorage.removeItem("npp_pack");
    localStorage.removeItem("npp_approved");
    window.location.href = "/login?expired=1";
  }, fireIn);
}

export function cancelTokenRefresh() {
  if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null; }
}

// ─── Core fetch ──────────────────────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem("npp_token");
}

function handleUnauthorized() {
  cancelTokenRefresh();
  localStorage.removeItem("npp_token");
  localStorage.removeItem("npp_pack");
  localStorage.removeItem("npp_approved");
  window.location.href = "/login";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  // Proactively check expiry before the request
  if (token && tokenSecondsLeft(token) <= 0) {
    handleUnauthorized();
    throw new Error("Token expired");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof URLSearchParams)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    handleUnauthorized();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let detail = "Une erreur est survenue.";
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch {
      // ignore
    }
    throw new Error(detail);
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

// Auth endpoints
export const authApi = {
  signup: (body: {
    email: string;
    full_name: string;
    organisation: string;
    phone?: string;
    message?: string;
    pack: string;
  }) =>
    apiFetch<{ message: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    return apiFetch<{
      access_token: string;
      token_type: string;
      pack: string;
      is_approved: boolean;
    }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
  },

  me: () => apiFetch<UserProfile>("/auth/me"),

  updateMe: (body: Partial<{ full_name: string; phone: string; organisation: string }>) =>
    apiFetch<UserProfile>("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),

  changePassword: (current_password: string, new_password: string) =>
    apiFetch<{ message: string }>("/auth/me/password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),

  stats: () => apiFetch<UserStats>("/auth/me/stats"),

  pack: () => apiFetch<UserPackDetail>("/auth/me/pack"),

  deleteAccount: (password: string, confirm_email: string) =>
    apiFetch<{ message: string; email: string }>("/auth/me/delete", {
      method: "POST",
      body: JSON.stringify({ password, confirm_email }),
    }),
};

// Types
export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: string;
  pack: string;
  is_active: boolean;
  is_approved: boolean;
  organisation: string;
  phone?: string;
  signup_message?: string;
  created_at: string;
  updated_at: string;
  pack_detail?: {
    slug: string;
    name: string;
    target: string;
    description: string;
    features: string[];
    limitations: string[];
    rate_limit_day: number;
    rate_limit_month: number;
    requires_approval: boolean;
  };
  quota?: {
    requests_today: number;
    requests_month: number;
    limit_day: number;
    limit_month: number;
    remaining_today: number;
    remaining_month: number;
    reset_date: string;
  };
}

export interface UserStats {
  email: string;
  full_name: string;
  pack: string;
  pack_name: string;
  organisation: string;
  requests_today: number;
  requests_month: number;
  limit_day: number;
  limit_month: number;
  remaining_today: number;
  remaining_month: number;
  is_active: boolean;
  is_approved: boolean;
  account_created: string;
  account_age_days: number;
  available_features: string[];
}

export interface UserPackDetail {
  current_pack: string;
  detail: {
    slug: string;
    name: string;
    target: string;
    description: string;
    features: string[];
    limitations: string[];
    rate_limit_day: number;
    rate_limit_month: number;
    requires_approval: boolean;
  };
  all_packs: string[];
  upgrade_message?: string;
}

export const PACK_COLORS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  FREE:           { color: "hsl(215 28% 55%)",  bg: "hsl(215 28% 55% / 0.12)",  border: "hsl(215 28% 55% / 0.3)",  label: "Pack Gratuit" },
  PRO:            { color: "hsl(210 80% 50%)",  bg: "hsl(210 80% 50% / 0.12)",  border: "hsl(210 80% 50% / 0.3)",  label: "Pack Pro" },
  INSTITUTIONNEL: { color: "hsl(142 72% 37%)",  bg: "hsl(142 72% 37% / 0.12)",  border: "hsl(142 72% 37% / 0.35)", label: "Institutionnel" },
  DEVELOPPEUR:    { color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.12)",  border: "hsl(262 72% 55% / 0.3)",  label: "Développeur" },
  DÉVELOPPEUR:    { color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.12)",  border: "hsl(262 72% 55% / 0.3)",  label: "Développeur" },
};
