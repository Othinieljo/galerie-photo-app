# Galerie Photos Unsplash

Application web moderne de visualisation de photos avec authentification, intégration à l'API Unsplash, système de likes, et infinite scrolling optimisé.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Architecture](#-architecture)
- [Choix techniques](#-choix-techniques)

##  Fonctionnalités

### Authentification
- **Page de connexion** fidèle à la maquette fournie
- **Scénarios d'authentification** :
  - `muser1` / `mpassword1` → Authentification réussie
  - `muser2` / `mpassword2` → Authentification réussie
  - `muser3` / `mpassword3` → Message d'erreur : "Ce compte a été bloqué."
  - Toute autre combinaison → Message d'erreur : "Informations de connexion invalides"
- **Gestion de session** avec cookies HTTP-only
- **Transitions et animations** fluides avec Framer Motion
- **Validation en temps réel** des champs de formulaire

### Galerie de photos
- **Intégration complète avec l'API Unsplash**
- **Infinite scrolling** optimisé avec Intersection Observer
- **Filtres avancés** :
  - Tri par : Plus récentes, Plus anciennes, Populaires, Plus vues
  - Filtre par couleur (12 options)
  - Filtre par orientation (Paysage, Portrait, Carré)
- **Système de likes** persistant par utilisateur
- **Affichage des détails** au survol (auteur, description, statistiques)
- **Curseur personnalisé** avec animations

### Interface utilisateur
- **États de chargement** : skeletons, spinners, messages de feedback
- **Gestion d'erreurs** élégante avec retry automatique
- **Optimisation LCP** pour les images au-dessus de la ligne de flottaison

##  Technologies utilisées

- **Framework** : Next.js 16.1.6 (App Router)
- **Langage** : TypeScript 5
- **UI** : React 19.2.3
- **Styling** : Tailwind CSS 4 + CSS Modules
- **Animations** : Framer Motion 12.34.1
- **State Management** : Zustand 5.0.11
- **API Externe** : Unsplash JS SDK 7.0.20
- **Fonts** : DM Sans (via `next/font/google`)

##  Prérequis

- **Node.js** : 18.x ou supérieur
- **npm** : 9.x ou supérieur (ou yarn/pnpm)
- **Clé API Unsplash** : [Créer un compte développeur](https://unsplash.com/developers)

##  Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd galerie-photo-app
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configurer les variables d'environnement

Copiez le fichier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Éditez `.env.local` et ajoutez vos clés API Unsplash :

```env
UNSPLASH_ACCESS_KEY=votre_access_key_ici
UNSPLASH_SECRET_KEY=votre_secret_key_ici
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note** : Pour obtenir vos clés API Unsplash :
> 1. Créez un compte sur [Unsplash Developers](https://unsplash.com/developers)
> 2. Créez une nouvelle application
> 3. Copiez votre `Access Key` et `Secret Key`

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `UNSPLASH_ACCESS_KEY` | Clé d'accès API Unsplash |  Oui |
| `UNSPLASH_SECRET_KEY` | Clé secrète API Unsplash |  Optionnel (non utilisé actuellement) |
| `NEXT_PUBLIC_APP_URL` | URL de l'application (pour logout redirect) |  Optionnel |

### Configuration Next.js

Le fichier `next.config.ts` configure :
- **Images distantes** : Autorise les images depuis `images.unsplash.com`
- **Turbopack** : Configuration pour le développement

##  Lancement

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build de production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

##  Architecture

### Structure du projet

```
visualisation-image/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group pour l'authentification
│   │   └── login/                # Page de connexion
│   ├── (dashboard)/              # Route group pour le dashboard
│   │   └── gallery/              # Page galerie
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Endpoints d'authentification
│   │   ├── likes/                # Endpoints pour les likes
│   │   └── unsplash/             # Proxy vers l'API Unsplash
│   ├── globals.css               # Styles globaux + Design System
│   ├── layout.tsx                # Layout racine
│   └── page.tsx                  # Page d'accueil (redirection)
├── components/                    # Composants React
│   ├── auth/                     # Composants d'authentification
│   │   ├── LoginCard.tsx         # Formulaire de connexion
│   │   ├── LoginLayout.tsx       # Layout de la page login
│   │   ├── decorations/         # Éléments décoratifs SVG
│   │   └── icons/                # Icônes SVG
│   ├── gallery/                  # Composants de la galerie
│   │   ├── ImageCard.tsx         # Carte d'image individuelle
│   │   ├── ImageGrid.tsx         # Grille d'images
│   │   ├── ImageDetailsOverlay.tsx # Overlay de détails au survol
│   │   ├── InfiniteScroll.tsx    # Wrapper pour infinite scroll
│   │   ├── LikeButton.tsx        # Bouton like/unlike
│   │   ├── PhotoFilters.tsx      # Filtres de recherche
│   │   └── UserInfo.tsx          # Info utilisateur dans le header
│   └── ui/                       # Composants UI réutilisables
│       ├── ErrorState.tsx        # Affichage d'erreurs
│       └── Spinner.tsx            # Indicateur de chargement
├── lib/                          # Utilitaires et logique métier
│   ├── auth.ts                   # Logique d'authentification
│   ├── db.ts                     # Persistance des likes (JSON)
│   ├── hooks/                    # Hooks React personnalisés
│   │   └── useInfinitePhotos.ts  # Hook pour infinite scrolling
│   └── unsplash.ts               # Client API Unsplash
├── store/                        # State management
│   └── authStore.ts              # Store Zustand pour l'auth
├── types/                        # Définitions TypeScript
│   └── index.ts                  # Types Unsplash
├── proxy.ts                      # Middleware Next.js (auth redirects)
└── .db/                         # Base de données JSON (généré)
    └── likes.json                # Stockage des likes
```


```

##  Choix techniques

### 1. Next.js App Router

**Pourquoi ?**
- Routing basé sur le système de fichiers (simplicité)
- Server Components par défaut (performance)
- API Routes intégrées (pas besoin d'un backend séparé)
- Optimisations automatiques (images, fonts, code splitting)

### 2. TypeScript

**Pourquoi ?**
- Sécurité de type à la compilation
- Meilleure DX (autocomplétion, refactoring)
- Documentation implicite via les types
- Détection précoce des erreurs

### 3. Tailwind CSS 4 + CSS Modules

**Pourquoi ?**
- **Tailwind** : Utilitaire-first, développement rapide, purge automatique
- **CSS Modules** : Scoping pour les composants complexes (LoginCard)
- **Design System** : Variables CSS (`--ds-*`) centralisées dans `globals.css`
- Cohérence visuelle garantie via le design system

### 4. Zustand pour le state management

**Pourquoi ?**
- Léger (~1KB)
- API simple (pas de boilerplate)
- Parfait pour l'état d'authentification (simple, synchrone)
- Alternative légère à Redux pour des besoins simples

### 5. Framer Motion

**Pourquoi ?**
- Animations fluides et performantes
- API déclarative intuitive
- Support des gestes et transitions complexes

### 6. JSON file-based storage pour les likes

**Pourquoi ?**
- **Simplicité** : Pas besoin de configurer une base de données
- **Rapidité** : Parfait pour un prototype/démo
- **Portabilité** : Fichier `.db/likes.json` facile à versionner (optionnel)

### 7. Intersection Observer pour l'infinite scroll

**Pourquoi ?**
- **Performance** : Natif au navigateur, pas de polling
- **Efficacité** : Déclenche uniquement quand nécessaire
- **UX** : Chargement anticipé avec `rootMargin: "200px"`

### 8. Cache mémoire pour l'API Unsplash

**Pourquoi ?**
- **Rate limiting** : Unsplash limite à 50 requêtes/heure (demo)
- **Performance** : Réduit la latence pour les requêtes répétées
- **Coût** : Évite les appels API inutiles
- **TTL** : 1 minute (équilibre fraîcheur/performance)

### 9. Custom cursors SVG

**Pourquoi ?**
- **Personnalisation** : Expérience utilisateur unique
- **Performance** : SVG inline (pas de requêtes HTTP)
- **Accessibilité** : Fallback sur `auto`/`pointer`













