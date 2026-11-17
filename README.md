# Freshnet

Freshnet est une application sociale légère construite en HTML, CSS et JavaScript. Elle fonctionne comme site statique/PWA et peut être empaquetée en application Android avec Capacitor.

## Lancer le site
```bash
npm install
npm run dev
```
Ouvre ensuite http://localhost:8080.

## Supabase
Le projet est configuré avec l'URL et la clé publishable du projet Supabase Freshnet dans `js/config.js`. Cette clé est destinée au navigateur; ne la remplace jamais par une clé `service_role`. Dans Supabase, active Auth par email et exécute `supabase/schema.sql` dans le SQL Editor. Si la confirmation par email est active, l'utilisateur doit confirmer son adresse avant la connexion.

Le SQL configure les tables `profiles` et `posts`, le lien entre elles, le trigger de profil et les politiques RLS. L'exécuter dans le SQL Editor est une action nécessaire dans le tableau de bord Supabase, distincte du déploiement GitHub.

## PWA
Publie sur un hébergement HTTPS. Le service worker met en cache les ressources de l'interface uniquement; les appels Supabase nécessitent une connexion.

## Application Android (Capacitor)
Prérequis: Node.js 18+, Android Studio et le SDK Android.
```bash
npm install
npm run build
npm run cap:add:android   # une seule fois pour créer android/
npm run cap:sync
npm run cap:open:android
```
Dans Android Studio, génère et signe l'APK/AAB via Build > Generate Signed Bundle / APK. Ce dépôt fournit la configuration et le bundle web; la compilation/signature Android s'effectue sur ta machine avec Android Studio.

## Structure
- `index.html`: accueil
- `connexion.html`: connexion et inscription
- `fil.html`: fil d'actualité
- `js/auth.js`: client Supabase et API auth/feed
- `js/auth-page.js`: formulaires d'authentification
- `js/feed.js`: fil, publication et déconnexion
- `service-worker.js` et `manifest.webmanifest`: PWA
- `capacitor.config.ts`: configuration mobile
- `supabase/schema.sql`: schéma et politiques RLS
