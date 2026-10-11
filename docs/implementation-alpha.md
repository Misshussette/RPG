# Alpha solo 0.1.0 — état réel de l'implémentation

**Date : 10 octobre 2026.** Cette première tranche est une base **jouable localement**, non destinée à recevoir des paiements ou des comptes connectés.

## Architecture testable

- Définitions d'objets/monstres/quêtes/disciplines centralisées dans `src/game/data.js` avec identifiants pérennes.
- Règles dans `src/game/engine.js` : une fonction d'action reçoit l'état du jeu et renvoie un nouvel état ou une erreur. Pas de mutation de `localStorage` ni de dépendance du DOM dans le moteur.
- Interface utilisateur dans `src/main.js` ; calcul de combat automatique seulement tant que l'onglet tourne. La sauvegarde automatique se fait après chaque action.
- Les objets découverts restent au Codex indépendamment de leur possession actuelle.
- Les quêtes sont validées à partir du compteur de victoires, pas de l'achat d'un objet.

## Limites connues

- Le contenu est un **prototype** : 4 monstres, 3 quêtes et 9 objets. Les dégâts, les prix et les temps sont temporaires.
- Les effets des trois disciplines sont simples et destinés à être équilibrés.
- Le combat n'avance pas en arrière-plan lorsque le navigateur est fermé ; seule la récolte évolue lors d'une absence, jusqu'à 2 heures.
- Les visuels sont des symboles/CSS provisoires. Le logo illustré final et les portraits ne sont pas encore intégrés.
- Aucune Renaissance, bénédiction, banque, vente, achat premium, serveur partagé ou authentification n'est implémentée.
- La sauvegarde est locale, modifiable par l'utilisateur et **ne pourra pas être versée telle quelle** dans une économie multijoueur sans mécanisme de migration sûr.
- La gestion des objets rares perdus faute de place est à améliorer (stockage temporaire prévu avant la bêta) ; le prototype avertit de ce risque.
- Pas encore de sauvegarde synchronisée multi-appareils ni de migration de schéma au-delà de la version 1.

## Lancer

```bash
npm install
npm run dev
npm test
```

## Étapes suivantes suggérées

1. Valider la boucle de combat, rythme et caractéristiques des disciplines sur un premier panel de joueurs.
2. Faire une version visuelle définitive, en utilisant l'identité graphique originale L'Éclipse Blanche.
3. Étendre le contenu narratif et créer les premiers parcours à choix.
4. Ajouter artisanat, banque, progression des activités et protection du butin rare lors des débordements.
5. Modéliser la Renaissance sans remettre en cause les succès permanents et équipements bénis.
6. Construire l'API et PostgreSQL pour le vrai monde partagé. Ajouter Stripe **uniquement côté serveur**, après revue sécurité et conformité.
## Correctif anti-triche — 11 octobre 2026

- Retrait de l'import et de l'export de sauvegarde depuis l'interface de l'alpha. Ce retrait **n'empêche pas** la modification de la sauvegarde locale par un joueur averti.
- Le stockage local est provisoire et non fiable. Les données d'un personnage solo ne doivent jamais être utilisées comme preuve de progression, de récompense ou d'achat en mode connecté.
- Les quatre monstres présents sont uniquement des données de démonstration, **pas** un plafond ou une décision de conception du bestiaire.
- Avant tout lancement connecté : serveur autoritaire pour actions de combat, tirages, récompenses, inventaire, expérience, quêtes, temps hors ligne, crédits premium et transactions ; horloge serveur, transactions atomiques, limitations de cadence, journalisation et idempotence.
- La protection anti-triche du solo entièrement hors ligne ne peut être absolue. Le solo peut rester isolé, sans marché ni transfert vers le multijoueur.
