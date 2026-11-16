# Freshnet

Freshnet est un mini réseau social front-end pensé comme prototype PWA et comme base de projet pour un usage plus sécurisé avec Supabase.

## Sécurité
Ce projet a été mis à jour pour utiliser Supabase Auth et un modèle de données sécurisé, avec l’objectif d’éliminer la dépendance au stockage local des mots de passe dans le navigateur.

## Configuration Supabase
1. Crée un projet Supabase.
2. Dans le tableau de bord, récupère l’URL du projet et la clé anon.
3. Remplace les valeurs suivantes dans `connexion.html` et `fil.html` :
   - `https://YOUR-PROJECT.supabase.co`
   - `YOUR-ANON-KEY`
4. Exécute les scripts SQL dans `supabase/schema.sql`.

## Scripts SQL
Voir le fichier `supabase/schema.sql` pour :
- `profiles`
- `posts`
- politiques RLS
- index de performance

## Bonnes pratiques de production
- ne jamais stocker les mots de passe côté client
- utiliser Supabase Auth
- utiliser les politiques RLS de Supabase
- filtrer et neutraliser les entrées utilisateur
- utiliser HTTPS uniquement
- ne jamais exposer de clé secrète dans un frontend public

## Déploiement
Le site est prêt pour GitHub Pages, et il est compatible avec une conversion en application Android via Capacitor.
