# Audit comportemental 02 — combat, équipement, magie et protections

**Phase : analyse statique approfondie, 11 octobre 2026.** Source privée : extraction du script JavaScript principal. Références en lignes indicatives de cette extraction hors GitHub. Aucun code tiers réutilisé dans notre moteur.

## C1. Styles de combat : pas de classes permanentes

Quatre styles actifs apparaissent : **Mêlée**, **Distance**, **Magie**, **Défense**. Les trois premières familles déterminent principalement le type d'attaque ; Défense détourne l'expérience de l'attaque vers la compétence Défense, dans les conditions permises par l'équipement.

La vérification effectivement exécutée dans `getValidStylesForWeapon` (~12564) est plus restrictive qu'un ancien commentaire adjacent :

| Arme équipée | Styles autorisés observés | Conséquence |
|---|---|---|
| Aucune / arme de mêlée | Mêlée ou Défense | Monter l'une ou l'autre, sans changer de personnage |
| Arc | Distance | Arc et munitions requis |
| Bâton | Magie | Sort actif applicable selon niveau de magie |

Un commentaire de `getPlayerAtkStyle` (~7201) décrit encore « Défense avec arc/bâton », mais la validation actuelle n'autorise pas cette sélection. **Comportement exécutable prioritaire sur prose ancienne.** Le changement d'arme peut provoquer un basculement automatique du style sans arrêter nécessairement le combat. Une restriction d'arme n'est pas une restriction définitive de progression.

## C2. Quatre notions distinctes en combat

1. **Attaque effective** : attaque de base + contributions des équipements et du niveau de la compétence d'attaque effectivement employée, avec bonus de protections, préparations, ensembles et factions.
2. **Précision / toucher** : fonction de l'attaque effective et de la défense correspondant au style adverse, ajustée par familiers/ensembles ; un hit peut rater ou réussir.
3. **Puissance du coup réussi** : tirage variable de dégâts entre un minimum et un maximum liés aux caractéristiques, à la défense adverse et aux multiplicateurs spécifiques.
4. **Dégâts réellement appliqués** : plafonnés par les PV restants du monstre pour l'expérience ; un coup de 80 sur 3 PV ne rapporte pas 80 points de dégâts utiles.

### Propriétés numériques directement observées

- Bonus d'attaque de la compétence effectivement utilisée : partie entière de **0,4 × son niveau**.
- Probabilité que l'attaque du joueur touche : **minimum 10 %, maximum 95 %**, avant tirage de dégâts.
- Plafond du coup joueur : combinaison approximative `0,55 × attaque − 0,18 × défense adverse`, amplifiée par les passifs pertinents, avec minimum d'un point. La magie multiplie en plus cette valeur par la puissance du sort sélectionné.
- Les **16 sorts** sont répartis en quatre éléments et quatre paliers par élément. Leurs multiplicateurs constatés s'étagent d'environ **×1,00 à ×1,42**, sous prérequis de niveau de Magie ; le sort de base sert de repli si le niveau requis n'est plus satisfait.
- Un coup visuellement identifié comme « critique » est un coup proche du maximum : **l'indication critique n'ajoute pas, par elle-même, un second multiplicateur de dégâts**.
- Le monstre choisit un style d'attaque selon sa liste propre ; sa précision dépend de sa force offensive et de la défense correspondant au style reçu. La probabilité d'attaque ennemie est bornée entre **5 % et 100 %**, puis modifiée par esquive/passifs/ensembles.
- Le plafond du dégât ennemi est atténué par la défense ; le résultat du coup est un tirage de 0 à ce plafond, avec réductions supplémentaires selon passifs et familiers.
- Les coups exécutés sont cadencés autour de **2 secondes** dans la mécanique de référence ; l'interface comporte encore certains affichages estimatifs fondés sur d'autres durées. Vérifier la cadence réelle plutôt que copier un DPS d'interface obsolète.

**Sources :** ~7184–7208, `getSkillDmgBonus` ~12617, `completeCombat` ~13328–13800, `calcHitChance` ~7547, sorts ~980, `updateCombatStats` ~12640.

## C3. Répartition de l'expérience de combat

- **Dégâts utiles** : minimum entre dégâts infligés et PV adverses avant l'attaque. Les dégâts supplémentaires « overkill » ne génèrent pas d'XP.
- Si le coup a réellement infligé des dégâts, l'XP de la compétence active est calculée à partir de **1 XP par point de dégâts utiles**, puis les multiplicateurs d'XP autorisés sont appliqués.
- La compétence Santé reçoit en parallèle **environ un tiers** de cette base, avec ses multiplicateurs et arrondis.
- En style Défense (mêlée), l'XP de frappe est attribuée à Défense plutôt qu'à Mêlée.
- L'XP de l'ancien niveau général est appelée historiquement, mais sa fonction est devenue sans effet.
- **Attention aux divergences visuelles :** cartes et textes narratifs peuvent parler de XP « par monstre », alors que le flux exécuté crédite les attaques efficaces.

**Source :** ~13535–13580.

## C4. Résolution d'un tour — ordre fonctionnel à préserver

1. Vérifier que le monstre existe encore et, pour le boss temporaire, que sa fenêtre n'a pas expiré.
2. Si une protection est active, dépenser la charge de crémation ; éteindre les protections si le solde tombe à zéro **avant le calcul d'attaque du même tour**.
3. Vérifier l'arme et, le cas échéant, les munitions ; sans flèches, interrompre le combat plutôt que produire un coup fantôme.
4. Choisir le style réel d'attaque, vérifier les bonus, tirer toucher puis dégâts, déduire les PV adverses ; consommer une flèche.
5. Calculer le style d'attaque du monstre, toucher puis dégâts entrants selon les défenses appropriées.
6. Attribuer l'XP d'attaque/Santé sur dégâts **efficaces**, avant récompenses de victoire.
7. Appliquer les réductions de dégâts et gérer la nourriture automatique **avant** de subir le coup ennemi : on ne peut pas être « ressuscité » par un repas consommé après une attaque fatale.
8. Appliquer la riposte, les soins restants éventuels, décès ou victoire, progrès de contrat, quêtes, maîtrise, butins et journalisation.

**Point de concurrence serveur :** tous les effets d'un tour doivent appartenir à **une seule transaction** (ou suite d'événements idempotente), jamais à plusieurs écritures indépendantes. Le client n'envoie ni ses dégâts, ni ses PV après coup, ni le résultat RNG.

## C5. Équipement et protection

- **13 types d'emplacements** repérés : arme, casque, armure, main secondaire, anneau, amulette, pioche, hache, canne, jambes, bottes, munitions, dos. L'équipement et les sacs sont des données distinctes.
- Les pièces sont classées en familles de combat pour le calcul de défense *par type d'attaque*. Les anneaux et amulettes octroient en règle générale la défense pleine à tous les styles ; certaines pièces possèdent des valeurs explicitement spécialisées.
- Les armures de mêlée et de distance privilégient une résistance physique, tandis que les tenues magiques privilégient la protection magique : cette répartition peut inclure des **pénalités** sur les styles défavorisés.
- Certains attributs varient avec la rareté, les variantes et les améliorations. Des ensembles donnent des bonus actifs selon les pièces équipées.
- Des **présélections d'équipement** peuvent être mémorisées ; elles ne doivent pas créer des doublons d'objets.
- Changer ou retirer une pièce doit respecter prérequis de niveau et **capacité de transport** : si le sac est plein et que l'objet n'existe pas déjà en pile, la déséquipement est refusé au lieu de faire disparaître l'objet.
- La métallurgie niveau 80 peut ajouter un bonus aux caractéristiques par pièce ; les consommables, factions et ensembles participent aussi aux totaux d'attaque et de défense.

**Source :** `GEAR_SLOTS` ~4494 ; défenses réparties ~7264–7365 ; équipement ~17053–17230 ; `getEquipped*` ~6864–7397 ; sauvegarde des presets ~60–95.

## C6. Magie, prières et survie

- **16 sorts** : quatre familles thématiques, quatre grades chacune ; sélection d'un sort actif suivant le niveau de Magie. Ils modulent la puissance d'une attaque de bâton.
- **21 prières/protections** : niveaux de Crémation requis, bonus orientés Mêlée/Distance/Magie/Défense ou universels.
- Une charge de crémation est consommée par **tour lorsque des protections sont actives**, et non une fois par protection active ; lorsqu'il n'en reste plus, les protections s'éteignent.
- Les PV maximum dépendent du niveau Santé, des familiers et de certains bonus de faction.
- Nourriture automatique : réserve prévue et seuil configurable. L'algorithme peut consommer plusieurs aliments au même tour pour remonter au-dessus du seuil, dans la limite du stock.
- La protection « hardcore » et la logique d'urgence avant décès doivent être revues avec attention pour ne pas créer de soin gratuit ni d'état économique incohérent.

**Sources :** prières ~898–1015, `getPrayerAtk/Def` ~6386, `completeCombat` ~13328, auto-soin ~16890.

## C7. Monstres, donjons et boss : ne pas confondre les objets

- **26 monstres standard** déclarés, avec PV, défense, résistances différenciées, durée, récompenses et niveau requis.
- **10 donjons** : séquences de quatre rencontres, état d'avancement, récompenses de fin, répétition automatique sous conditions, gestion de saturation des stocks.
- **3 boss temporaires** dans la référence : leurs dégâts et PV restent essentiellement dans la sauvegarde locale et **ne constituent pas du vrai multijoueur**.
- Le multijoueur de L’Éclipse Blanche exigera des combats partagés par serveur, une manifestation selon R, des contributions vérifiables et le mécanisme discuté de **seuil collectif par manifestation + seuil individuel + tirage de rareté**. Aucun de ces points n'est déjà implémenté dans la référence.
- Les récompenses des objets exceptionnels restent très rares, même pour un joueur seul et éligible ; objectif d'équilibrage discuté : un R20 suffisamment optimisé peut théoriquement franchir seul le seuil collectif de sa manifestation.

**Source :** catalogues ~1800–2800, donjons ~2401 et fonctions ~28134, ~14458, boss ~28283–29418.

## C8. Contrats de tests du moteur serveur

| Cas | Condition et résultat attendu |
|---|---|
| Style dépendant de l'arme | Sans arme = mêlée/défense ; arc = distance ; bâton = magie, sans perte d'autres compétences |
| Change d'arme pendant combat | Mode actif ajusté ; prochain tour selon nouvelle arme ; aucune prime de loot en double |
| Distance sans flèches | Tour refusé/arrêté ; zéro dégâts, zéro récompense fantôme |
| Magie sans prérequis | Sort avancé refusé ; retour au sort valide plutôt que bonus caché |
| Défense | XP d'attaque affectée à Défense ; Santé évolue également |
| Coup excessif | XP basée sur PV restants ; dégâts bruts préservés seulement à des fins de présentation si souhaité |
| Tirage « critique » | Vérifie que le visuel seul ne multiplie pas les dégâts |
| Soin automatique | Consommation AVANT coup fatal ; aucune résurrection après mort |
| Prières à 1 charge | Charge dépensée ; bonus retirés immédiatement en passant à zéro |
| Sac saturé | Une pièce ne peut être déséquipée si elle ne peut rentrer dans le sac |
| Victoire + double requête | Une seule mise à jour d'XP, d'or, de loot et d'exploit |
| Joueur déconnecté | Combat et activité gérés par horodatages serveur, politique de reprise définie |
| Boss mondial | Récompense impossible sans seuil collectif/individuel ; RNG serveur, classement non suffisant |

**Statut :** audit du flux critique et des branchements principaux réalisé ; audit des variantes, maîtrises de monstres, potions et équilibres extrêmes à poursuivre. Cette note ne fournit pas une preuve d'équivalence complète.