# Conception — ateliers regroupés, fabrication en chaîne, marché et humour vivant

**11 octobre 2026 — pistes exprimées pendant la reconstruction, à confirmer par tests en jeu.**
Cette note précise une **direction de conception**, pas une validation des prix, des recettes, des seuils, des nouvelles monnaies ou des systèmes anti-abus. La priorité reste une parité fonctionnelle riche avec l'application étudiée avant toute suppression de mécanismes.

## 1. Un même moteur riche, moins de menus inutiles

Le joueur doit conserver **les 17 compétences indépendantes** de la reconstruction, chacune avec son XP, ses passifs et ses prérequis. L'interface peut regrouper différents métiers par **lieu, atelier ou résultat recherché** sans fusionner les compétences, ni modifier rétroactivement les calculs d'XP.

Regroupements d'interface envisagés :

| Atelier/lieu visible — noms provisoires | Fonctions réunies | Compétences qui restent distinctes |
|---|---|---|
| Ressources & Fonderie (ou Mine & Fonderie, nom à choisir) | Extraction, **bûcheronnage**, minerais, bois, raffinage et fabrication des lingots ; combustible uniquement si la recette en exige | Extraction, **Bûcheronnage**, Métallurgie ; éventuellement Allumage si la recette y fait réellement appel |
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

## 2 bis. Bois, flèches et équité entre styles de combat — pistes à éprouver

**Constat de la référence auditée** : à distance, le combat vérifie un arc et des munitions puis **consomme une flèche par attaque** ; sans flèches, le combat s'interrompt. En magie, le sort sélectionné est limité par le niveau et modifie la puissance ; le flux audité ne documente **aucun coût de mana ou de composant consommable à chaque attaque magique**. La mêlée n'a pas de consommable par frappe. Les protections alimentées par la Crémation consomment des charges par tour **quel que soit le style utilisé**. Voir [audit de combat](audit/comportement-combat.md). Ne pas inventer un coût magique existant.

### Une chaîne du bois asymétrique selon la destination

- **Allumage direct** : bûche brute → feu. Ne pas ajouter de transformation artificielle obligatoire pour allumer un feu.
- **Fabrication d'arcs et de flèches** : bûche → **bois travaillé / hampes** (transformation facultative selon recette) → flèches avec pointes et/ou plumes selon tier ; bois → composants d'arc → arc. La forme exacte des recettes, le niveau de compétence requis, le nombre de produits par lot et les composants restent **à décider**.
- Éviter d'exiger un **lingot** pour chaque flèche ordinaire dès le début : privilégier, à tester, des flèches simples sans métal, fabriquées en lots importants, puis des projectiles spécialisés plus chers et puissants.
- La catégorie d'interface **Ressources & Fonderie** peut réunir extraction et bûcheronnage, sans les fusionner en compétence ; l'Armurerie utilise ces stocks sans les dupliquer.

### Asymétrie équitable plutôt que coût identique

| Style | État de la référence auditée | Options propres à notre jeu, NON VALIDÉES |
|---|---|---|
| **Distance** | Arc et flèches indispensables ; une flèche dépensée par attaque | Flèches simples obtenues facilement en gros lots ; **récupération partielle** de munitions après combat ; munitions de qualité avec recettes avancées, effets spécifiques et vrai coût d'opportunité. |
| **Mêlée / Défense** | Arme sans munition par coup | Risque de proximité et consommation de soin comme contrainte principale ; éventuellement **usure réparable** à une fréquence faible, seulement si cela apporte du jeu et non de la corvée. |
| **Magie** | Bâton, sorts conditionnés par niveau ; aucun coût de mana par attaque prouvé dans le flux audité | **Ressource d'énergie qui se régénère** ou charges spécifiques pour sorts très puissants, buffs, effets de zone ; éviter d'obliger à récolter un composant commun à chaque attaque. |

**Arbitrage du 11 octobre 2026 :** le créateur souhaite **conserver la véritable chaîne de production et la consommation des flèches** comme identité contraignante mais appréciée de l'archer. Les facilités automatiques envisagées plus haut (lots beaucoup plus généreux, flèches ordinaires gratuites, récupération partielle) **ne sont pas validées** et ne doivent pas être appliquées d'office. Rééquilibrer prioritairement les **contraintes de préparation et d'utilisation de Mêlée et Magie**, plutôt que gommer la complexité du style Distance. L'équité s'évalue en efficacité/coût/temps de préparation, pas en copiant la même ressource sur trois classes.

### Tests d'équilibre à mener avant validation

Mesurer en solo et en coopération, sur des rencontres comparables et avec équipement de même palier :

- **Dégâts efficaces / heure réelle** = dégâts infligés en tenant compte de la précision, des cadences, des morts et du temps de préparation/approvisionnement.
- **Coût en or, ressources et temps** par combat, par heure d'activité et par boss pour chaque style : soins, réparation éventuelle, consommables, flèches perdues/récupérées, disponibilité du stock.
- Progression XP/heure, temps d'arrêt, survie, capacité à enchaîner les combats, rôles et complémentarité en boss ; efficacité en début R0 puis à plusieurs paliers R et niveaux d'équipement.
- Contrôle des cas où les projectiles sont gratuits/récupérables (absence de création d'objets ni exploitation de la récupération), où le joueur change de style et où les recettes consomment du stock intermédiaire.
- Une option « fabriquer automatiquement les flèches manquantes » doit rester soumise au **plan de production et aux prérequis serveur** décrits plus haut, avec accord sur les achats ; aucun approvisionnement virtuel offert en plein combat.

**À arbitrer avec le créateur :** existence et forme d'une ressource magique, usure des armes, taux de récupération des flèches, fabrication de hampes, quantité de projectiles par recette, avantages tactiques propres aux styles et seuils de rééquilibrage. **Aucune de ces valeurs n'est validée par cette note.**

## 2 ter. Équilibrage des styles — validation usure de Mêlée, exploration du coût magique

### Décisions de principe approuvées le 11 octobre 2026

1. **Distance :** conserver le besoin d'un arc, d'un stock de flèches, de l'extraction/bûcheronnage/fonderie/fabrication selon les recettes, et la consommation des munitions. Ne pas imposer une simplification automatique de cette logistique ni changer les valeurs avant des tests.
2. **Mêlée :** ajouter une **durabilité / usure réelle** des armes au combat, une possibilité de **réparation**, et surtout des voies pour **améliorer la résistance** de façon sensible via Métallurgie/Armurerie/maîtrise/améliorations. Les coûts exacts, la fréquence, l'effet d'une arme à 0 et le traitement des armures restent à définir. Ne pas détruire silencieusement un équipement rare ou béni. Ne pas permettre d'améliorer les armes exceptionnelles de boss qui sont, par décision antérieure, **non améliorables** ; elles exigent une règle spéciale de durabilité, à arbitrer.
3. **Magie :** choisir un **coût d'usage exigeant et original**, inspiré de contes ou de folklore (pactes, tabous, noms vrais, dette, rituels), **plutôt qu'une simple jauge de mana copiée**. **Aucun mécanisme précis n'est encore validé**, aucun ajout au moteur sans nouvel accord.
4. **Ne pas supprimer les choix de combat existants** pendant l'étude : le catalogue audité contient 16 sélections de sorts (4 familles et 4 paliers) modulant une attaque de bâton, mais cette diversité **n'établit pas 16 actions de sorts indépendantes**. Vérifier en jeu ce que le créateur désigne comme « un sort non identifié mais utilisable », et préserver la parité avant d'étendre le système.

### Proposition à débattre : la Dette Occulte, coût cumulatif narratif

- Chaque attaque magique alimente une **Dette Occulte / instabilité rituelle** selon le sort, le bâton, les maîtrises et les événements. Les attaques de base restent utilisables ; les rituels puissants alourdissent davantage la dette.
- À des seuils visibles, la dette entraîne des **contraintes progressives** (perte de maîtrise, risque d'incident, efficacité moindre ou impossibilité provisoire d'utiliser les sorts avancés), jamais un coup de dés punitif et inexplicable qui supprime tout l'équipement.
- La dette peut être **apurée volontairement** par repos limité, rituel, contrepartie ou composant ; la préparation des rites implique métiers et ressources (culture pour composants, artisanat de catalyseurs, découverte de véritables noms, pactes), sans obligation d'ajouter de multiples monnaies ou barres.
- La maîtrise et l'équipement peuvent **augmenter la tolérance, réduire le coût, sécuriser des rites ou rendre l'apurement plus efficace**. Un mage expérimenté gagne en autonomie comme le guerrier renforce la solidité de sa lame.
- Variante mythologique : à certains niveaux, **vrais noms, pactes et tabous** peuvent autoriser des effets spéciaux conditionnels, avec promesse tenue ou rupture volontaire. Ne pas constituer un système aléatoire permanent de sanctions incompréhensibles.
- La mécanique doit être **suivie côté serveur**, avec un état stable au redémarrage, une progression en l'absence, et des explications lisibles sur les conséquences. Vérifier les combats enchaînés, la possibilité de rester utile sans préparation, et le fait que le mage ne soit pas à la fois moins puissant et plus onéreux.

### Comparaison de la charge réelle (à simuler)

**Archer :** consommation de flèches + temps de production + usage de l'arc. **Guerrier :** usure des armes, matériaux et temps de réparation, investissements de renforcement. **Mage :** dette ou autre prix rituels, temps et composants de purification, maîtrises du grimoire. Comparer efficacité et autonomie en début R0, milieu R et fin de cycle ; ni pénalité identique ni « trois corvées interchangeables ».

Les idées de **Dette Occulte**, tabous, vrais noms et système de sort restent des propositions, pas des règles entérinées. Toute extension de la magie doit rester compatible avec le socle auditée, et avec les éléments mythologiques **originaux** de L’Éclipse Blanche.

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
