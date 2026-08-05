# muse — API

The complete exported surface of `@facile/lib`, read from `src/lib/index.ts`: 28 components,
2 motion helpers, the `icons` map and the `IconKey` type. Nothing else in the repo is
importable.

```ts
import {
  // atoms
  Alert, Avatar, Badge, Button, Card, Checkbox, Component, Divider,
  IconButton, Input, Radio, Select, Skeleton, Spinner, Switch, Textarea,
  // molecules
  Field, NavButton, StatCard,
  // organisms
  Modal, SideBar, Table, Topbar,
  // motion
  Carousel, Mosaique, Rideau, TextElevate, WordReveal,
  // helpers
  prefersReducedMotion, isMobile, icons
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
- There is no border color token; borders are `border-fc-fg/7` or `border-fc-fg/10`.

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

`primary` fills with `bg-fc-accent`; `ghost` is transparent with a `bg-fc-surface` hover;
`outline` adds `border-fc-fg/20`; `danger` fills with `bg-fc-danger` and literal `text-white`
rather than `--color-fc-accent-fg`.

All three sizes currently resolve to the same `py-2 px-4`, and the label is `text-fc-xs`,
which the theme defines as `8px`. Pass `class` to change either.

### `IconButton`

Round 40px icon button with the house spring press on `pointerdown`. Spreads to `<button>`
(`HTMLButtonAttributes`). Any nested `<svg>` is forced to `12×12`.

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
`border-fc-fg/10`.

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

Toggle backed by a visually hidden checkbox and a `peer`-driven track. **Does not spread** —
these four props are the whole surface, so no `id`, `name` or event handler passes through.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | **bindable** |
| `label` | `string` | — | Optional text |
| `disabled` | `boolean` | `false` | Dims the row and blocks the input |

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
`border-yellow-500/40 bg-yellow-500/10`. Consumers holding a strict palette override
`--color-yellow-500` to neutralize it. The `info` tone sets no border color, so it inherits
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

### `Divider`

`<hr>` with `border-t border-fc-fg/10` and `my-4`. Only prop is `class`.

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
| `icon` | `string` | — | Iconify name, rendered at `20×20` in `text-fc-fg/66` |
| `label` | `string` | — | Rendered through `TextElevate` at `text-fc-sm` |
| `active` | `boolean` | `false` | Adds `bg-fc-fg/7` |
| `collapsed` | `boolean` | `false` | Intended to hide the label |
| `textDelay` | `number` | `0.15` | Passed to `TextElevate` as its `delay` |
| `right` | `Snippet` | — | Right-aligned content — shortcut hint, chevron, count |

Base style is `px-3 py-3 w-full gap-2 rounded-fc-md border border-fc-fg/7
hover:bg-fc-fg/7 overflow-hidden`. Extra props land on the `<button>` branch only; on the
`<a>` branch `...rest` is not spread.

`collapsed` is forwarded to `TextElevate` as a `visible` prop, which `TextElevate` does not
declare — so it currently has no effect on the label, and collapsing relies on the parent's
width clipping the row. `CHARTE.md` additionally documents a `children` snippet on this
component; the current source has no such prop.

### `StatCard`

KPI tile for dashboards, on `bg-fc-surface`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Required. Uppercased, `text-fc-xs`, muted |
| `value` | `string \| number` | — | Required. `text-fc-2xl`, semibold |
| `delta` | `string` | — | Trend line under the value |
| `children` | `Snippet` | — | Optional slot for a sparkline or extra content |

## Organisms

### `SideBar`

Collapsible vertical navigation panel on `bg-fc-component`, built from `NavButton` and
`TextElevate`. Animates its own width with GSAP.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `string` | — | Iconify name for the header, rendered at `28` |
| `title` | `string` | `''` | Header text, revealed with `TextElevate` |
| `pages` | `{ label, href, icon?, active? }[]` | `[]` | Nav links, keyed by `href` |
| `user` | `{ name, avatar? }` | — | Footer button; falls back to the uppercased initial |
| `collapsed` | `boolean` | `false` | **bindable** |
| `showSearch` | `boolean` | `false` | Prepends a Search row (⌘K) and a Collapse row (⌘D) |

Width tweens between `77` and `220` — the numeric equivalents of
`--width-fc-nav-collapsed` and `--width-fc-nav-expanded` — over `0.5s` with `power2.inOut`
after a `0.1s` delay. The first pass uses `gsap.set` so there is no animation on mount, and
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
    { label: 'Settings', href: '/settings', icon: icons.settings }
  ]}
  user={{ name: 'Gian' }}
/>
```

### `Topbar`

Sticky `<header>` at `z-40`, `h-14`, `border-b border-fc-fg/10`, `bg-fc-bg/80` with
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
`border-fc-fg/10`. Descendant selectors style `th`, `td` and `tbody tr` for you; pass real
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
| `delay` | `number` | `0.2` | Seconds before the tween starts |
| `stagger` | `number` | `0.1` | Passed to GSAP; affects nothing today since one node animates |
| `duration` | `number` | `1` | Seconds |

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

`icons` maps 13 stable keys to Solar `bold-duotone` Iconify names, and `IconKey` is the union
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

Both read their value at call time and do not react to changes. `isMobile()` in particular
is sampled once inside `Mosaique`'s `onMount`, so a resize past 768px does not re-layout.
