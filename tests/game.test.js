import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, startCombat, combatTurn, questStatus, claimQuest, gatherPreview, collectGather, rest, equip, useItem, upgradeBag, validateSave, availableMonsters } from '../src/game/engine.js';

const NOW = 1_700_000_000_000;
const fresh = (style = 'melee') => createGame('Test', style, NOW);

function defeat(game, monsterId) {
  let r = startCombat(game, monsterId, NOW);
  assert.equal(r.error, undefined);
  for (let i = 0; i < 60 && r.game.combat; i++) r = combatTurn(r.game, () => 0.99, NOW + i * 1000);
  return r;
}

test('crée un personnage et inventaire cohérent dans les 3 disciplines', () => {
  for (const style of ['melee', 'ranged', 'magic']) {
    const game = fresh(style);
    assert.equal(game.hero.discipline, style);
    assert.ok(game.inventory[game.equipment.weapon] > 0);
    assert.equal(validateSave(game).schemaVersion, 1);
  }
});

test('un monstre verrouillé reste inaccessible même avec une demande directe', () => {
  const game = fresh();
  assert.equal(availableMonsters(game).length, 1);
  assert.ok(startCombat(game, 'boggart', NOW).error);
  assert.equal(startCombat(game, 'rat', NOW).game.combat.monsterId, 'rat');
});

test('combat auto : récompenses, découvertes et victoire validée par combat', () => {
  const initial = fresh();
  const result = defeat(initial, 'rat');
  assert.equal(result.event, 'victory');
  assert.equal(result.game.totalWins, 1);
  assert.equal(result.game.victories.rat, 1);
  assert.ok(result.game.hero.gold > initial.hero.gold);
  assert.ok(result.game.codex.monsters.includes('rat'));
  assert.equal(result.game.combat, null);
});

test('les quêtes exigent des victoires et ne peuvent être réclamées deux fois', () => {
  let game = fresh();
  assert.ok(claimQuest(game, 'rumeur').error);
  for (let i = 0; i < 2; i++) {
    game = defeat(game, 'rat').game;
    if (game.hero.hp <= 20) game = rest(game).game;
  }
  const quest = questStatus(game).find(q => q.id === 'rumeur');
  assert.equal(quest.progress, 2);
  const reward = claimQuest(game, 'rumeur');
  assert.equal(reward.game.questsClaimed.length, 1);
  assert.ok(claimQuest(reward.game, 'rumeur').error);
});

test('récolte plafonnée à deux heures et pas de récompense supplémentaire immédiate', () => {
  const game = fresh();
  const preview = gatherPreview(game, NOW + 10 * 3600_000);
  assert.equal(preview.units, 24);
  const claim = collectGather(game, NOW + 10 * 3600_000);
  assert.equal(claim.game.hero.gold, game.hero.gold + 72);
  assert.ok(claim.game.inventory.papier >= 24);
  assert.ok(collectGather(claim.game, NOW + 10 * 3600_000).error);
});

test('refus des armes des autres disciplines et consommation de soin', () => {
  const game = fresh();
  game.inventory.canard = 1;
  assert.ok(equip(game, 'canard').error);
  game.hero.hp = 20;
  const healed = useItem(game, 'biscuit').game;
  assert.equal(healed.hero.hp, 44);
  assert.equal(healed.inventory.biscuit, 1);
});

test('amélioration du sac refuse un solde insuffisant et indique +8', () => {
  const game = fresh();
  assert.ok(upgradeBag(game).error);
  game.hero.gold = 200;
  const upgraded = upgradeBag(game).game;
  assert.equal(upgraded.inventoryCapacity, 24);
  assert.equal(upgraded.hero.gold, 50);
});

test('import : refuse état corrompu, inconnus et équipement non possédé', () => {
  const game = fresh();
  game.hero.gold = -100;
  assert.throws(() => validateSave(game), /Statistiques/);
  game.hero.gold = 25;
  game.inventory.evil = 1;
  assert.throws(() => validateSave(game), /Objet/);
  delete game.inventory.evil;
  game.equipment.weapon = 'canard';
  assert.throws(() => validateSave(game), /Équipement/);
});

test('santé et progression n’écrasent pas les récompenses déjà obtenues', () => {
  let game = fresh();
  game = defeat(game, 'rat').game;
  const old = game.hero.gold;
  game = rest(game).game;
  assert.ok(game.hero.gold >= old - 5);
  assert.ok(validateSave(game).totalWins === 1);
});