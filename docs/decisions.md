# Registre des décisions

Ce registre distingue les **règles retenues dans nos échanges** des **orientations** et **valeurs d'exemple** encore à arbitrer. Une valeur illustrative n'est jamais une règle validée.

## Identité du projet

- Nom officiel : **L’Éclipse Blanche**.
- Logo officiel fourni par le créateur en deux variantes : fond noir et fond blanc. Fichiers à intégrer dans le dépôt.

## Règles retenues

1. La Renaissance réinitialise la progression concernée mais conserve l'identité et l'histoire du personnage.
2. Succès, faits d'armes et découvertes sont conservés entre Renaissances.
3. Une exigence future fondée sur un fait déjà accompli est automatiquement satisfaite.
4. Un objet acheté ou échangé enrichit le Codex, mais n'accorde pas la victoire sur son boss.
5. Un boss mondial ne doit pas pouvoir être éliminé rapidement par un seul joueur R20 ; soutien, mêlée et distance ont des rôles distincts.
6. Une forte contribution réelle au combat, y compris les dégâts d'un R20, doit être reconnue dans les récompenses.
7. Les armes exceptionnelles de boss ne sont ni forgeables, ni améliorables, ni recyclables. Avant bénédiction, elles sont échangeables, vendables et destructibles.
8. Transmission d'une arme exceptionnelle : 100 % initialement, puis 80 %, 60 %, et enfin 40 % à partir de la troisième transmission, sans descendre davantage.
9. Bénédiction payante **à chaque** Renaissance pour préserver un objet ; les améliorations ajoutées sont perdues au passage.
10. Dès la première bénédiction, l'objet est définitivement lié au personnage et ne peut plus être cédé à un autre joueur.
11. Les objets bénis issus d'une recette éligible peuvent être recyclés pour **80 % des matériaux de création de base** ; jamais les frais/matériaux d'amélioration ; aucune arme exceptionnelle de boss recyclable.
12. Les extensions de sacs augmentent la capacité de transport totale, sans obligation de sacs visuellement séparés.
13. L'or compte parmi les emplacements de l'inventaire.
14. Une durée de farm hors ligne de 24 h ne doit pas être disponible automatiquement au départ ; elle se développe avec la progression et des améliorations.
15. Le joueur doit voir précisément les effets d'un achat ou d'une action irréversible avant de confirmer.
16. Aucun contenu d'un autre univers ou projet n'est utilisé comme référence narrative dans cette documentation.

## Orientations non figées

- Plafond de R20 et accession à la divinité via R20 + tous les succès permanents pertinents.
- Succès communautaires séparés et non indispensables à la divinité.
- Boss mondiaux avec progression par phases, contributions de soutien et récompenses adaptées au niveau de Renaissance.
- Objectifs de Renaissance centrés sur l'histoire et des défis au choix, plutôt qu'une complétion obligatoire de tout le contenu.
- Boîte de butin de combat achetable et extensible.
- Récolte hors ligne pensée pour les connexions matin/soir.

## Arbitrages prioritaires

1. Histoire et signification exacte de la Renaissance.
2. Conditions précises de chacune des Renaissances.
3. Compétences, limites d'inventaire et statut de la banque lors de la Renaissance.
4. Coûts de bénédiction et définition précise des objets éligibles.
5. Durées et rendements de récolte hors ligne.
6. Formule des contributions et récompenses de boss ; traitement d'un butin de palier +1.
7. Conditions des 100 % de succès nécessaires à la divinité.
8. Réglementation des échanges, enchères, prix et fraudes.

## Modèle commercial — orientation validée le 10 octobre 2026

- **Aucun achat d'or du jeu** contre de l'argent réel ; l'or reste gagné par les activités et les combats.
- **Crédits premium** achetables en euros, réservés à une boutique d'équipements spéciaux et de services à définir. Les crédits ne sont pas une monnaie du marché entre joueurs ; les articles premium ne doivent pas permettre de contourner les règles de transferts et de bénédiction.
- **Mode rapide (Fast Mode)** : durée des abonnements joueurs à définir séparément (hebdomadaire ou mensuelle envisagée). **Les versements Stripe vers le compte bancaire de l'éditeur sont souhaités à fréquence mensuelle**, sans versements journaliers ou hebdomadaires. Les deux fréquences sont indépendantes. Prix, multiplicateurs, activités éligibles, cumul avec d'autres bonus et éventuels plafonds sont à définir et tester ; éviter de rendre les combats communautaires injustes.
- Le jeu de base doit permettre de progresser et d'atteindre R20 sans paiement ; payer accélère certaines activités, mais ne valide pas directement les faits d'armes, quêtes ou objectifs de Renaissance.
- **Abonnement** : afficher prix TTC, période, date de reconduction, fonctionnement du renouvellement automatique et moyen simple de résilier. La résiliation empêche les prochains prélèvements ; les droits déjà payés courent selon les conditions applicables.
- **Remboursements et rétractation** : volonté commerciale de ne pas proposer de remboursement de convenance pour des contenus immédiatement délivrés, **dans la limite des lois applicables**. Une clause « aucun remboursement » ne supprime ni les droits légaux ni les recours liés aux défauts, fraudes ou paiements indus. Obtenir les consentements spécifiques et confirmations nécessaires avant la fourniture numérique et vérifier séparément les règles des abonnements.
- Tout paiement et droit premium est attribué et vérifié côté serveur, avec historique, prévention des doublons et correction en cas de rétrofacturation.
- **Distribution sans Steam**, via navigateur et éventuellement application PC indépendante ; hébergement VPS envisagé, à confirmer techniquement.

## Sécurité et anti-triche — décision du 11 octobre 2026

- Priorité haute : ne jamais exposer une économie ou progression multijoueur fondée sur la confiance dans le client.
- **Serveur autoritaire** pour combats, niveaux, gains, objets, marché, boss mondiaux, abonnements et crédits premium. Le client soumet des intentions ; le serveur valide et applique, sans accepter un état final calculé par le client.
- **Solo hors ligne isolé** du monde connecté : aucune importation de personnages ni conversion des gains locaux vers le multijoueur. On ne peut pas garantir qu'une sauvegarde sur un appareil contrôlé par le joueur résiste à toute modification.
- **Retrait des fonctions d'import/export de sauvegarde** de l'alpha actuelle ; cela réduit un vecteur évident sans constituer une protection complète.
- Le nombre de monstres dans une alpha ne limite pas le futur bestiaire. Quatre créatures représentent uniquement le contenu temporaire du prototype.
- Contrôles nécessaires : temps et RNG serveur, transaction de données atomique, contrôle de droits et de fréquence, journal d'audit et gestion des rejouements.

## Boss mondiaux — double seuil pour le butin exceptionnel (proposition du 11 octobre 2026)

- Un équipement exceptionnel ne peut être tiré que lorsque les **dégâts cumulés sur la manifestation du palier R** atteignent un **seuil collectif** propre à cette manifestation.
- Chaque candidat doit également remplir un **seuil individuel de contribution** ; être seul dans sa catégorie ou premier du classement ne dispense d'aucun seuil.
- Lorsque les deux conditions sont réunies, un **tirage de rareté** décide si un exceptionnel existe ; la condition ne garantit jamais le drop. Si un exceptionnel tombe, son attribution entre candidats éligibles reste à définir (pondération ou tirage).
- Seuils et probabilités numériques non validés : ils seront calibrés sur la durée de l'événement, le niveau R et la population, sans modifier rétroactivement les règles d'un événement en cours.
- Décision restant à prendre : faut-il un tirage unique par manifestation à la fin de l'événement, et comment comptabiliser soins et soutien sans les confondre avec les dégâts collectifs ?

### Atteignabilité en solo du seuil collectif — précision validée

- Le seuil collectif d'une manifestation au palier **R20** doit pouvoir être atteint **par un R20 seul**, sans imposer la présence de plusieurs joueurs.
- Objectif d'équilibrage : un R20 autour de **50 % d'optimisation** peut théoriquement franchir ce seuil dans des conditions particulièrement exigeantes ; un R20 presque maximisé y parvient plus régulièrement.
- Le pourcentage d'optimisation devra être défini (compétences, équipement, caractéristiques, etc.) et confirmé par simulations. **Il ne s'agit pas d'un multiplicateur automatique de seuil**.
- La coopération facilite le franchissement du seuil collectif ; elle ne doit pas être strictement obligatoire.
- Le double seuil collectif/individuel ne garantit jamais un objet exceptionnel : le tirage rare reste nécessaire.
- Ce repère R20 sert de contrainte de conception ; les autres R doivent recevoir leur propre équilibrage.

## Architecture en ligne unifiée — décision validée le 11 octobre 2026

- **Jeu exclusivement en ligne** : pas de mode hors ligne persistant, pas de SQLite client ni de sauvegarde de progression en local. L'accès solo et multijoueur s'effectue sur le **même backend**, avec **un compte et une progression unique**.
- **Serveur autoritaire dès la prochaine étape technique** : le client demande des actions, le serveur valide les droits, le temps et les règles, génère les tirages de combat/butin et applique les changements d'état via transactions. Aucune donnée de progression soumise par le client n'est considérée comme véridique.
- **PostgreSQL sur VPS** pour les comptes, personnages, objets, combats, transactions et paiements ; API HTTPS, cookies de session sécurisés, permissions minimales, limites de requêtes, journaux, sauvegardes chiffrées et tests de restauration. Éviter de connecter directement le navigateur à la base avec des privilèges élevés.
- **Achats sécurisés en priorité absolue** : paiement créé côté serveur, confirmation par webhooks Stripe signés, contrôle montant/devise/identifiant, traitement idempotent en transaction, ledger immuable des crédits et droits, prévention du double crédit, gestion des remboursements/rétrofacturations, journal d'audit. Aucun secret Stripe côté navigateur ; aucune attribution sur la seule base du retour client.
- **Déploiement initial simple** sur un VPS avec isolation services/API/DB, reverse proxy TLS, secrets hors Git et sauvegardes externes ; montée en charge par mesure, Kubernetes seulement si la croissance le justifie. Prévoir dès le départ des processus API sans état et des migrations de base reproductibles afin de faciliter une future mise à l'échelle.
- L'alpha solo 0.1.1 à sauvegarde `localStorage` est **obsolète en tant que fondation de stockage** : prototype UI/règles seulement. Ne pas mettre en production ni lui brancher des achats ou des échanges avant création du backend autoritaire.

## Détection des anomalies et triche — décision du 11 octobre 2026

- Construire dès le départ un moteur **serveur** de détection d'anomalies, distinct des validations impératives de chaque action. Une action impossible est refusée immédiatement ; une statistique anormale est un signal à examiner, pas une preuve suffisante de triche.
- Surveiller en priorité les durées de passage **R0→R1 puis Rn→R(n+1)**. Calculer pour chaque Renaissance des **bornes minimales physiquement possibles** d'après les règles, les gains théoriques maximaux, les obligations narratives et les bonus autorisés, puis des plages statistiques de progression rapide. Ne pas publier les seuils précis anti-abus.
- Utiliser uniquement les **horodatages et historiques d'événements serveur**, jamais l'horloge ni les déclarations du navigateur ; mesurer aussi le temps d'activité effectif et le temps écoulé, afin de traiter correctement repos et progression hors ligne.
- Vérifier les invariants : gains XP/or/ressources justifiés, limites de cadence, combats et boss légitimes, objets provenant d'une acquisition ou transaction prouvée, conservation de la monnaie et des inventaires, conditions de Renaissance réellement satisfaites, crédits premium strictement associés aux paiements confirmés.
- Journaliser des **événements de progression compacts et auditables** (pas chaque mouvement d'interface), l'origine des récompenses, les versions de règles et les éventuelles interventions administratives. Limiter les données personnelles collectées et la durée de conservation.
- Créer une **console administrateur d'alertes** avec gravité, motifs explicites et historique. Ne jamais bannir automatiquement sur le seul critère d'une progression rapide ; prévoir revue, faux positifs et recours.
- Une suspicion forte peut limiter **temporairement les échanges, enchères et retraits économiques** selon une politique documentée, sans suppression arbitraire des droits du joueur. L'application des mesures doit être tracée.
- Tester chaque palier R avec des simulations de joueur très optimisé, de Fast Mode autorisé et de solo/multi ; les chiffres illustratifs discutés ne constituent pas des seuils validés.

## Risques du combat idle et spécialisation sans compétences obligatoires — décision de principe du 11 octobre 2026

- **Archer** : conservation du besoin réel d'arc, de fabrication/approvisionnement en flèches et de leur **consommation en combat** ; ce coût doit rester un choix de gameplay satisfaisant, pas être annulé par une simplification automatique.
- **Mêlée** : ajouter usure d'armes et réparation ; l'amélioration de la résistance constitue une véritable voie de progression. Durées, prix, conséquences à durabilité nulle et règles spéciales des armes de boss non améliorables restent ouverts.
- **Mage** : principe d'un coût cumulatif **original, inspiré des contes et légendes**, intéressant pour limiter l'usage sans préparation ; la proposition « **Dette Occulte** » est favorablement accueillie en tant que **direction de conception**, mais ses effets précis, sa recharge/purification, ses composants et l'extension éventuelle des sorts ne sont pas validés.
- **Combat en absence** : épuisement des flèches, usure critique ou dette trop haute peuvent conduire à une défaite réelle dans une simulation autoritaire. Des protections d'arrêt sur seuil sont à **étudier**, avec risques clairement présentés au joueur ; elles ne doivent pas rendre la mort impossible.
- **Renaissance** : la pénibilité productive de certains styles favorise le développement des métiers associés, ce qui est intéressant ; **cesser d'exiger le niveau 100 dans toutes les compétences pour chaque R**. Autoriser des voies différentes, avec des défis de difficulté comparable, sans imposer minage/forge/artisanat au maximum à un mage ou à un combattant qui s'équipe autrement. Pas de passage gratuit ni de validation directe d'épreuves par achat.
- **Équilibrage prioritaire** : comparer dégâts réels, survie, stocks, coût, autonomie idle, XP et **temps de préparation** à plusieurs paliers de progression. Ni nerf mécanique injustifié d'un style, ni corvées identiques pour les trois.
- **Non figé** : formules, seuils de défaillance, coût magique détaillé, réparations de boss, protections idle, choix d'épreuves et niveaux requis.

## Survie, mort progressive et Divinité — orientations du 11 octobre 2026

- **Arrêt automatique acquis** : l'arrêt conditionnel du combat (PV, munitions, durabilité, Dette Occulte) devient une capacité spéciale à **acheter/débloquer et améliorer**, effective que le joueur soit présent ou en idle. L'**arrêt manuel** reste possible gratuitement quand il contrôle son personnage. Nom de travail : « Instinct de Survie » ; prix, paliers et limites non validés.
- **Mortalité progressive** : en début de jeu, **le monstre pille le contenu du sac mais ne prend pas l'équipement porté**. Plus tard, la défaite pourra aussi faire perdre des pièces d'équipement, en commençant par les **plus faibles paliers**, avec aggravation à mesure que le personnage progresse. **La mort définitive n'est jamais imposée automatiquement par une Renaissance** ; elle appartient exclusivement à une voie **Hardcore choisie volontairement après une réelle maîtrise du jeu**, sans question de difficulté à la création du personnage.
- **Combats de guilde** : **aucune mort définitive**, même si un participant a volontairement activé Hardcore. Les pertes matérielles et pénalités spécifiques aux guildes restent à définir, et une protection de mort définitive n'est pas dépensée pour une défaite de guilde.
- **Reliques de sauvegarde** : objets de protection **extrêmement rares** récupérables sur boss et boss mondiaux, avec règles d'activation, de consommation, de possession et de conservation encore à définir. **Concept retenu : « Le Dernier Souffle » — « La mort a bien reçu votre dossier. Elle l'a malheureusement égaré. »** Une protection envisagée à usage unique contre la mort définitive, sans statistiques ni drop chiffrés pour l'instant. Ils ne sont pas automatiquement des armes exceptionnelles et ne doivent pas contourner leurs règles existantes.
- **Divinité** : orientation narrative nouvelle : après R20 et les autres accomplissements requis, devenir un Dieu de l'Éclipse Blanche pourrait signifier **ne plus pouvoir disparaître définitivement**, sans obtenir l'invincibilité en combat. Portée exacte à valider ; R20 et Divinité restent distincts.
- Équité : pas de coût vital réservé aux euros ; serveur autoritaire pour mort, protections et auto-arrêt ; une panne/bug/triche tierce ne doit jamais être assimilé à une mort normale.
- **À arbitrer** : palier fatal, conséquences d'une défaite, sauvegardes/recours, PvP, coûts/paliers Instinct, rareté/échange des reliques, privilèges divins. Voir [document détaillé](mort-survie-et-divinite.md).

## Revanche sur le monstre pilleur — intention retenue le 11 octobre 2026

- Après une défaite et un pillage, conserver le **butin perdu** dans un état serveur identifiable et récupérable ; **en combattant à nouveau le même type de monstre**, le joueur peut voir réapparaître **son pilleur particulier**, un peu plus puissant que les autres.
- L'apparition doit être annoncée **explicitement dans un canal de chat/journal dédié**, sous forme d'une proposition **« Le défier ? Oui / Non »**, avec le risque signalé. **Jamais de revanche déclenchée automatiquement**, y compris en combat idle : si le joueur est absent, garder une proposition à consulter à son retour, selon une durée restant à définir.
- **Refus explicite et abandon :** le pilleur se méfie et sa probabilité de réapparition diminue à chaque refus. Après **3 refus explicites (seuil validé)**, il disparaît définitivement avec le contenu du sac : la revanche est close et le butin n'est plus récupérable. Le joueur voit combien de refus lui restent et confirme le dernier ; une invitation manquée en idle n'est pas un refus. La courbe de probabilité reste à équilibrer ; **le maximum de 3 refus est validé**. Aucune récompense artificielle en or ne doit naître de la clôture.
- En cas de victoire, rendre les biens récupérables **une seule fois**, en transaction, même si le sac est plein ou si plusieurs sessions demandent la récompense. Les chances de réapparition, délais, bonus de difficulté, conséquences d'un nouvel échec et statut des biens non récupérés restent à équilibrer.
- Voir [conception détaillée de la revanche et de la mort](mort-survie-et-divinite.md).
