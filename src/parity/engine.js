import { combatSnapshot, fightAction } from './combat.js';
import { ACTIVITIES, BASE_INVENTORY_CAPACITY, COMBAT_SKILLS, EQUIPMENT_SLOTS, INITIAL_OFFLINE_CAP_MS, ITEMS, RULESET_VERSION, SKILL_IDS } from './catalog.js';

// Courbe de référence auditée ; implémentation indépendante sans reprise du code tiers.
export const XP_THRESHOLDS = Object.freeze((() => {
  const result = [0];
  let points = 0;
  for (let level = 1; level < 100; level++) {
    points += Math.floor(level + 300 * (2 ** (level / 7.5)));
    result.push(Math.floor(points / 4));
  }
  return result;
})());
export function levelForXp(xp) {
  if (!Number.isSafeInteger(xp) || xp < 0) throw new Error('XP invalide');
  let low = 0, high = XP_THRESHOLDS.length;
  while (low + 1 < high) {
    const mid = (low + high) >>> 1;
    if (XP_THRESHOLDS[mid] <= xp) low = mid;
    else high = mid;
  }
  return low + 1;
}
export function totalLevel(skills) { return SKILL_IDS.reduce((sum, id) => sum + levelForXp(skills[id]), 0); }
export function combatLevel(skills) { return Math.floor(COMBAT_SKILLS.reduce((sum, id) => sum + levelForXp(skills[id]), 0) / COMBAT_SKILLS.length); }
export function availableCombatStyles(weaponId) {
  if (!weaponId || ITEMS[weaponId]?.slot === 'weapon' && ITEMS[weaponId]?.style === 'melee') return ['melee', 'defence'];
  if (ITEMS[weaponId]?.style === 'range') return ['range'];
  if (ITEMS[weaponId]?.style === 'magic') return ['magic'];
  return ['melee', 'defence'];
}
export function inventoryOccupied(character) {
  // Or = un emplacement réservé ; une pile d'objets = un emplacement, quelle que soit sa quantité.
  return 1 + Object.values(character.inventory).filter(quantity => quantity > 0).length;
}
export function createCharacter(name, now) {
  const clean = typeof name === 'string' ? name.trim() : '';
  if (clean.length < 2 || clean.length > 24 || /[<>\u0000-\u001f]/u.test(clean)) throw new Error('Nom invalide (2 à 24 caractères).');
  if (!Number.isSafeInteger(now) || now < 0) throw new Error('Horloge serveur invalide.');
  return {
    rulesetVersion: RULESET_VERSION, name: clean, createdAt: now, rebirth: 0,
    skills: Object.fromEntries(SKILL_IDS.map(id => [id, 0])),
    inventoryCapacity: BASE_INVENTORY_CAPACITY, inventory: {}, bank: {}, gold: 0,
    equipment: Object.fromEntries(EQUIPMENT_SLOTS.map(slot => [slot.id, ({ pickaxe: 'pickaxe_rudimentaire', axe: 'axe_rudimentaire', rod: 'rod_rudimentaire' })[slot.id] || null])),
    combatStyle: 'melee', activity: null, log: [{ at: now, message: 'Votre histoire commence. Les apparences sont trompeuses.' }],
  };
}
export function assertCharacter(character) {
  if (!character || character.rulesetVersion !== RULESET_VERSION || typeof character.name !== 'string') throw new Error('État de personnage incompatible.');
  if (!Number.isSafeInteger(character.gold) || character.gold < 0) throw new Error('Solde invalide.');
  if (!Number.isSafeInteger(character.inventoryCapacity) || character.inventoryCapacity < BASE_INVENTORY_CAPACITY) throw new Error('Capacité invalide.');
  if (!character.skills || Object.keys(character.skills).length !== SKILL_IDS.length) throw new Error('Compétences incomplètes.');
  for (const key of SKILL_IDS) if (!Number.isSafeInteger(character.skills[key]) || character.skills[key] < 0) throw new Error('XP invalide.');
  if (!character.inventory || Object.keys(character.inventory).some(id => !ITEMS[id] || ITEMS[id].category !== 'material' || !Number.isSafeInteger(character.inventory[id]) || character.inventory[id] <= 0)) throw new Error('Inventaire invalide.');
  if (inventoryOccupied(character) > character.inventoryCapacity) throw new Error('Sac surchargé.');
  if (!character.equipment || EQUIPMENT_SLOTS.some(slot => !Object.hasOwn(character.equipment, slot.id) || (character.equipment[slot.id] !== null && ITEMS[character.equipment[slot.id]]?.slot !== slot.id))) throw new Error('Équipement invalide.');
  return true;
}
function appendLog(character, at, message) {
  character.log = [...(character.log || []).slice(-29), { at, message }];
}
const copy = state => structuredClone(state);
/** Le serveur est l'unique appelant autorisé à fournir now ; le client n'envoie que l'intention. */
export function runCharacterAction(state, intent, now) {
  if (!Number.isSafeInteger(now) || now < 0) return { error: 'Horloge invalide.' };
  try { assertCharacter(state); } catch { return { error: 'Personnage incompatible avec ce moteur.' }; }
  const character = copy(state);
  const action = intent?.action;
  if (['combat_start','combat_attack','combat_rest'].includes(action)) {
    const result=fightAction(character,intent,now);
    if (!result.error) assertCharacter(result.character);
    return result;
  }
  if (action === 'start') {
    const selected = ACTIVITIES[intent.activityId];
    if (!selected) return { error: 'Activité inconnue.' };
    if (character.activity) return { error: 'Arrêtez ou soldez l’activité en cours avant d’en lancer une autre.' };
    if (levelForXp(character.skills[selected.skill]) < selected.level) return { error: 'Niveau insuffisant.' };
    if (!character.equipment[selected.tool]) return { error: 'Outil requis non équipé.' };
    if (!Object.hasOwn(character.inventory, selected.item) && inventoryOccupied(character) >= character.inventoryCapacity) return { error: 'Sac plein.' };
    character.activity = { id: intent.activityId, settledAt: now, startedAt: now };
    appendLog(character, now, `Activité commencée : ${selected.name}.`);
    return { character, event: 'activity_started' };
  }
  if (action === 'settle' || action === 'stop') {
    if (!character.activity) return { character, event: 'activity_idle', settlement: { cycles: 0, xp: 0 } };
    const selected = ACTIVITIES[character.activity.id];
    if (!selected) return { error: 'Activité en cours inconnue.' };
    const since = character.activity.settledAt;
    if (!Number.isSafeInteger(since) || since > now) return { error: 'Horodatage serveur incohérent.' };
    // Le reliquat d'une période doit persister : les règlements partiels ne la font pas perdre.
    const elapsed = Math.min(now - since, INITIAL_OFFLINE_CAP_MS);
    const possibleCycles = Math.floor(elapsed / selected.durationMs);
    const canHold = Object.hasOwn(character.inventory, selected.item) || inventoryOccupied(character) < character.inventoryCapacity;
    const cycles = canHold ? possibleCycles : 0;
    if (cycles) {
      character.inventory[selected.item] = (character.inventory[selected.item] || 0) + cycles;
      const gainedXp = cycles * selected.xp;
      character.skills[selected.skill] += gainedXp;
      character.activity.settledAt = since + cycles * selected.durationMs;
      appendLog(character, now, `+${cycles} ${ITEMS[selected.item].name} · +${gainedXp} XP ${selected.skill}.`);
    }
    // Après atteinte du cap, le compteur de temps doit rester borné et ne pas se récompenser au prochain appel.
    if (now - character.activity.settledAt > INITIAL_OFFLINE_CAP_MS) {
      character.activity.settledAt = now - (now - character.activity.settledAt) % selected.durationMs;
    }
    if (action === 'stop') { character.activity = null; appendLog(character, now, 'Activité arrêtée.'); }
    assertCharacter(character);
    return { character, event: action === 'stop' ? 'activity_stopped' : 'activity_settled', settlement: { cycles, xp: cycles * selected.xp, item: selected.item } };
  }
  return { error: 'Commande inconnue.' };
}
export function viewCharacter(state) {
  assertCharacter(state);
  const total = totalLevel(state.skills);
  return {
    ...state,
    totalLevel: total,
    levelsGained: total - SKILL_IDS.length,
    skillsAdvanced: SKILL_IDS.filter(id => levelForXp(state.skills[id]) > 1).length,
    combatLevel: combatLevel(state.skills),
    inventoryOccupied: inventoryOccupied(state),
    combatStyles: availableCombatStyles(state.equipment.weapon),
    combat: combatSnapshot(state),
  };
}