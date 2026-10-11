# Contrats de test de parité — noyau du futur moteur React / serveur

**11 octobre 2026 — spécification de tests, pas une suite automatisée déjà exécutée.** On utilisera les comportements observés comme base de réimplémentation, puis les décisions originales de L’Éclipse Blanche comme exceptions explicites. La suite sera exécutée contre **l'API et PostgreSQL**, pas seulement contre des fonctions isolées dans le navigateur.

## Méthode de validation

Pour chaque action : (1) état serveur avant, (2) requête d'intention, (3) vérification des prérequis, (4) débit en transaction, (5) RNG serveur si applicable, (6) récompense et progression, (7) événement enregistré, (8) réponse client, (9) deuxième requête/reconnexion → **aucun gain supplémentaire**.

Les tests doivent piloter un générateur de nombres aléatoires **injectable uniquement dans les tests**, jamais accessible comme paramètre d'une requête client en production. L'horloge de test est également injectée en interne.

## T — Progression / compétences

| ID | Scénario | Vérification |
|---|---|---|
| T-P01 | Création avec orientation mêlée | 17 compétences présentes, XP initiale correcte, aucune voie verrouillée définitivement |
| T-P02 | Nouvel utilisateur | Niveau total 17, niveau combat 1, compétences à 1 |
| T-P03 | Cinq compétences combat à 100, métiers à 1 | Niveau combat 100 ; niveau total 512 |
| T-P04 | Compétences atteignant XP 82, 1 112, 78 144, 7 995 169 | Niveaux 2, 10, 50, 100 selon courbe étudiée (ou courbe d'équilibrage explicitement modifiée) |
| T-P05 | Bonus d'XP de feu actifs 5 %, 15 %, 20 % | Facteur multiplicatif des feux : 1,449 ; autres passifs/arrondis séparés |
| T-P06 | Changement d'une arme de mêlée vers arc puis bâton | XP déjà gagnées dans toutes les disciplines conservées |
| T-P07 | Activité avec bonus expirant au milieu du cycle | Seul l'intervalle valide bénéficie du bonus |
| T-P08 | R20 tente R21 | Refus ; aucun débit ou remise à zéro |
| T-P09 | Tentative client d'envoyer XP/or/puissance/R = valeurs forgées | Propriétés refusées ou ignorées ; aucune mutation non autorisée |
| T-P10 | Renaissance avec succès/découverte obtenus lors d'un cycle ancien | Conservation permanente conforme à nos règles, sans nouvelle réclamation |

## T — Combat / équipement

| ID | Scénario | Vérification |
|---|---|---|
| T-C01 | Arme de mêlée → modes mêlée et défense | Les deux disponibles |
| T-C02 | Arc → mode distance ; pas de munitions | Combat impossible à poursuivre sans munitions ; pas de dégâts fantômes |
| T-C03 | Bâton → magie ; sort au-dessus du niveau | Sort non appliqué ; repli sûr |
| T-C04 | Passer en défense et porter un coup efficace | XP de frappe en Défense + XP Santé, pas en Mêlée |
| T-C05 | Ennemi à 3 PV, attaque de 80 | Trois unités de dégâts utiles pour XP, pas 80 |
| T-C06 | Attaque ratée | Zéro XP de coup, aucun butin |
| T-C07 | Soin auto + frappe ennemie mortelle | Nourriture débitée avant frappe ; aucun retour à la vie après décès |
| T-C08 | Dernière charge de prière dépensée | Prière inactive pour les calculs de cette même attaque |
| T-C09 | Passifs armure/attaques selon style | Résistances et dégâts calculés sur la bonne famille |
| T-C10 | Déséquipement au sac plein | Refus explicite, objet toujours équipé |
| T-C11 | Double résolution d'un même tour simultanée | Une seule décrémentation de munition, un seul gain XP/butin |
| T-C12 | Fuite/déconnexion pendant un combat | Politique serveur vérifiable, pas de recharge fictive des PV adverses |

## T — Production, commerce, stockage, offline

| ID | Scénario | Vérification |
|---|---|---|
| T-A01 | Minerai → lingot → équipement | Chaque étape débite les entrées et crédite une seule sortie |
| T-A02 | Bûches → arcs + flèches | Compatibilité arc/munition contrôlée au combat |
| T-A03 | Poisson cru → cuisiné → soin auto | L'aliment consommé disparaît une seule fois |
| T-A04 | Fabrication à prix réduit par passif | Même coût affiché, vérifié et débité |
| T-A05 | Pièce unique sur banque/inventaire/équipement | Identité pérenne ; jamais présente dans deux lieux simultanés |
| T-A06 | Débit de matériau en inventaire, sac et banque | Cascade appliquée exactement une fois dans la transaction |
| T-A07 | Sac rempli, butin rare | Pas de perte silencieuse, résultat selon politique de coffre/overflow validée |
| T-A08 | Niveau 100 de métier + matériaux éligibles | Routage banque ou accès matériaux selon droit, sans duplication |
| T-A09 | Deux navigateurs demandent la même vente/production | Un seul succès ; second reçoit l'état actualisé |
| T-A10 | Récolte sur durée serveur avec client fermé | Gains bornés au cap de progression débloqué |
| T-A11 | Deux reconnexions en parallèle | Un seul règlement de la période absente |
| T-A12 | Arrêt du VPS après débit, avant réponse | Replay idempotent, jamais un double paiement ou double butin |
| T-A13 | Règles de temps non uniformes : bonus expiré, nouvel achat d'amélioration | Segmentation temporelle ; aucune accélération rétroactive |
| T-A14 | Création d'une récompense depuis un contrat déjà accompli | Aucun second paiement de quête/contrat |

## T — Boss, progression R et monétisation (adaptations nouvelles)

| ID | Scénario | Vérification |
|---|---|---|
| T-M01 | Même identité de créature, joueur R0 et R7 | Manifestations/perceptions distinctes selon règles déclarées |
| T-M02 | Palier de manifestation absent des joueurs | Pas de travail combat inutile ni seuil héritant des dégâts d'un autre palier |
| T-M03 | Contribution collective sous seuil, joueur seul extrêmement actif | Aucun tirage exceptionnel |
| T-M04 | Seuil collectif atteint, contribution individuelle insuffisante | Joueur exclu de l'attribution exceptionnelle |
| T-M05 | Deux seuils atteints | Tirage de rareté serveur **non garanti**, récompense selon R |
| T-M06 | R20 fortement développé seul | Seuil collectif théoriquement atteignable dans le temps imparti selon simulations d'équilibrage |
| T-M07 | Joueur tente de se déclarer Fast Mode | Accélération refusée sans droit d'abonnement actif côté serveur |
| T-M08 | Webhook de paiement redélivré 3 fois | Crédit premium attribué **une seule fois**, journal financier cohérent |
| T-M09 | Paiement contesté / remboursé | Suspension ou correction selon politique et obligations légales ; historique inchangé |
| T-M10 | Passage R0→R1 en durée mathématiquement impossible | Refus si prérequis impossibles ; alerte justifiée, sans bannissement automatique sur simple rapidité |

## Sortie d'un lot fonctionnel

Un module n'est considéré « paritaire » que lorsque ses tests d'action, de calcul, de coût, de persistance, de reconnexion, de concurrence, de contrôle serveur **et de rendu UI** passent. Les catalogues seuls et les tests statiques d'existence de menu ne suffisent pas.

**Ordre :** (1) données canoniques & XP/compétences, (2) équipement/combat, (3) moteur de cycles, (4) banque/inventaire/recettes, (5) hors ligne et automatisations, (6) meta-progression, (7) boss partagé, (8) paiements. L'expérience complète est ensuite simplifiée sans retirer de fonctionnalités.