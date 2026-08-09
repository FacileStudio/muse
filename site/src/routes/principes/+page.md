# Principes

Quatre. Un principe n'est utile que si l'on peut nommer une proposition qu'il **rejette** —
« mettre l'utilisateur au centre » n'en rejette aucune et ne mérite pas sa place.

## 1. Le harnais refuse, la documentation explique

Une règle qu'un lecteur peut sauter n'est pas une règle. Partout où une contrainte peut vivre
dans du code, elle y vit : la palette Tailwind est supprimée plutôt que déconseillée, la marge
extérieure casse le build plutôt que d'apparaître dans une revue, un `<label for>` orphelin
échoue au smoke test.

- *Rejette* : « on documentera la convention dans la charte ». La charte disait déjà la bonne
  chose sur l'espacement, et treize apps ont divergé quand même.
- *Rejette* : ajouter une règle de lint pour un défaut qu'un défaut de composant peut éliminer.

## 2. Adopter le look de muse, ou ne pas adopter muse

Un composant muse reçoit des classes de mise en page — `h-full`, `flex-1`, `min-w-0`. Il ne
reçoit pas de classes visuelles. `bg-`, `border`, `rounded-` sur un composant muse suppriment
son identité en silence, parce que `twMerge` fait gagner l'override proprement.

- *Rejette* : donner `rounded-none border-r bg-background` à un `SideBar` pour préserver
  l'ancien design d'une app. C'est arrivé, tous les contrôles étaient verts, et le rail flottant
  avait disparu.

## 3. L'espace entre deux choses appartient à ce qui les contient

Un composant possède son padding, jamais sa marge. Les frères sont espacés par le `gap` du
parent, à l'un des quatre barreaux nommés.

- *Rejette* : `class="mt-4"` sur un composant pour l'écarter du précédent.
- *Rejette* : ajouter une prop d'espacement à un composant de contenu pour régler un cas de
  serrage. C'est comme ça qu'on obtient le `sx` de Primer, puis sa suppression cinq ans plus
  tard.

## 4. Ne pas pouvoir vérifier est une raison de refuser

Repris du noyau d'authentification de la suite, et vrai ici aussi. Un composant qui ne peut pas
prouver qu'il est correct ne doit pas prétendre l'être : `Avatar` supprime son image quand elle
échoue au lieu de peindre son `alt` par-dessus, et `SecretField` traite une valeur rédigée
comme « le serveur l'a gardée », pas comme une valeur.

- *Rejette* : un état de chargement qui n'indique rien. `Spinner` sous *reduced motion*
  ralentit à un tour toutes les trois secondes ; il ne se fige pas.

---

## Ce qui n'est pas un principe ici

**Chroma-zéro, états actifs inversés, conteneurs sans bordure, Goga, icônes Solar `linear`.**
Ce sont des décisions de charte, pas des principes : elles décrivent à quoi la suite ressemble,
pas comment on tranche un arbitrage. Elles vivent dans [Couleur](/fondations/couleur) et
[Typographie](/fondations/typographie).
