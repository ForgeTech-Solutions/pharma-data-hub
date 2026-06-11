const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const BASE_URL = API_BASE_URL.replace(/\/+$/, "");

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
    localStorage.removeItem("npp_role");
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
  localStorage.removeItem("npp_role");
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

  if (!(options.body instanceof URLSearchParams) && !(options.body instanceof FormData)) {
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
      if (typeof err?.detail === "string") {
        detail = err.detail;
      } else if (typeof err?.detail?.message === "string") {
        detail = err.detail.message;
      } else if (typeof err?.message === "string") {
        detail = err.message;
      }
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

  listApiKeys: () => apiFetch<UserApiKeysResponse>("/auth/me/api-keys"),

  createApiKey: (name: string) =>
    apiFetch<CreateApiKeyResponse>(`/auth/me/api-keys?name=${encodeURIComponent(name)}`, {
      method: "POST",
    }),

  deleteApiKey: (id: number) =>
    apiFetch<{ message: string; id: number }>(`/auth/me/api-keys/${id}`, {
      method: "DELETE",
    }),

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

export interface UserApiKey {
  id: number;
  name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  last_used_ip: string | null;
  requests_count: number;
}

export interface UserApiKeysResponse {
  api_keys: UserApiKey[];
  total: number;
  max_keys: number;
  remaining_slots: number;
}

export interface CreateApiKeyResponse {
  message: string;
  api_key: string;
  id: number;
  name: string;
  key_prefix: string;
  pack: string;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  approved: number;
  pending_approval: number;
  active: number;
  inactive: number;
  by_pack: Record<string, number>;
}

export interface AdminEmailStatus {
  enabled: boolean;
  configured: boolean;
  provider: string;
  mail_from: string;
  mail_from_name: string;
  admin_notification_email: string;
  tenant_id_set: boolean;
  client_id_set: boolean;
  client_secret_set: boolean;
  templates: string[];
}

export interface AdminOverviewServer {
  status: "online" | "degraded" | "offline" | string;
  runtime: string;
  last_downtime: string | null;
  version?: string;
  uptime_seconds?: number;
  uptime_percent?: number;
  db_latency_ms?: number;
  total_medicaments?: number;
  total_laboratoires?: number;
  derniere_mise_a_jour?: string;
  derniere_mise_a_jour_date?: string;
  deployed_since?: string;
}

export interface AdminOverviewMetrics {
  api_calls: number;
  active_users: number;
  new_users: number;
  trend_percent?: {
    api_calls?: number;
    active_users?: number;
    new_users?: number;
  };
}

export interface AdminOverviewActivity {
  labels: string[];
  values: number[];
}

export interface AdminOverviewIncident {
  id: number;
  title: string;
  message: string;
  reporter: string;
  severity: "low" | "medium" | "high";
}

export interface AdminOverview {
  server: AdminOverviewServer;
  metrics: AdminOverviewMetrics;
  activity: AdminOverviewActivity;
  incidents: AdminOverviewIncident[];
  updated_at?: string;
}

export interface ImportSheetPreview {
  name: string;
  rows: number;
  detected_type?: string;
  detected_category?: string;
  columns?: string[];
  error?: string | null;
}

export interface ImportPreviewResponse {
  filename: string;
  sheets: ImportSheetPreview[];
}

export interface ImportSheetProcessed {
  rows_inserted: number;
  rows_updated: number;
  rows_ignored: number;
  category?: string;
  errors?: string[];
}

export interface ImportNomenclatureResponse {
  version_nomenclature: string;
  source_fichier: string;
  sheets_processed: Record<string, ImportSheetProcessed>;
  total_rows_inserted: number;
  total_rows_updated: number;
  available_sheets: string[];
}

export interface DuplicateItem {
  code: string;
  version: string;
  categorie: string;
  count: number;
}

export interface ImportDuplicatesResponse {
  total_duplicates: number;
  duplicates: DuplicateItem[];
}

export interface CleanDuplicateDetail {
  code: string;
  version: string;
  categorie: string;
  kept: number;
  deleted: number;
}

export interface ImportCleanDuplicatesResponse {
  dry_run: boolean;
  total_groups: number;
  total_entries_deleted: number;
  details: CleanDuplicateDetail[];
}

export interface AdminPack {
  slug: string;
  name: string;
  target: string;
  description?: string;
  features?: string[];
  limitations?: string[];
  rate_limit_day?: number;
  rate_limit_month?: number;
  requires_approval?: boolean;
}

export interface AdminPacksResponse {
  packs: AdminPack[];
  total: number;
}

export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: "ADMIN" | "LECTEUR" | string;
  pack: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  organisation?: string;
  phone?: string;
}

export interface AdminUsersResponse {
  items: AdminUser[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  pending_approval: number;
}

export interface AdminPendingUsersResponse {
  pending: AdminUser[];
  total: number;
}

export interface ApproveUserResponse {
  message: string;
  user_id: number;
  email: string;
  full_name: string;
  pack: string;
  generated_password?: string;
  email_sent?: boolean;
  note?: string;
}

export interface AdminApiKey {
  id: number;
  user_id: number;
  user_email?: string;
  user_pack?: string;
  name: string;
  key_prefix: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  last_used_ip: string | null;
  requests_count: number;
}

export interface AdminApiKeysResponse {
  api_keys: AdminApiKey[];
  total: number;
  page: number;
  page_size: number;
}

export interface AdminUserApiKeysResponse {
  user_id: number;
  user_email: string;
  user_pack: string;
  api_keys: AdminApiKey[];
  total: number;
}

export interface AdminEmailDebugResponse {
  mail_from: string;
  tenant_id: string;
  client_id: string;
  token_acquired: boolean;
  token_error: string | null;
  token_roles: string[];
  token_audience: string;
  token_issuer: string;
  mail_send_granted: boolean;
  mailbox_check: string;
  diagnosis: string[];
}

export interface AdminEmailTestResponse {
  message: string;
  success: boolean;
  hint?: string;
}

export interface AdminEmailSendResponse {
  success: boolean;
  to: string;
  subject: string;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const adminApi = {
  stats: () => apiFetch<AdminStats>("/admin/stats"),
  emailStatus: () => apiFetch<AdminEmailStatus>("/admin/email/status"),
  overview: (period: "week" | "month" = "week") =>
    apiFetch<AdminOverview>(`/admin/dashboard/overview${buildQuery({ period })}`),

  packs: () => apiFetch<AdminPacksResponse>("/admin/packs"),

  packDetail: (packSlug: string) =>
    apiFetch<AdminPack>(`/admin/packs/${encodeURIComponent(packSlug)}`),

  users: (params?: {
    page?: number;
    page_size?: number;
    pack?: string;
    is_approved?: boolean;
    is_active?: boolean;
  }) =>
    apiFetch<AdminUsersResponse>(`/admin/users${buildQuery(params || {})}`),

  pendingUsers: () => apiFetch<AdminPendingUsersResponse>("/admin/users/pending"),

  userDetail: (userId: number) => apiFetch<AdminUser>(`/admin/users/${userId}`),

  createUser: (body: {
    email: string;
    password: string;
    full_name: string;
    role?: string;
    pack?: string;
    organisation?: string;
    phone?: string;
  }) =>
    apiFetch<AdminUser>("/admin/users", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateUser: (
    userId: number,
    body: Partial<{
      full_name: string;
      role: string;
      pack: string;
      is_active: boolean;
      is_approved: boolean;
      organisation: string;
      phone: string;
    }>
  ) =>
    apiFetch<AdminUser>(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  approveUser: (userId: number, body?: { pack?: string; password?: string }) =>
    apiFetch<ApproveUserResponse>(`/admin/users/${userId}/approve`, {
      method: "POST",
      body: JSON.stringify(body || {}),
    }),

  changeUserPack: (userId: number, pack: string) =>
    apiFetch<AdminUser>(`/admin/users/${userId}/pack${buildQuery({ pack })}`, {
      method: "POST",
    }),

  deactivateUser: (userId: number) =>
    apiFetch<{ message: string; user_id: number }>(`/admin/users/${userId}`, {
      method: "DELETE",
    }),

  resetUserPassword: (userId: number, newPassword?: string) =>
    apiFetch<{
      message: string;
      user_id: number;
      email: string;
      generated_password?: string;
      email_sent?: boolean;
    }>(`/admin/users/${userId}/reset-password${buildQuery({ new_password: newPassword })}`, {
      method: "POST",
    }),

  apiKeys: (params?: {
    page?: number;
    page_size?: number;
    user_id?: number;
    is_active?: boolean;
  }) =>
    apiFetch<AdminApiKeysResponse>(`/admin/api-keys${buildQuery(params || {})}`),

  apiKeyDetail: (keyId: number) =>
    apiFetch<AdminApiKey>(`/admin/api-keys/${keyId}`),

  setApiKeyStatus: (keyId: number, isActive: boolean) =>
    apiFetch<{ message: string; id: number; is_active: boolean }>(
      `/admin/api-keys/${keyId}${buildQuery({ is_active: isActive })}`,
      { method: "PATCH" }
    ),

  deleteApiKeyAdmin: (keyId: number) =>
    apiFetch<{ message: string; id: number }>(`/admin/api-keys/${keyId}`, {
      method: "DELETE",
    }),

  userApiKeys: (userId: number) =>
    apiFetch<AdminUserApiKeysResponse>(`/admin/users/${userId}/api-keys`),

  emailDebug: () => apiFetch<AdminEmailDebugResponse>("/admin/email/debug"),

  emailTest: (toEmail: string) =>
    apiFetch<AdminEmailTestResponse>(`/admin/email/test${buildQuery({ to_email: toEmail })}`, {
      method: "POST",
    }),

  emailSend: (toEmail: string, subject: string, bodyHtml: string) =>
    apiFetch<AdminEmailSendResponse>(
      `/admin/email/send${buildQuery({ to_email: toEmail, subject, body_html: bodyHtml })}`,
      { method: "POST" }
    ),

  importSheetsPreview: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiFetch<ImportPreviewResponse>("/import/sheets/preview", {
      method: "POST",
      body,
    });
  },

  importNomenclature: (params: {
    file: File;
    version: string;
    sheet_names?: string;
    remplacer_version?: boolean;
  }) => {
    const body = new FormData();
    body.append("file", params.file);
    body.append("version", params.version);
    if (params.sheet_names) body.append("sheet_names", params.sheet_names);
    if (typeof params.remplacer_version === "boolean") {
      body.append("remplacer_version", String(params.remplacer_version));
    }
    return apiFetch<ImportNomenclatureResponse>("/import/nomenclature", {
      method: "POST",
      body,
    });
  },

  importDuplicates: (version?: string) =>
    apiFetch<ImportDuplicatesResponse>(`/import/duplicates${buildQuery({ version })}`),

  importCleanDuplicates: (params?: {
    version?: string;
    keep_strategy?: "latest" | "first";
    dry_run?: boolean;
  }) =>
    apiFetch<ImportCleanDuplicatesResponse>(
      `/import/clean-duplicates${buildQuery({
        version: params?.version,
        keep_strategy: params?.keep_strategy,
        dry_run: params?.dry_run,
      })}`,
      { method: "POST" }
    ),
};

// ─── Health endpoint ─────────────────────────────────────────────────────────

export interface HealthData {
  status: "ok" | "degraded" | "down";
  version: string;
  uptime: string;
  uptime_seconds: number;
  uptime_percent: number;
  deployed_since: string;
  db_latency_ms: number;
  total_medicaments: number;
  total_laboratoires: number;
  derniere_mise_a_jour: string;
  derniere_mise_a_jour_date: string;
}

export async function fetchHealth(): Promise<HealthData> {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error("health check failed");
  return res.json() as Promise<HealthData>;
}

export const PACK_COLORS: Record<string, { color: string; bg: string; border: string; label: string }> = {
  FREE:           { color: "hsl(215 28% 55%)",  bg: "hsl(215 28% 55% / 0.12)",  border: "hsl(215 28% 55% / 0.3)",  label: "Pack Gratuit" },
  PRO:            { color: "hsl(210 80% 50%)",  bg: "hsl(210 80% 50% / 0.12)",  border: "hsl(210 80% 50% / 0.3)",  label: "Pack Pro" },
  INSTITUTIONNEL: { color: "hsl(142 72% 37%)",  bg: "hsl(142 72% 37% / 0.12)",  border: "hsl(142 72% 37% / 0.35)", label: "Institutionnel" },
  DEVELOPPEUR:    { color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.12)",  border: "hsl(262 72% 55% / 0.3)",  label: "Développeur" },
  DÉVELOPPEUR:    { color: "hsl(262 72% 55%)",  bg: "hsl(262 72% 55% / 0.12)",  border: "hsl(262 72% 55% / 0.3)",  label: "Développeur" },
};
