import React, { useMemo, useState } from 'react';
import { BESTIARY, BESTIARY_TIERS } from './bestiary.js';
import './codex.css';

function Portrait({ mob, large = false }) {
  const [failed, setFailed] = useState(false);
  return <div className={`eb-codex-portrait ${large ? 'large' : ''}`}>
    {!failed ? <img src={mob.portrait} alt={mob.name} loading="lazy" onError={() => setFailed(true)}/> : <div className="eb-codex-missing" role="status">Portrait à installer depuis le pack Bestiaire V7</div>}
  </div>;
}
export default function Codex() {
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState(0);
  const [selectedId, setSelectedId] = useState('mob-01');
  const matches = useMemo(() => BESTIARY.filter(m => (!tier || m.tier === tier) && (m.name.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')) || m.trait.toLocaleLowerCase('fr').includes(search.toLocaleLowerCase('fr')))), [search, tier]);
  const selected = BESTIARY.find(m => m.id === selectedId) || BESTIARY[0];
  return <section className="eb-codex" aria-label="Codex du bestiaire">
    <header className="eb-codex-head"><div><small>ARCHIVES DE L'ÉCLIPSE</small><h2>Le Bestiaire</h2><p>36 créatures · 6 paliers · Portraits destinés au Codex et aux combats.</p></div><span>36 / 36 fiches</span></header>
    <div className="eb-codex-controls"><label>Rechercher une créature<input type="search" placeholder="Nom ou particularité…" value={search} onChange={e => setSearch(e.target.value)}/></label><label>Palier<select value={tier} onChange={e => setTier(Number(e.target.value))}><option value={0}>Tous les paliers</option>{BESTIARY_TIERS.map((name,i) => <option key={name} value={i+1}>{i+1} · {name}</option>)}</select></label></div>
    <div className="eb-codex-layout"><div className="eb-codex-grid" aria-label="Créatures">{matches.map(m => <button key={m.id} type="button" className={`eb-codex-card ${selected.id === m.id ? 'selected' : ''}`} onClick={() => setSelectedId(m.id)} aria-pressed={selected.id === m.id}><span className="eb-codex-num">{String(m.number).padStart(2,'0')}</span><Portrait mob={m}/><strong>{m.name}</strong><small>{m.tierName}</small></button>)}{!matches.length && <p className="eb-codex-empty">Aucune créature correspondant à votre recherche.</p>}</div><aside className="eb-codex-detail" aria-label="Fiche de créature"><small>PALIER {selected.tier} · {selected.tierName}</small><h3>{selected.name}</h3><Portrait key={selected.id} mob={selected} large/><p>{selected.trait}</p><dl><div><dt>Niveau, PV, attaque</dt><dd>À équilibrer</dd></div><div><dt>Résistances et vulnérabilités</dt><dd>À équilibrer</dd></div><div><dt>Butin, zones et fréquence</dt><dd>À définir</dd></div></dl><p className="eb-codex-notice">Fiche de conception : cette créature n'est pas encore reliée au moteur de combat. Le serveur restera seul responsable des rencontres, récompenses et dégâts.</p></aside></div>
  </section>;
}
