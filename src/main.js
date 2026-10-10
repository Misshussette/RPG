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
    console.warn('Sauvegarde illisible, restauration par import possible.', error);
    return null;
  }
}

function persist() {
  if (!game) return;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)); }
  catch { notify('Impossible de sauvegarder sur cet appareil : exportez votre partie.'); }
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

function eclipse() { return '<span class="eclipse-mark" aria-hidden="true"></span>'; }

function welcome() {
  root.innerHTML = `<div class="welcome-shell"><div class="welcome-art"><div class="sky-glow"></div><div class="moon-art"></div><div class="horizon"></div><div class="welcome-caption"><span class="kicker">ACTE I · LES IMAGES MENTENT</span><h2>Une ville ordinaire.<br>Une réalité qui se fissure.</h2><p>Une affiche a changé. Personne ne semble l’avoir remarqué. Et les pantoufles commencent à mordre.</p></div></div><div class="welcome-form"><div class="brand brand-large">${eclipse()}<div><span class="brand-small">L’AVENTURE D’ABORD</span><strong>L’ÉCLIPSE <i>BLANCHE</i></strong></div></div><div class="step">PROLOGUE <span>·</span> CRÉATION DU PERSONNAGE</div><h1>Comment vous appelle-t-on&nbsp;?</h1><p class="muted">Le monde a peut-être oublié votre nom. Nous, non.</p><form id="start-form"><label class="field-label" for="hero-name">Nom du personnage</label><input id="hero-name" name="name" maxlength="24" autocomplete="nickname" placeholder="Votre nom ou pseudonyme" required value="Voyageur"><div class="field-label field-space">Votre discipline de prédilection</div><div class="styles">${Object.entries(DISCIPLINES).map(([id, d], index) => `<label class="style-choice"><input type="radio" name="discipline" value="${id}" ${index === 0 ? 'checked' : ''}><span class="style-symbol">${d.icon}</span><strong>${d.label}</strong><small>${d.description}</small></label>`).join('')}</div><button class="button-primary start-button" type="submit">Entrer dans la ville <span>↗</span></button></form><p class="fine-print">Prototype solo gratuit · sauvegarde sur cet appareil · aucun achat disponible</p><button class="text-link" data-action="import">Importer une ancienne sauvegarde</button></div></div>`;
}

const menus = [ ['camp', '◈', 'Vue d’ensemble'], ['combat', '⚔', 'Combats'], ['quests', '✧', 'Quêtes'], ['inventory', '▣', 'Inventaire'], ['codex', '▤', 'Codex'] ];

function sidebar() {
  return `<aside class="sidebar"><div class="brand">${eclipse()}<div><span class="brand-small">UN MONDE QUI DOUTE</span><strong>L’ÉCLIPSE <i>BLANCHE</i></strong></div></div><div class="sidebar-label">EXPLORER</div><nav class="navigation" aria-label="Navigation principale">${menus.map(([id, icon, title]) => `<button type="button" data-view="${id}" class="nav-item ${view === id ? 'selected' : ''}" ${view === id ? 'aria-current="page"' : ''}><span class="nav-icon">${icon}</span><span>${title}</span>${id === 'quests' && questStatus(game).some(q => q.progress >= q.goal && !q.claimed) ? '<span class="nav-bubble">!</span>' : ''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="online-indicator"><span></span> MODE SOLO · LOCAL</div><p>La ville change, même quand vous ne la regardez pas.</p><button class="muted-button" data-action="export">↥ Exporter la sauvegarde</button></div></aside>`;
}

function header() {
  const { hero } = game;
  const xpGoal = gameSummary(game).nextLevelXp;
  return `<header class="topbar"><div class="breadcrumb">LA VILLE AUX REFLETS <span>/</span> <b>${safe(menus.find(m => m[0] === view)?.[2] || 'Aventure')}</b></div><div class="topbar-right"><div class="currency"><span>◉</span><strong>${number(hero.gold)}</strong><small>OR</small></div><div class="top-profile"><div class="portrait">${DISCIPLINES[hero.discipline].icon}</div><div><strong>${safe(hero.name)}</strong><small>Niveau ${hero.level} · R${hero.rebirth}</small></div></div></div></header><div class="status-strip"><div class="status-cell"><span>SANTÉ</span><b>${hero.hp} <em>/ ${hero.maxHp}</em></b>${fill(hero.hp, hero.maxHp, 'health')}</div><div class="status-cell"><span>EXPÉRIENCE</span><b>${hero.xp} <em>/ ${xpGoal}</em></b>${fill(hero.xp, xpGoal, 'xp')}</div><div class="status-cell compact"><span>DISCIPLINE</span><b>${DISCIPLINES[hero.discipline].icon} ${DISCIPLINES[hero.discipline].label}</b></div><div class="status-cell compact"><span>VICTOIRES</span><b>${game.totalWins}</b></div></div>`;
}

function questWidget() {
  const list = questStatus(game);
  const quest = list.find(q => !q.claimed) || list[list.length - 1];
  return `<section class="panel focus-panel"><div class="panel-eyebrow">FIL ROUGE · CHAPITRE I</div><div class="panel-heading"><h3>${safe(quest.title)}</h3><span class="tag">${quest.claimed ? 'TERMINÉ' : `${quest.progress}/${quest.goal}`}</span></div><p>${safe(quest.description)}</p>${fill(quest.progress, quest.goal, 'gold')}${quest.progress >= quest.goal && !quest.claimed ? `<button class="button-primary small" data-action="claim" data-id="${quest.id}">Réclamer la récompense ↗</button>` : `<button class="text-link" data-view="quests">Voir les quêtes →</button>`}</section>`;
}

function camp() {
  const gather = gatherPreview(game);
  const summary = gameSummary(game);
  return `<div class="page-heading"><div><div class="kicker">ACTE I · LA VILLE AUX REFLETS</div><h1>Le monde a changé.<br><i>Vous aussi, bientôt.</i></h1><p>Une affiche familière ne ressemble plus à ce qu’elle était hier. Le vernissage de ce soir pourrait avoir des réponses. Ou de très mauvaises questions.</p></div><div class="chapter-badge">01 <span> / PREMIER CHAPITRE</span></div></div><div class="hero-visual"><div class="visual-orbit"></div><div class="visual-disc"></div><div class="visual-landscape"></div><div class="hero-visual-content"><span>LA CITÉ OÙ TOUT SEMBLE NORMAL</span><h2>Quelque chose<br>vous observe.</h2><button class="button-primary" data-view="combat">Partir à l’aventure <span>↗</span></button></div><div class="visual-edition">L’ÉCLIPSE BLANCHE <span>· ALPHA SOLO</span></div></div><div class="two-columns"><div class="stack">${questWidget()}<section class="panel gather-panel"><div class="panel-eyebrow">ACTIVITÉ HORS LIGNE</div><div class="panel-heading"><h3>Collecte de rumeurs</h3><span class="status-dot">ACTIVE</span></div><p>La ville murmure, même lorsque vous êtes absent. Récupérez des papiers de rumeur et quelques pièces d’or.</p><div class="gather-numbers"><div><span>OR EN ATTENTE</span><strong>+${gather.gold}</strong></div><div><span>PAPIERS EN ATTENTE</span><strong>+${gather.items}</strong></div></div>${fill(gather.elapsed, gather.maxSeconds, 'gold')}<div class="panel-footer"><small>${timeString(gather.elapsed)} / ${timeString(gather.maxSeconds)} · Plafond initial : 2 h</small><button class="button-outline" data-action="gather" ${gather.units ? '' : 'disabled'}>Récupérer</button></div></section></div><div class="stack"><section class="panel stat-panel"><div class="panel-eyebrow">VOTRE PARCOURS</div><div class="mini-stats"><div><span>RENAISSANCES</span><strong>${game.hero.rebirth}</strong><small>Le destin se répète…</small></div><div><span>DÉCOUVERTES</span><strong>${summary.discovered}</strong><small>Codex permanent</small></div><div><span>INVENTAIRE</span><strong>${summary.occupied}<em>/${game.inventoryCapacity}</em></strong><small>Emplacements occupés</small></div><div><span>QUÊTES ACCOMPLIES</span><strong>${summary.questCount}<em>/${QUESTS.length}</em></strong><small>Premier chapitre</small></div></div></section><section class="panel inn-panel"><div class="panel-eyebrow">LE REPOS DU VOYAGEUR</div><h3>L’auberge du Dernier Mot</h3><p>Un lit, une soupe, et un aubergiste qui jure vous avoir déjà vu demain.</p><div class="panel-footer"><small>Santé complète · 5 or<br>Gratuit (+15 PV) si sans argent</small><button class="button-outline" data-action="rest" ${game.hero.hp === game.hero.maxHp ? 'disabled' : ''}>Se reposer</button></div></section></div></div>`;
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
  return `<div class="section-title"><div><div class="kicker">RENCONTRES · PREMIÈRE RÉGION</div><h1>Les rues ont <i>des dents.</i></h1><p>Choisissez une créature, puis laissez votre personnage attaquer automatiquement, tour après tour.</p></div><span class="chapter-badge">${candidates.length} <span>/ CRÉATURES</span></span></div><div class="combat-grid"><section class="panel encounter-list"><div class="panel-eyebrow">CRÉATURES RENCONTRÉES</div><div class="monster-list">${candidates.map(monsterCard).join('')}</div><div class="encounter-hint">De nouvelles rencontres apparaissent après plusieurs victoires.</div></section><section class="panel battle-stage"><div class="panel-eyebrow">${fighting ? 'COMBAT EN COURS' : 'PROCHAINE RENCONTRE'}</div><div class="battle-monster"><div class="monster-aura"></div><div class="big-monster kind-${id}" aria-label="Créature : ${monster.name}">${monsterIcon(id)}</div></div><h2>${monster.name}</h2><p>${monster.subtitle}</p><div class="battle-hp"><span>SANTÉ DE LA CRÉATURE</span><strong>${fighting ? fighting.hp : monster.hp} / ${monster.hp}</strong></div>${fill(fighting ? fighting.hp : monster.hp, monster.hp, 'monster-health')}<div class="battle-meta"><span>⚔ ${monster.attack} attaque</span><span>✦ ${monster.xp} XP</span><span>◉ ${monster.gold} or</span></div>${fighting ? `<div class="battle-running"><span class="pulse"></span> Combat automatique · Tour ${fighting.round + 1}</div>` : `<button class="button-primary large" data-action="fight" ${game.hero.hp === 0 ? 'disabled' : ''}>Engager le combat <span>⚔</span></button>`}<label class="auto-control"><input type="checkbox" id="auto-loop" ${autoLoop ? 'checked' : ''}><span>Enchaîner les combats tant que la santé le permet</span></label>${lastEvent ? `<p class="battle-note">${safe(lastEvent)}</p>` : ''}<div class="battle-tip">Astuce : la mêlée encaisse mieux, la distance peut infliger des coups critiques, la magie se soigne parfois.</div></section></div>`;
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

function activityPanel() {
  return `<aside class="activity-sidebar"><div class="activity-title">JOURNAL <span>◷</span></div><div class="activity-entries">${game.log.slice(0, 9).map((entry, index) => `<div class="activity-entry"><span class="activity-bullet ${index === 0 ? 'latest' : ''}"></span><p>${safe(entry.message)}</p></div>`).join('')}</div><div class="activity-foot"><div class="panel-eyebrow">VERSION DE DÉVELOPPEMENT</div><strong>Alpha · Solo</strong><p>Les fonctionnalités en ligne, la boutique et les paiements ne sont pas actifs.</p><button class="muted-button" data-action="export">Exporter ma partie ↗</button><button class="muted-button" data-action="import">Importer une partie ↙</button><button class="muted-button danger" data-action="reset">Recommencer</button></div></aside>`;
}

function render() {
  if (!game) { welcome(); return; }
  const pages = { camp, combat, quests, inventory, codex };
  root.innerHTML = `<div class="app-layout">${sidebar()}<div class="workspace">${header()}<main class="content" id="main-content">${pages[view]()}</main></div>${activityPanel()}</div><button class="mobile-menu" data-action="menu" aria-label="Afficher la navigation">☰</button>`;
}

function exportSave() {
  if (!game) { notify('Aucune partie à exporter.'); return; }
  const blob = new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eclipse-blanche-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('Sauvegarde exportée. Conservez ce fichier.');
}

function importSave() {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = '.json,application/json';
  input.addEventListener('change', async () => {
    if (!input.files?.[0]) return;
    try {
      if (input.files[0].size > 1_000_000) throw new Error('Fichier trop volumineux.');
      const next = validateSave(JSON.parse(await input.files[0].text()));
      if (game && !confirm('Importer remplacera la partie actuelle. Continuer ?')) return;
      game = next; autoLoop = false; view = 'camp'; persist(); render(); notify('Partie importée avec succès.');
    } catch (error) { notify(`Import impossible : ${error.message}`); }
  });
  input.click();
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
  if (action === 'import') { importSave(); return; }
  if (action === 'export') { exportSave(); return; }
  if (action === 'menu') { document.querySelector('.sidebar')?.classList.toggle('mobile-open'); return; }
  if (action === 'reset') {
    if (confirm('Effacer votre personnage et recommencer ? Exportez votre partie au préalable si vous voulez la conserver.')) {
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