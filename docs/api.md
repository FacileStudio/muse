# muse — API

The complete exported surface of `@facile/muse`, read from `src/lib/index.ts`: 48 components
(16 atoms, 12 molecules, 8 organisms, 6 charts, 6 motion pieces), the `cn` class merger, the
motion, press, field, secret and chart helpers, the `icons` map and the exported types.
Nothing else in the repo is importable — `ChartTable.svelte`, `components/charts/entry.ts`
and `utils/dialog.ts` are internal.

```ts
import {
  // atoms
  Alert, Avatar, Badge, Button, Card, Checkbox, Divider, IconButton,
  Input, Radio, Select, Skeleton, Spinner, StatusDot, Switch, Textarea,
  // molecules
  ColorPicker, Dropzone, Field, NavButton, OptionCards, SecretField,
  SettingsRow, SettingsSection, SpaceSwitcher, StatCard, Tabs, UploadProgress,
  // organisms
  ConfirmModal, Drawer, MobileNav, Modal, ProfileCard, SideBar, Table, Topbar,
  // charts
  BarChart, ChartLegend, ChartTooltip, DonutChart, LineChart, Sparkline,
  // motion
  Carousel, Mosaique, PageTransition, Rideau, TextElevate, WordReveal,
  // helpers
  cn, twMerge, prefersReducedMotion, isMobile, springPress, getFieldContext,
  icons, USER_COLORS, USER_COLOR_LABELS, normalizeUserColor, userColorLabel,
  REDACTED, isRedacted, maskSecret,
  chartColor, formatCompact, niceScale, linePath, areaPath, arcPath, tickStride, resize
} from '@facile/muse';

import type {
  IconKey, UserColor, FieldContext,
  ChartSeries, ChartSlice, ChartScale, ChartLegendItem, ChartTipRow, ChartRow
} from '@facile/muse';
```

Conventions across the library:

- Every component accepts `class` (typed `class?: string`) and merges it with `twMerge`, so
  a consumer utility replaces the component default rather than fighting the cascade. It is
  omitted from the prop tables below — assume it.
- Atoms, molecules and organisms spread `...rest` onto their root element, so any native
  attribute or `on*` handler passes through. The spread comes **last**, so the consumer wins.
  Four groups deliberately keep their own wiring after it: `Modal` and `Drawer` (the dialog
  controller's `onclose` / `oncancel` / `onclick`, which are what keep `open` in sync),
  `Tabs`, `ColorPicker`, `OptionCards` (role and keyboard handling) and `Dropzone` (the drag
  handlers). Chart and motion components take `class` only and spread nothing.
- Props marked **bindable** use `$bindable()` and support `bind:`.
- Callback props are camelCase `onX`. Lowercase `on*` names are native DOM handlers arriving
  through `...rest`.
- `children` is a Svelte 5 `Snippet` unless stated otherwise.
- Every `<button>` in the library declares `type`, and every focusable control carries the
  one focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring`.
- `twMerge` here is muse's `fc-*`-aware build from `src/lib/utils/cn.ts`, re-exported as
  `cn`. Use it — not raw `tailwind-merge` — for any custom `fc-*` markup, or size utilities
  will silently delete colour utilities. See [architecture.md](architecture.md).

## Tone vocabulary

One vocabulary, three widths, because not every component can carry every tone:

| Component | Tones |
|---|---|
| `Badge`, `StatusDot` | `neutral` `accent` `info` `success` `warning` `danger` `owner` `admin` |
| `Alert` | `neutral` `info` `success` `warning` `danger` — the status subset; a banner has no "accent" or role meaning |
| `ConfirmModal` | `neutral` `danger` — it only decides whether the confirm button is destructive |

`Button` is the deliberate exception: its `variant` is an *emphasis and shape* axis
(`primary` `ghost` `outline` `danger` `ghost-danger`), not a semantic colour axis.

## Atoms

### `Button`

Pill-shaped button. Spreads to `<button>` (`HTMLButtonAttributes`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'ghost' \| 'outline' \| 'danger' \| 'ghost-danger'` | `'primary'` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `icon` | `string` | — | Iconify name, rendered before the label |
| `iconRight` | `string` | — | Iconify name, rendered after the label |
| `type` | `string` | `'button'` | Declared so a button in a form does not submit it by accident |
| `children` | `Snippet` | — | Optional — an icon-only button is legal |

`primary` fills with `bg-fc-accent` — which equals the foreground colour, so it reads as an
inverted slab. `ghost` is transparent with a `bg-fc-surface` hover. `outline` adds
`border-fc-border`. `danger` is **tinted, not solid** (`bg-fc-danger/10 text-fc-danger`).
`ghost-danger` is muted at rest and turns red on hover — the variant for a destructive row
action inside a table or member list.

Sizes: `sm` is `h-8 px-3.5 text-fc-xs`, `md` is `h-9 px-4 text-fc-sm`, `lg` is
`h-11 px-6 text-fc-md`. The `icon` props size the glyph to the button (14 / 16 / 18) and emit
the required `width`, `height` and `class="block"` — never hand-write an `<iconify-icon>`
inside a `Button`.

```svelte
<Button icon={icons.plus}>New project</Button>
<Button variant="ghost-danger" icon={icons.remove} aria-label="Delete" />
```

### `IconButton`

Round 44px icon button carrying the house press (`use:springPress`). Spreads to
`<button>` (`HTMLButtonAttributes`). A nested `<svg>` is sized `4.5` and a nested
`<iconify-icon>` is forced to `display: block` so it centres.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'default' \| 'ghost' \| 'danger'` | `'default'` | `default` is bordered; the other two are transparent until hover |
| `type` | `string` | `'button'` | |
| `children` | `Snippet` | — | Required — the glyph |

The press is skipped entirely under `prefersReducedMotion()`. `springPress` attaches its own
`pointerdown` listener, so a consumer `onpointerdown` coming through `...rest` runs alongside
it rather than replacing it.

### `Card`

Container surface: `rounded-fc-md bg-fc-component p-4`. **No border** — the fill is what
separates it from the page. Spreads to `<div>`.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

### `Input`

Spreads to `<input>` (`HTMLInputAttributes`). `h-11`, full width, `border-fc-border`,
`bg-fc-bg`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string \| number` | `''` | **bindable** |

Inside a `Field` it adopts the field's generated `id`, `aria-describedby` and `aria-invalid`
through context. An explicit `id` / `aria-describedby` / `aria-invalid` prop always wins, and
outside a `Field` the context lookup is a no-op. Pass `type`, `placeholder`, `disabled`,
`required` and friends through the spread.

### `Textarea`

Spreads to `<textarea>` (`HTMLTextareaAttributes`). Vertically resizable, full width. Adopts
`Field` context exactly like `Input`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | **bindable** |
| `rows` | `number` | `4` | |

### `Select`

Spreads to `<select>` (`HTMLSelectAttributes`). Native control, `h-11`, full width. Adopts
`Field` context exactly like `Input`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | **bindable** |
| `children` | `Snippet` | — | Required. Supply the `<option>` elements |

### `Checkbox`

Spreads to the inner `<input type="checkbox">` (`HTMLInputAttributes` minus `type`/`checked`).
Wrapped in a `<label>`, so the optional text is clickable.

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

Toggle backed by a visually hidden checkbox (`role="switch"`) and a `peer`-driven track.
`...rest` spreads onto the input, so `id`, `name`, `aria-label` and `onchange` all pass
through.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` | `boolean` | `false` | **bindable** |
| `label` | `string` | — | Optional text |
| `disabled` | `boolean` | `false` | Dims the row and blocks the input |

The accessible name comes from `label`. A `Switch` inside a `SettingsRow` — where the text
lives in the row, not the switch — has **no** accessible name unless you pass `aria-label`,
or the row passes `for` and you give the switch a matching `id`.

### `Badge`

Inline pill, `rounded-fc-pill`, `text-fc-xs`, transparent border. Spreads to `<span>`.

| Prop | Type | Default |
|---|---|---|
| `tone` | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'owner' \| 'admin'` | `'neutral'` |
| `children` | `Snippet` | — (required) |

`neutral` is `bg-fc-surface text-fc-fg-muted`; `accent` is the inverted slab
(`bg-fc-accent text-fc-accent-fg`); every other tone is a 10% tint of its own token with the
token as text colour. No tone uses a solid saturated fill or a literal colour.

### `Alert`

Status banner, `rounded-fc-md`, `text-fc-sm`, 1px tinted border. Spreads to `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | |
| `title` | `string` | — | Medium-weight line above the body |
| `children` | `Snippet` | — | Optional |

The ARIA role is derived, not fixed: `warning` and `danger` get `role="alert"` (an assertive
live region that interrupts the screen reader), everything else gets `role="status"`. Only
earn the interruption for tones the user must act on.

### `Avatar`

Round avatar with an initial fallback, on `bg-fc-accent`. **Never bordered.** Spreads to
`<span>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `src` | `string` | — | When absent, the initial is shown |
| `alt` | `string` | — | Falls back to `name` so the image is never silently decorative |
| `name` | `string` | `''` | First character uppercased is the fallback; `?` when empty |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `h-8` / `h-10` / `h-14`, with matching `width`/`height` on the `<img>` |

The initial and the label are `$derived`, so a `name` that changes after mount updates.

### `Spinner`

`role="status"` border spinner with a `border-t-fc-fg` arc. Halts under `motion-reduce`.
Spreads to `<span>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `h-4` / `h-6` / `h-10` |
| `label` | `string` | `'Loading'` | Becomes `aria-label` |

### `Skeleton`

Pulsing placeholder block, `rounded-fc-sm`, `bg-fc-surface/60`, halted under
`motion-reduce`. Spreads to `<div>`. Sizing is the `class` prop's job (`class="h-4 w-32"`).

### `StatusDot`

Coloured dot plus optional text, for connection and health state. Spreads to `<span>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `'neutral' \| 'accent' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'owner' \| 'admin'` | `'neutral'` | |
| `label` | `string` | — | Rendered beside the dot |
| `pulse` | `boolean` | `false` | Adds an `animate-ping` ring, hidden under `motion-reduce` |

Reserve `pulse` for genuinely in-flight states (connecting, reconnecting) — a permanently
pulsing dot is just noise.

### `Divider`

`<hr>` with `border-0 border-t border-fc-border my-4`. Spreads to `<hr>`.

## Molecules

### `Field`

Form-row wrapper: label above, control in the middle, helper or error below. Spreads to
`<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `Snippet<[{ id: string; describedBy: string \| undefined }]>` | — | Required. The control |
| `label` | `string` | — | Rendered as a real `<label for>` |
| `helper` | `string` | — | Shown only when `error` is absent |
| `error` | `string` | — | Takes precedence over `helper`, rendered in `text-fc-danger` |
| `for` | `string` | — | Use an id you already manage instead of the generated one |

The ids reach the control two ways. muse's own `Input`, `Select` and `Textarea` pick them up
**automatically through context** (`getFieldContext`), so the common case needs no ceremony:

```svelte
<Field label="Project name" error={nameError}>
  <Input bind:value={name} />
</Field>
```

For a control muse does not own, the same ids arrive as snippet parameters:

```svelte
<Field label="Colour" helper="Shown next to your name">
  {#snippet children({ id, describedBy })}
    <MyColorInput {id} aria-describedby={describedBy} />
  {/snippet}
</Field>
```

`describedBy` points at the error message when `error` is set, at the helper otherwise, and
is `undefined` when there is neither. The context also carries `invalid`, which the muse
atoms turn into `aria-invalid="true"`.

### `NavButton`

One row of a navigation rail. Renders as `<a>` when `href` is set, otherwise
`<button type="button">`. Carries `use:springPress` on both branches. `...rest` is spread on
whichever element renders.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | `string` | — | Presence switches the element from `<button>` to `<a>` |
| `icon` | `string` | — | Iconify name, rendered at `18×18`, inheriting `currentColor` |
| `label` | `string` | — | Rendered through `TextElevate` at `text-fc-sm` |
| `active` | `boolean` | `false` | Inverts the row: `bg-fc-accent text-fc-accent-fg font-medium`, plus `aria-current="page"` on the link branch |
| `collapsed` | `boolean` | `false` | Unmounts the label and makes the row a `size-fc-nav-item` square |
| `textDelay` | `number` | `0.15` | Passed to `TextElevate` as its `delay` |
| `right` | `Snippet` | — | Right-aligned content — shortcut hint, chevron, count |

Expanded, the row is `w-full min-h-11 px-3 py-2.5`; collapsed it becomes a 44px square
(`--spacing-fc-nav-item`) rather than a squeezed rectangle, and the label subtree is unmounted
rather than clipped.

### `StatCard`

KPI tile for dashboards, rendered as a `Card` — so `bg-fc-component` and **no border**.
Spreads to the card `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | Required. Uppercased, `text-fc-xs`, muted |
| `value` | `string \| number` | — | Required. `text-fc-2xl`, semibold |
| `delta` | `string` | — | Trend line under the value |
| `children` | `Snippet` | — | Optional slot for a `Sparkline` or extra content |

### `Tabs`

Horizontal section switcher. The active tab is an inverted pill that **slides** on a 0.3s
`power3.inOut` tween; the strip scrolls horizontally on narrow screens. Spreads to the
wrapping `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ id, label, icon?, badge?, href?, disabled? }[]` | `[]` | |
| `value` | `string` | `''` | **bindable**. The active `id` |
| `onChange` | `(id: string) => void` | — | Button mode only |
| `panelId` | `string` | — | Sets `aria-controls` on each tab |
| `label` | `string` | `'Sections'` | `aria-label` for the tablist |

Two modes, chosen by the items. Give items an `href` and they render as links with
`aria-current` and no tablist semantics — the mode to use for settings, so the section lives
in the URL. Without `href` they are `role="tab"` buttons with roving tabindex and
arrow/Home/End keys.

Every tab is measured through a `ResizeObserver`, not once on mount: `<iconify-icon>` is a
custom element with no box until its data arrives over HTTP, so a tab measured at mount is one
icon too narrow and the pill renders clipped through the label.

### `SettingsRow`

Label and description on the left, control on the right; stacks below `sm:`. Spreads to
`<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | |
| `description` | `string` | — | `text-fc-xs`, muted |
| `for` | `string` | — | Renders the label as a real `<label for>` instead of a `<span>` |
| `stacked` | `boolean` | `false` | Control on its own full-width line — use for text fields |
| `children` | `Snippet` | — | The control |

Each row draws its own top rule with `first:border-t-0`, so a section never has to know how
many rows it holds.

### `SettingsSection`

Heading, description, optional actions, and a `Card` around the body. Spreads to `<section>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `title` | `string` | — | `text-fc-lg`, semibold, rendered as `<h2>` |
| `description` | `string` | — | |
| `actions` | `Snippet` | — | Right-aligned beside the heading |
| `bare` | `boolean` | `false` | Skips the `Card` — for a `Table` or a `Dropzone` that brings its own surface |
| `bodyClass` | `string` | `''` | Merged onto the body |
| `children` | `Snippet` | — | |

### `SecretField`

The one way to show, set or copy a credential. Renders a mono field plus `IconButton` reveal
and copy actions, and an `aria-live` region announcing each state change. Spreads to `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `string` | `''` | **bindable** |
| `visible` | `boolean` | `false` | **bindable** |
| `label` / `helper` / `error` / `placeholder` | `string` | — | `helper` hidden while `error` is set |
| `editable` | `boolean` | `false` | `false` renders a read-only `<output>`; `true` renders an input |
| `sensitive` | `boolean` | `true` | `false` shows the value plainly and drops the eye — for URLs and IDs |
| `copyable` | `boolean` | `true` | |
| `mask` | `'ends' \| 'full'` | `'ends'` | `ends` keeps the first four and last four characters |
| `autoHideMs` | `number` | `15000` | Re-hides a revealed value. `0` disables |
| `disabled` | `boolean` | `false` | |
| `for` | `string` | — | Use an id you already manage instead of the generated one |
| `actions` | `Snippet` | — | Extra buttons after copy — rotate, revoke |
| `onReveal` | `(visible: boolean) => void` | — | Fires on toggle; hook your audit log here |
| `onCopy` | `(ok: boolean) => void` | — | `false` when the clipboard write threw |

The mask is a fixed eight dots and never mirrors the real length. A value equal to `REDACTED`
is treated as "the server kept it": both buttons go inert, since there is nothing to reveal
or copy. Copy flashes a check for 2s.

```svelte
<SecretField value={token} />
<SecretField bind:value={secret} editable />
<SecretField value={endpoint} sensitive={false} />
```

### `OptionCards`

Single-select radiogroup rendered as icon cards — theme, density, view mode, plan. The
selected card is **inverted**, matching every other selected state in the suite. Spreads to
the group `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `{ value, label, icon?, disabled? }[]` | `[]` | |
| `value` | `string` | `''` | **bindable** |
| `name` | `string` | — | Emits a hidden input so the group posts in a plain form |
| `label` | `string` | — | `aria-label` for the radiogroup |
| `onSelect` | `(value: string) => void` | — | |

`role="radiogroup"` with roving tabindex and arrow/Home/End keys, stepping over disabled
options. With nothing selected, a forward key opens on the first card and a backward key on
the last. There is no description slot on purpose: the explanation belongs in the
`SettingsRow` above, not repeated in every card.

### `ColorPicker`

Swatch radiogroup over the shared identity palette. Spreads to the group `<div>`
(`HTMLAttributes<HTMLDivElement>` minus `onselect`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `colors` | `readonly string[]` | `USER_COLORS` | The six-hex identity palette |
| `value` | `string` | `''` | **bindable**. Matched case- and whitespace-insensitively |
| `labels` | `Record<string, string>` | `USER_COLOR_LABELS` | Accessible name per swatch |
| `showLabels` | `boolean` | `false` | Renders the name under each swatch |
| `size` | `'sm' \| 'md'` | `'md'` | `h-5` / `h-7` dots |
| `name` | `string` | — | Emits a hidden input so the group posts in a plain form |
| `label` | `string` | — | `aria-label` for the radiogroup |
| `onSelect` | `(color: string) => void` | — | |

The six hexes are a persisted data contract shared with Sablier — do not restyle them.

### `Dropzone`

Drag-and-drop file intake wrapping a visually hidden `<input type="file">`, so the whole zone
is one big label and keyboard-reachable for free. Dashed `border-fc-border` on `bg-fc-bg`.
Spreads to `<label>` (`HTMLLabelAttributes`); the drag handlers are attached after the spread.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `files` | `File[]` | `[]` | **bindable**. Appends when `multiple`, replaces otherwise |
| `accept` | `string` | — | Same syntax as the native attribute; enforced in JS for drops too |
| `multiple` | `boolean` | `false` | |
| `maxSize` | `number` | — | Bytes, per file |
| `maxFiles` | `number` | — | Only meaningful with `multiple` |
| `disabled` | `boolean` | `false` | |
| `label` | `string` | `'Drop files here'` | |
| `hint` | `string` | — | Second line; folded into the input's `aria-label` |
| `onFiles` | `(files: File[]) => void` | — | Accepted files only |
| `onReject` | `(rejections: { file: File; reason: 'type' \| 'size' \| 'count' }[]) => void` | — | |
| `children` | `Snippet` | — | Replaces the default icon + label + Browse pill |

The zone consumes files; it never uploads them. Pair with `UploadProgress` and drive the
transfer yourself. Drag state is a depth counter, not a boolean, because `dragenter` and
`dragleave` bubble from every child.

### `UploadProgress`

Per-file progress list with cancel and retry. Spreads to `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ id, name, size?, progress, status, error? }[]` | — | Required. `status` is `'pending' \| 'uploading' \| 'done' \| 'error'` |
| `onCancel` | `(id: string) => void` | — | Renders a cancel action when set |
| `onRetry` | `(id: string) => void` | — | Renders a retry action on failed rows |
| `showTotal` | `boolean` | `true` | Aggregate bar above the list |

`progress` is a 0–100 number, clamped and rounded on render; sizes are formatted with binary
units. The component owns no transfer state — it renders what you give it.

### `SpaceSwitcher`

Dropdown switching between a personal context and a list of team spaces. Deliberately
framework-agnostic — no router import, no backend types. Spreads to the wrapping `<div>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `spaces` | `{ id, name }[]` | `[]` | Team spaces |
| `activeId` | `string \| null` | `null` | `null` selects the personal entry |
| `onSelect` | `(id: string \| null) => void` | — | Called with the chosen id, or `null` |
| `personalLabel` | `string` | `'Personal'` | Label for the no-space entry |
| `manageHref` | `string` | — | Renders a bordered footer link when set |
| `manageLabel` | `string` | `'Manage spaces'` | Footer link text |

The menu flips above the trigger when there is not at least 160px below it, and caps its own
height to the space available. Outside click closes it; Escape closes it **and returns focus
to the trigger**. The selected row is inverted, matching nav convention.

## Organisms

### `SideBar`

Collapsible vertical navigation panel on `bg-fc-component`, built from `NavButton`,
`SpaceSwitcher` and `TextElevate`. Animates its own width with GSAP. Spreads to the root
`<div>`.

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

The width tween **reads the tokens** — `getComputedStyle` for `--width-fc-nav-collapsed` and
`--width-fc-nav-expanded`, falling back to 68 and 220 only for SSR or a consumer that skipped
the stylesheet — over `0.3s` with `power3.inOut`. Retheming the rail therefore reaches the
animation. The first pass uses `gsap.set` so nothing animates on mount, and
`prefersReducedMotion()` makes every later change a `set` too. Because the width is written
inline by GSAP, overriding it with `class` will not hold.

The rows' visual collapse deliberately lags `collapsed`: expanding switches the layout first
so the growing rail reveals it, collapsing keeps the wide layout and lets the shrinking rail
clip it away. The collapse toggle only exists when `showSearch` is true; otherwise drive
`collapsed` yourself.

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
the gear glyph.

### `MobileNav`

Floating glass pill bar fixed to the bottom, `md:hidden` — pair it with `SideBar` for desktop.
Bottom offset is `max(0.75rem, env(safe-area-inset-bottom))`, so it clears the iOS home
indicator. Give the scroll container `pb-28` so content can clear the bar. Spreads to `<nav>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ href, label, icon, active? }[]` | `[]` | Icon-only; `label` becomes `aria-label` and `title` |
| `user` | `{ name, avatar? }` | — | Trailing avatar pill |
| `profileHref` | `string` | — | Required alongside `user` for the avatar pill to render |
| `profileActive` | `boolean` | `false` | Inverts the avatar pill like an active item |

The bar is `rounded-fc-pill bg-fc-bg/70 shadow-lg backdrop-blur-2xl backdrop-saturate-150` at
`z-50` — a floating surface, so it gets the shadow, and **no border**. The active item is
inverted.

### `Topbar`

Sticky `<header>` at `z-30`, `h-14`, `border-b border-fc-border`, `bg-fc-bg/80` with
`backdrop-blur`. Children are laid out with `justify-between` — pass a left group and a right
group. Spreads to `<header>`.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

### `Table`

Styled wrapper around a native `<table>`, inside an `overflow-x-auto` box on
`bg-fc-component` with `rounded-fc-md` and **no border**. Descendant selectors style `th`,
`td` and `tbody tr` for you; pass real `<thead>` / `<tbody>` markup. Spreads to the wrapper
`<div>`.

| Prop | Type | Default |
|---|---|---|
| `children` | `Snippet` | — (required) |

Row separation comes from `[&_tbody_tr]:border-t border-fc-border` — a rule *inside* the
container, which is the one place 1px borders belong.

### `Modal`

Native `<dialog>` driven through the shared controller in `src/lib/utils/dialog.ts`:
`showModal()` / `close()` sync, a closing latch so the exit animation owns the actual close,
Escape gated on `dismissible`, a backdrop hit-test, and a refcounted body scroll lock.
Spreads to `<dialog>` (`HTMLDialogAttributes`) — but the controller's `onclose`, `oncancel`
and `onclick` are spread **after** `rest` and deliberately win.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | **bindable** |
| `title` | `string` | — | Rendered as an `<h2>` and wired to `aria-labelledby` |
| `dismissible` | `boolean` | `true` | `false` blocks Escape and backdrop clicks |
| `showClose` | `boolean` | `false` | Adds a 44px close button — only when `dismissible` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `max-w-sm` / `max-w-md` / `max-w-lg` |
| `onClose` | `() => void` | — | Fires after the native `close`, once `open` is back to `false` |
| `header` | `Snippet` | — | Replaces the title row; suppresses `aria-labelledby`, so name the dialog yourself |
| `footer` | `Snippet` | — | |
| `children` | `Snippet` | — | Required |

Enter is opacity + `scale(0.97)→1` over 0.2s `power3.out`; exit reverses it over 0.15s. Both
collapse to a `set` under reduced motion. The surface is
`rounded-fc-lg border border-fc-border bg-fc-component` with a `backdrop:bg-black/50` scrim.

`m-auto` in the class string is load-bearing: a `<dialog>` opened with `showModal()` is
centred by the UA's own `margin: auto`, and Tailwind preflight's `margin: 0` reset kills
exactly that.

### `Drawer`

Bottom sheet on the same dialog controller, with drag-to-dismiss. Spreads to `<dialog>`; the
controller's handlers are spread after `rest` and win, same as `Modal`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | **bindable** |
| `title` | `string` | — | `<h2>`, wired to `aria-labelledby` |
| `description` | `string` | — | Muted line under the title |
| `children` | `Snippet` | — | Required. The scrolling body |
| `footer` | `Snippet` | — | Pinned below the body, above the safe-area inset |
| `showHandle` | `boolean` | `true` | The grab bar |
| `showClose` | `boolean` | `false` | Close `IconButton` in the header |
| `dismissible` | `boolean` | `true` | `false` blocks Escape, the backdrop and the drag |
| `onClose` | `() => void` | — | Fires after the native `close` |

Enter is `y: 100% → 0` over 0.35s `power3.out`; exit reverses over 0.25s. Dragging past 25%
of the panel height, or flicking faster than 0.5px/ms, dismisses; anything less settles back.
Under reduced motion the sheet still **drags** — it just snaps instead of tweening, because
reduced motion asks for no animation, not for no interaction. A drag starting on a
`button`, `a`, `input`, `select` or `textarea` is ignored.

`w-full max-w-none` is load-bearing: it defeats the UA's `width: fit-content` and
`max-width: calc(100% - 6px - 2em)` on modal dialogs.

### `ConfirmModal`

A `Modal` preset for destructive confirmation. Never assemble one from a bare `Modal` and two
buttons. Spreads to the underlying `<dialog>`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | `false` | **bindable** |
| `title` | `string` | — | **Required** |
| `description` | `string` | — | |
| `confirmLabel` | `string` | `'Confirm'` | |
| `cancelLabel` | `string` | `'Cancel'` | |
| `tone` | `'neutral' \| 'danger'` | `'neutral'` | `danger` tints the badge and makes the confirm button `variant="danger"` |
| `icon` | `string` | — | Badge glyph; `danger` defaults to `solar:danger-triangle-linear` |
| `onConfirm` | `() => void \| Promise<void>` | — | |
| `onCancel` | `() => void` | — | Fires on any dismissal that is not a completed confirm |
| `children` | `Snippet` | — | Extra body content below the description |

Return a promise from `onConfirm` and the dialog goes pending: both buttons disable, the
confirm button shows a `Spinner`, and dismissal is blocked. It closes on resolve and **stays
open on reject**, so a failed delete does not silently vanish.

Focus lands on Cancel, never Confirm — a confirmation dialog that arms the destructive button
under the Enter key the user is already holding is a trap.

### `ProfileCard`

Identity block: avatar with optional colour dot, name, role badge, email, metadata rows and
actions. Rendered as a `Card`. Spreads to the card `<div>`
(`HTMLAttributes<HTMLDivElement>` minus `role`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | — | **Required** |
| `email` | `string` | — | |
| `avatar` | `string` | — | Image URL; falls back to the initial |
| `color` | `string` | — | Identity colour, drawn as a dot on the avatar corner |
| `role` | `string` | — | The **workspace** role, not an ARIA role. `owner` / `admin` pick the matching `Badge` tone; anything else is `neutral` |
| `meta` | `{ label, value }[]` | `[]` | Definition rows below a divider |
| `actions` | `Snippet` | — | Buttons beside (horizontal) or under (vertical) the identity block |
| `children` | `Snippet` | — | Extra content below a second divider |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | `vertical` centres everything — for a settings profile header |

The DOM `role` attribute is dropped from the passthrough on purpose: it would collide with
the `role` prop into an intersection type no caller can satisfy.

## Charts

Dependency-free inline SVG. Do not add a charting library, and do not pass your own series
colours — `chartColor(i)` assigns `fc-chart-1…6` by series index in fixed order, which is
what keeps two charts on the same page agreeing about what "series 2" looks like.

Every chart measures its own width with the `resize` action, renders an
`aria-hidden` SVG, and emits a visually hidden `<table>` beside it so screen readers get the
data rather than nothing. All four take `animate` (default `true`) and skip the entry
animation under `prefersReducedMotion()`, and all four render `emptyLabel` in place of the
plot when there is no data.

### `LineChart`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `series` | `ChartSeries[]` | — | Required. `{ name, data, color? }` |
| `labels` | `string[]` | — | Required. X categories |
| `height` | `number` | `220` | Plot height in px |
| `area` | `boolean` | `false` | Fills under the line at 12% opacity |
| `smooth` | `boolean` | `true` | Curved rather than straight segments |
| `showGrid` | `boolean` | `true` | |
| `showLegend` | `boolean` | `series.length > 1` | |
| `yFormat` | `(n: number) => string` | `formatCompact` | |
| `xFormat` | `(label: string, i: number) => string` | identity | |
| `yTicks` | `number` | `4` | Target count; the real ticks come from `niceScale` |
| `animate` | `boolean` | `true` | Dash-offset draw-in |
| `emptyLabel` | `string` | `'No data'` | |

Pointer movement anywhere over the plot snaps to the nearest index and raises a crosshair, a
dot per series and a `ChartTooltip`.

### `BarChart`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `series` | `ChartSeries[]` | — | Required |
| `labels` | `string[]` | — | Required. Categories |
| `height` | `number` | `220` | |
| `stacked` | `boolean` | `false` | |
| `horizontal` | `boolean` | `false` | Rotates the whole geometry, including the ticks |
| `showGrid` | `boolean` | `true` | |
| `showLegend` | `boolean` | `series.length > 1` | |
| `yFormat` | `(n: number) => string` | `formatCompact` | |
| `yTicks` | `number` | `4` | |
| `animate` | `boolean` | `true` | |
| `emptyLabel` | `string` | `'No data'` | |

The value axis always includes zero (`niceScale(..., includeZero: true)`) — a truncated
baseline makes bar lengths lie about their values. Hovering a category band highlights it and
opens a `ChartTooltip` with every series at that category.

### `DonutChart`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `ChartSlice[]` | — | Required. `{ label, value, color? }` |
| `size` | `number` | `180` | Diameter in px |
| `thickness` | `number` | `22` | Ring width |
| `showLegend` | `boolean` | `true` | |
| `centerLabel` | `string` | — | Muted caption under the centre value |
| `centerValue` | `string \| number` | `valueFormat(total)` | |
| `valueFormat` | `(n: number) => string` | `formatCompact` | |
| `animate` | `boolean` | `true` | |
| `emptyLabel` | `string` | `'No data'` | |

The hovered wedge lifts; only that wedge is re-pathed, so the rest of the ring is untouched
per frame. Arcs below ~1.1° are dropped — below that they are sub-pixel at any radius the
library ships and read as missing.

### `Sparkline`

Inline trend line for a `StatCard` or a table cell. No axes, no tooltip.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `number[]` | `[]` | |
| `height` | `number` | `32` | |
| `area` | `boolean` | `true` | |
| `smooth` | `boolean` | `true` | |
| `color` | `string` | `'var(--color-fc-chart-1)'` | The one chart that takes a colour, because it has no series to index |
| `showLast` | `boolean` | `false` | Marks the final point and reserves the padding for it |
| `valueFormat` | `(n: number) => string` | `formatCompact` | Used in the hidden data table |
| `animate` | `boolean` | `true` | |
| `emptyLabel` | `string` | `'No data'` | |

### `ChartLegend`

The legend the four charts render for themselves; exported so a custom composition can match.
Renders nothing when `items` is empty.

| Prop | Type | Default |
|---|---|---|
| `items` | `ChartLegendItem[]` | `[]` |

### `ChartTooltip`

Absolutely positioned tooltip, `z-10`, for a custom plot. Its parent must be positioned.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `x` | `number` | — | Required. Pointer x within the plot box |
| `y` | `number` | — | Required |
| `title` | `string` | — | |
| `rows` | `ChartTipRow[]` | `[]` | `{ name, value, color? }` |
| `visible` | `boolean` | `false` | Required |

It measures itself once per open and again only on a real resize — reading `offsetWidth` per
`pointermove` forced a synchronous layout every frame. Bounds are the plot box intersected
with the viewport, so a chart flush against a card edge flips the tooltip inward instead of
spilling out.

## Motion

### `PageTransition`

Fades and lifts its children whenever `key` changes — key it on the route.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `key` | `string \| number` | — | Required. A change re-runs the tween |
| `duration` | `number` | `0.35` | Seconds |
| `distance` | `number` | `12` | Pixels travelled on the way in |
| `children` | `Snippet` | — | Required |

Under reduced motion the content is set to its final state with no tween.

### `Rideau`

Full-page transition curtain. Raises on mount; call `close(href)` to drop it and then
navigate. Renders a fixed, `pointer-events-none` overlay at `z-[100]` sized `h-dvh`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `duration` | `number` | `1.5` | GSAP duration in seconds, both directions |
| `color` | `string` | `'var(--color-fc-bg)'` | Any CSS colour; applied as inline `background` |

Exports one function, reachable via `bind:this`:

```svelte
<script lang="ts">
  import { Rideau } from '@facile/muse';

  let curtain = $state<{ close: (href: string) => void } | null>(null);
</script>

<Rideau bind:this={curtain} duration={1.2} />
<a href="/about" onclick={(e) => { e.preventDefault(); curtain?.close('/about'); }}>About</a>
```

`close(href)` navigates with `window.location.href`, i.e. a full page load, not a SvelteKit
client-side transition. Under reduced motion it skips the animation and navigates immediately.

### `TextElevate`

Text that rises into view, animated with `power3.out`. This is what `NavButton` and `SideBar`
use to reveal and hide labels on collapse.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required. Rendered as plain text |
| `visible` | `boolean` | `true` | `false` drops the text back out |
| `delay` | `number` | `0.2` | Seconds before the tween starts |
| `stagger` | `number` | `0.1` | Passed to GSAP; affects nothing today since one node animates |
| `duration` | `number` | `1` | Seconds |

Pass `truncate` through `class` for an ellipsis. Under reduced motion the text is set to its
final position with no tween.

### `WordReveal`

Word-by-word colour reveal scrubbed by scroll position. Registers the GSAP `ScrollTrigger`
and `SplitText` plugins on mount and splits `text` into words. Renders a `<p>` capped at
`60ch` with `text-fc-lg`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `text` | `string` | — | Required |
| `dimColor` | `string` | `color-mix(in oklab, var(--color-fc-fg) 25%, transparent)` | Starting colour — token-derived, so it works in both schemes |
| `revealColor` | `string` | `'var(--color-fc-fg)'` | Final colour |

The scroll trigger runs from `top center` to `bottom center` with `scrub: true`, and is
killed on destroy together with the `SplitText` revert — a surviving ScrollTrigger recomputes
on every scroll event and holds the detached spans alive. Under reduced motion the paragraph
is painted at `revealColor` and no plugin work happens. `SplitText` entered the public gsap
package in 3.13, which is why the dependency floor is `^3.13.0`.

### `Carousel`

Touch and keyboard carousel using native scroll snapping. Slides are full width; arrow buttons
appear from the `md` breakpoint up. Dots track the active slide via an `IntersectionObserver`
at threshold `0.6`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `slides` | `{ id: string \| number }[]` | — | Required |
| `children` | `Snippet<[Slide, number]>` | — | Required. Rendered inside each snap cell |
| `ariaLabel` | `string` | `'Carousel'` | Label on the wrapping `<section>` |

No GSAP: movement is `scrollIntoView`, with `behavior` dropped to `'auto'` under reduced
motion.

### `Mosaique`

Scattered card mosaic. Cards start stacked at the centre and bloom out to random,
non-overlapping positions, staggered `from: 'random'`. Handles loading, error and empty states
itself.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ id: string \| number }[]` | — | Required. `id` keys the `{#each}` |
| `children` | `Snippet<[Item, number, (el: HTMLButtonElement) => void]>` | — | Required. Call the third argument with your card element |
| `minDistance` | `number` | `110` mobile / `200` desktop | Minimum pixel gap between card centres |
| `paddingX` | `number` | `20` mobile / `80` desktop | Horizontal inset from the container edge |
| `paddingY` | `number` | `60` mobile / `140` desktop | Vertical inset |
| `isLoading` | `boolean` | `false` | Renders a `Spinner` instead of the mosaic |
| `loadError` | `string` | `''` | Renders the message instead of the mosaic |

The `ref` callback must receive an `HTMLButtonElement` — the component types its card array
that way and calls `getBoundingClientRect()` on each entry. Placement tries 50 random positions
per card before giving up and using the centre. Under reduced motion cards are set to their
computed positions instantly. `isMobile()` is sampled once during placement, so a resize past
768px does not re-derive the defaults.

## Icons

`icons` maps 45 stable keys to Iconify names — Solar `linear` for chrome, MDI for
plus/close/chevrons — and `IconKey` is the union of those keys. Full table in
[configuration.md](configuration.md).

```svelte
<script lang="ts">
  import { icons } from '@facile/muse';
  import type { IconKey } from '@facile/muse';

  let current: IconKey = 'settings';
</script>

<iconify-icon icon={icons[current]} width="20" height="20" class="block"></iconify-icon>
```

muse does not ship or register the `<iconify-icon>` custom element. Install and import it in
the consumer app, or every tag renders as nothing — including the ones inside `Button`,
`NavButton`, `Tabs`, `OptionCards`, `Dropzone`, `UploadProgress`, `SecretField`,
`SpaceSwitcher`, `SideBar`, `MobileNav`, `Modal`, `Drawer` and `ConfirmModal`.

## Helpers

### Motion and press

`src/lib/utils/motion.ts` — both SSR-safe; each returns `false` when `window` is undefined, so
server rendering takes the "not reduced, not mobile" branch.

| Export | Signature | Returns |
|---|---|---|
| `prefersReducedMotion` | `() => boolean` | `window.matchMedia('(prefers-reduced-motion: reduce)').matches` |
| `isMobile` | `() => boolean` | `window.innerWidth < 768` |

Both read their value at call time and do not react to changes.

`src/lib/utils/press.ts`:

| Export | Signature | Notes |
|---|---|---|
| `springPress` | `(node: HTMLElement, scale?: number) => ActionReturn` | Svelte action. Dip in `0.07s` `power2.out`, back to `1` in `0.22s` `power2.out`, no overshoot. Depth is solved per press so every edge travels 1.5px whatever the element's width (`1 - 3 / width`, clamped `0.93…0.997`) — pass a `scale` to override, `1` to opt out. No-ops under reduced motion, and kills its tween on destroy |

It is an action rather than three inlined gsap sequences because the curve is the whole point:
hand-copied versions drifted into two different scales the first time this was inlined.

### Field context

`src/lib/utils/field.ts`. `Field` publishes it; `Input`, `Select` and `Textarea` consume it.
Export it publicly so a consumer's own control can behave the same way.

| Export | Signature |
|---|---|
| `getFieldContext` | `() => (() => FieldContext) \| undefined` |
| `FieldContext` | `{ id: string; describedBy: string \| undefined; invalid: boolean }` |

It is a **getter**, not a plain object, so the values stay reactive as `error` toggles. Outside
a `Field` it returns `undefined`.

### Secrets

`src/lib/utils/secret.ts`:

| Export | Signature | Notes |
|---|---|---|
| `REDACTED` | `'••••••••'` | A **wire contract** — several suite APIs send it as a field's value and read it back unchanged as "keep the stored secret" |
| `isRedacted` | `(value: string) => boolean` | True for a trimmed run of dots |
| `maskSecret` | `(value: string, mode?: 'ends' \| 'full') => string` | Fixed-length mask; never leaks the real length. `ends` keeps four characters either side, but only when the value is longer than 12 |

### Identity colours

`src/lib/colors.ts` — the palette shared with Sablier. Persisted user data, so the six hexes
are a contract, not a style choice.

| Export | Signature / Value |
|---|---|
| `USER_COLORS` | `['#AD9EF0', '#F09ED6', '#EE7E89', '#EEB47E', '#A9EE7E', '#7EEEDB']` |
| `USER_COLOR_LABELS` | `Record<UserColor, string>` — Purple, Pink, Red, Orange, Green, Aqua |
| `normalizeUserColor` | `(color?: string \| null) => UserColor` — trims, uppercases, adds a missing `#`, falls back to the first colour |
| `userColorLabel` | `(color?: string \| null) => string` — normalizes first, so unknown values still resolve |
| `UserColor` | `(typeof USER_COLORS)[number]` |

### Chart maths

`src/lib/utils/chart.ts`. The charts use these; they are exported so a custom plot can be
built on the same geometry instead of a second, divergent copy.

| Export | Signature | Notes |
|---|---|---|
| `chartColor` | `(index: number) => string` | `var(--color-fc-chart-N)`, wrapping over six slots. Handles negative and non-finite input |
| `formatCompact` | `(n: number) => string` | Short axis and tooltip numbers; `—` for non-finite |
| `niceScale` | `(min, max, tickCount?, includeZero?) => ChartScale` | Domain snapped to 1/2/5×10ⁿ steps with its tick list. `tickCount` defaults to `4`, `includeZero` to `false` — bar charts must pass `true` |
| `linePath` | `(points: [number, number][], smooth?) => string` | SVG `d` for a polyline or a smoothed curve |
| `areaPath` | `(points: [number, number][], baselineY: number, smooth?) => string` | The same path closed down to a baseline |
| `arcPath` | `(cx, cy, rOuter, rInner, startAngle, endAngle) => string` | Donut wedge; `rInner <= 0` gives a pie slice. Angles in radians, clockwise from 12 o'clock |
| `tickStride` | `(count, available, minSpacing) => number` | How many labels to skip so they stop colliding |
| `resize` | `(node: HTMLElement, cb: (w: number) => void) => { destroy(): void }` | Svelte action; reports the node's width through a `ResizeObserver` |

Exported types: `ChartSeries` `{ name, data, color? }`, `ChartSlice` `{ label, value, color? }`,
`ChartScale` `{ min, max, ticks }`, `ChartLegendItem` `{ name, color, value? }`,
`ChartTipRow` `{ name, value, color? }`, `ChartRow` `{ label, cells }`.

### Class merge

| Export | Signature | Notes |
|---|---|---|
| `twMerge` | `(...classes) => string` | `extendTailwindMerge` taught the `fc-*` font sizes, colours, radii and font families |
| `cn` | alias of `twMerge` | |

Use it for any consumer markup mixing `fc-*` utilities. Stock `tailwind-merge` classifies
`text-fc-sm` as a *colour* and silently deletes `text-fc-fg` from the same string.
