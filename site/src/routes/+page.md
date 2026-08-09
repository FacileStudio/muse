# muse

muse est le système de design de Facile Studio. Treize applications s'en servent, et la
promesse produit de la suite — *un seul login, zéro dépendance cloud* — ne tient que si elles
se ressemblent vraiment.

Ce n'est donc pas un catalogue de composants avec un thème par-dessus. C'est **le seul artefact
partagé qui décide à quoi ressemble un produit Facile**, et ce qui suit compte autant que la
liste des composants : comment une page est structurée, comment elle respire, où va chaque
chose.

## Deux lecteurs, un seul corpus

Ce site est lu par des humains et par des agents. Les deux écrivent du code Facile, et le
constat est net : **un agent imite ce qu'il trouve dans le dépôt, pas ce qu'on lui a dit.**

> Si le fichier de règles dit « utilise toujours des tokens sémantiques » mais que les fichiers
> existants contiennent des hex en dur, ce sont les hex qui gagnent.

C'est pour ça que le système enferme ses règles dans du code plutôt que dans de la prose,
partout où c'est possible :

- La palette Tailwind est **supprimée**. `bg-red-500` ne génère aucun CSS. Une couleur hors
  système n'est pas une règle à retenir, c'est une classe qui ne produit rien.
- Un test parse chaque composant et **casse le build** sur une marge extérieure.
- Un autre extrait chaque `<label for>` du HTML rendu et échoue s'il pointe dans le vide.

La documentation explique ; le harnais refuse. Quand les deux divergent, c'est le harnais qui
a raison.

## Par où entrer

**Vous concevez une page** → [Anatomie d'une app Facile](/structure/anatomie), puis
[Espacement & rythme](/fondations/espacement). Ces deux pages couvrent la majorité de ce qui
divergeait entre les treize apps.

**Vous cherchez un composant** → [Tous les composants](/composants).

**Vous êtes un agent** → [Pour les agents](/commencer/agents).
