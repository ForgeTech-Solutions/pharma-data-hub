
## Plan: Espace Client Complet (8 pages)

### Architecture

New files to create:
- `src/lib/api.ts` — centralized API client with BASE_URL, token management, 401 auto-logout
- `src/hooks/useAuth.ts` — auth state hook (token, user, pack, logout)
- `src/components/dashboard/DashboardLayout.tsx` — sidebar + header shared layout for all /dashboard/* pages
- `src/pages/Signup.tsx` — /signup
- `src/pages/Login.tsx` — /login
- `src/pages/Dashboard.tsx` — /dashboard (main)
- `src/pages/DashboardStats.tsx` — /dashboard/stats
- `src/pages/DashboardPack.tsx` — /dashboard/pack
- `src/pages/DashboardProfile.tsx` — /dashboard/profile
- `src/pages/DashboardPassword.tsx` — /dashboard/password
- `src/pages/DashboardDelete.tsx` — /dashboard/delete

Files to modify:
- `src/App.tsx` — add 8 new routes
- `src/components/Navbar.tsx` — add "Espace Client" link + logout button when logged in
- `src/components/AccessSection.tsx` — wire "Créer un compte" CTA to /signup

---

### Design System

Matching the existing dark theme (`gradient-hero`, `hsl(215 28% 9%)`, green primary):

```text
Pack colors:
  FREE          → hsl(215 28% 50%) gray-blue
  PRO           → hsl(210 80% 50%) blue
  INSTITUTIONNEL→ hsl(142 72% 37%) green (=primary)
  DEVELOPPEUR   → hsl(262 72% 55%) purple
```

Dashboard layout: dark sidebar on left (matching `gradient-hero`), main content area with card-based UI.

---

### Auth Logic

`src/lib/api.ts`:
- `BASE_URL = "https://nnp.forge-solutions.tech/v1"`
- All fetch calls inject `Authorization: Bearer <token>` from `localStorage["npp_token"]`
- On any 401 response → clear `npp_token` + redirect to `/login`

`src/hooks/useAuth.ts`:
- Reads `npp_token`, `npp_pack`, `npp_approved` from localStorage
- `logout()` clears all keys and redirects
- `isAuthenticated` boolean

Protected pages: custom `<ProtectedRoute>` wrapper that checks for token, redirects to `/login` if missing.

---

### Pages Detail

**`/signup`** — public, dark theme matching hero section:
- Form: email, full_name, organisation, phone (optional), message (optional), pack selector (4 radio cards)
- POST `/auth/signup` with JSON body
- Success banner (no redirect, stays on page)
- Error: show `detail` from API response

**`/login`** — public, centered card:
- Email + password form
- POST `/auth/login` with `application/x-www-form-urlencoded`
- Store `npp_token`, `npp_pack`, `npp_approved` in localStorage
- Redirect to `/dashboard`
- Error messages specific to 401 / 403 pending / 403 disabled

**`/dashboard`** — protected, via `DashboardLayout`:
- On mount: GET `/auth/me`
- Welcome banner with name + pack badge (color-coded)
- 3 cards: Profile info | Pack summary | Quota (FREE only, 2 progress bars)
- Sidebar nav to sub-pages

**`/dashboard/stats`** — GET `/auth/me/stats`:
- 4 stat cards (today, month, remaining today, remaining month)
- Account age badge
- Available features as colored tags

**`/dashboard/pack`** — GET `/auth/me/pack`:
- Current pack highlighted card
- Features checklist + limitations
- All packs comparison row
- Upgrade CTA banner if `upgrade_message` present

**`/dashboard/profile`** — pre-filled from GET `/auth/me`:
- Editable: full_name, phone, organisation
- PATCH `/auth/me`
- Sonner toast on success/error

**`/dashboard/password`** — POST `/auth/me/password`:
- current_password, new_password, confirm_new_password (client-side match check)
- Min 8 chars validation
- Sonner toast on success/error

**`/dashboard/delete`** — POST `/auth/me/delete`:
- Red danger banner
- password + confirm_email fields
- Confirmation modal before submit
- On success: clear localStorage → redirect `/login`

---

### Navbar Update

- When `npp_token` present: show "Mon Espace" link → `/dashboard` + "Déconnexion" button
- When no token: show existing "Demander l'accès" button
- Connects "Créer un compte" FREE pack CTA in `AccessSection` to `/signup`

---

### File Count
- 11 new files
- 3 modified files (App.tsx, Navbar.tsx, AccessSection.tsx)
