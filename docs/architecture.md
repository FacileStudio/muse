# muse — Architecture

How a source-only Svelte library reaches a consumer app, what the Tailwind v4 theme actually
publishes, how the repo is verified without a build, and how it doubles as an AI skill for
Claude Code and Codex.

## Runtime topology

There is no muse process. The library is compiled inside the consumer's Vite build, and its
CSS variables are turned into utility classes by the consumer's Tailwind pass.

```
FacileStudio/muse (git)
        │
        │  bun add github:FacileStudio/muse#v0.3.0
        ▼
consumer/node_modules/@facile/muse/src/lib/
        │
        ├── index.ts ──▶ components/{atoms,molecules,organisms,charts,motion}/*.svelte
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
                        @source '…/@facile/muse/src'  ← consumer must declare this
                                                       or no fc-* utility is emitted
```

The skill install is a separate, much smaller path — two files fetched over HTTPS, no clone:

```
raw.githubusercontent.com/FacileStudio/muse/main
        │  curl -fsSL install.sh | bash
        │
        ├── integrations/SKILL.md ─┬─▶ ~/.claude/skills/muse/SKILL.md   (if `claude` on PATH)
        │                          └─▶ a marked block in ~/.codex/AGENTS.md  (if `codex` on PATH)
        └── CHARTE.md ─────────────┬─▶ ~/.claude/skills/muse/CHARTE.md
                                   └─▶ ~/.codex/muse/CHARTE.md
```

## Components

| Piece | File | Role |
|---|---|---|
| Public surface | `src/lib/index.ts` | Re-exports 48 components plus `cn`/`twMerge`, the motion/press/field/secret/chart helpers, `icons`, `USER_COLORS` and the exported types. Nothing else is importable |
| Atoms | `src/lib/components/atoms/` | 16 single-element primitives — buttons, inputs, badges, surfaces |
| Molecules | `src/lib/components/molecules/` | 12 compositions of atoms — form rows, settings rows, nav rows, uploads, secrets |
| Organisms | `src/lib/components/organisms/` | 8 page-level structures — dialogs, nav, header, table, profile |
| Charts | `src/lib/components/charts/` | 6 exported SVG charts and chart parts, plus internal `ChartTable.svelte` and `entry.ts` |
| Motion | `src/lib/components/motion/` | 6 pieces that exist for the animation, not the markup |
| Icons | `src/lib/icons.ts` | 45 Iconify names behind stable keys — Solar `linear` for chrome, MDI for plus/close/chevrons |
| Theme | `src/lib/styles/tokens.css` | `@import 'tailwindcss'`, `@font-face` rules, an `@theme` block, an `@theme static` block for the chart slots, a media-query dark override, a `.dark` class override, and an `@layer base` |
| Fonts | `src/lib/fonts/` | Goga Medium (500) and Goga Semibold (600) |
| Class merge | `src/lib/utils/cn.ts` | `fc-*`-aware `tailwind-merge`. Every component imports `twMerge` from here |
| Motion helpers | `src/lib/utils/motion.ts` | `prefersReducedMotion()`, `isMobile()` — both SSR-safe |
| Press | `src/lib/utils/press.ts` | `springPress`, the one press curve, as a `use:` action |
| Field context | `src/lib/utils/field.ts` | `setFieldContext` / `getFieldContext` — how a `Field` labels the control below it |
| Dialog controller | `src/lib/utils/dialog.ts` | `createDialog` — open/close sync, exit-animation latch, backdrop hit-test, body scroll lock. **Internal**; `Modal` and `Drawer` are the API |
| Chart maths | `src/lib/utils/chart.ts` | Scales, paths, arcs, bar and donut geometry, the `resize` action. Partly exported |
| Secrets | `src/lib/utils/secret.ts` | `REDACTED`, `isRedacted`, `maskSecret` |
| Demo | `demo/` | Vite playground consuming the library through a **vite alias**, not a dependency |
| Skill | `integrations/SKILL.md` | One markdown file consumed by both Claude Code and Codex |
| Installer | `install.sh` | `curl`s `SKILL.md` and `CHARTE.md` and copies them into place |

The atomic split is import-path only. Everything is re-exported flat from `index.ts`, so
consumers write `import { NavButton } from '@facile/muse'` and never name a tier.

## Consumption lifecycle

1. The consumer installs the repo as a GitHub dependency. `package.json` exposes
   `"svelte"` and `"main"` pointing at `./src/lib/index.ts` — the raw TypeScript entry.
   There is no build step and no `dist/`.
2. `@sveltejs/vite-plugin-svelte` compiles the `.svelte` files from `node_modules` as part
   of the consumer's build.
3. `import '@facile/muse/styles'` resolves through the `"./styles"` export to
   `tokens.css`, which itself does `@import 'tailwindcss'`.
4. Tailwind v4 reads the `@theme` block and generates `bg-fc-*`, `text-fc-*`,
   `rounded-fc-*`, `max-w-fc-*`, `w-fc-nav-*`, `size-fc-nav-item` and `ease-fc` utilities.
5. Tailwind scans the consumer's own source for class names. It does **not** scan
   `node_modules` by default, so the consumer must add an `@source` directive covering
   `@facile/muse/src`. Without it every muse component renders unstyled. See
   [development.md](development.md).

## Verification without a build

The library produces no artifact, so "does it build" is not a question that can be asked of
it directly. Three checks stand in, and they catch different things:

| Command | What it actually proves |
|---|---|
| `mise run check` | `svelte-check --tsconfig ./tsconfig.json --fail-on-warnings` — **the only type check**. `tsconfig.json` includes `src/**` *and* `demo/src/**`, with a `paths` alias mapping `@facile/muse` to `src/lib/index.ts`, so the demo's usage is type-checked against the library it aliases |
| `mise run test` | `bun test src/lib` — the chart maths in `utils/chart.test.ts` and the secret helpers in `utils/secret.test.ts`. The two pieces of real logic here that are not Svelte templates |
| `mise run demo:build` | Every component **compiles**: template syntax, snippet misuse, unknown DOM props. Vite strips types without reading them, so this proves nothing about type correctness |
| `mise run verify` | All three, in that order. Same steps as `.github/workflows/ci.yml` |

The distinction matters because the demo build is fast and feels like a full check. It is not.
A prop typed `string` handed a `number` sails straight through `demo:build` and is caught only
by `check`. Run `verify`.

CI (`.github/workflows/ci.yml`) runs on every push to `main` and every pull request: install
with `--frozen-lockfile`, then the same three steps.

## Class composition

Every component builds its class string in a `$derived`, with a `twMerge` imported from
`src/lib/utils/cn.ts` — **not** from `tailwind-merge` directly:

```ts
import { twMerge } from '../../utils/cn.js';

const classes = $derived(twMerge('rounded-fc-md bg-fc-component p-4', className));
```

Because `twMerge` resolves conflicts by keeping the last utility in the same group, a
consumer passing `class="p-8"` replaces `p-4` rather than fighting it in the cascade. This
is the library-wide contract: pass `class` and expect it to win.

The indirection through `cn.ts` is not stylistic. Stock `tailwind-merge` only knows
Tailwind's built-in scales, so `text-fc-sm` fails its font-size validator and falls through
to the permissive `text-color` group — where it collides with `text-fc-fg` and, being later
in the string, **deletes it**. The failure is silent and produces components that render
with no text colour at all. `cn.ts` calls `extendTailwindMerge` to register the `fc-*`
font families, sizes, colours and radii in their correct groups:

```ts
export const twMerge = extendTailwindMerge({
  extend: { classGroups: {
    'font-family': [{ font: ['fc-body', 'fc-title', 'fc-mono'] }],
    'font-size': [{ text: [/* fc-xs … fc-3xl */] }],
    'text-color': [{ text: [/* fc-fg, fc-accent, fc-info, … */] }],
    'bg-color': [{ bg: [/* … */] }], 'border-color': [{ border: [/* … */] }],
    rounded: [{ rounded: [/* fc-xs … fc-full */] }]
  } }
});
```

It is re-exported publicly as `cn` so consumers writing their own `fc-*` markup get the same
correct behaviour. A token added to `tokens.css` but not to `cn.ts` reopens the bug for that
token.

## Prop passthrough

Atoms, molecules and organisms spread `...rest` onto their root element, placed **last** so a
consumer attribute wins over the component default. That is the rule; the exceptions are all
cases where the component's own behaviour depends on winning:

- `Modal` and `Drawer` spread the dialog controller's `onclose` / `oncancel` / `onclick`
  after `rest`. Those three are what keep `open` in sync and make the dialog dismissible; a
  consumer `onclick` would otherwise silently break closing.
- `Tabs`, `ColorPicker` and `OptionCards` keep their `role`, `aria-*` and `onkeydown` after
  `rest` — the roving-tabindex keyboard model is the component.
- `Dropzone` keeps its five drag handlers after `rest`.

Chart and motion components take `class` only and spread nothing.

## Motion architecture

Animation is GSAP everywhere except `Carousel`, which uses native scroll snapping and an
`IntersectionObserver`, and `Skeleton` / `Spinner`, which are CSS animations behind the
`motion-reduce:` variant.

| Where | What animates |
|---|---|
| `motion/` | `Rideau` (curtain height), `TextElevate` (rise), `WordReveal` (ScrollTrigger + SplitText scrub), `Mosaique` (bloom out from centre), `PageTransition` (keyed fade + lift) |
| `organisms/` | `SideBar` tweens its own width from an `$effect`; `Modal` scales, `Drawer` translates, each handing its tweens to the shared dialog controller |
| `molecules/` | `Tabs` slides its indicator pill |
| `charts/` | `entry.ts` — a 0→1 progress tween, a dash-offset draw-in for lines, opacity fades for areas |
| everywhere pressable | `springPress` from `utils/press.ts` — `IconButton`, `NavButton` (both the `<a>` and the `<button>` branch), and `SideBar`'s footer user card |

Every GSAP path calls `prefersReducedMotion()` first and takes a non-animated branch when it
returns `true`: the curtain drops to height `0` instantly, text is set to its final transform,
the mosaic lands in place, the sidebar snaps to its target width, charts jump to their final
state, and press animations are skipped. `tokens.css` additionally carries a global
`@media (prefers-reduced-motion: reduce)` block that collapses every CSS animation and
transition — including consumer-authored ones — to `0.01ms` rather than `none`, so
`transitionend` still fires and nothing waiting on it hangs.

The press curve lives in one action rather than inline in each component precisely because it
is the kind of thing that drifts: three hand-copied gsap sequences ended up on two different
scales the first time it was inlined. Same reasoning behind `utils/dialog.ts` — `Modal` and
`Drawer` share the open/close state machine, the closing latch, the backdrop hit-test and the
refcounted body scroll lock, but keep their own tweens, because a modal scaling and a sheet
translating on different curves is not duplication.

`WordReveal` registers the GSAP `ScrollTrigger` and `SplitText` plugins at mount and kills
both on destroy. `SplitText` was a paid Club GreenSock plugin before GSAP 3.13; the
dependency floor is `^3.13.0` for exactly that reason — on 3.12 the import does not resolve.

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
`dark:` utilities follow the class. The two blocks are byte-identical duplicates on purpose:
plain CSS cannot share a declaration block between a media query and a class selector, and
`light-dark()` needs Chrome 123, ahead of the Chrome 111 floor Tailwind v4 targets. Edit both
or neither.

The chart slots live in a separate `@theme static` block. `chartColor()` builds the variable
name with a template literal, so the strings `fc-chart-3`…`fc-chart-6` appear in no source
file — a plain `@theme` would emit only the slots Tailwind saw used, and an undefined `var()`
in an SVG `fill` renders black.

`tokens.css` also emits an `@layer base` that sets the font stack and tracking on `html`, page
background and foreground on `body`, the title face on `h1`–`h6`, the global scrollbar
suppression, and the reduced-motion rule. Importing the styles therefore establishes base page
behaviour, not only utility classes.

Borders use a single `--color-fc-border` token (`oklch(0.9 0 0)` light, `oklch(1 0 0 / 10%)`
dark) across the whole library.

## Relationship to the rest of the suite

muse is a `lib` repo: it ships no service, reads no environment variable, opens no socket,
and has no involvement with `pool`, `enveloppe`, Journal, or Porte. Its only integration
surfaces are the package export map and the two AI skill install paths.
