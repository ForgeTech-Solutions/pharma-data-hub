# Guide Frontend - Endpoints Administration (NPP API)

Ce document explique comment intégrer tous les endpoints admin dans un frontend (React, Vue, Angular, mobile, etc.).

## 1. Prérequis d'authentification

Tous les endpoints admin nécessitent un token JWT d'un utilisateur avec role ADMIN.

### 1.1 Connexion admin

- Methode: POST
- URL: /auth/login
- Content-Type: application/x-www-form-urlencoded

Champs a envoyer:
- username: email admin
- password: mot de passe admin

Exemple de reponse:
{
  "access_token": "<JWT>",
  "token_type": "bearer",
  "pack": "DEVELOPPEUR",
  "is_approved": true
}

### 1.2 Header a envoyer ensuite

Authorization: Bearer <JWT>

### 1.3 Differencier user et admin (RBAC)

Regle metier:
- Un admin est un utilisateur avec role = ADMIN
- Un utilisateur normal a role = LECTEUR

Important:
- Ne te base pas seulement sur la reponse /auth/login
- Apres login, appelle toujours GET /auth/me pour recuperer le profil complet

Exemple de reponse /auth/me utile pour le RBAC:
{
  "id": 1,
  "email": "admin@nomenclature.dz",
  "role": "ADMIN",
  "is_active": true,
  "is_approved": true,
  "pack": "DEVELOPPEUR"
}

Flow frontend recommande:
1. Login reussi -> stocker access_token
2. Appeler /auth/me
3. Calculer:
   - isAdmin = me.role === "ADMIN"
   - canAccessAdmin = isAdmin && me.is_active && me.is_approved
4. Si canAccessAdmin = false, bloquer toutes les routes /admin

Exemple TypeScript:

```ts
type Me = {
  role: "ADMIN" | "LECTEUR";
  is_active: boolean;
  is_approved: boolean;
};

export const isAdminUser = (me: Me) =>
  me.role === "ADMIN" && me.is_active && me.is_approved;
```

Route guard (React Router exemple):

```ts
if (!isAdminUser(me) && location.pathname.startsWith("/admin")) {
  navigate("/unauthorized");
}
```

Guard composant (menu/boutons admin):

```ts
{isAdminUser(me) && <AdminSidebar />}
{isAdminUser(me) && <button>Desactiver utilisateur</button>}
```

Gestion des erreurs auth/role:
- 401: token absent/expire -> logout + redirection login
- 403: token valide mais role insuffisant -> page "Acces refuse"

Note securite:
- Le masquage UI est pratique, mais la vraie securite est backend.
- Les endpoints /admin sont deja proteges cote API (403 si non admin).

## 2. Base URL et prefixe

En local:
- Base URL: http://localhost:8000

En prod:
- Base URL: votre domaine API
- Si reverse proxy avec prefixe, inclure ROOT_PATH (exemple: /v1)
- Exemple final possible: https://votre-domaine.com/v1

## 3. Format d'erreur standard

La plupart des erreurs fonctionnelles retournent:
{
  "detail": "Message d'erreur"
}

Codes frequents:
- 400: requete invalide (pack invalide, user deja approuve, etc.)
- 401: non authentifie
- 403: token valide mais pas admin
- 404: ressource introuvable

## 4. Endpoints Admin - Packs

## 4.1 Lister les packs

- Methode: GET
- URL: /admin/packs
- Query params: aucun

Reponse 200:
{
  "packs": [
    {
      "slug": "FREE",
      "name": "Free",
      "target": "Developpeurs & Tests"
    }
  ],
  "total": 4
}

Usage frontend:
- Alimenter une liste de selection de pack
- Afficher le catalogue dans ecran admin

## 4.2 Detail d'un pack

- Methode: GET
- URL: /admin/packs/{pack_slug}
- Path param: pack_slug (FREE | PRO | INSTITUTIONNEL | DEVELOPPEUR)

Reponse 200: objet pack complet
Reponse 404:
{
  "detail": "Pack 'GOLD' introuvable. Valeurs : FREE, PRO, INSTITUTIONNEL, DEVELOPPEUR"
}

Usage frontend:
- Page detail pack
- Modal de confirmation avant changement pack utilisateur

## 5. Endpoints Admin - Utilisateurs

## 5.1 Lister les utilisateurs

- Methode: GET
- URL: /admin/users
- Query params:
  - page (int, default 1)
  - page_size (int, default 50, max 200)
  - pack (optionnel)
  - is_approved (optionnel: true/false)
  - is_active (optionnel: true/false)

Reponse 200:
{
  "items": [
    {
      "id": 5,
      "email": "pharmacie@example.dz",
      "full_name": "Dr. Nom Prenom",
      "role": "LECTEUR",
      "pack": "PRO",
      "is_active": true,
      "is_approved": true,
      "created_at": "2026-01-15T08:30:00"
    }
  ],
  "total": 28,
  "page": 1,
  "page_size": 50,
  "total_pages": 1,
  "pending_approval": 3
}

Usage frontend:
- Tableau pagine utilisateurs
- Filtres combine (pack + actif + approbation)

## 5.2 Utilisateurs en attente

- Methode: GET
- URL: /admin/users/pending

Reponse 200:
{
  "pending": [
    {
      "id": 12,
      "email": "contact@clinique.dz",
      "full_name": "Dr. A",
      "pack": "FREE",
      "is_approved": false,
      "created_at": "2026-03-05T14:20:00"
    }
  ],
  "total": 3
}

Usage frontend:
- Inbox des demandes d'acces
- Badge compteur de demandes en attente

## 5.3 Detail utilisateur

- Methode: GET
- URL: /admin/users/{user_id}

Reponse 200: UserOut complet
Reponse 404:
{
  "detail": "Utilisateur introuvable"
}

Usage frontend:
- Ecran detail utilisateur
- Donnees pour edition

## 5.4 Creer un utilisateur admin

- Methode: POST
- URL: /admin/users
- Body JSON (UserCreate):
{
  "email": "nouveau@domaine.dz",
  "password": "MotDePasse123!",
  "full_name": "Nom Prenom",
  "role": "LECTEUR",
  "pack": "PRO",
  "organisation": "Nom structure",
  "phone": "+213..."
}

Reponse 201: UserOut
Reponse 400:
{
  "detail": "Email deja enregistre"
}

Usage frontend:
- Formulaire create user
- Validation email unique cote UI si besoin

## 5.5 Modifier un utilisateur

- Methode: PATCH
- URL: /admin/users/{user_id}
- Body JSON (partiel):
{
  "full_name": "Nouveau nom",
  "role": "ADMIN",
  "pack": "INSTITUTIONNEL",
  "is_active": true,
  "is_approved": true,
  "organisation": "Nouvelle orga",
  "phone": "+213..."
}

Reponse 200: UserOut mis a jour
Reponses erreurs:
- 400 role/pack invalide
- 404 utilisateur introuvable

Usage frontend:
- Formulaire edition partielle
- Si pack change: les compteurs FREE sont reinitialises cote backend

## 5.6 Approuver un utilisateur

- Methode: POST
- URL: /admin/users/{user_id}/approve
- Body JSON (optionnel):
{
  "pack": "PRO",
  "password": "OptionnelMotDePasse"
}

Si password absent, le backend le genere.

Reponse 200:
{
  "message": "Utilisateur ... approuve avec le pack PRO.",
  "user_id": 12,
  "email": "contact@clinique.dz",
  "full_name": "Dr. A",
  "pack": "PRO",
  "generated_password": "...",
  "email_sent": true,
  "note": "Les identifiants ont ete envoyes par email."
}

Reponses erreurs:
- 400 utilisateur deja approuve
- 404 utilisateur introuvable

Usage frontend:
- Action rapide Approver
- Afficher generated_password dans modal securisee si email_sent = false

## 5.7 Changer le pack d'un utilisateur

- Methode: POST
- URL: /admin/users/{user_id}/pack
- Query param obligatoire:
  - pack=FREE|PRO|INSTITUTIONNEL|DEVELOPPEUR

Exemple:
- /admin/users/12/pack?pack=PRO

Reponse 200: UserOut
Erreurs:
- 400 pack invalide
- 404 utilisateur introuvable

Usage frontend:
- Select pack + bouton Appliquer
- Confirmation avant envoi

## 5.8 Desactiver utilisateur (soft delete)

- Methode: DELETE
- URL: /admin/users/{user_id}

Reponse 200:
{
  "message": "Utilisateur user@domaine.dz desactive",
  "user_id": 5
}

Erreurs:
- 400 tentative de se desactiver soi-meme
- 404 utilisateur introuvable

Usage frontend:
- Bouton Desactiver avec double confirmation
- Retirer utilisateur de la liste active

## 5.9 Reinitialiser mot de passe utilisateur

- Methode: POST
- URL: /admin/users/{user_id}/reset-password
- Query param optionnel:
  - new_password=...

Si new_password absent, generation automatique.

Reponse 200:
{
  "message": "Mot de passe reinitialise pour user@domaine.dz",
  "user_id": 5,
  "email": "user@domaine.dz",
  "generated_password": "...",
  "email_sent": true
}

Erreur 404:
{
  "detail": "Utilisateur introuvable"
}

Usage frontend:
- Action admin sensible
- Afficher mot de passe genere seulement une fois

## 6. Endpoints Admin - Statistiques

## 6.0 Endpoint unique dashboard (prioritaire)

- Methode: GET
- URL: /admin/dashboard/overview
- Query params:
  - period=week|month (defaut: week)

Comportement metier:
- week -> fenetre 7 jours
- month -> fenetre 30 jours
- api_calls -> toutes les routes sauf docs/health
- active_users -> users distincts actifs sur la fenetre
- new_users -> inscriptions sur la fenetre
- trend_percent -> comparaison avec la fenetre precedente de meme taille

Reponse 200:
{
  "server": {
    "status": "online",
    "runtime": "12h 34m 56s",
    "last_downtime": null
  },
  "metrics": {
    "api_calls": 12450,
    "active_users": 87,
    "new_users": 14,
    "trend_percent": {
      "api_calls": 12.5,
      "active_users": 4.2,
      "new_users": -8.3
    }
  },
  "activity": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "values": [1200, 1340, 980, 1560, 1490, 910, 870]
  },
  "incidents": [
    {
      "id": 101,
      "title": "Email provider timeout",
      "message": "Graph API timeout sur envoi test",
      "reporter": "system",
      "severity": "medium"
    }
  ],
  "updated_at": "2026-03-28T18:10:00Z"
}

Usage frontend:
- Endpoint unique pour alimenter tout le dashboard
- Toggle periode (week/month) sans multiplier les appels
- Utiliser updated_at pour afficher "Derniere mise a jour"
- Utiliser trend_percent pour badges hausse/baisse

## 6.1 Statistiques globales admin

- Methode: GET
- URL: /admin/stats

Reponse 200:
{
  "total_users": 28,
  "approved": 25,
  "pending_approval": 3,
  "active": 26,
  "inactive": 2,
  "by_pack": {
    "FREE": 10,
    "PRO": 12,
    "INSTITUTIONNEL": 4,
    "DEVELOPPEUR": 2
  }
}

Usage frontend:
- Dashboard KPIs admin
- Donnees pour graphiques repartition pack

## 7. Endpoints Admin - API Keys

## 7.1 Lister toutes les cles API

- Methode: GET
- URL: /admin/api-keys
- Query params:
  - page (default 1)
  - page_size (default 50)
  - user_id (optionnel)
  - is_active (optionnel true/false)

Reponse 200:
{
  "api_keys": [
    {
      "id": 1,
      "user_id": 5,
      "user_email": "user@domaine.dz",
      "user_pack": "PRO",
      "name": "Mon App Mobile",
      "key_prefix": "npp_a3f7...****",
      "is_active": true,
      "created_at": "2026-03-01T10:00:00",
      "last_used_at": "2026-03-06T14:22:00",
      "last_used_ip": "41.111.22.33",
      "requests_count": 1523
    }
  ],
  "total": 15,
  "page": 1,
  "page_size": 50
}

Usage frontend:
- Tableau global des cles API
- Filtrage par utilisateur et statut

## 7.2 Detail d'une cle API

- Methode: GET
- URL: /admin/api-keys/{key_id}

Reponse 200: detail complet cle
Erreur 404:
{
  "detail": "Cle API introuvable."
}

## 7.3 Activer / desactiver une cle API

- Methode: PATCH
- URL: /admin/api-keys/{key_id}
- Query param obligatoire:
  - is_active=true|false

Exemple:
- /admin/api-keys/1?is_active=false

Reponse 200:
{
  "message": "Cle API desactivee.",
  "id": 1,
  "is_active": false
}

Erreur 404:
{
  "detail": "Cle API introuvable."
}

## 7.4 Supprimer une cle API

- Methode: DELETE
- URL: /admin/api-keys/{key_id}

Reponse 200:
{
  "message": "Cle API supprimee definitivement.",
  "id": 1
}

Erreur 404:
{
  "detail": "Cle API introuvable."
}

## 7.5 Lister les cles API d'un utilisateur

- Methode: GET
- URL: /admin/users/{user_id}/api-keys

Reponse 200:
{
  "user_id": 5,
  "user_email": "user@domaine.dz",
  "user_pack": "PRO",
  "api_keys": [
    {
      "id": 1,
      "name": "Mon App Mobile",
      "key_prefix": "npp_a3f7...****",
      "is_active": true,
      "created_at": "2026-03-01T10:00:00",
      "last_used_at": "2026-03-06T14:22:00",
      "last_used_ip": "41.111.22.33",
      "requests_count": 1523
    }
  ],
  "total": 1
}

Erreur 404:
{
  "detail": "Utilisateur introuvable."
}

## 8. Endpoints Admin - Email

## 8.1 Etat du service email

- Methode: GET
- URL: /admin/email/status

Reponse 200:
{
  "enabled": true,
  "configured": true,
  "provider": "Microsoft Graph API",
  "mail_from": "npp@nhaddag.net",
  "mail_from_name": "NPP API",
  "admin_notification_email": "contact@nhaddag.net",
  "tenant_id_set": true,
  "client_id_set": true,
  "client_secret_set": true,
  "templates": ["signup_confirmation", "admin_new_signup", "account_approved"]
}

Usage frontend:
- Afficher badge de sante service email dans panneau admin

## 8.2 Debug Graph API token

- Methode: GET
- URL: /admin/email/debug

Reponse 200 (exemple):
{
  "mail_from": "npp@nhaddag.net",
  "tenant_id": "c934cfdd...",
  "client_id": "42bb7e49...",
  "token_acquired": true,
  "token_error": null,
  "token_roles": ["Mail.Send"],
  "token_audience": "https://graph.microsoft.com",
  "token_issuer": "https://login.microsoftonline.com/...",
  "mail_send_granted": true,
  "mailbox_check": "OK ...",
  "diagnosis": ["Tout semble correctement configure..."]
}

Usage frontend:
- Page troubleshooting email
- Bouton Run diagnostic

## 8.3 Envoyer un email de test

- Methode: POST
- URL: /admin/email/test
- Query param obligatoire:
  - to_email

Exemple:
- /admin/email/test?to_email=contact@domaine.dz

Reponse succes:
{
  "message": "Email de test envoye a contact@domaine.dz",
  "success": true
}

Reponse echec:
{
  "message": "Echec de l'envoi. Verifiez la configuration M365 et les logs.",
  "success": false,
  "hint": "Assurez-vous que MAIL_ENABLED=true et que les credentials M365 sont corrects."
}

## 8.4 Envoyer un email personnalise

- Methode: POST
- URL: /admin/email/send
- Query params obligatoires:
  - to_email
  - subject
  - body_html

Reponse 200:
{
  "success": true,
  "to": "user@domaine.dz",
  "subject": "Information importante"
}

Usage frontend:
- Formulaire compose email admin
- Editeur rich text (converti en HTML)

## 9. Matrice rapide pour integration UI

Vue frontend recommandees:
- Dashboard admin: GET /admin/stats, GET /admin/email/status
- Validation inscriptions: GET /admin/users/pending + POST /admin/users/{id}/approve
- Gestion users: GET /admin/users + GET/PATCH/DELETE /admin/users/{id}
- Gestion packs: GET /admin/packs + POST /admin/users/{id}/pack
- Gestion API keys: GET /admin/api-keys + PATCH/DELETE /admin/api-keys/{id}
- Troubleshooting email: GET /admin/email/debug + POST /admin/email/test

## 10. Conseils integration frontend

- Centraliser le token dans un client HTTP unique (axios interceptor ou equivalent)
- Rediriger vers login si 401
- Afficher un toast metier sur detail d'erreur si 400/404
- Debouncer la recherche/filtres sur /admin/users
- Pour les actions sensibles (approve, reset password, deactivate), utiliser modal de confirmation
- Journaliser cote frontend les erreurs reseau (sans exposer token)

## 11. Exemple client HTTP minimal (TypeScript)

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

Exemple appel:

const { data } = await api.get("/admin/users", {
  params: { page: 1, page_size: 20, is_active: true }
});

## 12. Verification finale avant branchement frontend

Checklist:
- Le compte connecte a role ADMIN
- Le token JWT est bien present dans Authorization
- Le prefixe API (ROOT_PATH) est bien aligne avec la baseURL frontend
- Les parametres query sont passes correctement (booleens, ids, page)
- Les ecrans gerent les cas 400/404 proprement

## 13. Endpoints Import (admin uniquement)

Regle d'acces:
- Toutes les routes /import/* sont protegees au niveau router
- Si non admin: 403

Endpoints a integrer:
- POST /import/sheets/preview
- POST /import/nomenclature
- GET /import/duplicates
- POST /import/clean-duplicates

### 13.1 Preview des feuilles Excel

- Methode: POST
- URL: /import/sheets/preview
- Content-Type: multipart/form-data
- Champs:
  - file (xlsx/xls)

Reponse 200:
{
  "filename": "nomenclature_2025.xlsx",
  "sheets": [
    {
      "name": "Nomenclature",
      "rows": 8542,
      "detected_type": "medicaments",
      "detected_category": "NOMENCLATURE",
      "columns": ["N", "CODE", "DCI", "NOM_MARQUE"],
      "error": null
    }
  ]
}

Erreurs:
- 400 fichier invalide
- 500 erreur de lecture

### 13.2 Import nomenclature

- Methode: POST
- URL: /import/nomenclature
- Content-Type: multipart/form-data
- Champs:
  - file (obligatoire)
  - version (obligatoire, ex: 2025-06-30)
  - sheet_names (optionnel, separees par virgule)
  - remplacer_version (optionnel, bool)

Reponse 200:
{
  "version_nomenclature": "2025-06-30",
  "source_fichier": "nomenclature_2025.xlsx",
  "sheets_processed": {
    "Nomenclature": {
      "rows_inserted": 8500,
      "rows_updated": 42,
      "rows_ignored": 3,
      "category": "NOMENCLATURE",
      "errors": []
    }
  },
  "total_rows_inserted": 8500,
  "total_rows_updated": 42,
  "available_sheets": ["Nomenclature", "Non Renouveles", "Retraits"]
}

Erreurs:
- 400 fichier/feuilles invalides
- 500 erreur import

### 13.3 Detection des doublons

- Methode: GET
- URL: /import/duplicates
- Query params:
  - version (optionnel)

Reponse 200:
{
  "total_duplicates": 2,
  "duplicates": [
    {"code": "01 A 003", "version": "2025-06-30", "categorie": "NOMENCLATURE", "count": 3}
  ]
}

### 13.4 Nettoyage des doublons

- Methode: POST
- URL: /import/clean-duplicates
- Query params:
  - version (optionnel)
  - keep_strategy (latest|first)
  - dry_run (bool, defaut true)

Reponse 200:
{
  "dry_run": true,
  "total_groups": 5,
  "total_entries_deleted": 8,
  "details": [
    {"code": "01 A 003", "version": "2025-06-30", "categorie": "NOMENCLATURE", "kept": 1, "deleted": 2}
  ]
}

Erreur 400:
{
  "detail": "keep_strategy doit etre 'latest' ou 'first'"
}

### 13.5 Integration UI recommandee (frontend)

Parcours type:
1. Upload fichier -> POST /import/sheets/preview
2. Selection feuilles + version -> POST /import/nomenclature
3. Affichage rapport import (inserted/updated/ignored/errors)
4. Controle qualite -> GET /import/duplicates
5. Nettoyage guide -> POST /import/clean-duplicates?dry_run=true
6. Confirmation finale -> POST /import/clean-duplicates?dry_run=false

Bonnes pratiques:
- Afficher une barre de progression pendant l'import
- Toujours commencer par dry_run=true pour clean-duplicates
- Afficher les erreurs ligne par ligne si disponibles
- Bloquer ces ecrans si role != ADMIN (guard frontend)

---

Source technique backend:
- app/admin/routes.py
- app/auth/schemas.py
- app/core/security.py
