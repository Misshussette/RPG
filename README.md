# L’ÉCLIPSE BLANCHE — Première alpha solo

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
