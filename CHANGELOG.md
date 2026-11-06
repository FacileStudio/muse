# Changelog

## v0.11.0 (2026-11-06)

### Added

- `PricingPlans`: Facile's plans from Ardoise's public catalog (`catalogUrl`, default
  `https://api-ardoise.facile.studio/api/catalog`, or a server-loaded `catalog`). One card per
  plan with the free plans first, a monthly/yearly radio
  group with the best yearly saving, prices through `Intl.NumberFormat` in the locale, and
  feature rows for `nuage.storage_gb`, `courrier.mailboxes`, `echo.max_call_minutes`,
  `echo.max_participants`, `echo.recording` and `glouton.access` (`-1` is unlimited, unknown
  keys are skipped). `highlight` puts an app's own features first. Buttons go to `ctaHref`
  (default `https://sso.facile.studio/spaces`, checked with `isSafeHref`) with `plan` and
  `interval` added for a paid plan. It renders nothing when the catalog is empty, malformed or
  unreachable: one request, a 5 s timeout, no retries.
  The browser fetch works from Ardoise v0.14.1, which answers the catalog with
  `Access-Control-Allow-Origin: *` (no credentials). An app that sends tronc's CSP must add
  `connect-src https://api-ardoise.facile.studio`. Pass `catalog` (loaded in `+page.server.ts`)
  to render the plans in SSR with no client request.
- Free plans are the ones the catalog lists with no price or a zero price, and every one is
  shown, first, in catalog order. A plan whose prices all fail validation is dropped, never
  shown as free. `synthesizeFree` adds a bare free card when the catalog has none; it is off.
- `parseCatalog`, `fetchCatalog` and the pricing helpers (`formatPrice`, `yearlySaving`,
  `featureRows`, `withFreePlan`...). Validation is strict: malformed plans, prices and features
  are dropped one by one.
- `DownloadCta`: a link to an app's downloads page with platform icons (`macos`, `windows`,
  `linux`, `android`, `ios`) and "Download the apps" in four languages. An unsafe `href`
  renders nothing.
- `icons.apple`, `icons.windows`, `icons.linux` and `icons.android` (MDI, bundled).
- Demo page "Tarifs" in four locales and both themes; docs examples for both components.

## v0.10.1 (2026-11-06)

### Fixed

- No session, no `?lang=`. `LegalFooter` and `AuthScreen`'s sign-up link add `?lang=` only
  when the locale is known (`I18n.known`), so Registre falls back to the browser's languages
  instead of English. `legalUrl` and `signUpUrl` take an optional locale.
- `resolveLocale` reads a whole `Accept-Language` header, highest `q` first
  (`it, de;q=0.8` is `de`). New `matchLocale` returns `null` instead of `en` when nothing matches.
- The locale picked on the sign-in screen survives sign-in: `SignInWithFacile` adds
  `ui_locales=<locale>` (OIDC) to its `href` when the locale is known, unless the href already
  carries one. porte has to forward it to Registre.
- `SignInWithFacile` stays idle on a modified click or when `target` opens another context,
  and sets `aria-disabled` while busy.
- `PlanLimit`'s banner keeps its `role="status"` region mounted and swaps the content, so
  screen readers announce it. The dialog variant spreads `...rest` onto the `<dialog>`.
- `LocaleSwitch` calls a consumer `onchange` as well as switching the locale, instead of losing
  the switch to it.
- `AuthScreen` no longer fades in on the first render (no flash after SSR hydration); it
  animates only when mounted by a client-side navigation.
- `upload.complete` agrees in number in fr and es (`1 sur 3 terminé`). Its params are now
  `count` (done) and `total`.

### Added

- `LOCALE_COOKIE` (`fc_locale`), `matchLocale` and `withParam`. The "Langues" page shows
  the cookie and `Accept-Language` fallback for session-less pages.

## v0.10.0 (2026-11-04)

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
