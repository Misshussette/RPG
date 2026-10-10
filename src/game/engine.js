import { DISCIPLINES, ITEMS, MONSTERS, QUESTS, MAX_LOG, SCHEMA_VERSION } from './data.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clone = (game) => structuredClone(game);
const validRoll = (value) => clamp(Number.isFinite(value) ? value : 0.5, 0, 0.999999);
const nextLevelXp = (level) => 30 + Math.floor(12 * level ** 1.35);
const occupied = (game) => Object.keys(game.inventory).filter((id) => game.inventory[id] > 0).length + 1; // or = 1 place

function log(game, message) {
  game.log.unshift({ at: Date.now(), message });
  game.log = game.log.slice(0, MAX_LOG);
}

function discover(game, itemId) {
  if (!game.codex.items.includes(itemId)) game.codex.items.push(itemId);
}

function grantItem(game, itemId, quantity = 1) {
  if (!ITEMS[itemId] || quantity <= 0) return false;
  if (!game.inventory[itemId] && occupied(game) >= game.inventoryCapacity) return false;
  game.inventory[itemId] = (game.inventory[itemId] ?? 0) + quantity;
  discover(game, itemId);
  return true;
}

function awardXp(game, xp) {
  game.hero.xp += xp;
  while (game.hero.xp >= nextLevelXp(game.hero.level)) {
    game.hero.xp -= nextLevelXp(game.hero.level);
    game.hero.level++;
    game.hero.maxHp += 6;
    game.hero.hp = Math.min(game.hero.maxHp, game.hero.hp + 12);
    log(game, `Niveau ${game.hero.level} atteint ! +6 santé maximale.`);
  }
}

export function createGame(name = 'Voyageur', discipline = 'melee', now = Date.now()) {
  const style = DISCIPLINES[discipline] ? discipline : 'melee';
  const safeName = String(name).trim().slice(0, 24) || 'Voyageur';
  const starter = DISCIPLINES[style].starter;
  const game = {
    schemaVersion: SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    hero: { name: safeName, discipline: style, level: 1, xp: 0, hp: 64, maxHp: 64, gold: 25, rebirth: 0 },
    inventoryCapacity: 16,
    inventory: { [starter]: 1, biscuit: 2 },
    equipment: { weapon: starter },
    codex: { items: [starter, 'biscuit'], monsters: [] },
    victories: {},
    questsClaimed: [],
    achievements: [],
    totalWins: 0,
    combat: null,
    activity: { kind: 'gather', since: now, maxSeconds: 2 * 3600 },
    log: [],
  };
  log(game, 'Une affiche ne ressemble plus à votre souvenir. L’aventure commence.');
  return game;
}

export function availableMonsters(game) {
  return Object.entries(MONSTERS).filter(([, monster]) => game.totalWins >= monster.unlock).map(([id, monster]) => ({ id, ...monster }));
}

export function startCombat(game, monsterId, now = Date.now()) {
  if (game.combat) return { game, error: 'Un combat est déjà en cours.' };
  const monster = MONSTERS[monsterId];
  if (!monster || game.totalWins < monster.unlock) return { game, error: 'Cette créature est encore inconnue.' };
  if (game.hero.hp <= 0) return { game, error: 'Vous devez récupérer avant de combattre.' };
  const next = clone(game);
  next.combat = { monsterId, hp: monster.hp, round: 0, startedAt: now };
  if (!next.codex.monsters.includes(monsterId)) next.codex.monsters.push(monsterId);
  log(next, `Vous affrontez : ${monster.name}.`);
  next.updatedAt = now;
  return { game: next };
}

export function combatTurn(game, rng = Math.random, now = Date.now()) {
  if (!game.combat) return { game, event: 'idle' };
  const next = clone(game);
  const encounter = next.combat;
  const monster = MONSTERS[encounter.monsterId];
  if (!monster) return { game, event: 'invalid' };
  const weapon = ITEMS[next.equipment.weapon];
  const style = next.hero.discipline;
  const power = weapon?.discipline === style ? weapon.power : Math.max(2, Math.floor((weapon?.power || 3) / 2));
  const roll = validRoll(rng());
  const critical = style === 'ranged' && roll >= 0.76;
  const attack = Math.max(1, power + next.hero.level * 2 + Math.floor(roll * 6) + (critical ? 5 : 0));
  encounter.hp = Math.max(0, encounter.hp - attack);
  encounter.round++;
  if (encounter.hp === 0) {
    const id = encounter.monsterId;
    const xp = monster.xp;
    next.hero.gold += monster.gold;
    next.victories[id] = (next.victories[id] ?? 0) + 1;
    next.totalWins++;
    awardXp(next, xp);
    const itemId = monster.drop[Math.floor(validRoll(rng()) * monster.drop.length)];
    let loot = '';
    if (grantItem(next, itemId)) loot = ` Butin : ${ITEMS[itemId].name}.`;
    else loot = ' Sac plein : le butin ordinaire reste sur place.';
    if (validRoll(rng()) >= 0.94 && monster.rareDrop) {
      if (grantItem(next, monster.rareDrop)) loot += ` Trouvaille rare : ${ITEMS[monster.rareDrop].name} !`;
      else loot += ' Un objet rare a été perdu faute de place.';
    }
    next.combat = null;
    log(next, `Victoire contre ${monster.name} ! +${xp} XP, +${monster.gold} or.${loot}`);
    next.updatedAt = now;
    return { game: next, event: 'victory', damage: attack, critical };
  }
  let received = Math.max(1, monster.attack + Math.floor(validRoll(rng()) * 4) - (style === 'melee' ? 2 : 0));
  next.hero.hp = Math.max(0, next.hero.hp - received);
  if (style === 'magic' && encounter.round % 2 === 0 && next.hero.hp > 0) {
    next.hero.hp = Math.min(next.hero.maxHp, next.hero.hp + 3);
  }
  if (next.hero.hp === 0) {
    next.combat = null;
    log(next, `Vous tombez face à ${monster.name}. Vous conservez vos objets et votre or.`);
    next.updatedAt = now;
    return { game: next, event: 'defeat', damage: attack, received };
  }
  next.updatedAt = now;
  return { game: next, event: 'hit', damage: attack, received, critical };
}

export function rest(game, now = Date.now()) {
  if (game.combat) return { game, error: 'Impossible de se reposer pendant le combat.' };
  if (game.hero.hp >= game.hero.maxHp) return { game, error: 'Votre santé est déjà au maximum.' };
  const next = clone(game);
  const price = 5;
  if (next.hero.gold < price) {
    next.hero.hp = Math.min(next.hero.maxHp, next.hero.hp + 15);
    log(next, 'Repos de fortune : +15 santé (gratuit).');
  } else {
    next.hero.gold -= price;
    next.hero.hp = next.hero.maxHp;
    log(next, `Repos complet à l’auberge : ${price} or.`);
  }
  next.updatedAt = now;
  return { game: next };
}

export function useItem(game, itemId, now = Date.now()) {
  const item = ITEMS[itemId];
  if (!item || item.type !== 'consumable' || !game.inventory[itemId]) return { game, error: 'Objet indisponible.' };
  if (game.hero.hp === game.hero.maxHp) return { game, error: 'Votre santé est déjà au maximum.' };
  const next = clone(game);
  next.inventory[itemId]--;
  if (next.inventory[itemId] <= 0) delete next.inventory[itemId];
  next.hero.hp = clamp(next.hero.hp + item.heal, 0, next.hero.maxHp);
  log(next, `${item.name} utilisé : +${item.heal} santé (sans dépasser le maximum).`);
  next.updatedAt = now;
  return { game: next };
}

export function equip(game, itemId, now = Date.now()) {
  const item = ITEMS[itemId];
  if (game.combat) return { game, error: 'Impossible de changer d’arme pendant un combat.' };
  if (!item || item.type !== 'weapon' || !game.inventory[itemId]) return { game, error: 'Arme indisponible.' };
  if (item.discipline !== game.hero.discipline) return { game, error: 'Cette arme appartient à une autre discipline.' };
  const next = clone(game);
  next.equipment.weapon = itemId;
  log(next, `${item.name} équipée.`);
  next.updatedAt = now;
  return { game: next };
}

export function questStatus(game) {
  return QUESTS.map((quest) => ({ ...quest, progress: Math.min(quest.goal, game.victories[quest.stat] ?? 0), claimed: game.questsClaimed.includes(quest.id) }));
}

export function claimQuest(game, questId, now = Date.now()) {
  const quest = QUESTS.find((item) => item.id === questId);
  if (!quest || game.questsClaimed.includes(questId) || (game.victories[quest.stat] ?? 0) < quest.goal) return { game, error: 'Quête non terminée.' };
  const next = clone(game);
  next.questsClaimed.push(questId);
  next.hero.gold += quest.rewards.gold;
  const missing = [];
  for (const [id, amount] of Object.entries(quest.rewards.items ?? {})) {
    if (!grantItem(next, id, amount)) missing.push(ITEMS[id].name);
  }
  log(next, `Quête « ${quest.title} » accomplie. +${quest.rewards.gold} or. ${quest.line}${missing.length ? ' Sac plein : ' + missing.join(', ') + ' non reçu.' : ''}`);
  next.updatedAt = now;
  return { game: next };
}

/** Activité volontaire : récupère 1 matériau et 3 or toutes les 5 minutes, jusqu'au plafond. */
export function gatherPreview(game, now = Date.now()) {
  const elapsed = Math.max(0, Math.min(game.activity.maxSeconds, Math.floor((now - game.activity.since) / 1000)));
  const units = Math.floor(elapsed / 300);
  return { elapsed, units, gold: units * 3, items: units, maxSeconds: game.activity.maxSeconds };
}

export function collectGather(game, now = Date.now()) {
  if (game.combat) return { game, error: 'Terminez votre combat avant de récolter.' };
  const preview = gatherPreview(game, now);
  if (!preview.units) return { game, error: 'Aucune récolte disponible pour le moment.' };
  const next = clone(game);
  next.hero.gold += preview.gold;
  const stored = grantItem(next, 'papier', preview.items);
  next.activity.since = now;
  log(next, `Récolte : +${preview.gold} or${stored ? ` et ${preview.items} papiers de rumeur` : ' (sac plein, papiers non récupérés)'}.`);
  next.updatedAt = now;
  return { game: next, collected: preview };
}

export function upgradeBag(game, now = Date.now()) {
  if (game.combat) return { game, error: 'Terminez votre combat avant cette amélioration.' };
  const price = 150;
  if (game.hero.gold < price) return { game, error: `Il manque ${price - game.hero.gold} pièces d’or.` };
  if (game.inventoryCapacity >= 40) return { game, error: 'Capacité maximale du prototype atteinte.' };
  const next = clone(game);
  next.hero.gold -= price;
  next.inventoryCapacity += 8;
  log(next, `Sac amélioré : ${next.inventoryCapacity - 8} → ${next.inventoryCapacity} emplacements.`);
  next.updatedAt = now;
  return { game: next };
}

export function gameSummary(game, now = Date.now()) {
  return {
    nextLevelXp: nextLevelXp(game.hero.level),
    occupied: occupied(game),
    gathering: gatherPreview(game, now),
    questCount: game.questsClaimed.length,
    discovered: game.codex.items.length + game.codex.monsters.length,
  };
}

/** Vérification à l'import ; ne jamais traiter une sauvegarde solo comme une preuve économique. */
export function validateSave(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Sauvegarde incorrecte.');
  if (input.schemaVersion !== SCHEMA_VERSION) throw new Error('Version de sauvegarde non compatible.');
  const h = input.hero;
  if (!h || typeof h.name !== 'string' || h.name.length > 24 || !DISCIPLINES[h.discipline]) throw new Error('Personnage invalide.');
  for (const key of ['level', 'xp', 'hp', 'maxHp', 'gold', 'rebirth']) {
    if (!Number.isSafeInteger(h[key]) || h[key] < 0 || h[key] > 1_000_000_000) throw new Error('Statistiques invalides.');
  }
  if (!h.level || !h.maxHp || h.hp > h.maxHp) throw new Error('Santé ou niveau incorrect.');
  if (!input.inventory || typeof input.inventory !== 'object' || Array.isArray(input.inventory)) throw new Error('Inventaire invalide.');
  for (const [id, qty] of Object.entries(input.inventory)) {
    if (!ITEMS[id] || !Number.isSafeInteger(qty) || qty <= 0 || qty > 1_000_000) throw new Error('Objet ou quantité invalide.');
  }
  if (!input.equipment || !ITEMS[input.equipment.weapon] || !input.inventory[input.equipment.weapon]) throw new Error('Équipement invalide.');
  if (!Array.isArray(input.codex?.items) || !Array.isArray(input.codex?.monsters) || !Array.isArray(input.questsClaimed) || !Array.isArray(input.log)) throw new Error('Progression invalide.');
  if (!Number.isSafeInteger(input.inventoryCapacity) || input.inventoryCapacity < 16 || input.inventoryCapacity > 40 || occupied(input) > input.inventoryCapacity) throw new Error('Capacité du sac invalide.');
  if (!input.activity || !Number.isFinite(input.activity.since) || input.activity.since < 0 || input.activity.maxSeconds !== 7200) throw new Error('Activité invalide.');
  if (!input.victories || typeof input.victories !== 'object' || !Number.isSafeInteger(input.totalWins) || input.totalWins < 0) throw new Error('Combats invalides.');
  if (input.combat !== null && (!input.combat || !MONSTERS[input.combat.monsterId] || !Number.isInteger(input.combat.hp) || input.combat.hp < 1 || input.combat.hp > MONSTERS[input.combat.monsterId].hp)) throw new Error('Combat invalide.');
  return clone(input);
}