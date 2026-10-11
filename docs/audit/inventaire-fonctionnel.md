# Inventaire fonctionnel de référence — L’Éclipse Blanche

**État : audit statique V1 — 11 octobre 2026.**  
**Objet :** cartographier les fonctions d'une application de référence fournie à titre privé avant la reconstruction en React + API serveur autoritaire. Ce fichier ne contient aucun code tiers, aucun texte narratif reproduit, aucune ressource graphique propriétaire et aucune marque de l'application étudiée.

> **Convention de preuve :** « confirmé » signifie *déclaré et repéré dans le code fourni*, pas nécessairement *testé manuellement dans le jeu*. Les nombres correspondent aux **entrées des catalogues statiques**, et non au nombre total d'éléments effectivement déblocables après génération de variantes. Les numéros de ligne ci-dessous renvoient au **script principal extrait du HTML de référence**, non aux fichiers de notre dépôt Git.

## A. Sources réellement disponibles et limites

| Source examinée | Volume approximatif | Ce qu'elle apporte |
|---|---:|---|
| HTML du jeu | 39,3 Mo | Structure des menus, 1,24 Mo de CSS, environ 4,98 Mo de JavaScript principal, quatre pistes audio intégrées en base64 |
| HTML d'entrée | 146 Ko | Page d'accueil / présentation |
| Script du conteneur PC | 27 Ko | Ouverture dans Electron, gestion de la fenêtre et fonctionnalités de bureau |
| Préchargement PC | 9 Ko | Pont de fonctions liées à la plateforme de distribution |
| Configuration de l'application | 264 octets | Dépendance spécifique à la plateforme, statut `UNLICENSED` |

L'archive réduite contient **cinq fichiers**. Les images référencées dans les chemins `assets/items/` et `assets/items_sq/` n'y sont **pas livrées**. Plus de 500 balises d'image utilisent des chemins de ressources, et le script contient de nombreuses références supplémentaires. Impossible de vérifier la couverture graphique ou la parité visuelle exacte avec cette archive seule. Les quatre fichiers musicaux sont, eux, incorporés dans le HTML sous forme encodée. Les licences du code, des images et de la musique doivent être vérifiées indépendamment avant toute réutilisation : notre dépôt ne doit pas recevoir ces sources brutes.

## B. Compétences et caractéristiques

**17 compétences parallèles confirmées** (`ALL_SKILL_IDS`, lignes ~828 et état initial `GS.skills`, ~63) ; niveau de compétence plafonné à 100 dans la progression de référence. Aucune création de personnage ne supprime définitivement 14 compétences parce qu'un style de combat a été choisi.

| Groupe | Compétences |
|---|---|
| Combat, progression et survie | Mêlée, Distance, Magie, Santé, Défense |
| Récolte / ressources | Extraction minière, Bûcheronnage, Pêche |
| Transformation / fabrication | Métallurgie, Allumage des feux, Cuisine, Crémation, Artisanat, Fabrication d'arcs et de flèches |
| Activités complémentaires | Chasse (contrats), Vol, Culture de plantes |

**Systèmes liés repérés :** expérience séparée par compétence ; niveau de joueur et niveau de combat calculé à partir des cinq compétences de combat ; passifs de compétence (14 familles définies) ; maîtrise des créatures ; titres et rangs ; bonus de vitesse, d'expérience, d'or, de chance ; familiers conférant des passifs ; activités en cours et en arrière-plan.

**Point déterminant pour notre jeu :** les styles de combat sont des modes d'attaque (mêlée, distance, magie, défense) qui dépendent notamment de l'arme équipée ; ce ne sont **pas** des classes irréversibles. Les trois classes du prototype 0.2.3 doivent donc être abandonnées comme restriction. Source : `setCombatStyle`, ligne ~15568 ; `COMBAT_SKILLS`, ~22479 ; `GS.skills`, ~63.

## C. Combat, adversaires, donjons et boss

| Catalogue | Nombre confirmé | Caractéristiques repérées |
|---|---:|---|
| Monstres standards | **26** | PV, attaque, défense, résistances par style, niveau requis, durée de combat, XP, or, table de butins |
| Donjons | **10** | Niveau requis, quatre rencontres déclarées par donjon, récompenses propres, butins et répétition automatique |
| Boss mondiaux | **3** | Apparition programmée, durée de présence, attaques, résistances, butins et objets spécifiques |
| Équipements de monstres prédéfinis | **37** | Armes et pièces de différentes disciplines |
| Ensembles d'équipements de monstres | **15** dans le catalogue initial | Bonus selon le nombre de pièces ; variantes supplémentaires générées par le code |
| Ensembles fabriqués | **21** | Effets d'ensemble distincts |

**Combat :** sélection de la cible, styles d'attaque, précision / chance de toucher, dégâts, mitigation selon le style adverse, coups critiques / bonus, défense, consommation de munitions, sorts, protections et buffs, soin automatique configurable, potions automatiques, mort, fuite, enchaînement et butin post-combat. La résolution est principalement dans `completeCombat` (~13329, >1 100 lignes), `startActivity` (~11343), `setCombatStyle` (~15568), `buildCombatLootBox` et fonctions d'équipement. Les effets graphiques sont déjà traités séparément de certaines mutations de jeu dans le code de référence, mais **pas** dans un serveur autoritaire.

**Donjons :** quatre rencontres successives par entrée ; progression et reprise de salle ; récompense de fin ; répétition automatique ; prise en compte de la simulation hors ligne. Sources : catalogue ~2402 ; `completeDungeon` ~14459 ; branche donjon de `processOfflineProgression` ~71683.

**Boss mondiaux :** trois boss prédéfinis de niveau requis élevé ; minuterie d'apparition locale aléatoire **60–90 minutes** et présence indiquée de **30 minutes**. Invocation possible par objets spéciaux ; panneau, annonces, engagement, victoire, fuite/disparition. Les **états de boss résident dans le personnage local** ; rien dans les fichiers fournis ne démontre un boss véritablement partagé entre plusieurs joueurs. Sources : définitions ~2769 ; orchestration ~28283–29418. La nouvelle mécanique de perception selon R et les seuils de dégâts collectifs/individuels **n'existent pas encore** et doivent être conçus côté serveur.

**Important sur le décompte :** 26 monstres standards + 10 donjons + 3 boss ne représentent pas 39 « monstres » homogènes : les donjons sont des séquences et non 10 créatures supplémentaires. Un objectif éditorial d'environ **50 créatures originales** a été exprimé pour L’Éclipse Blanche, mais la composition exacte reste à écrire.

## D. Inventaire, objets, équipement et stockage

- Inventaire transporté avec **23 emplacements de types d'objets** dans la référence (`INVENTORY_MAX_SLOTS`, ~9294) ; compteur d'occupation et blocage de certaines activités quand le sac est plein.
- Banque persistante distincte ; onglets, tri, recherche, transfert en quantité personnalisée, dépôt/retrait d'or et de ressources, glisser-déposer et organisation des cases.
- **13 emplacements équipables** : arme, casque, torse, jambes, bottes, main secondaire, anneau, amulette, pioche, hache, canne à pêche, munitions, dos. Voir `GEAR_SLOTS`, ~4495.
- Plusieurs ensembles d'équipement préparés et changements rapides (presets).
- Ressources empilables, monnaies, consommables, munitions, matériaux, pièces d'armure, armes, outils, familiers, objets de collection.
- États de rareté, variantes brillantes et variantes supérieures, calcul d'attributs, résistances, bonus d'ensemble et restrictions d'équipement selon le niveau.
- Amélioration d'équipement, coût des opérations, protection / destruction ou récupération selon système, affichage des conséquences.
- Boîte de butin après combat avec reprise des gains vers inventaire ou banque.
- Trois **sacs additionnels indépendants** de **6, 12 et 24** emplacements de types, avec priorités d'acheminement et avantages secondaires (limite hors ligne, or, XP). Voir ~9534–9615.
- Mécanique de « canalisation de maîtrise » permettant, sous conditions, l'accès à certaines ressources de banque pour des recettes sans transfert manuel. Voir ~40954.

**Écart volontaire déjà validé pour L’Éclipse Blanche :** conserver pour l'instant **16 emplacements initiaux** dans notre alpha, l'or occupant une case ; nos futurs achats de sacs doivent étendre **la capacité globale du personnage**, et non reproduire nécessairement trois inventaires parallèles. Le chiffre 23 et les sacs séparés sont des constats du code de référence, **pas** une modification automatique de notre jeu.

## E. Ressources et fabrication

| Système | Catalogue statique | Éléments de fonctionnement repérés |
|---|---:|---|
| Extraction | **8** types de gisements | Outils, prérequis, rendement, vitesse, raretés et passifs |
| Bûcheronnage | **8** espèces de bois | Haches, niveau, durée, bûches, bonus |
| Pêche | **6** zones/espèces | Cannes, poissons crus, chances, cuisson liée |
| Métallurgie | **8** recettes de lingots + **53** recettes d'équipement | Minerais → lingots → objets, durée et coût |
| Artisanat | **49** recettes | Équipements magiques / cuir / tissu, ressources composites |
| Fabrication d'arcs | **8** recettes d'arcs et **8** recettes de flèches | Bois, lingots et production de munitions |
| Vol | **8** cibles / échoppes | Gain aléatoire, risque, délais, contreparties |
| Culture | **7** plantes + **7** produits transformés | Semis, croissance, récolte, préparation et effets |
| Feux et crémation | Pas de tableau unique équivalent | Combustibles, os, protections, bonus de feu et passifs |
| Cuisine | Données réparties | Poissons et aliments transformés, soin et consommables |

Les recettes ne doivent pas être copiées telles quelles dans nos contenus définitifs ; il faut reconstituer **le mécanisme générique** (entrée, sortie, prérequis, durée, chance, bonus, source de ressources, compteurs) avec nos propres identifiants et objets. Sources principales : ~850–960, ~3916–4603, fonctions `completeGather`, `completeCraft`, `completeFletching`, `completeCultivating`, `completeThieving`, `completeFiremaking`.

## F. Chasse, contrats, maîtrise et économie

- **30 modèles de contrats** de chasse et de donjon ; acceptation, progression, complétion, abandon, catégories de difficulté, récompenses et **points de chasse**.
- **15 offres de boutique de chasse**, incluant automatisation, durée maximale hors ligne, chances particulières et bonus de progression.
- Progression de **maîtrise par créature**, seuils de maîtrise, bonus, prestige et éventuels changements de récompenses.
- Marché de référence principalement composé de **marchands / boutiques du jeu** : **29** offres généralistes, **21** outils, **8** offres de mode difficile, **16** améliorations, ainsi que des boutiques de factions.
- Vente d'objets à des marchands, vente en quantités, prix, bonus de vente et **commission de marchand de 10 %** dans le code concerné.
- Marchand itinérant qui apparaît occasionnellement avec des offres temporaires.
- Événements temporaires de commerçant/crieur, bonus mondiaux **locaux** de rendement et taux.
- **6 catégories de coffres** de butin, de la qualité ordinaire à très rare.

**Écart stratégique :** ce « marché » ne prouve **aucun échange sécurisé entre plusieurs joueurs**. Notre marché de joueurs, les enchères, la provenance des items, les règles de propriété et la monnaie serveur devront être développés. L'or ne sera pas vendu contre des euros dans notre modèle validé. Référence : `CONTRACT_POOL` ~5151, `HUNT_STORE_ITEMS` ~18748, boutiques ~4673–5010, `MARKET_CUT` ~35464.

## G. Quêtes, récit, factions et accomplissements

- **37 quêtes déclarées** avec prérequis de compétence, objets remis, dépendances éventuelles, récompenses XP/or/points de quête.
- **9 unités narratives** au catalogue, prologue inclus : déblocage conditionnel, personnages, dialogues, récompenses et revue de l'histoire.
- **6 personnages / interlocuteurs narratifs** répertoriés.
- **3 factions** avec réputation, paliers, engagement, avantages, missions d'approvisionnement, boutique et effets des relations entre factions.
- **68 succès déclarés** au catalogue ; interface de récompense et revendication, titres, rangs et affichages dédiés.
- Collection permanente des créatures/objets/ensembles découverts, fiches d'informations et filtres ; journal d'événements et encyclopédie des objets.
- **17 familiers de compétence**, possibilités d'obtention aléatoire et bonus passifs.
- Tutoriel guidé et écrans d'aide ; sauvegarde/revue d'étapes de récit.

Attention : des badges visibles dans l'interface de référence affichent des nombres différents (par exemple un total partiel de succès ou de collection). Les catalogues donnent ici **68 succès déclarés**, sans affirmer qu'ils sont tous visibles simultanément dans chaque mode ou palier. Sources : ~1032, ~3021, ~3644, ~3894, ~5031, ~36976 et fonctions de succès, collection et récit.

## H. Magie, passifs et forge spéciale

- **16 sorts** répartis en **4 éléments** ; sélection du sort actif, restrictions et effets en combat.
- **21 protections / prières** actives et conditionnelles ; calculs attaque/défense, consommation ou fonctionnement spécial à préciser pendant l'audit comportemental.
- Bonus permanents de compétence et avantages de maîtrise.
- Forge spéciale distincte de la métallurgie classique : ressources propres, frappes manuelles, production passive, chaleur, coups critiques de forge, améliorations, sceaux de compétence et de combat, échange contre des coffres.
- Buffs temporaires, événements d'expérience, vitesses, or et chance ; diverses interactions entre bonus.

Cette forge et les nombreux passifs sont des **modules de progression à part entière** : ne pas les perdre dans la reconstruction, même si leur présentation finale sera plus simple.

## I. Progression hors ligne, modes et Renaissance

- Une activité principale active, des activités complémentaires, limites de durée, automatisations et calcul à la reconnexion.
- **Limite hors ligne de référence : 24 heures de base**, étendue par achats de chasse à **36 / 48 heures**, puis bonus des sacs ; des exceptions et sous-systèmes particuliers existent. Code autour de ~71683–71719.
- L'algorithme de simulation hors ligne traite notamment récolte, combat, donjons, contrats, familiers, blessures/soins, forge et culture ; une partie du moteur se trouve dans **une seule fonction de plus de 1 100 lignes**, ce qui rend l'extraction modulaire indispensable.
- Trois modes de personnage repérés : **normal**, **difficile/permadeath**, **rapide**. Le mode rapide de référence est une variante de rythme sélectionnée localement, **pas** notre abonnement mensuel sécurisé.
- **Renaissance plafonnée à R20** dans la référence ; bonus d'XP et de chance de type **additif** avec +0,5 par Renaissance (exemple : bonus XP R20 ×11 avant autres modificateurs).
- Les conditions de Renaissance de référence exigent **17 compétences au niveau 100, collection intégrale, toutes les quêtes, tous les succès** ; son processus reconstruit l'état du personnage avec conservation sélective.

**Écarts validés pour nous :** Renaissance narrative et difficile **sans** imposer 100 % de tout à chaque cycle ; succès permanents acquis sur plusieurs Renaissances ; changements de **perception** des entités selon R ; progression hors ligne à débloquer progressivement plutôt que 24 h gratuites ; Fast Mode payant mais équitablement encadré. Sources : `canRebirth` ~8738, `doRebirth` ~8768, modes ~43193–43365, offline ~71683.

## J. Interfaces et ergonomie à conserver dans l'esprit

**Navigation haute :** Codex, collection, succès, titres et quêtes.  
**Navigation latérale principale :** accueil, forge spéciale, marché, améliorations, métallurgie, équipement, combat (styles et caractéristiques), donjons, boss mondial, banque, douze entrées d’activités de compétence, chasse, paramètres.  
**Sous-écrans :** tris, filtres et pages de monstres/donjons ; fabrication par sous-catégories ; recherches et onglets de banque ; actions rapides dans l'inventaire ; journal en direct ; description d'objets, recettes et origines des matériaux ; panneau d'équipement et presets ; paramètres ; tutoriel et encyclopédie.

Le futur client React doit **retrouver ces interactions et densités utiles** avant que nous simplifiions les menus. Sur desktop, combat, inventaire et informations fondamentales doivent rester visibles sans défilement inutile ; sur mobile, les zones seront réorganisées sans supprimer les fonctions.

## K. Sauvegardes, traductions et plateforme

- Jeu essentiellement monolithique : un HTML volumineux avec CSS et JavaScript intégré.
- État `GS` regroupant **109 champs racines** : progression, équipement, banque, événements, modes, quêtes, activités, sauvegardes et métadonnées de jeu.
- Plus d'un millier de fonctions top-level dans le JavaScript ; nombreux couplages implicites avec le DOM et état global.
- Persistance largement fondée sur `localStorage` (plus de 100 appels dans le HTML), export/import JSON, sauvegardes de secours et **3 emplacements locaux de sauvegarde** ; pont éventuel de sauvegarde cloud de la plateforme PC.
- **7 langues** déclarées : anglais, français, allemand, espagnol, portugais brésilien, russe et chinois simplifié.
- Musique d'ambiance (quatre pistes audio intégrées), activation, volume, commandes, sons ; choix d'avatar et paramétrages de fenêtre.
- Télémetrie et intégration externe repérées ; aucune API de jeu autoritaire avec transactions multijoueurs démontrée dans les sources reçues.

Notre cible remplace les sauvegardes de progression locales par des **transactions PostgreSQL**, comptes uniques et API Node.js faisant autorité, tant pour les actions solo que collectives. Les ressources premium et l'abonnement ne seront attribués qu'après confirmation Stripe **par webhook serveur vérifié et idempotent**. L'ancien client ne peut pas devenir un serveur sécurisé par simple déplacement du JavaScript dans React.

## L. Ce qui est confirmé et ce qui nécessite encore un audit de comportement

### Confirmé par lecture statique

Les modules listés sont présents dans les catalogues et/ou les fonctions du code. Les décomptes ci-dessus proviennent de l'analyse syntaxique du JavaScript et de la navigation HTML, et sont reproductibles sur l'archive reçue. L'absence de serveur multijoueur autoritaire dans l'archive reçue est une conclusion sur **ces fichiers**, pas sur une éventuelle infrastructure extérieure non fournie.

### Non encore établi / ne pas inventer

- Parité intégrale des formules de combat, de leurs exceptions et interactions de bonus.
- Exhaustivité des objets générés dynamiquement, des tables de loot et des récompenses cachées.
- Fonctionnement sans erreur de chacune des fonctions en jeu réel et dans tous les modes.
- Comportements réels de latence/performance avec 17 compétences à niveau élevé.
- Droits d'utilisation du code, des illustrations, des musiques et de leurs traductions.
- Architecture, algorithmes, données réelles et règles exactes de **notre** serveur multijoueur ; ce travail est à construire et tester.
- Graphismes des centaines de ressources dont les chemins existent mais dont les fichiers ne figurent pas dans l'archive légère.

**Prochaine phase :** audit comportemental du moteur par système, puis matrice de tests de parité ; voir [matrice-parite.md](matrice-parite.md). Ne pas utiliser l'alpha 0.2.3 comme spécification de référence.