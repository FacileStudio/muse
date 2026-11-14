# Changelog

## v0.23.2 (2026-11-14)

### Fixed

- `SideBar` keeps the active row in view when content appears later (owner request, 2026-11-14). A space switcher rendered after async data pushed the row back below the fold. The nav column now re-reveals the active row, debounced, whenever it or its content changes size, until the person scrolls the column by hand; the next navigation re-arms it. Without `ResizeObserver` (jsdom, SSR) it does nothing.
- `SideBar` pins its header. The brand, the space switcher and the Search and Collapse rows stay at the top like the user card at the bottom; only the nav rows scroll. Tempo at 1440x900 scrolled the logo and the switcher out of the rail when it revealed a low row. The column fades over 24px at the end that still hides rows, with no border.
- `Tabs` never clips silently. At 390px a row of three tabs with icons and counts cut the last tab at the right edge with no hint. The row now fades at the end that hides tabs, keeps the selected tab in view on mount, on resize and on every change, and scrolls only itself (it used `scrollIntoView`, which can scroll the page). It is `min-w-0 max-w-full`, so it never widens the document.

### Added

- `utils/rail.ts` `revealChild` (either axis) and `utils/scroll-area.ts` (`hiddenEdges`, `edgeMask`, `watchScrollArea`), with unit tests. `revealActive` now reveals with a 24px gap so the row clears the fade.
- The `/overflow` probe page has a 320px row of three tabs with icons and counts, the last one selected, and a `SideBar` whose space switcher appears 600ms after mount. The probe fails when a tab row hides its selected tab or hides tabs with no fade, when the switcher is scrolled out of the rail, and when the active row ends up below the fold. Each check fails on v0.23.1.

## v0.23.1 (2026-11-14)

### Fixed

- `SideBar` brings the active row into view on load and on every route change (owner request, 2026-11-14). Tempo at 1440x900, with about 15 rows in 3 groups, left the active row below the fold. The nav column scrolls on its own and the user card stays pinned at the bottom. The rail scrolls only its own column and never the page. A row that is already visible does not move. The first reveal jumps, later ones glide, and reduced motion always jumps. Without layout (jsdom) it does nothing. The logic is `revealOffset` and `revealActive` in `utils/rail.ts`, with unit tests.
- Long unbroken text, such as a URL in a description, no longer widens the page. `html` now sets `overflow-wrap: break-word`, inherited everywhere, so a word breaks only when it would overflow its line. Consumer prose gets the same fix.
- `LandingHeader`: a long app name pushed the menu button and the sign-in action past the right edge at 360 and 1024px. The brand link now shrinks and truncates its name.
- `PageHeader`: a long `back.label` made a button wider than the phone. The back button is capped at the column width and truncates its label.

### Added

- The consumer smoke test checks that nothing in the app shell overflows horizontally. The smoke app's `/overflow` route frames a stress page at 360, 390, 768, 1024 and 1440px. The page has a 41-character app name, unbroken URLs, 9 tabs, an 8-column table, 18 grouped `SideBar` rows with row 17 active, `SettingsLayout`, `DownloadSection`, `LandingFooter` and `MobileNav`. `scripts/overflow-probe.ts` loads it in headless Chrome over the DevTools protocol, with no new dependency. It fails when the document or any unclipped element or text is wider than the viewport, or when the active `SideBar` row is out of view. It finds Chrome through `$CHROME`, the `PATH`, then the Playwright cache.

## v0.23.0 (2026-11-14)

### Added

- `DownloadSection` takes `mode?: 'all' | 'device'` and `allHref?: string` (owner request, 2026-11-14). `all` is the default and renders exactly as before, so a `/downloads` page needs no change. On a landing, `mode="device" allHref="/downloads"` shows only the visitor's platform, read from `navigator` after hydration. A phone gets every entry for its platform (APK and Play Store, for example) and no CLI. A desktop gets every entry for its OS (Apple Silicon and Intel, `.deb` and AppImage) plus the CLI commands, or the CLI alone when the app ships no file for that OS. An "Other platforms" link to `allHref` sits under the cards. When nothing fits (a desktop visitor to a mobile-only app, or an unknown platform), the section shows one "All downloads" button and no cards. Without `allHref`, that case falls back to every card. Server rendering and the first paint show the "All downloads" button in a block that reserves about one card of height (two with CLI commands, from 640px), so no full list flashes. An explicit `platform` prop skips detection and renders the device's cards on the server.
- `selectForDevice`, `isMobilePlatform` and the `DownloadMode` and `DeviceSelection` types are exported for apps that build their own layout.
- `download.all` and `download.otherPlatforms` in fr, en, es and de.
- `LegalFooter` takes `align?: 'center' | 'start'`. `center` is the default and does not change.

### Fixed

- `DownloadSection`: a long install command such as `go install github.com/FacileStudio/sonar@latest` no longer runs out of view next to the copy button. From 640px the command wraps inside its box and the copy button keeps its own column, so the whole command is always readable. Below 640px it still scrolls inside its box.
- `LandingFooter` no longer centers anything on a phone. The legal links, their wrapped lines and the language switch start at the left edge at 360 and 390px, like the brand, the tagline and the link groups. It passes `align="start"` to its `LegalFooter`; `legal.align` overrides it. The `LandingHeader` drawer was already start-aligned and does not change.

## v0.22.1 (2026-11-14)

### Fixed

- Dark mode `--color-fc-inverse` is `oklch(0.23 0 0)` (was `oklch(0.16 0 0)`, the dark `component` value). A terminal-style block inside a `Card` or `Tile` had no edge. The dark page is `oklch(0.09 0 0)`, near black, so a darker value cannot show an edge either. The surface now sits one fill step above the dark card and well above the page. Both text tokens still clear 4.5:1 on it. Light mode does not change.
- `DownloadCta` accepts a same-page fragment such as `href="#download"`, so a hero CTA can jump to the page's `DownloadSection`. The fragment is `#` followed by letters, digits, `-` or `_` only. Before, the CTA rendered nothing. A fragment link drops `rel="external"`. `isSafeHref` itself does not change, so every other link check keeps rejecting fragments.

## v0.22.0 (2026-11-13)

### Added

- Magnetik is the suite typeface (owner decision, 2026-11-13). muse bundles Regular, Medium and Bold as woff2 in `src/lib/fonts/`, with `font-display: swap`. `--font-fc-title`, `--font-fc-body` and `--font-sans` now start with `'Magnetik'`, with the platform stack after it as fallback. Medium serves weights 500 and 600, so `font-semibold` uses Medium: mapped to Bold, semibold button labels smeared on vitrine. Bold is 700. `--font-fc-mono` does not change. The licence is recorded in `LICENSE`.
- `DownloadSection`, one download block for every app. It shows one card per platform (macOS, Windows, Linux, iOS, Android), each listing its files with arch, version, size and an optional checksum link. A terminal card lists install commands with copy buttons. It reads the visitor's platform from `navigator` after hydration, moves that card first and marks it "For your device", so server rendering is safe. Data comes in as props and nothing is fetched. Unsafe or repeated hrefs and repeated commands are dropped. Strings come from the muse catalogs in fr, en, es and de.
- `detectPlatform`, `groupDownloads`, `PLATFORM_ORDER` and the `DownloadEntry`, `CliCommand` and `DownloadGroup` types are exported for apps that build their own layout.
- Inverse surface tokens for terminal-style blocks: `--color-fc-inverse` (`bg-fc-inverse`), `--color-fc-on-inverse` (`text-fc-on-inverse`) and `--color-fc-on-inverse-muted` (`text-fc-on-inverse-muted`). The surface is near-black in light mode and one fill step above the page in dark mode (the dark `component` value). Both text tokens clear 4.5:1 on it in both themes.

### Changed

- `fonts.test.ts` reads woff2 files. It used to reject them, so it now checks their glyph coverage and the weight mapping, and that every `url()` in `tokens.css` points at a bundled file.
- The consumer smoke test now checks that each Magnetik file is emitted by a packed-install build and served as `font/woff2`.

### Upgrading

- Delete any local `@font-face` block or `<link rel=preload>` for Magnetik or Goga. Two declarations of one family fight over which file wins. The fonts come in through `@facile/muse/styles`, so the app needs no other change. See `MIGRATION.md` §1.
- `font-medium` and `font-semibold` now render the same face. A design that needs heavier text uses `font-bold`.

## v0.21.2 (2026-11-13)

### Fixed

- `Menu` and `UserMenu` no longer throw when the keyboard moves the active entry in an environment without `Element.scrollIntoView`, such as jsdom in an app's tests. v0.21.1 called it unguarded.

## v0.21.1 (2026-11-13)

### Fixed

- `Menu` and `UserMenu` keep the keyboard-active entry in view. In a menu taller than its panel, ArrowDown, ArrowUp, Home, End and type-ahead now scroll the panel to the entry (`scrollIntoView({ block: 'nearest' })`); before, the highlight moved below the fold and only the mouse wheel reached it. Focus moves with `preventScroll`, so the panel never jumps to centre the entry. A pointer hover still neither focuses nor scrolls.
- `Menu` keeps its labels in one column when only some entries have an `icon`: entries without one get an empty icon-sized slot.

## v0.21.0 (2026-11-13)

### Changed

- `Tooltip` opens sooner. A hover waits 300ms (was 500ms). While another muse tooltip is open, or closed less than 500ms ago, the next opens at once, so moving along a toolbar shows each label with no wait. Keyboard focus (`:focus-visible`) opens it at once, as before. Only one tooltip is open at a time. It stays 100ms after the pointer leaves, so the pointer can move onto it, and stays while hovered. Escape dismisses it, a press on the trigger hides it, and touch never opens it. It fades in and out over 120ms, with no fade under reduced motion. `delay` still overrides the hover wait.
- `Tooltip` takes `describe` (default `true`). Pass `false` when the trigger's accessible name already says the hint: the tooltip is then not wired with `aria-describedby` and is hidden from assistive tech, so a screen reader does not read the name twice.
- `Tooltip` anchors to its trigger (its first element) instead of its wrapper, so `class="contents"` on the wrapper keeps the trigger's layout untouched.
- `IconButton` shows its `aria-label` as a muse tooltip on hover and keyboard focus. New prop `tooltip?: string | false`: a string shows that text instead (wired as a description only when it adds to the name), `false` shows none. The tooltip wrapper is `display: contents`, so layout does not change.
- Every icon-only control in muse now shows a tooltip: `Modal` close (now an `IconButton`), `Drawer`, `Toast`, `LandingHeader`, `LandingDrawer`, `SecretField`, `UploadProgress`, `IdeasPage` and `DatePicker` month arrows (through `IconButton`), `Pagination` previous and next, a collapsed `SideBar` row (`NavButton`), `MobileNav` items, the `UserMenu` avatar trigger (narrow rail and mobile), `Menu` and `Popover` triggers given `triggerContent`, the logo-only home link of `LandingHeader`, `LandingDrawer` and `LandingFooter`, and the cells of `ColorPicker`, `SwatchPicker` (without `showLabels`) and `IconPicker`.
- No muse component uses the native `title` attribute as a tooltip any more. `SecretField` shows a revealed value in a muse tooltip, and its eye and copy buttons keep their short hints through `tooltip`.

### Fixed

- A collapsed `NavButton` (and so every collapsed `SideBar` row) had no accessible name, since its label is not rendered. It now takes `label` as its `aria-label` when collapsed; a consumer `aria-label` still wins.
- The `SideBar` collapse row's visible label now follows its state ("Agrandir" when collapsed), so the label, the tooltip and the accessible name agree.

### Removed

- The `otp.digit` and `otp.character` strings. They fed a `title` on the `InputOtp` cells that never showed, since the input covers the cells.

### Upgrading

- An app that wraps an `IconButton` in its own `Tooltip` now gets two tooltips. Remove the wrapper and pass its text as `tooltip="..."`, or keep the wrapper and pass `tooltip={false}`.
- An app that put `title=` on an `IconButton` gets both the native and the muse tooltip. Drop `title`, or move a different text to `tooltip`.
- CSS that targets an `IconButton` as a direct child (`[&>button]`, `:first-child`) now sees a `display: contents` span in between.
- The rule for every app: an icon-only control always shows a muse tooltip; never use the native `title` attribute. See CHARTE §9.

## v0.20.0 (2026-11-13)

### Added

- `Presence`: the other people connected to a document, as an overlapping avatar stack. Each avatar has a 2px ring in the peer's colour, set off from the background by a gap. Past `max` (default 4) the rest fold into a "+N" pill whose tooltip lists their names. Each avatar has a tooltip and a 44px hit target. With `onfollow`, each avatar is a follow button ("Suivre Léa", or "Arrêter de suivre" on the one followed), and a "Vous suivez Léa · Arrêter" pill sits before the stack. Avatars scale and fade in and out, and stay still under reduced motion. It renders nothing when `peers` is empty. Props: `peers: PresencePeer[]` (`{ id, name, color, picture? }`, the viewer left out by the caller), `following?: PresenceId | null`, `onfollow?: (id: PresenceId | null) => void`, `max?: number`, `labels?: Partial<PresenceLabels>`. Types `PresencePeer`, `PresenceId`, `PresenceLabels`.
- `ConnectionHint`: the realtime link state as a quiet pill built on `StatusDot`. `live` renders nothing, `connecting` shows a pulsing warning dot ("Reconnexion…"), `offline` shows "Hors ligne" with "Vos modifications partiront au retour du réseau" in a tooltip and to screen readers, `stopped` shows a danger dot ("Déconnecté"). Props: `state: ConnectionState`, `labels?: Partial<ConnectionHintLabels>`.
- `presence.*` and `connection.*` strings in fr, en, es and de. Both components read the active locale from `provideLocale`, and `labels` overrides any string.

### Fixed

- muse.facile.studio prop tables: a callback prop (`onRun?: (idea: Idea) => void`) no longer hides every prop declared after it. The extractor read the `>` of `=>` as a closing bracket.

## v0.19.2 (2026-11-11)

### Changed

- `scripts/brand/generate.ts <id> <outDir>` no longer writes `head.html` into `<outDir>`. That dir is usually an app's public `static/` or `public/`, so the block shipped as a public file. It prints the head block to stdout, and writes it only to the file given with `--head <file>`. `--all <dir>` still writes `<dir>/<id>/head.html`, since that dir is an export, not a web root.

### Fixed

- Catalog: Boîte is a CLI for disposable QEMU VM development sandboxes, not a package host. New title and description.
- Catalog: Pastille's title says 42 mm, the disc's size, instead of 38 mm, its board's.

## v0.19.1 (2026-11-11)

### Fixed

- `SideBar`: the ⌘K and ⌘D shortcut hints use `text-fc-fg-muted` instead of `opacity-50`, so they pass WCAG AA colour contrast in light and dark.
- `LandingFooter` is now the page's `<footer>` landmark as a whole, so the brand, tagline and link columns sit inside contentinfo. `LegalFooter` takes `landmark` (default `true`); `LandingFooter` renders its inner one with `landmark={false}`, so footers never nest.

## v0.19.0 (2026-11-11)

### Added

- The suite brand-asset generator. `scripts/brand/apps.ts` is the one catalog of the 32 suite apps: id, name, icon, URL, an English title and an English description. `bun scripts/brand/generate.ts <id> <outDir>` (or `--all <dir>`) writes `favicon.svg`, a 16/32/48 px `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, a 1200x630 `og-image.png`, `site.webmanifest` and `head.html`, and prints the head block. Rasterised with `@resvg/resvg-js` and the bundled Inter font; Solar glyphs come from `@iconify-json/solar`. BRAND.md has the rules: apps never hand-edit these files.

### Changed

- muse.facile.studio uses the generator: new favicons, touch icons, manifest, link preview and `<head>` (`og:site_name` is now Facile, theme colour light `#fafafa`). `site/scripts/favicon.ts` regenerates them and no longer runs during the site build, so the Docker build needs no root dependencies.

## v0.18.1 (2026-11-11)

### Fixed

- Dependencies: the dev and site lockfiles move to svelte 5.57.3, vite 6.4.6 and @sveltejs/kit 2.70.4, and the site pins patched devalue, source-map-js and cookie. Clears the vite, devalue and source-map-js advisories. No component or API change.

## v0.18.0 (2026-11-10)

### Added

- `UserMenu` (and `SideBar` / `MobileNav` through `userMenu`) takes `invitations: { count, href, label? } | null`: the signed-in person's pending Registre space invitations. It adds an Invitations row after Account with a count pill (99+ cap, never wraps) and puts a dot on the avatar while `count` is above 0; the trigger's accessible name then ends with "2 pending invitations". An absolute `href` opens in a new tab. Leave it out, or pass `null`, for no row. Strings in fr, en, es and de. Also exported: `pendingInvitations()` and the `UserMenuInvitations` type.

#### How an app wires it

muse fetches nothing. The app's backend asks Registre and the shell passes the answer down:

1. Backend: `GET /api/me/invitations` behind the session. It calls `GET https://sso.facile.studio/api/directory/invitations?sub=<registre subject>` with HTTP Basic (the app's OIDC client id and secret, the same pair as the directory syncer), caches the answer per user for 60 seconds, and returns `{ count, href }`: the one invitation's `url` when there is exactly one, else `https://sso.facile.studio/spaces`. On any error it returns `{ count: 0 }`. Registre's docs/invitations.md has the details.
2. Frontend: `userMenu={{ ...userMenu, invitations }}` on `SideBar` and `MobileNav`.

## v0.17.1 (2026-11-10)

### Fixed

- `SettingsRow` `stacked`: the control now takes the full width of the row. The wrapper was a horizontal `flex items-center` box, so a `Field`, `Input` or `Textarea` inside shrank to its content width. Stacked rows use a column with `items-stretch`; side-by-side rows are unchanged.

### Added

- `Textarea` grows with its content (`field-sizing: content`, with a `min-h-24` floor). Pass `autoGrow={false}` for a fixed height set by `rows`.

## v0.17.0 (2026-11-08)

### Added

- The Ideas kit, one entry and one page for proactive AI suggestions in every app. muse fetches nothing: the app passes the data and the callbacks.
  - `IDEAS_ICON` (`solar:lightbulb-linear`, bundled, also `icons.ideas`) and `ideasNavItem({ href, active, count, running, i18n })`. It returns the entry for `SideBar` `pages` and `MobileNav` `items`, with the label in the active locale, a badge for the new ideas, a running indicator and a spoken hint such as "3 new ideas, in progress". Every app puts it first. Pass `i18n` (from `getI18n()`) when you call it inside `$derived`.
  - `IdeaCard`: a kind icon for mail, task, event, follow_up, research and other, plus any app kind through `icon` and `kindLabel`. Title, why, sources as links, a collapsed draft, and run and dismiss actions. The run state is `idle`, `running`, `needs_approval`, `done` or `failed`, with a result summary, output links, a retry on failure, and a continue-in-Bulle link (`continueHref`). Props `idea`, `busy`, `level`, `onRun`, `onDismiss`, `onApprove`, `onDecline`.
  - `IdeasPage`: a header with Generate and the time of the last batch, a grid or list (bindable `layout`), and the loading, empty, busy and error states. Props `ideas`, `loading`, `generating`, `error`, `lastGeneratedAt`, `busyIds`, `onGenerate`, `onRetry` and the card callbacks.
  - `IdeasUpsell`: the page for a plan without AI. It explains the feature with three example ideas and links to `upgradeHref`. `examples` replaces the defaults.
  - `ApprovalCard`: tool label, human summary, arguments on demand, approve and decline, and a busy state. Ideas runs and future MCP confirmations use the same card.
  - Helpers: `ideaKind`, `ideaRunState`, `ideaActions`, `runTone`, `runLabel`, `isNewIdea`, `countNewIdeas`, `hasActiveRun`, `ideasView`, `relativeTime`, `formatArgs`, and the types `Idea`, `IdeaRun`, `IdeaRunState`, `IdeaKind`, `IdeaSource`, `IdeaOutput`, `IdeaStatus`, `ApprovalRequest`.
  - `ideas.*` strings in fr, en, es and de. The demo has an Ideas page with every state.
- `SideBar` `Page` and `MobileNav` `NavItem` take `badge`, `busy` and `hint`. The sidebar shows a count pill and a pulsing dot, and a dot over the icon when the rail is collapsed. The phone bar shows a dot. `hint` joins the accessible name. The pulse stops under reduced motion.
- `NavButton` takes `marked`: a dot over the icon of a collapsed row.

## v0.16.1 (2026-11-07)

### Changed

- `Checkbox`, `Radio` and `Switch` keep their 44px touch target by default again. v0.15.1 capped it at half of `--fc-control-gap`, which dropped the default to 28px.

### Added

- `dense` on `Checkbox`, `Radio`, `RadioGroup` and `Switch`: opts back into the v0.15.1 cap for tight lists. The touch area stops at half of `--fc-control-gap` (default 0.5rem), so set the variable to the list's real row gap, up to 1.5rem. Sets `data-dense` on the label; `RadioGroup` passes it to every `Radio` and drops its 44px row height.

## v0.16.0 (2026-11-07)

### Added

- `IconPicker`: a filled trigger showing the chosen icon, and a top-layer panel with a search field and a grid of every linear Solar icon. It sits above a `Modal` or `Drawer`, stays inside the viewport, flips up when there is more room above, and opens scrolled to the current icon. Arrows, Home and End move through the grid; typing jumps to the search; Enter in the search picks a single match; Escape closes it. Cells are 44px. It takes `icons` and `toIcon` to offer another set, `name` for forms, and reads its label from `Field`. Strings: `iconPicker.placeholder`, `iconPicker.search` and `iconPicker.empty` in fr, en, es and de.
- `solarIconNames` and `solarIconId`: the 1,451 linear Solar icons by name (`add-circle` is `AddCircle`, the names Opus stores for project icons) and the name-to-iconify mapping, with a kebab-case fallback for names Solar has since renamed.

## v0.15.1 (2026-11-07)

### Fixed

- `Combobox`: a consumer's `oninput`, `onclick`, `onkeydown` and `onblur` no longer get dropped. They run first, then muse's own handler, which still runs if the consumer's throws.
- `Slider`: a consumer's `onpointerdown`, `onpointermove`, `onpointerup` and `onpointercancel` chain with the internal ones instead of replacing them.
- `Accordion`: a consumer's `onkeydown` chains with the header navigation instead of replacing it.
- `Tooltip`: when open, Escape stops propagating, so it no longer closes an enclosing `Modal` as well. When closed, Escape passes through untouched.
- `InputOtp`: the cell label reads "Character n of m" for the alphanumeric kind (`otp.character` in fr, en, es and de). The numeric kind keeps "Digit n of m".
- `Checkbox`: dropped `aria-checked="mixed"` from the native input. The native `indeterminate` property is what assistive technology reads.
- `Checkbox`, `Radio` and `Switch`: the 44px touch area no longer reaches into the next row. Its vertical extension is capped at half of `--fc-control-gap` (default 0.5rem). Set `--fc-control-gap` on a list to its real row gap, up to 1.5rem, to get the full 44px.

## v0.15.0 (2026-11-07)

### Added

- Nine components, each with APG keyboard behaviour, a demo section on the Controls page and docs-site examples. The pure logic of each is in `utils/` and tested.
  - `Popover`: a non-modal panel opened by a button. Props `label`, `open` (bindable), `trigger`, `align`, `panelClass`, `onOpenChange`. Escape closes and returns focus; a press outside or Tab out closes.
  - `Tooltip`: a hint on hover (after `delay`, 500ms) and keyboard focus, dismissed by Escape, hoverable, ignored on touch. Props `text`, `delay`, `disabled`. It sets `aria-describedby` on its first child and never replaces the control's own name.
  - `RadioGroup`: `role="radiogroup"` over native radios (roving tabindex from the browser). Props `options`, `value`, `name`, `orientation`, `disabled`; named by its `Field`.
  - `Slider`: single or range. Props `value`, `values`, `range`, `min`, `max`, `step`, `valueText`, `name`, `disabled`. Arrows, Page keys, Home and End; `aria-valuetext`; a 44px pointer target. `utils/slider.ts`.
  - `Collapsible` and `Accordion`: props `title`, `open`, `level`, `region` and `items`, `open` (ids), `multiple`, `panel`. Arrows, Home and End move between headers. `utils/accordion.ts`.
  - `Combobox`: an editable autocomplete that reuses `Select`'s listbox. Props `value` (the free text), `options`, `onSelect`, `emptyLabel`. Accent and case blind filtering, `aria-activedescendant`. `utils/combobox.ts`.
  - `DatePicker`: a calendar grid in the app locale through `Intl`, grid keyboard navigation, `min` and `max`, an ISO value and hidden input. Props `value`, `min`, `max`, `name`, `placeholder`, `locale`, `onChange`. `utils/calendar.ts`.
  - `InputOtp`: one real input drawn as cells, so paste and SMS autofill work. Props `value`, `length`, `kind`, `onComplete`. `utils/otp.ts`.
- `Checkbox` takes `indeterminate`: `aria-checked="mixed"` and a dash. A click clears it. Forced-colors maps it to `Highlight`.
- `ButtonVariant` and `IconButtonVariant` types, exported from `@facile/muse`, and `secondary` and `ghost-danger` on both buttons.
- `Tone`, `StatusTone`, `toneFill` and `isUrgent` in `utils/tone.ts`. `Toast` takes all eight tones.
- `datePicker.*`, `otp.digit`, `slider.min`, `slider.max` and `combobox.empty` strings in fr, en, es and de.
- `triggerButton` and `floatingPanel` class constants in `utils/control.ts`, shared by `Menu` and `Popover`.

### Changed

- `Menu` and `UserMenu`: a row under the pointer is highlighted without taking DOM focus. Real focus moves only for keyboard input (`MenuState.point` and `land`).
- `Select`: blur closes the list and commits nothing, and keeps the type-ahead buffer until its timer ends.
- `SecretField` is built on `Field` (label, helper, error, ids) and `Input` instead of its own copy.
- `Checkbox`, `Radio` and `Switch` have a 44px hit area through a pseudo-element, with no layout change.
- `bun test` runs every test in the repo; `mise run test` and CI no longer name directories, so `scripts/props-shape.test.ts` runs in CI.
- Comments inside `<script>` bodies are gone from every component. Doc comments stay on exported props and types.
- `utils/chart.ts` is a barrel over `utils/chart/`. `LineChart`, `SideBar`, `Drawer` and `UserMenu` each lose a block to a helper (`LineAxes`, `LineHover`, `utils/rail.ts`, `utils/sheet-drag.ts`, `utils/user-menu-labels.ts`, `utils/user-menu-nav.ts`) and pass filet's 250-line limit.

### Fixed

- `InputOtp`: the field no longer sets `maxlength`, which made the browser cut a pasted "123 456" or "123-456" before muse could strip the separator.

### Deprecated

- `Button variant="outline"`: use `secondary`.
- `IconButton variant="default"` and `"danger"`: use `secondary` and `ghost-danger`.
- The `Variant` type of `Button.svelte` and `IconButton.svelte`: use `ButtonVariant` and `IconButtonVariant`.

## v0.14.5 (2026-11-07)

### Fixed

- `SignInWithFacile` had 13px of padding before the Facile mark and 26px after the label, so the pill looked pushed to the left. Both sides now match: 16px at `sm`, 20px at `md`, 24px at `lg`. At `md` the pill is the same height and inset as `DownloadCta` (44px, 20px), so the two line up side by side in a landing hero.
- `AuthScreen` put the logo above the app name. The logo now sits left of the name on one row, the way `LandingHeader` shows it. The tagline stays below.

## v0.14.4 (2026-11-07)

### Fixed

- `DonutChart` with one slice at 100% (one non-zero value, or all others zero) drew a ring with rounded ends and a visible seam at 12 o'clock. A slice spanning the full circle is now a clean ring, or a plain disc when `rInner` is 0: no corner rounding, no gap. `arcPath` returns that path for any span of 360 degrees minus 1e-4 rad, and `donutSegments` no longer insets a lone slice. Two or more slices keep their rounded corners and separators. `DonutChart` is the only circular chart in muse. The docs demo gains a single-slice, a 99.9% / 0.1% and a two-slice case.

## v0.14.3 (2026-11-07)

### Added

- `UserMenuOptions.locales`: the languages the Language rows offer, in the order given. The default is all four; an empty list or one with no valid locale also means all four. `offeredLocales` in `utils/user-menu.ts` does the filtering.

### Changed

- `UserMenuSubscription.plan` is optional. Without it the Subscription row shows only its label ("Gérer l'abonnement"), with no detail. An empty `plan: ''` behaves the same, so existing callers keep working.

### Fixed

- `getI18n()` with no `provideLocale` above the caller returned a fresh English instance whose `set()` did nothing, so a `UserMenu` or `LocaleSwitch` outside the provider's subtree saved the choice and never re-rendered. Those callers now share one reactive instance: `set()` updates every `getI18n().t()` consumer at once. The choice-over-source rule behind `provideLocale` is now `effectiveLocale` and `isKnownLocale` in `i18n/locale.ts`, covered by tests.

## v0.14.2 (2026-11-07)

### Added

- `UserMenu` takes `align`: `'start'`, `'end'` or `'auto'` (default). `auto` lines the popover up with the trigger's left edge and switches to the right edge when the menu would leave the screen. The position is always clamped inside the viewport margins, and the menu is capped at the viewport width, so a trigger at the right edge of a header no longer clips at 360px. The width is re-measured once the popover is open. The maths is `placeAcross` in `utils/placement.ts`.
- `TokensSection` takes `expiry` and `lastUsed` (both default `true`). `expiry={false}` hides the expiry field in the create drawer and the expiry column, and the `onCreate` draft carries no `days`. `lastUsed={false}` hides the last-used column.

## v0.14.1 (2026-11-07)

### Fixed

- `PricingPlans` renders the `ai.access` feature row ("Assistant IA et fonctions IA" and its en, es, de equivalents) when a plan sets it to true. A plan with it false shows no row, like every other bool feature. `PlanLimit` already takes its copy from the 402 body, so it needed no change.

## v0.14.0 (2026-11-07)

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
  menu. `userHref` is now the Settings row. **Breaking:** `userMenu` is a `UserMenuOptions` object, not an array (MIGRATION section 21).
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
