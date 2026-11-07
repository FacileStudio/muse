# Archétype : réglages

C'est la page que les treize apps ont toutes, et que les treize avaient construite
différemment : neuf coquilles de réglages, cinq espacements de premier niveau différents.

## La forme

```svelte
<Page>
  <SettingsLayout {sections} active={params.section} backHref="/settings">
    {#snippet children(current)}
      <Panel id={current} />
    {/snippet}
  </SettingsLayout>
</Page>
```

`SettingsLayout` porte l'en-tête, la navigation et le panneau. À partir de 64rem, la navigation
par sections est à gauche. En dessous, l'adresse nue `/settings` montre les sections en liste, et
en choisir une ouvre son panneau avec un lien de retour.

## Trois règles que les agents cassent

**1. Jamais d'entrée Réglages dans la nav du rail.** La carte utilisateur en bas du rail ouvre le
menu utilisateur, et Réglages en est la deuxième ligne. La déconnexion est dans ce menu, pas dans
les réglages. La carte n'a aucune icône à droite et le menu n'a aucune bordure.

**2. Les sections sont de vraies routes.** Chaque entrée porte son `href`, donc `/settings/tokens`
survit au rechargement et le bouton retour parcourt les sections. `settingsRoute` lit l'adresse :
une section inconnue revient avec `known: false`, à rediriger.

**3. La zone de danger n'est jamais sa propre section.** `DangerZone` est en bas d'Avancé.

## L'ordre canonique

Profil · Préférences · Notifications · sections de l'app · Jetons d'API · Abonnement · Avancé

`orderSections` l'applique. Profil est en lecture seule : le nom, la photo et l'e-mail viennent de
Facile (`ProfileSection`, lien « Gérer sur Facile »). Le thème et la langue vivent dans Préférences
(`PreferencesSection`) et dans le menu utilisateur, jamais en bascule flottante.

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
