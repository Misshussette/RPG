/** Première boucle de combat autoritaire — valeurs provisoires, un seul monstre R0.
 * Aucune récompense n'est fournie par le client ; toutes les mutations restent en transaction.
 */
export const FIRST_ENCOUNTER = Object.freeze({
  id:'mob-01', name:'Rat des Ruines', hp:18, attack:3, defence:1,
  xp:16, defenceXp:4, healthXp:4, gold:3,
  portrait:'/bestiary/monsters/mob_01.webp'
});
export const COMBAT_COOLDOWN_MS = 1100;
export const REST_COOLDOWN_MS = 3000;
export const maxCombatHp = skills => 30 + Math.min(70, Math.floor((skills.hitpoints || 0) / 120));
export function combatSnapshot(state) {
  const maxHp=maxCombatHp(state.skills);
  const saved=state.combat || {};
  return {
    hp: Number.isSafeInteger(saved.hp) ? Math.min(maxHp,Math.max(0,saved.hp)) : maxHp,
    maxHp,
    wins: Number.isSafeInteger(saved.wins) && saved.wins>=0 ? saved.wins : 0,
    active: saved.active || null,
    lastActionAt: Number.isSafeInteger(saved.lastActionAt) ? saved.lastActionAt : 0,
    lastRestAt: Number.isSafeInteger(saved.lastRestAt) ? saved.lastRestAt : 0,
    lastResult:saved.lastResult || null
  };
}
export function fightAction(state,intent,now) {
  const character=structuredClone(state);
  character.combat=combatSnapshot(character);
  const c=character.combat;
  const action=intent?.action;
  const journal=message=>{character.log=[...(character.log||[]).slice(-29),{at:now,message}];};
  if (action==='combat_start') {
    if(intent.monsterId!==FIRST_ENCOUNTER.id)return {error:'Cette créature n’est pas encore jouable.'};
    if(character.activity)return {error:'Terminez l’activité en cours avant de combattre.'};
    if(c.active)return {error:'Un combat est déjà engagé.'};
    if(c.hp<=0)return {error:'Vous devez vous reposer avant de reprendre le combat.'};
    c.active={monsterId:FIRST_ENCOUNTER.id,hp:FIRST_ENCOUNTER.hp,round:0};
    c.lastActionAt=now-COMBAT_COOLDOWN_MS;
    c.lastResult=null;
    journal('Vous affrontez le Rat des Ruines.');
    return {character,event:'combat_started',settlement:{monsterId:FIRST_ENCOUNTER.id}};
  }
  if (action==='combat_rest') {
    if(c.active)return {error:'Impossible de vous reposer au milieu du combat.'};
    if(now-c.lastRestAt<REST_COOLDOWN_MS)return {error:'Un instant : vous venez de vous reposer.'};
    if(c.hp===c.maxHp)return {error:'Vous êtes déjà en pleine forme.'};
    const recovered=Math.min(c.maxHp-c.hp,8);
    c.hp+=recovered;c.lastRestAt=now;
    journal(`Repos : +${recovered} PV.`);
    return {character,event:'combat_rested',settlement:{hp:recovered}};
  }
  if(action==='combat_attack') {
    if(!c.active)return {error:'Aucun combat en cours.'};
    if(now-c.lastActionAt<COMBAT_COOLDOWN_MS)return {error:'Attaque trop rapide. Attendez le prochain tour.'};
    if(c.active.monsterId!==FIRST_ENCOUNTER.id)return {error:'Rencontre inconnue.'};
    if(!Number.isSafeInteger(c.active.hp)||c.active.hp<1||c.active.hp>FIRST_ENCOUNTER.hp)return {error:'État du monstre invalide.'};
    // Calcul entier déterministe : aucun dé, coefficient ou dégât envoyé par le client.
    const round=c.active.round+1;
    if(!Number.isSafeInteger(round)||round>100)return {error:'Nombre de tours invalide.'};
    const damage=4+(round%3)+(Math.floor((character.skills.melee||0)/150)%4);
    c.active.hp=Math.max(0,c.active.hp-damage);
    c.active.round=round;c.lastActionAt=now;
    const returned=c.active.hp>0 ? Math.max(1,FIRST_ENCOUNTER.attack - (round%2)) : 0;
    c.hp=Math.max(0,c.hp-returned);
    if(c.active.hp===0){
      c.wins+=1;character.gold+=FIRST_ENCOUNTER.gold;
      character.skills.melee+=FIRST_ENCOUNTER.xp;
      character.skills.defence+=FIRST_ENCOUNTER.defenceXp;
      character.skills.hitpoints+=FIRST_ENCOUNTER.healthXp;
      c.lastResult={outcome:'win',rounds:round,earnedGold:FIRST_ENCOUNTER.gold,earnedXp:FIRST_ENCOUNTER.xp};
      c.active=null;
      journal(`Victoire sur le Rat des Ruines : +${FIRST_ENCOUNTER.xp} XP Mêlée et +${FIRST_ENCOUNTER.gold} or.`);
      return {character,event:'combat_won',settlement:c.lastResult};
    }
    if(c.hp===0){
      c.lastResult={outcome:'defeat',rounds:round,earnedGold:0,earnedXp:0};
      c.active=null;
      journal('Défaite contre le Rat des Ruines. Reposez-vous pour repartir. Les mécaniques de pillage viendront plus tard.');
      return {character,event:'combat_lost',settlement:c.lastResult};
    }
    journal(`Tour ${round} : vous infligez ${damage} dégâts ; le rat vous inflige ${returned} dégâts.`);
    return {character,event:'combat_turn',settlement:{round,damage,returned,enemyHp:c.active.hp}};
  }
  return {error:'Action de combat inconnue.'};
}
