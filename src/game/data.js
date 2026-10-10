/** Données canoniques du prototype solo. Les identifiants sont stables. */
export const DISCIPLINES = Object.freeze({
  melee: { label: 'Mêlée', icon: '⚔', description: 'Solide au contact. Réduit les coups reçus.', starter: 'charentaise' },
  ranged: { label: 'Distance', icon: '➶', description: 'Précision et coups critiques.', starter: 'fronde' },
  magic: { label: 'Magie', icon: '✧', description: 'Sorts instables. Récupère parfois de la santé.', starter: 'micro' },
});

export const ITEMS = Object.freeze({
  charentaise: { name: 'Vieille charentaise', type: 'weapon', discipline: 'melee', power: 5, rarity: 'common', description: 'Une arme de proximité dont personne ne veut sentir la semelle.' },
  fronde: { name: 'Fronde postale', type: 'weapon', discipline: 'ranged', power: 5, rarity: 'common', description: 'Livre des projectiles à une adresse approximative.' },
  micro: { name: 'Micro de karaoké', type: 'weapon', discipline: 'magic', power: 5, rarity: 'common', description: 'Les fausses notes sont une menace réelle.' },
  nunchaku: { name: 'Nunchaku de saucisses', type: 'weapon', discipline: 'melee', power: 10, rarity: 'rare', description: 'Deux saucisses et un lien mystérieusement robuste.' },
  lance: { name: 'Lance-pantoufles', type: 'weapon', discipline: 'ranged', power: 10, rarity: 'rare', description: 'Un dispositif dont la portée défie la bienséance.' },
  canard: { name: 'Canard Coin-Coin', type: 'weapon', discipline: 'magic', power: 10, rarity: 'rare', description: 'Couine à chaque sort. Les sorciers préfèrent ne pas en parler.' },
  papier: { name: 'Papier de rumeur', type: 'material', rarity: 'common', description: 'Des mots apparaissent puis disparaissent au moindre regard.' },
  encre: { name: 'Encre indocile', type: 'material', rarity: 'uncommon', description: 'Refuse de rester dans le sens où on la lit.' },
  biscuit: { name: 'Biscuit suspect', type: 'consumable', heal: 24, rarity: 'uncommon', description: 'Rend 24 points de santé. Il vaut mieux ne pas lire les ingrédients.' },
});

export const MONSTERS = Object.freeze({
  rat: { name: 'Rat des rumeurs', subtitle: 'Il connaît la vérité. Et trois versions fausses.', hp: 24, attack: 4, xp: 13, gold: 7, unlock: 0, image: 'rat', drop: ['papier'], rareDrop: 'biscuit' },
  pantoufle: { name: 'Charentaise possédée', subtitle: 'Elle cherche un pied à son goût.', hp: 42, attack: 6, xp: 25, gold: 13, unlock: 2, image: 'slipper', drop: ['papier', 'biscuit'], rareDrop: 'nunchaku' },
  affiche: { name: 'Écho de l’affiche', subtitle: 'Son reflet n’obéit à aucune lumière.', hp: 62, attack: 8, xp: 40, gold: 21, unlock: 5, image: 'poster', drop: ['encre', 'papier'], rareDrop: 'lance' },
  boggart: { name: 'Boggart du placard', subtitle: 'Une porte claque. Quelqu’un rit.', hp: 88, attack: 10, xp: 57, gold: 30, unlock: 9, image: 'boggart', drop: ['encre', 'biscuit'], rareDrop: 'canard' },
});

export const QUESTS = Object.freeze([
  { id: 'rumeur', title: 'On raconte que…', description: 'Réduire au silence deux Rats des rumeurs.', stat: 'rat', goal: 2, rewards: { gold: 35, items: { biscuit: 1 } }, line: 'Le pigeon reporter vous félicite. Apparemment, même les rumeurs ont peur du ridicule.' },
  { id: 'pantoufle', title: 'Le pas de trop', description: 'Vaincre deux Charentaises possédées.', stat: 'pantoufle', goal: 2, rewards: { gold: 65, items: { papier: 3 } }, line: 'Une vieille dame applaudit sans les mains. Voilà qui ne rassure personne.' },
  { id: 'affiche', title: 'Deux œuvres, une vérité ?', description: 'Vaincre un Écho de l’affiche.', stat: 'affiche', goal: 1, rewards: { gold: 90, items: { encre: 2 } }, line: 'Les deux tableaux racontent désormais des histoires différentes. Mais lequel ment ?' },
]);

export const MAX_LOG = 25;
export const SAVE_KEY = 'eclipse-blanche-solo-v1';
export const SCHEMA_VERSION = 1;