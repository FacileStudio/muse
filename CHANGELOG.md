# Changelog

## v0.10.0 (unreleased)

### Added

- i18n runtime, no dependency. `provideLocale(() => session.locale)` in the root layout sets the
  locale for every muse component and keeps `<html lang>` in step; `getI18n()` reads it,
  `scopeLocale()` pins a subtree. `createTranslator(catalogs, locale)` gives apps a typed `t()`
  with `{name}` interpolation, plurals through `Intl.PluralRules` and fallback to English.
  Locales: `fr`, `en`, `es`, `de` (`LOCALES`, `resolveLocale`, `LOCALE_NAMES`).
- Catalogs for every muse string in the four locales (`museMessages`). es and de need native
  review; see TRANSLATIONS.md.
- `SignInWithFacile`: the one "Sign in with Facile" button. Facile mark, `sm`/`md`/`lg`,
  `fullWidth`, `loading`, links to porte's `/auth/oidc`. Rules in BRAND.md.
- `AuthScreen`: the sign-in screen. App name, `logo`, `tagline` and `notice` snippets, the
  button, a "Create your account" link to Registre (`signUpHref`) and `LegalFooter`. No
  password field.
- `PlanLimit`: `banner` and `dialog` variants for a 402. `planLimitFrom(body)` reads tronc's
  `{"error":{...}}` envelope or a bare `{message, upgrade_url, key, limit}` and drops an unsafe
  `upgrade_url`.
- `LegalFooter` (CGU, CGV, privacy, legal notice, defaulting to
  `https://sso.facile.studio/legal/<doc>?lang=<locale>`) and `LocaleSwitch`.
- `legalUrl`, `signUpUrl`, `isSafeHref`, `safeHref` and `isSafeUpgradeUrl` helpers. Every href
  muse renders from a prop (`SignInWithFacile`, `AuthScreen` sign-up, `LegalFooter` links,
  `PlanLimit` upgrade) must be a same-origin path or an `https://` URL, or it falls back to
  the default. Locales written by `set()`, `scopeLocale` and the URL helpers always pass
  through `resolveLocale`.
- `filet.yml` (suite standard limits) and `lefthook.yml` (shared FacileStudio/hooks config).
- Docs site page "Langues", demo page "Lancement" with the four locales and both themes.

### Changed

- Default strings follow the locale. Without `provideLocale` they are English, which changes
  `Dropzone`'s defaults from French to English. Text props still win.
- Chart screen-reader summaries are reworded and translated. `seriesSummary` is replaced by
  `seriesNames` (internal).
- The auth archetype on the docs site now uses `AuthScreen`; the password form is gone.

See MIGRATION.md §19.

## v0.9.0 (2026-11-03)

### Added

- `SideBar` takes `userMenu` (`UserMenuItem[]`). The user card then opens a menu of links and
  actions above itself (beside it when the rail is collapsed) instead of linking to settings,
  and shows a chevron instead of the settings cog. Escape and a click outside close it.

## v0.8.1 (2026-11-03)

### Added

- `icons.space` (`solar:share-circle-bold-duotone`), the suite-wide glyph for a space. Its
  paths are bundled in `icons-data.ts`, so it draws without a network request.

### Changed

- `SpaceSwitcher` shows `icons.space` on the trigger when a space is active and on each space
  row. Personal keeps `icons.userCircle`.

### Fixed

- `scripts/build-icons.ts` follows renamed Iconify aliases again (`magnifer-linear`,
  `text-linear`), ported from the v0.6 line. The existing glyphs are unchanged.

## v0.8.0 (2026-11-03)

### Changed

- No decorative borders. `Topbar`, `Modal`, `Drawer` (panel and footer), `Toast`,
  `SpaceSwitcher` (trigger, dropdown and its footer), `SettingsRow`, `ProfileCard` meta rows
  and dividers, `UploadProgress` rows and `OptionCards` now separate by fill, shadow and
  spacing. Borders stay on form controls, `Dropzone`, `Table` row rules, `Divider` and focus
  rings.
- Surface tokens: `fc-component` 0.975 light / 0.16 dark, `fc-surface` 0.95 / 0.21, so cards
  stay distinct from the page without an outline (1.08:1 light, 1.07:1 dark, up from 1.04:1).
- `fc-fg-muted` 0.5 light / 0.64 dark, and the light `danger`, `success`, `info`, `warning`
  and `owner` tokens 0.50–0.54, so muted and tinted text keep 4.5:1 on the new surfaces.
- CHARTE §5, the docs site and the agent skill state the rule; `no-decorative-border.test.ts`
  fails the build on a decorative border in any component.

See MIGRATION.md §18 for what consuming apps should change.
