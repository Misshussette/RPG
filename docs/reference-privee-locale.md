# Référence privée locale — atelier de comparaison

**But :** permettre de parcourir et tester localement **l'intégralité du HTML et du JavaScript fourni par le créateur**, avant la reconstruction complète de ses comportements dans notre jeu React/Node/PostgreSQL. C'est une référence de comparaison, **pas** une version React, pas une application serveur autoritaire et pas un multijoueur. Ne jamais importer ses sauvegardes dans notre base partagée.

## Démarrage le plus simple (archive privée préparée)

1. Ouvrir PowerShell dans `F:\Eclipse_Blanche` et récupérer les scripts :

   ```powershell
   $env:Path += ";C:\Program Files\Git\cmd"
   git pull --ff-only origin main
   ```

2. Télécharger l'archive privée fournie dans la conversation : `Eclipse_Blanche_Reference_Privee.zip`. Ce fichier ne se trouve **pas sur GitHub**.
3. Décompresser l'archive dans `F:\Eclipse_Blanche` :

   ```powershell
   Expand-Archive -LiteralPath "$env:USERPROFILE\Downloads\Eclipse_Blanche_Reference_Privee.zip" -DestinationPath 'F:\Eclipse_Blanche' -Force
   ```

   Cela crée uniquement `F:\Eclipse_Blanche\private-reference\index.html` et son README. L'ancien projet et PostgreSQL ne sont pas modifiés. Le dossier privé est dans `.gitignore`.

4. Lancer :

   ```powershell
   npm run reference:dev
   ```

5. Ouvrir **http://127.0.0.1:4174/** dans le navigateur. Le serveur est lié uniquement à `127.0.0.1` (pas au réseau local).

## Importer soi-même une archive ZIP source

Si le ZIP de l'application d'étude est présent sur le PC, l'importer directement sans passer par l'archive préparée :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\import-reference.ps1 -Archive 'C:\CHEMIN\mon-archive-source.zip'
```

Le script recherche le HTML principal et le place **dans le dossier privé non versionné**. Si le ZIP contient un dossier `assets`, il le copie également. Pour fournir les images d'une installation locale séparée :

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\import-reference.ps1 -Archive 'C:\CHEMIN\mon-archive-source.zip' -AssetsDirectory 'C:\CHEMIN\assets'
```

### Limitation graphique connue

L'archive actuellement disponible contient l'HTML/JS, mais **pas le dossier complet des images**. Une partie des icônes et illustrations manquera donc jusqu'à ajout de `private-reference/assets`. Pour constater le nombre de ressources statiques absentes :

```powershell
npm run reference:assets
```

## Comparer correctement

| Adresse | Fonction | Source de vérité |
|---|---|---|
| `http://127.0.0.1:4174/` | Référence privée telle que fournie, pour comparaison | Sauvegarde **locale navigateur uniquement** |
| `http://localhost:5173/parity.html` | Notre réimplémentation React 0.3.x | **API Node + PostgreSQL** |

- **Ne pas** transférer les sauvegardes de la référence locale vers le multijoueur.
- **Ne pas** publier ou committer le contenu du dossier privé. Il peut relever de droits tiers.
- La référence conserve ses comportements d'origine, y compris d'éventuels défauts et limitations. Une copie locale n'est ni sécurisée contre la triche ni adaptée au multijoueur.
- Chaque fonctionnalité sera reconstruite dans le serveur autoritaire et sa parité validée par des tests. L'objectif est une parité **fonctionnelle**, pas la republication du code original dans le dépôt.