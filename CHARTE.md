# Charte graphique — Facile UI

Visual contract for every Facile tool. Agents read this **before** generating any UI.

> Status: **matches the shipped Facile Suite look** (Sablier / Nuage / Casier / Plume /
> Courrier). Audited and reconciled against source on 2026-08-07 — before that pass this
> document described spacing tokens that did not exist, a `NavBar` component that was renamed
> long ago, and two different collapsed-rail widths in the same section. Every value below was
> read out of `src/lib/` rather than remembered.
>
> Chroma-zero OKLCH for chrome; colour appears only in the status tokens, the two role pills,
> and the six chart series slots.

---

## 1. Brand

- **Name**: Facile
- **Tone**: clean, technical, quiet — no colour noise outside status and role meaning.
- **Voice in UI copy**: <!-- TODO -->

---

## 2. Color tokens

CSS custom properties. Source of truth: `src/lib/styles/tokens.css`.

| Token               | Light                | Dark                  | Usage                       |
|---------------------|----------------------|------------------------|-----------------------------|
| `--fc-page`          | `oklch(1 0 0)`       | `oklch(0.09 0 0)`      | document canvas             |
| `--fc-bg`            | `oklch(1 0 0)`       | `oklch(0.09 0 0)`      | a component's own default fill — same value as `page` today, separate so an app can tint one without the other |
| `--fc-surface`       | `oklch(0.97 0 0)`    | `oklch(0.18 0 0)`      | muted fills, hover states   |
| `--fc-component`     | `oklch(0.985 0 0)`   | `oklch(0.13 0 0)`      | cards, sidebar/panel bg     |
| `--fc-fg`             | `oklch(0.145 0 0)`  | `oklch(0.985 0 0)`     | primary text                |
| `--fc-fg-muted`       | `oklch(0.556 0 0)`  | `oklch(0.6 0 0)`       | secondary text               |
| `--fc-accent`         | `oklch(0.145 0 0)`  | `oklch(0.985 0 0)`     | primary action — same as fg, **inverted not tinted** |
| `--fc-accent-fg`      | `oklch(1 0 0)`      | `oklch(0.09 0 0)`      | text on accent               |
| `--fc-border`         | `oklch(0.9 0 0)`    | `oklch(1 0 0 / 10%)`   | dividers, outlines            |
| `--fc-ring`           | `oklch(0.4 0 0)`    | `oklch(0.6 0 0)`       | focus rings                   |
| `--fc-scrim`          | `oklch(0 0 0 / 50%)` | `oklch(0 0 0 / 50%)`  | overlay backdrops — same in both modes |
| `--fc-danger`         | `oklch(0.55 0.22 29)`| `oklch(0.65 0.22 29)` | destructive                    |
| `--fc-danger-fg`      | `oklch(1 0 0)`      | `oklch(1 0 0)`         | text on a solid danger fill   |
| `--fc-success`        | `oklch(0.52 0.12 150)`| `oklch(0.72 0.14 150)`| success / positive            |
| `--fc-info`           | `oklch(0.52 0.14 255)`| `oklch(0.72 0.13 255)`| informational status          |
| `--fc-warning`        | `oklch(0.55 0.13 75)`| `oklch(0.8 0.13 75)`   | caution                        |
| `--fc-owner`          | `oklch(0.55 0.13 64)`| `oklch(0.78 0.13 64)`  | `owner` role pill              |
| `--fc-admin`          | `oklch(0.5 0.16 292)`| `oklch(0.75 0.14 292)` | `admin` role pill              |

**Chrome is chroma-zero; chroma is reserved for meaning.** Everything structural — page,
surface, component, foreground, accent, border, ring — sits at chroma 0. Colour appears only
where it carries information: the five status tokens (`danger`, `success`, `info`, `warning`),
the two role pills (`owner`, `admin`), and the six chart series slots. Nothing else.

**The lightness of the tinted tokens is derived, not chosen.** `danger`, `success`, `info`,
`warning`, `owner` and `admin` are all read as `text-fc-<tone>` on `bg-fc-<tone>/10` — the
lowest-contrast use any of them gets. Every one clears **4.5:1 in that configuration**, in both
modes, and that is the constraint that sets the value. `warning` and `owner` used to sit at
`0.58` and measured 4.04:1 and 4.10:1 tinted — both failing the AA floor promised in §9 — which
is why they are now `0.55`. If you retune one, re-measure the tinted case, not the on-white one.

### The container step is deliberate, and it is small

`--fc-component` against `--fc-page` is a contrast ratio of **1.04:1** in light mode and
**1.03:1** in dark. That is the entire visual separation a `Card` gets, because §5 forbids
giving it a border. It is enough on a decent screen and it is *not* enough on a dim laptop, a
projector, or anything uncalibrated. Know that you are making that trade. If a specific surface
must survive bad conditions, raise it to `--fc-surface` rather than reintroducing an outline.

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
- **The status tokens (`fc-danger`, `fc-success`, `fc-warning`, `fc-info`) are reserved** and
  are never series slots.
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
tinted.** Role pills use the `fc-owner` / `fc-admin` tokens — hue-matched to the identity
palette (orange 64 / purple 292) but kept deep, because they are *text* on a 10% tint and so
need text contrast, not pastel lightness.

### One tone vocabulary

`Alert`, `Badge`, `StatusDot` and `ConfirmModal` all take a `tone`, and they take **the same
one**:

`neutral` · `accent` · `info` · `success` · `warning` · `danger` · `owner` · `admin`

Not every component uses every tone, but no component invents a name of its own. There is no
`muted`, no `default`, no `primary` — those were three different spellings of `neutral` and
they are gone. `Button` is the one component with a `variant` instead, and that is not a
synonym: `variant` selects an action's *emphasis and shape* (`primary`, `ghost`, `outline`),
`tone` selects a *semantic colour*. `danger` appears in both because a destructive action is
both things at once.

Semantic fills are **tinted** (`bg-fc-<tone>/10 text-fc-<tone>`), never solid. `neutral` is the
one untinted tone — it uses `fc-surface`.

**The text is the tone, and there is no border.** Both halves of that pairing are load-bearing:
a 10% wash under `text-fc-fg` body copy states the tone once, weakly, and adding a `/40` border
states the same thing a second time just as weakly — the result reads as an unstyled box rather
than a status surface. `Alert` shipped that way until it was brought in line with `Badge`.

Contrast is why the tone tokens sit where they do — `text-fc-<tone>` on its own 10% tint is the
lowest-contrast pairing in the system. Measured against sRGB relative luminance, light mode
clears AA on `fc-page` for all four (4.55–5.10:1) and dark mode clears it for info, success and
warning (4.74–5.48:1). Two pairings still miss 4.5:1 and are known: **`warning` on
`fc-component`** (4.37:1) and **`danger` in dark mode** (3.84:1 on `fc-component`). Deepening
those two tokens is the fix; it has not been done because the tokens are shared with `Badge`,
`StatusDot` and the role pills.

---

## 3. Typography

- **Sans**: Goga (`'Goga'`, `Helvetica`, `Arial`, `sans-serif`) — `--font-fc-body`
- **Display**: Goga — `--font-fc-title`. Same family as body; the display/body split is
  intentional-in-name-only so consumers can diverge without touching components.
- **Mono**: the platform stack — `--font-fc-mono`, used via `font-fc-mono`. Goga has no mono
  cut, so this deliberately downloads nothing. It is for **machine strings only**: secrets,
  API keys, IDs, endpoints, event channel names. Prose never wears it.
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

4-pt grid, supplied by **Tailwind's own spacing scale** — `p-1` is 4px, `p-2` 8px, `p-3` 12px,
`p-4` 16px, `p-6` 24px, `p-8` 32px, `p-12` 48px. muse defines **no `--fc-space-*` tokens** and
does not need to; use the stock utilities.

The only spacing values the theme adds are the two the nav geometry depends on, because they
are interlocked with the sidebar's width tween and cannot be picked freely:
`--spacing-fc-nav-item` (44px) and `--spacing-fc-nav-content` (196px). See §10.

### Dashboard rhythm

A page of cards has four spacings and they are ranked, not picked per component. Bottom to
top, each step is bigger than the one it contains:

| Step | Value | Where |
|---|---|---|
| Inside a card | `gap-4` (16px) | title → chart, label → value |
| Card padding | `p-5` (20px) | `Card`, and therefore `StatCard` and `SettingsSection` |
| Between cards | `gap-4` (16px) | grid gutters, and stacked rows of cards |
| Between sections | `gap-10` (40px) | the page's own column |

The rule that was being broken: **a gutter must not be tighter than the padding of the cards
it separates.** Dashboards here ran `gap-3` gutters around `p-4` cards, so three stat cards
read as one panel with seams. And a section's heading binds to its body with the same 16px
the body uses internally — heading and description are `gap-1` *inside* one block, never two
siblings of the section's own `gap-4`, or the description floats between the two and belongs
to neither.

```svelte
<div class="flex flex-col gap-10">
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <h2 class="text-fc-lg font-semibold text-fc-fg">Storage</h2>
      <p class="text-fc-sm text-fc-fg-muted">Across every space you own.</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-2"> … </div>
  </section>
</div>
```

A chart card in a grid row is as tall as its tallest neighbour. Give the chart `flex-1` so it
centres in the height it was handed instead of hanging off the title — `DonutChart` is
`justify-center` for exactly this.

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
- **floating surfaces**, which pair it with a shadow — `Modal`, `Drawer`, dropdowns, `Toast`.

**`ChartTooltip` is the exception.** It is 60px wide, it follows the pointer, and it lives
*inside* a chart card rather than on top of the page — so it separates itself with one step
of fill (`bg-fc-surface`, darker than the card in light mode and lighter in dark) plus
`shadow-lg`, and no outline. At that size the outline was most of what you saw. A `Toast`
keeps its border: it lands on arbitrary content with no scrim under it, and unlike the
tooltip it has no card around it to belong to.

Because the light-mode fill is a subtle step (`oklch(0.985)` on `oklch(1)`), keep container
padding generous — the whitespace is doing the work the border used to. `Card` is **`p-5`**
(20px); it was `p-4` and read cramped against its own fill.

---

## 6. Motion

- Default ease: `power3.inOut` (GSAP). Overlays are the exception — they use asymmetric
  easing (`power3.out` in, `power3.in` out); see §11.
- **`--ease-fc` is the CSS spelling of that same curve** (`cubic-bezier(0.77, 0, 0.175, 1)`),
  so a CSS transition and a GSAP tween running side by side match. It used to hold
  easeInOutCubic — `power2.inOut` — which meant the two halves of the system eased differently.
- Default duration: `0.4s` UI, `1.5s` full-page curtain (`Rideau`)
- **All motion respects `prefers-reduced-motion: reduce`, on both sides.** Every JS animation
  checks `prefersReducedMotion()` before it tweens, *and* `tokens.css` collapses CSS animation
  and transition durations globally in the base layer. Neither alone is sufficient: the JS
  guard does nothing for `transition-colors`, and the CSS reset does nothing for a GSAP
  timeline. Durations are collapsed rather than removed so `transitionend` still fires.
- Reduced motion means *do not animate*, not *do not interact*. `Drawer`'s drag-to-dismiss
  still works under it; it just snaps instead of springing.
- **Anything that registers with GSAP must unregister.** A `ScrollTrigger` or `SplitText`
  created in `onMount` and never reverted keeps a detached node alive and recomputes on every
  scroll for the life of the page. Wrap it in `gsap.context()` and revert it from the teardown.

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

**A curtain belongs above the router, never inside the page it covers.** Mounted with the
page, it exists only after the old view is gone, so it can play the reveal but not the cover
— the arrival reads as a jump cut to a blank panel that then wipes. One instance at the app
root with `start="open"`, driven `close(href)` out and `open()` in, covers both halves; it
also sits outside `PageTransition`'s transform, and a transformed ancestor resolves
`position: fixed` against itself, which shrinks a viewport curtain to a content column.

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

**Anything carrying `sr-only` needs a positioned ancestor.** `sr-only` is `position: absolute`,
and an absolutely positioned box whose nearest *positioned* ancestor is the initial containing
block belongs to the **document**, not to whatever scroll container it happens to sit inside —
`overflow` on an unpositioned ancestor does not clip it. In the standard shell, where the
scroller is an inner `<main>` and the outer shell is `h-dvh overflow-hidden`, a stray `sr-only`
node lands at its flow offset in *document* coordinates. Scroll to the bottom of a long page and
the window itself then scrolls another couple of thousand pixels into empty white, dragging the
whole shell off screen. `Switch`, `Avatar` and `SecretField` each shipped this; all three are
`relative` now, and `Dropzone` and the chart roots already were. This is the vertical twin of
the `ChartTable` note in §12 — same rule, same cause.

**An app's single scroll container should be `overscroll-contain`.** When `<main>` is the only
scroller there is nothing useful to chain a flick past either end into, and without it the
gesture reaches the document and rubber-bands the shell.

- Mobile-first: write the small layout, then enhance with `sm:` / `md:` / `lg:`.
- Min supported width: **360px**.
- **Hit targets ≥ 44×44px for anything a thumb is expected to find**: icon-only buttons
  (`IconButton` is `size-11`), nav rows (`--spacing-fc-nav-item` is 44px, which is also
  `min-h-11`), form controls (`Input`, `Select`, `SecretField` are all `h-11`), tabs, and every
  control in `MobileNav`.

  **`Button` is the documented exception.** Its `md` default is `h-9` (36px) and `sm` is `h-8`
  (32px), matching the density the suite actually ships. Use `size="lg"` (`h-11`) for anything
  touch-primary — a mobile action bar, a `Drawer` footer, a full-width form submit. A row of
  36px buttons in a desktop table is fine; the same row as the only control on a phone is not.
  `Checkbox` and `Radio` are 16px boxes by design and must be wrapped in a `<label>` with
  padding so the *label* carries the target.
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

### An action that navigates is a link — `href`, not a shaped `<a>`

`Button` and `Card` both render an `<a>` when given `href`, and that exists because without it
every landing page and every clickable tile in the suite rebuilt their classes by hand. A
button-shaped `<a>` is not a stylistic preference: a link has to be middle-clickable,
openable in a new tab, and visible in the status bar, and a `<button>` with an `onclick`
navigation is none of those.

```svelte
<Button href="/projects" iconRight={icons.arrow}>All projects</Button>
<Card href="/projects/7" class="flex flex-col gap-4"> … </Card>
```

`Card href` also adds what a static surface does not need: the focus ring, a hover step **up**
to `fc-surface`, and `group`, so a child arrow or icon tile can answer the hover. `Button`
keeps `disabled` working on both branches — the anchor drops its `href`, takes
`aria-disabled` and `tabindex="-1"`, and the `aria-disabled:pointer-events-none` class is what
actually stops the navigation, since `disabled` means nothing to an `<a>`.

Same caveat as the rest of the library: `iconify-icon` is not a dependency, so `Button`'s
icon stays inert unless the consumer registers the custom element.

### Icon library — `src/lib/icons.ts`

Import via `import { icons } from '@facile/muse'`.

**47 keys — 40 Solar, 7 MDI.** If a glyph you need is missing, add a key rather than inlining
the string at the call site; that is what keeps the pack and style rules above from being
re-litigated in every component.

Solar (`linear`, UI chrome):

| Key | Icon | Key | Icon |
|-----|------|-----|------|
| `icons.collapse` | `solar:sidebar-minimalistic-linear` | `icons.search` | `solar:magnifer-linear` |
| `icons.settings` | `solar:settings-linear` | `icons.edit` | `solar:pen-new-square-linear` |
| `icons.remove` | `solar:trash-bin-2-linear` | `icons.calendar` | `solar:calendar-linear` |
| `icons.home` | `solar:home-2-linear` | `icons.notification` | `solar:bell-linear` |
| `icons.dashboard` | `solar:chart-2-linear` | `icons.folder` | `solar:folder-linear` |
| `icons.usersGroup` | `solar:users-group-rounded-linear` | `icons.userCircle` | `solar:user-circle-linear` |
| `icons.logout` | `solar:logout-2-linear` | `icons.warning` | `solar:danger-triangle-linear` |
| `icons.info` | `solar:info-circle-linear` | `icons.upload` | `solar:cloud-upload-linear` |
| `icons.clock` | `solar:clock-circle-linear` | `icons.refresh` | `solar:refresh-linear` |
| `icons.eye` | `solar:eye-linear` | `icons.eyeClosed` | `solar:eye-closed-linear` |
| `icons.copy` | `solar:copy-linear` | `icons.check` | `solar:check-circle-linear` |
| `icons.key` | `solar:key-linear` | `icons.revoke` | `solar:forbidden-circle-linear` |
| `icons.shield` | `solar:shield-check-linear` | `icons.palette` | `solar:pallete-2-linear` |
| `icons.sun` | `solar:sun-linear` | `icons.moon` | `solar:moon-linear` |
| `icons.monitor` | `solar:monitor-linear` | `icons.globe` | `solar:global-linear` |
| `icons.plug` | `solar:plug-circle-linear` | `icons.bolt` | `solar:bolt-linear` |
| `icons.server` | `solar:server-linear` | `icons.code` | `solar:code-linear` |
| `icons.history` | `solar:history-linear` | `icons.card` | `solar:card-linear` |
| `icons.download` | `solar:download-linear` | `icons.filter` | `solar:filter-linear` |
| `icons.mail` | `solar:letter-linear` | `icons.error` | `solar:close-circle-linear` |

MDI (plus, close, chevrons — Solar's read muddy at small sizes):

| Key | Icon | Key | Icon |
|-----|------|-----|------|
| `icons.close` | `mdi:close` | `icons.plus` | `mdi:plus` |
| `icons.minus` | `mdi:minus` | `icons.arrow` | `mdi:chevron-right` |
| `icons.chevronDown` | `mdi:chevron-down` | `icons.chevronUp` | `mdi:chevron-up` |
| `icons.chevronLeft` | `mdi:chevron-left` | | |

---

## 9. Accessibility

- **Contrast ≥ WCAG AA** — 4.5:1 body text, 3:1 large text and non-text. Every semantic token
  is measured against its own 10% tint (§2), not against white, because that is how they are
  actually used. The documented exception is the chart palette in light mode, which trades
  3:1 for the pastel look and pays for it with the relief rule (§12).
- **One focus ring, everywhere**:
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring`.
  It is `--fc-ring`, not `--fc-accent` — the accent is the same ink as the foreground, so a
  ring drawn in it disappears against inverted active states. Form controls use the same ring
  as buttons; `:focus-visible` always matches for text inputs, so there is no reason to weaken
  it to `:focus`.
- **All interactive elements reachable by keyboard**, and every composite widget
  (`ColorPicker`, `OptionCards`, `Tabs`) is a real roving-tabindex radiogroup/tablist with one
  tab stop, arrows to move, Home/End to jump.
- **`<iconify-icon>` is decorative unless it is the only content.** A standalone icon button
  needs an `aria-label`; an icon beside a text label must not repeat it.
- **Live regions are earned.** `role="alert"` is assertive and interrupts a screen reader
  mid-sentence — it is for `warning` and `danger` only. Everything else is `role="status"`.
- **Every `<button>` declares its `type`.** An undeclared button inside a form submits it.
- **Overlays lock the background.** `<dialog>.showModal()` gives the focus trap, Escape and
  focus restore for free, but it does *not* stop the page behind from scrolling.
- Hit targets: see §7. `Button` `sm`/`md` are the documented desktop-density exception.

---

## 10. Navigation components

### SideBar

Collapsible vertical nav rail. Manages its own collapsed state via `$bindable`. (It was once
called `NavBar`; there is no `NavBar` export and has not been for some time.)

```svelte
<SideBar
  icon="solar:pallete-2-bold-duotone"
  title="Facile"
  bind:collapsed
  showSearch
  pages={[
    { label: 'Dashboard', href: '/',         icon: icons.dashboard, active: true },
    { label: 'Projects',  href: '/projects', icon: icons.folder }
  ]}
  user={{ name: 'Camille', avatar: '/pfp.jpg' }}
  userHref="/settings"
/>
```

Note what is **not** in `pages`: Settings. It is reached from the user card via `userHref` —
see §14.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | — | Brand mark — the one `bold-duotone` glyph in the rail |
| `title` | `string` | `''` | App / section name |
| `pages` | `Page[]` | `[]` | Nav links. Each: `{ label, href, icon?, active? }` |
| `user` | `User` | — | `{ name, avatar? }` — shown in the footer card |
| `userHref` | `string` | — | Makes the user card a link — this is the route to settings |
| `userActive` | `boolean` | `false` | Marks the user card active (surface fill, not inverted) |
| `collapsed` | `boolean` | `false` | Bindable. Collapses to `68px` (`--width-fc-nav-collapsed`), labels hidden |
| `showSearch` | `boolean` | `false` | Renders a search NavButton with ⌘K hint |
| `spaces` | `{ id, name }[]` | `[]` | Renders a `SpaceSwitcher` when non-empty and expanded |
| `activeSpaceId` | `string \| null` | `null` | Selected space — forwarded to `SpaceSwitcher`'s `activeId` |
| `onSpaceSelect` | `(id: string \| null) => void` | — | Selection callback |
| `manageSpacesHref` | `string` | — | Footer link in the switcher |
| `class` | `string` | — | Passed through `twMerge` |

The rail reads its two widths out of the theme at runtime (`getComputedStyle` on
`--width-fc-nav-collapsed` / `--width-fc-nav-expanded`), so the tokens below are the single
source of truth and retuning them actually reaches the tween. It used to hardcode `68` and
`220` in the gsap call, where a token change never arrived.

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
belongs to the child, so the block's transition animates it away with the element's height.

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
block (`--spacing-fc-nav-content: 196px`). It is fixed-width because a `w-full` block
*reflows* as the rail narrows instead of being clipped like the labels — but that is also why
it cannot morph the way a nav row does: at 68px the rail simply guillotines it.

So it leaves on its own terms, through a custom transition rather than `slide`:

- **height and margin** shrink to zero over the same 300ms as the width tween, on
  `cubicInOut` — which is `power3.inOut`, the same curve — so the rows below drift up
  instead of snapping, and Svelte holds the node in the DOM until the outro lands.
- **opacity is not linear with the height.** It finishes in the first 55% of the collapse
  (`FADE_START = 0.45`), so the control is invisible well before the rail is narrow enough
  to cut it. Reversed on expand, it waits for the rail to be wide enough to hold it.
- **an 8px lift** rides along, matching `PageTransition`'s travel.

A plain `{#if}` pops it in and out at whichever end of the tween it flips; `slide` alone
keeps it fully opaque while the rail crosses it, which is the frame where the fixed width
shows as a clipped stub spilling past the rail.

**A collapsed nav item is a fixed `size-fc-nav-item` square — never `w-full aspect-square`.**
`aspect-square` looks equivalent at rest but ties the item's *height* to its animating width,
so mid-collapse each button renders ~200px tall and shrinks — the inverted active row turns
into a giant black square for a few frames. Any fixed dimension is immune; a derived one is
not. (The geometry is the `68 = 44 + 12 + 12` above. An earlier revision of this document also
claimed `77px = 53px + 12 + 12` a few paragraphs later; that was never the shipped value.)

**The `icon` prop is the brand mark — it is the one icon that stays `bold-duotone.`**
Everything else in the sidebar (nav rows, search, collapse, the footer settings gear) is
`solar:*-linear`. Pass `solar:<glyph>-bold-duotone` at `width="24"`; the duotone weight is
what makes the app's identity read against a column of hairline chrome icons.

### NavButton

The atomic button unit used inside `SideBar`. Also standalone for custom nav UIs.

```svelte
<!-- As a link -->
<NavButton href="/dashboard" icon={icons.home} label="Home" active />

<!-- As a button with custom snippets -->
<NavButton>
  {#snippet children()}
    <Avatar name="Camille" size="sm" />
    <span>Camille</span>
  {/snippet}
  {#snippet right()}
    <iconify-icon icon={icons.settings} width="16" height="16" class="block"></iconify-icon>
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

**Style invariants**: expanded is `w-full min-h-11 px-3 py-2.5`, collapsed is a fixed
`size-fc-nav-item` square; `gap-2.5`, `rounded-fc-md`, `overflow-hidden`, icon `width="18"`
`height="18"` `class="block shrink-0"` (no colour class — it inherits `currentColor`, which
is what lets the inverted active state flip the glyph with the label), label via `TextElevate`
at `text-fc-sm`. No border. Inactive: `text-fc-fg-muted`, `hover:bg-fc-surface
hover:text-fc-fg`. Active: **inverted**, `bg-fc-accent text-fc-accent-fg font-medium` — never
a tinted wash, and `aria-current="page"` on the anchor so it is not styling alone.

**Press animation**: dip in `0.07s power2.out`, back to `1` in `0.22s power2.out`, no
overshoot. It lives in **`src/lib/utils/press.ts` as `use:springPress`** and every pressable
surface imports it — `NavButton`, `SideBar`'s footer card, `IconButton`. Pass `1` to opt out
while keeping the action attached.

**The depth is solved for, not chosen.** A press moves every edge **1.5px inward whatever the
element's size**, so the scale is computed per press: `1 - 3 / width`, clamped to
`0.93 … 0.997`. A 44px icon button dips to `0.932`; an 868px list row dips to `0.9965`. Both
travel exactly 1.5px.

A fixed ratio cannot work in a component library, because the same action lands on both of
those. This curve started as `0.94` returning over `0.5s` on `elastic.out(1, 0.4)` — a full
rubber-band overshoot tuned against a 44px sidebar row. The moment it was applied to a
full-width row it became a 26px wobble and read as the interface showing off. Even a
restrained `0.97` still moved that row 13px per side while barely touching the icon button.
Constant *distance* is the model that survives being reused.

A press is an acknowledgement, not an event: felt, not watched. If a new pressable surface
seems to need a bigger gesture to register, the surface is wrong.

Do not re-inline it. It was hand-copied into three files once and immediately drifted into two
different scales, which is the entire reason it is a module now. The action also kills its own
tween on destroy, so a component that unmounts mid-press does not leave gsap animating a
detached node.

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

It closes on Escape and returns focus to the trigger, and it sits at **`z-40`** — the
floating-out-of-a-trigger layer. It used to be `z-50`, tied with `MobileNav`, so on a phone
the two resolved by DOM order.

Wired into `SideBar` via its own `spaces` / `activeSpaceId` / `onSpaceSelect` /
`manageSpacesHref` props — renders between the header and search/nav when `spaces` is
non-empty and the sidebar isn't collapsed. `SideBar` forwards `activeSpaceId` to this
component's `activeId`; note the deliberate rename at the boundary, and note that it was
wrong for a long time — `SideBar` passed `activeSpaceId` straight through to a prop that does
not exist, so the switcher never knew what was selected. Nothing caught it until the library
gained a type-checker.

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

**Six items plus the avatar is the ceiling, and the width budget is why.** Every target is a
fixed `size-fc-nav-item` square (44px — the same token as a sidebar row, and the §7 hit-target
floor), gaps and padding shrink under `sm:`, and at 360px that leaves 336px of usable bar for
7 × 44 + 6 × 2 = 320px. Items used to be `px-3.5 py-2`: 50×38, which both overflowed past four
items and missed the touch target by 6px vertically. Past six the strip scrolls horizontally
rather than running off screen — scrollbars are hidden globally (§7), so what you get is a
partial pill at the edge as the affordance. Treat that as a safety valve, not a design: if a
phone needs seven destinations, one of them belongs somewhere else.

### Badge role tones

`owner` and `admin` tones render the coloured role pills used across Nuage/Courrier/Plume
member lists: `owner` → `bg-fc-owner/10 text-fc-owner`, `admin` → `bg-fc-admin/10
text-fc-admin`. Use `neutral` for a plain `member` role.

Both go through the **tokens**, not through stock Tailwind palette colours. An earlier
revision of this section prescribed `bg-amber-500/10 text-amber-600` and `bg-blue-500/10
text-blue-600` — raw palette classes, in the document that bans them. The source was always
right; the contract had drifted.

---

## 11. Overlays

`Modal`, `ConfirmModal` and `Drawer` are all native `<dialog>` elements opened with
`showModal()` — that buys the top layer, the focus trap, Escape, focus restore and a real
`::backdrop` without a line of custom code. It does **not** buy a background scroll lock, an
accessible name, or a correct backdrop hit-test, and all three of those were missing.

**One controller, `src/lib/utils/dialog.ts`.** `Modal` and `Drawer` each hand-rolled the same
~80 lines — the `closing` latch, the `cancel` handling, the `getBoundingClientRect()` backdrop
test, the close dispatch — and had already drifted apart: only `Drawer` guarded
`event.detail === 0`, so a keyboard-activated button *inside* a `Modal` reported click
coordinates of `0,0`, read as a backdrop click, and closed the dialog. `createDialog()` owns
all of it, plus a refcounted body scroll lock released on close and on destroy. The enter and
exit **tweens** stay in the components, because Modal (scale+fade) and Drawer (translate)
genuinely animate differently — that is not duplication.

Its handlers are the one place in this library where the component wins over the consumer:
they are spread *after* `...rest`, because a caller passing `onclick` would otherwise silently
break closing.

**Every overlay must have an accessible name.** `Modal` wires `aria-labelledby` to the `<h2>`
it renders from `title`; `ConfirmModal` passes its own title id through. Before that, every
confirmation dialog in the suite was an unnamed modal — a screen reader announced "dialog" and
nothing else.

**Ids come from `$props.id()`, never a module-scoped counter.** `Drawer` used `let uid = 0` at
module scope, which is the canonical SSR hydration-mismatch generator: server-order and
client-order increments diverge and `aria-labelledby` ends up pointing at nothing.

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
entirely under `prefers-reduced-motion` — but skipping a tween is not the same as removing a
feature: `Drawer`'s drag-to-dismiss still works under reduced motion, it just snaps instead of
springing back. The backdrop is instant, not faded — `::backdrop` is not a tweenable target.

### Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Bindable |
| `title` | `string` | — | Renders an `h2`; ignored when `header` is passed |
| `dismissible` | `boolean` | `true` | `false` blocks Escape and backdrop clicks |
| `showClose` | `boolean` | `false` | 44px `mdi:close` button, only when `dismissible` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `max-w-sm` / `max-w-md` / `max-w-lg` |
| `onClose` | `() => void` | — | Fires once, after the exit tween |
| `header` / `footer` | `Snippet` | — | Replace the heading / append below the body |

### ConfirmModal

Composed on `Modal` — never re-implement the dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Bindable |
| `title` | `string` | required | Heading |
| `description` | `string` | — | Muted body line |
| `confirmLabel` / `cancelLabel` | `string` | `'Confirm'` / `'Cancel'` | Button text |
| `tone` | `'neutral' \| 'danger'` | `'neutral'` | `danger` → danger button + tinted `icons.warning` badge |
| `icon` | `string` | — | Overrides the badge icon |
| `onConfirm` | `() => void \| Promise<void>` | — | A promise disables both buttons and shows a Spinner; resolves → close, rejects → **stays open** |
| `onCancel` | `() => void` | — | Cancel button, Escape and backdrop all route here |

Rules that are not negotiable, because they are what stops people deleting things by
reflex:
- **Focus lands on Cancel**, never Confirm.
- **While a confirm is pending the dialog is not dismissible** — no Escape, no backdrop.
- Button order is `flex-col-reverse` on mobile (confirm on top) and `sm:flex-row
  sm:justify-end` on desktop (cancel left, confirm right).

### Toast

Feedback that needs no answer, and never blocks. `toast.success('Invoice sent.')` from
anywhere; a single `<Toaster />` in the root layout renders the queue.

```svelte
<!-- root layout, once, outside the router -->
<Toaster class="pb-28 md:pb-6" />
```

| Where | Rule |
|---|---|
| Tone | The `Alert` subset — `neutral` `info` `success` `warning` `danger`. The sugar is named after it (`toast.danger`, not `toast.error`) |
| Duration | 5s by default. `0` pins it, and is only for a toast carrying an action |
| Stack | Four at once, newest nearest the screen edge; a fifth pushes the oldest out |
| Placement | Full-bleed above the safe area on a phone, a 384px column pinned right from `sm:` |
| Motion | 0.3s `quartOut` in, 0.2s `quartIn` out, `animate:flip` on reorder — quart *is* `power3` |

Hover or focus **freezes the countdown**. A toast that disappears while you are reading it,
or on the way to its own Undo button, is worse than no toast.

**A toast is not a dialog.** It cannot ask a question, it cannot be the only place an error
is reported, and it cannot cover a `<dialog>` — `showModal()` owns the top layer, above every
z-index there is. A modal reporting its own success closes first, then toasts.

Its one border is deliberate: unlike `ChartTooltip` it lands on arbitrary content with no
card and no scrim under it, so it keeps the outline (§5).

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
| `onClose` | `() => void` | — | Fires on the dialog's `close` event |

Drag-to-dismiss is on the handle and header only — never the scrollable body, or dragging
to scroll becomes ambiguous. Dismiss fires past **25% of panel height** or **0.5 px/ms**
downward velocity; anything less springs back over 0.3s. The bottom-most padded element
takes `pb-[max(1.25rem,env(safe-area-inset-bottom))]` to clear the iOS home indicator.

---

## 12. Charts

Dependency-free SVG — no chart library. `LineChart`, `BarChart`, `DonutChart` and
`Sparkline`, sharing `ChartLegend`, `ChartTooltip`, an internal `ChartTable` and the maths in
`src/lib/utils/chart.ts`.

**All of the geometry lives in `chart.ts`, not in the templates.** `barGeometry`, `barPath`,
`donutSegments`, the series helpers (`seriesEmpty`, `seriesLegend`, `seriesRows`,
`seriesTipRows`, …) and the axis metrics (`labelWidth`, `axisPadLeft`, `labelStride`) are
pure functions there, which is what makes them testable — `BarChart` and `LineChart` were
441 and 347 lines of largely the same component twice, including a byte-identical `sr-only`
table. `BarChart` is now 249. The entry tweens live in `charts/entry.ts`, deliberately
separate so the test file never has to import gsap.

The public subset re-exported from `@facile/muse` is `chartColor`, `formatCompact`,
`niceScale`, `linePath`, `areaPath`, `arcPath`, `tickStride` and `resize`, plus the
`ChartSeries` / `ChartSlice` / `ChartScale` / `ChartLegendItem` / `ChartTipRow` / `ChartRow`
types. Everything else is importable by path but not part of the API surface.

Shared contract:
- Charts measure their container with a `ResizeObserver` and render at **real pixel
  dimensions** — never `preserveAspectRatio="none"`, which distorts strokes and text.
  `Sparkline` is the exception; it is decorative and scales with CSS.
- **Empty data renders a muted `emptyLabel`**, never a broken axis or a `NaN` path. **A series
  of zeros is data, not emptiness** — `isEmpty` used to include `values.every(v => v === 0)`,
  so "0 errors today" and every fresh account rendered "No data" instead of a truthful flat
  line at zero. `DonutChart` is the exception and keeps `total <= 0`, because an arc with no
  total genuinely cannot be drawn.
- Every chart carries a visually hidden `<table>` of its values — identity is never carried by
  colour alone — and the `<svg>` beside it is **`aria-hidden`**. Both used to be exposed, with
  the table's `<caption>` repeating the svg's `aria-label` verbatim, so a screen reader read
  every chart twice. The table is the accessible representation; the drawing is decoration.
  That table must be
  wrapped in a `<div class="sr-only">`, never carry `sr-only` itself: **`overflow: hidden` is
  ignored on `<table>`** (a table box is not a block container), so the class clips the table
  visually via `clip-path` while its wide `white-space: nowrap` content still contributes
  scrollable overflow — and since `sr-only` is `position: absolute`, that overflow lands on
  the *document*, giving the whole page a horizontal scrollbar and a second vertical one.
- A hover layer is default-on everywhere except `Sparkline`: crosshair + per-series markers
  on `LineChart`, whole-category hit bands on `BarChart`, segment lift on `DonutChart`.
  `ChartTooltip` places itself on **both** axes, bounded by the plot box intersected with the
  viewport, and measures once per open rather than on every pointer move.
- **Nothing that depends on the entry animation may sit in the same `$derived` as the
  geometry.** `BarChart` read its tween `progress` inside the block that also measured every
  axis label, so it re-derived the whole layout ~60×/second for 0.6s to move some rectangles.
- Mount animation is 0.6s `power3.out` (line draw-in, bars from the baseline, donut sweep),
  skipped under `prefers-reduced-motion`.
- **Nothing in a chart has a sharp corner.** Bars are rounded 4px on the ends that face
  nothing — the end sitting on the baseline stays square, because it is resting on the axis.
  In a stacked bar *every* segment above the baseline one is bounded by a 2px gap on both
  sides, so all four of its corners are rounded; leaving them square drew a seam through the
  middle of every bar. `DonutChart` does the same with `corner` (4px default) through
  `arcCorner`, which clamps the radius to half the ring thickness and to what the slice's
  own inner edge can hold. Rounding is done with fillets tangent to both edges, never with a
  round `stroke-linecap` — a linecap pushes the segment half a thickness past the angle it
  represents, which makes the slice lie about its share.
- One axis. Never a second y-scale — two measures of different magnitude are two charts.

| Component | Key props |
|-----------|-----------|
| `LineChart` | `series`, `labels`, `area`, `smooth`, `showGrid`, `showLegend`, `yFormat`, `xFormat`, `yTicks`, `height` |
| `BarChart` | `series`, `labels`, `stacked`, `horizontal`, `showGrid`, `showLegend`, `yFormat`, `yTicks`, `height` |
| `DonutChart` | `data`, `size`, `thickness`, `corner`, `showLegend`, `centerLabel`, `centerValue`, `valueFormat` |
| `Sparkline` | `data`, `height`, `area`, `smooth`, `color`, `showLast`, `valueFormat` |

`DonutChart`'s `size` is a **maximum**, not a fixed width — it clamps to its container, so
`size={400}` on a 360px viewport no longer overflows.

`series` is `{ name, data: number[], color? }[]`; `DonutChart` takes
`{ label, value, color? }[]`. `smooth` uses Fritsch–Carlson monotone cubics, so the curve
can never invent a peak that is not in the data. Bar charts anchor their domain to zero —
a truncated baseline makes bar lengths lie.

---

## 13. Identity & files

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
| `label` | `string` | — | `aria-label` for the radiogroup. There is no default: two unlabelled groups on a page announce identically, and a fabricated name is worse than none |

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

## 14. Settings

Every suite app grows a settings page, and before muse shipped one they had all grown a
different one — eight repos with a copy-pasted tab strip, six spellings of "copy it now, you
will not see it again", and three apps with no switcher at all. This section is the standard.

### Settings is reached from the user card, never from the nav

**Never put a Settings row in the sidebar's nav list.** The only way in is the user card at
the bottom of the rail (`SideBar`'s `userHref` / `userActive`), plus the avatar on
`MobileNav`'s `profileHref`.

```svelte
<SideBar pages={navPages} {user} userHref="/settings" userActive={onSettings} />
<MobileNav items={navPages} {user} profileHref="/settings" profileActive={onSettings} />
```

The nav list is for the app's actual sections — the things people came to use. Settings is
where you go to change *yourself*, so it belongs on your own name, and a permanent nav row
spends prime vertical space on the page people open least. The card already carries the gear
glyph, so the affordance is not lost.

Two details the card gets right and a hand-rolled one usually does not: the name is a single
truncating line (`TextElevate` takes `class="truncate"` — a two-line name changes the height
of the rail), and the active state is the **surface fill**, not the inverted pill the nav
rows use, because the avatar inside already wears `bg-fc-accent` and an inverted card would
swallow it whole. Log out lives inside settings — not in the rail.

### One page, top tabs, one section per tab

Sections are `Tabs` across the top of the page, then a `Divider`. Not a left sub-nav (it
costs 256px that a settings form wants), not an endless stacked scroll.

**Put the section in the URL.** `Tabs` items carry `href`, so each section is a real route:
a link to `/settings/pool` opens on Pool, reload keeps you there, and browser-back walks the
sections. Local `$state` tabs break all three.

```svelte
<div class="flex flex-col gap-4">
  <Tabs items={sections.map(s => ({ ...s, href: `/settings/${s.id}` }))} value={active} />
  <Divider class="my-0" />
</div>
```

That `gap-4` is not arbitrary. The rule is separating a page header from its body, so it
needs air — pulled tight under the strip it reads as an underline welded to the active pill
and fights the pill's shape.

The active tab is an inverted pill that **slides** between tabs on a 0.3s `power3.inOut`
tween. Pass an `icon` per item; the strip scrolls horizontally on narrow screens and the
selected tab scrolls itself into view.

The canonical section order, take what the app has:

| Section | For | Typical contents |
|---|---|---|
| **Profile** | every app | identity, display name, SSO-managed email, avatar, identity colour, log out |
| **Appearance** | every app | theme (system/light/dark), density, language, timezone |
| **Notifications** | anything that emails | a master switch, per-event rows, digest cadence |
| **API** | anything with a CLI or public API | base URL, token list, create/revoke |
| **Pool** | anything wired to Nook | enable, instance URL, shared secret, connection status, channels |
| **Members** | anything space-scoped | member table with role pills, invites |
| **Advanced** | every app | export, instance/version facts, **danger zone last** |

Never give Danger Zone a tab of its own — it lives at the bottom of Advanced. A destructive
action should cost a scroll, not sit one mis-click from every other tab all day.

### Section and row anatomy

`SettingsSection` is heading + description + optional `actions`, wrapping its children in a
`Card` (`bare` skips the card for a `Table` or a `Dropzone`). `SettingsRow` is
label-and-description on the left, control on the right, stacking under `sm:` and drawing
its own top rule so a section never has to count its children.

```svelte
<SettingsSection title="Theme" description="Applied to this browser.">
  <SettingsRow label="Compact mode" description="Tighter rows — more on screen.">
    <Switch bind:checked={compact} aria-label="Compact mode" />
  </SettingsRow>
</SettingsSection>
```

`stacked` puts the control on its own full-width line — use it for anything with a text
field. And note the `aria-label`: `Switch` renders the label *it* is given, so a `Switch` in
a `SettingsRow` has no accessible name unless you pass one.

A one-of-N preference — colour scheme, density, view mode — is `OptionCards`: a radiogroup
of icon cards in a `stacked` row, with the selected card **inverted** like every other
selected state. Not a `Select` (it hides the choices behind a click) and not bare `Radio`
dots (a native radio next to a word is a form, not a preference).

**The colour scheme belongs here and nowhere else.** No theme toggle floating in a corner of
every page — it is a preference like any other, and a control pinned over every screen
competes with that screen's own actions.

### Secrets

`SecretField` is the one way to show, set or copy a credential. Do not hand-roll a
`<code>` with an eye button next to it.

```svelte
<SecretField value={token} />                          <!-- show a stored secret -->
<SecretField bind:value={secret} editable />           <!-- set one -->
<SecretField value={endpoint} sensitive={false} />     <!-- a URL or ID: copy, no masking -->
```

The rules it encodes, all of which were being broken somewhere in the suite:

- **The mask is a fixed eight dots.** Never one dot per character — a placeholder that grows
  with the secret tells anyone watching how long it is, which is free information for
  whoever is guessing it. `mask="ends"` (the default) keeps the first four characters, which
  are the public issuer prefix (`fc_rw_`, `sk_live_`), and the last four, so a key is
  identifiable in a list without being readable. `mask="full"` shows nothing at all.
- **Revealing is a peek, not a mode.** The value re-hides itself after `autoHideMs`
  (15s default), because a secret left on screen ends up in a screen share long after the
  person who revealed it walked away. Set `autoHideMs={0}` only for a one-time token the
  user has not copied yet.
- **Copy confirms and resets** — the glyph swaps to a check for 2s, and every state change
  is announced through an `aria-live` region. A revealed value is `select-all`, so one click
  takes the whole token.
- **Callbacks are `onReveal` / `onCopy`**, and the label association prop is **`for`**, the
  same name `SettingsRow` uses. It was `id` here and `for` there — one concept, two spellings,
  in adjacent components.
- **`REDACTED` is a wire contract, not decoration.** Several suite APIs return the eight-dot
  string *as the field's value* and treat receiving it back unchanged as "keep what you
  have". `SecretField` recognises it and goes inert — nothing to reveal, nothing to copy.
  Import `REDACTED` / `isRedacted` rather than typing the dots.

**Creating a token** goes in a `Drawer`: name, scope, and a required expiry — a machine
credential that never lapses is the one nobody remembers to rotate. On success the drawer
body *swaps* to an `Alert tone="warning"` plus a revealed `SecretField`, and reopening the
drawer must reset that state so a previous token can never reappear.

**Listing tokens** is a `Table` showing name, prefix, scope, last used and expiry. Revoked
rows stay listed at `opacity-55` so the audit trail still names them, never disappear.
Revoke is `variant="ghost-danger"` with `icons.revoke` — quiet until you reach for it — and
routes through a `ConfirmModal` whose description says **what actually breaks** ("any
pipeline still using it starts failing, and it cannot be un-revoked"), not "are you sure?".

Machine strings — secrets, keys, IDs, endpoints, event channels — are set in
`font-fc-mono`. Prose never is.

### Connections and integrations

Anything that holds an outbound connection (Nook Pool, a webhook target, an SMTP relay)
reports state with `StatusDot`, and **the state is not a boolean**. "Not connected" hides
three different situations with three different fixes, so distinguish at least: disabled,
connecting, connected, reconnecting (with the attempt count), and gave-up. Only the
in-flight states pulse.

```svelte
<StatusDot tone="warning" label="Reconnecting — attempt 3 of 20" pulse />
```

Pair it with the facts an operator needs — identity, epoch, pending outbox, last error — as
`SettingsRow`s, and put the secret behind a `SecretField`. Event channels are one
`SettingsRow` per channel with the machine name as the description.

---

## 15. Component checklist

Before exporting a component:

- [ ] Uses tokens — no raw hex, no stock Tailwind palette colours, no arbitrary px where a
      token exists
- [ ] Typed `$props()` with a `HTMLXAttributes` intersection, and `{...rest}` spread **last**
      so a consumer can always reach `id`, `data-*` and `aria-*`
- [ ] `class` accepted and merged through `twMerge` from `utils/cn.js` — never
      `tailwind-merge` directly
- [ ] Every `<button>` declares `type`
- [ ] The house focus ring on anything interactive (§9)
- [ ] Uses the shared `tone` vocabulary (§2), not a private one
- [ ] Callback props are camelCase `onX`
- [ ] Icons come from `icons.ts`, with `width`, `height`, `class="block"` and no colour class
- [ ] Mobile-first layout, checked at 360px; hit targets per §7
- [ ] Keyboard + screen-reader accessible
- [ ] Respects `prefers-reduced-motion`, and every gsap registration is reverted on destroy
- [ ] Rendered somewhere in `demo/` — that is the only thing that proves it still works
- [ ] Re-exported from `src/lib/index.ts`
- [ ] `mise run verify` is green (types, tests, demo build)

The first eight of these are mechanical, and `mise run check` enforces most of them. It was
added after an audit found the library shipping four different focus-ring treatments, five
callback casings, three tone vocabularies and a `SideBar` that had been passing a prop name
`SpaceSwitcher` never had. None of that survives a type-checker; none of it was being caught
by a human.
