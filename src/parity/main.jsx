import React, { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ACTIVITIES, EQUIPMENT_SLOTS, ITEMS, SKILLS } from './catalog.js';
import { XP_THRESHOLDS, levelForXp } from './engine.js';
import { WORKSHOPS, workshopById, skillInWorkshop } from './navigation.js';
import './parity.css';
import Codex from './Codex.jsx';

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
function Skills({character,selected,onSelect,workshopId='overview'}) {
  const visible = SKILLS.filter(s=>skillInWorkshop(workshopId,s.id));
  return <Pane title={workshopId==='overview'?'COMPÉTENCES':'COMPÉTENCES DE CET ATELIER'} meta={`${fmt(character.totalLevel)} NIVEAUX CUMULÉS · ${SKILLS.length} COMPÉTENCES AU TOTAL`} className="eb-skills">
    {groups.map(([group,title])=>{const entries=visible.filter(s=>s.group===group);return entries.length>0 && <div key={group} className="eb-skill-group"><div className="eb-caption">{title}</div><div className="eb-skills-grid">{entries.map(s=>{const xp=character.skills[s.id],level=levelForXp(xp);return <button key={s.id} title={`${s.name} · ${fmt(xp)} XP`} onClick={()=>onSelect(s.id)} className={`eb-skill ${selected===s.id?'selected':''}`}><span className="eb-skill-icon">{s.icon}</span><span className="eb-skill-body"><b>{s.name}</b><Progress level={level} xp={xp}/></span><strong>{level}</strong></button>})}</div></div>})}
  </Pane>;
}
function Activities({character,onAction,busy,selected,onSelect,workshopId='overview'}) {
  const available=Object.entries(ACTIVITIES).filter(([,activity])=>skillInWorkshop(workshopId,activity.skill));
  const current=character.activity && ACTIVITIES[character.activity.id];
  const chosen=available.find(([,v])=>v.skill===selected);
  return <Pane title="ACTIVITÉS" meta="TEMPS CALCULÉ SUR LE SERVEUR" className="eb-activities">
    {current && <div className="eb-current-job"><div><b>EN COURS : {current.name}</b><small>Le travail continue pendant votre absence, jusqu’au plafond initial de deux heures.</small></div><div className="eb-job-buttons"><button className="eb-button" disabled={busy} onClick={()=>onAction('settle')}>Actualiser</button><button className="eb-button warning" disabled={busy} onClick={()=>onAction('stop')}>Arrêter</button></div></div>}
    {available.map(([id,a])=>{const active=character.activity?.id===id;const level=levelForXp(character.skills[a.skill]);const skill=SKILLS.find(s=>s.id===a.skill);return <div key={id} className={`eb-job ${active?'active':''} ${chosen?.[0]===id?'focused':''}`}><span className="eb-job-icon">{skill.icon}</span><div><b>{a.name}</b><small>{skill.name} · niv. {a.level} · {a.durationMs/1000} s/cycle · {a.xp} XP/cycle</small></div><button className="eb-button" disabled={busy||Boolean(character.activity)||level<a.level} onClick={()=>{onSelect(a.skill);onAction('start',id)}}>{active?'Active':'Démarrer'}</button></div>})}
    {available.length===0 && <p className="eb-note">Aucune action serveur jouable dans cet atelier pour le moment. L’organisation est testable ; les recettes et mécanismes restent à reconstruire.</p>}
    {available.length>0 && <p className="eb-note">Seules les récoltes affichées ci-dessus fonctionnent réellement sur le serveur. Les recettes, achats et autres métiers restent à implémenter. Les cadences sont provisoires.</p>}
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
function WorkshopIntro({workshop}) {
  const [activeRef,setActiveRef]=useState(workshop.features[0]?.reference||'');
  useEffect(()=>{setActiveRef(workshop.features[0]?.reference||'')},[workshop.id]);
  const active=workshop.features.find(f=>f.reference===activeRef)||workshop.features[0];
  return <Pane title={workshop.id==='overview'?'ORGANISATION DES SYSTÈMES':workshop.label.toUpperCase()} meta="ÉCRANS SOURCÉS · MÉCANIQUES À RECONSTRUIRE">
    <p className="eb-workshop-description">{workshop.subtitle}. Les rubriques ci-dessous correspondent aux fonctions relevées dans l'application de référence. Elles ne sont pas encore toutes jouables ici.</p>
    <div className="eb-workshop-capabilities" role="group" aria-label="Fonctions de cet atelier">
      {workshop.features.map(f=><button type="button" key={f.reference} className={`eb-capability ${active?.reference===f.reference?'selected':''}`} onClick={()=>setActiveRef(f.reference)} aria-pressed={active?.reference===f.reference}>
        <span>{f.label}</span><small>{f.reference.startsWith('planned:')?'Conception':'Référence'}</small>
      </button>)}
    </div>
    {active && <div className="eb-workshop-detail" role="status"><strong>{active.label}</strong><p>{active.detail}</p><small>{active.reference.startsWith('planned:')?'Ajout décidé ou envisagé — mécanique pas encore implémentée':'Fonction analysée dans la référence — sa reconstruction React/serveur est encore à vérifier'}</small></div>}
    {workshop.id==='overview'&&<div className="eb-workshop-cards">{WORKSHOPS.filter(w=>w.id!=='overview').map(w=><div key={w.id} className="eb-workshop-card"><strong>{w.icon} {w.label}</strong><small>{w.features.length} rubriques fonctionnelles · {w.skills.length} rattachements de compétences</small></div>)}</div>}
  </Pane>;
}
function World({character,revision,onAction,onLogout,busy}) {
  const [selected,setSelected]=useState('mining');
  const [workshopId,setWorkshopId]=useState('overview');
  const [screen,setScreen]=useState('workshops');
  const workshop=workshopById(workshopId);
  const chooseWorkshop=id=>{setScreen('workshops');setWorkshopId(id);const entry=workshopById(id);if(entry.skills.length && !entry.skills.includes(selected))setSelected(entry.skills[0]);};
  return <div className="eb-shell"><aside className="eb-left">
    <div className="eb-brand"><img src="/logo-eclipse.svg" alt="L’Éclipse Blanche"/><div><small>LA RÉALITÉ SE FISSURE</small><b>L’ÉCLIPSE BLANCHE</b></div></div>
    <nav aria-label="Ateliers et activités"><div className="eb-caption">VOTRE MONDE</div>
      {WORKSHOPS.map(w=><button type="button" key={w.id} className={`eb-nav-item ${workshop.id===w.id?'selected':''}`} onClick={()=>chooseWorkshop(w.id)} aria-current={workshop.id===w.id?'page':undefined}><span className="eb-nav-icon">{w.icon}</span>{w.label}</button>)}
      <div className="eb-caption more">ARCHIVES DU MONDE</div>
      <button type="button" className={`eb-codex-nav ${screen==='codex'?'selected':''}`} onClick={()=>setScreen('codex')} aria-current={screen==='codex'?'page':undefined}>✦ Codex du bestiaire <small>36</small></button>
      <div className="eb-caption more">PERSONNAGE</div>
      <a href="#competences">Compétences <small>{SKILLS.length}</small></a>
      <a href="#inventaire">Inventaire</a><a href="#equipement">Équipement</a>
      <div className="eb-caption more">À RECONSTRUIRE</div>
      <span>Banque, marché et enchères</span><span>Quêtes et succès</span><span>Renaissances et guildes</span>
    </nav>
    <div className="eb-left-bottom"><small>RECONSTRUCTION · ALPHA 0.3.4</small><p>Ateliers réorganisés · règles serveur inchangées</p><button onClick={onLogout} disabled={busy}>Se déconnecter</button></div>
  </aside>
  <div className="eb-main"><header className="eb-top"><div><small>{screen==='codex'?'ARCHIVES / CODEX DES CRÉATURES':`ATELIERS / ${workshop.label.toUpperCase()}`}</small><h1>{character.name} <em>R{character.rebirth}</em></h1></div>
    <div className="eb-summary"><span title="Niveaux gagnés au-dessus des 17 niveaux de départ."><small>NIVEAUX GAGNÉS</small><b>+{character.levelsGained ?? character.totalLevel - SKILLS.length}</b></span><span title="Moyenne des cinq compétences de combat, arrondie à l’entier inférieur."><small>NIVEAU COMBAT</small><b>{character.combatLevel}</b></span><span title="Nombre de compétences ayant dépassé le niveau 1."><small>COMPÉTENCES PROGRESSÉES</small><b>{character.skillsAdvanced ?? SKILLS.filter(s=>levelForXp(character.skills[s.id])>1).length}<em>/{SKILLS.length}</em></b></span></div>
  </header>
  <div className="eb-center">
    {screen==='codex' ? <Codex/> : <>
    <WorkshopIntro workshop={workshop}/>
    {(workshop.id==='overview' || workshop.skills.length>0) && <div id="competences"><Skills character={character} selected={selected} onSelect={setSelected} workshopId={workshop.id}/></div>}
    {(workshop.id==='overview' || workshop.skills.length>0) && <div id="activites"><Activities character={character} selected={selected} onSelect={setSelected} workshopId={workshop.id} busy={busy} onAction={onAction}/></div>}
    </>}
  </div></div>
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