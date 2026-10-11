import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ACTIVITIES, EQUIPMENT_SLOTS, ITEMS, SKILLS } from './catalog.js';
import { XP_THRESHOLDS, levelForXp } from './engine.js';
import './parity.css';

const fmt = n => new Intl.NumberFormat('fr-FR').format(n);
const groups = [
  ['combat', 'COMBAT'], ['production', 'MÉTIERS'], ['other', 'AUTRES COMPÉTENCES'],
];
async function api(url, payload) {
  const options = payload === undefined ? { credentials: 'same-origin' } : {
    method: 'POST', credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
  };
  let response;
  try { response=await fetch(url,options); }
  catch { throw new Error('Serveur indisponible. Démarrez PostgreSQL et l’API locale.'); }
  let data;
  try { data=await response.json(); }
  catch { throw new Error('Réponse serveur invalide.'); }
  if (!response.ok) throw new Error(data.error || `Erreur API ${response.status}`);
  return data;
}
function Pane({title,meta,children,className=''}) {
  return <section className={`eb-panel ${className}`}><div className="eb-panel-header"><strong>{title}</strong>{meta && <span>{meta}</span>}</div>{children}</section>;
}
function Progress({level,xp}) {
  const min=XP_THRESHOLDS[level-1];
  const max=level>=100?100_000_000:XP_THRESHOLDS[level];
  const current=Math.max(0,xp-min);
  return <div className="eb-progress" title={`${fmt(xp)} XP · niveau ${level}`}><span style={{width:`${Math.max(0,Math.min(100,current/(max-min)*100))}%`}}/></div>;
}
function Credentials({onLogin,busy}) {
  const [mode,setMode]=useState('login');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  return <div className="eb-auth-frame"><div className="eb-auth-head"><img src="/logo-eclipse.svg" alt="L’Éclipse Blanche"/><h1>L’Éclipse Blanche</h1><p>Un compte. Un personnage. Dix-sept compétences. Une réalité qui ne tient qu’à un fil.</p></div>
    <Pane title="ACCÈS AU MONDE" meta="TEST LOCAL — SERVEUR REQUIS">
      <div className="eb-auth-tabs"><button className={mode==='login'?'selected':''} onClick={()=>setMode('login')}>Connexion</button><button className={mode==='register'?'selected':''} onClick={()=>setMode('register')}>Créer un compte</button></div>
      <form className="eb-form" onSubmit={e=>{e.preventDefault();onLogin(mode,email,password)}}><label>Adresse e-mail<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} maxLength={254}/></label><label>Mot de passe <small>12 caractères minimum</small><input type="password" required minLength={mode==='register'?12:1} autoComplete={mode==='register'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="eb-button primary" disabled={busy}>{busy?'Patientez…':mode==='login'?'Se connecter':'Créer le compte'}</button></form>
      <p className="eb-note">Aucune progression n’est enregistrée dans le navigateur. Les identifiants et sauvegardes sont gérés par l’API locale, à ne pas ouvrir publiquement sans audit de sécurité.</p>
    </Pane>
  </div>;
}
function CharacterCreation({busy,onCreate}) {
  const [name,setName]=useState('Voyageur');
  return <div className="eb-auth-frame"><div className="eb-auth-head"><img src="/logo-eclipse.svg" alt=""/><h1>Qui êtes-vous ?</h1><p>Vous maîtriserez toutes les disciplines. Votre première arme ne définit pas votre destin.</p></div><Pane title="NOUVEAU PERSONNAGE" meta="17 COMPÉTENCES DISPONIBLES"><form className="eb-form" onSubmit={e=>{e.preventDefault();onCreate(name)}}><label>Nom du personnage<input minLength={2} maxLength={24} required value={name} onChange={e=>setName(e.target.value)}/></label><button className="eb-button primary" disabled={busy}>{busy?'Création…':'Commencer l’aventure'}</button></form></Pane></div>;
}
function Skills({character,selected,onSelect}) {
  return <Pane title="COMPÉTENCES" meta={`${character.totalLevel} NIVEAUX · 17 SAVOIRS`} className="eb-skills">
    {groups.map(([group,title])=><div key={group} className="eb-skill-group"><div className="eb-caption">{title}</div><div className="eb-skills-grid">{SKILLS.filter(s=>s.group===group).map(s=>{const xp=character.skills[s.id],level=levelForXp(xp);return <button key={s.id} title={`${s.name} · ${fmt(xp)} XP`} onClick={()=>onSelect(s.id)} className={`eb-skill ${selected===s.id?'selected':''}`}><span className="eb-skill-icon">{s.icon}</span><span className="eb-skill-body"><b>{s.name}</b><Progress level={level} xp={xp}/></span><strong>{level}</strong></button>})}</div></div>)}
  </Pane>;
}
function Activities({character,onAction,busy,selected,onSelect}) {
  const available=Object.entries(ACTIVITIES);
  const current=character.activity && ACTIVITIES[character.activity.id];
  const chosen=available.find(([,v])=>v.skill===selected);
  return <Pane title="ACTIVITÉS" meta="TEMPS CALCULÉ SUR LE SERVEUR" className="eb-activities">
    {current && <div className="eb-current-job"><div><b>EN COURS : {current.name}</b><small>Le travail continue pendant votre absence, jusqu’au plafond initial de deux heures.</small></div><div className="eb-job-buttons"><button className="eb-button" disabled={busy} onClick={()=>onAction('settle')}>Actualiser</button><button className="eb-button warning" disabled={busy} onClick={()=>onAction('stop')}>Arrêter</button></div></div>}
    {available.map(([id,a])=>{const active=character.activity?.id===id;const level=levelForXp(character.skills[a.skill]);const skill=SKILLS.find(s=>s.id===a.skill);return <div key={id} className={`eb-job ${active?'active':''} ${chosen?.[0]===id?'focused':''}`}><span className="eb-job-icon">{skill.icon}</span><div><b>{a.name}</b><small>{skill.name} · niv. {a.level} · {a.durationMs/1000} s/cycle · {a.xp} XP/cycle</small></div><button className="eb-button" disabled={busy||Boolean(character.activity)||level<a.level} onClick={()=>{onSelect(a.skill);onAction('start',id)}}>{active?'Active':'Démarrer'}</button></div>})}
    <p className="eb-note">Trois récoltes réellement fonctionnelles dans ce premier chantier. Les autres métiers sont recensés, mais leurs actions ne sont pas encore implémentées. Les cadences sont provisoires.</p>
  </Pane>;
}
function Inventory({character}) {
  const stacks=Object.entries(character.inventory).filter(([,qty])=>qty>0).map(([id,qty])=>({id,qty}));
  const slotCount=character.inventoryCapacity;
  const items=[{id:'gold',qty:character.gold},...stacks];
  return <Pane title="INVENTAIRE" meta={`${character.inventoryOccupied}/${slotCount}`} className="eb-inventory"><div className="eb-bag" aria-label="Emplacements de l’inventaire">{Array.from({length:slotCount},(_,i)=>{
    const entry=items[i]; const item=entry && ITEMS[entry.id];
    return <div key={i} className={`eb-slot ${entry?'occupied':'empty'}`} title={entry?`${item?.name||'Or'} : ${entry.qty}`:`Case ${i+1} vide`}><span>{entry?(item?.icon||'◉'):''}</span>{entry && <small>{fmt(entry.qty)}</small>}</div>;
  })}</div><div className="eb-note">Une pile occupe une case. L’or occupe sa case dédiée.</div></Pane>;
}
function Equipment({character}) {
  return <Pane title="ÉQUIPEMENT" meta="13 EMPLACEMENTS"><div className="eb-equipment-grid">{EQUIPMENT_SLOTS.map(slot=>{const equipped=character.equipment[slot.id];return <div key={slot.id} className="eb-gear" title={equipped?ITEMS[equipped]?.name:slot.name}><span className={`eb-gear-icon ${equipped?'has-item':''}`}>{equipped?ITEMS[equipped]?.icon:'◇'}</span><small>{slot.name}</small></div>})}</div><div className="eb-note">Les outils de départ sont équipés, pas dupliqués dans le sac.</div></Pane>;
}
function Journal({character}) {
  return <Pane title="JOURNAL" meta="ANCIEN → RÉCENT" className="eb-journal"><div className="eb-journal-scroll" role="log">{character.log.map((entry,index)=><div key={`${entry.at}-${index}`}><span>{new Date(entry.at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span><p>{entry.message}</p></div>)}</div></Pane>;
}
function World({character,revision,onAction,onLogout,busy}) {
  const [selected,setSelected]=useState('mining');
  return <div className="eb-shell"><aside className="eb-left"><div className="eb-brand"><img src="/logo-eclipse.svg" alt="L’Éclipse Blanche"/><div><small>LA RÉALITÉ SE FISSURE</small><b>L’ÉCLIPSE BLANCHE</b></div></div><nav><div className="eb-caption">VOTRE MONDE</div><a href="#competences">Compétences <small>17</small></a><a href="#activites">Activités</a><a href="#equipement">Équipement</a><a href="#inventaire">Inventaire</a><div className="eb-caption more">EN CONSTRUCTION</div><span>Combats et donjons</span><span>Fabrication et forge</span><span>Quêtes et contrats</span><span>Banque et marché</span></nav><div className="eb-left-bottom"><small>RECONSTRUCTION · ALPHA 0.3.0</small><p>Serveur autoritaire · progression en ligne</p><button onClick={onLogout} disabled={busy}>Se déconnecter</button><a href="/">Ancienne alpha locale ↗</a></div></aside>
  <div className="eb-main"><header className="eb-top"><div><small>RECONSTRUCTION / COMPÉTENCES</small><h1>{character.name} <em>R{character.rebirth}</em></h1></div><div className="eb-summary"><span><small>NIVEAU TOTAL</small><b>{character.totalLevel}</b></span><span><small>NIVEAU COMBAT</small><b>{character.combatLevel}</b></span><span><small>RÉVISION SERVEUR</small><b>{revision}</b></span></div></header><div className="eb-center"><div id="competences"><Skills character={character} selected={selected} onSelect={setSelected}/></div><div id="activites"><Activities character={character} selected={selected} onSelect={setSelected} busy={busy} onAction={onAction}/></div></div></div>
  <aside className="eb-right"><div id="inventaire"><Inventory character={character}/></div><div id="equipement"><Equipment character={character}/></div><Journal character={character}/></aside>
 </div>;
}
function App() {
 const [phase,setPhase]=useState('loading'); const [character,setCharacter]=useState(null);
 const [revision,setRevision]=useState(0); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
 const reload=useCallback(async()=>{
   const result=await api('/api/v2/me');
   setCharacter(result.character);setRevision(result.revision);setPhase(result.character?'play':'create');
 },[]);
 useEffect(()=>{reload().catch(e=>{if(e.message==='Authentification nécessaire.')setPhase('login');else{setError(e.message);setPhase('error');}})},[reload]);
 const guarded=async fn=>{setBusy(true);setError('');try {await fn();}catch(e){setError(e.message)}finally{setBusy(false)}};
 const credentials=(mode,email,password)=>guarded(async()=>{await api(`/api/${mode}`,{email,password});await reload()});
 const create=name=>guarded(async()=>{const r=await api('/api/v2/character',{name});setCharacter(r.character);setRevision(r.revision);setPhase('play')});
 const action=(type,activityId)=>guarded(async()=>{const r=await api('/api/v2/action',{action:type,...(activityId?{activityId}:{})});setCharacter(r.character);setRevision(r.revision)});
 const logout=()=>guarded(async()=>{await api('/api/logout',{});setCharacter(null);setPhase('login')});
 useEffect(()=>{if(phase!=='play'||!character?.activity)return;const tick=setInterval(()=>{if(!document.hidden && !busy)action('settle')},8000);return ()=>clearInterval(tick)},[phase,character?.activity?.id,busy]);
 return <>{phase==='loading'?<div className="eb-loading">Connexion au monde…</div>:phase==='login'?<Credentials onLogin={credentials} busy={busy}/>:phase==='create'?<CharacterCreation busy={busy} onCreate={create}/>:phase==='play'?<World character={character} revision={revision} onAction={action} onLogout={logout} busy={busy}/>:<div className="eb-auth-frame"><h2>Serveur indisponible</h2><button className="eb-button" onClick={()=>{setError('');setPhase('loading');reload().catch(e=>{setError(e.message);setPhase('error')})}}>Réessayer</button></div>}{error && <div className="eb-error" role="alert">{error}<button onClick={()=>setError('')} aria-label="Fermer">×</button></div>}</>;
}

createRoot(document.getElementById('root')).render(<App/>);