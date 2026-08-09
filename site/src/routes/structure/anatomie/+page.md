# Anatomie d'une app Facile

Toutes les apps de la suite partagent la même coquille. Ce n'est pas une préférence esthétique :
c'est ce qui fait qu'un utilisateur qui passe de Sablier à Casier n'a rien à réapprendre.

## Les trois zones

```svelte
<div class="flex h-dvh w-full overflow-hidden bg-fc-page">
  <div class="hidden h-full shrink-0 p-3 md:block">
    <SideBar {pages} {spaces} {user} userHref="/settings" class="h-full" />
  </div>

  <main class="min-w-0 flex-1 overflow-auto overscroll-contain pb-28 md:pb-0">
    <Page>…</Page>
  </main>

  <MobileNav items={pages} {user} profileHref="/settings" />
</div>
```

**Le rail** (`SideBar`) est une carte flottante dans une gouttière `p-3`, pas un panneau collé
au bord. Il porte la navigation, le sélecteur d'espace et la carte utilisateur. Bureau
uniquement.

**Le contenu** (`<main>`) est **l'unique conteneur de défilement de l'application**. C'est une
contrainte, pas un détail : `overscroll-contain` existe parce que sans lui un glissement passé
la fin remonte dans le document et décolle toute la coquille du haut de la fenêtre.

**La nav mobile** (`MobileNav`) est la barre-pilule flottante en `md:hidden`. Quatre entrées
tiennent au plancher documenté de 360px ; au-delà, la bande défile.

## Ce que la coquille ne possède pas

Elle ne possède **pas** la colonne de page. Chaque route rend son propre `<Page>`, ce qui laisse
un tableau de bord prendre `width="xl"` (1200px) pendant qu'une page de réglages garde `lg`
(960px).

C'était la principale divergence de la suite : huit conteneurs de page différents, avec des
largeurs maximales allant de `fc-md` à `max-w-7xl` — quatre apps ignorant complètement
l'échelle `fc-*`.

## Les réglages ne sont pas dans la nav

**N'ajoutez jamais une entrée Réglages à la liste de navigation du rail.** La carte utilisateur
en bas du rail est la seule entrée — `SideBar` `userHref` / `userActive`, et `MobileNav`
`profileHref`. La déconnexion vit dans les réglages, pas dans le rail.

## Un seul `Toaster`, monté à la racine

Monté à côté de la coquille et non dans une page, pour qu'un changement de route ne démonte pas
un toast en vol. Il est en `z-60`, au-dessus de `MobileNav` — les deux partageaient `z-50`, et
sur téléphone la pile de toasts et la barre du bas étaient départagées par l'ordre du DOM.

## Le piège du `sr-only`

Tout ce qui porte `sr-only` a besoin d'un ancêtre positionné. `sr-only` est
`position: absolute` : si rien au-dessus n'est positionné, son bloc conteneur est le document,
et `overflow` sur un ancêtre non positionné **ne le rogne pas**. Dans cette coquille, chaque
nœud `sr-only` égaré atterrit à son offset en coordonnées document et donne à la page une
seconde barre de défilement vers du vide.
