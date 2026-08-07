# Charte graphique — Facile UI

Visual contract for every Facile tool. Agents read this **before** generating any UI.

> Status: **matches the shipped Facile Suite look** (Sablier / Nuage / Casier / Plume /
> Courrier), audited 2026-08-07. Chroma-zero OKLCH for chrome; colour appears only in
> `--fc-danger`, the role pills, and the six chart series slots.

---

## 1. Brand

- **Name**: Facile
- **Tone**: clean, technical, quiet — no color noise outside destructive states and
  semantic role pills.
- **Voice in UI copy**: <!-- TODO -->

---

## 2. Color tokens

CSS custom properties. Source of truth: `src/lib/styles/tokens.css`.

| Token               | Light                | Dark                  | Usage                       |
|---------------------|----------------------|------------------------|-----------------------------|
| `--fc-page`/`--fc-bg`| `oklch(1 0 0)`       | `oklch(0.09 0 0)`      | page background             |
| `--fc-surface`       | `oklch(0.97 0 0)`    | `oklch(0.18 0 0)`      | muted fills, hover states   |
| `--fc-component`     | `oklch(0.985 0 0)`   | `oklch(0.13 0 0)`      | cards, sidebar/panel bg     |
| `--fc-fg`             | `oklch(0.145 0 0)`  | `oklch(0.985 0 0)`     | primary text                |
| `--fc-fg-muted`       | `oklch(0.556 0 0)`  | `oklch(0.6 0 0)`       | secondary text               |
| `--fc-accent`         | `oklch(0.145 0 0)`  | `oklch(0.985 0 0)`     | primary action — same as fg, **inverted not tinted** |
| `--fc-accent-fg`      | `oklch(1 0 0)`      | `oklch(0.09 0 0)`      | text on accent               |
| `--fc-border`         | `oklch(0.9 0 0)`    | `oklch(1 0 0 / 10%)`   | dividers, outlines            |
| `--fc-ring`           | `oklch(0.4 0 0)`    | `oklch(0.6 0 0)`       | focus rings                   |
| `--fc-danger`         | `oklch(0.55 0.22 29)`| `oklch(0.65 0.22 29)` | destructive — **the one chroma token** |
| `--fc-success`        | `oklch(0.6 0.16 145)`| `oklch(0.7 0.16 145)` | success / positive             |

### Chart series tokens

Charts are the one place the suite needs categorical colour, so they get their own
namespace — `--fc-chart-1` … `--fc-chart-6`, exposed as `fc-chart-N` Tailwind colours and
read in SVG as `var(--color-fc-chart-N)`.

These are **Sablier's identity palette** (`apps/client/src/lib/user-colors.ts` — the same
hues users pick for themselves). Light mode stays deliberately close to those pastels; the
lightness is pulled only as far as the validator's band allows (0.43–0.77), and the aqua is
taken deeper than the rest because Sablier's `#7EEEDB` reads as flashy at chart scale. Dark
mode is a separate, deeper set — the same hues stepped for the dark band, not a flip.

| Slot | Hue | Light | Dark |
|------|-----|-------|------|
| 1 | purple | `oklch(0.7 0.15 292)` | `oklch(0.58 0.15 292)` |
| 2 | orange | `oklch(0.755 0.13 64)` | `oklch(0.66 0.14 64)` |
| 3 | aqua | `oklch(0.72 0.11 190)` | `oklch(0.6 0.12 195)` |
| 4 | red | `oklch(0.68 0.15 15)` | `oklch(0.55 0.16 15)` |
| 5 | green | `oklch(0.76 0.16 135)` | `oklch(0.64 0.15 135)` |
| 6 | pink | `oklch(0.73 0.14 339)` | `oklch(0.62 0.14 339)` |

Both modes were validated, not eyeballed: every slot clears the OKLCH lightness band and
chroma floor, and the worst *adjacent* pair holds CVD ΔE 8.3 light / 9.3 dark (target ≥ 8)
with normal-vision ΔE 21.7 / 22.7 (floor ≥ 15).

**The slot order is load-bearing.** Sablier's set has three warm hues (red 15, orange 64,
pink 339) that collapse together under protanopia, so no ordering of the six passes on hue
alone — the palette leans on **lightness stagger** and on separating those three (minimum
120° between neighbours). Reordering the slots by taste will silently break CVD separation;
re-run the validator if you touch them.

Two caveats worth knowing:
- **Every light-mode slot sits under 3:1 against the light surface** (1.96–2.96:1). That is
  the deliberate price of keeping the pastel look, and it is legal only under the *relief
  rule* — every chart ships a legend and a hidden data table. Use these as **fills** (bars,
  areas, donut segments), and pair thin lines with markers and direct labels. Dark mode
  clears 3:1 on every slot.
- Slot 4 is a red adjacent in hue to `fc-danger`. It is a series colour, not a status one;
  keep using `fc-danger` for destructive state so the two never have to be told apart.

Declared in a **`@theme static`** block, and that matters: `chartColor()` builds the variable
name with a template literal, so `fc-chart-3`…`fc-chart-6` never appear literally in any
source file. A plain `@theme` only emits the variables Tailwind observed being used, which
left the later slots undefined — and an undefined `var()` in an SVG `fill` renders **black**.

Rules:
- **Assign by series index, in fixed order, never by rank.** A filter that drops a series
  must not repaint the survivors.
- **`fc-danger` and `fc-success` are reserved status colours** and are never series slots.
- Recommended ceiling is **6 series**; past that `chartColor()` wraps, so fold the tail into
  an "Other" bucket or facet into small multiples instead.
- Grid and axis lines are `fc-border`; tick labels are `fc-fg-muted` at `text-fc-xs`. Value
  and label text never wears the series colour — the mark beside it carries identity.

### Destructive actions

`Button` has two destructive variants and they are not interchangeable:

- **`danger`** — always-tinted (`bg-fc-danger/10 text-fc-danger`). For a standalone
  destructive action the user came to perform: a Danger Zone button, a modal's confirm.
- **`ghost-danger`** — transparent and muted at rest, tinting red only on hover
  (`hover:bg-fc-danger/10 hover:text-fc-danger`). For **destructive row actions** — delete
  in a table row, remove from a member list. A row of permanently red buttons turns a list
  into a hazard sign, but a delete that greys out like every other ghost button gives no
  warning at all. Quiet until you reach for it, red once you do.

Both pair with `icon={icons.remove}` and both should route through a `ConfirmModal`
(`tone="danger"`) rather than deleting on click.

**Active nav / selected state is inverted (`bg-fc-accent text-fc-accent-fg`), never
tinted.** Role/status pills are the one place extra chroma is allowed outside danger —
see Badge `owner`/`admin` tones below, which use the `fc-owner` / `fc-admin` tokens. Those
two are hue-matched to the identity palette (orange 64 / purple 292) but kept deep — they
are *text* on a 10% tint, so they need text contrast, not pastel lightness.

---

## 3. Typography

- **Sans**: Goga (`'Goga'`, `Helvetica`, `Arial`, `sans-serif`) — `--font-fc-body`
- **Display**: Goga — `--font-fc-title`. Same family as body; the display/body split is
  intentional-in-name-only so consumers can diverge without touching components.
- **Mono**: <!-- e.g. JetBrains Mono — TODO -->
- Only **Medium (500)** and **Semibold (600)** are bundled. Any other weight synthesizes —
  do not reach for `font-bold`, use `font-semibold`.

Scale — `text-fc-*`, each with a paired line-height:

| Token           | Size          | Line-height | Usage                        |
|-----------------|---------------|-------------|------------------------------|
| `--text-fc-xs`  | `0.75rem` 12px| 1rem        | meta, badges, hints          |
| `--text-fc-sm`  | `0.875rem` 14px| 1.25rem    | **body / UI default** — nav rows, buttons, table cells |
| `--text-fc-md`  | `1rem` 16px   | 1.5rem      | lead paragraphs, inputs      |
| `--text-fc-lg`  | `1.125rem` 18px| 1.75rem    | section headings (h3)        |
| `--text-fc-xl`  | `1.375rem` 22px| 1.75rem    | sidebar brand, h2            |
| `--text-fc-2xl` | `1.75rem` 28px| 2.125rem    | page titles                  |
| `--text-fc-3xl` | `2.25rem` 36px| 2.5rem      | hero / h1                    |

`14px` is the workhorse, matching the suite's `text-sm` default. Headings get
`tracking-tight` (`-0.02em`, applied to `h1`–`h6` in the base layer).

---

## 4. Spacing & layout

4-pt grid. Tokens: `--fc-space-1` = 4px, `--fc-space-2` = 8px, `--fc-space-3` = 12px, `--fc-space-4` = 16px, `--fc-space-6` = 24px, `--fc-space-8` = 32px, `--fc-space-12` = 48px.

Container max-widths:
- mobile: 100%
- `sm` ≥ 640px: 600px
- `md` ≥ 768px: 720px
- `lg` ≥ 1024px: 960px
- `xl` ≥ 1280px: 1200px

---

## 5. Radius & elevation

- `--radius-fc-xs` 4px, `--radius-fc-sm` 6px, `--radius-fc-md` 8px, `--radius-fc-lg` 12px, `--radius-fc-pill`/`--radius-fc-full` 999px
- No shadows beyond `shadow-sm`/`shadow-lg` on floating/overlay surfaces (dropdowns, Modal, Drawer, MobileNav bar).

**Container surfaces carry no border.** `Card`, `StatCard` and `Table` separate themselves
from the page with their **fill** (`bg-fc-component` against `bg-fc-page`), not with an
outline. A 1px box drawn around every panel reads as clutter once a page has more than two
of them. Do not add `border border-fc-border` back to a card, a chart wrapper, a profile
card or a list container.

1px `--fc-border` is still the right tool, but only for these:
- **separation *inside* a container** — rows in a member list, `<tbody>` row rules, the
  meta rows in `ProfileCard`, a footer above a `Drawer`'s actions;
- **form controls**, which need a visible edge to read as editable — `Input`, `Select`,
  `Textarea`, `SpaceSwitcher`'s trigger;
- **`Dropzone`**, whose dashed outline *is* the affordance;
- **floating surfaces**, which pair it with a shadow.

Because the light-mode fill is a subtle step (`oklch(0.985)` on `oklch(1)`), keep container
padding generous — the whitespace is doing the work the border used to.

---

## 6. Motion

- Default ease: `power3.inOut` (GSAP). Overlays are the exception — they use asymmetric
  easing (`power3.out` in, `power3.in` out); see §10.
- Default duration: `0.4s` UI, `1.5s` full-page curtain (`Rideau`)
- All motion **must** respect `prefers-reduced-motion: reduce` — fall back to opacity-only or instant.

### PageTransition

Route-level motion for SPA navigation. Wrap the routed view and give it the current route as
`key`; it fades and lifts the new page in on every change.

```svelte
<PageTransition key={current}>
  <Page />
</PageTransition>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `key` | `string \| number` | required | Changing it replays the transition |
| `duration` | `number` | `0.35` | Seconds |
| `distance` | `number` | `12` | Pixels of upward travel |

It animates **in only** — there is no exit tween, because a true crossfade needs both routes
mounted at once and that doubles every page's state. `Rideau` remains the tool for full-page
curtain navigation; `PageTransition` is for client-side route swaps.

---

## 7. Responsive rules

**Scrollbars are never visible.** `tokens.css` hides them globally (`scrollbar-width: none`
plus the `::-webkit-scrollbar` reset) in the base layer, so this is automatic — do not
re-enable them on a container, and do not hand-roll `[scrollbar-width:none]` utilities
either, it is already done.

The reason is layout, not taste: a classic scrollbar occupies real width, so the page jumps
sideways the instant content passes one screen, and jumps back when a modal locks the body.
Scrolling itself is completely untouched — wheel, trackpad, touch, keyboard and
`scrollIntoView` all behave normally. If something is unreachable, the container is the bug;
never "fix" it by showing a scrollbar. Long content still needs its own affordances: keep a
partial row visible at the fold, or pair the scroll area with arrows the way `Carousel` does.

- Mobile-first: write the small layout, then enhance with `sm:` / `md:` / `lg:`.
- Min supported width: **360px**.
- Hit targets ≥ **44×44px**.
- No fixed pixel heights for content areas; use `min-h-*` instead.
- Test at: 360, 414, 768, 1024, 1440.

---

## 8. Icons

- **Pack**: [Solar](https://icon-sets.iconify.design/solar/) via Iconify (`<iconify-icon>`)
- **Style**: **`linear`** — always `solar:*-linear` for UI chrome. This matches the shipped
  suite (Sablier, Nuage, Plume all use `solar:chart-2-linear`, `solar:folder-linear`, …).
  Reserve `bold-duotone` for **brand marks only** (an app's own logo glyph), never nav or
  action icons.
- **Color**: inherit `currentColor`. Do not tint icons with their own class — let the parent's
  `text-fc-fg-muted` / `text-fc-accent-fg` cascade, so inverted active states flip the icon too.
- **Size**: `width="16"` inline, `width="18"` nav rows, `width="24"` brand mark. Always pass
  `height` alongside `width` and add `class="block"` — `<iconify-icon>` is inline by default
  and its baseline descender knocks icon/label pairs out of vertical alignment.
- **Exception — plus, close, and chevrons (left/right/up/down)**: never Solar for these.
  Use [MDI](https://icon-sets.iconify.design/mdi/) instead — `mdi:plus`, `mdi:close`,
  `mdi:chevron-left/right/up/down`. Solar's plus/close/arrow glyphs read muddy at small
  sizes; MDI's are a single clean stroke.

Example:
```svelte
<iconify-icon icon="solar:settings-linear" width="18" height="18" class="block shrink-0"></iconify-icon>
```

Never default to Lucide or other packs without an explicit request.

### Pass icons as props, not as markup

Components that can carry an icon take it as a **string prop** — `Button` (`icon`,
`iconRight`), `NavButton` (`icon`), `SideBar` (`icon`). Do not hand-write `<iconify-icon>`
inside a component's children when a prop exists:

```svelte
<Button icon={icons.plus}>New project</Button>
<Button variant="danger" icon={icons.remove}>Delete</Button>
<Button icon={icons.settings} iconRight={icons.arrow}>Settings</Button>
```

The prop is what keeps the rules above from being re-litigated at every call site: it sizes
the glyph to the button (14px on `sm`, 16px on `md`/`lg`), always emits `width`, `height`,
`class="block shrink-0"`, and lets `currentColor` cascade so inverted states flip the icon
with the label. `children` still accepts arbitrary content when a prop will not do.

**Action buttons should carry an icon.** Destructive actions take `icons.remove`, creation
takes `icons.plus` — a delete button that looks exactly like every other button is how
people delete things by accident.

Same caveat as the rest of the library: `iconify-icon` is not a dependency, so `Button`'s
icon stays inert unless the consumer registers the custom element.

### Icon library — `src/lib/icons.ts`

Import via `import { icons } from '@facile/lib'`.

| Key | Icon | Key | Icon |
|-----|------|-----|------|
| `icons.home` | `solar:home-2-linear` | `icons.settings` | `solar:settings-linear` |
| `icons.dashboard` | `solar:chart-2-linear` | `icons.edit` | `solar:pen-new-square-linear` |
| `icons.folder` | `solar:folder-linear` | `icons.remove` | `solar:trash-bin-2-linear` |
| `icons.search` | `solar:magnifer-linear` | `icons.calendar` | `solar:calendar-linear` |
| `icons.collapse` | `solar:sidebar-minimalistic-linear` | `icons.notification` | `solar:bell-linear` |
| `icons.usersGroup` | `solar:users-group-rounded-linear` | `icons.userCircle` | `solar:user-circle-linear` |
| `icons.logout` | `solar:logout-2-linear` | `icons.warning` | `solar:danger-triangle-linear` |
| `icons.info` | `solar:info-circle-linear` | `icons.upload` | `solar:cloud-upload-linear` |
| `icons.clock` | `solar:clock-circle-linear` | `icons.refresh` | `solar:refresh-linear` |
| `icons.plus` | `mdi:plus` | `icons.close` | `mdi:close` |
| `icons.arrow` | `mdi:chevron-right` | `icons.chevronDown` | `mdi:chevron-down` |
| `icons.chevronUp` | `mdi:chevron-up` | `icons.chevronLeft` | `mdi:chevron-left` |

---

## 9. Accessibility

- Color contrast ≥ WCAG AA (4.5:1 body, 3:1 large text).
- Focus ring visible — `:focus-visible` outline using `--fc-accent`.
- All interactive elements reachable by keyboard.
- Iconify icons must have `aria-label` when standalone.

---

## 9. Navigation components

### NavBar

Collapsible vertical nav sidebar. Built on `Component` (inherits `bg-fc-component rounded-fc-md`). Manages its own collapsed state via `$bindable`.

```svelte
<NavBar
  icon="lucide:layout-dashboard"
  title="Facile"
  bind:collapsed
  showSearch
  pages={[
    { label: 'Home',     href: '/',        icon: 'lucide:home',     active: true },
    { label: 'Settings', href: '/settings', icon: 'lucide:settings' }
  ]}
  user={{ name: 'Gian', avatar: '/pfp.jpg' }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | — | Iconify icon for the header |
| `title` | `string` | `''` | App / section name |
| `pages` | `Page[]` | `[]` | Nav links. Each: `{ label, href, icon?, active? }` |
| `user` | `User` | — | `{ name, avatar? }` — shown in the footer button |
| `collapsed` | `boolean` | `false` | Bindable. Collapses to `77px` (`--width-fc-nav-collapsed`), labels hidden |
| `showSearch` | `boolean` | `false` | Renders a search NavButton with ⌘K hint |
| `class` | `string` | — | Passed through `twMerge` |

---

**Width tokens**: `--width-fc-nav-collapsed: 68px` / `--width-fc-nav-expanded: 220px`, plus
`--spacing-fc-nav-item: 44px` and `--spacing-fc-nav-content: 196px`. GSAP animates the rail
width between the two on toggle (`duration: 0.3, ease: power3.inOut`) — no delay, no per-row
stagger. The labels simply fade with `TextElevate`; a staggered cascade on top of a width
tween reads as two competing animations.

**Those numbers are a system, not four independent choices**, and breaking one shows up as a
jolt at the end of the collapse:

- `68 = 44 + 12 + 12` — the collapsed square exactly fills the rail's content box.
- `44px` is also `min-h-11`, the **expanded row height**. Because they match, the moment the
  collapsed layout lands nothing changes height. When the square was 53px against 44px rows,
  every row in the nav grew 9px at that instant and the whole column jumped.
- `196 = 220 - 12 - 12` — the expanded content width, for block children (see below).

Vertical spacing in the nav column is `[&>*+*]:mt-5`, not `gap-5`. A flex `gap` belongs to
the *container*, so it vanishes the instant a child unmounts and cannot be animated; a margin
belongs to the child, so `transition:slide` animates it away with the element's height.

**Collapse and expand are not symmetric, and the asymmetry is the whole trick.** `SideBar`
keeps a private `narrow` state that lags the public `collapsed` prop, and every row reads
`narrow`, never `collapsed`:

- **Expanding** switches the layout *first*, then grows the rail — the new width reveals
  labels that are already there.
- **Collapsing** keeps the wide layout, shrinks the rail so it clips the labels away, and
  switches to the narrow layout only in the tween's `onComplete`.

Bind the rows straight to `collapsed` and the icons snap to the centre of a still-220px rail
before it has moved a pixel, then the rail catches up. The layout switch must be driven by
the animation, not by the state flag that starts it.

**Block children of the sidebar are the exception** — they key off `collapsed`, not `narrow`,
and carry their own fade. `SpaceSwitcher` sits in the column as a `w-fc-nav-content` fixed
block (`--spacing-fc-nav-content: 196px`) wrapped in `transition:slide`. Two reasons: a
`w-full` block *reflows* as the rail narrows instead of being clipped like the labels, and a
plain `{#if}` pops it in and out at whichever end of the tween it flips. The fixed width
makes the rail clip it horizontally; `slide` animates its height *and* margin to zero over
the same 300ms as the width tween, so the rows below drift up instead of snapping; and
Svelte holds the node in the DOM until the outro lands.

**A collapsed nav item is a fixed `size-fc-nav-item` square — never `w-full aspect-square`.**
The rail geometry is `77px = 53px item + 12px padding either side`. `aspect-square` looks
equivalent at rest but ties the item's *height* to its animating width, so mid-collapse each
button renders ~200px tall and shrinks — the inverted active row turns into a giant black
square for a few frames. Any fixed dimension is immune; a derived one is not.

**The `icon` prop is the brand mark — it is the one icon that stays `bold-duotone.`**
Everything else in the sidebar (nav rows, search, collapse, the footer settings gear) is
`solar:*-linear`. Pass `solar:<glyph>-bold-duotone` at `width="24"`; the duotone weight is
what makes the app's identity read against a column of hairline chrome icons.

### NavButton

The atomic button unit used inside NavBar. Also standalone for custom nav UIs.

```svelte
<!-- As a link -->
<NavButton href="/dashboard" icon="lucide:home" label="Home" active />

<!-- As a button with custom snippets -->
<NavButton>
  {#snippet children()}
    <Avatar name="Gian" size="sm" />
    <span>Gian</span>
  {/snippet}
  {#snippet right()}
    <iconify-icon icon="lucide:settings" width="14" />
  {/snippet}
</NavButton>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | Renders as `<a>` when provided |
| `icon` | `string` | — | Iconify icon (left) |
| `label` | `string` | — | Text label (hidden when `collapsed`) |
| `active` | `boolean` | `false` | Accent highlight |
| `collapsed` | `boolean` | `false` | Hides label and right snippet |
| `class` | `string` | — | Passed through `twMerge` |
| `children` | `Snippet` | — | Overrides the entire left side |
| `right` | `Snippet` | — | Right-side content (hidden when collapsed) |

**Style invariants**: `px-3 py-3 w-full`, `gap-2`, `rounded-fc-sm`, `overflow-hidden`, icon `width="20"` (no color class — inherits `currentColor`), label via `TextElevate` at `text-fc-sm`. No border. Inactive: `text-fc-fg-muted`, `hover:bg-fc-surface hover:text-fc-fg`. Active: **inverted**, `bg-fc-accent text-fc-accent-fg font-medium` — never a tinted wash.

**Press animation**: scale `0.94` in `0.08s power2.in`, then `elastic.out(1, 0.4)` back to
`1` in `0.5s`. Implemented as a `use:springPress` Svelte action — `SideBar`'s footer button
uses the identical curve, so every pressable row in the nav feels the same.

### SpaceSwitcher

Dropdown to switch between a personal context and a list of team spaces. Ported from
Sablier's `SpaceSwitcher.svelte`, kept framework-agnostic (no `$app/navigation`, no
backend types — consumer wires selection via `onSelect`).

```svelte
<SpaceSwitcher
  spaces={[{ id: '1', name: 'Acme' }]}
  activeId={currentSpaceId}
  onSelect={(id) => setActiveSpaceId(id)}
  manageHref="/spaces"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spaces` | `{ id, name }[]` | `[]` | Team spaces to list |
| `activeId` | `string \| null` | `null` | Currently selected space, `null` = personal |
| `onSelect` | `(id: string \| null) => void` | — | Called on selection |
| `personalLabel` | `string` | `'Personal'` | Label for the personal/no-space option |
| `manageHref` | `string` | — | If set, renders a footer link to manage spaces |
| `manageLabel` | `string` | `'Manage spaces'` | Footer link text |
| `class` | `string` | — | Passed through `twMerge` |

**The dropdown flips.** On open — and on resize or any scroll while open — it measures the
trigger's `getBoundingClientRect()` against the viewport and drops **up** (`bottom-full`)
when there is less than 160px below and more room above. It also caps its own `max-height`
to the space actually available, so the list scrolls internally instead of running off
screen. This matters in the sidebar specifically: the switcher sits near the top on desktop
but the same component lands low in short viewports and inside drawers. Any muse dropdown
anchored to a trigger owes the user this behaviour — a menu that opens off-screen is simply
broken.

Wired into `SideBar` via its own `spaces` / `activeSpaceId` / `onSpaceSelect` /
`manageSpacesHref` props — renders between the header and search/nav when `spaces` is
non-empty and the sidebar isn't collapsed.

### MobileNav

Floating glass pill bar for `< md` viewports, fixed to the bottom, safe-area aware.
Ported from Sablier's `MobileNav.svelte`.

```svelte
<MobileNav
  items={[{ href: '/dashboard', label: 'Dashboard', icon: 'solar:chart-2-linear', active: true }]}
  user={{ name: 'Gian', avatar: '/pfp.jpg' }}
  profileHref="/settings"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ href, label, icon, active? }[]` | `[]` | Nav destinations, icon-only |
| `user` | `{ name, avatar? }` | — | Shown as a trailing avatar pill |
| `profileHref` | `string` | — | Renders the avatar pill as a link |
| `profileActive` | `boolean` | `false` | Inverts the avatar pill like an active item |
| `class` | `string` | — | Passed through `twMerge` |

Style: `rounded-fc-pill bg-fc-bg/70 backdrop-blur-2xl backdrop-saturate-150 shadow-lg` —
no border and no ring; the blur and the shadow do the separating. Active item inverted
(`bg-fc-accent text-fc-accent-fg`).
Hidden at `md:` and above — pair with `SideBar` for desktop.

### Badge role tones

`owner` and `admin` tones render the colored role pills used across Nuage/Courrier/Plume
member lists — the one deliberate exception to the chroma-zero rule, matching real
member-role UI: `owner` → `bg-amber-500/10 text-amber-600`, `admin` → `bg-blue-500/10
text-blue-600`. Use `neutral` for a plain `member` role.

---

## 10. Overlays

`Modal`, `ConfirmModal` and `Drawer` are all native `<dialog>` elements opened with
`showModal()` — that buys the top layer, the focus trap, Escape and a real `::backdrop`
without a line of custom code.

**Two invariants for anything built on `<dialog>`:**

1. **Positioning must be explicit.** Tailwind preflight resets `margin: 0`, which kills the
   UA centering a modal dialog relies on. `Modal` restores it with `m-auto`; `Drawer` pins
   itself with `mt-auto mb-0 mx-auto` + `w-full max-w-none`. Drop those and the dialog
   renders flush against the top-left corner in every consumer.
2. **The animated element owns the surface styling.** `Drawer`'s `<dialog>` is transparent
   and its inner panel carries the background, border and radius — otherwise the background
   sits still while the panel slides out from under it.

Motion: overlays use asymmetric easing (`power3.out` in, `power3.in` out) rather than the
library default `power3.inOut`. Modal 0.2s / 0.15s, Drawer 0.35s / 0.25s. Both skip tweens
entirely under `prefers-reduced-motion`. The backdrop is instant, not faded — `::backdrop`
is not a tweenable target.

### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Bindable |
| `title` | `string` | — | Renders an `h2`; ignored when `header` is passed |
| `dismissible` | `boolean` | `true` | `false` blocks Escape and backdrop clicks |
| `showClose` | `boolean` | `false` | 44px `mdi:close` button, only when `dismissible` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `max-w-sm` / `max-w-md` / `max-w-lg` |
| `onclose` | `() => void` | — | Fires once, after the exit tween |
| `header` / `footer` | `Snippet` | — | Replace the heading / append below the body |

### ConfirmModal

Composed on `Modal` — never re-implement the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Bindable |
| `title` | `string` | required | Heading |
| `description` | `string` | — | Muted body line |
| `confirmLabel` / `cancelLabel` | `string` | `'Confirm'` / `'Cancel'` | Button text |
| `tone` | `'default' \| 'danger'` | `'default'` | `danger` → danger button + tinted `solar:danger-triangle-linear` badge |
| `icon` | `string` | — | Overrides the badge icon |
| `onconfirm` | `() => void \| Promise<void>` | — | A promise disables both buttons and shows a Spinner; resolves → close, rejects → **stays open** |
| `oncancel` | `() => void` | — | Cancel button, Escape and backdrop all route here |

Rules that are not negotiable, because they are what stops people deleting things by
reflex:
- **Focus lands on Cancel**, never Confirm.
- **While a confirm is pending the dialog is not dismissible** — no Escape, no backdrop.
- Button order is `flex-col-reverse` on mobile (confirm on top) and `sm:flex-row
  sm:justify-end` on desktop (cancel left, confirm right).

### Drawer

Bottom sheet, the mobile counterpart to `Modal`. Full-bleed under `sm:`, capped at
`max-w-fc-sm` and centred above it, `max-h-[85dvh]` with the body scrolling inside.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Bindable |
| `title` / `description` | `string` | — | Header text, `title` wired to `aria-labelledby` |
| `footer` | `Snippet` | — | Pinned below the scroll area, carries the safe-area padding |
| `showHandle` | `boolean` | `true` | Drag grabber in a 44px touch strip |
| `showClose` | `boolean` | `false` | 44px `mdi:close` button |
| `dismissible` | `boolean` | `true` | `false` disables Escape, backdrop **and** drag |
| `onclose` | `() => void` | — | Fires on the dialog's `close` event |

Drag-to-dismiss is on the handle and header only — never the scrollable body, or dragging
to scroll becomes ambiguous. Dismiss fires past **25% of panel height** or **0.5 px/ms**
downward velocity; anything less springs back over 0.3s. The bottom-most padded element
takes `pb-[max(1.25rem,env(safe-area-inset-bottom))]` to clear the iOS home indicator.

---

## 11. Charts

Dependency-free SVG — no chart library. `LineChart`, `BarChart`, `DonutChart` and
`Sparkline`, sharing `ChartLegend`, `ChartTooltip` and the maths in `src/lib/utils/chart.ts`
(`niceScale`, `linePath`, `areaPath`, `arcPath`, `chartColor`, `formatCompact`, `resize`).

Shared contract:
- Charts measure their container with a `ResizeObserver` and render at **real pixel
  dimensions** — never `preserveAspectRatio="none"`, which distorts strokes and text.
  `Sparkline` is the exception; it is decorative and scales with CSS.
- **Empty or all-zero data renders a muted `emptyLabel`**, never a broken axis or a `NaN`
  path.
- Every chart is `role="img"` with a summarising `aria-label` **plus a visually hidden
  `<table>`** of the values — identity is never carried by colour alone. That table must be
  wrapped in a `<div class="sr-only">`, never carry `sr-only` itself: **`overflow: hidden` is
  ignored on `<table>`** (a table box is not a block container), so the class clips the table
  visually via `clip-path` while its wide `white-space: nowrap` content still contributes
  scrollable overflow — and since `sr-only` is `position: absolute`, that overflow lands on
  the *document*, giving the whole page a horizontal scrollbar and a second vertical one.
- A hover layer is default-on everywhere except `Sparkline`: crosshair + per-series markers
  on `LineChart`, whole-category hit bands on `BarChart`, segment lift on `DonutChart`.
- Mount animation is 0.6s `power3.out` (line draw-in, bars from the baseline, donut sweep),
  skipped under `prefers-reduced-motion`.
- One axis. Never a second y-scale — two measures of different magnitude are two charts.

| Component | Key props |
|-----------|-----------|
| `LineChart` | `series`, `labels`, `area`, `smooth`, `showGrid`, `showLegend`, `yFormat`, `xFormat`, `yTicks`, `height` |
| `BarChart` | `series`, `labels`, `stacked`, `horizontal`, `showGrid`, `showLegend`, `yFormat`, `yTicks`, `height` |
| `DonutChart` | `data`, `size`, `thickness`, `showLegend`, `centerLabel`, `centerValue`, `valueFormat` |
| `Sparkline` | `data`, `height`, `area`, `smooth`, `color`, `showLast` |

`series` is `{ name, data: number[], color? }[]`; `DonutChart` takes
`{ label, value, color? }[]`. `smooth` uses Fritsch–Carlson monotone cubics, so the curve
can never invent a peak that is not in the data. Bar charts anchor their domain to zero —
a truncated baseline makes bar lengths lie.

---

## 12. Identity & files

### ColorPicker + `src/lib/colors.ts`

`USER_COLORS` is **Sablier's identity palette, byte-identical** — `#AD9EF0` Purple,
`#F09ED6` Pink, `#EE7E89` Red, `#EEB47E` Orange, `#A9EE7E` Green, `#7EEEDB` Aqua. These are
a **data contract already persisted in Sablier's database**, not design tokens: do not
re-tune them, and render them through inline `style:background-color`. That is the one
sanctioned exception to the no-hardcoded-colour rule (the chart tokens in §2 are a separate,
deepened derivation of the same hues — they are not interchangeable).

`normalizeUserColor()` is deliberately forgiving (trims, uppercases, adds a missing `#`,
falls back to the first colour) because this value arrives from a database column.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Bindable, the selected hex |
| `colors` | `readonly string[]` | `USER_COLORS` | Consumer-supplied palettes allowed |
| `labels` | `Record<string, string>` | `USER_COLOR_LABELS` | Falls back to the hex |
| `showLabels` | `boolean` | `false` | Names under each swatch, else a compact grid |
| `size` | `'sm' \| 'md'` | `'md'` | Changes the **dot**, never the hit target |
| `name` | `string` | — | Renders a hidden input so the value posts with a form |
| `onSelect` | `(color: string) => void` | — | Fires alongside the bind |

It is a real `role="radiogroup"` with a **roving tabindex** — one tab stop, arrows move and
select with wrapping, Home/End jump to the ends, Space/Enter go through the native button.
That is the whole point of it over a row of independently tabbable buttons.

**The selected check-mark ink is computed from the swatch's luminance, not tokenised**, and
that is deliberate. `@custom-variant dark` fires only on an explicit `.dark` class, while
token *values* also flip under `prefers-color-scheme` — so no `fc-*` foreground is
theme-invariant, and `text-fc-fg` would paint a white check on a light pastel for any
OS-dark user whose app doesn't set `.dark`. Any component drawing ink onto a caller-supplied
colour has this problem and needs the same treatment.

### ProfileCard

The normalised identity block, extracted from Sablier's profile route so every app renders
the same thing. Display only — the consumer owns saving.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Truncates |
| `email` | `string` | — | Truncates |
| `avatar` | `string` | — | Falls back to `Avatar`'s initial |
| `color` | `string` | — | Identity dot on the avatar, ringed in `fc-component` |
| `role` | `string` | — | `Badge`; `owner`/`admin` map to those tones, else `neutral` |
| `meta` | `{ label, value }[]` | `[]` | Generic key/value rows — rates, member-since, … |
| `actions` | `Snippet` | — | Right-aligned button area |
| `children` | `Snippet` | — | Below a divider — where a `ColorPicker` or form goes |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Horizontal stacks below `sm:` |

### Dropzone + UploadProgress

`Dropzone` is a drop target that is **also a real file input** — a `<label>`-wrapped
`<input type="file" class="sr-only">`, so click and keyboard are native paths, not
hand-rolled `tabindex` + click forwarding.

Two things that are always bugs if you skip them:
- **`dragenter`/`dragleave` must be counted, not toggled.** A boolean flickers every time
  the pointer crosses a child element.
- **The drop path ignores `accept`.** The browser only filters the file *dialog*; a dropped
  file arrives whatever its type. Validation runs through one shared function on both paths,
  and every rejection is reported via `onReject` with a `'type' | 'size' | 'count'` reason —
  never silently dropped.

`UploadProgress` does **no networking** — the consumer owns the upload and feeds state in.
It takes `items: { id, name, size?, progress, status, error? }[]` with status
`pending | uploading | done | error`, plus optional `onCancel` / `onRetry`. Progress is
clamped 0–100 because a consumer will eventually pass `NaN`. Status colours are the semantic
tokens, tinted not solid; rows carry `role="progressbar"` with the file name in the
`aria-label`, and a `pending` row omits `aria-valuenow` so it reads as indeterminate.

---

## 13. Component checklist

Before exporting a component:
- [ ] Uses tokens, no raw hex / px outside tokens
- [ ] Mobile-first layout, tested at 360px
- [ ] Keyboard + screen-reader accessible
- [ ] Respects `prefers-reduced-motion`
- [ ] Props documented with JSDoc
- [ ] Re-exported from `src/lib/index.ts`
