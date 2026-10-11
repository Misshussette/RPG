import test from 'node:test';
import assert from 'node:assert/strict';
import {SKILL_IDS,ACTIVITIES} from '../src/parity/catalog.js';
import {WORKSHOPS,workshopById,skillInWorkshop} from '../src/parity/navigation.js';

test('ateliers : identifiants uniques, compétences canoniques accessibles',()=>{
 const ids=WORKSHOPS.map(w=>w.id);
 assert.equal(new Set(ids).size,ids.length);
 const covered=new Set();
 for(const w of WORKSHOPS){
   for(const skill of w.skills){assert.ok(SKILL_IDS.includes(skill),w.id+': '+skill);covered.add(skill);}
 }
 assert.deepEqual([...covered].sort(),[...SKILL_IDS].sort());
});
test('ressources et armurerie : bûcheronnage, extraction et métallurgie non dupliqués en XP',()=>{
 assert.ok(skillInWorkshop('resources','mining'));
 assert.ok(skillInWorkshop('resources','woodcutting'));
 assert.ok(skillInWorkshop('resources','smithing'));
 assert.ok(skillInWorkshop('armory','smithing'));
 assert.ok(skillInWorkshop('armory','crafting'));
 assert.ok(skillInWorkshop('armory','fletching'));
 assert.ok(!skillInWorkshop('armory','woodcutting'));
 assert.equal(SKILL_IDS.filter(x=>x==='smithing').length,1);
});
test('activités serveur existantes accessibles via ateliers regroupés',()=>{
 for(const activity of Object.values(ACTIVITIES)){
   assert.ok(WORKSHOPS.some(w=>w.id!=='overview'&&skillInWorkshop(w.id,activity.skill)),activity.name);
 }
 assert.ok(skillInWorkshop('resources','woodcutting'));
 assert.ok(skillInWorkshop('kitchen','fishing'));
 assert.equal(workshopById('does-not-exist').id,'overview');
});
