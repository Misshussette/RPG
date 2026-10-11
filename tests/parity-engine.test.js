import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITIES, BASE_INVENTORY_CAPACITY, COMBAT_SKILLS, EQUIPMENT_SLOTS, SKILL_IDS, SKILLS } from '../src/parity/catalog.js';
import { XP_THRESHOLDS, levelForXp, totalLevel, combatLevel, availableCombatStyles, inventoryOccupied, createCharacter, assertCharacter, runCharacterAction, viewCharacter } from '../src/parity/engine.js';
const t0 = 1_800_000_000_000;
const fresh = () => createCharacter('Voyageuse',t0);

test('catalogue complet 17 compétences et 13 slots aux identifiants uniques',()=>{
 assert.equal(SKILLS.length,17);assert.equal(new Set(SKILL_IDS).size,17);
 assert.equal(EQUIPMENT_SLOTS.length,13);assert.equal(new Set(EQUIPMENT_SLOTS.map(s=>s.id)).size,13);
 assert.deepEqual(COMBAT_SKILLS,['melee','range','magic','defence','hitpoints']);
});
test('courbe XP observée : 82, 1112, 78144, 7995169',()=>{
 for(const [level,threshold] of [[1,0],[2,82],[10,1112],[50,78144],[100,7995169]]) {
  assert.equal(XP_THRESHOLDS[level-1],threshold);
  assert.equal(levelForXp(threshold),level);
 }
 assert.equal(levelForXp(100_000_000),100);
});
test('17 compétences et niveaux indépendants, sans choix exclusif de classe',()=>{
 const x=fresh(); assert.equal(Object.keys(x.skills).length,17);
 assert.equal(totalLevel(x.skills),17);assert.equal(combatLevel(x.skills),1);
 assert.equal(x.inventoryCapacity,BASE_INVENTORY_CAPACITY);
 assert.equal(inventoryOccupied(x),1);
 assert.deepEqual(availableCombatStyles(null),['melee','defence']);
 for(const skill of COMBAT_SKILLS) x.skills[skill]=XP_THRESHOLDS[99];
 assert.equal(combatLevel(x.skills),100);assert.equal(totalLevel(x.skills),512);
});
test('personnage avec 3 outils équipés sans piles dupliquées',()=>{
 const x=fresh();assertCharacter(x);
 assert.deepEqual(Object.keys(x.equipment).filter(k=>x.equipment[k]),['pickaxe','axe','rod']);
 assert.deepEqual(x.inventory,{});
 assert.equal(viewCharacter(x).totalLevel,17);
 assert.throws(()=>createCharacter('x',t0),/Nom invalide/);
});
test('activité serveur : XP et matériau, règlement partiel sans perdre le reliquat',()=>{
 const start=runCharacterAction(fresh(),{action:'start',activityId:'bosquet_bavard',skills:{woodcutting:999999},gold:1e9},t0);
 assert.equal(start.character.skills.woodcutting,0);
 let x=runCharacterAction(start.character,{action:'settle',milliseconds:999999},t0+3500);
 assert.equal(x.settlement.cycles,0);
 x=runCharacterAction(x.character,{action:'settle'},t0+6000);
 assert.equal(x.settlement.cycles,1);assert.equal(x.character.inventory.bois_bavard,1);
 assert.equal(x.character.skills.woodcutting,ACTIVITIES.bosquet_bavard.xp);
 const repeated=runCharacterAction(x.character,{action:'settle'},t0+6000);
 assert.equal(repeated.settlement.cycles,0);
 const second=runCharacterAction(repeated.character,{action:'stop'},t0+13000);
 assert.equal(second.settlement.cycles,1);assert.equal(second.character.activity,null);
});
test('deux récoltes impossibles en simultané ; arrêt sans duplication',()=>{
 const x=runCharacterAction(fresh(),{action:'start',activityId:'mine_terne'},t0).character;
 assert.match(runCharacterAction(x,{action:'start',activityId:'bosquet_bavard'},t0).error,/Arrêtez/);
 const y=runCharacterAction(x,{action:'stop'},t0+8000).character;
 assert.equal(y.inventory.minerai_terni,1);
 assert.equal(runCharacterAction(y,{action:'stop'},t0+8000).settlement.cycles,0);
});
test('progression absence bornée à deux heures, double règlement sans gain',()=>{
 const x=runCharacterAction(fresh(),{action:'start',activityId:'bassin_douteux'},t0).character;
 const y=runCharacterAction(x,{action:'settle'},t0+10*60*60*1000);
 assert.equal(y.settlement.cycles,720);assert.equal(y.character.inventory.poisson_soupconneux,720);
 assert.equal(runCharacterAction(y.character,{action:'settle'},t0+10*60*60*1000).settlement.cycles,0);
});
test('une pile existante n’ajoute pas de case et sac de départ préservé',()=>{
 const x=fresh();x.inventory={bois_bavard:1,poisson_soupconneux:1,minerai_terni:1};
 assertCharacter(x);assert.equal(inventoryOccupied(x),4);
 const started=runCharacterAction(x,{action:'start',activityId:'mine_terne'},t0).character;
 const gathered=runCharacterAction(started,{action:'settle'},t0+8000).character;
 assert.equal(inventoryOccupied(gathered),4);
 assert.equal(gathered.inventory.minerai_terni,2);
 x.inventoryCapacity=3;assert.throws(()=>assertCharacter(x),/Capacité invalide/);
});
test('commandes étrangères refusées, aucune modification de l’état source',()=>{
 const x=fresh();const copy=structuredClone(x);
 assert.ok(runCharacterAction(x,{action:'grantGold',gold:9999},t0).error);
 assert.ok(runCharacterAction(x,{action:'start',activityId:'missing'},t0).error);
 assert.deepEqual(x,copy);
});