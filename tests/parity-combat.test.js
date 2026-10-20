import test from 'node:test';
import assert from 'node:assert/strict';
import { createCharacter, runCharacterAction, viewCharacter } from '../src/parity/engine.js';
import { COMBAT_COOLDOWN_MS } from '../src/parity/combat.js';

const NOW=1_900_000_000_000;
const command=(state,action,time,extra={})=>runCharacterAction(state,{action,...extra},time);

test('combat Rat des Ruines : victoire, XP et or, attribués une seule fois',()=>{
  let state=createCharacter('Voyageur',NOW);
  let r=command(state,'combat_start',NOW,{monsterId:'mob-01'});
  assert.equal(r.event,'combat_started');state=r.character;
  let turns=0;
  while(state.combat.active && turns<10) {
    r=command(state,'combat_attack',NOW+(turns+1)*COMBAT_COOLDOWN_MS);
    assert.ok(!r.error,r.error);
    state=r.character;turns++;
  }
  assert.equal(state.combat.active,null);
  assert.equal(state.combat.wins,1);
  assert.equal(state.gold,3);
  assert.equal(state.skills.melee,16);
  assert.equal(state.skills.defence,4);
  assert.equal(state.skills.hitpoints,4);
  assert.equal(command(state,'combat_attack',NOW+20_000).error,'Aucun combat en cours.');
  assert.equal(state.gold,3);
  assert.equal(viewCharacter(state).combat.wins,1);
});
test('interdit le spam des tours et les rencontres inventées',()=>{
  const base=createCharacter('Voyageur',NOW);
  assert.equal(command(base,'combat_start',NOW,{monsterId:'mob-36'}).error,'Cette créature n’est pas encore jouable.');
  const started=command(base,'combat_start',NOW,{monsterId:'mob-01'}).character;
  const one=command(started,'combat_attack',NOW);
  assert.equal(one.event,'combat_turn');
  assert.match(command(one.character,'combat_attack',NOW+1).error,/trop rapide/);
  assert.equal(command(one.character,'combat_start',NOW+1,{monsterId:'mob-01'}).error,'Un combat est déjà engagé.');
});
test('anciens personnages : état de combat par défaut sans migration',()=>{
  const base=createCharacter('Voyageur',NOW);
  delete base.combat;
  const view=viewCharacter(base);
  assert.equal(view.combat.hp,30);
  assert.equal(view.combat.wins,0);
  assert.equal(view.combat.active,null);
});
test('pas de combat pendant une récolte, repos impossible en plein combat',()=>{
  const base=createCharacter('Voyageur',NOW);
  const gathering=command(base,'start',NOW,{activityId:'mine_terne'}).character;
  assert.match(command(gathering,'combat_start',NOW,{monsterId:'mob-01'}).error,/activité/);
  const fighting=command(base,'combat_start',NOW,{monsterId:'mob-01'}).character;
  assert.match(command(fighting,'combat_rest',NOW).error,/milieu du combat/);
});
