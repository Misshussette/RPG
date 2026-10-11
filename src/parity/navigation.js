/**
 * Architecture d'information sourcée des panneaux de la référence privée.
 * IDs et compétences canoniques indépendants du regroupement des menus.
 * Les capacités de référence ci-dessous ne sont PAS des fonctionnalités API.
 */
const feature=(label,reference,detail)=>({label,reference,detail});
export const WORKSHOPS=Object.freeze([
{id:'overview',label:'Vue générale',subtitle:'Vue du personnage et accès au monde',icon:'◈',skills:[],features:[
feature('Progression','home','Personnage, progression, factions et aperçu du monde')]},
{id:'combat',label:'Combat & Donjons',subtitle:'Styles, protections, monstres et rencontres',icon:'⚔',skills:['melee','range','magic','defence','hitpoints'],features:[
feature('Combats','combat','Mêlée, distance, magie et défense ; ennemis, tours, santé et butins'),
feature('Donjons','dungeon','Enchaînements de combats et récompenses'),
feature('Boss mondiaux','worldboss','Rencontres spéciales et contributions, futur vrai multijoueur')]},
{id:'resources',label:'Ressources & Fonderie',subtitle:'Extraire, couper, fondre puis transformer',icon:'⚒',skills:['mining','woodcutting','smithing'],features:[
feature('Extraction','mining','Gisements, minerais et pioche'),
feature('Bûcheronnage','woodcutting','Arbres, bûches et hache ; bûches utilisables sans transformation pour les feux'),
feature('Fonderie','smithing:smelt','Minerais → lingots ; vérifier les stocks existants avant de récolter')]},
{id:'armory',label:'Armurerie',subtitle:'Fabriquer armes, armures, arcs, flèches et accessoires',icon:'♜',skills:['smithing','crafting','fletching'],features:[
feature('Équipements métalliques','smithing:gear','Fabrication par métal : bronze, étain/bronze, fer, argent, rubis, émeraude, diamant'),
feature('Arcs et flèches','fletching','Fabrication des arcs et des projectiles (deux sous-onglets dans la référence)'),
feature('Artisanat','crafting','Bâtons, cuir, tissu, anneaux et amulettes ; conserver toutes les recettes'),
feature('Renforcer / Réparer','blacksmith','Forgeron distinct de la fonderie ; renforcement et future usure de mêlée'),
feature('Commande complète','planned:craft-chain','Choisir l’objet final ; utiliser lingots, minerais, bois et or déjà en stock avant de produire le manque')]},
{id:'kitchen',label:'Pêche & Cuisine',subtitle:'Pêcher, cuisiner et préparer les soins',icon:'≈',skills:['fishing','cooking'],features:[
feature('Pêche','fishing','Prises et canne à pêche'),
feature('Cuisine','cooking','Transformation en nourriture et soins')]},
{id:'garden',label:'Culture & Alchimie',subtitle:'Cultiver, récolter et préparer',icon:'❀',skills:['cultivating'],features:[
feature('Cultures','cultivating:farm','Semis, soins des cultures et récoltes'),
feature('Préparations','cultivating:process','Transformation des cultures ; potions et terminologie à retravailler')]},
{id:'rituals',label:'Feux & Rituels',subtitle:'Allumage, crémation et protections',icon:'♨',skills:['firemaking','cremation'],features:[
feature('Feux','firemaking','Allumer directement des bûches brutes ; effets et bonus de feu'),
feature('Crémation','cremation','Os, charges de protection et prières')]},
{id:'hunting',label:'Chasse & Contrats',subtitle:'Objectifs de chasse et boutique dédiée',icon:'⌖',skills:['hunting'],features:[
feature('Contrats monstres','hunting:monsters','Objectifs de chasse et progression'),
feature('Contrats donjons','hunting:dungeons','Objectifs liés aux donjons'),
feature('Boutique de chasse','hunting:store','Échange de points ou récompenses de chasse')]},
{id:'shadows',label:'Larcins',subtitle:'Vol et risques associés',icon:'◉',skills:['thieving'],features:[
feature('Vol','thieving','Échoppes, gardes, taux de réussite et butins')]},
{id:'economy',label:'Marché & Banque',subtitle:'Commerçants, dépôt, équipement et économie',icon:'◉',skills:[],features:[
feature('Marché et vendeurs','shop','Boutique générale, boutique des artisans, fournitures spéciales, marchand itinérant'),
feature('Banque','bank','Dépôt, retrait, recherche, tris et onglets de banque'),
feature('Équipement','inventory','Inventaire porté, objets, présélections et emplacements'),
feature('Améliorations','upgrades','Améliorations et achats persistants'),
feature('Enchères / échanges','planned:market','Marché entre joueurs, prix et anti-abus à concevoir')]},
{id:'metagame',label:'Forge & Progression',subtitle:'Forge éternelle, quêtes, collection et Renaissances',icon:'✧',skills:[],features:[
feature('Forge éternelle','eternal-forge','Échos, améliorations, sceaux et coffres ; ne pas confondre avec le forgeron'),
feature('Quêtes et histoire','reference:quests','Progression narrative, chapitres et objectifs'),
feature('Succès et collection','reference:codex','Découvertes, réalisations et Codex'),
feature('Familiers et factions','reference:pets-factions','Bonus, affinités et progression'),
feature('Renaissance','planned:rebirth','Défis variés et capacités débloquées suivant les R ; modalités à valider')]},
]);
export function workshopById(id){return WORKSHOPS.find(w=>w.id===id)||WORKSHOPS[0]}
export function skillInWorkshop(workshopId,skillId){const w=workshopById(workshopId);return w.id==='overview'||w.skills.includes(skillId)}
export function featureByRef(reference){for(const w of WORKSHOPS){const f=w.features.find(x=>x.reference===reference);if(f)return {...f,workshopId:w.id}}return null}
