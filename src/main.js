import { DISCIPLINES, ITEMS, MONSTERS, QUESTS, SAVE_KEY } from './game/data.js';
import { createGame, availableMonsters, startCombat, combatTurn, rest, useItem, equip, questStatus, claimQuest, gatherPreview, collectGather, upgradeBag, gameSummary, validateSave } from './game/engine.js';

const root = document.querySelector('#app');
let game = load();
let view = 'camp';
let selectedMonster = 'rat';
let autoLoop = false;
let toastTimer = 0;
let lastEvent = '';

const safe = (input) => String(input ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const number = (value) => new Intl.NumberFormat('fr-FR').format(value);
const pct = (value, max) => Math.max(0, Math.min(100, max ? Math.round((value / max) * 100) : 0));
const itemIcon = (id) => ({ charentaise: '♧', fronde: '➶', micro: '♫', nunchaku: '♜', lance: '➹', canard: '◈', papier: '▤', encre: '◉', biscuit: '✿' }[id] || '✧');
const monsterIcon = (id) => ({ rat: '♞', pantoufle: '♧', affiche: '◈', boggart: '☾' }[id] || '✧');
const timeString = (seconds) => `${Math.floor(seconds / 3600)} h ${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')} min`;

function load() {
  try {
    const text = localStorage.getItem(SAVE_KEY);
    return text ? validateSave(JSON.parse(text)) : null;
  } catch (error) {
    console.warn('Sauvegarde locale illisible.', error);
    return null;
  }
}

function persist() {
  if (!game) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)); }
  catch { notify('Impossible de sauvegarder sur cet appareil.'); }
}

function notify(message) {
  let el = document.querySelector('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 3600);
}

function commit(result, success = '') {
  if (result.error) { notify(result.error); return; }
  game = result.game;
  persist();
  if (success) notify(success);
  render();
}

function fill(value, max, variant = '') {
  return `<div class="meter ${variant}"><div style="width:${pct(value, max)}%"></div></div>`;
}

function eclipse() { return '<img class="brand-logo" src="/logo-eclipse.svg" alt="Logo L’Éclipse Blanche" >'; }

function welcome() {
  root.innerHTML = `<div class="welcome-shell"><div class="welcome-art"><div class="sky-glow"></div><div class="moon-art"></div><div class="horizon"></div><div class="welcome-caption"><span class="kicker">ACTE I · LES IMAGES MENTENT</span><h2>Une ville ordinaire.<br>Une réalité qui se fissure.</h2><p>Une affiche a changé. Personne ne semble l’avoir remarqué. Et les pantoufles commencent à mordre.</p></div></div><div class="welcome-form"><div class="brand brand-large">${eclipse()}<div><span class="brand-small">L’AVENTURE D’ABORD</span><strong>L’ÉCLIPSE <i>BLANCHE</i></strong></div></div><div class="step">PROLOGUE <span>·</span> CRÉATION DU PERSONNAGE</div><h1>Comment vous appelle-t-on&nbsp;?</h1><p class="muted">Le monde a peut-être oublié votre nom. Nous, non.</p><form id="start-form"><label class="field-label" for="hero-name">Nom du personnage</label><input id="hero-name" name="name" maxlength="24" autocomplete="nickname" placeholder="Votre nom ou pseudonyme" required value="Voyageur"><div class="field-label field-space">Votre discipline de prédilection</div><div class="styles">${Object.entries(DISCIPLINES).map(([id, d], index) => `<label class="style-choice"><input type="radio" name="discipline" value="${id}" ${index === 0 ? 'checked' : ''}><span class="style-symbol">${d.icon}</span><strong>${d.label}</strong><small>${d.description}</small></label>`).join('')}</div><button class="button-primary start-button" type="submit">Entrer dans la ville <span>↗</span></button></form><p class="fine-print">Prototype solo gratuit · sauvegarde sur cet appareil · aucun achat disponible</p><p class="fine-print">Progression locale expérimentale, non transférable en multijoueur.</p></div></div>`;
}

const menus = [ ['camp', '◈', 'Vue d’ensemble'], ['combat', '⚔', 'Combats'], ['quests', '✧', 'Quêtes'], ['inventory', '▣', 'Inventaire'], ['codex', '▤', 'Codex'] ];

function sidebar() {
  return `<aside class="sidebar"><div class="brand">${eclipse()}<div><span class="brand-small">UN MONDE QUI DOUTE</span><strong>L’ÉCLIPSE <i>BLANCHE</i></strong></div></div><div class="sidebar-label">EXPLORER</div><nav class="navigation" aria-label="Navigation principale">${menus.map(([id, icon, title]) => `<button type="button" data-view="${id}" class="nav-item ${view === id ? 'selected' : ''}" ${view === id ? 'aria-current="page"' : ''}><span class="nav-icon">${icon}</span><span>${title}</span>${id === 'quests' && questStatus(game).some(q => q.progress >= q.goal && !q.claimed) ? '<span class="nav-bubble">!</span>' : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="online-indicator"><span></span> ALPHA 0.2.3 · SOLO LOCAL</div><p>Interface de test. Comptes et sauvegardes serveur en cours de développement.</p><button type="button" class="muted-button danger" data-action="reset">Recommencer</button></div></aside>`;
}

function header() {
  const { hero } = game;
  const xpGoal = gameSummary(game).nextLevelXp;
  return `<header class="topbar"><div class="breadcrumb">L’ÉCLIPSE BLANCHE <span>/</span> <b>${safe(menus.find(m => m[0] === view)?.[2] || 'Aventure')}</b></div><div class="topbar-right"><div class="currency"><span>◉</span><strong>${number(hero.gold)}</strong><small>OR</small></div><div class="top-profile"><div class="portrait">${DISCIPLINES[hero.discipline].icon}</div><div><strong>${safe(hero.name)}</strong><small>Niveau ${hero.level} · R${hero.rebirth}</small></div></div></div></header><div class="status-strip"><div class="status-cell"><span>SANTÉ</span><b>${hero.hp} <em>/ ${hero.maxHp}</em></b>${fill(hero.hp, hero.maxHp, 'health')}</div><div class="status-cell"><span>EXPÉRIENCE</span><b>${hero.xp} <em>/ ${xpGoal}</em></b>${fill(hero.xp, xpGoal, 'xp')}</div><div class="status-cell compact"><span>DISCIPLINE</span><b>${DISCIPLINES[hero.discipline].icon} ${DISCIPLINES[hero.discipline].label}</b></div><div class="status-cell compact"><span>VICTOIRES</span><b>${game.totalWins}</b></div></div>`;
}

function questWidget() {
  const list = questStatus(game);
  const quest = list.find(q => !q.claimed) || list[list.length - 1];
  return `<section class="panel focus-panel"><div class="panel-eyebrow">FIL ROUGE · CHAPITRE I</div><div class="panel-heading"><h3>${safe(quest.title)}</h3><span class="tag">${quest.claimed ? 'TERMINÉ' : `${quest.progress}/${quest.goal}`}</span></div><p>${safe(quest.description)}</p>${fill(quest.progress, quest.goal, 'gold')}${quest.progress >= quest.goal && !quest.claimed ? `<button class="button-primary small" data-action="claim" data-id="${quest.id}">Réclamer la récompense ↗</button>` : `<button class="text-link" data-view="quests">Voir les quêtes →</button>`}</section>`;
}

function camp() {
  const gather = gatherPreview(game);
  const summary = gameSummary(game);
  return `<div class="page-heading"><div><div class="kicker">ACTE I · LA VILLE AUX REFLETS</div><h1>Une réalité.<br><i>Plusieurs vérités.</i></h1><p>Une affiche familière ne ressemble plus à ce qu’elle était hier. Le vernissage de ce soir pourrait avoir des réponses. Ou de très mauvaises questions.</p></div><div class="chapter-badge">01 <span> / PREMIER CHAPITRE</span></div></div><div class="hero-visual compact-hero"><div class="hero-visual-content"><span>LA RÉALITÉ APPARENTE</span><h2>Quelque chose vous observe.</h2><button class="button-primary" data-view="combat">Combattre <span>↗</span></button></div><div class="visual-edition">ALPHA · R${game.hero.rebirth}</div></div><div class="two-columns"><div class="stack">${questWidget()}<section class="panel gather-panel"><div class="panel-eyebrow">RÉCOLTE AUTOMATIQUE</div><div class="panel-heading"><h3>Collecte de rumeurs</h3><span class="status-dot">ACTIVE</span></div><p>La ville murmure, même lorsque vous êtes absent. Récupérez des papiers de rumeur et quelques pièces d’or.</p><div class="gather-numbers"><div><span>OR EN ATTENTE</span><strong>+${gather.gold}</strong></div><div><span>PAPIERS EN ATTENTE</span><strong>+${gather.items}</strong></div></div>${fill(gather.elapsed, gather.maxSeconds, 'gold')}<div class="panel-footer"><small>${timeString(gather.elapsed)} / ${timeString(gather.maxSeconds)} · Plafond initial : 2 h</small><button class="button-outline" data-action="gather" ${gather.units ? '' : 'disabled'}>Récupérer</button></div></section></div><div class="stack"><section class="panel stat-panel"><div class="panel-eyebrow">VOTRE PARCOURS</div><div class="mini-stats"><div><span>RENAISSANCES</span><strong>${game.hero.rebirth}</strong><small>Le destin se répète…</small></div><div><span>DÉCOUVERTES</span><strong>${summary.discovered}</strong><small>Codex permanent</small></div><div><span>INVENTAIRE</span><strong>${summary.occupied}<em>/${game.inventoryCapacity}</em></strong><small>Emplacements occupés</small></div><div><span>QUÊTES ACCOMPLIES</span><strong>${summary.questCount}<em>/${QUESTS.length}</em></strong><small>Premier chapitre</small></div></div></section><section class="panel inn-panel"><div class="panel-eyebrow">RÉCUPÉRATION</div><h3>L’auberge du Dernier Mot</h3><p>Un lit, une soupe, et un aubergiste qui jure vous avoir déjà vu demain.</p><div class="panel-footer"><small>Santé complète · 5 or<br>Gratuit (+15 PV) si sans argent</small><button class="button-outline" data-action="rest" ${game.hero.hp === game.hero.maxHp ? 'disabled' : ''}>Se reposer</button></div></section></div></div>`;
}

function monsterCard(monster) {
  const isSelected = selectedMonster === monster.id;
  return `<button class="monster-card ${isSelected ? 'active' : ''}" data-monster="${monster.id}" ${game.combat ? 'disabled' : ''}><span class="monster-medallion kind-${monster.id}">${monsterIcon(monster.id)}</span><span class="monster-text"><strong>${monster.name}</strong><small>${monster.subtitle}</small></span><span class="monster-level">${monster.hp} PV</span></button>`;
}

function combat() {
  const candidates = availableMonsters(game);
  if (!candidates.some(m => m.id === selectedMonster)) selectedMonster = candidates[0].id;
  const id = game.combat?.monsterId || selectedMonster;
  const monster = MONSTERS[id];
  const fighting = game.combat;
  const weaponId = game.equipment.weapon;
  const weapon = ITEMS[weaponId];
  return `<div class="section-title compact-title"><div><div class="kicker">PERCEPTIONS · RÉALITÉ R${game.hero.rebirth}</div><h1>Confrontation <i>des représentations.</i></h1><p>Les manifestations accessibles reflètent votre progression. Leur véritable nature sera révélée par les Renaissances.</p></div><span class="chapter-badge">${candidates.length} <span>/ VISIBLES</span></span></div>
  <div class="combat-shell">
    <section class="panel encounter-list"><div class="panel-eyebrow">CHOISIR UNE MANIFESTATION</div><div class="monster-list">${candidates.map(monsterCard).join('')}</div><div class="encounter-hint">Les manifestations disponibles dans cette alpha sont provisoires. Le palier R modifiera ensuite leur perception.</div></section>
    <section class="panel battle-stage combat-arena">
      <div class="arena-top"><div class="panel-eyebrow">${fighting ? 'COMBAT EN COURS · TOUR '+(fighting.round+1) : 'PRÊT À COMBATTRE'}</div><span class="arena-state">${fighting ? '● EN COURS':'● EN ATTENTE'}</span></div>
      <div class="fighters">
        <div class="fighter fighter-hero"><div class="fighter-title"><span>R${game.hero.rebirth} · NV ${game.hero.level}</span><strong>${safe(game.hero.name)}</strong><small>${DISCIPLINES[game.hero.discipline].label}</small></div><div class="fighter-health">${fill(game.hero.hp,game.hero.maxHp,'health')}<small>${game.hero.hp} / ${game.hero.maxHp} PV</small></div><div class="fighter-portrait hero-portrait" aria-label="Votre personnage">${DISCIPLINES[game.hero.discipline].icon}</div><small class="fighter-weapon">${itemIcon(weaponId)} ${safe(weapon?.name || 'Sans arme')}</small></div>
        <div class="arena-versus">VS</div>
        <div class="fighter fighter-enemy"><div class="fighter-title"><span>MANIFESTATION · R${game.hero.rebirth}</span><strong>${safe(monster.name)}</strong><small>${safe(monster.subtitle)}</small></div><div class="fighter-health">${fill(fighting?.hp ?? monster.hp,monster.hp,'monster-health')}<small>${fighting?.hp ?? monster.hp} / ${monster.hp} PV</small></div><div class="fighter-portrait enemy-portrait kind-${id}" aria-label="${safe(monster.name)}">${monsterIcon(id)}</div><small class="fighter-weapon">⚔ ${monster.attack} attaque · ✦ ${monster.xp} XP · ◉ ${monster.gold} or</small></div>
      </div>
      <div class="combat-actions">${fighting ? `<div class="battle-running"><span class="pulse"></span> Combat automatique · Tour ${fighting.round+1}</div>` : `<button class="button-primary large" data-action="fight" ${game.hero.hp===0?'disabled':''}>Engager le combat ⚔</button>`}<label class="auto-control"><input type="checkbox" id="auto-loop" ${autoLoop?'checked':''}><span>Enchaîner tant que la santé le permet</span></label></div>
      <div class="combat-result">${lastEvent ? `<p class="battle-note">${safe(lastEvent)}</p>` : '<p class="battle-note">Sélectionnez une manifestation puis engagez le combat.</p>'}</div>
    </section>
  </div>`;
}

function quests() {
  return `<div class="section-title"><div><div class="kicker">CHAPITRE I · LE VERNISSAGE APPROCHE</div><h1>Petites causes, <i>grands doutes.</i></h1><p>Accomplissez de véritables actions pour faire progresser l’histoire. Les quêtes terminées sont conservées.</p></div></div><div class="quest-list">${questStatus(game).map((quest, index) => `<article class="panel quest-entry"><div class="quest-index">${String(index + 1).padStart(2, '0')}</div><div class="quest-info"><div class="panel-eyebrow">${quest.claimed ? 'ACCOMPLIE' : quest.progress === quest.goal ? 'RÉCOMPENSE DISPONIBLE' : 'EN COURS'}</div><h3>${quest.title}</h3><p>${quest.description}</p>${fill(quest.progress, quest.goal, 'gold')}<small>${quest.progress} / ${quest.goal} · Récompense : ${quest.rewards.gold} or${Object.entries(quest.rewards.items || {}).map(([id, n]) => ` + ${n} ${ITEMS[id].name}`).join('')}</small></div><div>${quest.claimed ? '<span class="complete-mark">✓ Terminé</span>' : quest.progress >= quest.goal ? `<button class="button-primary small" data-action="claim" data-id="${quest.id}">Réclamer ↗</button>` : `<button class="button-outline" data-view="combat">Combattre →</button>`}</div></article>`).join('')}</div>`;
}

function inventory() {
  const entries = Object.entries(game.inventory).filter(([, qty]) => qty > 0);
  const summary = gameSummary(game);
  return `<div class="section-title"><div><div class="kicker">VOTRE SAC · VOS TROUVAILLES</div><h1>Le désordre <i>organisé.</i></h1><p>Un objet découvert reste dans le Codex, même si vous ne le possédez plus. L’or occupe un emplacement.</p></div></div><div class="inventory-bar panel"><div><div class="panel-eyebrow">CAPACITÉ DE TRANSPORT</div><strong>${summary.occupied} / ${game.inventoryCapacity} emplacements</strong>${fill(summary.occupied, game.inventoryCapacity, 'gold')}</div><div class="bag-upgrade"><span>Extension : <b>+8 places</b><small>16 → 24 → 32 → 40</small></span><button class="button-outline" data-action="bag" ${game.inventoryCapacity >= 40 ? 'disabled' : ''}>Améliorer · 150 or</button></div></div><div class="inventory-list"><div class="inventory-item gold-item"><span class="item-symbol">◉</span><div><strong>Pièces d’or</strong><small>Monnaie ordinaire · 1 emplacement</small></div><span class="item-quantity">${number(game.hero.gold)}</span></div>${entries.map(([id, qty]) => {const item = ITEMS[id]; const worn = game.equipment.weapon === id; const canEquip = item.type === 'weapon' && item.discipline === game.hero.discipline && !worn; return `<div class="inventory-item"><span class="item-symbol ${item.rarity}">${itemIcon(id)}</span><div class="inventory-description"><strong>${item.name} ${worn ? '<span class="tag">ÉQUIPÉ</span>' : ''}</strong><small>${item.description}${item.power ? ` · Puissance ${item.power}` : ''}</small></div><span class="item-quantity">×${qty}</span>${canEquip ? `<button class="button-outline small" data-action="equip" data-id="${id}">Équiper</button>` : ''}${item.type === 'consumable' ? `<button class="button-outline small" data-action="use" data-id="${id}">Utiliser</button>` : ''}</div>`;}).join('')}</div>`;
}

function codex() {
  return `<div class="section-title"><div><div class="kicker">ARCHIVES · SOUVENIRS PERSISTANTS</div><h1>Le diable se cache <i>dans les détails.</i></h1><p>Une découverte est permanente. Le Codex distingue les créatures rencontrées des objets possédés.</p></div></div><div class="codex-intro panel"><span>✧</span><p>« On raconte que lorsqu’une histoire est répétée assez souvent, le monde finit par l’entendre. »</p></div><div class="panel-eyebrow catalog-label">CRÉATURES · ${game.codex.monsters.length}/${Object.keys(MONSTERS).length}</div><div class="codex-grid">${Object.entries(MONSTERS).map(([id, m]) => `<article class="codex-entry ${game.codex.monsters.includes(id) ? '' : 'undiscovered'}"><div class="codex-icon">${game.codex.monsters.includes(id) ? monsterIcon(id) : '?'}</div><strong>${game.codex.monsters.includes(id) ? m.name : 'Inconnue'}</strong><small>${game.codex.monsters.includes(id) ? m.subtitle : 'Cette page reste à écrire.'}</small></article>`).join('')}</div><div class="panel-eyebrow catalog-label">OBJETS · ${game.codex.items.length}/${Object.keys(ITEMS).length}</div><div class="codex-grid">${Object.entries(ITEMS).map(([id, item]) => `<article class="codex-entry ${game.codex.items.includes(id) ? '' : 'undiscovered'}"><div class="codex-icon">${game.codex.items.includes(id) ? itemIcon(id) : '?'}</div><strong>${game.codex.items.includes(id) ? item.name : 'Inconnu'}</strong><small>${game.codex.items.includes(id) ? item.description : 'À découvrir dans le monde.'}</small></article>`).join('')}</div>`;
}

function sideInventory() {
  const entries = Object.entries(game.inventory).filter(([, amount]) => amount > 0);
  const slots = gameSummary(game).occupied;
  const filled = [
    { id: 'gold', qty: game.hero.gold, name: 'Pièces d’or', icon: '◉', kind: 'gold' },
    ...entries.map(([id, qty]) => ({ id, qty, name: ITEMS[id].name, icon: itemIcon(id), kind: ITEMS[id].rarity })),
  ];
  const cells = Array.from({ length: game.inventoryCapacity }, (_, index) => {
    const item = filled[index];
    if (!item) return `<span class="quick-item empty-slot" aria-label="Emplacement ${index + 1} vide" title="Emplacement ${index + 1} — vide"><span></span></span>`;
    if (item.id === 'gold') return `<div class="quick-item gold-slot" title="Or : ${number(item.qty)}"><span>◉</span><small>${number(item.qty)}</small></div>`;
    const def = ITEMS[item.id];
    const equipped = game.equipment.weapon === item.id;
    const canEquip = def.type === 'weapon' && def.discipline === game.hero.discipline && !equipped;
    const usable = def.type === 'consumable';
    return `<button type="button" class="quick-item ${item.kind} ${equipped ? 'equipped' : ''}" aria-label="${safe(item.name)} : ${item.qty}" title="${safe(item.name)} — ${safe(def.description)}" ${canEquip || usable ? `data-action="${usable ? 'use' : 'equip'}" data-id="${item.id}"` : 'data-view="inventory"'}><span>${item.icon}</span><small>×${item.qty}</small></button>`;
  }).join('');
  return `<section class="quick-inventory"><div class="right-heading"><strong>INVENTAIRE</strong><span>${slots}/${game.inventoryCapacity}</span></div><div class="quick-grid" aria-label="Sac de ${game.inventoryCapacity} emplacements">${cells}</div><button class="text-link quick-inventory-link" data-view="inventory">Gérer l’inventaire →</button></section>`;
}

function sideActions() {
  const pending = questStatus(game).filter(q => !q.claimed);
  const ready = pending.filter(q => q.progress >= q.goal);
  const quest = pending.find(q => q.progress < q.goal);
  const gather = gatherPreview(game);
  return `<section class="side-actions"><div class="activity-title">À FAIRE <span>${pending.length} quête(s)</span></div>
    <div class="side-actions-list">
      ${ready.map(q => `<button type="button" class="side-action actionable" data-action="claim" data-id="${q.id}"><strong>✓ ${safe(q.title)}</strong><small>Récompense à récupérer</small></button>`).join('')}
      ${quest ? `<button type="button" class="side-action" data-view="quests"><strong>${safe(quest.title)}</strong><small>${quest.progress}/${quest.goal} · ${safe(quest.description)}</small></button>` : pending.length ? '' : '<div class="side-action"><strong>Quêtes terminées</strong><small>Revenez lors du prochain chapitre.</small></div>'}
      ${gather.units ? `<button type="button" class="side-action actionable" data-action="gather"><strong>Récolte disponible</strong><small>+${gather.gold} or · +${gather.items} papier(s)</small></button>` : ''}
      ${game.hero.hp < game.hero.maxHp ? `<button type="button" class="side-action" data-action="rest"><strong>Récupérer de la santé</strong><small>${game.hero.hp}/${game.hero.maxHp} PV · Auberge</small></button>` : ''}
    </div>
  </section>`;
}

function activityPanel() {
  // Le moteur conserve les événements les plus récents en premier.
  // L'interface restitue un journal chronologique, lisible du haut vers le bas.
  const events = game.log.slice(0, 35).reverse();
  return `<aside class="activity-sidebar">${sideInventory()}${sideActions()}<section class="journal-section"><div class="activity-title">JOURNAL <span>${events.length} événements</span></div><div class="activity-entries" id="journal-feed" role="log" aria-live="off">${events.map((entry,index) => `<div class="activity-entry"><span class="activity-bullet ${index === events.length-1?'latest':''}"></span><p>${safe(entry.message)}</p></div>`).join('')}</div></section></aside>`;
}

function render() {
  if (!game) { welcome(); return; }
  const pages = { camp, combat, quests, inventory, codex };
  root.innerHTML = `<div class="app-layout">${sidebar()}<div class="workspace">${header()}<main class="content" id="main-content">${pages[view]()}</main></div>${activityPanel()}</div><button class="mobile-menu" data-action="menu" aria-label="Afficher la navigation">☰</button>`;
  const journal = document.querySelector("#journal-feed");
  if (journal) journal.scrollTop = journal.scrollHeight;
}

root.addEventListener('submit', (event) => {
  if (event.target.id !== 'start-form') return;
  event.preventDefault();
  const form = new FormData(event.target);
  game = createGame(form.get('name'), form.get('discipline'));
  view = 'camp'; persist(); render();
});

root.addEventListener('change', (event) => {
  if (event.target.id === 'auto-loop') { autoLoop = event.target.checked; notify(autoLoop ? 'Enchaînement activé pendant que le jeu est ouvert.' : 'Enchaînement désactivé.'); }
});

root.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action], [data-view], [data-monster]');
  if (!target) return;
  if (target.dataset.view) { view = target.dataset.view; document.querySelector('.sidebar')?.classList.remove('mobile-open'); render(); return; }
  if (target.dataset.monster) { selectedMonster = target.dataset.monster; lastEvent = ''; render(); return; }
  const action = target.dataset.action;
  if (action === 'menu') { document.querySelector('.sidebar')?.classList.toggle('mobile-open'); return; }
  if (action === 'reset') {
    if (confirm('Effacer définitivement votre personnage local et recommencer ? Cette alpha ne propose pas de restauration.')) {
      localStorage.removeItem(SAVE_KEY); game = null; autoLoop = false; view = 'camp'; render();
    }
    return;
  }
  if (!game) return;
  if (action === 'fight') { const result = startCombat(game, selectedMonster); commit(result); return; }
  if (action === 'rest') { commit(rest(game)); return; }
  if (action === 'gather') { commit(collectGather(game)); return; }
  if (action === 'bag') { commit(upgradeBag(game)); return; }
  if (action === 'use') { commit(useItem(game, target.dataset.id)); return; }
  if (action === 'equip') { commit(equip(game, target.dataset.id)); return; }
  if (action === 'claim') { commit(claimQuest(game, target.dataset.id)); return; }
});

setInterval(() => {
  if (!game) return;
  if (game.combat) {
    const result = combatTurn(game);
    if (result.event === 'hit') lastEvent = `Vous infligez ${result.damage} dégâts${result.critical ? ' (critique)' : ''} et subissez ${result.received} dégâts.`;
    if (result.event === 'victory') lastEvent = `Victoire ! ${result.damage} dégâts au dernier coup.`;
    if (result.event === 'defeat') { lastEvent = 'Défaite. Reposez-vous à l’auberge.'; autoLoop = false; }
    commit(result);
    return;
  }
  if (autoLoop && game.hero.hp > Math.max(8, MONSTERS[selectedMonster].attack * 2)) {
    commit(startCombat(game, selectedMonster));
    return;
  }
  if (autoLoop && game.hero.hp <= Math.max(8, MONSTERS[selectedMonster].attack * 2)) {
    autoLoop = false;
    notify('Combats automatiques arrêtés : santé insuffisante.');
    render();
    return;
  }
  if (view === 'camp') {
    // Actualisation des gains hors ligne uniquement ; ne remplace pas les éléments interactifs.
    const stats = gameSummary(game);
    const bar = document.querySelector('.gather-panel');
    if (bar) {
      const values = bar.querySelectorAll('.gather-numbers strong');
      if (values.length === 2) { values[0].textContent = `+${stats.gathering.gold}`; values[1].textContent = `+${stats.gathering.items}`; }
      const meter = bar.querySelector('.meter > div');
      if (meter) meter.style.width = `${pct(stats.gathering.elapsed, stats.gathering.maxSeconds)}%`;
      const button = bar.querySelector('[data-action="gather"]');
      if (button) button.disabled = !stats.gathering.units;
    }
  }
}, 1700);

render();