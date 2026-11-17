# Freshnet

Freshnet est une application sociale légère construite en HTML, CSS et JavaScript. Elle fonctionne comme site statique/PWA et peut être empaquetée en application Android avec Capacitor.

## Prérequis
- Node.js 18 ou plus récent
- Un projet Supabase avec Auth activé

## Lancer le site
```bash
npm install
npm run dev
```
Puis ouvre http://localhost:8080.

## Configurer Supabase
`js/config.js` contient l'URL du projet et une clé publishable/anon, qui est faite pour être utilisée dans le navigateur. Ne place jamais une clé `service_role` dans ce dépôt. Si tu remplaces le projet, modifie ces deux valeurs.

Dans Supabase, exécute `supabase/schema.sql` dans le SQL Editor. La création de compte peut nécessiter la confirmation email suivant les réglages Auth du projet.

## Créer l'application Android
```bash
npm install
npm run build
npm run cap:add:android   # une seule fois
npm run cap:sync
npm run cap:open:android
```
Android Studio et un SDK Android sont nécessaires pour générer/signature l'APK. Pour une nouvelle plateforme iOS, utilise `npx cap add ios` sur macOS avec Xcode.

## Déploiement PWA
Publie les fichiers du dépôt sur un hébergement HTTPS statique (par exemple GitHub Pages). Le service worker met en cache l'interface, pas les réponses d'authentification ni les données Supabase.

## Fonctionnalités
- inscription et connexion Supabase Auth
- création et lecture des publications, protégées par RLS
- mode installable PWA et génération du bundle web Capacitor
