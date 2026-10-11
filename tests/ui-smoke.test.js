import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createGame, startCombat, combatTurn } from '../src/game/engine.js';

const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('point d’entrée web relié aux styles et à l’interface', () => {
  const html = read('index.html');
  assert.match(html, /id="app"/);
  assert.match(html, /src="\/src\/main\.js"/);
  assert.match(html, /href="\/src\/style\.css"/);
  assert.ok(read('src/style.css').length > 1000);
});

test('interface propose création, combat et les panneaux principaux', () => {
  const main = read('src/main.js');
  assert.match(main, /id="start-form"/);
  assert.match(main, /data-action="fight"/);
  assert.match(main, /\['camp'/);
  assert.match(main, /'combat'/);
  assert.match(main, /'quests'/);
  assert.match(main, /'inventory'/);
  assert.match(main, /'codex'/);
  assert.doesNotMatch(main, /data-action="(?:import|export)"/);
});

test('parcours moteur de la création à une victoire contre le premier monstre', () => {
  let game = createGame('Voyageur', 'melee', 1000);
  const encounter = startCombat(game, 'rat', 2000);
  assert.equal(encounter.error, undefined);
  game = encounter.game;
  let event;
  for (let i = 0; i < 30 && game.combat; i++) {
    const result = combatTurn(game, () => 0.9, 3000 + i * 2000);
    game = result.game;
    event = result.event;
  }
  assert.equal(event, 'victory');
  assert.equal(game.totalWins, 1);
});
