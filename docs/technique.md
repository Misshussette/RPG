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
