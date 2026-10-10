# Économie, stockage et transactions

## Économie entre joueurs

- Vente directe, enchères et échange d'objets sont envisagés.
- Les équipements exceptionnels de boss perdent de la puissance **au changement de propriétaire** (voir [equipements.md](equipements.md)).
- Les objets bénis sont définitivement liés au personnage et sortent donc du commerce entre joueurs.
- La bénédiction constitue une dépense récurrente importante avant chaque Renaissance. Montants à équilibrer.

## Inventaire

Le « sac » acheté augmente la **capacité totale de transport** : il ne crée pas nécessairement un conteneur affiché séparément.

- Chaque type d'objet empilable occupe un emplacement ; l'or occupe également un emplacement.
- Capacité de départ **à arbitrer** : 24 emplacements envisagés initialement, puis scénario à 16 pour renforcer l'intérêt de la progression.
- Les extensions peuvent offrir des gains substantiels, dont **+24 emplacements** pour un grand palier ; prix, limites et prérequis non finalisés.
- Ne pas rendre la capacité illimitée : la banque doit conserver son intérêt.
- Une progression générale plutôt qu'une obligation d'augmenter uniquement la défense semble préférable, mais n'est pas définitivement tranchée.
- Toujours afficher sur l'offre le nombre exact d'emplacements gagnés, la capacité avant/après, le prix et les restrictions ; ne jamais dépendre uniquement d'une infobulle.

## Banque et fabrication

La banque sert de stockage durable ; l'inventaire sert au transport. L'utilisation directe de ressources stockées en banque dans les recettes est une **proposition**, pas une règle définitivement validée.

## Boîte de butin de combat

Piste de conception : l'accès à une boîte de butin temporaire serait une amélioration achetée. Sans amélioration, les gains vont directement à l'inventaire. Des extensions augmenteraient le nombre de **types distincts** conservables dans cette boîte.

À définir : transfert vers l'inventaire ou la banque, règles d'empilement, comportement en cas de saturation et protection des objets rares pendant les activités hors ligne.

## Principes de sécurité économique

Enregistrer chaque changement de propriétaire et ne jamais déclencher une transmission supplémentaire pour un simple dépôt sans changement de propriétaire. Les confirmations doivent expliciter les conséquences irréversibles.

## Modèle commercial — orientation validée le 10 octobre 2026

- **Aucun achat d'or du jeu** contre de l'argent réel ; l'or reste gagné par les activités et les combats.
- **Crédits premium** achetables en euros, réservés à une boutique d'équipements spéciaux et de services à définir. Les crédits ne sont pas une monnaie du marché entre joueurs ; les articles premium ne doivent pas permettre de contourner les règles de transferts et de bénédiction.
- **Mode rapide (Fast Mode)** proposé **uniquement par abonnement mensuel Stripe**, sans abonnement hebdomadaire ou journalier. Prix, multiplicateurs, activités éligibles, cumul avec d'autres bonus et éventuels plafonds sont à définir et tester ; éviter de rendre les combats communautaires injustes.
- Le jeu de base doit permettre de progresser et d'atteindre R20 sans paiement ; payer accélère certaines activités, mais ne valide pas directement les faits d'armes, quêtes ou objectifs de Renaissance.
- **Abonnement** : afficher prix TTC, période, date de reconduction, fonctionnement du renouvellement automatique et moyen simple de résilier. La résiliation empêche les prochains prélèvements ; les droits déjà payés courent selon les conditions applicables.
- **Remboursements et rétractation** : volonté commerciale de ne pas proposer de remboursement de convenance pour des contenus immédiatement délivrés, **dans la limite des lois applicables**. Une clause « aucun remboursement » ne supprime ni les droits légaux ni les recours liés aux défauts, fraudes ou paiements indus. Obtenir les consentements spécifiques et confirmations nécessaires avant la fourniture numérique et vérifier séparément les règles des abonnements.
- Tout paiement et droit premium est attribué et vérifié côté serveur, avec historique, prévention des doublons et correction en cas de rétrofacturation.
- **Distribution sans Steam**, via navigateur et éventuellement application PC indépendante ; hébergement VPS envisagé, à confirmer techniquement.
