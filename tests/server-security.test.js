import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAction,MIN_ATTACK_INTERVAL_MS } from '../server/actions.js';
import { hashToken, newToken, passwordHash, verifyPassword,validIdentity } from '../server/security.js';

test('création depuis une commande sans caractéristiques clients',()=>{
 const result=applyAction(null,{action:'create',name:'Ariane',discipline:'magic',gold:999999,rebirth:20},null,1000);
 assert.equal(result.game.hero.gold,25);
 assert.equal(result.game.hero.rebirth,0);
 assert.equal(result.game.hero.discipline,'magic');
});
test('création multiple refusée',()=>{
 const first=applyAction(null,{action:'create',name:'A',discipline:'melee'},null,1000);
 assert.ok(first.game);
 assert.match(applyAction(first.game,{action:'create',name:'B',discipline:'melee'},null,2000).error,/déjà créé/);
});
test('combat impossible sur créature verrouillée',()=>{
 const game=applyAction(null,{action:'create',name:'B',discipline:'ranged'},null,1000).game;
 assert.ok(applyAction(game,{action:'fight',monsterId:'boggart'},null,2000).error);
});
test('fréquence de tour contrôlée par l’horloge serveur',()=>{
 const game=applyAction(null,{action:'create',name:'B',discipline:'ranged'},null,1000).game;
 const fight=applyAction(game,{action:'fight',monsterId:'rat'},null,2000).game;
 const turn=applyAction(fight,{action:'turn',damage:999999},null,3000);
 assert.ok(turn.game);
 assert.equal(turn.lastAttackAt.getTime(),3000);
 const blocked=applyAction(turn.game,{action:'turn'},turn.lastAttackAt,3000+MIN_ATTACK_INTERVAL_MS-1);
 assert.equal(blocked.suspicion,'attack_rate');
});
test('actions inconnues refusées',()=>{
 const game=applyAction(null,{action:'create',name:'B',discipline:'melee'},null,1000).game;
 assert.ok(applyAction(game,{action:'setGold',value:200000},null,2000).error);
});
test('jeton de session aléatoire et empreinte déterministe',()=>{
 const a=newToken(),b=newToken();
 assert.notEqual(a,b);assert.equal(hashToken(a),hashToken(a));assert.notEqual(hashToken(a),hashToken(b));
});
test('mots de passe dérivés avec sel et vérification',async()=>{
 const stored=await passwordHash('Une Phrase Secrète 123');
 assert.equal(await verifyPassword('Une Phrase Secrète 123',stored.salt,stored.hash),true);
 assert.equal(await verifyPassword('Mauvais mot de passe',stored.salt,stored.hash),false);
 assert.equal(validIdentity('client@example.com','Une Phrase Secrète 123'),true);
});
