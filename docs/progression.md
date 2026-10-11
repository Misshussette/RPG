# Progression, compétences et récolte hors ligne

## Intention

La progression doit encourager des sessions courtes mais utiles : lancer une activité avant une absence, revenir récolter, fabriquer, avancer une quête et préparer la suite.

## Récolte et activités hors ligne

- Ne pas donner automatiquement une autonomie de **24 heures** dès le départ.
- Le temps maximal de production hors ligne doit être extensible, notamment par des améliorations liées aux activités de récolte/chasse et par des achats **en monnaie du jeu**.
- Scénarios de durée discutés : 2 h ou 4 h au départ, puis 8 h, 12 h, 16 h et éventuellement 24 h. **Aucun seuil n'est validé**.
- L'équilibre doit respecter une journée de travail : une durée initiale trop courte peut frustrer davantage qu'inciter à revenir.
- La question « arrêt à la limite ou production ensuite ralentie » est encore ouverte.
- Ne pas accumuler sans nécessité plusieurs blocages (temps, capacité de boîte de butin, inventaire) qui feraient perdre les gains sans prévenir.

## Compétences et fabrication

- Combat en mêlée, magie, distance ; artisanat ; récolte, et autres compétences encore à définir.
- Certaines fabrications exigent plusieurs ressources (par exemple bois, lingots, monnaie) et des niveaux de compétences intermédiaires.
- Les spécialisations ne doivent pas imposer systématiquement la montée de toutes les autres compétences pour avancer dans l'histoire.
- Les besoins en capacité d'inventaire doivent rester cohérents avec la fabrication et la banque.

## À définir

Liste exacte des compétences, système d'expérience, rythme R0, prix des améliorations, gains hors ligne, stockage et mécanismes d'automatisation.

## Ateliers regroupés et fabrication à partir de l'objet final — piste de conception (11 octobre 2026)

Les compétences restent indépendantes ; plusieurs peuvent être présentées dans un même atelier fonctionnel (mine/fonderie, armurerie, culture/alchimie, etc.). Le joueur pourrait choisir un **produit final** et faire planifier ses sous-recettes, l'acquisition des matériaux, la transformation et la fabrication finale, avec prérequis, coûts, durée et alternatives d'approvisionnement explicites. L'exécution serait **autorisée et persistée côté serveur** ; aucune fabrication ne doit ignorer le niveau minimum ou le bon outil. Référence détaillée : [conception des ateliers et de la fabrication en chaîne](conception-ateliers-production-marche.md). Ce sont des hypothèses à tester après la reconstruction fonctionnelle, **pas des recettes ou valeurs validées**.

## Précision : bûcheronnage et déduction automatique des stocks (11 octobre 2026)

- **Bûcheronnage** reste une compétence complète et indépendante ; atelier d'accès « Forêt & Bois » envisagé. Ses ressources alimentent l'Armurerie (arcs/flèches) et les autres fabrications qui nécessitent du bois.
- Une commande de craft depuis l'objet final doit d'abord vérifier les **lingots/composants déjà disponibles**, puis le **minerai/bois réellement manquant**, et enfin les coûts d'or et outils requis. **Rien à miner si le minerai existant suffit, rien à fondre si les lingots existants suffisent.**
- Tout stock et coût doit être recalculé et consommé une seule fois côté serveur ; prérequis par étape, sans duplication ni modification des règles d'XP des compétences.
- Exemple fictif et méthode dans [la conception des ateliers et fabrications](conception-ateliers-production-marche.md). Les quantités et coûts illustratifs ne sont pas des recettes validées.
