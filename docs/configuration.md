# muse — Configuration

muse reads no environment variable. Everything configurable is a CSS custom property in
`src/lib/styles/tokens.css`, so this page is the token reference plus the pattern suite apps
use to override it.

## Peer requirements

| Package | Range | Why |
|---|---|---|
| `svelte` | `^5.0.0` | Peer dependency. Components use runes (`$props`, `$state`, `$bindable`, `$derived`, `$effect`, `$props.id()`) and snippets |
| `tailwindcss` | `^4.0.0` | Peer dependency. The `@theme` block is Tailwind v4 syntax |
| `gsap` | `^3.13.0` | Direct dependency. `WordReveal` imports `gsap/SplitText`, which only entered the public package in 3.13 — on 3.12 the import does not resolve |
| `tailwind-merge` | `^3.5.0` | Direct dependency. Extended in `src/lib/utils/cn.ts` to understand the `fc-*` scales; every component merges its `class` prop through that |

`iconify-icon` is **not** a dependency and is not registered by muse. Thirteen components
render `<iconify-icon>` elements that stay inert until the consumer registers the custom
element.

## Export map

| Specifier | Resolves to |
|---|---|
| `@facile/muse` | `src/lib/index.ts` — components, `cn`, helpers, `icons`, `USER_COLORS`, the chart maths, the exported types |
| `@facile/muse/styles` | `src/lib/styles/tokens.css` — theme, fonts, dark mode, base layer |

`package.json` sets both `"svelte"` and `"main"` to the TypeScript entry, and `"files"` ships
only `src/lib`, `CHARTE.md` and `README.md`. There is no compiled output; the consumer's
bundler compiles the source.

## Color tokens

Declared in `@theme`, so Tailwind emits `bg-fc-*`, `text-fc-*` and `border-fc-*` for each.
Chroma-zero OKLCH throughout except the semantic and chart tokens. Every value swaps under
`@media (prefers-color-scheme: dark)` **and** under an explicit `:root.dark`.

| Token | Light | Dark | Used by |
|---|---|---|---|
| `--color-fc-page` | `oklch(1 0 0)` | `oklch(0.09 0 0)` | the document canvas — set on `body` by the base layer, used by no component |
| `--color-fc-bg` | `oklch(1 0 0)` | `oklch(0.09 0 0)` | `Input`, `Select`, `Textarea`, `SecretField`, `Dropzone`, `OptionCards`, `UploadProgress`, plus the `Topbar` and `MobileNav` glass |
| `--color-fc-surface` | `oklch(0.97 0 0)` | `oklch(0.18 0 0)` | every hover state, `Badge` neutral, `Alert` neutral, `Skeleton`, `Switch` track, `Table` headers, `SpaceSwitcher` trigger, `BarChart` hover band |
| `--color-fc-component` | `oklch(0.985 0 0)` | `oklch(0.13 0 0)` | container surfaces — `Card` (and therefore `StatCard`, `SettingsSection`, `ProfileCard`), `Table`, `SideBar`, `Modal`, `Drawer` panel, `SpaceSwitcher` dropdown, `ChartTooltip` |
| `--color-fc-fg` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | primary text |
| `--color-fc-fg-muted` | `oklch(0.556 0 0)` | `oklch(0.6 0 0)` | placeholders, labels, inactive nav rows, `StatusDot` neutral |
| `--color-fc-accent` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `Button` primary, active nav, `Avatar`, `Switch` on-state, the `Tabs` pill — **equals `fg`, so accent surfaces are inverted, not tinted** |
| `--color-fc-accent-fg` | `oklch(1 0 0)` | `oklch(0.09 0 0)` | text on accent |
| `--color-fc-border` | `oklch(0.9 0 0)` | `oklch(1 0 0 / 10%)` | every border in the library |
| `--color-fc-ring` | `oklch(0.4 0 0)` | `oklch(0.6 0 0)` | the single `focus-visible` outline |
| `--color-fc-danger` | `oklch(0.55 0.22 29)` | `oklch(0.65 0.22 29)` | `Button` danger and ghost-danger, `Alert`/`Badge`/`StatusDot` danger, `Field` error text, `ConfirmModal` danger badge |
| `--color-fc-danger-fg` | `oklch(1 0 0)` | `oklch(1 0 0)` | text on a solid danger fill. **Published but unused** — the library has no solid danger fill; it is here for consumers that need one |
| `--color-fc-success` | `oklch(0.52 0.12 150)` | `oklch(0.72 0.14 150)` | `Alert`/`Badge`/`StatusDot` success, `SecretField` copy confirmation, `UploadProgress` done rows |
| `--color-fc-info` | `oklch(0.52 0.14 255)` | `oklch(0.72 0.13 255)` | `Alert`/`Badge`/`StatusDot` info |
| `--color-fc-warning` | `oklch(0.55 0.13 75)` | `oklch(0.8 0.13 75)` | `Alert`/`Badge`/`StatusDot` warning |
| `--color-fc-owner` | `oklch(0.55 0.13 64)` | `oklch(0.78 0.13 64)` | `Badge`/`StatusDot` `tone="owner"` role pill |
| `--color-fc-admin` | `oklch(0.5 0.16 292)` | `oklch(0.75 0.14 292)` | `Badge`/`StatusDot` `tone="admin"` role pill |
| `--color-fc-scrim` | `oklch(0 0 0 / 50%)` | same | Published for overlay backdrops. **`Modal` and `Drawer` currently hardcode `backdrop:bg-black/50` instead** — the token is the intended home for that value |

`--color-fc-warning` and `--color-fc-owner` sit at lightness `0.55`, not `0.58`, and that is
not taste: they are read as `text-fc-warning` on `bg-fc-warning/10`, the lowest-contrast use
any semantic token gets. At `0.58` both landed at 4.0–4.1:1 and missed AA. `0.55` clears
4.5:1 on the page, on `fc-component`, and on their own 10% tint.

`info` exists because without it `Alert tone="info"` and `StatusDot tone="info"` had to borrow
`fc-accent` and rendered identically to `tone="accent"` — a tone indistinguishable from another
tone is not a tone.

### Chart series

Declared in a separate `@theme static` block. Sablier's identity palette, deepened so each
stays legible as a chart mark. Assign **by series index in fixed order, never by rank**;
`fc-danger` and `fc-success` are reserved for status and are never series colours.

| Token | Light | Dark | Hue |
|---|---|---|---|
| `--color-fc-chart-1` | `oklch(0.7 0.15 292)` | `oklch(0.58 0.15 292)` | purple |
| `--color-fc-chart-2` | `oklch(0.755 0.13 64)` | `oklch(0.66 0.14 64)` | orange |
| `--color-fc-chart-3` | `oklch(0.72 0.11 190)` | `oklch(0.6 0.12 195)` | aqua |
| `--color-fc-chart-4` | `oklch(0.68 0.15 15)` | `oklch(0.55 0.16 15)` | red |
| `--color-fc-chart-5` | `oklch(0.76 0.16 135)` | `oklch(0.64 0.15 135)` | green |
| `--color-fc-chart-6` | `oklch(0.73 0.14 339)` | `oklch(0.62 0.14 339)` | pink |

`static` is load-bearing. `chartColor()` builds the variable name with a template literal
(`--color-fc-chart-${n}`), so the strings `fc-chart-3`…`fc-chart-6` appear in no source file.
A plain `@theme` block emits only the variables Tailwind saw used, which left the higher slots
undefined — and an undefined `var()` in an SVG `fill` falls back to black.

### Forcing a colour scheme

Dark mode follows the OS by default — nothing to wire up. To let a user override it, put a
`dark` or `light` class on `<html>`; both beat the media query:

```ts
document.documentElement.classList.toggle('dark', theme === 'dark');
document.documentElement.classList.toggle('light', theme === 'light');
```

Write **both** classes and let `system` write neither. The media-query block is scoped
`:root:not(.light)`, so the `.light` class is the only thing that lets someone force light on
a dark OS — a script that only ever adds `.dark` strands those users.

The demo implements exactly this: `demo/src/theme.svelte.ts` holds the `system | light | dark`
state and persists it to `localStorage`, `demo/src/App.svelte` applies it on mount, and the
control itself lives in `demo/src/pages/settings/Appearance.svelte` — in Settings, like every
other preference, not floating over every page.

Semantic fills are **tinted, not solid** — `Badge`, `Alert` and the danger `Button` use
`bg-<token>/10` with `text-<token>`, matching the suite's `bg-destructive/10`. Reserve solid
fills for the inverted accent.

## Radius, type, font, motion, width tokens

| Token | Value | Utility |
|---|---|---|
| `--radius-fc-xs` | `4px` | `rounded-fc-xs` |
| `--radius-fc-sm` | `6px` | `rounded-fc-sm` |
| `--radius-fc-md` | `8px` | `rounded-fc-md` — the default on most components |
| `--radius-fc-lg` | `12px` | `rounded-fc-lg` — `Modal`, `Drawer`, `SideBar` |
| `--radius-fc-pill` / `--radius-fc-full` | `999px` | `rounded-fc-pill` — `Button`, `Badge`, `Avatar`, `Tabs` pill, `MobileNav`. Two names for one value so "a pill-shaped button" and "a circular avatar" read differently at the call site |
| `--text-fc-xs` … `--text-fc-3xl` | `12` / `14` / `16` / `18` / `22` / `28` / `36px` | `text-fc-xs` … `text-fc-3xl` |
| `--text-fc-*--line-height` | `16` / `20` / `24` / `28` / `28` / `34` / `40px` | applied automatically by the size utility |
| `--font-fc-body` | `'Goga', Helvetica, Arial, sans-serif` | `font-fc-body` |
| `--font-fc-title` | identical to `--font-fc-body` | `font-fc-title` |
| `--font-sans` | identical to `--font-fc-body` | `font-sans` |
| `--font-fc-mono` | `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace` | `font-fc-mono` — machine strings only: secrets, keys, IDs, endpoints. Goga has no mono cut, so this is the platform stack |
| `--ease-fc` | `cubic-bezier(0.77, 0, 0.175, 1)` | `ease-fc` — the CSS spelling of GSAP's `power3.inOut`, so a consumer's CSS transition lands on the same curve as a muse animation beside it |
| `--container-fc-sm` … `--container-fc-xl` | `600` / `720` / `960` / `1200px` | `max-w-fc-sm` … `max-w-fc-xl` |
| `--width-fc-nav-collapsed` | `68px` | `w-fc-nav-collapsed` — `SideBar` reads this off `getComputedStyle` for its width tween |
| `--width-fc-nav-expanded` | `220px` | `w-fc-nav-expanded` — same |
| `--spacing-fc-nav-item` | `44px` | `size-fc-nav-item` — the collapsed nav square. 68px rail = 44 + 12 padding either side, and 44px is exactly the expanded row height |
| `--spacing-fc-nav-content` | `196px` | `w-fc-nav-content` — expanded nav content width (220 − 12 either side), so the collapse tween clips children instead of reflowing them |

There are **no `--fc-space-*` tokens**. Spacing is Tailwind's stock scale; the two
`--spacing-fc-nav-*` entries above are fixed nav geometry, not a scale.

`--text-fc-sm` (14px) is the UI default — nav rows, buttons and table cells all sit there,
matching the suite's `text-sm`. Each size ships a paired `--line-height`, so `text-fc-sm`
sets both properties in one utility.

## Stacking order

Not tokens — Tailwind's own `z-*` utilities carry the numbers — but `tokens.css` documents the
contract, because "pick one and hope" is how a dropdown ends up tied with the mobile nav bar
and resolved by DOM order.

| Rung | What lives there |
|---|---|
| `z-0` | in-flow content, and anything establishing a local context (`Tabs`, `Mosaique`) |
| `z-10` | chart overlays that must clear their own svg (`ChartTooltip`) |
| `z-30` | sticky page chrome (`Topbar`) |
| `z-40` | surfaces floating out of a trigger (`SpaceSwitcher`'s dropdown) |
| `z-50` | viewport-fixed chrome (`MobileNav`) |
| `z-[100]` | full-page curtain (`Rideau`) |

`Modal`, `ConfirmModal` and `Drawer` are absent by design: `<dialog>.showModal()` promotes them
to the browser's top layer, above every z-index there is.

## Base layer

`tokens.css` emits an `@layer base` block that does four things beyond utilities:

- `html` gets the Goga stack, `letter-spacing: -0.011em` and antialiasing; `h1`–`h6` get
  `--font-fc-title` with `-0.02em` tracking; `body` gets `--color-fc-page` / `--color-fc-fg`.
  Importing the styles therefore sets a consumer's base typography **and page colours**.
- Scrollbars are hidden globally (`scrollbar-width: none`, `-ms-overflow-style`,
  `::-webkit-scrollbar { display: none }`). A classic scrollbar takes layout width, so it
  shifts the whole page sideways the moment content grows past one screen — and back again
  when a modal locks the body. Scrolling itself is untouched. Do not re-enable them; if
  content is unreachable, the container is the bug.
- `@media (prefers-reduced-motion: reduce)` collapses every animation and transition —
  including consumer-authored ones and the CSS-only ones the JS guards never see — to
  `0.01ms`, plus `scroll-behavior: auto`. Durations are collapsed rather than set to `none` so
  `transitionend` / `animationend` still fire and nothing waiting on them hangs.
- `@custom-variant dark` is registered, so Tailwind's `dark:` utilities follow the class.

## Fonts

Two `@font-face` rules, both Goga: Medium at weight `500` and Semibold at weight `600`, both
`font-display: swap`. Any other weight synthesizes — prefer `font-semibold` over `font-bold`.
The shipped files are labeled "GogaTest" (test license).

## Icons

`icons` is a `const` map from a stable key to an Iconify name, exported alongside the
`IconKey` type. 47 keys. UI chrome is Solar **`linear`**; plus, close and the chevrons are
**MDI**, because Solar's versions of those read muddy at 16px.

| Key | Icon | Key | Icon |
|---|---|---|---|
| `home` | `solar:home-2-linear` | `settings` | `solar:settings-linear` |
| `dashboard` | `solar:chart-2-linear` | `edit` | `solar:pen-new-square-linear` |
| `folder` | `solar:folder-linear` | `remove` | `solar:trash-bin-2-linear` |
| `search` | `solar:magnifer-linear` | `calendar` | `solar:calendar-linear` |
| `collapse` | `solar:sidebar-minimalistic-linear` | `notification` | `solar:bell-linear` |
| `usersGroup` | `solar:users-group-rounded-linear` | `userCircle` | `solar:user-circle-linear` |
| `logout` | `solar:logout-2-linear` | `warning` | `solar:danger-triangle-linear` |
| `info` | `solar:info-circle-linear` | `upload` | `solar:cloud-upload-linear` |
| `clock` | `solar:clock-circle-linear` | `refresh` | `solar:refresh-linear` |
| `eye` | `solar:eye-linear` | `eyeClosed` | `solar:eye-closed-linear` |
| `copy` | `solar:copy-linear` | `check` | `solar:check-circle-linear` |
| `key` | `solar:key-linear` | `revoke` | `solar:forbidden-circle-linear` |
| `shield` | `solar:shield-check-linear` | `palette` | `solar:pallete-2-linear` |
| `sun` | `solar:sun-linear` | `moon` | `solar:moon-linear` |
| `monitor` | `solar:monitor-linear` | `globe` | `solar:global-linear` |
| `plug` | `solar:plug-circle-linear` | `bolt` | `solar:bolt-linear` |
| `server` | `solar:server-linear` | `code` | `solar:code-linear` |
| `history` | `solar:history-linear` | `card` | `solar:card-linear` |
| `download` | `solar:download-linear` | `filter` | `solar:filter-linear` |
| `mail` | `solar:letter-linear` | `error` | `solar:close-circle-linear` |
| `plus` | `mdi:plus` | `close` | `mdi:close` |
| `arrow` | `mdi:chevron-right` | `chevronDown` | `mdi:chevron-down` |
| `chevronUp` | `mdi:chevron-up` | `chevronLeft` | `mdi:chevron-left` |

`bold-duotone` appears nowhere in this map by design — it is reserved for an app's own brand
mark, which the consumer passes to `SideBar`'s `icon` prop.

The map holds names only. Rendering goes through the `<iconify-icon>` custom element, which
muse neither imports nor declares as a dependency — the consumer app must register it, or the
tags stay inert. `Button`, `NavButton`, `Tabs`, `OptionCards`, `Dropzone`, `UploadProgress`,
`SecretField`, `SpaceSwitcher`, `SideBar`, `MobileNav`, `Modal`, `Drawer` and `ConfirmModal`
render `<iconify-icon>` directly, so this affects them.

## Overriding tokens

Every token is a plain custom property, so redeclaring it at `:root` after the import wins.
This is how the suite reconciles muse with its own palette rather than forking the library.

```css
@import 'tailwindcss';
@source '../node_modules/@facile/muse/src';

:root {
  --color-fc-page: var(--background);
  --color-fc-bg: var(--background);
  --color-fc-surface: var(--muted);
  --color-fc-component: var(--card);
  --color-fc-fg: var(--foreground);
  --color-fc-fg-muted: var(--muted-foreground);
  --color-fc-accent: var(--primary);
  --color-fc-accent-fg: var(--primary-foreground);
  --color-fc-border: var(--border);
  --color-fc-ring: var(--ring);
  --color-fc-danger: var(--destructive);
  --color-fc-danger-fg: var(--destructive-foreground);
  --color-fc-success: var(--foreground);

  --radius-fc-xs: calc(var(--radius) * 0.5);
  --radius-fc-sm: calc(var(--radius) * 0.75);
  --radius-fc-md: var(--radius);
  --radius-fc-lg: calc(var(--radius) * 1.5);
  --radius-fc-pill: 999px;
  --radius-fc-full: 999px;
}
```

That block is adapted from `Casier/apps/client/src/app.css`, the one app in the suite that
currently depends on `@facile/muse`. Two overrides it used to need are now obsolete: the type
scale no longer needs flattening (muse's `text-fc-sm` is already `0.875rem`), and
`--color-yellow-500` no longer needs neutralising (`Alert`'s warning tone reads
`--color-fc-warning`; **no colour in the library escapes the `fc-*` namespace**).

Aliasing is only *needed* when an app wants muse primitives to track its own local tokens —
Casier's case, so hand-written `bg-background` markup and muse components stay in lockstep.
The published defaults already match the shipped suite look: chroma-zero OKLCH on a
`0.145 / 0.985` inverted accent, `--radius-fc-md: 8px` (the suite's `--radius: 0.5rem`), a
12–36px scale anchored on 14px, Goga, and Solar `linear` icons. `--destructive`'s suite value
is `--color-fc-danger` verbatim.

Forking the library is still not the supported route.

`tokens.css` remains the only source of truth for what actually renders — if this page,
`CHARTE.md` and the CSS ever disagree, trust the CSS and fix the prose.
