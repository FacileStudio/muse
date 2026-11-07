# Changelog

## v0.14.0 (unreleased)

### Added

- `UserMenu`, the one menu behind the sidebar's user card and the mobile avatar. A borderless
  APG menu button in the top layer (`shadow-lg`, no border, spacing instead of a rule). Canonical
  rows in order: Account ("Gérer mon compte Facile", `https://sso.facile.studio/account`), app
  `items`, Settings, Subscription (plan name and "Gérer l'abonnement"), Language (fr, en, es,
  de), Theme (system, light, dark), Help, Sign out. Language and Theme open a one-level radio
  view (Right arrow in, Left arrow or Escape out). Every string is in the four catalogs and
  `labels` overrides any of them. Props: `user`, `trigger` (`card` or `avatar`), `presentation`
  (`popover` or `sheet`), `narrow`, `active`, plus `UserMenuOptions`: `items`, `accountHref`,
  `settingsHref`, `subscription`, `helpHref`, `onSignOut`, `showLanguage`, `locale`,
  `onLocaleChange`, `showTheme`, `theme`, `onThemeChange`, `labels`.
- `SettingsLayout`: a left section nav from 64rem, a stacked list with drill-in and a back link
  under it. The section lives in the URL. `orderSections` applies the canonical order (Profile,
  Preferences, Notifications, app sections, API tokens, Subscription, Advanced) and
  `settingsRoute` resolves the request.
- Canonical sections: `ProfileSection` (read-only identity from Facile with "Gérer sur Facile"),
  `PreferencesSection` (language, theme), `NotificationsSection`, `TokensSection` (list, create in
  a drawer with a required expiry and a reveal-once `SecretField`, confirmed revoke),
  `SubscriptionSection` (plan, manage and upgrade links, usage, `PlanLimit`) and `DangerZone`
  (tinted fill, no border).
- `THEMES`, `isTheme`, `readTheme` and `applyTheme`; `ACCOUNT_URL`; `icons.help` and
  `icons.external`; `userMenu.*`, `theme.*` and `settings.*` strings in fr, en, es and de.

### Changed

- `SideBar`: the user card shows the avatar, the name and a secondary line (`user.secondary`,
  else `user.email`, else the active space) with no trailing icon, and always opens the user
  menu. `userHref` is now the Settings row. `userMenu` is a `UserMenuOptions` object, not an array.
- `MobileNav`: the avatar opens the same menu as a bottom sheet. New `userMenu` prop; `profileHref`
  is the Settings row.
- `User` gains `email` and `secondary`.

### Removed

- The `mobileNav.profile` string and the settings cog on the user card.

## v0.13.0 (2026-11-07)

### Added

- `Select` draws its own option list. A `button[role=combobox]` opens a `role=listbox` popup
  (WAI-ARIA APG select-only combobox): arrows, Home, End, PageUp, PageDown, Enter, Space,
  Escape, Tab, type-ahead, `aria-activedescendant`, 44px options, disabled options and
  `<optgroup>`. The popup is a top-layer popover, so it works inside `Modal` and `Drawer`, flips
  upward near the viewport edge and scrolls the active option into view. A hidden native
  `<select>` keeps `name`, `required`, `bind:value`, `onchange` and form submission. New props:
  `options` (also renders the label on the server) and `placeholder`.
- `Menu` (action menu, APG menu button), `Progress`, `Breadcrumb` and `Pagination`, replacing
  hand-rolled copies in Bulle, Courrier, Nuage and Glouton.
- Token `fc-field`, the fill of every form control: a light step (`oklch(0.91)` light,
  `oklch(0.26)` dark), 1.13 to 1.31:1 off the page, a card and `fc-surface` in light and 1.14 to
  1.33:1 in dark, in both dark blocks and in `cn.ts`. The owner chose this subtle fill over
  WCAG 1.4.11's 3:1, so every field needs a visible label. Text stays strict: `fc-fg` 15.15:1 and
  `fc-fg-muted` 4.59:1 on it in light, 14.88:1 and 4.62:1 in dark. `tokens.test.ts` recomputes it.
- `@media (forced-colors: active)` in `tokens.css` gives every control a 1px `ButtonText` boundary
  and `Highlight` checked and active states, for Windows high contrast. It covers controls, boxes,
  the switch track, the `Select` and `Menu` popups, the progress track and buttons. An invalid control's placeholder
  switches to `fc-fg`, so it stays above 4.5:1 on the tinted fill.
- `controlFill` and `controlLine` exports, the one look of a text-like control, and
  `resolveField`, the one place a control merges its own ids with its `Field`.
- `Field` and `SecretField` put an icon before the error message, so an invalid state never
  rests on colour alone.

### Changed

- Badge text never wraps. `Badge`, the `Tabs` counter and the `StatusDot` label stay on one line and
  truncate with an ellipsis when the container is too narrow.
- **No borders anywhere** (but the `forced-colors` rules). `Input`, `Textarea`, `Select`, `SecretField` and `ColorPicker` are
  filled with `fc-field`. `Checkbox` and `Radio` are 20px filled boxes, inverted to the accent when
  checked, with the mark drawn as an SVG (the native input stays, `appearance-none`). `Switch`
  is a filled track. `Dropzone`, the `outline` `Button`, the default `IconButton`, `Divider`,
  `Table` row rules, `Badge`, the swatch pickers, `ProfileCard`'s identity dot and `Spinner` lose
  their border or ring. A selected swatch scales up and shows a check mark. `Spinner` is an SVG
  arc, so tint it with a text colour, not a border colour. `no-borders.test.ts` replaces
  `no-decorative-border.test.ts` and has no allowlist.
- `Select` `class` lands on the visible button, like the `<select>` it replaces; `wrapperClass`
  styles the layout-neutral element around it. Remaining props reach the hidden native select.
  An outside `select.value = ...` updates the display and the bound value. The active option is an
  inverted accent fill, and the listbox is named by the `Field` label (`labelId` in the field
  context). Children `<option>`s are read after mount: prefer `options` for server rendering.
- `Menu`: Tab returns focus to the trigger before closing, focus leaving the menu closes it, and
  Space activates link items.
- `Table` alternates row fills and lights the hovered row.
- Chart grid lines use `fc-surface`.
- `SpaceSwitcher` shares its flip-up arithmetic with `Select` and `Menu` (`placePopup`).
- `Input`, `Textarea`, `Select`, `Checkbox`, `Radio` and `Switch` resolve their `Field` wiring
  through `resolveField` instead of six copies.

### Deprecated

- `fc-border` is used by nothing in muse. It stays so consumer classes keep a colour. Use
  `fc-surface` or `fc-field`.

### Removed

- The `--fc-select-chevron` custom property: `Select` draws a chevron `Icon`.

## v0.12.1 (2026-11-06)

### Fixed

- `LandingHeader`: following a drawer link no longer moves focus back to the menu button, so the
  anchor target keeps focus. Escape and the close button still restore it. The pending
  animation frame is cancelled on destroy.
- `LandingHeader` and its drawer honour `LandingLink.external` like the footer: new tab,
  `rel="noopener noreferrer"`, and the screen-reader note.
- `LandingFooter`: new `year` prop. Without it the default copyright year appears after mount,
  so server and client markup cannot differ.

### Changed

- The drawer moved into an internal `LandingDrawer`, with no behaviour change. `actions` renders
  in the bar and in the drawer: do not put ids in it.

## v0.12.0 (2026-11-06)

### Added

- `LandingHeader`: the landing-page top bar. It sticks to the top, shrinks into a floating pill
  on scroll (width, radius, blur and offset on `--ease-fc`, no layout shift, off under reduced
  motion), slides an active pill between `links`, and turns into a right-hand drawer under 64rem
  (native dialog: focus trap, Escape, focus back on the menu button, `aria-expanded`,
  `aria-controls`, `100dvh`). Props: `appName`, `icon`, `brand`, `homeHref`, `links`, `actions`
  (defaults to `SignInWithFacile`), `skipHref`. Unsafe hrefs are dropped.
- `LandingFooter`: brand, tagline, link `columns` that stack on a phone, and a strip with the
  copyright and the `LegalFooter`. Props: `appName`, `icon`, `brand`, `homeHref`, `tagline`,
  `columns`, `legal`, `copyright`.
- Concentric radii: the `fc-chrome`, `rounded-fc-outer` and `rounded-fc-inner` utilities encode
  `r_inner = r_outer - padding` once (CHARTE section 5).
- `icons.menu`, `LandingLink`, and `landing.*` strings in fr, en, es and de.

### Changed

- `SignInWithFacile`: always a pill with the Facile mark at equal inline padding. While loading
  the spinner takes the mark's place at the same size and the label stays, so the width does not
  jump (the loading text moves to a screen-reader-only span). `label` is deprecated but still
  works. The four catalogs already agreed on the canonical label.

## v0.11.1 (2026-11-06)

### Added

- `PricingPlans`: `headingClass` merges classes onto the section heading so a landing page can
  match its own headings. The default output is unchanged.

### Fixed

- `PricingPlans`: a free plan whose name is the word "free" in any locale (Gratuit, Free, Gratis,
  Kostenlos) showed it twice, as the card title and as the price. The price line is now dropped
  in that case; a differently named free plan still shows its "free" price.

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
