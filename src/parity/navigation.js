/**
 * Organisation des lieux de L'Éclipse Blanche.
 * Une compétence conserve son identifiant canonique et son XP même si plusieurs
 * ateliers donnent accès à ses recettes. Le menu n'est PAS le moteur de règles.
 * Les actions non réalisées ne sont jamais présentées comme fonctionnelles.
 */
export const WORKSHOPS = Object.freeze([
  {id:'overview',label:'Vue générale',subtitle:'Compétences et premières activités',icon:'◈',skills:[],preview:[]},
  {id:'combat',label:'Combat & Donjons',subtitle:'Mêlée, distance, magie, défense et santé',icon:'⚔',skills:['melee','range','magic','defence','hitpoints'],preview:['Monstres, donjons et boss','Styles, protections et butins']},
  {id:'resources',label:'Ressources & Fonderie',subtitle:'Extraction, bûcheronnage et lingots',icon:'⚒',skills:['mining','woodcutting','smithing'],preview:['Minerais → lingots','Bûches → ressources de fabrication']},
  {id:'armory',label:'Armurerie',subtitle:'Métallurgie, artisanat, arcs et flèches',icon:'♜',skills:['smithing','crafting','fletching'],preview:['Fabriquer depuis l’objet final','Armes, armures, arcs, flèches et améliorations']},
  {id:'kitchen',label:'Pêche & Cuisine',subtitle:'Récolter, préparer, se nourrir',icon:'≈',skills:['fishing','cooking'],preview:['Cuisine et soins','Recettes et consommables']},
  {id:'garden',label:'Culture & Alchimie',subtitle:'Culture, ingrédients et préparations',icon:'❀',skills:['cultivating'],preview:['Potions et préparations','Culture et récolte']},
  {id:'rituals',label:'Feux & Rituels',subtitle:'Allumage, crémation et protections',icon:'♨',skills:['firemaking','cremation'],preview:['Feux à partir de bûches brutes','Charges de crémation et prières']},
  {id:'hunting',label:'Chasse & Contrats',subtitle:'Contrats, monstres et récompenses',icon:'⌖',skills:['hunting'],preview:['Contrats et faits d’armes','Récompenses et collection']},
  {id:'shadows',label:'Larcins',subtitle:'Vol, risques et récompenses',icon:'◉',skills:['thieving'],preview:['Échoppes et vols','Risques et gardes']},
]);
export function workshopById(id) { return WORKSHOPS.find(w => w.id===id) || WORKSHOPS[0]; }
export function skillInWorkshop(workshopId,skillId) {
 const w=workshopById(workshopId);
 return w.id==='overview' || w.skills.includes(skillId);
}
