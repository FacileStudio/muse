# muse — Configuration

muse reads no environment variable. Everything configurable is a CSS custom property in
`src/lib/styles/tokens.css`, so this page is the token reference plus the pattern suite apps
use to override it.

## Peer requirements

| Package | Range | Why |
|---|---|---|
| `svelte` | `^5.0.0` | Peer dependency. Components use runes (`$props`, `$state`, `$bindable`, `$derived`, `$effect`) and snippets |
| `tailwindcss` | `^4.0.0` | Peer dependency. The `@theme` block is Tailwind v4 syntax |
| `gsap` | `^3.12.0` | Direct dependency. `WordReveal` needs `SplitText`, free only from 3.13 |
| `tailwind-merge` | `^3.5.0` | Direct dependency. Extended in `src/lib/utils/cn.ts` to understand the `fc-*` scales; every component merges its `class` prop through that |

## Export map

| Specifier | Resolves to |
|---|---|
| `@facile/lib` | `src/lib/index.ts` — components, `cn`, helpers, `icons`, `IconKey` |
| `@facile/lib/styles` | `src/lib/styles/tokens.css` — theme, fonts, dark mode |

`package.json` sets both `"svelte"` and `"main"` to the TypeScript entry. There is no
compiled output; the consumer's bundler compiles the source.

## Color tokens

Declared in `@theme`, so Tailwind emits `bg-fc-*` and `text-fc-*` for each.

Chroma-zero OKLCH throughout, matching the shipped suite apps. Every value swaps under
`@media (prefers-color-scheme: dark)`.

| Token | Light | Dark | Used by |
|---|---|---|---|
| `--color-fc-page` | `oklch(1 0 0)` | `oklch(0.09 0 0)` | page background, set on `body` by the base layer |
| `--color-fc-bg` | `oklch(1 0 0)` | `oklch(0.09 0 0)` | `Input`, `Textarea`, `Select`, `Modal`, `Topbar`, `MobileNav` glass |
| `--color-fc-surface` | `oklch(0.97 0 0)` | `oklch(0.18 0 0)` | `Card`, `StatCard`, `Skeleton`, `Switch` track, `Table` headers, hover states |
| `--color-fc-component` | `oklch(0.985 0 0)` | `oklch(0.13 0 0)` | `Component`, `SideBar`, `SpaceSwitcher` dropdown |
| `--color-fc-fg` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | primary text |
| `--color-fc-fg-muted` | `oklch(0.556 0 0)` | `oklch(0.6 0 0)` | placeholders, labels, inactive nav rows |
| `--color-fc-accent` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `Button` primary, active nav, `Avatar`, `Switch` on-state — **equals `fg`, so accent surfaces are inverted, not tinted** |
| `--color-fc-accent-fg` | `oklch(1 0 0)` | `oklch(0.09 0 0)` | text on accent |
| `--color-fc-border` | `oklch(0.9 0 0)` | `oklch(1 0 0 / 10%)` | every border in the library |
| `--color-fc-ring` | `oklch(0.4 0 0)` | `oklch(0.6 0 0)` | `:focus-visible` outlines |
| `--color-fc-danger` | `oklch(0.55 0.22 29)` | `oklch(0.65 0.22 29)` | `Button` danger, `Alert` danger, `Field` error text |
| `--color-fc-danger-fg` | `oklch(1 0 0)` | `oklch(1 0 0)` | text on a solid danger fill |
| `--color-fc-success` | `oklch(0.52 0.12 150)` | `oklch(0.72 0.14 150)` | `Badge` / `Alert` success tones |
| `--color-fc-warning` | `oklch(0.58 0.13 75)` | `oklch(0.8 0.13 75)` | `Alert` warning tone |
| `--color-fc-owner` | `oklch(0.55 0.13 75)` | `oklch(0.78 0.13 75)` | `Badge tone="owner"` role pill |
| `--color-fc-admin` | `oklch(0.52 0.14 255)` | `oklch(0.72 0.13 255)` | `Badge tone="admin"` role pill |

### Forcing a colour scheme

Dark mode follows the OS by default — nothing to wire up. To let a user override it, put a
`dark` or `light` class on `<html>`; both beat the media query:

```ts
document.documentElement.classList.toggle('dark', theme === 'dark');
document.documentElement.classList.toggle('light', theme === 'light');
```

The media-query block is scoped `:root:not(.light)`, which is what allows an explicit
`.light` to win while the OS is in dark mode — the case a plain `@media` rule cannot handle.
`@custom-variant dark` is registered too, so Tailwind's `dark:` utilities follow the class.
`demo/src/App.svelte` has a working toggle with `localStorage` persistence.

`--color-fc-danger`, `--color-fc-success`, `--color-fc-warning`, `--color-fc-owner` and
`--color-fc-admin` are the only tokens carrying chroma; everything else is pure greyscale. Semantic fills are **tinted,
not solid** — `Badge` and the danger `Button` use `bg-<token>/10` with `text-<token>`, which
is what the suite apps do (`bg-destructive/10 text-destructive`). Reserve solid fills for the
inverted accent.

## Radius, type, font, motion, width tokens

| Token | Value | Utility |
|---|---|---|
| `--radius-fc-xs` | `4px` | `rounded-fc-xs` |
| `--radius-fc-sm` | `6px` | `rounded-fc-sm` |
| `--radius-fc-md` | `8px` | `rounded-fc-md` — the default on most components |
| `--radius-fc-lg` | `12px` | `rounded-fc-lg` — `Modal`, `SideBar` |
| `--radius-fc-pill` / `--radius-fc-full` | `999px` | `rounded-fc-pill` — `Button`, `Badge`, `Avatar`, `MobileNav` |
| `--text-fc-xs` … `--text-fc-3xl` | `12` / `14` / `16` / `18` / `22` / `28` / `36px` | `text-fc-xs` … `text-fc-3xl` |
| `--text-fc-*--line-height` | `16` / `20` / `24` / `28` / `28` / `34` / `40px` | applied automatically by the size utility |
| `--font-fc-body` | `'Goga', Helvetica, Arial, sans-serif` | `font-fc-body` |
| `--font-fc-title` | identical to `--font-fc-body` | `font-fc-title` |
| `--font-sans` | identical to `--font-fc-body` | `font-sans` |
| `--ease-fc` | `cubic-bezier(0.65, 0, 0.35, 1)` | `ease-fc` |
| `--container-fc-sm` … `--container-fc-xl` | `600` / `720` / `960` / `1200px` | `max-w-fc-sm` … `max-w-fc-xl` |
| `--width-fc-nav-collapsed` | `77px` | `w-fc-nav-collapsed` |
| `--width-fc-nav-expanded` | `220px` | `w-fc-nav-expanded` |

`--text-fc-sm` (14px) is the UI default — nav rows, buttons and table cells all sit there,
matching the suite's `text-sm`. Each size ships a paired `--line-height`, so `text-fc-sm`
sets both properties in one utility.

`tokens.css` also emits an `@layer base` block: `html` gets the Goga stack,
`letter-spacing: -0.011em` and antialiasing; `body` gets `--color-fc-page` /
`--color-fc-fg`; and `h1`–`h6` get `--font-fc-title` with `-0.02em` tracking. Importing the
styles therefore sets a consumer's base typography **and page colours**, not only its
utility classes. Title and body fonts resolve to the same family today — the split exists so
a consumer can diverge without touching components.

## Fonts

Two `@font-face` rules, both Goga: Medium at weight `500` and Semibold at weight `600`.
Any other weight synthesizes. Helvetica Neue was dropped from the library.

## Icons

`icons` is a `const` map from a stable key to an Iconify name, exported alongside the
`IconKey` type. UI chrome is Solar **`linear`**; plus, close and the chevrons are **MDI**,
because Solar's versions of those four read muddy at 16px.

| Key | Icon | Key | Icon |
|---|---|---|---|
| `home` | `solar:home-2-linear` | `settings` | `solar:settings-linear` |
| `dashboard` | `solar:chart-2-linear` | `edit` | `solar:pen-new-square-linear` |
| `folder` | `solar:folder-linear` | `remove` | `solar:trash-bin-2-linear` |
| `search` | `solar:magnifer-linear` | `calendar` | `solar:calendar-linear` |
| `collapse` | `solar:sidebar-minimalistic-linear` | `notification` | `solar:bell-linear` |
| `usersGroup` | `solar:users-group-rounded-linear` | `userCircle` | `solar:user-circle-linear` |
| `logout` | `solar:logout-2-linear` | | |
| `plus` | `mdi:plus` | `close` | `mdi:close` |
| `arrow` | `mdi:chevron-right` | `chevronDown` | `mdi:chevron-down` |
| `chevronUp` | `mdi:chevron-up` | `chevronLeft` | `mdi:chevron-left` |

`bold-duotone` appears nowhere in this map by design — it is reserved for an app's own brand
mark, which the consumer passes to `SideBar`'s `icon` prop.

The map holds names only. Rendering goes through the `<iconify-icon>` custom element, which
muse neither imports nor declares as a dependency — the consumer app must register it, or
the tags stay inert. `NavButton`, `SideBar`, `SpaceSwitcher`, `MobileNav` and `Mosaique`
render `<iconify-icon>` directly, so this affects them.

## Overriding tokens

Every token is a plain custom property, so redeclaring it at `:root` after the import wins.
This is how the suite reconciles muse with its own palette rather than forking the library.

```css
@import 'tailwindcss';
@source '../node_modules/@facile/lib/src';

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

The type scale no longer needs flattening — muse's own `text-fc-sm` is already `0.875rem`,
so the old three-line `--text-fc-*: 0.875rem` override in Casier's `app.css` is now a no-op
and can be dropped.

That block is adapted from `Casier/apps/client/src/app.css`, the one app in the suite that
currently depends on `@facile/lib`. Casier also used to set `--color-yellow-500` to a
neutral, because `Alert`'s `warning` tone hardcoded `yellow-500`. That is fixed — the tone
now reads `--color-fc-warning`, and **no colour in the library escapes the `fc-*` namespace**,
so that override can be dropped.

## Published defaults now match the suite

This used to be the section warning you that muse's palette matched nothing that shipped.
**As of 2026-08-06 that is fixed.** The defaults were retuned to the live suite look:
chroma-zero OKLCH on a `0.145 / 0.985` inverted accent, `--radius-fc-md: 8px` (the suite's
`--radius: 0.5rem`), a 12–36px type scale anchored on 14px, Goga, and Solar `linear` icons.
`--destructive`'s suite value, `oklch(0.55 0.22 29)` light / `oklch(0.65 0.22 29)` dark,
is `--color-fc-danger` verbatim.

So the override block above is no longer *required* to make muse look like the suite — it is
now only needed when an app wants muse primitives to track its own local tokens (Casier's
case, so hand-written `bg-background` markup and muse components stay in lockstep). Aliasing
remains the supported way to do that; forking the library is still not.

`CHARTE.md` and this page are both current as of the retheme. `tokens.css` remains the only
source of truth for what actually renders — if the three ever disagree again, trust the CSS
and fix the prose.
