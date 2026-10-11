# Serveur en développement — L’Éclipse Blanche 0.2.0

**Statut : infrastructure initiale, non déployable en production.**
Un seul compte, un seul personnage et une seule progression en ligne sont la cible. Le client 0.1.1 utilise encore la sauvegarde locale : **il n'est pas encore relié à cette API**. Ne pas ouvrir les inscriptions au public ni activer Stripe à ce stade.

## Prérequis
- Node.js récent (20+ recommandé), npm ou Bun
- PostgreSQL accessible localement pour les tests
- Variables `DATABASE_URL`, `APP_ORIGIN` et éventuellement `PORT`
- Un utilisateur SQL dédié avec permissions limitées dans une base de développement

## Initialisation locale (PowerShell)
Après `git pull` puis `npm install`, créer une base PostgreSQL et un rôle de développement, sans utiliser de compte superutilisateur pour le runtime.
Copier `server/.env.example` vers `server/.env`, corriger les valeurs, puis définir les variables d'environnement via le shell ou le gestionnaire de secrets.

Exemple de commandes **sur ton PC, pas sur le VPS** :
```powershell
$env:DATABASE_URL = "postgresql://eb_dev:TON_MOT_DE_PASSE@127.0.0.1:5432/eclipse_blanche"
$env:APP_ORIGIN = "http://localhost:5173"
$env:PORT = "3001"
psql --set ON_ERROR_STOP=1 --pset=pager=off "$env:DATABASE_URL" -f server/sql/001_initial.sql
npm run server:start
```
Dans un **second terminal local**, lancer `npm run dev`. Vite transmet les requêtes `/api` à l'API. La page actuelle reste un prototype local tant que le câblage client/serveur n'est pas terminé.

L'API écoute uniquement sur `127.0.0.1`. Aucune connexion directe PostgreSQL depuis un navigateur. En production, un reverse proxy TLS est requis.

## Routes d'API (développement)
- `GET /api/health`
- `POST /api/register` : JSON `{ "email":"...", "password":"..." }`
- `POST /api/login` ; `POST /api/logout`
- `GET /api/me` : état du personnage authentifié
- `POST /api/action` : actions limitées, ex. `{ "action":"create", "name":"Ariane", "discipline":"magic" }` puis `fight`, `turn`, `rest`, etc.

Les appels POST depuis le navigateur doivent contenir un en-tête `Origin` égal à `APP_ORIGIN` et le cookie de session est `HttpOnly; SameSite=Strict`, avec `Secure` quand APP_ORIGIN est HTTPS.

## Contrôles déjà codés
- Mot de passe salé et dérivé par `scrypt` ; tokens de session aléatoires, seul leur hash SHA-256 est conservé.
- Actions autorisées listées explicitement, impossible de demander directement `setGold`, `rebirth` ou `giveItem`.
- Une transaction PostgreSQL par action avec verrou par personnage.
- Temps de tour contrôlé côté serveur, événements et alertes minimales enregistrés.
- Limitation simple en mémoire par adresse IP (provisoire, insuffisante à plusieurs instances).

## Manques bloquants avant une beta publique
- Client entièrement connecté (plus aucun `localStorage` pour la progression), parcours login/inscription, session expirée.
- Tests d'intégration PostgreSQL (concurrence, migrations, blocages, invariants) et tests réseau.
- Protection authentification renforcée : vérification des e-mails, récupération de compte, surveillance, CSRF approfondi, rate limiting persistant, protection contre credential stuffing, politique des sessions.
- Journal anti-triche complet et simulations R0→R20 ; la détection de Renaissance n'est **pas** implémentée.
- Sauvegardes distantes, tests de restauration, surveillance et déploiement sécurisé.
- Stripe : **non intégré** ; ledger des achats, idempotence webhook, rétrofacturations à construire et auditer.
- Multijoueur et boss mondiaux : **non implémentés**.

Ne jamais committer un fichier `.env` contenant des secrets.

## API de reconstruction React — version 0.3.0

Après `001_initial.sql`, exécuter **manuellement** `server/sql/002_parity_engine.sql` sur la base locale dédiée. Aucun schéma existant n'est effacé. Les nouvelles tables `parity_characters` et `parity_events` sont distinctes des anciens tests ; leur contenu constitue la seule source de vérité pour la nouvelle interface React, accessible à `/parity.html`.

Routes authentifiées ajoutées : `GET /api/v2/me`, `POST /api/v2/character` avec `{\"name\":\"Personnage\"}`, `POST /api/v2/action` avec `{\"action\":\"start\",\"activityId\":\"mine_terne\"}`, `{\"action\":\"settle\"}` ou `{\"action\":\"stop\"}`. Les mêmes routes `/api/register`, `/api/login`, `/api/logout` assurent l'authentification. Les requêtes POST exigent l'en-tête Origin conforme à `APP_ORIGIN` et la session cookie valide.

Les XP, le temps, les quantités et le solde communiqués par un client ne sont jamais acceptés comme résultats d'action. Les personnages sont verrouillés par `SELECT … FOR UPDATE` pendant la transaction de règlement et chaque évolution incrémente une révision journalisée. Les tests unitaires couvrent les invariants principaux, **mais aucune intégration avec un PostgreSQL réel n'a été exécutée ici**.

Le comportement de l'ancienne API expérimentale (`/api/action`) n'est pas celui du nouveau moteur ; elle ne doit pas être utilisée pour la nouvelle version. Aucun des deux systèmes ne doit être exposé publiquement à ce stade.
