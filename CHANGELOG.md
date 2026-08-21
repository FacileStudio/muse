# Changelog

All notable changes to `muse` are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow semver —
while on `v0`, a breaking change bumps the minor.

muse is not published to a registry. Consumers pin `github:FacileStudio/muse#vX.Y.Z`, so **the
tag is the distribution** and this file is what you read to decide whether to move your pin.
`MIGRATION.md` is the companion: it carries the symptom, the cause and the exact edit for every
breaking change, and it is what to open once you have decided to bump.

**History starts at v0.5.0, on purpose.** The oldest pin anyone in the suite still holds is
`#v0.4.0`, so v0.5.0 is the earliest release a consumer could bump *to* — everything below it is
unreachable from where anybody stands. The tags before that are in git
(`git log --oneline v0.1.0..v0.4.0`) and were not backfilled: writing entries for releases nobody
can move from is archaeology, and an entry reconstructed from a diff months later is a guess
wearing the clothes of a record.

## [Unreleased]

Nothing here changes a component. An app on `#v0.6.3` gains nothing by moving to the branch.

### Changed

- **`package.json` goes from `0.6.0` to `0.6.3`, catching up with three tags that left it
  behind.** v0.6.1, v0.6.2 and v0.6.3 were tagged by hand rather than through the repo's release
  script, and the script was the thing that bumped this field — so the file sat at `0.6.0` while
  the tag moved three times. Nothing consuming muse noticed, which is exactly why it went unseen
  for three releases: consumers pin a tag, so this field is read by people and by nothing else.
  That is the argument for keeping it honest rather than deleting it.

- **The demo, the docs examples and `CHARTE.md` say Antenne, not Nook.** The bus was renamed and
  the old host is gone — `nook.facile.studio` is NXDOMAIN — so the Pool settings demo shipped a
  default instance URL that resolved to nothing. The one library file this touches,
  `src/lib/utils/secret.ts`, changes a doc comment and nothing executable.

### Removed

- **`scripts/release.sh` is gone, and releasing points at the suite-wide preflight instead.** It
  was the only release script in twenty-eight repos, and an automation that exists in one repo
  out of twenty-eight is one nobody reaches for by habit — which is how three tags came to be cut
  by hand. The checking half now lives suite-wide as the `release-preflight` flow, which compares
  `package.json` against the newest tag in *any* repo rather than preventing the drift in one.
  What is lost is the automatic bump; `docs/development.md` now says to make it by hand, and why
  the field drifts when nobody does.

### Documented

- **`MIGRATION.md`'s consumer census was two repos and four pins out of date.** It said thirteen
  apps; it is fifteen repos. Journal is on `#v0.6.3` and GFConseil is pinned to a raw commit
  rather than a tag. The census also names the rollout that matters: v0.6.1's `SecretField` fix,
  which only Journal has taken, so every settings page below it still pushes the document
  sideways on a phone.

## [0.6.3] — 2026-08-18

### Added

- **`notebook` joins the icon map.** Journal's mark is `solar:notebook-bold-duotone`, in its rail
  and on its login page, and the map did not carry it — so Journal bundled the artwork itself
  through `registerIcons()`. That is the documented fallback and it works, but a glyph a product
  uses as its identity belongs in the map, where the whole suite gets it for free.

  It is also the first key added since renamed aliases broke regeneration, which makes it the
  change that proves v0.6.2's fix works.

## [0.6.2] — 2026-08-18

### Fixed

- **`scripts/build-icons.ts` follows a renamed upstream alias, so the icon map can be regenerated
  at all.** Regeneration died on `solar:magnifer-linear is not in the solar collection`, about a
  name the Iconify search endpoint answers for happily. It is not missing: Solar renamed it, and a
  renamed name comes back under `aliases` pointing at its new parent rather than under `icons`.
  Two of ours had moved that way — `magnifer-linear` to `magnifier-linear`, `text-linear` to
  `text-format-linear` — and reading only `icons` reported both as absent. That blocked every
  regeneration, and so blocked adding any new glyph to the map at all.

  The lookup now follows an alias to its parent, refuses a cycle, and refuses an alias carrying
  `rotate`/`hFlip`/`vFlip` rather than drawing it untransformed and wrong.

  `src/lib/icons-data.ts` is regenerated in the same commit: 43 icons of pure coordinate
  precision, `M18.7491` where upstream used to serve `M18.75`. Same artwork, nothing visible.
  Committed together deliberately, so the next person to run the script does not meet an 86-line
  diff with no explanation.

## [0.6.1] — 2026-08-18

### Added

- **`BlockReveal`, a panel wipe.** A solid panel crosses the copy — in from the left, out to the
  right — and the text is only ever uncovered by its trailing edge. It comes from the Facile
  vitrine, where it was written and then pulled back out because it needs a dark surface to read.
  Parked here so the suite keeps it and the next dark hero does not rewrite it.

  Parent-driven through `open`, or self-observing on a band when `open` is left out. `panel` is a
  token (`accent` or `page`) rather than the vitrine's two hex literals. Core GSAP only: no
  `SplitText`, no `ScrollTrigger`, just an `IntersectionObserver`. The copy is `visibility:
  hidden` in the markup, so a server-rendered page never flashes it ahead of its own panel.

- **`SideBar`'s `Page` type takes an optional `group`, printed when it changes.** Section headings
  are expressed by the order of the array rather than by a second nesting level, and a flat list
  with no `group` behaves exactly as before. The heading hides while the rail is collapsed — a
  68px column has no room for it and the icons still read as a list. Found by building muse's own
  site out of `SideBar` instead of a hand-rolled nav.

### Changed

- **Icons are bundled into the package and drawn as inline `<svg>`. Three problems stop being
  yours.** muse rendered `<iconify-icon>`, a custom element that fetched its glyph from
  `api.iconify.design` on first paint — in a suite whose product promise is "zéro dépendance
  cloud". The paths for every name in `icons.ts` are frozen into the package now.

  - **The registration step is gone.** `import 'iconify-icon'` was one of three documented
    adoption traps, and forgetting it made every icon vanish with no console error and nothing in
    the build log. Delete it, and drop `iconify-icon` from your `package.json`.
  - **The 0×0 flash is gone.** The element had no intrinsic size, and its `width`/`height`
    attributes did nothing until the fetch landed — measured at ~400ms, during which a button
    rendered at label width and then jumped wider. It is also what made `Tabs`' sliding pill
    measure one icon too narrow and stay clipped forever.
  - **Icons render during SSR.** They were client-only; they are in the static HTML now.

  `icons` and every `icon` prop keep their shape, so no call site changes. A name muse does not
  carry still falls back to `<iconify-icon>`, so an app passing its own `solar:*` string keeps
  working — and `registerIcons()` lets it bundle those too rather than reaching for the network.
  `MIGRATION.md` §14 has both routes. Attribution travels with the artwork: Solar is CC BY 4.0,
  MDI is Apache 2.0, both are credited in `LICENSE`, and a test fails the build if a bundled
  collection is not. The trial typeface that shipped through v0.5.0 is why that is a rule rather
  than a good intention.

- **Every visible string is reachable from outside its component, and the defaults are French.**
  `Dropzone` rendered a hardcoded "Browse" and announced "Release to add files" to assistive
  technology, with no prop reaching either, in a suite that ships in French — found while an agent
  wrote the docs example for it and discovered the string it wanted to translate had no prop.
  `Spinner`'s `label` defaulted to "Loading".

  `Dropzone` now takes `browseLabel` and `dropAnnouncement`, and the defaults across these are
  French. **If you were relying on the English defaults, pass them explicitly.** It is the same
  shape of mistake as the trial typeface: something in the library assumed an audience the
  products do not have, and nothing in the build disagreed. `no-orphan-strings.test.ts` fails the
  build on literal prose baked into markup, so it cannot come back.

### Fixed

- **`SecretField` no longer pushes the page sideways on a phone.** Its root was a bare flex
  column, so as an item of `SettingsRow`'s children row it sized to `max-content`. The box already
  carried `min-w-0` and the value already carried `truncate` — the truncation was correct, it
  simply never had a width to truncate against. **Every settings page in the suite overflowed
  horizontally on a phone because of it.**

  Measured in a 390px frame with the field's own markup: 540px before, 540px still with `min-w-0`
  moved onto `SettingsRow`'s wrapper, 388px with `w-full min-w-0` on the `SecretField` root. So
  the fix is here and not in `SettingsRow`, which is where it was first looked for. At 900px all
  three measure identically, so full width costs nothing on a desktop row.

- **`SideBar`'s nav column scrolls, instead of the page behind it.** Reported on mobile as "the
  floating nav will not scroll, the background does", and it was two causes. The rail's root is
  `overflow-hidden` — correctly, or the collapse tween shows content spilling past a shrinking
  rail — and the column inside it had no scroll of its own, so a list taller than the viewport was
  clipped with no way to reach the rest. It is `min-h-0 flex-1 overflow-y-auto overscroll-contain`
  now. `min-h-0` is the load-bearing half: a flex child will not shrink below its content without
  it, so `overflow-y-auto` never engages and the column just pushes the user card off the bottom.
  `overscroll-contain` is the other half — without it a flick past either end chains into the
  document, which is what "the background scrolls" describes.

  Any app whose rail has more entries than a short viewport can hold had the same clipped list.
  Nothing to change; if you capped your `pages` array or overrode the rail's overflow to work
  around it, you can stop.

- **`Sparkline`'s end caps are no longer shaved flat.** `padX` was `1` against a 2px stroke with
  round caps: half a stroke sits outside the path, so the first and last cap landed exactly on the
  `viewBox` edge and antialiasing took them off. Padding derives from the stroke now — measured in
  a browser, the painted extent moved from `0.00 → 128.00` in a 128-wide box to `1.00 → 127.00`.
  A test pins the relationship, so a future stroke change cannot quietly bring it back.

### Documented

- **Every component carries a `<!-- @component -->` block, in French, saying what it is for.**
  This is Svelte's own place for it, so it shows on hover in every editor across every consuming
  app — the value lands well beyond the docs site. Where the charter has an opinion the block
  carries it: `Divider` owns no margin, a `Switch` in a `SettingsRow` takes `aria-label`, never
  pass your own colours to a chart, `ConfirmModal` is not a `Modal` with two buttons.

## [0.6.0] — 2026-08-09

### Added

- **A layout tier: `Page`, `PageHeader`, `Section`, `Stack`, `Inline`, and a `Gap` scale named by
  use.** muse shipped 51 components and no way to lay a page out, so thirteen apps each invented
  one. The census that made the case: eight different page containers (max widths from `fc-md` to
  `max-w-7xl`, column gaps of 4, 6, 8 and 10, one with no gap), nine settings shells with five
  different top-level spacings, three hand-written `PageHeader`s each citing CHARTE §4 in a
  comment and each disagreeing with the other two, and 57 hand-typed `gap-4`s in Vision alone.

  The gap scale is named by what a distance means rather than what it measures: `bound` (4px, two
  parts of one thing), `tight` (8px, controls used together), `content` (16px, siblings in a
  block), `section` (40px, separate topics). There is deliberately no rung between `content` and
  `section` — "related, but a bit less" is the distinction nobody applies consistently, and it is
  where the three different page-column gaps came from.

  `no-outer-margin.test.ts` enforces the rule prose could not: it parses each component with the
  Svelte compiler, resolves `class={classes}` back through the instance script, and fails on any
  margin utility that is not auto or zero. CHARTE §4 already said the right thing and was skipped.

- **`ColorPicker` is now a real colour picker, and the palette one is `SwatchPicker`.** What
  shipped as `ColorPicker` never picked a colour: it offered a fixed palette and let you choose a
  member of it. That is the right control for "which of our eight calendar colours is this", and
  the wrong one for "what colour is this product" — Boutique's back office had the consequence, a
  shop owner typing `#111111` into a bare text field, which is the moment software stops looking
  finished. The new atom pairs `<input type="color">` with a hex field that accepts `fff`, `#FFF`
  or `#ffffff` and never clobbers a half-typed one, with optional swatches as shortcuts.

  **Reusing the freed name is the sharp edge here.** `import { ColorPicker }` keeps resolving and
  keeps type-checking, and the props of the two do not overlap — so a consumer that bumps without
  reading gets a control that silently ignores `colors` and `showLabels`. `MIGRATION.md` §9 has
  the rename and the one-line `sed`.

- **Every component declares `export interface <Name>Props` in `<script module>`, and the barrel
  re-exports them.** They were anonymous types on the `$props()` destructure, which nothing could
  read — so consumers got no prop types at all, which is why a rename inside muse could not fail
  `svelte-check` in any of the thirteen apps. Three components stay `export type` because their
  props are a union an interface cannot extend. `scripts/props-shape.test.ts` fails the build on a
  component with `$props()` and no exported interface.

### Changed

- **Tailwind's stock palette is deleted.** `tokens.css` resets the `--color-*` namespace, so
  `bg-red-500` and `text-slate-700` now generate nothing at all: an off-system colour stops being
  a rule someone can skip and becomes a class that produces no CSS. The element renders unstyled
  rather than wrong, and nothing errors — check before you bump. Measured first: twelve of the
  thirteen consumer apps already used zero stock-palette utilities and muse itself used none; only
  Agenda had any, 13, all shadcn leftovers. `white`, `black`, `transparent` and `current` are put
  back, because they are theme-neutral primitives rather than palette choices.

- **`SettingsSection` is now a preset of `Section`.** That component was always structurally
  generic and only ever used under `/settings` because of what it was called. `SettingsSection`
  delegates and keeps the card default, so the nine repos importing it are unaffected.

- **`cn` knows the container and nav-width tokens.** Without them `tailwind-merge` cannot see that
  a consumer's `max-w-4xl` conflicts with `Page`'s `max-w-fc-lg`, so both survived and the cascade
  decided — the silent-override failure that module exists to prevent.

### Removed

- **The bundled Goga typeface, which was the trial cut.** 69 glyphs over 68 codepoints, covering
  `` !,-.0123456789?A-Za-z`` and nothing else: no accented Latin, no apostrophe, no colon, no
  percent sign. `tokens.css` set it on `--font-fc-body`, `--font-fc-title` and `--font-sans`, so
  **in a French-language suite every accented character fell back to Helvetica mid-word**, at a
  different weight and x-height — and so did every clock time, every percentage, the masked-secret
  bullets, and the command chips in `SideBar`. The demo and the smoke app are written in unaccented
  English, which is why nothing caught it. The files also carried a test licence, and the repo had
  no `LICENSE` at all.

  Type falls back to the platform sans stack, which renders every character the suite types. A
  `LICENSE` is added, and `fonts.test.ts` parses the cmap of anything under `src/lib/fonts/` and
  fails the build on a face that cannot render what the suite writes. `SideBar` loses an optical
  `translate-y` derived from that face's own metrics — the platform stack resolves differently per
  OS, so there is no number left to derive. Delete any local `@font-face` or preload link still
  pointing at Goga.

- **`Divider`'s `my-4`.** All twenty-four call sites across the suite cancelled it with
  `class="my-0"`, including both usages inside muse itself, and the CHARTE example taught the
  workaround as the idiom. Copied out of its `gap-4` parent it welds the rule to whatever sits
  above it. Space between siblings belongs to the parent, so the rule carries none. Rules may now
  sit tighter than before; where one looks welded, the parent is missing a gap.

- **`Carousel`, `Mosaique`, `Rideau` and `WordReveal`, and with them GSAP's `ScrollTrigger` and
  `SplitText`.** The first three had **zero** consumers anywhere in the suite, checked by grepping
  `<Component` across all thirteen apps rather than by counting string matches. `WordReveal` had
  one consumer and was the library's only GSAP-plugin importer, so removing it takes both plugins
  out of the library entirely: the demo bundle drops from 152 kB to 126 kB gzipped, about 17%.
  `MIGRATION.md` §4 has the vendoring recipe, including the two teardown traps and the scroller
  declaration the Facile shell needs.

### Fixed

- **`Checkbox`, `Radio` and `Switch` were labelling nothing.**
  `<Field label="Notify me"><Checkbox /></Field>` type-checked, rendered, looked right, and
  produced a `<label for="…-control">` pointing at no element plus a checkbox with no accessible
  name. `utils/field.ts` was written to prevent exactly this and its own comment says so; the fix
  had reached `Input`, `Select` and `Textarea` and stopped at the three controls that wrap
  themselves in a `<label>`. They adopt the field's id, `aria-describedby` and `aria-invalid` now,
  like every other control.

  `smoke.sh` pulls every `<label for>` out of the server-rendered HTML and fails on one pointing
  at an id no labelable element carries. Proven both ways — it passes as shipped, and removing
  `Checkbox`'s `id` reproduces the failure with the offending label quoted.

- **`Radio` no longer claims an `aria-invalid` it cannot carry.** Validity belongs to the radio
  group, not to one button inside it, and `role="radio"` does not support the attribute — a screen
  reader either ignores it or announces every option as invalid because one is. The prop and the
  derived value are gone rather than left unread.

- **`Field`'s snippet parameters work.** `FieldProps` intersected `HTMLAttributes<HTMLDivElement>`,
  whose own `children?: Snippet<[]>` contradicts `Snippet<[{ id, describedBy }]>`; an intersection
  swallows that and produces a type accepting neither arity, which is why
  `{#snippet children({ id })}` failed with "Expected 1 or more, but got 0" and consumers reached
  for `getFieldContext()` instead. Surfaced by the move to `interface extends`, which checks
  compatibility and errored on sight.

- **`Spinner` under `prefers-reduced-motion` turns once every three seconds** instead of freezing
  into a static ring that indicates nothing.

- **`Toaster` moves to `z-60`.** It shared `z-50` with `MobileNav`, so on a phone the toast strip
  and the bottom bar were tied and resolved by DOM order — the exact collision the documented
  z-scale exists to prevent.

- **The four charts and `Toaster` spread `...rest`**, so `id`, `data-*` and `aria-label` finally
  have somewhere to go.

## [0.5.0] — 2026-08-07

### Changed

- **`SideBar` splits `showCollapse` from `showSearch`. Breaking.** The Collapse row lived inside
  the `showSearch` branch and `showSearch` defaults to `false` — so every consumer that bound
  `collapsed` shipped the whole width tween with nothing a user could press. Vision, Jardin and
  Antenne all did. The two rows are independent now and `showCollapse` defaults to `true`; a rail
  that must stay expanded passes `showCollapse={false}`.

### Added

- **The ⌘K and ⌘D chips do something.** They were painted hints with no listener behind them. One
  document keydown listener backs both, and ⌘K only binds when `onSearch` is passed, so an unwired
  Search row no longer advertises a shortcut it cannot honour.

  Note the two-rail case, since the chip invites it: two `SideBar`s bound to one `collapsed` value
  cancel each other and nothing moves; with separate state the rails drift apart.

[Unreleased]: https://github.com/FacileStudio/muse/compare/v0.6.3...HEAD
[0.6.3]: https://github.com/FacileStudio/muse/releases/tag/v0.6.3
[0.6.2]: https://github.com/FacileStudio/muse/releases/tag/v0.6.2
[0.6.1]: https://github.com/FacileStudio/muse/releases/tag/v0.6.1
[0.6.0]: https://github.com/FacileStudio/muse/releases/tag/v0.6.0
[0.5.0]: https://github.com/FacileStudio/muse/releases/tag/v0.5.0
