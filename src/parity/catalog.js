/** Catalogue original de L’Éclipse Blanche. Identifiants pérennes et règles versionnées. */
export const RULESET_VERSION = 1;
export const SKILLS = Object.freeze([
  { id: 'melee', name: 'Mêlée', group: 'combat', icon: '⚔' },
  { id: 'range', name: 'Distance', group: 'combat', icon: '➶' },
  { id: 'magic', name: 'Magie', group: 'combat', icon: '✧' },
  { id: 'defence', name: 'Défense', group: 'combat', icon: '♜' },
  { id: 'hitpoints', name: 'Santé', group: 'combat', icon: '♥' },
  { id: 'mining', name: 'Extraction', group: 'production', icon: '◆' },
  { id: 'smithing', name: 'Métallurgie', group: 'production', icon: '⚒' },
  { id: 'woodcutting', name: 'Bûcheronnage', group: 'production', icon: '♧' },
  { id: 'firemaking', name: 'Allumage', group: 'production', icon: '♨' },
  { id: 'fishing', name: 'Pêche', group: 'production', icon: '≈' },
  { id: 'cooking', name: 'Cuisine', group: 'production', icon: '◈' },
  { id: 'cremation', name: 'Crémation', group: 'production', icon: '☽' },
  { id: 'crafting', name: 'Artisanat', group: 'production', icon: '✂' },
  { id: 'hunting', name: 'Chasse', group: 'other', icon: '⌖' },
  { id: 'thieving', name: 'Vol', group: 'other', icon: '◉' },
  { id: 'fletching', name: 'Arcs et flèches', group: 'production', icon: '➹' },
  { id: 'cultivating', name: 'Culture', group: 'other', icon: '❀' },
]);
export const SKILL_IDS = Object.freeze(SKILLS.map(skill => skill.id));
export const COMBAT_SKILLS = Object.freeze(['melee', 'range', 'magic', 'defence', 'hitpoints']);
export const EQUIPMENT_SLOTS = Object.freeze([
  { id: 'weapon', name: 'Arme' }, { id: 'armor', name: 'Torse' },
  { id: 'helm', name: 'Tête' }, { id: 'legs', name: 'Jambes' },
  { id: 'boots', name: 'Bottes' }, { id: 'pickaxe', name: 'Pioche' },
  { id: 'axe', name: 'Hache' }, { id: 'rod', name: 'Canne' },
  { id: 'ring', name: 'Anneau' }, { id: 'amulet', name: 'Amulette' },
  { id: 'offhand', name: 'Seconde main' }, { id: 'ammo', name: 'Munitions' },
  { id: 'back', name: 'Dos' },
]);
export const ITEMS = Object.freeze({
  pickaxe_rudimentaire: { name: 'Pioche récalcitrante', slot: 'pickaxe', category: 'equipment', icon: '⚒' },
  axe_rudimentaire: { name: 'Hache de mauvaise humeur', slot: 'axe', category: 'equipment', icon: '♧' },
  rod_rudimentaire: { name: 'Canne à pêche perplexe', slot: 'rod', category: 'equipment', icon: '≈' },
  minerai_terni: { name: 'Minerai terni', category: 'material', icon: '◆' },
  bois_bavard: { name: 'Bois bavard', category: 'material', icon: '♧' },
  poisson_soupconneux: { name: 'Poisson soupçonneux', category: 'material', icon: '◈' },
});
// Cadences / XP temporaires de la première tranche : à équilibrer après parité des 17 moteurs.
export const ACTIVITIES = Object.freeze({
  mine_terne: { name: 'Veine terne', skill: 'mining', item: 'minerai_terni', tool: 'pickaxe', durationMs: 8_000, xp: 12, level: 1 },
  bosquet_bavard: { name: 'Bosquet bavard', skill: 'woodcutting', item: 'bois_bavard', tool: 'axe', durationMs: 6_000, xp: 10, level: 1 },
  bassin_douteux: { name: 'Bassin douteux', skill: 'fishing', item: 'poisson_soupconneux', tool: 'rod', durationMs: 10_000, xp: 14, level: 1 },
});
export const BASE_INVENTORY_CAPACITY = 16;
export const INITIAL_OFFLINE_CAP_MS = 2 * 60 * 60 * 1000;