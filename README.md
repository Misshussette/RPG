> **Changement de stratégie (11/10/2026)** : l'alpha 0.2.3 est une **maquette provisoire**, pas la base fonctionnelle à enrichir petit à petit. Priorité à l'[audit et à la parité fonctionnelle](docs/strategie-parite.md) avec les systèmes étudiés, en React et avec backend autoritaire. Les trois disciplines de la maquette ne limitent pas les compétences du jeu final. Les actifs et le code tiers ne seront repris littéralement que si les droits l'autorisent.\n\n# L’ÉCLIPSE BLANCHE — Première alpha solo

Un RPG narratif et décalé dans un monde où les représentations collectives peuvent modifier la réalité.

> **État : prototype jouable en solo.** Aucun serveur partagé, aucune boutique, aucun paiement, aucune Renaissance et aucun compte utilisateur ne sont encore actifs. Les règles et les visuels de cette alpha sont originaux au projet ; aucune portion de code de référence tierce n'est intégrée.

## Démarrer

```powershell
git clone https://github.com/Misshussette/RPG.git
cd RPG
npm install
npm run dev
```

Ouvrir l'adresse locale fournie par Vite. Pour lancer les tests automatiques :

```powershell
npm test
```

L'application fonctionne en JavaScript natif ; elle peut également être servie par un serveur statique HTTP local sans étape de compilation (ne pas ouvrir directement `index.html` en `file://`).

## Jouable aujourd'hui

- Création d'un personnage et choix **mêlée / distance / magie**.
- **Quatre monstres** originaux, débloqués au fil des victoires.
- **Combat automatique** par tours ; possibilité d'enchaîner les combats tant que le jeu reste ouvert et que la santé le permet.
- Expérience, niveaux, santé, repos, or, butin, armes équipables.
- Trois quêtes, récompenses et progression permanente dans le Codex.
- Récolte hors ligne de papiers de rumeur et d'or, **plafonnée à deux heures** dans ce prototype ; réclamation manuelle.
- Inventaire de 16 places initiales (**l'or occupe une place**), agrandissement de +8 places pour 150 or.
- Sauvegarde locale automatique dans le navigateur, export et import JSON avec validations.
- Interface responsive et utilisable sans compte.

## Ce qui vient ensuite

Enrichir l'histoire, ajouter l'artisanat, la banque, la progression profonde, les Renaissances et les accomplissements. Construire **séparément** une API autoritaire et une base de données pour le vrai multijoueur. La progression solo ne doit pas pouvoir fabriquer des ressources sur le marché connecté.

Le modèle commercial envisagé repose sur des crédits spéciaux et un mode rapide sur abonnement. **Aucune fonctionnalité payante n'est implémentée** : cela exige une infrastructure sécurisée, des contrôles côté serveur et une validation juridique avant commercialisation.

## Architecture

- `src/game/data.js` : définitions canoniques des objets, monstres, quêtes et disciplines.
- `src/game/engine.js` : règles et mutations d'état testables sans navigateur.
- `src/main.js` : interface, interactions et sauvegarde locale.
- `src/style.css` : identité visuelle et mise en page adaptative.
- `tests/game.test.js` : tests natifs Node.js sans dépendance de test.
- `docs/` : règles, décisions et feuilles de route du projet.

Les mécanismes et chiffres de cette alpha servent à éprouver la boucle du jeu. Ils ne remplacent pas les décisions documentées concernant les équipements exceptionnels, les bénédictions et la Renaissance.

## Documents de conception

- [Règles de combat](docs/combat.md)
- [Équipements](docs/equipements.md)
- [Économie](docs/economie.md)
- [Progression](docs/progression.md)
- [Renaissances](docs/renaissance.md)
- [Univers et histoire](docs/histoire.md)
- [Décisions et points à arbitrer](docs/decisions.md)

## Build et tests vérifiés (11 octobre 2026)

- `npm test` : 10 tests réussis (moteur et scénario interface).
- `npm run build:standalone` : produit `dist-standalone/index.html` sans installation de dépendances supplémentaire, avec Node.js.
- Test navigateur de la version autonome : affichage PC/mobile, création de personnage et déclenchement de combat effectués, sans exception JavaScript détectée. L'environnement isolé du test ne permet pas de valider la sauvegarde locale persistante.
- Le build Vite classique n'a pas pu être testé dans l'environnement de vérification faute d'accès au registre npm. Le build autonome, lui, a réussi.
- **Sécurité** : les boutons d'import/export sont supprimés, mais les données en `localStorage` restent modifiables. Aucun multijoueur ni achat ne peut être branché sur cet état client. Backend autoritaire obligatoire avant la phase en ligne.

Pour tester immédiatement : télécharger l'archive `L_Eclipse_Blanche_Build_Web_Alpha_0.1.1.zip` fournie dans la conversation, extraire `index.html` et l'ouvrir dans un navigateur. Pour héberger : placer `index.html` à la racine d'un site statique.

## Serveur en chantier — version 0.2.0

Un premier backend Node.js/PostgreSQL est présent dans [server/](server/README.md) : comptes, sessions, premières commandes de jeu calculées côté serveur, verrouillage des actions dans des transactions, journal d'événements et alertes de cadence.

**Attention : le client web actuel reste la maquette solo à stockage local et n'est pas encore connecté à cette API.** Le backend n'est pas prêt pour une ouverture publique ni pour les paiements. Les tests d'intégration PostgreSQL et le build complet n'ont pas été exécutés dans l'environnement de cet échange. Pour lancer l'API localement, lire [server/README.md](server/README.md).

La version 0.2.0 décrit le début de la transition vers une application exclusivement en ligne ; elle ne signifie pas que cette transition est terminée.

## Alpha 0.2.2 — refonte interface (11 octobre 2026)

- Refonte du **combat compact** : héros et manifestation face à face, PV des deux adversaires, choix de la cible, enchaînement et résultat visibles sur desktop sans défilement du panneau central aux résolutions courantes.
- **Inventaire latéral permanent** à droite, avec accès direct aux consommables et à l'équipement compatible ; vue d'inventaire complète toujours disponible.
- **Journal dans le sens chronologique**, ancien en haut, récent en bas, défilement automatique vers les nouveautés.
- Accueil et blocs d'informations réduits ; adaptation mobile testée sans débordement horizontal.
- **Logo officiel fourni par le créateur intégré** dans `public/logo-eclipse.svg` (conteneur SVG avec image WebP intégrée, version réduite) ; aucun visuel d'un autre jeu repris.
- Termes « région » et « rencontres par déplacement » remplacés par le vocabulaire de manifestation/perception. Les paliers R sont un principe narratif validé mais le contenu R0→R20 reste à implémenter.
- Tests de structure ajoutés dans `tests/layout.test.js` ; vérification Chromium locale effectuée sur l'interface desktop/mobile et tests Node de l'alpha effectués.

**Important :** le backend PostgreSQL 0.2.x n'est pas encore relié au client. Les parties de l'alpha restent dans `localStorage`, donc modifiables ; ne pas déployer en jeu public ni activer des achats avant le remplacement par une API serveur autoritaire. Les mécanismes originaux de gameplay restent en construction.

## Audit de l'application de référence — inventaire V1 (11 octobre 2026)

- [Inventaire fonctionnel détaillé](docs/audit/inventaire-fonctionnel.md) : compétences, combat, donjons, boss, équipement, métiers, quêtes, économie, progression, modes et sécurité.
- [Matrice de parité](docs/audit/matrice-parite.md) : état exact de l'alpha vs fonctionnalités visées, critères d'acceptation et ordre de reconstruction React/serveur.

**Précision :** inventaire statique du code fourni, non une validation de parité jouable. L'archive réduite ne contient pas les images externes. La phase suivante consiste à auditer les formules et comportements de chaque système et à construire les tests de reconstruction. Aucun code ni contenu tiers brut n'a été importé dans ce dépôt.

## Audit comportemental du moteur — 11 octobre 2026

L'[audit fonctionnel initial](docs/audit/inventaire-fonctionnel.md) est complété par quatre documents :

- [Compétences, XP, passifs, Renaissance](docs/audit/comportement-competences.md)
- [Combat, équipements et magie](docs/audit/comportement-combat.md)
- [Activités, fabrication, stockage et progression en absence](docs/audit/comportement-activites.md)
- [Contrats de tests de parité](docs/audit/contrats-tests-parite.md)

Ces documents sont des constats techniques d'analyse statique et une spécification de vérification, pas une preuve de compatibilité exécutée ni un transfert du code de référence. Ils soulignent aussi les écarts entre anciens commentaires et règles réellement implémentées.

## Reconstruction React / serveur — version 0.3.0 (11 octobre 2026)

**Le chantier de parité démarre.** Il est disponible à `/parity.html` sans remplacer la sauvegarde locale historique. [Guide de test de la tranche React](docs/lot-01-socle-react-serveur.md).

- 17 compétences à XP indépendants et leur véritable courbe de niveaux.
- 13 emplacements d'équipement et **16 cases initiales d'inventaire** (or inclus).
- React 19 ; création du personnage et progression via API Node/PostgreSQL, non via `localStorage`.
- Première boucle serveur réellement implémentée : extraction, bûcheronnage et pêche ; horloge serveur, progression pendant l'absence et transaction par personnage.
- `server/sql/002_parity_engine.sql` à exécuter **après** `001_initial.sql`. Deux terminaux nécessaires pour API et Vite. Aucune migration automatique de l'ancien personnage n'est effectuée.

**Limites :** les autres 14 compétences sont présentes dans le modèle mais sans leurs moteurs spécifiques. Le combat et l'économie multijoueur ne sont pas implémentés dans cette nouvelle tranche. Le backend n'est pas prêt pour le public ; tests PostgreSQL réels et audit de sécurité à faire. Le prototype précédent reste accessible sur `/` et n'est pas une preuve de parité.
