# Audit comportemental 03 — activités, fabrication, stockage et progression en absence

**Phase : analyse statique approfondie, 11 octobre 2026.** Références : numéros de ligne du script JavaScript privé étudié. Pas de publication de source tiers.

## A1. Un moteur d'activités commun, plusieurs variantes

Une **activité principale** sélectionnée porte un type de compétence, une cible/recette, une durée de cycle et une reprise automatique éventuelle. Le répartiteur de fin de cycle oriente les résultats vers combat, donjon, métallurgie, cuisine, artisanat, arcs/flèches, vol, culture, allumage ou récolte. Des **systèmes secondaires** comme la culture automatique, les ressources de forge et certains automates peuvent évoluer en parallèle.

Étapes habituelles : valider prérequis → vérifier capacité/ressources/outils → début de cycle → calculer vitesse selon état/buff → terminer → consommer les intrants → attribuer sorties, XP, réussite/échec et découvertes → journaliser → enchaîner ou arrêter.

**Source :** `startActivity` ~11342 ; `onComplete` ~12495 ; `completeGather` ~14703 ; `completeCraft` ~15030 ; `completeFletching` ~15213 ; `completeFiremaking` ~15930 ; `completeThieving` ~30168 ; `completeCultivating` ~30791.

## A2. Vitesse : base, équipements, passifs et effets temporaires

- Les outils spécialisés peuvent raccourcir le cycle de récolte, parfois selon la qualité du matériel.
- Des améliorations à plusieurs rangs raccourcissent les cycles de métiers : pêche, forge, cuisine, artisanat, vol, allumage, fabrication d'arcs/flèches.
- Certains **passifs croisés** accélèrent une activité autre que leur propre compétence : l'allumage améliore notamment bûcheronnage, cuisine et pêche.
- Factions, événements locaux et préparations temporaires influencent vitesse et rendement.
- Les effets à durée limitée ne doivent pas être « figés » au lancement d'un cycle : le code a été corrigé pour appliquer une accélération au **temps effectivement écoulé pendant le buff**, plutôt que recalculer rétrospectivement toute la durée. C'est une protection contre une accélération permanente après expiration.

**Adaptation serveur nécessaire :** représenter l'avancement comme du **travail accumulé sur des intervalles temporels** avec buffs datés. Un calcul « durée initiale × multiplicateur à l'arrivée » donnerait des résultats incorrects et serait exploitable.

**Source :** `startActivity` ~11342–11625.

## A3. Réseau de dépendances des métiers

| Origine | Consommation / transformation | Sorties et utilisateurs |
|---|---|---|
| Extraction | Pioche + gisements, niveau minimum | Minerais et gemmes → lingots/équipements |
| Métallurgie | Minerais → lingots ; lingots → pièces | Armes/armures/outils ; compléments d'arc |
| Bûcheronnage | Hache + arbres | Bûches → allumage, arcs, composants de bâtons |
| Allumage | Bûches consommées | Feux temporaires et bonus globaux d'XP/vitesse |
| Pêche | Canne + zones de prise | Poissons crus → cuisine |
| Cuisine | Poissons crus → repas | Nourriture → soin manuel / soin automatique en combat |
| Fabrication d'arcs/flèches | Bûches, lingots | Arcs + flèches compatibles → combat à distance |
| Artisanat | Ressources variées | Tenues, bâtons, accessoires → défense et magie |
| Crémation | Os consommés | Charges de prières → bonus de combat |
| Chasse | Élimination de cibles / donjons | Points + récompenses + automatisation et amélioration d'activités |
| Vol | Échoppes, probabilité d'échec, gardes | Or/objets, dégâts reçus et XP |
| Culture | Graines → plantes → préparations | Rendement d'activités, buffs combat et économie |
| Toutes compétences | XP et seuils de progression | Passifs, maîtrise, familiers, rangs et prérequis |

**Précision :** les chaînes ci-dessus sont des dépendances fonctionnelles observées ; les noms, recettes, taux et univers des catalogues originaux ne doivent pas être repris sans autorisation. Nos objets auront leurs propres identifiants permanents.

## A4. Recettes et contrôles d'intégrité

Une recette inclut au minimum : type de compétence, niveau requis, intrants quantifiés, durée, sorties quantifiées, XP, conditions/outils et chance de bonus (selon compétence).

Dans la référence, les recettes disposent de règles de réduction de coûts qui doivent être **identiques dans l'affichage, la vérification et la consommation** : par exemple, certains objets métallurgiques intermédiaires coûtent un lingot de moins à partir d'un niveau de métier ; certains bâtons économisent une bûche. Les réductions ne s'appliquent pas nécessairement à la transformation des minerais elle-même.

**Obligation serveur :** le moteur choisit les coûts nets à partir de la version courante des règles, vérifie **tous** les matériaux disponibles, réserve/débite l'ensemble atomiquement, crédite les sorties une seule fois puis l'XP et l'événement. Aucun reliquat négatif ; aucune fabrication en cas d'intrants insuffisants ; aucune duplication sur deux clics concurrents.

**Source :** `_smithingEffectiveCost` ~14999 ; `_craftingEffectiveCost` ~15018 ; `completeCraft` ~15030 ; arcs/flèches ~15213.

## A5. Inventaire, banque, sacs, alimentation et propriété

**Référence observée :** inventaire de **23 types d'objets** hors cellule d'or séparée ; trois sacs additionnels de tailles 6, 12, 24 et banque persistante avec recherche, transferts et cases réservées. Une pile d'objet existante peut augmenter sans consommer une case supplémentaire. Un nouvel objet occupe une case. Un équipement porté n'est pas une copie de son inventaire.

**Notre règle déjà validée :** **16 cases dans l'alpha** (ne pas modifier sans décision). L'or occupe une case. Les sacs achetés **augmentent la capacité globale**, plutôt que générer automatiquement des inventaires autonomes. Les capacités finales, rangs et prix restent à déterminer.

### Flux de ressources particuliers

- Au niveau 100 de certaines compétences, une production en grande quantité peut être envoyée directement à la banque (maîtrise).
- Les intrants d'une recette peuvent être lus depuis l'inventaire, les sacs et, si un droit de maîtrise/amélioration est présent, depuis la banque, **sans ressaisie ni copies**.
- La cascade observée de dépense est inventaire → sac additionnel → banque sous condition. Les destinations de sortie peuvent différer selon la nature de l'objet et les droits du joueur.
- Les objets rares ou équipables ne doivent pas disparaître silencieusement en cas de sac saturé. L'action est bloquée ou le butin est stocké dans une boîte temporaire selon l'activité, et l'utilisateur est informé.
- Le dépôt, retrait, équipement, commerce ou transfert doivent changer **une référence d'objet et son propriétaire/lieu**, pas répliquer la quantité.

**Cible serveur recommandée :** table d'instances pour les pièces uniques/rares, piles référencées pour consommables/matériaux, emplacement explicite (inventaire, équipé, banque, butin en attente, marché) ; contraintes et transactions SQL empêchant la possession simultanée au même instant dans deux emplacements.

**Source :** inventaire ~9294 ; accès aux matériaux ~9410–9530 ; sacs ~9542–9800 ; boîte à butin ~10199–10600 ; équipement ~17053.

## A6. Progression hors connexion : pas seulement « nombre d'heures × rendement »

La référence exécute au retour une grande simulation des activités en cours et des tâches automatiques. Les branches couvrent notamment récoltes, fabrication, combat/donjon, chasse, familiers, culture, forge, charges de crémation, soins et saturation des ressources.

**Référence :** temps hors ligne ignoré en dessous de 30 secondes pour l'écran récapitulatif ; **cap initial 24 h**, étendu à 36/48 h par des améliorations et des bonus liés aux sacs. Les points spéciaux de chasse ne sont pas attribués pendant l'absence. Pour le butin de combat, les sorties sont mises en attente dans une boîte distincte, tandis que la production des métiers suit le routage des ressources.

**Nos décisions :** disponibilité exclusivement en ligne du jeu, **mais progression passive pendant l'absence** gérée sur serveur ; durée initiale courte puis déblocages, pas de 24 h de base. Le navigateur peut être fermé : le VPS doit conserver l'état et calculer les récompenses sans accepter de durée revendiquée par le client.

### Architecture de simulation recommandée

1. Chaque activité conserve **identifiant, règles/version, horodatage serveur de démarrage, prochain cycle, état et bonus applicables**, sans dépendre d'une minuterie du navigateur.
2. Le serveur calcule une fenêtre `[dernier règlement ; maintenant]` bornée au plafond débloqué au moment approprié. Les événements temporaires et modifications de buffs sont datés.
3. Dans l'ordre déterministe défini pour le moteur : consommations, combats/soins et risque de mort, gains, butins, saturation et progression.
4. Le moteur inscrit un **cursor de règlement** et des identifiants de cycle uniques avant/accompagnant l'attribution : chaque fenêtre est soldée **une fois**, même avec dix onglets ou des retries simultanés.
5. La première reconnexion montre un résumé **d'un état déjà confirmé en base**, et non un bouton qui applique une seconde fois tous les gains.
6. L'algorithme doit limiter le coût serveur : calcul agrégé lorsque mathématiquement équivalent, simulation discrète lorsque combats, stocks, chances ou passifs font évoluer le résultat à chaque cycle.
7. Le calcul est stable malgré une relance du serveur, une indisponibilité de DB, ou une erreur d'affichage ; ne pas créer d'obligations de recalcul perpétuel ou d'écriture à chaque seconde.

**Source :** `processOfflineProgression` ~71682–fin de la section ; timers d'activité ~11342 ; forge, auto-culture et autres automatismes.

## A7. Anti-triche et anti-duplication — exigences à imposer avant multijoueur

| Risque observé dans l'ancien modèle local | Contrôle requis dans notre serveur |
|---|---|
| Accélérer horloge client | Toutes bornes temporelles calculées par temps serveur |
| Envoyer une action avec récompense préremplie | Le serveur reçoit une **intention**, jamais le résultat |
| Double requête de fin de cycle | Clé idempotente + verrou du personnage/activité + transaction |
| Acheter avec un solde insuffisant via concurrence | Débit conditionnel atomique / ledger |
| Déposer un objet tout en l'équipant | Verrou + propriétaire unique + emplacement unique |
| Dépasser la capacité | Vérification préalable et transfert tout-ou-rien |
| Acheter une amélioration et simuler rétroactivement ses heures de bonus | Horodatage de début de droit, segmentation du temps |
| Fermer le client juste avant une mort de combat | Règlement serveur indépendant de l'onglet |
| Faire disparaître une perte en revenant à une sauvegarde | Pas de sauvegarde client autoritaire ; journal serveur et versions |
| Deux fenêtres réclament les mêmes gains hors ligne | Curseur de période persisté et transaction exclusifs |
| Quête ou contrat encaissé plusieurs fois | Événement source identifié, état « réclamé » stocké et verrouillé |

## A8. Travail restant pour une parité testée

Le présent audit couvre les **composants majeurs et leurs branchements**, pas encore chaque tirage ou recette. Avant d'indiquer qu'un métier est « équivalent », obtenir pour un exemple de chaque type : prérequis, vitesse avec/sans bonus, consommation, XP, sortie, niveau atteint, comportement sac plein, bonus de famille, retour hors ligne, échange de matériaux avec banque, échec et reprise après crash.

**Points encore ouverts :** vitesse/sources exactes des activités avancées, probabilités de familiers, toutes variantes de recettes, conditions des automates, tarif et gains de chasse, coutumes d'affichage. Ils feront l'objet de fiches unitaires lors de la reconstruction ; ne pas les inventer depuis un catalogue incomplet.