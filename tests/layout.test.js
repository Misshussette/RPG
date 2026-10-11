import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('l’interface conserve l’inventaire latéral et le journal chronologique', () => {
 const js=source('src/main.js');
 assert.match(js, /function sideInventory\(\)/);
 assert.match(js, /\$\{sideInventory\(\)\}/);
 assert.match(js, /\.slice\(0, 35\)\.reverse\(\)/);
 assert.match(js, /id="journal-feed"/);
 assert.match(js, /journal\.scrollTop = journal\.scrollHeight/);
});
test('le combat est une arène compacte et responsive',()=>{
 const js=source('src/main.js');const css=source('src/style.css');
 assert.match(js,/class="combat-shell"/);
 assert.match(js,/class="fighters"/);
 assert.match(js,/class="fighter fighter-hero"/);
 assert.match(js,/class="fighter fighter-enemy"/);
 assert.match(css,/@media\(max-width:650px\)/);
 assert.match(css,/\.combat-shell\{display:flex;flex-direction:column\}/);
});
test('le logo officiel du jeu est dans les ressources',()=>{
 const js=source('src/main.js');const logo=source('public/logo-eclipse.svg');
 assert.match(js,/logo-eclipse\.svg/);
 assert.match(logo,/data:image\/webp;base64,/);
 assert.match(logo,/<svg/);
});