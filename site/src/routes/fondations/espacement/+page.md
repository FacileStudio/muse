<script lang="ts">
    import { Button, Card, Divider, Stack } from '@facile/muse';
    import Preview from '$lib/prose/Preview.svelte';
</script>

# Espacement & rythme

**Un composant possède son padding, jamais sa marge.** L'espace entre deux éléments est une
propriété de la relation entre eux : il appartient à ce qui les contient.

Ce n'est pas une recommandation. `no-outer-margin.test.ts` parse chaque composant de la
bibliothèque et casse le build sur un utilitaire de marge posé sur un élément racine — `auto`
et zéro exceptés.

## Pourquoi la règle existe

muse a livré exactement un composant qui l'enfreignait. `Divider` portait `my-4`. Les
**vingt-quatre** appels de la suite l'annulaient avec `class="my-0"`, muse l'annulait deux fois
dans son propre `ProfileCard`, et la charte enseignait le contournement comme l'idiome.

Sorti de son parent flex, cet exemple soude le trait à ce qui le précède. C'est très
exactement le « bouton collé au séparateur » que les pages écrites par des agents produisaient
en boucle. **Un défaut qu'aucun appel ne veut n'est pas un défaut : c'est un bug.**

## Le voir plutôt que le lire

Les deux panneaux ci-dessous rendent le même contenu. Celui de gauche est ce que produit un
flux de blocs sans conteneur qui possède l'espace.

<div class="grid gap-4 lg:grid-cols-2">
<Preview verdict="bad" label="Aucun parent ne possède l'espace">
  <div>
    <h3 class="text-fc-md font-semibold text-fc-fg">Zone de danger</h3>
    <p class="text-fc-sm text-fc-fg-muted">Supprimer cet espace est définitif.</p>
    <Divider />
    <Button variant="danger" size="sm">Supprimer l'espace</Button>
  </div>
</Preview>

<Preview verdict="good" label={'Stack gap="content"'}>
  <Stack gap="content">
    <Stack gap="bound">
      <h3 class="text-fc-md font-semibold text-fc-fg">Zone de danger</h3>
      <p class="text-fc-sm text-fc-fg-muted">Supprimer cet espace est définitif.</p>
    </Stack>
    <Divider />
    <Button variant="danger" size="sm" class="w-fit">Supprimer l'espace</Button>
  </Stack>
</Preview>
</div>

Le titre et sa description sont liés par `bound`, pas par le gap de la section : ce sont deux
morceaux d'une même chose, pas deux frères.

### La gouttière trop serrée

<div class="grid gap-4 lg:grid-cols-2">
<Preview verdict="bad" label="gap-3 autour de cartes p-5">
  <div class="grid grid-cols-3 gap-3">
    <Card class="flex flex-col gap-1"><span class="text-fc-xs text-fc-fg-muted">Actives</span><span class="text-fc-xl font-semibold text-fc-fg">12</span></Card>
    <Card class="flex flex-col gap-1"><span class="text-fc-xs text-fc-fg-muted">En pause</span><span class="text-fc-xl font-semibold text-fc-fg">3</span></Card>
    <Card class="flex flex-col gap-1"><span class="text-fc-xs text-fc-fg-muted">Archivées</span><span class="text-fc-xl font-semibold text-fc-fg">27</span></Card>
  </div>
</Preview>

<Preview verdict="good" label="gap-4 — content">
  <div class="grid grid-cols-3 gap-4">
    <Card class="flex flex-col gap-1"><span class="text-fc-xs text-fc-fg-muted">Actives</span><span class="text-fc-xl font-semibold text-fc-fg">12</span></Card>
    <Card class="flex flex-col gap-1"><span class="text-fc-xs text-fc-fg-muted">En pause</span><span class="text-fc-xl font-semibold text-fc-fg">3</span></Card>
    <Card class="flex flex-col gap-1"><span class="text-fc-xs text-fc-fg-muted">Archivées</span><span class="text-fc-xl font-semibold text-fc-fg">27</span></Card>
  </div>
</Preview>
</div>

## Les quatre barreaux

Le `gap` ne prend pas un nombre, il prend un barreau nommé — parce que la question sur une page
n'est jamais « combien de pixels » mais « est-ce que ces deux choses sont la même chose ».

| Barreau | Valeur | Deux choses qui sont… |
|---|---|---|
| `bound` | 4px | deux morceaux d'**une** seule chose — un titre et sa description |
| `tight` | 8px | utilisées ensemble — les boutons d'une barre d'actions |
| `content` | 16px | des frères dans un bloc — les éléments d'une carte, les cartes d'une grille |
| `section` | 40px | des sujets distincts — une section de page et la suivante |

Il n'y a **délibérément rien** entre `content` et `section`. « Lié, mais un peu moins » est la
distinction que personne n'applique deux fois de la même façon, et c'est d'où venaient les trois
gaps de colonne différents de la suite. Une mise en page qui a vraiment besoin de 24px écrit
`class="gap-6"`, et ça se lit comme l'exception que c'est.

## Les composants qui portent le rythme

```svelte
<Page width="xl">
  <PageHeader title="Stockage" description="Sur tous vos espaces." />

  <Section title="Usage">
    <div class="grid gap-4 lg:grid-cols-2">…</div>
  </Section>
</Page>
```

| Composant | Possède |
|---|---|
| `Page` | le centrage, la largeur maximale, le padding extérieur, le rythme entre sections |
| `PageHeader` | le bloc `h1`, la description, les actions, le lien retour |
| `Section` | un bloc `h2` et son corps, avec `card` optionnel |
| `Stack` | une colonne à un barreau donné |
| `Inline` | une ligne qui passe à la ligne, à un barreau donné |

`Page` se place **à l'intérieur** du conteneur de défilement de la coquille : la coquille garde
le rail, la nav mobile et l'unique scroller ; `Page` possède tout ce qui est en deçà du bord du
contenu. C'est cette séparation qui permet à un tableau de bord de prendre `width="xl"` pendant
qu'une page de lecture garde `lg`.

## La gouttière et le padding

Le padding n'est pas un barreau : ce n'est pas une relation, c'est le retrait interne d'un
conteneur. `Card` est à `p-5` (20px), et ça interagit avec les gouttières autour.

**Une gouttière ne peut jamais être plus serrée que le padding des cartes qu'elle sépare.** Des
tableaux de bord tournaient ici avec des gouttières `gap-3` autour de cartes `p-4` : trois
cartes statistiques se lisaient comme un seul panneau à coutures.

## Le cas que la charte avait oublié

`Input`, `Select`, `Textarea` et `SecretField` sont tous en `h-11` (44px). `Button` est en
`h-9` (36px) par défaut, et c'est **volontaire** — la densité bureau que la suite assume.

Mais un bouton posé **sur la même ligne** qu'un de ces contrôles est 8px trop court, et la ligne
se lit comme une erreur. C'est de l'alignement, pas de la densité, et la réponse est
`size="lg"` sur le bouton :

```svelte
<form class="flex flex-col gap-3 sm:flex-row">
  <Input class="flex-1" />
  <Button size="lg">Envoyer l'invitation</Button>
</form>
```

Le formulaire d'invitation de muse lui-même enfreignait cette règle jusqu'à la v0.6.0, et
**36 endroits** dans la suite l'enfreignent encore. Un bouton *empilé sous* un champ garde le
défaut : la règle ne concerne que les frères sur une ligne.

## L'échelle sous-jacente

Grille de 4pt, fournie par l'échelle d'espacement de Tailwind. muse ne définit **aucun** token
`--fc-space-*` et n'en a pas besoin : les barreaux sont des noms pour des valeurs qui existent
déjà.

Les deux seules valeurs que le thème ajoute sont celles dont dépend la géométrie du rail, parce
qu'elles sont verrouillées avec l'animation de largeur du `SideBar` et ne se choisissent pas
librement : `--spacing-fc-nav-item` (44px) et `--spacing-fc-nav-content` (196px).
