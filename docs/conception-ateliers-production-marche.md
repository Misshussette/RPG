# Conception — ateliers regroupés, fabrication en chaîne, marché et humour vivant

**11 octobre 2026 — pistes exprimées pendant la reconstruction, à confirmer par tests en jeu.**
Cette note précise une **direction de conception**, pas une validation des prix, des recettes, des seuils, des nouvelles monnaies ou des systèmes anti-abus. La priorité reste une parité fonctionnelle riche avec l'application étudiée avant toute suppression de mécanismes.

## 1. Un même moteur riche, moins de menus inutiles

Le joueur doit conserver **les 17 compétences indépendantes** de la reconstruction, chacune avec son XP, ses passifs et ses prérequis. L'interface peut regrouper différents métiers par **lieu, atelier ou résultat recherché** sans fusionner les compétences, ni modifier rétroactivement les calculs d'XP.

Regroupements d'interface envisagés :

| Atelier/lieu visible — noms provisoires | Fonctions réunies | Compétences qui restent distinctes |
|---|---|---|
| Mine & Fonderie | Extraction, raffinage des minerais, fabrication des lingots ; combustible uniquement si la recette en exige | Extraction, Métallurgie ; éventuellement Allumage si la recette y fait réellement appel |
| Forêt & Bois | Coupe des arbres, production de bûches et autres ressources forestières ; accès à leur utilisation dans les recettes | **Bûcheronnage**, compétence indépendante, à ne pas oublier ni fondre dans l'Artisanat |
| Armurerie | Armes, armures, arcs, flèches, assemblages ; forge conventionnelle ; consommation de bois et lingots déjà produits | Métallurgie pour les objets métalliques, Artisanat, Arcs et flèches ; le Bûcheronnage reste acquis à l'étape de collecte |
| Culture & Alchimie | Culture, récolte, préparation de potions et mixtures | Culture et autres compétences pertinentes selon les recettes ; alchimie à concevoir, pas à créer artificiellement comme une 18e compétence |
| Cuisine & Pêche | Pêche, transformation des prises, plats et consommables | Pêche et Cuisine |
| Rituels & Feux | Feux, os, protections et préparations | Allumage, Crémation, Magie selon action |
| Contrats / Chasse | Contrats et récompenses associés | Chasse, progression de combat sans classes exclusives |

Les opérations sont classées **une fois** dans un catalogue de recettes/actions : le lieu affiché est une projection de cette référence unique, pas un second métier ou une copie de la recette. La Forge des Nains pourrait constituer une capacité avancée d'un même domaine, révélée ou perfectionnée selon la progression R, mais ses seuils (R1, R5, etc.) restent **non validés**.

**Important :** simplifier l'organisation doit **réduire les clics**, pas les recettes, le nombre de systèmes, les passifs, les risques, la difficulté ou la diversité stratégique.

## 2. Fabrication depuis l'objectif final (« fabriquer ceci »)

L'utilisateur sélectionne le **résultat désiré** (p. ex. une armure en diamant, exemple fictif), choisit une quantité, et le serveur construit un **graphe de dépendances de recettes** : matières premières → lingots/composants → équipement fini. La commande permet de résoudre automatiquement les opérations intermédiaires autorisées, au lieu d'obliger le joueur à changer de menu.

### Priorité absolue : stocks existants et chemin minimal

**La fabrication commence par les ressources déjà possédées, jamais par une récolte systématique.** Le moteur doit raisonner **depuis le résultat final vers les ingrédients**, puis organiser uniquement les étapes manquantes dans l'ordre possible :

1. Déterminer la quantité exacte du produit final et consulter ses recettes canoniques (versions et prérequis compris).
2. Déduire **d'abord les objets finis et composants intermédiaires disponibles** du besoin de chaque étape. Si un joueur possède les lingots suffisants, ne pas refondre du minerai ; s'il a déjà le minerai nécessaire à la production des lingots manquants, ne pas miner davantage.
3. Déduire le minerai, le bois et les autres matières premières encore disponibles seulement pour les étapes réellement nécessaires ; ne pas consommer deux fois un même stock si plusieurs sous-recettes utilisent cet ingrédient.
4. Pour le **déficit résiduel seulement**, proposer les actions de production/récolte autorisées ou des achats explicites. Ne pas déclencher d'achat ni de prélèvement d'or non confirmé.
5. Vérifier pour **chaque étape à exécuter** les niveaux de compétence, outils, ressources auxiliaires et coûts en or ; calculer le temps restant, les XP attribuées par métier et la destination du produit final.
6. Le plan obtenu est **recalculé sous transaction** au démarrage à partir des stocks disponibles à cet instant, avec réservation/débit atomique. Une simulation d'interface ne verrouille pas les ressources. Si un stock ou un prix a changé, demander une nouvelle confirmation avant toute opération non autorisée.

**Exemple purement fictif de recette**, à ne pas imposer comme équilibrage : une armure requiert **5 lingots et 100 or** ; un lingot exige **2 minerais**. Le joueur possède **2 lingots, 8 minerais et 150 or**.

| Ressource / action | Nécessaire pour l'armure | Déjà disponible | Action réelle |
|---|---:|---:|---|
| Lingots | 5 | 2 | Fabriquer **3 lingots**, pas 5 |
| Minerais pour les 3 lingots | 6 | 8 | **0 minerai à extraire**, utiliser 6 minerais |
| Or pour l'armure | 100 | 150 | Débiter **100 or** à la fabrication |
| Armure | 1 | 0 | Fabriquer **1 armure** après production des 3 lingots |

Solde théorique des matières, **si aucun autre coût n'existe** : 2 minerais restants, 0 lingot restant, 50 or restants, 1 armure obtenue. Si le joueur possède déjà **5 lingots et les 100 or**, il passe **directement à la création de l'armure**, sans minage ni fonderie. Si le joueur a 2 lingots et **4 minerais**, alors seuls **2 minerais** manquent : l'extraction devient la première étape. Ce calcul doit aussi tenir compte du bois ou du combustible **uniquement si la recette en exige**, et des quantités autorisées en banque lorsque cette fonctionnalité sera validée.

L'usage des ressources disponibles n'autorise pas à ignorer les **prérequis de la fabrication finale**, même si les étapes intermédiaires sont devenues inutiles. Une compétence de bûcheronnage basse n'a pas à bloquer une armure qui n'utilise pas de bois. À l'inverse, une recette d'arc utilisant du bois doit pouvoir lancer la coupe **seulement pour les bûches manquantes**, puis passer à la fabrication des arcs/flèches en conservant leurs XP distinctes.

### Avant confirmation

- Afficher chaque étape, le nombre de ressources nécessaires, les stocks disponibles, les matériaux à produire/acheter et les quantités manquantes.
- Calculer les prérequis **par étape** : niveau réel de la compétence, outils et niveau d'outil, recettes découvertes, coûts, consommables, temps et déblocages particuliers.
- Proposer des **alternatives explicites** : produire, utiliser le stock autorisé (sac/banque selon règle future), acheter au marché, ou mettre la commande en attente si l'acquisition échoue.
- Montrer la durée estimée **de toute la chaîne**, en distinguant estimation et temps garanti ; indiquer les gains d'XP dans chacune des compétences concernées.
- Identifier tout blocage, y compris un outil trop faible. Une pioche médiocre peut ralentir fortement l'extraction **si elle satisfait les prérequis minimaux** ; pas de contournement implicite d'un seuil de niveau ou d'outil.
- Ne pas acquérir des objets ou engager des dépenses irréversibles par un clic de prévisualisation.

### Exécution

- Moteur serveur autoritaire : plan de production stocké (ID, propriétaire, recette/version, étapes, quantités, état, coûts, horodatages), file d'attente, transitions contrôlées ; pas de minuterie du navigateur faisant autorité.
- Regrouper/réutiliser les stacks d'un même objet ; conservation stricte des quantités et provenance des équipements individuels. **Une donnée/identité canonique, aucune duplication** entre inventaire, banque, équipement, marché et file de production.
- Réserver les ingrédients de façon atomique au moment approprié ; ne jamais consommer deux fois un lot au redémarrage, à la reconnexion ou entre deux appareils.
- Exécution hors présence dans les limites des règles de production débloquées ; traitement des arrêts, files saturées, outils invalidés, changements de recette/bonus et inventaire plein.
- Prévoir arrêt, pause, reprise et annulation avec règle d'utilisation/remboursement **étape par étape**, affichée avant confirmation ; enregistrement d'événements et idempotence.
- Les matériaux achetables au marché ne sont **pas garantis disponibles** au prix affiché lors de la prévisualisation ; accepter explicitement un prix limite ou arrêter la commande avant tout achat non autorisé.
- Éviter les boucles de dépendance dans les recettes et plafonner le travail serveur par commande.

**Tests prioritaires :** prérequis insuffisant, pioche admissible mais lente, stock déjà en banque, achat partiel, même matière requise par deux étapes, deux commandes simultanées, déconnexion, redémarrage serveur, recette rééquilibrée, annulation, dépassement de capacité et absence de gains doublés.

## 3. Marché et enchères : choix à arbitrer

Objectifs du créateur :
- Marché accessible aux nouveaux joueurs, sans captation systématique par les vétérans.
- Offre et demande perceptibles, prix de référence compréhensibles.
- Éviter les annonces artificiellement à zéro et l'inflation abusive de la spéculation.
- Possibilité de proposer **un prix élevé sans plafond arbitraire absolu** si un acheteur est réellement consentant.
- Détecter les transferts déguisés via guildes, comptes liés ou multi-comptes, sans punir mécaniquement tout échange atypique.

### Distinguer les prix au lieu d'un seul chiffre

- **Prix de référence** : valeur d'équilibrage pour un objet standard, pas nécessairement sa « vraie valeur » de marché.
- **Plancher éventuel d'annonce entre joueurs** : proposition du créateur de ne pas descendre sous la référence (ex. minerai à 500 or → annonce ≥ 500). À tester : un prix plancher rigide peut empêcher les nouveaux joueurs de vendre des ressources surabondantes et figer les marchés.
- **Prix du marchand/PNJ** : mécanisme distinct, éventuellement réduit d'une valeur ou d'un pourcentage en cas de surplus (ex. réduction de 0–50 or sur une base de 500, **simple illustration**). Attention à bien distinguer prix d'achat auprès du marchand et **prix de rachat** du joueur.
- **Prix libre entre joueurs / enchères** : pas de plafond supérieur demandé, mais affichage de l'historique, de la quantité et de la médiane des transactions comparables lorsque les données sont suffisantes ; des prix extrêmes peuvent demander des contrôles supplémentaires plutôt qu'un blocage automatique.
- Ajustement offre/demande selon **échanges conclus et stocks pertinents**, avec bornes et protection contre manipulation par faux volumes. Les annonces affichées seules ne doivent pas orienter intégralement la courbe.
- Impossible de concevoir un marchand achetant une ressource plus cher qu'il ne la revend dans les mêmes conditions : prévoir écart, frais et protections contre les cycles automatiques de profits infinis. Les fourchettes et planchers exacts sont à simuler.

### Garde-fous anti-transferts artificiels

Un plancher de prix n'empêche **pas** qu'un complice achète un minerai à 50 000 or pour lui transférer de l'argent. À prévoir dans le backend :
- Registre immuable / traçable des ordres, ventes, achats, taxes, versements, transferts de propriété et retraits ; opérations atomiques, idempotentes, conservation des monnaies.
- Surveillance de l'écart prix/médiane **et du contexte** (ancienneté, volume réel, rareté, historique, répétition, prix extrêmes, circulation entre groupes de comptes) ; pas de médiane trompeuse pour objets très rares.
- Détection de schémas d'achats croisés, d'enrichissement concentré, de ventes sans logique économique et de manipulation par ordres factices. Les indices de comptes liés doivent être traités avec respect de la vie privée, sans présumer qu'une même IP prouve la fraude.
- Selon gravité et politique annoncée : avertissement, attente de règlement pour transactions très risquées, restrictions temporaires des transferts, revue humaine, recours et journal des décisions ; **pas de bannissement automatique sur un prix seul**.
- Faciliter les échanges honnêtes entre amis/guildes sans créer des canaux illimités pour fabriquer ou blanchir de l'or.
- Expérience débutant : achat/vente simple avec prix affichés, puis ordres avancés et enchères facultatives ; aucune obligation de comprendre la spéculation pour progresser.

**Décisions non prises :** plancher absolu ou dynamique, politique PNJ, frais, ajustement offre/demande, qualité/rareté, historique public, ordres d'achat, limite de transactions, rôle des guildes, garde-fous des comptes récents, plafonds de risques, fiscalité du marché.

## 4. Univers déjanté sans humour répétitif

L'univers « heroic fantasy absurde » doit garder un **jeu profond et exigeant** : le comique est une couche narrative, pas une diminution de la difficulté.

- Humour **contextuel** lié au métier, à l'objet, au monstre, à la Renaissance, à l'histoire et à l'évolution du personnage ; pas un texte drôle répété à chaque minute de récolte.
- Bibliothèque d'événements écrits avec variantes, rareté, conditions de déclenchement, conséquences et temps de repos ; persistance des événements déjà vécus.
- Éviter de recycler la même plaisanterie sous vingt noms ; mélanger surprises, retournements, running gags évolutifs et instants plus sérieux pour créer du contraste.
- Exemples de ton à inventer ultérieurement : outils prétentieux, matériaux qui contestent leur recette, forgeron syndiqué contre les armures trop brillantes, monstres plus convaincus de leur propre légende que dangereux. Ce sont des exemples de direction, pas des textes définitifs.
- Un même système de fabrication reste mécaniquement rigoureux même si ses descriptions et conséquences sont absurdes.
- Ne pas reprendre des textes, noms ou personnages protégés d'autres univers.

## 5. Ordre d'application

1. **Reconstruction quasi complète du comportement de référence** sur la stack serveur locale React/Node/PostgreSQL, avec modules authentiquement jouables et tests.
2. Dans cette reconstruction, prévoir le **modèle canonique de recettes/objets/transactions/états de déblocage** suffisamment souple pour permettre les regroupements et les commandes de fabrication, sans deuxième refonte de base.
3. Faire ensuite l'**audit UX avec le créateur** : « on garde / on déplace / on retire / on ajoute » à partir d'un jeu réellement riche, pas des trois récoltes de la démo.
4. Valider séparément les règles du marché, des jetons, des paliers de Renaissance et des déblocages avant de les coder en production.

Rappel : **R0 ne doit pas obligatoirement tout accomplir**. Voir [renaissance.md](renaissance.md) pour la découverte progressive de capacités, et [economie.md](economie.md) pour les règles déjà décidées.
