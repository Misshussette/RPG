import React from 'react';
import { FIRST_ENCOUNTER } from './combat.js';
import './combat.css';

export default function CombatPanel({character,busy,onAction}) {
  const battle=character.combat;
  const active=battle?.active;
  const hp=battle?.hp ?? battle?.maxHp ?? 30;
  const maxHp=battle?.maxHp ?? 30;
  const monsterHp=active?.hp ?? FIRST_ENCOUNTER.hp;
  return <section className="eb-fight" aria-label="Combat R0">
    <header className="eb-fight-heading"><div><small>COMBAT & DONJONS · PREMIÈRE RENCONTRE</small><h2>Rat des Ruines</h2><p>Premier combat jouable sur le serveur. Mêlée uniquement ; statistiques provisoires.</p></div><span>R0 · INITIATION</span></header>
    <div className="eb-fight-stage">
      <div className="eb-fight-side player"><strong>{character.name}</strong><small className="eb-fight-player-meta">R{character.rebirth} · Mêlée</small><div className="eb-fight-figure player-figure"><img src="/player/voyageur.svg" alt={`Représentation provisoire de ${character.name}, aventurier encapuchonné`}/></div><div className="eb-fight-health"><div style={{width:`${100*hp/maxHp}%`}}/></div><small>{hp} / {maxHp} PV</small></div>
      <span className="eb-fight-versus">VS</span>
      <div className="eb-fight-side"><strong>{FIRST_ENCOUNTER.name}</strong><div className="eb-fight-figure"><img src={FIRST_ENCOUNTER.portrait} alt={FIRST_ENCOUNTER.name}/></div><div className="eb-fight-health enemy"><div style={{width:`${100*monsterHp/FIRST_ENCOUNTER.hp}%`}}/></div><small>{monsterHp} / {FIRST_ENCOUNTER.hp} PV</small></div>
    </div>
    <div className="eb-fight-status" role="status">{active?`Combat en cours · tour ${active.round} · votre prochain coup doit respecter la cadence serveur.`:battle?.lastResult?.outcome==='win'?`Victoire ! +${battle.lastResult.earnedXp} XP Mêlée et +${battle.lastResult.earnedGold} or.`:battle?.lastResult?.outcome==='defeat'?'Défaite. Reposez-vous pour reprendre.':'Prêt à affronter le Rat des Ruines.'}</div>
    <div className="eb-fight-actions">{active?<button className="eb-button primary" disabled={busy} onClick={()=>onAction('combat_attack')}>Porter un coup</button>:<button className="eb-button primary" disabled={busy||Boolean(character.activity)||hp===0} onClick={()=>onAction('combat_start',FIRST_ENCOUNTER.id)}>Engager le combat</button>}<button className="eb-button" disabled={busy||!!active||hp>=maxHp} onClick={()=>onAction('combat_rest')}>Se reposer (+8 PV)</button></div>
    <p className="eb-note">Butin initial : 3 pièces d’or et 16 XP Mêlée (+4 XP Défense et Santé). Aucun équipement n'est perdu lors de cette première tranche. Distance, magie, vol de sac et autres créatures restent à réaliser.</p>
    <p className="eb-note">Victoires : {battle?.wins ?? 0} · Une commande = un tour : actions et récompenses sont enregistrées dans PostgreSQL.</p>
  </section>;
}
