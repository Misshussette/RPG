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

## Contraintes de styles, progression indirecte et combat en absence — décision de principe (11 octobre 2026)

Le créateur souhaite **conserver la complexité de l'archer** (stocks de flèches à préparer et à dépenser), ajouter une **usure de mêlée réparable avec résistance améliorable**, et développer pour le mage un **prix occulte à gérer** dont le concept de « Dette Occulte » est approuvé dans son principe, avec mécanismes exacts encore à définir.

**Observation structurante** : ce qui semblait pénible dans la référence sert aussi d'incitation à pratiquer les métiers associés. Conserver cette **synergie** sans que le joueur soit contraint de monter *toutes* les compétences pour progresser en Renaissance. L'artisanat autonome et le marché doivent être des stratégies complémentaires, pas un passage forcé ni une façon d'acheter directement un fait d'armes.

### Combat idle : danger réel mais lisible

- Une session de combat en absence n'est **pas garantie gagnante** : épuisement des munitions, perte de résistance/rupture de l'arme, dette occulte excessive peuvent diminuer les chances de survie et mener à une défaite réelle si le joueur a pris ce risque.
- Afficher les **stocks, durabilité, dette, soins et autonomie estimée** avant le lancement, ainsi que les risques possibles ; cette estimation n'est pas une promesse d'un nombre exact de combats victorieux.
- Les modes de **réaction à un seuil** (arrêt du combat à X flèches restantes, à Y de durabilité, à Z de dette, PV faibles) sont une option de conception pour valoriser la préparation et l'automatisation ; les détails et leur disponibilité/conditions restent à arbitrer. Une stratégie sûre peut sacrifier le rendement sans supprimer la possibilité de prise de risque.
- Moteur serveur autoritaire même en absence ; journaliser les événements, les dépenses, les interruptions, les dégâts, les morts et pertes suivant les règles décidées. **Pas d'immunité implicite au retour en ligne**, ni de sanctions aléatoires incompréhensibles ou de duplication de gains.
- Ne pas transformer ces mécaniques en triple corvée : tester le **temps effectif de préparation, la survie, les ressources, l'XP/heure réelle et l'autonomie** des trois styles à puissance comparable, y compris bas niveaux et différentes R.
