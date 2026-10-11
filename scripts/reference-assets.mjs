/** Local-only inventory of external assets referenced by the user's private HTML. */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../private-reference/', import.meta.url)));
const htmlFile = resolve(root, 'index.html');
if (!existsSync(htmlFile)) { console.error('Référence absente : importer l’archive privée d’abord.'); process.exitCode = 1; }
else {
  const html = readFileSync(htmlFile, 'utf8');
  const assets = [...new Set(html.match(/assets\/[\w./-]+\.(?:png|jpg|jpeg|webp|svg|gif|ogg|mp3|wav)/gi) || [])].sort();
  const missing = assets.filter(asset => !existsSync(resolve(root, asset)));
  console.log(`Références graphiques/audio statiques : ${assets.length}`);
  console.log(`Fichiers disponibles : ${assets.length - missing.length}`);
  console.log(`Fichiers manquants : ${missing.length}`);
  if (missing.length) {
    console.log('Premiers fichiers manquants :');
    for (const item of missing.slice(0, 10)) console.log(` - ${item}`);
    console.log('Pour compléter les visuels, recopier le dossier assets original dans private-reference/assets.');
  }
}