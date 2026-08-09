# Pour les agents

Les agents écrivent une grande partie du code de la suite. Ce site est écrit pour eux autant
que pour les humains, et le constat qui gouverne tout le reste :

> Un agent grep l'espace de travail et imite ce qu'il trouve. Si le fichier de règles dit
> « utilise des tokens sémantiques » et que les fichiers existants contiennent des hex en dur,
> **ce sont les hex qui gagnent.**

Votre pire fichier est votre vrai guide de style. C'est pourquoi muse déplace ses règles dans le
harnais dès qu'il le peut.

## Le corpus lisible par machine

| Ressource | Ce que c'est |
|---|---|
| `/llms.txt` | l'index du site, une ligne par page |
| `/llms-full.txt` | le corpus entier en un seul fichier |
| `<page>.md` | la source markdown de chaque page, au même chemin suffixé `.md` |

Ces fichiers sont générés depuis le même markdown que le site rend. Ils ne peuvent pas diverger
de la documentation, parce qu'ils *sont* la documentation.

## La skill

`install.sh` enregistre muse comme skill pour Claude Code et Codex. Elle est générée, pas
maintenue à la main — et cette précision a un coût derrière elle.

La copie installée sur une machine avait été **réécrite sur place**, ramenée de 274 à 56 lignes.
Elle ne correspondait à aucune révision publiée du dépôt. Ce qu'elle avait perdu : le catalogue
des composants, la liste de décision, et **toutes les phrases sur l'espacement**. Le fichier
garanti d'être dans le contexte de l'agent avait perdu exactement la partie qui manquait.

`install.sh` signale désormais quand il remplace une skill modifiée, et `--local` installe
depuis un checkout pour que « je vais juste corriger ça sur place » cesse d'être tentant.

## Les dix règles qui évitent 90 % des sorties fausses

1. **Réutilisez avant de construire.** Lisez le barrel. 53 composants existent.
2. **Un composant possède son padding, jamais sa marge.** Un test casse le build sinon.
3. **Le `gap` prend un barreau nommé** : `bound` · `tight` · `content` · `section`.
4. **`Page` / `PageHeader` / `Section` / `Stack` / `Inline`** — ne reconstruisez pas de coquille
   de page à la main. Huit apps l'ont fait, avec huit résultats différents.
5. **Aucune couleur hors système n'existe.** `bg-red-500` ne génère rien.
6. **Ne passez jamais `bg-`, `border` ou `rounded-` à un composant muse.** `twMerge` fait gagner
   l'override en silence et supprime l'identité du composant.
7. **Un bouton sur la même ligne qu'un champ prend `size="lg"`**, sinon la ligne est à 8px.
8. **Svelte 5 runes uniquement.** Pas de `export let`.
9. **`prefers-reduced-motion` sur toute animation**, et `100dvh` jamais `100vh`.
10. **Cibles tactiles ≥ 44px**, plancher à 360px de large.

## Une chose que le harnais ne peut pas rattraper

La skill `frontend-design` livrée avec Claude Code pousse le modèle à inventer « un système de
tokens compact » par projet, et **ne mentionne jamais de vérifier s'il existe déjà une
bibliothèque de composants**. Dans un dépôt Facile, elle travaille contre muse tant que le
`CLAUDE.md` du projet ne l'annule pas explicitement.
