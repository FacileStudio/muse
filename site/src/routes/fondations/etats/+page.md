# États

Deux familles, et les confondre est la source de la moitié des interfaces incohérentes : les
états **déclenchés par l'utilisateur** (survol, appui, focus clavier) et les états **déclarés
par le composant** (désactivé, sélectionné, en cours, en erreur).

## Déclenchés par l'utilisateur

| État | Règle |
|---|---|
| Survol | monte d'un cran de surface — jamais une teinte |
| Appui | `springPress`, un creux à 0.997 sur 70ms |
| Focus clavier | **un seul anneau, partout** : `focus-visible:outline-2 outline-offset-2 outline-fc-ring` |

L'anneau de focus n'est pas négociable et ne se personnalise pas par composant. Un anneau par
système, c'est ce qui rend la navigation clavier lisible d'une app à l'autre.

## Déclarés par le composant

**Chargement.** `Spinner` pour une attente courte, `Skeleton` pour une forme qui va se remplir.
Sous *reduced motion*, `Spinner` ralentit à un tour toutes les trois secondes — il ne se fige
pas. Un indicateur d'activité figé n'indique rien, ce qui est pire que le mouvement qu'il
évitait. `Skeleton` et `StatusDot` se cachent franchement, parce que leur absence se lit
correctement.

**Vide.** Une liste sans contenu est un `EmptyState`, pas un paragraphe. La hauteur est le
sujet : une carte de deux lignes là où une liste devrait être se lit comme une panne de rendu ;
une carte haute et calme se lit comme voulu.

**Erreur.** `Alert` pour ce qui reste à l'écran, `toast` pour ce qui passe. Un retour sans
question dedans — « Enregistré », « Sync échouée » — est un toast, jamais une modale.

**Désactivé.** `opacity-50` et le curseur, jamais un composant retiré du DOM : une action qui
disparaît laisse l'utilisateur chercher ce qu'il a cassé.

## Le cas qu'on oublie

Un `Switch` lié à rien est un rapport de bug qui attend. Une section pour laquelle l'app n'a pas
de back-end se rend en faits honnêtes — `StatusDot` et du texte — pas en interrupteurs qui ne
persistent nulle part.
