import test from 'node:test';
import assert from 'node:assert/strict';
import { createParityCharacter, getParityCharacter, applyParityAction } from '../server/parity.js';

const t0=1_800_000_000_000;
const account='account-for-tests';
function fakeDatabase(){
 let state=null,revision=0;
 const events=[];
 return {
  events,
  async query(sql,params){
   if(sql.startsWith('SELECT id FROM accounts')) return {rows:[{id:account}]};
   if(sql.startsWith('INSERT INTO parity_characters')){
    if(state)return {rows:[]};
    state=JSON.parse(params[1]);revision=1;return {rows:[{revision}]};
   }
   if(sql.startsWith('SELECT state,revision FROM parity_characters')) return {rows:state?[{state:structuredClone(state),revision}]:[]};
   if(sql.startsWith('UPDATE parity_characters')){
    state=JSON.parse(params[1]);revision++;return {rows:[{revision}]};
   }
   if(sql.startsWith('INSERT INTO parity_events')){events.push([...params]);return {rows:[]};}
   throw new Error('Requête SQL imprévue : '+sql);
  }
 };
}

test('création unique enregistre un état serveur et une révision',async()=>{
 const db=fakeDatabase();
 const created=await createParityCharacter(db,account,{name:'Alice',gold:99999,skills:{magic:1e8}},t0);
 assert.equal(created.status,201);assert.equal(created.body.character.gold,0);
 assert.equal(created.body.character.skills.magic,0);
 assert.equal(created.body.revision,1);
 assert.equal(db.events.length,1);
 const duplicate=await createParityCharacter(db,account,{name:'Bob'},t0+1000);
 assert.equal(duplicate.status,409);
 assert.equal((await getParityCharacter(db,account)).body.character.name,'Alice');
});
test('récolte serveur et requête répétée : révision et crédit une seule fois',async()=>{
 const db=fakeDatabase();
 await createParityCharacter(db,account,{name:'Alice'},t0);
 const started=await applyParityAction(db,account,{action:'start',activityId:'mine_terne',gold:999999},t0);
 assert.equal(started.status,200);assert.equal(started.body.revision,2);
 assert.equal(started.body.character.gold,0);
 const duplicateStart=await applyParityAction(db,account,{action:'start',activityId:'mine_terne'},t0+10);
 assert.equal(duplicateStart.status,409);
 const settled=await applyParityAction(db,account,{action:'settle',elapsed:10000000},t0+16_000);
 assert.equal(settled.body.settlement.cycles,2);
 assert.equal(settled.body.character.inventory.minerai_terni,2);
 assert.equal(settled.body.revision,3);
 const twice=await applyParityAction(db,account,{action:'settle'},t0+16_000);
 assert.equal(twice.body.settlement.cycles,0);
 assert.equal(twice.body.revision,3);
 assert.equal(db.events.length,3);
});
test('actions non autorisées écartées sans écriture',async()=>{
 const db=fakeDatabase();await createParityCharacter(db,account,{name:'Alice'},t0);
 const blocked=await applyParityAction(db,account,{action:'grantXP',xp:100000},t0);
 assert.equal(blocked.status,400);assert.equal(db.events.length,1);
});