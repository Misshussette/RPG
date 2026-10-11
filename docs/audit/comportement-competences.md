# Audit comportemental 01 — compétences, XP, passifs et Renaissance

**Phase : analyse statique approfondie, 11 octobre 2026.**  
**Source privée :** script JavaScript principal extrait du HTML fourni par le créateur (environ 79 360 lignes). Les numéros ci-dessous désignent les lignes de cette extraction conservée hors GitHub. Les descriptions sont des analyses de comportement ; aucun code ni contenu narratif tiers n'est reproduit dans le dépôt.

**Statut :** règles repérées dans l'implémentation, non encore validées en jeu réel. Les nombres sont des constats de référence, pas des choix automatiques d'équilibrage de L’Éclipse Blanche.

## P1. Identité du personnage et les 17 compétences

Un personnage dispose simultanément des **17 compétences** suivantes, chacune avec un total d'XP propre et un niveau calculé :

| Compétence canonique de reconstruction | Identifiant fonctionnel à prévoir | Relations constatées |
|---|---|---|
| Mêlée | `melee` | Arme de contact, précision/dégâts, XP par coup |
| Distance | `range` | Arc + munitions, dégâts, XP par coup |
| Magie | `magic` | Bâton + sort, puissance du sort, XP par coup |
| Défense | `defence` | Défense contre attaques, parade/esquive, entraînement avec arme de mêlée |
| Santé | `hitpoints` | PV maximum, XP liée aux dégâts efficaces infligés, consommation alimentaire |
| Extraction | `mining` | Gisements, pioche, minerais, gemmes, métallurgie |
| Métallurgie | `smithing` | Minerais/lingots, fabrication d'équipement, armes et armures |
| Bûcheronnage | `woodcutting` | Hache, bûches, combustibles, fabrication d'arcs |
| Allumage | `firemaking` | Bois, feux actifs, bonus globaux d'XP et de vitesse |
| Pêche | `fishing` | Canne, poissons crus, matière première de cuisine |
| Cuisine | `cooking` | Poissons crus vers aliments soignants, passifs de soin |
| Crémation | `cremation` | Os, charges de prière, bonus d'XP de crémation |
| Artisanat | `crafting` | Ressources composites, tenues, bâtons/accessoires |
| Chasse | `hunting` | Contrats de monstres/donjons, points, améliorations |
| Vol | `thieving` | Échoppes, chance d'échec, garde, butin, risques pour les PV |
| Fabrication d'arcs/flèches | `fletching` | Bois/lingots, arcs, flèches et compatibilités |
| Culture | `cultivating` | Semis, récoltes, transformations, préparations temporaires |

**Confirmation importante :** aucune des 17 compétences ne disparaît lors de la création d'un personnage. Un équipement peut limiter temporairement les styles de combat valides, sans bloquer l'apprentissage des autres compétences à long terme.

**Source :** état initial lignes ~60–80 ; liste des compétences ~827 ; calcul `skLv` ~812 et gestion d'XP ~17247.

## P2. Plusieurs indicateurs de niveau — ne pas les fusionner

1. **Niveau d'une compétence :** dérivé des XP de cette compétence, compris entre 1 et 100.
2. **Niveau total :** somme des 17 niveaux, de 17 à 1 700 ; sert à la progression transversale et aux rangs.
3. **Niveau de combat :** partie entière de la moyenne des cinq niveaux `melee`, `range`, `magic`, `hitpoints`, `defence`. Sert notamment aux accès de combat.
4. **Ancien niveau de personnage :** encore stocké sous forme de champ historique, **mais le versement d'XP général est explicitement neutralisé** (`addPlayerXP` sans effet actif). Ce champ n'est pas une progression fiable à reproduire.

**Exemples reproductibles :** nouveau personnage = 17 niveaux totaux et niveau de combat 1 ; cinq compétences de combat à 100 = niveau de combat 100, même si tous les métiers restent à 1.

**Source :** ~827–836, `addPlayerXP` ~17316, niveau de combat ~22478.

### Courbe d'XP observée

La table contient 100 seuils cumulatifs ; l'expérience débute à 0 pour le niveau 1. La croissance utilise un terme exponentiel de base 2 dont le diviseur est 7,5, auquel s'ajoute un terme linéaire, puis la somme cumulée est divisée par quatre et tronquée. **Seuils calculés à partir de la formule exécutée** :

| Niveau obtenu | XP cumulée minimale |
|---|---:|
| 1 | 0 |
| 2 | 82 |
| 10 | 1 112 |
| 25 | 7 030 |
| 50 | 78 144 |
| 75 | 793 020 |
| 90 | 3 172 877 |
| 95 | 5 036 659 |
| 99 | 7 289 384 |
| 100 | **7 995 169** |

La source contient des commentaires parlant approximativement de 7,3 ou 8,5 millions : **la valeur exécutée n'est ni l'une ni l'autre**. L'application de référence doit être traitée comme un comportement, et non comme une spécification forcément cohérente dans ses commentaires. Après niveau 100, un objectif d'affichage de 100 millions d'XP existe, sans signifier un niveau 101.

**Source :** ~1–57.

## P3. Attribution de l'expérience et ordre des bonus

- Chaque récompense d'une activité calcule son XP avec des bonus **propres à l'activité** puis un multiplicateur global d'XP (`getXPMult`).
- Les améliorations, familiers, événements, factions et certains passifs s'ajoutent ou se multiplient selon leur catégorie. **Ce n'est pas un unique pourcentage applicable naïvement à tout.**
- Les trois feux actifs apportent respectivement des facteurs **×1,05**, **×1,15** et **×1,20**, qui se combinent par multiplication ; les paliers du niveau d'allumage peuvent ajouter **×1,10 / ×1,25 / ×1,40 / ×1,50** à partir des niveaux 10/50/80/95 (un seul palier de niveau retenu).
- Le mode *normal* produit ×1, le mode *difficile* ×0,5, le mode *rapide* ×2. Le mode s'applique **à l'amont** de `addSkillXP` via les fonctions appelantes : le réappliquer à la fin doublerait le bonus/malus.
- `addSkillXP` applique ensuite, le cas échéant, le météore propre à la compétence (×2, arrondi inférieur) et la Renaissance (facteur **1 + 0,5 × R**, arrondi inférieur). L'ordre des arrondis compte.
- L'arrondi commun de nombreuses récompenses d'activité est l'entier le plus proche, avec un minimum de 1 XP pour une action positive ; le combat utilise son propre arrondi supérieur (voir audit combat).
- Certains consommateurs historiques versent encore de l'XP au champ général, devenu sans effet : ne pas en déduire un second niveau actif.

**Source :** `getXPMult` ~7623–7730 ; `_modeXpMult` ~7732 ; `_xpRound` ~7747 ; `addSkillXP` ~17247–17325 ; Renaissance ~8580.

**Adaptation retenue :** notre Fast Mode dépendra d'un droit d'abonnement **vérifié côté serveur**, et non d'un mode choisi dans une sauvegarde locale. Les valeurs ×2 sont des mesures de référence, pas une offre commerciale validée.

## P4. Passifs repérés — à confronter à leur activation effective

Le catalogue présente des paliers de compétence. Les exemples ci-dessous représentent des effets **repérés dans les fonctions**, pas une obligation de conserver leur équilibre exact.

| Compétence | Paliers et effets significatifs repérés |
|---|---|
| Santé | 75 : nourriture +10 % ; 95 : dégâts reçus −5 % |
| Défense | 10 : équipement supérieur ; 40 : dégâts −5 % ; 80 : équipement avancé ; 95 : cap de dégâts sur certaines créatures |
| Extraction | 20 : gemme bonus ; 50 : activité 15 % plus rapide ; 70/80 : minerai supplémentaire ou doublé ; 95 : bonus sur ressource rare |
| Métallurgie | 20 : lingots moins coûteux ; 40 : vitesse +10 % ; 60 : chance d'objet supplémentaire 5 % ; 80 : bonus d'équipement ; 95 : baisse de coût en matériaux rares |
| Bûcheronnage | 25 : découverte d'un objet secondaire ; 50/80 : accélérations ; 65 : bûche supplémentaire ; 95 : bonus de rendement sur essences tardives |
| Allumage | 10/50/80/95 : bonus global d'XP gradué ; 25/40/65 : vitesses d'autres métiers et bonus économique |
| Pêche | 20 : poisson bonus ; 40 : double prise ; 60 : bonus de soin culinaire ; 75 : vitesse +20 % ; 90 : rendement de poisson avancé |
| Cuisine | 20 : XP +10 % ; 30/70 : meilleurs soins ; 50/95 : produit supplémentaire ; 85 : vitesse +10 % |
| Vol | 15 : vitesse +10 % ; 30/45 : échec et butin ; 60 : garde moins dangereuse ; 75 : échec minimum 1 % ; 95 : chance de double butin |
| Crémation | 10/40/80 : accès à des protections ; 25/50/65/95 : XP et bonus ciblés |
| Artisanat | 20 : économie de bûches sur certains bâtons ; 40 : XP +10 % ; 60 : vitesse +10 % ; 80/95 : fabrication supplémentaire |
| Chasse | 20/60/95 : bonus XP cumulés ; 40/80/95 : or de contrats accru |
| Fabrication arcs/flèches | 20/80 : chance de produire double ; 40 : meilleure vente d'arcs ; 60 : vitesse ; 95 : XP +25 % |
| Culture | 15/45 : récoltes supplémentaires ; 30/60 : vitesses ; 75 : dose bonus ; 90/100 : durée de préparations |
| Mêlée, Distance, Magie | Progression par usage, armes et niveaux ; les bonus de dégâts et de sorts sont détaillés dans l'audit combat |

**Incohérence de source repérée :** le catalogue d'affichage n'est pas l'unique autorité sur les passifs. Par exemple, les chances d'esquive liées aux niveaux 20/60 de Défense figurent dans le calcul effectif alors qu'elles sont absentes de la liste visuelle actuelle. Les tests doivent vérifier **les effets exécutés**, y compris cachés dans d'autres fonctions. Source : `SKILL_PASSIVES` ~25688 ; `calcHitChance` ~7547 ; `startActivity` ~11342 ; `completeCraft` ~15030.

## P5. Renaissance : séparer référence et règles de notre jeu

**Référence active :** cap R20, multiplicateurs d'XP et de chance de drop de la forme `1 + 0,5 × R`. La condition de passage exige 17 compétences niveau 100, la collection complète, toutes les quêtes et les succès réclamés.

**Le code actuel conserve davantage d'éléments que certains commentaires d'en-tête ne l'indiquent :** les améliorations, la maîtrise des monstres, les familiers et la réputation de faction sont explicitement repris dans le nouvel état de Renaissance ; la forge, les compétences, la banque, l'équipement, la collection et les quêtes sont réinitialisés. Un commentaire au-dessus des constantes résume à tort la conservation comme limitée au seul compteur R. **Ne pas reproduire cette contradiction.**

**Nos décisions préexistantes priment :** les succès et découvertes sont permanents à travers les cycles, objectifs narratifs au lieu d'exiger systématiquement tous les catalogues, bénédiction avec objets liés et conservation conditionnelle, variations de perception selon R. Les objectifs de passages R ne sont pas encore écrits ; aucune implémentation ne doit inventer ces conditions.

**Source :** `_rebirthXpMult` ~8591 ; `canRebirth` ~8737 ; `doRebirth` ~8767–8900.

## P6. Spécification de tests et pièges pour l'API

1. Un compte neuf possède les **17 compétences**, toutes au niveau 1, quelle que soit sa première arme.
2. Changer d'arme change les modes de combat disponibles, **sans réinitialiser les XP** d'autres compétences.
3. Tous les niveaux dérivent d'une source d'XP unique ; le client n'envoie jamais de nouveau niveau en écriture.
4. Une récompense d'activité ne peut être encaissée deux fois, même avec deux requêtes parallèles.
5. Même horaire/compétence/état/buffs → même formule d'XP hors RNG. Arrondis définis par politique du moteur.
6. Bonus expirant au milieu d'une activité → seule la période active est accélérée ; pas de bonus rétrospectif.
7. R20 ne peut pas effectuer une R21 ; les validations de Renaissance sont faites dans une transaction serveur.
8. Le joueur ne peut jamais s'auto-attribuer un mode payant, un multiplicateur, un item ou de la chance de drop par une propriété JSON.
9. Toute compétence doit disposer d'au moins un test : prérequis, coût, sortie, XP, progression, inventaire plein, déconnexion.

**Statut à suivre :** analyse statique faite pour les familles et les flux centraux ; simulation du jeu entier et contrôle de chaque branche des passifs non réalisés. Parité fonctionnelle **non** atteinte.