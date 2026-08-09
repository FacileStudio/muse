# Archétype : réglages

C'est la page que les treize apps ont toutes, et que les treize avaient construite
différemment : neuf coquilles de réglages, cinq espacements de premier niveau différents.

## La forme

```svelte
<Page>
  <PageHeader title="Réglages" description="Votre identité, cet espace, et tout ce qui y est branché." />

  <Stack gap="content">
    <Tabs items={sections.map((s) => ({ ...s, href: `/settings/${s.id}` }))} value={active} />
    <Divider />
  </Stack>

  <PageTransition key={active}>
    {@render children()}
  </PageTransition>
</Page>
```

Ce `Stack gap="content"` est **porteur**. `Divider` ne porte aucune marge, donc le gap du parent
est la seule chose qui donne de l'air au trait. Serré contre la bande d'onglets, il se lit comme
un soulignement soudé à la pastille active et se bat avec sa forme.

## Trois règles que les agents cassent

**1. Jamais d'entrée Réglages dans la nav du rail.** La carte utilisateur en bas du rail est la
seule entrée. La déconnexion vit dans les réglages, dans une section Session de l'onglet Profil.

**2. Les sections sont des `Tabs` avec des `href`**, donc `/settings/api` est une vraie route :
elle survit au rechargement et le bouton retour parcourt les sections. Un `Tabs` porteur de
`href` **n'écrit jamais dans `value`** — l'URL est la source de vérité, et le consommateur
dérive `value` de `page.url.pathname`. Un `$state` local se désynchronise à la première
navigation arrière.

**3. La zone de danger n'est jamais son propre onglet.** Elle est en bas d'Avancé.

## L'ordre canonique

Profil · Apparence · Notifications · API · Pool · Membres · Avancé

Le thème vit dans Apparence, comme toute autre préférence — pas en bascule flottante au-dessus
de chaque page. Un contrôle qui suit l'utilisateur partout est une chose de plus en concurrence
avec les actions de la page.

## Les lignes

`SettingsSection` + `SettingsRow`. La section est un `Section` avec la carte activée par défaut ;
la ligne porte son libellé, sa description et son contrôle.

**Un contrôle dans un `SettingsRow` prend `aria-label`, jamais un `label` visible** — la ligne
porte déjà le libellé, et un `label` en plus le fait énoncer deux fois.

## Les secrets

Toujours à travers `SecretField` : un masque à huit points fixes qui ne révèle jamais la
longueur, une révélation qui se recache après 15 secondes, une copie avec accusé de 2 secondes,
et `REDACTED` traité comme « le serveur l'a gardé » plutôt que comme une valeur.

Un jeton fraîchement créé s'affiche une seule fois, dans un `Drawer`, avec `autoHideMs={0}` — et
rouvrir ce tiroir doit le réinitialiser.
