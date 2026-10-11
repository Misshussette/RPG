/**
 * Private, local-only comparison server for the user's reference material.
 * No user-provided application files are committed to this repository.
 * This is NOT the React/authoritative multiplayer game.
 */
import http from 'node:http';
import { createReadStream, existsSync, statSync, readFileSync } from 'node:fs';
import { resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = resolve(projectRoot, 'private-reference');
const port = Number(process.env.REFERENCE_PORT || 4174);
const address = '127.0.0.1';
const mime = new Map(Object.entries({
  '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif',
  '.ico':'image/x-icon', '.woff2':'font/woff2', '.woff':'font/woff',
  '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.wav':'audio/wav',
}));

if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('REFERENCE_PORT invalide.');
const indexFile = resolve(sourceRoot, 'index.html');
if (!existsSync(indexFile)) {
  console.error('Référence privée absente. Exécuter d’abord :');
  console.error('  powershell -ExecutionPolicy Bypass -File scripts/import-reference.ps1 -Archive "CHEMIN\\eclipse-sources.zip"');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
  }
  let pathname, layout;
  try {
    const requested=new URL(req.url, `http://${address}:${port}`);
    pathname=decodeURIComponent(requested.pathname);
    layout=requested.searchParams.get('layout')==='ateliers';
  }
  catch { res.writeHead(400); res.end(); return; }
  if (pathname.includes('\0') || pathname.includes('\\')) { res.writeHead(400); res.end(); return; }
  const overlayRequest = pathname === '/__reference-ateliers.js';
  let target = overlayRequest
    ? resolve(projectRoot, 'scripts/reference-ateliers.js')
    : resolve(sourceRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
  const rel = relative(sourceRoot, target);
  if (!overlayRequest && (rel === '..' || rel.startsWith('..' + sep) || rel.startsWith('/'))) { res.writeHead(403); res.end(); return; }
  if (!existsSync(target) || !statSync(target).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Fichier de référence introuvable : ${pathname}\nLes images peuvent être absentes de l'archive HTML.\n`); return;
  }
  const headers = {
    'Content-Type': mime.get(extname(target).toLowerCase()) || 'application/octet-stream',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    // Reference HTML contains inline JS/CSS. Permit it locally, but forbid remote APIs.
    'Content-Security-Policy': "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; media-src 'self' data: blob:; object-src 'none'; base-uri 'self'; form-action 'self'",
  };
  // Optional UI-only layout on the SAME origin (same private local save).
  // Reference file is never modified. Only the response to ?layout=ateliers is decorated.
  if (layout && (pathname === '/' || pathname === '/index.html')) {
    const original=readFileSync(target,'utf8');
    const injection='<script defer src="/__reference-ateliers.js"></script>';
    const rendered=original.replace(/<\/body>/i, injection+'</body>');
    res.writeHead(200, headers);
    if (req.method === 'HEAD') { res.end(); return; }
    res.end(rendered);
    return;
  }
  res.writeHead(200, headers);
  if (req.method === 'HEAD') { res.end(); return; }
  createReadStream(target).on('error', () => res.destroy()).pipe(res);
});
server.requestTimeout = 10_000;
server.listen(port, address, () => {
  console.log(`Référence PRIVÉE en lecture/jeu local : http://${address}:${port}/`);
  console.log('Organisation optionnelle des menus : http://127.0.0.1:'+port+'/?layout=ateliers');
  console.log('Aucune connexion à PostgreSQL, aucun multijoueur. Ne pas exposer ce port sur le réseau.');
});