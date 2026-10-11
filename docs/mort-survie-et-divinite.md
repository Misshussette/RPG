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

## 2. Échelle de gravité de la mort

**Proposition du créateur :** la mort définitive de la référence a un attrait (« une chance »), mais elle est trop punitive/décourageante si appliquée dès le début. La **réserver à un stade avancé** de progression/Renaissance, avec des objets de protection très rares.

| Phase | Orientation à tester, sans palier chiffré approuvé |
|---|---|
| Départ / R0 | Défaite réelle mais **non définitive** : blessures/soins, récupération, pertes encadrées ; conserver identité, savoirs acquis et progression suffisamment pour apprendre. |
| Progression intermédiaire | Défaite plus coûteuse mais encore récupérable : objets abîmés, perte de ressources ou dette/récupération selon règles explicites. |
| Hautes Renaissances | **Risque de mort définitive** : existence du personnage réellement menacée, seulement quand le joueur a reçu une information explicite, durable et non ambiguë sur le changement de régime. |
| Divinité | Récompense possible : échappatoire permanente à la **mort définitive**, pas invincibilité, immunité aux dégâts, ni automatiquement victoire en combat. **À valider** comme portée du statut divin. |

**Arbitrages encore indispensables :** seuil de niveau ou de R qui introduit la mort définitive ; maintien éventuel d'un mode volontaire hardcore plus tôt ; distinction mort du personnage / compte / collections historiques ; traitement des objets, des succès et des biens liés à un personnage mort ; récupération éventuelle à coût élevé hors reliques ; sanctions comparables entre combat actif et idle ; conséquences de PvP (aucune perte définitive involontaire due à la traque ou au harcèlement).

**Non négociable sur le plan technique :** aucune suppression irréversible sur simple déclaration du navigateur. Le serveur doit disposer d'un état terminal auditable et d'un processus permettant de corriger **les morts provoquées par panne, bug, désynchronisation ou triche démontrée d'un tiers** ; une indisponibilité de service n'est pas un événement de jeu. Conserver un journal et des sauvegardes administratives sécurisées n'équivaut pas à autoriser des restaurations librement exploitables par le joueur. L'échec normal du combat reste un risque si les règles sont valides.

## 3. Reliques rarissimes de protection de la mort

**Intention exprimée :** protections récupérables par loot sur **boss** et **boss mondiaux**, extrêmement rares, à haute valeur stratégique. Leur distribution doit respecter les règles d'équité solo/multijoueur et les vérifications de contribution déjà prévues pour les boss mondiaux.

**Exemple non canonique :** *Le Dernier Souffle*, une protection consommée au premier événement de mort définitive éligible. Le joueur survivrait à cet événement et la protection serait dépensée atomiquement, sans duplication ni course critique sur plusieurs requêtes. Ce n'est ni une recette arrêtée ni un objet confirmé.

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

## Statut des décisions

**Intention forte confirmée par la discussion** : arrêt conditionnel acquis plutôt que gratuit ; fonctionne avec joueur en ligne ou idle ; mort définitive repoussée dans la progression ; protections mythiques très rares issues des boss ; Divinité justifiée par une victoire sur la mortalité.

**À valider avant de coder** : pouvoir et rangs exacts, conditions d'achat, caractère automatique des protections, seuil de mort définitive, conséquences des premières défaites, statut des acquis à la mort, mécanisme d'immortalité divine et protections contre les incidents techniques.
