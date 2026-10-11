# Matrice de parité fonctionnelle — L’Éclipse Blanche

**État : inventaire structurel V1, 11 octobre 2026.** Cette matrice complète l'[inventaire sourcé](inventaire-fonctionnel.md) et transforme la reconstruction en lots fonctionnels vérifiables. Le mot « parité » vise les **comportements observables**, pas le code, les noms, les textes ou les graphismes de la référence.

## Statuts

- **Référence : confirmé** = présence d'un catalogue et/ou d'une implémentation dans l'archive ; pas nécessairement un test de fonctionnement exhaustif.
- **Alpha : partiel** = le prototype 0.2.3 offre une boucle simple apparentée, **sans** reproduire les détails ou les interactions de la référence.
- **Alpha : absent** = pas de module jouable correspondant.
- **API : ébauche** = infrastructure serveur initiale présente mais non raccordée au navigateur ni vérifiée en intégration PostgreSQL.
- **Cible : adapter** = la mécanique doit respecter une décision spécifique à L’Éclipse Blanche au lieu d'être recopiée telle quelle.

## A. Progression et combat

| ID canonique de chantier | Fonction à obtenir | État 0.2.3 | Décision / critère de parité |
|---|---|---|---|
| CORE-01 | Un joueur, un personnage persistant, compte sécurisé | API : ébauche | React + comptes serveur, aucune progression locale autoritaire |
| CORE-02 | 17 compétences parallèles, niveaux et XP | **Absent** (3 styles simplifiés) | Toutes disponibles sur un même personnage, même si style privilégié |
| CORE-03 | Niveaux de joueur / de combat, calcul des caractéristiques | Partiel | Moteur serveur déterministe, seuils/version de formule documentés |
| CORE-04 | Passifs de compétences et déblocages | Absent | Règles par niveau avec tests de paliers |
| CBT-01 | Styles mêlée, distance, magie **et défense** | Partiel | Sélection modifiable selon équipement, jamais de classe bloquante |
| CBT-02 | Précision, protections et résistances par style | Absent | Formules et unités de test par combinaison d'attaques |
| CBT-03 | Magie : 16 sorts / 4 éléments | Absent | Sélection, coût, effets et restrictions |
| CBT-04 | Protections et prières : 21 entrées | Absent | Activation, interruption et interaction avec buffs |
| CBT-05 | Munitions, soin manuel/auto, potions, décès et fuite | Partiel | Séquences sécurisées sur serveur, sans gains en double |
| CBT-06 | Combat automatique / cadence / enchaînement | Partiel | Horloge serveur, limites de cadence, prévention anti-triche |
| CBT-07 | Catalogues des monstres et déblocages | Partiel (4 entrées originales) | Éditer ~50 créatures propres, règles de progression sans régions obligatoires |
| CBT-08 | Maîtrise des monstres, seuils et prestige | Absent | Progression individuelle persistante, bonus calculés au serveur |
| CBT-09 | Donjons à rencontres successives | Absent | Séquence, salle courante, difficulté, répétition, butin, reconnexion |
| CBT-10 | Boss mondiaux et événements de présence | Absent | Serveur partagé, R/perception, durée, seuils, tirages et contributions |
| CBT-11 | Boîte de butin et transfert après combat | Absent | Droits d'inventaire, banque, saturation et idempotence |

## B. Objet, artisanat et économie

| ID | Fonction à obtenir | État 0.2.3 | Décision / critère de parité |
|---|---|---|---|
| INV-01 | Inventaire visuel intégral, cases vides comprises | Partiel | 16 cases de départ actuellement ; l'or occupe une case |
| INV-02 | Banque triable, filtres, onglets, quantités | Absent | Source de vérité serveur, transferts atomiques |
| INV-03 | Équipement sur 13 types d'emplacements | Partiel (arme uniquement) | Prérequis et interactions explicites |
| INV-04 | Presets d'équipement / échange rapide | Absent | Sauvegarder références, pas dupliquer l'équipement |
| INV-05 | Raretés, variantes, attributs et ensembles | Absent | Tables propres, bonus intégralement calculés côté serveur |
| INV-06 | Amélioration, coût, destruction / récupération | Absent | Appliquer règles déjà validées pour bénédiction et boss |
| INV-07 | Sacs et transfert prioritaire | Partiel (capacité simple) | Adapter : extension de capacité globale plutôt que sacs séparés |
| INV-08 | Recettes consommant les ressources admissibles en banque | Absent | Débloquer via maîtrise, sans dupliquer les quantités |
| ECO-01 | Achat auprès de marchands et vente avec frais | Absent | Or jeu, contrôle de prix/quantités et provenance |
| ECO-02 | Marchand itinérant et événements de prix | Absent | Horloge serveur, stock central, dates de disponibilité |
| ECO-03 | Échanges et enchères entre joueurs | Absent de la référence reçue | **Nouveau** : marché sécurisé côté serveur, transferts traçables |
| ECO-04 | Crédits spéciaux, achats et Fast Mode | Absent | **Nouveau** : Stripe webhooks vérifiés, ledger, abonnement, remboursements |
| CRAFT-01 | Extraction (8 gisements) | Absent | Activité, outils, prérequis, XP, loot, bonus |
| CRAFT-02 | Bûcheronnage (8 arbres) | Absent | Idem ; relation avec feux et arcs |
| CRAFT-03 | Pêche (6 prises) et cuisine | Absent | Prise, cuisson, nourriture, soin |
| CRAFT-04 | Métallurgie, lingots (8), objets (53) | Absent | Recettes, coûts, vitesse et consommation transactionnelle |
| CRAFT-05 | Artisanat (49 recettes) | Absent | Fabrication d'équipements, variations et sous-produits |
| CRAFT-06 | Arcs et flèches (8 + 8 recettes) | Absent | Compatibilité de munitions avec les armes |
| CRAFT-07 | Vol (8 cibles), risque et récompenses | Absent | Échecs, pénalités et fréquence contrôlées |
| CRAFT-08 | Culture (7 plantes, 7 préparations) | Absent | Minuterie serveur et effets de préparations |
| CRAFT-09 | Allumage des feux / crémation | Absent | Combustibles, os, bonus et états temporaires |

## C. Contenu et méta-progression

| ID | Fonction à obtenir | État 0.2.3 | Décision / critère de parité |
|---|---|---|---|
| QUEST-01 | Quêtes à prérequis, coûts, récompenses | Partiel (3 quêtes) | Un système déclaratif, histoire originale ultérieure |
| QUEST-02 | Chapitres narratifs conditionnels | Absent | Notre univers ; lecture/relecture, conditions persistantes |
| QUEST-03 | Interlocuteurs, dialogues et interactions | Absent | Réécriture complète des contenus, règles de déblocage conservées |
| QUEST-04 | Factions, réputation, missions, boutiques | Absent | Plusieurs affiliations, conséquences et bonus explicites |
| QUEST-05 | Chasse/contrats, points, automatisation | Absent | Contrats et progresser solo/multi sans double rétribution |
| META-01 | Collection / Codex de découvertes | Partiel | Découverte != propriété != exploit ; acquis permanents |
| META-02 | Succès, récompenses, titres et rangs | Absent | Permanents entre R, calculs reproductibles |
| META-03 | 17 familiers de compétence | Absent | Chances contrôlées côté serveur, acquisition et passifs |
| META-04 | Forge spéciale et ses améliorations | Absent | Ressource propre, actions, production passive et contrôles |
| META-05 | Coffres, tirages et tables de rareté | Absent | Aucun tirage monétisé aléatoire au lancement ; serveur seulement |
| META-06 | Renaissance R0–R20 | Absent | **Adapter** : objectifs narratifs et exploits durables, perceptions changeantes |
| META-07 | Paramètres de difficulté / rythme | Absent | Pas de progression clonable ; Fast Mode abonnement futur |

## D. Infrastructure, confort et sécurité

| ID | Fonction à obtenir | État 0.2.3 | Décision / critère de parité |
|---|---|---|---|
| TECH-01 | Client React responsive complet | Absent (JavaScript DOM) | Pages composables et état d'UI distinct des règles |
| TECH-02 | Calculs d'actions exclusivement serveur | API : ébauche | Aucune commande `giveGold` ou modification libre d'état |
| TECH-03 | Persistance PostgreSQL et journal d'événements | API : ébauche | Transactions et tests concurrency réels |
| TECH-04 | Reconnexion et reprise d'activité | Absent | Horloge serveur, reprise déterministe après déconnexion |
| TECH-05 | Progression hors connexion | Partiel côté navigateur | Recalcul serveur à cap contrôlé ; durées déblocables |
| TECH-06 | Langues et traduction | Absent | Interface FR d'abord, structure extensible |
| TECH-07 | Aide, tutoriel, Codex et fiches d'objets | Partiel | Guide court contextuel et comportements réels |
| TECH-08 | Journal de jeu, filtres et historique | Partiel | Ordre chronologique, log serveur et notifications utiles |
| TECH-09 | Administration et détection de triche | API : ébauche | Alertes, délais R, historiques justificatifs, prévention |
| TECH-10 | Authentification renforcée et reprise de compte | API : ébauche | Cookies/CSRF, vérification email, protection abus |
| TECH-11 | Audio, options et accessibilité | Absent | Originaux, réglages sauvegardés serveur si approprié |
| TECH-12 | Sauvegardes externes et test restauration | Absent | Avant bêta en ligne et surtout avant paiements |

## Cinq règles d'acceptation transverses

1. **Couverture contrôlable** : une fonctionnalité n'est pas marquée complète si seul le menu ou la carte est visible. Test action → coût → résultat → persistance → reconnexion.
2. **Pas de classes exclusives** : toutes les compétences se développent sur un personnage, quelle que soit sa spécialité de combat actuelle.
3. **Une donnée = une référence pérenne** : un objet possède un ID unique et une provenance unique ; l'inventaire, la banque et le marché ne détiennent pas de copies concurrentes.
4. **Économie et anti-triche côté serveur** : RNG et temps côté serveur, opérations atomiques, quotas, idempotence et journalisation sans secrets exposés.
5. **Évolutivité** : React/web d'abord, PC via même interface installable si utile ; backend sans état de session locale pour évoluer vers plusieurs instances sans Kubernetes au départ.

## Ordre de reconstruction recommandé

| Étape | Livraison attendue | Condition de sortie |
|---|---|---|
| **0 — Extraction de règles** | Catalogues propres, contrats de données, formules et scénarios de test | 17 compétences et dépendances identifiées, pas de blocage de classe |
| **1 — Socle React / serveur** | Compte, personnage, état persistant, action transactionnelle | Tests réels SQL, reconnexion, fraude triviale impossible |
| **2 — Combat + équipement + inventaire** | Résolution et interfaces riches, 13 emplacements et stockage | Combat et loot cohérents après relance et concurrence |
| **3 — Métier et économie locale** | Activités de production, recettes, vente, banque | Tous les flux de ressources et coûts auditables |
| **4 — Méta-progression** | Contrats, quêtes, collection, succès, forge, Renaissance | Acquis permanents, objectifs R différenciés, simulateurs |
| **5 — Multijoueur / exploitation** | Boss réellement partagés, échanges, classements, administration | Anti-triche, charge, observabilité, sauvegardes testées |
| **6 — Paiements et lancement** | Crédits / Fast Mode / traitement contestations | Audit sécurité, tests financiers, conformité juridique et capacité |

**Blocage prioritaire :** tant que le client actuel écrit lui-même XP, or et objets, aucune « parité multijoueur sécurisée » ne peut être déclarée. Les routines de l'application de référence sont une **source d'observation**, pas une couche serveur prête à utiliser.
## Complément d'audit comportemental (11 octobre 2026)

Les modules référencés ici ont désormais leurs premières fiches de règles :
[compétences et progression](comportement-competences.md),
[combat et équipement](comportement-combat.md),
[activités et stockage](comportement-activites.md)
et [contrats de tests](contrats-tests-parite.md).

**Important :** l'audit révèle des comportements actifs qui contredisent certains commentaires historiques du code étudié : niveau général conservé mais XP neutralisée ; style Défense réellement autorisé sur arme de mêlée ; certains passifs de défense présents dans le calcul mais non affichés dans le catalogue ; copie de l'état de Renaissance plus riche que son résumé introductif. Avant toute implémentation, préférer les branches exécutées et faire vérifier l'équilibrage décidé pour notre jeu. Aucun statut « paritaire » n'est encore revendiqué.
