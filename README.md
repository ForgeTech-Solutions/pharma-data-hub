# NPP Website

Application web React/TypeScript pour NPP.

## Stack technique

- **Vite** — bundler et serveur de développement
- **React 18** avec TypeScript
- **Tailwind CSS** — styling utilitaire
- **shadcn/ui** — composants UI accessibles (Radix UI)
- **React Router v6** — navigation
- **TanStack Query** — gestion des données asynchrones
- **React Hook Form** + Zod — formulaires et validation
- **i18next** — internationalisation (FR / EN)
- **Recharts** — graphiques

## Prérequis

- Node.js ≥ 18
- npm ≥ 9

## Installation

```sh
# Cloner le dépôt
git clone <URL_DU_REPO>
cd npp-website

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement (port 8080) |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualise le build de production localement |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run test` | Lance les tests Vitest |
| `npm run test:watch` | Lance les tests en mode watch |

## Structure du projet

```
src/
├── assets/          # Images et ressources statiques
├── components/      # Composants réutilisables
│   ├── ui/          # Composants shadcn/ui
│   └── dashboard/   # Layout du tableau de bord
├── hooks/           # Hooks React personnalisés
├── i18n/            # Traductions FR/EN
├── lib/             # Utilitaires et client API
├── pages/           # Pages de l'application
└── test/            # Tests unitaires
```

## Déploiement

Construire le projet puis déployer le dossier `dist/` sur votre hébergeur :

```sh
npm run build
# → dist/ prêt à être déployé
```
