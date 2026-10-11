import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const script=readFileSync(new URL('../scripts/reference-ateliers.js',import.meta.url),'utf8');
const server=readFileSync(new URL('../scripts/reference-server.mjs',import.meta.url),'utf8');
const groups=[...script.matchAll(/members:\[([^\]]+)\]/g)].map(m=>[...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]));
const ids=groups.flat();

test('menu de référence : toutes les entrées sources préservées exactement une fois',()=>{
  const sourceIds=[
    'nav-home','nav-eternal-forge','nav-shop','nav-upgrades','nav-blacksmith',
    'nav-gear','nav-combat','nav-range','nav-magic','nav-hitpoints','nav-defence',
    'nav-dungeon','nav-worldboss','nav-bank','nav-mining','nav-smithing',
    'nav-woodcutting','nav-fletching','nav-cultivating','nav-firemaking',
    'nav-fishing','nav-cooking','nav-cremation','nav-crafting',
    'nav-thieving','nav-hunting','nav-settings'
  ];
  assert.equal(new Set(ids).size,ids.length,'Un bouton source ne doit pas apparaître deux fois');
  assert.deepEqual([...ids].sort(),sourceIds.sort(),'Aucun écran source ne doit disparaître');
});
test('organisations source et ateliers coexistent à la même origine',()=>{
  assert.match(server,/get\('layout'\)\s*===\s*'ateliers'/);
  assert.match(server,/if \(layout &&/);
  assert.match(server,/createReadStream\(target\)/);
  assert.match(script,/body\.append\(button\)/,'On déplace le bouton original plutôt que le cloner');
});
