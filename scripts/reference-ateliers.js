/*
 * OPTIONAL LOCAL-ONLY REFERENCE NAVIGATION.
 * Rearranges the user's private reference DOM without copying its sources
 * into GitHub, changing the game engine, or rewriting saves.
 *
 * Load reference at: http://127.0.0.1:4174/?layout=ateliers
 */
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const groups = [
    { id:'home', title:'Accueil', members:['nav-home'] },
    { id:'combat', title:'Combat & Donjons', members:['nav-combat','nav-range','nav-magic','nav-hitpoints','nav-defence','nav-dungeon','nav-worldboss'] },
    { id:'resources', title:'Ressources & Fonderie', members:['nav-mining','nav-woodcutting','nav-smithing'],
      shortcuts:[{label:'Fondre les lingots',target:'nav-smithing',tab:'smelt'}] },
    { id:'armory', title:'Armurerie', members:['nav-fletching','nav-crafting','nav-blacksmith'],
      shortcuts:[{label:'Fabriquer les pièces métalliques',target:'nav-smithing',tab:'bronze'}] },
    { id:'kitchen', title:'Pêche & Cuisine', members:['nav-fishing','nav-cooking'] },
    { id:'culture', title:'Culture & Préparations', members:['nav-cultivating'] },
    { id:'rituals', title:'Feux & Rituels', members:['nav-firemaking','nav-cremation'] },
    { id:'hunting', title:'Chasse & Contrats', members:['nav-hunting'] },
    { id:'shadows', title:'Larcins', members:['nav-thieving'] },
    { id:'commerce', title:'Marché, Banque & Équipement', members:['nav-shop','nav-bank','nav-gear','nav-upgrades'] },
    { id:'forge', title:'Forge éternelle', members:['nav-eternal-forge'] },
    { id:'options', title:'Options', members:['nav-settings'] }
  ];
  const details={
    'nav-smithing':'Fonte des lingots et fabrication de pièces : une seule compétence, deux accès.',
    'nav-fletching':'Deux onglets réels : arcs et flèches.',
    'nav-crafting':'Bâtons, cuir, tissu, anneaux et amulettes.',
    'nav-cultivating':'Cultures et transformations.',
    'nav-hunting':'Contrats monstres, contrats donjons et boutique de chasse.',
    'nav-shop':'Boutique générale, artisans, marchand itinérant et fournitures.',
    'nav-blacksmith':'Renforcement des équipements ; distinct de la forge éternelle.'
  };
  function shortcut(spec) {
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='nav-btn ref-layout-shortcut';
    btn.innerHTML='<span class="ref-layout-mark" aria-hidden="true">↳</span><span></span>';
    btn.lastElementChild.textContent=spec.label;
    btn.title='Ouvre le véritable écran et son sous-onglet dans l’application de référence';
    btn.addEventListener('click',()=>{
      const target=document.getElementById(spec.target);
      if (!target) return;
      target.click();
      const tab=document.querySelector('#smith-tabs .craft-tab[onclick*="\''+spec.tab+'\'"]');
      if (tab) tab.click();
    });
    return btn;
  }
  function install(){
    const sidebar=$('.sidebar');
    if(!sidebar||$('#ref-layout-wrap'))return;
    const wanted=groups.flatMap(g=>g.members);
    const missing=wanted.filter(id=>!document.getElementById(id));
    if(missing.length){console.warn('Ateliers: menus sources manquants',missing);return}
    const wrap=document.createElement('div');wrap.id='ref-layout-wrap';
    const alert=document.createElement('div');alert.className='ref-layout-info';
    alert.textContent='ORGANISATION D’ESSAI · Tous les vrais écrans de référence restent actifs. Aucune règle de jeu modifiée.';
    wrap.append(alert);
    for(const group of groups){
      const section=document.createElement('div');section.className='sb-section ref-layout-section';
      section.dataset.refGroup=group.id;
      const heading=document.createElement('button');
      heading.type='button';heading.className='ref-layout-heading';
      heading.textContent=group.title;
      heading.setAttribute('aria-expanded','true');
      const body=document.createElement('div');body.className='ref-layout-section-content';
      heading.addEventListener('click',()=>{
        const collapsed=body.hidden=!body.hidden;
        heading.setAttribute('aria-expanded',String(!collapsed));
      });
      section.append(heading,body);
      for(const id of group.members){
        const button=document.getElementById(id);
        body.append(button); // move real button, NEVER clone/recreate it
        if(details[id])button.title=details[id];
      }
      for(const spec of group.shortcuts||[])body.append(shortcut(spec));
      wrap.append(section);
    }
    // Keep source sections and their runtime IDs in the DOM for the original
    // engine's level updates/collapse state. Hide their now-empty wrappers.
    for(const original of sidebar.querySelectorAll('.sb-section:not(.ref-layout-section)')){
      original.classList.add('ref-layout-original-hidden');
    }
    // The ribbon is a single reference node; move it, do not duplicate XP.
    const ribbon=document.getElementById('total-level-ribbon');
    if(ribbon){
      const home=wrap.querySelector('[data-ref-group="home"] .ref-layout-section-content');
      home?.prepend(ribbon);
    }
    // Preserve the real Combat Level chip and keep its ID intact.
    const cl=document.getElementById('sb-combat-lv');
    if(cl){
      const heading=wrap.querySelector('[data-ref-group="combat"] .ref-layout-heading');
      heading?.append(cl);
    }
    const charPanel=sidebar.querySelector('.char-panel');
    if(charPanel)charPanel.insertAdjacentElement('afterend',wrap);
    else sidebar.prepend(wrap);
    const style=document.createElement('style');
    style.textContent=`
      .ref-layout-original-hidden{display:none!important}
      #ref-layout-wrap{padding-bottom:18px}
      #ref-layout-wrap .ref-layout-info{padding:9px 12px;margin:8px 9px 12px;border:1px solid #816a43;border-radius:6px;color:#ead4a9;font-size:10px;line-height:1.5;background:#302817}
      #ref-layout-wrap .ref-layout-section{margin:0 0 6px;padding:0}
      #ref-layout-wrap .ref-layout-heading{display:flex;align-items:center;justify-content:space-between;width:100%;padding:11px 11px 8px;margin:0;background:none;border:0;border-bottom:1px solid #5f4d37;color:#e4c58c;text-align:left;font-size:12px;font-weight:750;cursor:pointer;letter-spacing:.02em}
      #ref-layout-wrap .ref-layout-heading:focus-visible{outline:2px solid #f5dba7}
      #ref-layout-wrap .ref-layout-section-content[hidden]{display:none!important}
      #ref-layout-wrap .ref-layout-shortcut{color:#e0c793;font-size:11px}
      #ref-layout-wrap .ref-layout-mark{display:inline-grid;place-items:center;width:28px;flex:0 0 28px}
      #ref-layout-wrap .sb-combat-lv-chip{margin-left:auto}
    `;
    document.head.append(style);
    console.info('Organisation d’essai des ateliers activée — écrans et boutons originaux réutilisés.');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
