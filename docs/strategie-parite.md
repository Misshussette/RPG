# Reprise du projet — parité fonctionnelle avant personnalisation

**Décision de cadrage du 11 octobre 2026.** Ce document remplace la stratégie consistant à enrichir progressivement la petite alpha comme si elle constituait le jeu final.

## Objectif

Construire **L’Éclipse Blanche**, un RPG connecté React, avec une couverture fonctionnelle aussi complète que possible de l'application étudiée, puis adapter les mécaniques à nos décisions et écrire notre histoire originale. L'objectif de parité concerne les **fonctions et comportements**, non la reproduction sans autorisation de code, d'illustrations, de textes ou d'éléments protégés. Les droits sur le code de référence doivent être vérifiés avant toute réutilisation littérale.

### Ordre des travaux

1. **Inventaire exhaustif du fonctionnement de référence** : interfaces, menus, compétences, professions éventuelles, combats, quêtes, monstres et boss, équipement, artisanat, activités, économie, sauvegardes, événements et interdépendances. Pour chaque module : comportements observés, sources exactes, données manipulées, formules, tests et écarts.
2. **Cartographie de parité** : présent / partiel / absent / à transformer ; ne pas attribuer un statut « couvert » à une fonction simplement parce qu'un bouton existe.
3. **Socle React + TypeScript et API serveur autoritaire + PostgreSQL** : une seule application en ligne, même personnage en solo et multijoueur. Pas d'état économique faisant autorité sur le client.
4. **Reconstruction fonctionnelle par modules complets**, avec tests de règles et d'intégration : chaque module doit retrouver sa richesse avant la simplification de l'UX.
5. **Adaptations approuvées** : progression R0–R20, perceptions selon la Renaissance, boss mondiaux avec seuils collectifs/individuels et rareté, équipements, bénédictions, anti-triche et économie.
6. **Écriture originale et simplification de l'interface** seulement après compréhension précise du comportement ; ergonomie dense desktop, responsive mobile. Conserver les interactions utiles, pas nécessairement leur expression graphique identique.

## Principe cardinal — pas de restriction à trois classes

Le choix d'une spécialisation de combat ne doit **jamais supprimer ni rendre inaccessibles les autres compétences et modes de progression** présents dans l'application de référence. Les trois options « mêlée / distance / magie » de l'alpha 0.2.x sont des **options de démonstration**, pas une restriction validée. Les relations entre maîtrise, équipement, spécialisation, activités et progression seront reconstruites à partir de l'audit complet ; aucune règle de blocage de compétences ne doit être inventée.

## Contraintes déjà acquises

- Une seule source pérenne de données, sans saisies ou copies inutiles ; identifiants stables.
- Client React (TypeScript recommandé) pour web et PC installable si retenu ; même compte, même serveur, mêmes règles.
- PostgreSQL et transactions contrôlées côté serveur ; calculs de combats, tirages, butins, horodatages et monnaie côté serveur.
- Aucun import de progression locale vers le multijoueur ; abandon de localStorage comme source de vérité.
- Anti-triche : validations préventives et alertes d'anomalies, notamment temps minimum de Renaissance, sans sanction automatique sur simple vitesse.
- Aucun paiement d'or contre euros ; crédits spéciaux et Fast Mode payant envisagés, Stripe non activé avant sécurisation complète.
- Objectifs difficiles à atteindre, même si le jeu est facile à comprendre et agréable à utiliser.
- Éviter d'introduire prématurément Kubernetes ; capacité d'évolution à prévoir.

## État de la base actuelle

**L'alpha 0.2.3 est une maquette expérimentale**, non le périmètre fonctionnel visé. Le prototype possède quatre adversaires et trois quêtes ; il ne démontre pas une parité réelle. Le backend initial a des lacunes bloquantes de sécurité et le client n'y est pas raccordé. Ne pas confondre réussite du build Vite avec préparation à une ouverture publique.

Les futures étapes doivent être suivies sur une **matrice de parité vérifiable**, avec preuves de tests et statut explicite de chaque système. Éviter les chiffres de couverture arbitraires avant le véritable audit.

## Ce qui n'est pas encore établi

La parité exacte n'a pas été démontrée : l'audit du contenu complet de l'ASAR et de ses dépendances reste à achever. La liste canonique des compétences, leur accessibilité simultanée, les règles détaillées et le statut des composants tiers doivent être consignés avant de modifier les systèmes de progression.

## Audit disponible

La première cartographie structurelle est enregistrée dans [l'inventaire fonctionnel](audit/inventaire-fonctionnel.md) et sa [matrice de parité](audit/matrice-parite.md). Elle atteste la présence des systèmes dans les sources examinées, **pas** leur compatibilité directe avec un backend sécurisé ou une parité validée par test.

## Phase suivante — audit comportemental publié

- [Progression et compétences](audit/comportement-competences.md)
- [Combat et équipement](audit/comportement-combat.md)
- [Activités / stockage / absence](audit/comportement-activites.md)
- [Scénarios de tests de parité](audit/contrats-tests-parite.md)

L'examen repose sur l'implémentation analysée, en signalant les anciens commentaires devenus faux. Il reste un **audit statique**, avant les tests exécutables de notre moteur React/serveur.


## Priorité rappelée — conserver la profondeur avant toute simplification (11 octobre 2026)

**Intention du créateur :** repartir d'une **reconstruction fonctionnelle quasi complète** de l'application de référence étudiée, et non d'une mini-alpha que l'on agrandit mécanisme par mécanisme sans vision d'ensemble. L'application de référence est la référence de **parité de fonctionnement, de richesse et d'interconnexions** ; reproduire seulement les menus, quelques récoltes ou quelques ennemis n'atteint pas l'objectif.

### Ordre impératif de travail
1. Reconstituer l'ensemble des systèmes identifiés et leurs dépendances (combat, compétences, équipement, banque, métiers, forge, contrats, quêtes, donjons, boss, familiers, échanges, etc.) avec des **règles jouables, des données persistantes et des tests**.
2. Dès la reconstruction, adapter les points structurels nécessaires à l'avenir (moteur serveur autoritaire, modèle de propriété des objets, logs et idempotence, progression R, déblocages, économie et multijoueur). Éviter une version jetable à réécrire une deuxième fois.
3. **Ensuite seulement**, simplifier la navigation, les blocs et les menus, conserver les interactions et la profondeur, rééquilibrer les difficultés et remplacer intégralement l'identité narrative/graphique.
4. Ne jamais afficher une fonction comme « reconstruite » si seul son panneau ou sa fiche existe. Les **17 compétences visibles** du lot 0.3.0 ne signifient pas que leurs mécaniques sont réalisées : seules les activités réellement implémentées le sont.

### Architecture de déblocage anticipée
La reconstruction doit permettre d'**exposer un système avant d'en ouvrir toutes les capacités**. Ne pas coder des versions parallèles ou dupliquées de la forge, des contrats ou des métiers ; chaque système conserve ses entités de référence et des capacités accessibles en fonction des conditions validées.

Les règles de déblocage (Renaissance, exploits, savoir-faire, prérequis d'objets, raretés, monnaies gagnées en jeu) seront des données de jeu contrôlées côté serveur, non des boutons cachés conditionnés uniquement dans React. Voir [Renaissance](renaissance.md) pour les idées à arbitrer.
