# Socle technique et stratégie d'intégration

## État initial

Le dépôt contient un squelette indépendant **TypeScript + Vite**, exécutable localement. Il ne contient **aucun code tiers extrait**, aucune ressource propriétaire et aucun moteur de jeu implémenté. Il sert à démarrer le développement et les tests de notre propre application.

## Démarrage (terminal local Windows / VS Code)

```powershell
 git clone https://github.com/Misshussette/RPG.git
 cd RPG
 npm install
 npm run dev
```

La commande `npm install` installe les dépendances déclarées dans `package.json`. Le fichier `package-lock.json` sera créé à l'installation et devra être versionné. Ne pas committer `node_modules`.

## Audit de référence avant réimplémentation

1. Cartographier les fonctionnalités étudiées : calculs de combat, progression, inventaire, banque, quêtes, récolte hors ligne, sauvegarde, marché, événements.
2. Identifier pour chaque fonction ses entrées, sorties, règles et cas limites.
3. Vérifier les licences et droits avant d'envisager la copie d'une portion de code ou d'une dépendance.
4. Développer des modules propres à L’Éclipse Blanche, avec tests de comportement et documentation.
5. Pour les fonctions multijoueurs (boss commun, marché, enchères, guildes), prévoir une autorité serveur et des transactions vérifiables ; ne pas faire confiance aux calculs du navigateur.

## Architecture cible (à confirmer)

- `src/` : client web et présentation.
- `src/game/` : règles déterministes de progression, combat et objets (à créer).
- `server/` : API et logique multijoueur autoritaire (à créer après cadrage).
- `docs/` : conception, décisions et architecture.
- `public/assets/` : visuels originaux du jeu (à intégrer).

## Décisions non prises

Framework UI, serveur/API, base de données, authentification, hébergement, mécanismes anti-triche, stratégie de sauvegarde et déploiement. Aucun choix ne doit être présenté comme validé avant discussion.

## Implémentation actuelle — Alpha solo 0.1.0

La première alpha a été développée et publiée. Le client s'exécute dans le navigateur en JavaScript ES Modules natif, empaquetable avec Vite. Le moteur n'utilise aucune logique tierce recopiée. Le frontend dispose déjà d'une interface responsive et d'une sauvegarde locale, et des tests natifs Node.js couvrent les principales règles.

Pour lancer : `npm install`, puis `npm run dev`. Pour tester : `npm test`.

**Cette alpha n'inclut pas de backend, de comptes, de multijoueur, de paiements, de boutique ou de Fast Mode.** Le protocole serveur et la base PostgreSQL restent une phase distincte. La distribution est web/PC sans Steam.

Consulter [l'état de l'alpha](implementation-alpha.md) pour le détail.

## Architecture cible validée : serveur unique online (11 octobre 2026)

**Remplace la proposition précédente de mode solo PC avec SQLite / offline.** Tous les joueurs utilisent une infrastructure serveur commune ; solo et multi sont des modes d'activité, pas deux sauvegardes ni deux économies. Comptes et personnages persistés sur PostgreSQL du VPS ; le navigateur n'est qu'une interface. Le client ne doit recevoir aucun accès direct privilégié à PostgreSQL.

Flux : client web/PC → HTTPS API authentifiée → moteur serveur autoritaire → PostgreSQL. Pour les boss partagés, événements temps réel : WebSocket ou SSE selon besoins, sans faire confiance au client pour dégâts, tirages, temps, récompenses ou scores.

Sécurité : cookie HttpOnly/Secure/SameSite, protections CSRF appropriées, autorisations sur chaque action, rate limiting, anti-rejeu/idempotence, transactions atomiques et verrous sur opérations critiques, source de temps et aléatoire côté serveur ; sauvegardes PostgreSQL chiffrées hors VPS avec restauration testée. Comptes de services dédiés et moindre privilège, secrets hors Git, observabilité sans journaliser de données sensibles.

Paiements : Stripe Checkout/abonnements avec prix et commandes créés au backend. Traiter les webhooks avec vérification de signature et contrôle d'unicité des événements ; enregistrer commande et crédits/abonnement dans des transactions atomiques, avec livre de comptes et rapprochement Stripe ; refuser l'octroi de crédit sur un simple succès affiché dans le navigateur. Traiter remboursements, impayés et rétrofacturations sans perdre la traçabilité.

Déploiement initial : un VPS suffisant si dimensionné correctement, reverse proxy TLS, conteneurs ou services gérés, PostgreSQL privé, supervision, sauvegardes externes. Conception stateless côté API et migrations reproductibles pour permettre plus tard une réplication/horizontalisation, mais pas de Kubernetes avant justification par charge et contraintes d'exploitation.

**État** : architecture décidée, non encore développée ni auditée en sécurité. La version 0.1.1 utilise encore `localStorage` ; elle sert uniquement de prototype temporaire et ne doit pas être présentée comme sécurisée.
