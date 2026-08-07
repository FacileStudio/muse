# muse — API

The complete exported surface of `@facile/lib`, read from `src/lib/index.ts`: 30 components,
the `cn` class merger, 2 motion helpers, the `icons` map and the `IconKey` type. Nothing else
in the repo is importable.

```ts
import {
  // atoms
  Alert, Avatar, Badge, Button, Card, Checkbox, Component, Divider,
  IconButton, Input, Radio, Select, Skeleton, Spinner, Switch, Textarea,
  // molecules
  Field, NavButton, SpaceSwitcher, StatCard,
  // organisms
  MobileNav, Modal, SideBar, Table, Topbar,
  // motion
  Carousel, Mosaique, Rideau, TextElevate, WordReveal,
  // helpers
  cn, twMerge, prefersReducedMotion, isMobile, icons
} from '@facile/lib';
import type { IconKey } from '@facile/lib';
```

Conventions across the library:

- Every component accepts `class` (typed `class?: string`) and merges it with `twMerge`, so
  a consumer utility replaces the component default rather than fighting the cascade.
- Components wrapping a native element spread `...rest` onto it, so any native attribute or
  `on*` handler passes through. Those are marked "spreads to" below.
- Props marked **bindable** use `$bindable()` and support `bind:`.
- `children` is a Svelte 5 `Snippet` unless stated otherwise.
- Borders use the single `border-fc-border` token.
- `twMerge` here is muse's `fc-*`-aware build from `src/lib/utils/cn.ts`, re-exported as
  `cn`. Use it — not raw `tailwind-merge` — for any custom `fc-*` markup, or size utilities
  will silently delete colour utilities. See [architecture.md](architecture.md).

## Atoms

### `Component`

Generic panel surface — the base other panels are cut from. Spreads to `<div>`
(`HTMLAttributes<HTMLDivElement>`). Defaults to
`relative min-h-fit w-full bg-fc-component rounded-fc-md px-8 py-6`.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (optional) |

### `Button`

Spreads to `<button>` (`HTMLButtonAttributes`).

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'ghost' \| 'outline' \| 'danger'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `children` | `Snippet` | — (required) |

Pill-shaped (`rounded-fc-pill`). `primary` fills with `bg-fc-accent` — which equals the
foreground colour, so it reads as an inverted slab; `ghost` is transparent with a
`bg-fc-surface` hover; `outline` adds `border-fc-border`; `danger` is **tinted, not solid** —
`bg-fc-danger/10 text-fc-danger`, matching the suite's `bg-destructive/10`.

Sizes are real and distinct: `sm` is `h-8 px-3.5 text-fc-xs`, `md` is `h-9 px-4 text-fc-sm`,
`lg` is `h-11 px-6 text-fc-sm`. Pass `class` to override.

### `IconButton`

Round 44px icon button with the house spring press on `pointerdown`. Spreads to `<button>`
(`HTMLButtonAttributes`). Nested `<svg>` is sized `4.5` and `<iconify-icon>` is forced to
`display: block` so it centres.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

The press animation is skipped entirely when `prefersReducedMotion()` is true. It is a
direct `onpointerdown` handler, so passing your own `onpointerdown` through `...rest`
overrides it.

### `Card`

`bg-fc-surface` container, `rounded-fc-md`, `p-4`. No border.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

### `Input`

Spreads to `<input>` (`HTMLInputAttributes`). Fixed `h-11`, full width,
`border-fc-border`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| number` | `''` | **bindable** |

Pass `type`, `placeholder`, `disabled`, `required` and friends through the spread.

### `Textarea`

Spreads to `<textarea>` (`HTMLTextareaAttributes`). Vertically resizable, full width.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | **bindable** |
| `rows` | `number` | `4` | |

### `Select`

Spreads to `<select>` (`HTMLSelectAttributes`). Native control, `h-11`, full width.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | **bindable** |
| `children` | `Snippet` | — | Required. Supply the `<option>` elements |

### `Checkbox`

Spreads to the inner `<input type="checkbox">` (`HTMLInputAttributes`). Wrapped in a
`<label>`, so the optional text is clickable.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | **bindable** |
| `label` | `string` | — | Rendered after the box when present |

### `Radio`

Spreads to the inner `<input type="radio">`. Share `group` across a set to make them
exclusive.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `group` | `string` | `''` | **bindable**. Bind the same variable across the set |
| `value` | `string` | — | Value contributed to `group` when selected |
| `label` | `string` | — | Optional text |

### `Switch`

Toggle backed by a visually hidden checkbox and a `peer`-driven track. Extends
`HTMLInputAttributes`; `...rest` spreads onto the input, so `id`, `name`, `aria-label` and
`onchange` all pass through.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | **bindable** |
| `label` | `string` | — | Optional text |
| `disabled` | `boolean` | `false` | Dims the row and blocks the input |

The accessible name comes from `label`. A `Switch` used inside a `SettingsRow` — where the
text lives in the row, not the switch — has **no** accessible name unless you pass
`aria-label`.

### `Badge`

Inline pill, `rounded-fc-pill`, `text-fc-xs`.

| Prop | Type | Default |
|---|---|---|
| `tone` | `'neutral' \| 'accent' \| 'success' \| 'danger'` | `'neutral'` |
| `children` | `Snippet` | — (required) |

`success` and `danger` set literal `text-white`. All tones use a transparent border.

### `Alert`

Status banner with `role="alert"`, `rounded-fc-md`, `text-fc-sm`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | |
| `title` | `string` | — | Bold line above the body |
| `children` | `Snippet` | — | Optional |

The `warning` tone is the one place in the library that uses a non-token color:
`border-fc-warning/40 bg-fc-warning/10`, reading the `--color-fc-warning` token. The `info` tone uses `border-fc-border`, replacing an earlier bug where it inherited
whatever `border` resolves to.

### `Avatar`

Round avatar with an initial fallback. No border.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `src` | `string` | — | When absent, the initial is shown |
| `alt` | `string` | `''` | Applied to the `<img>` |
| `name` | `string` | `''` | First character uppercased is the fallback; `?` when empty |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `h-8` / `h-10` / `h-14` |

The initial is computed once at setup, not in a `$derived`, so a `name` that changes after
mount will not update the fallback.

### `Spinner`

`role="status"`, `aria-label="Loading"`, border-based spinner with a `border-t-fc-accent`
arc. Halts under `motion-reduce`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `h-4` / `h-6` / `h-10` |

### `Skeleton`

Pulsing placeholder block, `rounded-fc-sm`, `bg-fc-surface/60`. Only prop is `class` — that
is also how you size it (`class="h-4 w-32"`).

### `StatusDot`

Coloured dot plus optional text, for connection and health state.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `'success' \| 'danger' \| 'warning' \| 'muted' \| 'accent'` | `'muted'` | |
| `label` | `string` | — | Rendered beside the dot |
| `pulse` | `boolean` | `false` | Adds an `animate-ping` ring, hidden under `motion-reduce` |

Reserve `pulse` for genuinely in-flight states (connecting, reconnecting) — a permanently
pulsing dot is just noise. State is not a boolean: see CHARTE §14.

### `Divider`

`<hr>` with `border-0 border-t border-fc-border` and `my-4`. Only prop is `class`.

## Molecules

### `Field`

Form-row wrapper: label above, control in the middle, helper or error below.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `Snippet` | — | Required. The control |
| `label` | `string` | — | |
| `helper` | `string` | — | Shown only when `error` is absent |
| `error` | `string` | — | Takes precedence over `helper`, rendered in `text-fc-danger` |

`label` renders as a `<span>`, not a `<label>` — it is not associated with the control, so
set `id`/`aria-label` on the control yourself when it matters.

```svelte
<Field label="Project name" error={nameError}>
  <Input bind:value={name} />
</Field>
```

### `NavButton`

One row of a navigation rail. Renders as `<a>` when `href` is set, otherwise `<button
type="button">` with `...rest` spread onto it. Carries the house spring press as a
`use:springPress` action, so it works on both elements.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | `string` | — | Presence switches the element from `<button>` to `<a>` |
| `icon` | `string` | — | Iconify name, rendered at `18×18`, inheriting `currentColor` |
| `label` | `string` | — | Rendered through `TextElevate` at `text-fc-sm` |
| `active` | `boolean` | `false` | Inverts the row: `bg-fc-accent text-fc-accent-fg font-medium` |
| `collapsed` | `boolean` | `false` | Unmounts the label and makes the row a `size-11` square |
| `textDelay` | `number` | `0.15` | Passed to `TextElevate` as its `delay` |
| `right` | `Snippet` | — | Right-aligned content — shortcut hint, chevron, count |

Base style is `px-3 py-2.5 min-h-11 w-full gap-2.5 rounded-fc-md text-fc-sm overflow-hidden`,
inactive `text-fc-fg-muted hover:bg-fc-surface hover:text-fc-fg`. When `collapsed` the row
becomes `size-11 self-center justify-center` — a square, not a squeezed rectangle — and the
label subtree is unmounted rather than clipped. Extra props land on the `<button>` branch
only; on the `<a>` branch `...rest` is not spread.

`collapsed` is forwarded to `TextElevate` as `visible`, which `TextElevate` now declares and
animates out. `CHARTE.md` additionally documents a `children` snippet on this component; the
current source has no such prop.

### `StatCard`

KPI tile for dashboards, on `bg-fc-component` with a `border-fc-border`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Required. Uppercased, `text-fc-xs`, muted |
| `value` | `string \| number` | — | Required. `text-fc-2xl`, semibold |
| `delta` | `string` | — | Trend line under the value |
| `children` | `Snippet` | — | Optional slot for a sparkline or extra content |

### `OptionCards`

Single-select radiogroup rendered as icon cards — theme, density, view mode, plan. The
selected card is **inverted**, matching every other selected state in the suite.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `{ value, label, icon?, disabled? }[]` | `[]` | |
| `value` | `string` | `''` | **bindable** |
| `name` | `string` | — | Emits a hidden input so the group posts in a plain form |
| `label` | `string` | `'Options'` | `aria-label` for the radiogroup |
| `onSelect` | `(value: string) => void` | — | |

`role="radiogroup"` with roving tabindex and arrow/Home/End keys, skipping disabled options.
Cards are `h-11` and sized to their content — the group hugs the options rather than
stretching across the row — and wrap on narrow screens. There is no description slot on
purpose: the explanation belongs in the `SettingsRow` above, not repeated in every card.

### `SecretField`

The one way to show, set or copy a credential. Renders a mono field plus `IconButton`
reveal and copy actions. See CHARTE §14 for the rules it encodes.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | **bindable** |
| `editable` | `boolean` | `false` | `false` renders a read-only `<output>`; `true` renders an input |
| `sensitive` | `boolean` | `true` | `false` shows the value plainly and drops the eye — for URLs and IDs |
| `copyable` | `boolean` | `true` | |
| `mask` | `'ends' \| 'full'` | `'ends'` | `ends` keeps the first four and last four characters |
| `visible` | `boolean` | `false` | **bindable** |
| `autoHideMs` | `number` | `15000` | Re-hides a revealed value. `0` disables |
| `label` / `helper` / `error` / `placeholder` | `string` | — | |
| `disabled` | `boolean` | `false` | |
| `id` | `string` | — | Ties the `<label>` to the field |
| `actions` | `Snippet` | — | Extra buttons after copy — rotate, revoke |
| `onreveal` | `(visible: boolean) => void` | — | Fires on toggle; hook your audit log here |
| `oncopy` | `(ok: boolean) => void` | — | `false` when the clipboard write threw |

The mask is a fixed eight dots and never mirrors the real length. A value equal to
`REDACTED` is treated as "the server kept it": the field goes inert, since there is nothing
to reveal or copy.

```svelte
<SecretField value={token} />
<SecretField bind:value={secret} editable />
<SecretField value={endpoint} sensitive={false} />
```

### `SettingsRow`

Label and description on the left, control on the right; stacks under `sm:`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | |
| `description` | `string` | — | `text-fc-xs`, muted |
| `for` | `string` | — | Renders the label as a real `<label for>` |
| `stacked` | `boolean` | `false` | Control on its own full-width line — use for text fields |
| `children` | `Snippet` | — | The control |

Each row draws its own top rule with `first:border-t-0`, so a section never has to know how
many rows it holds.

### `SettingsSection`

Heading, description, optional actions, and a `Card` around the body.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | `text-fc-lg`, semibold |
| `description` | `string` | — | |
| `actions` | `Snippet` | — | Right-aligned beside the heading |
| `bare` | `boolean` | `false` | Skips the `Card` — for a `Table` or a `Dropzone` |
| `bodyClass` | `string` | `''` | Merged onto the body |
| `children` | `Snippet` | — | |

### `Tabs`

Horizontal section switcher. The active tab is an inverted pill that **slides** on a 0.3s
`power3.inOut` tween; the strip scrolls horizontally on narrow screens.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ id, label, icon?, badge?, href?, disabled? }[]` | `[]` | |
| `value` | `string` | `''` | **bindable**. The active `id` |
| `onchange` | `(id: string) => void` | — | Button mode only |
| `panelId` | `string` | — | Sets `aria-controls` on each tab |
| `label` | `string` | `'Sections'` | `aria-label` for the tablist |

Two modes, chosen by the items. Give items an `href` and they render as links with
`aria-current` — the mode to use for settings, so the section lives in the URL. Without
`href` they are `role="tab"` buttons with roving tabindex and arrow/Home/End keys.

Every tab is measured through a `ResizeObserver`, not once on mount: `<iconify-icon>` has no
box until its data arrives over HTTP, so a tab measured at mount is one icon too narrow and
the pill renders clipped through the label.

## Organisms

### `SideBar`

Collapsible vertical navigation panel on `bg-fc-component`, built from `NavButton` and
`TextElevate`. Animates its own width with GSAP.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | **Brand mark** — the one icon that stays `bold-duotone`. Rendered at `24` |
| `title` | `string` | `''` | Header text, revealed with `TextElevate` |
| `pages` | `{ label, href, icon?, active? }[]` | `[]` | Nav links, keyed by `href` |
| `user` | `{ name, avatar? }` | — | Footer card; falls back to the uppercased initial |
| `userHref` | `string` | — | Makes the footer card a link. **This is the only entry point to settings** |
| `userActive` | `boolean` | `false` | Marks the card active with the surface fill, not the inverted pill |
| `collapsed` | `boolean` | `false` | **bindable** |
| `showSearch` | `boolean` | `false` | Prepends a Search row (⌘K) and a Collapse row (⌘D) |
| `spaces` | `{ id, name }[]` | `[]` | Non-empty renders a `SpaceSwitcher` below the header |
| `activeSpaceId` | `string \| null` | `null` | Forwarded to `SpaceSwitcher` |
| `onSpaceSelect` | `(id: string \| null) => void` | — | Forwarded to `SpaceSwitcher` |
| `manageSpacesHref` | `string` | — | Forwarded as the switcher's footer link |

Width tweens between `68` and `220` — the numeric equivalents of
`--width-fc-nav-collapsed` and `--width-fc-nav-expanded` — over `0.3s` with `power3.inOut`.
The first pass uses `gsap.set` so there is no animation on mount, and
`prefersReducedMotion()` makes every later change a `set` too. Because the width is written
inline by GSAP, overriding it with a `class` will not hold.

The collapse toggle only exists when `showSearch` is true; otherwise drive `collapsed`
yourself.

```svelte
<SideBar
  icon={icons.dashboard}
  title="Facile"
  bind:collapsed
  showSearch
  pages={[
    { label: 'Home',     href: '/',         icon: icons.home, active: true },
    { label: 'Projects', href: '/projects', icon: icons.folder }
  ]}
  user={{ name: 'Camille' }}
  userHref="/settings"
  userActive={onSettings}
/>
```

**Never list Settings in `pages`.** The footer user card is the way in — it already carries
the gear glyph. See CHARTE §14.

When collapsed, the brand row, every `NavButton` and the footer user button all become
`size-11` squares rather than squeezed full-width rectangles, and their labels unmount.
The `SpaceSwitcher` is hidden entirely — its dropdown cannot escape the panel's
`overflow-hidden`, which the width tween requires.

### `SpaceSwitcher`

Dropdown switching between a personal context and a list of team spaces. Deliberately
framework-agnostic — no router import, no backend types; the consumer handles selection.
Closes on outside click via a `$effect`-scoped document listener.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `spaces` | `{ id, name }[]` | `[]` | Team spaces |
| `activeId` | `string \| null` | `null` | `null` selects the personal entry |
| `onSelect` | `(id: string \| null) => void` | — | Called with the chosen id, or `null` |
| `personalLabel` | `string` | `'Personal'` | Label for the no-space entry |
| `manageHref` | `string` | — | Renders a bordered footer link when set |
| `manageLabel` | `string` | `'Manage spaces'` | Footer link text |

The selected row is inverted (`bg-fc-accent text-fc-accent-fg`), matching nav convention.

### `MobileNav`

Floating glass pill bar fixed to the bottom, `md:hidden` — pair it with `SideBar` for
desktop. Bottom offset is `max(0.75rem, env(safe-area-inset-bottom))`, so it clears the iOS
home indicator. Give the scroll container `pb-28` so content can clear the bar.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ href, label, icon, active? }[]` | `[]` | Icon-only; `label` becomes `aria-label` and `title` |
| `user` | `{ name, avatar? }` | — | Trailing avatar pill |
| `profileHref` | `string` | — | Required alongside `user` for the avatar pill to render |
| `profileActive` | `boolean` | `false` | Inverts the avatar pill like an active item |

Style is `rounded-fc-pill border-fc-border/40 bg-fc-bg/55 backdrop-blur-2xl
backdrop-saturate-150 shadow-lg`; the active item is inverted.

### `Topbar`

Sticky `<header>` at `z-40`, `h-14`, `border-b border-fc-border`, `bg-fc-bg/80` with
`backdrop-blur`. Children are laid out with `justify-between` — pass a left group and a
right group.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

### `Modal`

Native `<dialog>` driven by an `$effect` that calls `showModal()` / `close()`. Escape closes
it through the browser and syncs `open` back to `false`. Max width `md`,
`backdrop:bg-black/40`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | **bindable** |
| `title` | `string` | — | Rendered as an `<h2>` above the children |
| `children` | `Snippet` | — | Required |

There is no built-in close button and no click-outside handler — provide your own control
that sets `open = false`. The dialog asks for `rounded-fc-lg`, but the theme defines no
`--radius-fc-lg`, so that utility is never generated and the corners stay square until you
pass a radius through `class`.

### `Table`

Styled wrapper around a native `<table>`, inside an `overflow-x-auto` box bordered
`border-fc-border`. Descendant selectors style `th`, `td` and `tbody tr` for you; pass real
`<thead>` / `<tbody>` markup.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

## Motion

### `Rideau`

Page-transition curtain. Raises on mount; call `close(href)` to drop it and then navigate.
Renders a fixed, `pointer-events-none`, `aria-hidden` overlay at `z-[9999]` sized `h-dvh`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `duration` | `number` | `1.5` | GSAP duration in seconds, both directions |
| `color` | `string` | `'var(--color-fc-bg)'` | Any CSS color; applied as inline `background` |

Exports one function, reachable via `bind:this`:

```svelte
<script lang="ts">
  import { Rideau } from '@facile/lib';

  let curtain = $state<{ close: (href: string) => void } | null>(null);
</script>

<Rideau bind:this={curtain} duration={1.2} />
<a href="/about" onclick={(e) => { e.preventDefault(); curtain?.close('/about'); }}>About</a>
```

`close(href)` navigates with `window.location.href`, i.e. a full page load, not a SvelteKit
client-side transition. Under reduced motion it skips the animation and navigates
immediately.

### `TextElevate`

Text that rises into view on mount, animated with `power3.out`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required. Rendered as plain text |
| `visible` | `boolean` | `true` | `false` drops the text back out — how the sidebar hides labels on collapse |
| `delay` | `number` | `0.2` | Seconds before the tween starts |
| `stagger` | `number` | `0.1` | Passed to GSAP; affects nothing today since one node animates |
| `duration` | `number` | `1` | Seconds |
| `class` | `string` | `''` | Merged onto the inner span — pass `truncate` for an ellipsis |

Under reduced motion the text is set to its final position with no tween. The animation runs
once from `onMount`; changing `text` afterwards updates the DOM without re-animating.

### `WordReveal`

Word-by-word color reveal scrubbed by scroll position. Registers the GSAP `ScrollTrigger`
and `SplitText` plugins on mount and splits `text` into words. Renders a `<p>` capped at
`60ch` with `text-fc-lg`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required |
| `dimColor` | `string` | `'#ffffff15'` | Starting color. A translucent white — set it explicitly on light backgrounds |
| `revealColor` | `string` | `'var(--color-fc-fg)'` | Final color |

The scroll trigger runs from `top center` to `bottom center` with `scrub: true`. Under
reduced motion the paragraph is painted at `revealColor` and no plugin work happens.
`SplitText` requires GSAP 3.13 or newer; the declared dependency range starts at `^3.12.0`.

### `Mosaique`

Scattered card mosaic. Cards start stacked at the center and bloom out to random,
non-overlapping positions, staggered `from: 'random'`. Handles loading, error, and empty
states itself.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ id: string \| number }[]` | — | Required. `id` keys the `{#each}` |
| `children` | `(item, index, ref) => unknown` | — | Required. Called per item; call `ref(el)` on your card element |
| `minDistance` | `number` | `110` mobile / `200` desktop | Minimum pixel gap between card centers |
| `paddingX` | `number` | `20` mobile / `80` desktop | Horizontal inset from the container edge |
| `paddingY` | `number` | `60` mobile / `140` desktop | Vertical inset |
| `isLoading` | `boolean` | `false` | Renders an `<iconify-icon>` spinner instead of the mosaic |
| `loadError` | `string` | `''` | Renders the message instead of the mosaic |

The `ref` callback must receive an `HTMLButtonElement` — the component types its card array
that way and calls `getBoundingClientRect()` on each entry. Placement tries 50 random
positions per card before giving up and using the center. Under reduced motion cards are set
to their computed positions instantly.

The loading state renders `<iconify-icon icon="line-md:loading-twotone-loop">`, which the
component neither imports nor declares as a dependency, and which is not from the Solar set
the rest of the library uses.

### `Carousel`

Touch and keyboard carousel using native scroll snapping. Slides are full width; arrow
buttons appear from the `md` breakpoint up. Dots track the active slide via an
`IntersectionObserver` at threshold `0.6`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `slides` | `{ id: string \| number }[]` | — | Required |
| `children` | `(slide, index) => unknown` | — | Required. Rendered inside each snap cell |
| `ariaLabel` | `string` | `'Carousel'` | Label on the wrapping `<section>` |

No GSAP: movement is `scrollIntoView({ behavior: 'smooth' })`, so it follows the browser's
own reduced-motion handling.

## Icons

`icons` maps 19 stable keys to Iconify names — Solar `linear` for chrome, MDI for
plus/close/chevrons — and `IconKey` is the union
of those keys. Full table in [configuration.md](configuration.md).

```svelte
<script lang="ts">
  import { icons } from '@facile/lib';
  import type { IconKey } from '@facile/lib';

  let current: IconKey = 'settings';
</script>

<iconify-icon icon={icons[current]} width="20" class="text-fc-fg/66"></iconify-icon>
```

muse does not ship or register the `<iconify-icon>` custom element. Install and import it in
the consumer app or the tags render as nothing.

## Helpers

Both live in `src/lib/utils/motion.ts` and are SSR-safe — each returns `false` when `window`
is undefined, so server rendering takes the "not reduced, not mobile" branch.

| Function | Signature | Returns |
|---|---|---|
| `prefersReducedMotion` | `() => boolean` | `window.matchMedia('(prefers-reduced-motion: reduce)').matches` |
| `isMobile` | `() => boolean` | `window.innerWidth < 768` |

Secret helpers live in `src/lib/utils/secret.ts`:

| Export | Signature | Notes |
|---|---|---|
| `REDACTED` | `'••••••••'` | A **wire contract** — several suite APIs send it as a field's value and read it back unchanged as "keep the stored secret" |
| `isRedacted` | `(value: string) => boolean` | True for a run of dots |
| `maskSecret` | `(value: string, mode?: 'ends' \| 'full') => string` | Fixed-length mask; never leaks the real length |

Both read their value at call time and do not react to changes. `isMobile()` in particular
is sampled once inside `Mosaique`'s `onMount`, so a resize past 768px does not re-layout.
