# Organisation générale V1 — revue en jeu

**Version cible 0.3.3 — première organisation visible dans l'interface React de reconstruction.**
La **référence privée** sur `127.0.0.1:4174` est conservée **intacte** pour comparer les fonctions. Cette version de l'interface n'est **pas** une copie complète des écrans et comportements de la référence ; seule la navigation et la présentation des ateliers changent dans `/parity.html`.

## Navigation du personnage

| Entrée de navigation | Compétences consultables (XP toujours séparés) | Actions actuellement jouables |
|---|---|---|
| Vue générale | Les 17 compétences | Miner, couper, pêcher |
| Combat & Donjons | Mêlée, Distance, Magie, Défense, Santé | Aucune pour l'instant |
| Ressources & Fonderie | Extraction, Bûcheronnage, Métallurgie | **Veine terne**, **Bosquet bavard** |
| Armurerie | Métallurgie, Artisanat, Arcs et flèches | Aucune pour l'instant |
| Pêche & Cuisine | Pêche, Cuisine | **Bassin douteux** |
| Culture & Alchimie | Culture | Aucune pour l'instant |
| Feux & Rituels | Allumage, Crémation | Aucune pour l'instant |
| Chasse & Contrats | Chasse | Aucune pour l'instant |
| Larcins | Vol | Aucune pour l'instant |

*La Métallurgie apparaît dans les deux ateliers, **mais reste une seule compétence** : même identifiant, même XP et mêmes futures recettes canoniques. La navigation n'introduit aucune nouvelle compétence.*

## Décisions à conserver pour les itérations fonctionnelles

1. **Ressources & Fonderie** rassemble extraction, bûcheronnage, transformation du minerai ; bûches brutes utilisables directement pour allumage.
2. **Armurerie** regroupe fabrication d'équipements, travail des armes, arcs/flèches et métallurgie de fabrication. Il ne s'agit pas de supprimer les métiers originaux ni leurs XP.
3. **Culture & Alchimie** : potions et préparation à concevoir sans ajouter une 18e compétence sans décision. Pêche/Cuisine et Feux/Rituels restent accessibles ailleurs.
4. **Commande depuis le produit final** : déduire d'abord les stocks de composants finaux (lingots), puis les matières brutes (minerai/bois) ; ne produire que les manques, vérifier niveaux/outils/or, éviter tout achat silencieux. Fonction **non encore implémentée**.
5. **Mêlée, Distance, Magie** : garder les contraintes de flèches ; prévoir usure réparable de mêlée et voie de Dette Occulte pour mage, sous réserve d'équilibrage. Non encore implémentés.
6. **Renaissance** : difficulté via choix, défis et histoire sans obligation de toutes les compétences à 100.
7. **Survie et revanche** : sac pillé par le monstre, revanche spéciale optionnelle, **3 refus explicites maximum** avant perte définitive du sac ; pas d'impact si une invitation est manquée en idle. Hardcore volontaire après expérience, batailles de guildes non létales.
8. **Marché** : offrir un marché lisible et une économie anti-transferts ; prix non validés.
9. **Navigation, pas promesse** : une fonctionnalité non jouable ne doit pas afficher un bouton d'action factice. Le statut « À reconstruire » demeure tant que le moteur, l'API et la persistance ne passent pas des tests.

## Essai local

1. Démarrer PostgreSQL Docker et l'API Node.js existants (aucune migration nouvelle).
2. Mettre à jour le dépôt et vérifier `npm test` et `npm run build`.
3. Ouvrir `http://localhost:5173/parity.html` ; cliquer **Ressources & Fonderie** pour voir extraction et bûcheronnage, **Pêche & Cuisine** pour pêcher, **Armurerie** pour les trois compétences associées ; revenir à **Vue générale** pour afficher toutes les compétences.
4. Vérifier que l'activité en cours persiste lors d'un changement de menu, que l'inventaire/équipement ne bouge pas et que l'XP d'une compétence n'est pas dupliquée.
5. Comparer le parcours avec la référence privée, puis noter par section : **Garder / Déplacer / Fusionner uniquement dans la navigation / Ajouter / Retirer après validation**.

**Limite assumée** : la V1 teste l'organisation et non les mécaniques non reconstruites. L'organisation servira ensuite de cadre à l'implémentation des modules complets, avec recettes et transactions serveur uniques.
