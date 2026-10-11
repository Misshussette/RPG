# Survie, arrêt automatique, mort définitive et Divinité

**Cadrage du 11 octobre 2026 — distinguer principes proposés par le créateur, orientations retenues et mécanique à arbitrer.**

Ce document concerne L'Éclipse Blanche : jeu en ligne avec **serveur autoritaire commun** pour solo/multijoueur, y compris simulation hors présence. Ne pas implémenter de seuils imaginés sans arbitrage ni tester les règles de mort définitive sur des comptes réels sans protections robustes.

## 1. Arrêt manuel et Instinct de Survie (déblocage automatique)

**Principe exprimé :** l'arrêt **automatique et conditionnel** d'un combat, en session active **ou** en idle, doit être **un pouvoir/une compétence particulière à acquérir**, et non une option gratuite donnée d'emblée.

- **Arrêt manuel** toujours possible quand le joueur est connecté et contrôle son personnage ; ne jamais le faire payer.
- **Instinct de Survie** : nom de travail pour le pouvoir acquis permettant au **serveur** de stopper le combat automatiquement selon un ou plusieurs seuils (PV, stock de flèches, durabilité, Dette Occulte). Le nom définitif, les seuils, rangs, coûts et acquis pérennes ou remis à zéro par R **ne sont pas validés**.
- **Pistes de progression** : une surveillance minimale des PV au premier rang ; puis risques matériels/magiques ; puis réglages combinés. Exemple, non validé : Initié / Confirmé / Expert. Éviter les réglages nombreux tant que le joueur ne les a pas débloqués.
- Acquisition à concevoir via **or gagné en jeu, accomplissements, ressources ou jetons lootés** ; ne pas rendre un moyen de survie indispensable exclusif aux achats en euros. L'achat de capacité est différent d'un coût de consommable par bataille.
- Le serveur évalue la condition **avant chaque nouveau tour/engagement où elle doit agir**, en même temps que la consommation d'objets et l'application des dégâts, sous transactions/idempotence. Exactement les **mêmes règles** pour joueur présent/absent ; l'écran ouvert ne crée aucun avantage non prévu. Si un événement a déjà causé une mort dans le tour en cours, l'automatisme ne remonte pas le temps.
- Ne pas créer d'immunité automatique gratuite : sans acquisition, le joueur choisit manuellement le retrait pendant sa présence, prépare ses ressources et accepte les risques d'absence. L'arrêt peut prévenir les risques estimables mais **ne garantit pas** d'éviter un coup fatal inattendu.

## 2. Défaite évolutive, pillage du sac et Hardcore volontaire — décisions du 11 octobre 2026

**Décision explicite du créateur :** ne **jamais** proposer « Normal / Hardcore » au moment de la création du personnage : il ne connaît pas encore suffisamment le jeu. La mort définitive ne doit **pas** être automatiquement imposée à partir d'une Renaissance, quel que soit le niveau atteint. Le joueur avance d'abord dans le mode ordinaire puis, **après avoir réellement acquis une maîtrise avancée du jeu**, peut choisir volontairement une voie **Hardcore à mort définitive**. Le critère d'accès, le caractère éventuellement irréversible du choix et l'équilibrage des récompenses restent à définir.

### Progression des conséquences en mode ordinaire

| Phase | Règle / orientation |
|---|---|
| **Début de partie** | Le personnage survit à la défaite : **le monstre pille le contenu de son sac**, tandis que **tout son équipement porté reste protégé**. Le personnage peut repartir ; aucune mort définitive. |
| **Milieu de progression** | Le pillage du sac persiste, et la défaite peut faire perdre **une pièce d'équipement de faible palier d'abord**. Les détails (combien de pièces, sélection, équipement endommagé plutôt que perdu, objets protégés) doivent être testés et annoncés. |
| **Haut niveau / Renaissance avancée, sans Hardcore** | La perte d'équipement peut devenir **plus sévère et porter sur des pièces plus puissantes**, tout en préservant l'existence du personnage. Aucun passage automatique en mort définitive. |
| **Voie Hardcore choisie en connaissance de cause** | Des combats PvE admissibles peuvent entraîner une **mort définitive du personnage** si aucune protection valide n'agit. Les exceptions, le déploiement et l'accord explicite préalable doivent être clarifiés. |
| **Divinité** | Une récompense possible, distincte de R20 : **échapper à la disparition définitive**, sans devenir invulnérable ni supprimer les conséquences ordinaires d'une défaite. À arbitrer dans le détail. |

- Le pillage concerne **les biens transportés dans le sac**, pas les ressources déjà déposées en banque ni les équipements portés protégés en début de partie. Les règles exactes pour **l'or (qui occupe une case du sac)**, les objets de quête ou liés, les consommables en réserve et les stocks d'une fabrication en cours restent à arbitrer : elles doivent être **visibles avant le combat**.
- **Piste privilégiée par le créateur : la revanche contre le monstre pilleur.** Après la défaite, le contenu pillé est associé à un **butin récupérable** et à une **rencontre de revanche** rattachée à l'espèce/type de monstre qui l'a volé. En combattant de nouveau cette espèce, le joueur peut provoquer une apparition particulière de **ce même pilleur**, et non un monstre générique censé rendre aléatoirement les objets. Voir ci-dessous le fonctionnement précis envisagé. La récupération effective dépend d'une nouvelle victoire ; les modalités d'expiration et d'une deuxième défaite restent à arbitrer.
- La perte d'équipement évolue graduellement : **bas palier d'abord**, puis risque croissant à mesure que le personnage devient puissant. Le choix doit rester déterministe ou tiré côté serveur selon une règle connue, non fondé sur des suppositions du navigateur. Une pièce exceptionnelle, bénie, acquise contre des crédits premium ou nécessaire à une quête exige un régime clair avant ouverture publique ; **ne jamais détruire silencieusement ces objets**.
- Une protection de sac achetable, un coffre sécurisé, un contrat d'assurance ou une récupération via victoire pourraient enrichir la stratégie, **mais aucun n'est validé à ce stade** ; éviter que la perte ne rende l'économie des débutants impossible.
- La défaite n'efface jamais arbitrairement le **compte**, les droits financiers, les achats premium, les accomplissements permanents ou les éléments historisés. L'archivage d'un personnage Hardcore vaincu doit être auditable et doit éviter la suppression brute de tous ses enregistrements de progression.

### Revanche : apparition du pilleur dans le farm — proposition du créateur

1. **Défaite et traçabilité :** le serveur attribue un identifiant unique à la perte : joueur propriétaire, **monstre pilleur identifiable**, espèce/type, rencontre d'origine, objets et quantités pillés, horodatage, statut du butin. Le butin est déplacé dans un **stock de pillage côté serveur**, jamais copié dans l'inventaire d'un monstre et simultanément dans celui du joueur. Le personnage conserve l'équipement protégé par les règles de son palier.
2. **Recherche naturelle :** le joueur peut retourner affronter **le même type de monstre**. À une occasion régie par des probabilités/conditions **non encore validées**, son pilleur spécifique réapparaît. Le journal des pertes explique clairement **quel type chasser et pourquoi**, et affiche le butin qui peut encore être retrouvé. Aucune apparition automatique à chaque combat garantie.
3. **Annonce dédiée et explicite :** dans un **canal de chat/journal dédié aux rencontres particulières et aux revanches** (pas un message facilement perdu dans le log normal), afficher une alerte persistante : « **Le pilleur de votre sac a été repéré !** Il est plus puissant qu'un adversaire ordinaire. Voulez-vous le défier ? **Oui / Non** ». Proposer un accès au détail du risque et au butin réclamable. La phrase exacte reste à écrire pour le ton déjanté du jeu.
4. **Consentement à la rencontre :** **Oui** engage une rencontre spéciale avec **ce pilleur renforcé**, selon un niveau de puissance majoré mais à équilibrer ; **Non** refuse sans déclencher automatiquement le combat. Une apparition détectée alors que le joueur est **idle/absent** doit être conservée comme **invitation en attente** (avec règles d'expiration à définir), et **ne peut jamais forcer** un combat de revanche en arrière-plan. L'invitation ne doit ni interrompre le farm de façon injustifiée ni se perdre après rechargement.
5. **Victoire :** transfert **unique et atomique** du butin encore récupérable depuis le stock de pillage vers une destination sûre, en tenant compte de l'inventaire plein (réserve de récupération dédiée possible, à arbitrer). Annulation de la revendication et statut « récupéré » empêchant de toucher deux fois les mêmes biens. Les récompenses normales du combat de revanche, s'il y en a, seront distinguées du butin personnel retrouvé.
6. **Nouvelle défaite :** conséquences selon le régime Normal/Hardcore et règles de pertes en vigueur ; décider ultérieurement si le butin pillé reste récupérable, est réduit ou devient définitivement perdu. **Ne pas** présumer d'une nouvelle disparition de matériel au-delà de la règle explicitement annoncée.
7. **Anti-abus :** toute apparition/acceptation et tout transfert se décident sur le serveur, en transaction et avec identifiants idempotents. La rencontre est **strictement personnelle** (ou son partage coopératif devra être formellement conçu) ; empêcher les duplications par multi-session, changement de type de combat, marchés, déconnexion, redémarrage, mort répétée ou requêtes simultanées. Ne jamais laisser un autre joueur récupérer un butin lié sans règle d'échange spécifique.

**Points encore ouverts :** fréquence et fenêtre de réapparition, durée d'une invitation, sélection et stockage du butin, éventuelle détérioration du butin, échelle d'augmentation des caractéristiques du pilleur selon la puissance du personnage, possibilité de plusieurs pilleurs actifs, aide d'amis, expérience/loot normal, interaction avec objets de quête, conservation à la Renaissance, version mobile du canal et traitement des événements pendant les combats mondiaux.

**Invariant d'ergonomie :** la recherche et la revanche **ne sont jamais cachées**. Le joueur sait que son sac a été pris, par quelle espèce, comment tenter de retrouver son pilleur, pourquoi celui-ci est plus fort et ce qu'il risque en choisissant « Oui ».

### Combat de guilde : exclusion explicite de la mort définitive

**Décision claire :** pendant un **combat de guilde**, **aucune mort n'est définitive**, **même si le personnage a choisi Hardcore**. Une défaite de guilde ne doit donc pas déclencher la consommation automatique d'une protection contre la mort définitive, ni une mort permanente déguisée par une mise à jour différée. Les pertes de sac, l'usure, les frais et les récompenses propres aux batailles de guildes restent **à décider**. Prévoir un type de combat serveur explicite, vérifié au début et à la résolution ; aucune simple étiquette client « guilde » ne doit pouvoir requalifier un combat PvE pour contourner ses risques.

### Accès à Hardcore après apprentissage

- **Ni case à cocher à l'inscription, ni choix de difficulté dès R0.** Le joueur doit comprendre les mécaniques, les risques et les conséquences avant d'y avoir accès.
- À terme, proposer un **rite, défi narratif ou accomplissement de maîtrise** pour ouvrir volontairement ce parcours. Aucun seuil R ou niveau n'est encore arrêté ; ne pas lier l'accès à la seule durée de jeu.
- Avant activation : avertissement explicite de la mort définitive en PvE admissible, explication des protections, conditions d'arrêt, des cas exclus (guilde), et **confirmation distincte**. L'absence de réponse ne vaut jamais consentement.
- Reste à décider : Hardcore réversible ou non ; récompenses propres (sans économie pay-to-win) ; compatibilité avec le marché, les groupes et la Divinité ; restrictions sur l'activation pendant un combat ; éventuelle option pour désactiver la participation à des affrontements létaux.
- Les règles de pillage et de perte d'équipement **hors Hardcore** continuent d'évoluer avec la puissance du personnage pour conserver une pression réelle sans transformer le mode ordinaire en mort permanente.

**Non négociable sur le plan technique :** aucune disparition irréversible sur simple déclaration du navigateur. Le serveur conserve un état terminal auditable et un mécanisme de correction des décès liés à un **bug, une panne, une désynchronisation ou une triche démontrée d'un tiers** ; une indisponibilité de service n'est jamais un événement de gameplay.

## 3. Reliques rarissimes de protection de la mort

**Intention exprimée :** protections récupérables par loot sur **boss** et **boss mondiaux**, extrêmement rares, à haute valeur stratégique. Leur distribution doit respecter les règles d'équité solo/multijoueur et les vérifications de contribution déjà prévues pour les boss mondiaux.

**Concept désormais apprécié et à conserver sous ce nom (sans préjuger de ses statistiques) :** **Le Dernier Souffle** — *« La mort a bien reçu votre dossier. Elle l'a malheureusement égaré. »* Une relique extrêmement rare obtenue sur un boss ou boss mondial, envisagée pour **empêcher une mort définitive une seule fois**, puis disparaître à l'activation. Les conditions de drop, les éventuelles restrictions et le mécanisme de consommation **ne sont pas encore chiffrés**. La protection contre la mort définitive ne doit pas se consommer lors d'une défaite de guilde où la mort permanente est exclue.

Choix encore ouverts : simple effet préventif consommé automatiquement vs activation préalable ; possibilité d'équiper un objet ou de conserver une charge dédiée ; protection à usage unique ou charges ; transférabilité et liaison ; rang de boss, rareté, plafonds de stock, conservation à travers R ; interaction avec bénédiction ; récompenses des boss et provenance auditable. Ne pas confondre ces objets avec les **armes exceptionnelles non forgeables/non améliorables/non recyclables** déjà définies : il s'agit potentiellement d'une autre catégorie.

**Éthique d'équilibrage** : les protections doivent ajouter une vraie décision stratégique, sans créer un commerce forcé de sauvegardes vitales, un achat d'immortalité par argent réel, ni un système qui incite déraisonnablement à farmer uniquement pour éviter un risque mathématiquement inévitable.

## 4. Raison d'être de la Divinité

Le plafond **R20** et la **Divinité** restent deux objectifs **distincts** dans les décisions existantes. Le lien narratif envisagé : un mortel s'expose progressivement à la disparition définitive ; atteindre la Divinité lui donne une vraie raison de vouloir surmonter cette fatalité, au-delà d'augmenter ses statistiques.

- **Piste**, à ne pas tenir pour acquise : statut divin offrant une pérennité du personnage face à la mort définitive, tandis que la défaite, la perte d'équipement, la dette magique et autres coûts restent possibles. Un dieu reste concerné par les combats et les contributions aux boss.
- R20 reste atteignable **sans paiement réel**. Aucun bouclier premium ne doit remplacer les épreuves, compétences, contributions et accomplissements nécessaires.
- Exiger de nombreuses heures de jeu **ne justifie pas** de faire perdre le compte, les achats ou les droits de l'utilisateur sans recours lors d'un incident technique ; la fiction de la mort ne doit jamais se substituer à la comptabilité et à la sécurité du service.

## 5. Impacts sur le moteur et essais

- État de la configuration d'Instinct de Survie **persisté serveur**, autorisations évaluées par personnage et version de règles ; audit d'acquisition et de consommation.
- Tour de combat : vérifier les préconditions d'arrêt de façon déterministe, simuler dégâts et attrition des ressources, traiter relique/prévention/défaite **une seule fois en transaction**. Ne jamais calculer des attaques gratuites à zéro flèche ni ignorer une dette critique par reconnexion.
- Simulation d'absence : mêmes calculs que pendant une session active ; aucune pénalité arbitraire pour un navigateur fermé ; procédures d'annulation/rattrapage en cas de panne serveur.
- Tester les cas : plus de flèches, arme à zéro, dette au maximum, coup fatal en un tour au-dessus du seuil d'arrêt, coup fatal avec/sans protection, protections simultanées, double événement, transition du statut mortel au statut soumis à la mort définitive, arrêt manuel, interruption serveur, mode solo et coopératif.
- **Simulations d'équité indispensables** : comparer coûts, fréquence de décès, durées idle sûres, rendements et accessibilité de la protection entre archer, mêlée et mage ; éviter une classe structurellement condamnée ou invulnérable.

## Statut des décisions — mis à jour après arbitrage

**Décisions exprimées clairement :** pas de choix Hardcore à la création ; accès volontaire seulement après maîtrise du jeu, jamais imposé par niveau ou Renaissance ; **aucune mort définitive en bataille de guilde**, même pour Hardcore ; en début de jeu, **pillage du contenu du sac par le monstre, équipement porté protégé** ; progression ultérieure vers perte d'équipement, de faible palier en priorité puis de valeur plus grande ; protection mythique rarissime de boss contre la mort définitive ; **Le Dernier Souffle** et sa phrase sont retenus comme concept narratif à préserver. Arrêt automatique acquis et serveur autoritaire pour mode actif/idle.

**Encore à concevoir et tester :** possibilités de récupération du butin pillé, exceptions de propriété (objets liés/quête/premium), or, nombre d'équipements perdus, seuils de progression, défi d'accès et réversibilité de Hardcore, règles PvP hors guerre de guildes, déclenchement/stockage/transfert des reliques, implications exactes de la Divinité et conséquence des morts en mode ordinaire/Hardcore.

**Priorité technique :** faire précéder toute mécanique de perte permanente par un historique et des tests de conservation des objets/transactions, en excluant toutes les morts provoquées par défaut du serveur.
