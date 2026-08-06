# muse — Architecture

How a source-only Svelte library reaches a consumer app, what the Tailwind v4 theme actually
publishes, and how the same repo doubles as an AI skill for Claude Code and Codex.

## Runtime topology

There is no muse process. The library is compiled inside the consumer's Vite build, and its
CSS variables are turned into utility classes by the consumer's Tailwind pass.

```
FacileStudio/muse (git)
        │
        │  bun add github:FacileStudio/muse
        ▼
consumer/node_modules/@facile/lib/src/lib/
        │
        ├── index.ts ──▶ components/{atoms,molecules,organisms,motion}/*.svelte
        │                                 │  compiled by
        │                                 ▼
        │                          @sveltejs/vite-plugin-svelte ──▶ app bundle
        │                                                              ▲
        ├── icons.ts ──▶ solar:*-linear / mdi:* names ──▶ <iconify-icon>│
        │                                                              │
        └── styles/tokens.css ──▶ @tailwindcss/vite ───────────────────┘
                    │                     ▲
                    │  @theme { --color-fc-* … }
                    │                     │
                    └── fonts/Goga*.otf   │
                                          │
                        @source '…/@facile/lib/src'  ← consumer must declare this
                                                       or no fc-* utility is emitted
```

```
FacileStudio/muse (git)
        │  curl install.sh | bash
        ├──▶ ~/.claude/skills/muse/lib   + SKILL.md  (copied from integrations/SKILL.md)
        └──▶ ~/.codex/muse/lib           + a marked block injected into ~/.codex/AGENTS.md
```

## Components

| Piece | File | Role |
|---|---|---|
| Public surface | `src/lib/index.ts` | Re-exports 30 components, `cn`/`twMerge`, 2 motion helpers, `icons` and `IconKey`. Nothing else is importable. |
| Atoms | `src/lib/components/atoms/` | 16 single-element primitives — buttons, inputs, badges, surfaces |
| Molecules | `src/lib/components/molecules/` | 4 compositions of atoms — `Field`, `NavButton`, `SpaceSwitcher`, `StatCard` |
| Organisms | `src/lib/components/organisms/` | 5 page-level structures — `MobileNav`, `Modal`, `SideBar`, `Table`, `Topbar` |
| Motion | `src/lib/components/motion/` | 5 GSAP-driven pieces |
| Icons | `src/lib/icons.ts` | 19 Iconify names behind stable keys — Solar `linear` for chrome, MDI for plus/close/chevrons |
| Theme | `src/lib/styles/tokens.css` | `@import 'tailwindcss'`, `@font-face` rules, one `@theme` block, a media-query dark override, a `.dark` class override, and an `@layer base` |
| Fonts | `src/lib/fonts/` | Goga Medium (500) and Goga Semibold (600) |
| Class merge | `src/lib/utils/cn.ts` | `fc-*`-aware `tailwind-merge`. Every component imports `twMerge` from here |
| Helpers | `src/lib/utils/motion.ts` | `prefersReducedMotion()`, `isMobile()` — both SSR-safe |
| Demo | `demo/` | Vite playground consuming the library via `file:..`; the only thing in the repo that builds |
| Skill | `integrations/SKILL.md` | One markdown file consumed by both Claude Code and Codex |
| Installer | `install.sh` | Clones or `git pull --ff-only`s the repo per tool, then wires the skill |

The atomic split is import-path only. Everything is re-exported flat from `index.ts`, so
consumers write `import { NavButton } from '@facile/lib'` and never name a tier.

## Consumption lifecycle

1. The consumer installs the repo as a GitHub dependency. `package.json` exposes
   `"svelte"` and `"main"` pointing at `./src/lib/index.ts` — the raw TypeScript entry.
   There is no build step and no `dist/`.
2. `@sveltejs/vite-plugin-svelte` compiles the `.svelte` files from `node_modules` as part
   of the consumer's build.
3. `import '@facile/lib/styles'` resolves through the `"./styles"` export to
   `tokens.css`, which itself does `@import 'tailwindcss'`.
4. Tailwind v4 reads the `@theme` block and generates `bg-fc-*`, `text-fc-*`,
   `rounded-fc-*`, `max-w-fc-*`, `w-fc-nav-*` and `ease-fc` utilities.
5. Tailwind scans the consumer's own source for class names. It does **not** scan
   `node_modules` by default, so the consumer must add an `@source` directive covering
   `@facile/lib/src`. Without it every muse component renders unstyled. See
   [development.md](development.md).

## Class composition

Every component builds its class string in a `$derived`, with a `twMerge` imported from
`src/lib/utils/cn.ts` — **not** from `tailwind-merge` directly:

```ts
import { twMerge } from '../../utils/cn.js';

const classes = $derived(twMerge('rounded-fc-md border border-fc-border bg-fc-component p-4', className));
```

Because `twMerge` resolves conflicts by keeping the last utility in the same group, a
consumer passing `class="p-8"` replaces `p-4` rather than fighting it in the cascade. This
is the library-wide contract: pass `class` and expect it to win.

The indirection through `cn.ts` is not stylistic. Stock `tailwind-merge` only knows
Tailwind's built-in scales, so `text-fc-sm` fails its font-size validator and falls through
to the permissive `text-color` group — where it collides with `text-fc-fg` and, being later
in the string, **deletes it**. The failure is silent and produces components that render
with no text colour at all. `cn.ts` calls `extendTailwindMerge` to register the `fc-*`
sizes, colours and radii in their correct groups:

```ts
export const twMerge = extendTailwindMerge({
  extend: { classGroups: {
    'font-size': [{ text: [/* fc-xs … fc-3xl */] }],
    'text-color': [{ text: [/* fc-fg, fc-accent, … */] }],
    'bg-color': [{ bg: [/* … */] }], 'border-color': [{ border: [/* … */] }],
    rounded: [{ rounded: [/* fc-xs … fc-pill */] }]
  } }
});
```

It is re-exported publicly as `cn` so consumers writing their own `fc-*` markup get the same
correct behaviour. A token added to `tokens.css` but not to `cn.ts` reopens the bug for that
token.

## Motion architecture

Eight components animate. `Rideau`, `TextElevate`, `WordReveal` and `Mosaique` drive GSAP
from `onMount`; `SideBar` tweens its own width from an `$effect`; `IconButton` and
`NavButton` run a spring press on `pointerdown`; `Carousel` uses only native scroll snapping
and an `IntersectionObserver`.

Every GSAP path calls `prefersReducedMotion()` first and takes a non-animated branch when it
returns `true` — the curtain drops to height `0` instantly, text is set to its final
transform, the mosaic lands in place, the sidebar snaps to its target width, and press
animations are skipped entirely. `Skeleton` and `Spinner` use the `motion-reduce:animate-none`
Tailwind variant instead.

The press animation is the house spring: scale to `0.88`–`0.94` in `0.08s` with `power2.in`,
then back to `1` in `0.5s` with `elastic.out(1, 0.4)`. `IconButton` inlines it as an
`onpointerdown` handler; `NavButton` and `SideBar` implement it as a `use:springPress` Svelte
action so it can attach to either an `<a>` or a `<button>`.

`WordReveal` additionally registers the GSAP `ScrollTrigger` and `SplitText` plugins at
mount. `SplitText` shipped as a paid Club GreenSock plugin before GSAP 3.13; the declared
range is `^3.12.0`, so a consumer resolving an older 3.12.x will fail to import it.

## Theming model

muse owns no runtime theme state. Everything is CSS custom properties inside `@theme`, which
means a consumer overrides any token by redeclaring the variable at `:root` after importing
the styles. That is how the suite reconciles muse with its own palette — see
[configuration.md](configuration.md) for the aliasing pattern used in `Casier`.

Dark mode has two entry points that compose. A `@media (prefers-color-scheme: dark)` block
scoped `:root:not(.light)` handles the OS preference with no JavaScript; a `:root.dark` block
handles an explicit class. Both swap the full palette. The `:not(.light)` guard is what makes
a manual switcher work in the one case a plain media query cannot express — forcing light
while the OS is in dark mode. `@custom-variant dark` is registered alongside, so Tailwind's
`dark:` utilities follow the class.

`tokens.css` also emits an `@layer base` that sets the font stack and tracking on `html`,
page background and foreground on `body`, and the title face on `h1`–`h6`. Importing the
styles therefore establishes base page colours, not only utility classes — a consumer gets a
coherent page without writing any CSS.

Borders use a real `--color-fc-border` token (`oklch(0.9 0 0)` light, `oklch(1 0 0 / 10%)`
dark), which is the single border colour across the library. The earlier alpha-over-foreground
approach (`border-fc-fg/7` and `/10`) is gone.

## Relationship to the rest of the suite

muse is a `lib` repo: it ships no service, reads no environment variable, opens no socket,
and has no involvement with `pool`, `enveloppe`, Journal, or Porte. Its only integration
surfaces are the package export map and the two AI skill install paths.
