# Lot 01 — Socle de reconstruction React et serveur

Date : 11 octobre 2026. Phase expérimentale 0.3.0. La référence visée est décrite dans les audits. **Ce lot ne prétend pas à une parité jouable complète.**

## Implémenté

- Seconde entrée `parity.html` basée sur React, séparée de l'alpha locale pour éviter toute migration silencieuse de progression. Authentification via l'API Node existante et cookie HttpOnly. Le personnage de cette tranche est conservé uniquement dans PostgreSQL, table `parity_characters` ; aucun `localStorage` client.
- **17 compétences** présentes simultanément avec XP indépendants et niveaux selon la courbe comportementale auditée (seuils niveau 2 = 82, 10 = 1112, 50 = 78144, 100 = 7995169). Niveau total et niveau combat calculés, non enregistrés en double.
- **13 emplacements d'équipement** selon les identifiants de l'audit, avec trois outils de départ équipés, sans duplication dans le sac.
- **Sac initial de 16 cases**, or compté comme une case, matériaux empilables. Capacité inchangée.
- Trois activités réellement exécutées côté serveur : extraction, bûcheronnage, pêche. Délais, noms et XP sont des **valeurs provisoires de reconstruction**, pas une transcription des règles équilibrées de référence.
- Fenêtre d'absence de 2 heures et progression calculées par `Date.now()` **exclusivement côté API**, avec curseur `settledAt`, verrous SQL `FOR UPDATE`, et événements uniques par révision. Deux demandes simultanées d'une même action ne doublent pas les gains.
- Journal chronologique, emplacement inventaire, tableau des 17 compétences, équipement, panneau d'activités en desktop et mobile.

## À construire (ne pas présenter comme présent)

Combat complet 4 styles, sorts/prière, maîtrise, équipement et échange, banque, métallurgie/fabrication/cuisine, quêtes, donjons/boss, artisanat étendu, famille de familiers, marché, Renaissances, économie premium, idempotence par clé explicite sur opérations monétaires, tests d'intégration PostgreSQL, audits production. Le support de temps hors ligne avancé (effets temporaires, vitesse, rendements, saturation par lois de cycle) est seulement esquissé dans ce lot.

## Mise en route locale (PowerShell)

À la racine du dépôt, mettre à jour les dépendances :

```powershell
npm install
```

Créer une base PostgreSQL locale dédiée, puis exécuter dans `psql` en mode sans pager, dans cet ordre :

```powershell
psql --pset=pager=off -v ON_ERROR_STOP=1 -d eclipse_blanche -f server/sql/001_initial.sql
psql --pset=pager=off -v ON_ERROR_STOP=1 -d eclipse_blanche -f server/sql/002_parity_engine.sql
```

Configurer des **variables d'environnement locales** : `DATABASE_URL` (connexion vers la base locale dédiée), `APP_ORIGIN=http://localhost:5173`, `PORT=3001`. Ne pas committer de mot de passe ou d'URL de base contenant un secret. Pour démarrer dans deux terminaux :

```powershell
npm run server:dev
npm run dev
```

Ouvrir `http://localhost:5173/parity.html`. La page racine `/` garde l'ancienne alpha, avec ses sauvegardes locales **totalement distinctes**.

## Contrôles

`npm test` vérifie le modèle pur de parité et les tests historiques ; `npm run build` vérifie le bundle React si les dépendances sont installées. Des tests **avec PostgreSQL réel** restent nécessaires avant toute utilisation publique. Le prototype et la nouvelle API ne sont **pas prêts à être exposés sur Internet**.