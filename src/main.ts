import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Racine de l'application introuvable");
app.innerHTML = `<main><p class="eyebrow">Projet RPG</p><h1>L’Éclipse Blanche</h1><p>Le socle de développement est en place. Les systèmes de jeu et l'univers interactif seront intégrés progressivement.</p><p class="note">Version de développement — aucun système de jeu n'est encore implémenté.</p></main>`;
