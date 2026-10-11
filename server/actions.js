import { createGame, startCombat, combatTurn, rest, collectGather, useItem, equip, claimQuest, upgradeBag } from '../src/game/engine.js';
import { MONSTERS, DISCIPLINES } from '../src/game/data.js';
export const MIN_ATTACK_INTERVAL_MS = 1500;
const tooSoon = (last, now) => last && now - new Date(last).getTime() < MIN_ATTACK_INTERVAL_MS;
export function applyAction(state, input, lastAttackAt, now) {
 const action = input?.action;
 if (!state && action !== 'create') return { error: 'Personnage inexistant.' };
 if (action === 'create') {
   if (state) return { error: 'Personnage déjà créé.' };
   if (!DISCIPLINES[input.discipline] || typeof input.name !== 'string' || !input.name.trim() || input.name.length > 24) return { error: 'Personnage invalide.' };
   return { game: createGame(input.name,input.discipline,now), event:'character_created' };
 }
 let result, attackAt = lastAttackAt;
 switch(action) {
  case 'fight':
   if (typeof input.monsterId !== 'string' || !MONSTERS[input.monsterId]) return { error:'Adversaire inconnu.' };
   result = startCombat(state,input.monsterId,now);break;
  case 'turn':
   if (tooSoon(lastAttackAt,now)) return { error:'Action trop rapide.', suspicion:'attack_rate' };
   if (!state.combat) return { error:'Aucun combat en cours.' };
   result = combatTurn(state,Math.random,now);
   if (!result.error) attackAt = new Date(now);
   break;
  case 'rest': result=rest(state,now);break;
  case 'gather': result=collectGather(state,now);break;
  case 'use': result=useItem(state,input.itemId,now);break;
  case 'equip': result=equip(state,input.itemId,now);break;
  case 'claim': result=claimQuest(state,input.questId,now);break;
  case 'bag': result=upgradeBag(state,now);break;
  default: return { error:'Action inconnue.' };
 }
 return { ...result,lastAttackAt:attackAt,event:action };
}
