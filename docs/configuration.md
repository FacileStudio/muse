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
| `tailwind-merge` | `^3.5.0` | Direct dependency. Every component merges its `class` prop with `twMerge` |

## Export map

| Specifier | Resolves to |
|---|---|
| `@facile/lib` | `src/lib/index.ts` — components, helpers, `icons`, `IconKey` |
| `@facile/lib/styles` | `src/lib/styles/tokens.css` — theme, fonts, dark mode |

`package.json` sets both `"svelte"` and `"main"` to the TypeScript entry. There is no
compiled output; the consumer's bundler compiles the source.

## Color tokens

Declared in `@theme`, so Tailwind emits `bg-fc-*` and `text-fc-*` for each.

| Token | Light | Dark | Used by |
|---|---|---|---|
| `--color-fc-page` | `#fcfcfc` | `#1e1e1e` | page background; no component consumes it directly |
| `--color-fc-bg` | `#fcfcfc` | `#242424` | `Input`, `Textarea`, `Select`, `Modal`, `Topbar`, `Rideau` default |
| `--color-fc-surface` | `rgba(0, 0, 0, 0.04)` | `rgba(255, 255, 255, 0.06)` | `Card`, `StatCard`, `Badge`, `Avatar`, `Skeleton`, `Switch` track, `Table` headers, `Alert` info |
| `--color-fc-component` | `rgba(255, 255, 255, 0.67)` | `rgba(255, 255, 255, 0.05)` | `Component`, `SideBar` |
| `--color-fc-fg` | `rgba(36, 36, 36, 1)` | `#f4f4f5` | text, and every border via `/7` and `/10` alpha |
| `--color-fc-fg-muted` | `rgba(36, 36, 36, 0.5)` | `rgba(244, 244, 245, 0.5)` | placeholders, labels, `StatCard` delta |
| `--color-fc-accent` | `#6366f1` | unchanged | `Button` primary, focus rings, `Switch` on-state, `Spinner` arc, `Carousel` dots |
| `--color-fc-accent-fg` | `#ffffff` | unchanged | text on accent |
| `--color-fc-danger` | `#dc2626` | unchanged | `Button` danger, `Alert` danger, `Field` error text |
| `--color-fc-success` | `#16a34a` | unchanged | `Badge` and `Alert` success tones |

`--color-fc-accent`, `--color-fc-accent-fg`, `--color-fc-danger` and `--color-fc-success`
hold the same value in both themes. There is deliberately **no** `--color-fc-border`;
borders are alpha over `--color-fc-fg`.

## Radius, type, font, motion, width tokens

| Token | Value | Utility |
|---|---|---|
| `--radius-fc-xs` | `4px` | `rounded-fc-xs` |
| `--radius-fc-sm` | `8px` | `rounded-fc-sm` |
| `--radius-fc-md` | `24px` | `rounded-fc-md` — the default on nearly every component |
| `--radius-fc-pill` | `999px` | `rounded-fc-pill` |
| `--radius-fc-full` | `999px` | `rounded-fc-full` |
| `--text-fc-xs` … `--text-fc-3xl` | `8` / `10` / `12` / `14` / `20` / `24` / `32px` | `text-fc-xs` … `text-fc-3xl` |
| `--font-fc-body` | `'Goga', Helvetica, Arial, sans-serif` | `font-fc-body` |
| `--font-fc-title` | identical to `--font-fc-body` | `font-fc-title` |
| `--font-sans` | identical to `--font-fc-body` | `font-sans` |
| `--ease-fc` | `cubic-bezier(0.65, 0, 0.35, 1)` | `ease-fc` |
| `--container-fc-sm` … `--container-fc-xl` | `600` / `720` / `960` / `1200px` | `max-w-fc-sm` … `max-w-fc-xl` |
| `--width-fc-nav-collapsed` | `77px` | `w-fc-nav-collapsed` |
| `--width-fc-nav-expanded` | `220px` | `w-fc-nav-expanded` |

Two things to know about that table. The type scale is small in absolute terms — `text-fc-xs`
is `8px` and `Button` labels use it, so button text renders at 8px unless you override
`class`. And there is no `--radius-fc-lg`: `Modal` still asks for `rounded-fc-lg`, which
Tailwind cannot generate, so the dialog falls back to square corners. Both are properties of
the current source, not recommendations.

`tokens.css` also sets rules outside `@theme`: `:root` and `body` get the Goga stack and
`letter-spacing: -0.02%`. Importing the styles therefore changes a consumer's base
typography, not only its utility classes. Title and body fonts are the same family — the
display/body split described in `CHARTE.md` is not in the shipped tokens.

## Fonts

Two `@font-face` rules, both Goga: Medium at weight `500` and Semibold at weight `600`.
Any other weight synthesizes. Helvetica Neue was dropped from the library.

## Icons

`icons` is a `const` map from a stable key to a Solar Iconify name, exported alongside the
`IconKey` type:

| Key | Icon | Key | Icon |
|---|---|---|---|
| `home` | `solar:home-2-bold-duotone` | `settings` | `solar:settings-bold-duotone` |
| `dashboard` | `solar:qr-code-bold-duotone` | `edit` | `solar:pen-new-square-bold-duotone` |
| `folder` | `solar:folder-open-bold-duotone` | `remove` | `solar:trash-bin-2-bold-duotone` |
| `search` | `solar:magnifer-bold-duotone` | `calendar` | `solar:calendar-add-line-bold-duotone` |
| `collapse` | `solar:layers-bold-duotone` | `notification` | `solar:bell-bold-duotone` |
| `plus` | `solar:add-circle-bold-duotone` | `arrow` | `solar:alt-arrow-right-bold-duotone` |
| `close` | `solar:close-circle-bold-duotone` | | |

The map holds names only. Rendering goes through the `<iconify-icon>` custom element, which
muse neither imports nor declares as a dependency — the consumer app must register it, or
the tags stay inert. `NavButton` and `SideBar` render `<iconify-icon>` directly, so this
affects them.

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
  --color-fc-danger: var(--destructive);
  --color-fc-success: var(--foreground);

  --radius-fc-xs: calc(var(--radius) * 0.5);
  --radius-fc-sm: calc(var(--radius) * 0.75);
  --radius-fc-md: var(--radius);
  --radius-fc-pill: 999px;
  --radius-fc-full: 999px;

  --text-fc-xs: 0.875rem;
  --text-fc-sm: 0.875rem;
  --text-fc-md: 0.875rem;
}
```

That block is adapted from `Casier/apps/client/src/app.css`, the one app in the suite that
currently depends on `@facile/lib`. Casier also sets `--color-yellow-500` to a neutral,
because `Alert`'s `warning` tone hardcodes `yellow-500` instead of reading a token — the only
place in the library that escapes the `fc-*` namespace.

## Published defaults versus the suite's actual look

Worth stating plainly, because it surprises people: **the token values muse publishes today
do not match any shipped Facile app.** muse defaults to an indigo accent (`#6366f1`), a
24px `--radius-fc-md`, and an 8–32px type scale. The apps — Sablier, Vision, Nuage, Plume,
Courrier, Agenda, Casier — run a shadcn-svelte palette that is chroma-zero OKLCH throughout
(`--primary: oklch(0.145 0 0)`, `--background: oklch(1 0 0)`) on a single `--radius: 0.5rem`.
The one token in the suite palette that carries any chroma is
`--destructive: oklch(0.55 0.22 29)`.

So muse is the suite's component library, but its shipped palette is not the suite's live
design system. Consumers close the gap by aliasing `fc-*` onto their own tokens, exactly as
above. Two axes have converged since: icons are Solar `bold-duotone` in both, and Goga is
the face in muse, Vision and Casier — though Sablier, Agenda, Nuage and Courrier still ship
Inter.

`CHARTE.md` is the stated visual contract, but it has drifted from `tokens.css`: its color
table still lists a `--fc-border` token and `TODO` values, its typography section still
names Helvetica as the body face, and its radius line still reads 6/12/20px. `tokens.css` is
the only source of truth for what actually renders.
