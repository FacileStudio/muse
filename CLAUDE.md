# muse

Svelte 5 component library and design system for Facile tools. Published as `@facile/muse`.

## Tech stack

- Svelte 5 (runes API: `$state`, `$props`, `$derived`, `$effect`) + SvelteKit
- Tailwind CSS v4 with custom `@theme` tokens
- GSAP for animations (`^3.13.0` — `gsap/SplitText` does not resolve on 3.12)
- TypeScript, type-checked with `svelte-check`
- Bundled font: Goga (Medium 500 + Semibold 600)

## Project structure

```
muse/
  CHARTE.md                   Visual contract (colors, type, spacing, motion, a11y rules)
  install.sh                  Installs the AI skill for Claude Code and Codex
  mise.toml                   check / test / demo / demo:build / verify
  tsconfig.json               svelte-check config — includes src/lib AND demo/src
  .github/workflows/ci.yml    check + test + demo build on push and PR
  demo/                       Vite SPA playground — src/pages/ (hash router) renders every component
  integrations/SKILL.md       Shared AI skill definition
  src/lib/
    index.ts                  Public re-exports (all components + utils)
    icons.ts                  Iconify name map (47 keys) + IconKey type
    colors.ts                 Identity palette (Sablier's USER_COLORS) + normalizers
    components/               50 Svelte components (atoms/ molecules/ organisms/ charts/ motion/)
    fonts/                    Bundled Goga font files (.otf)
    styles/tokens.css         Tailwind v4 @theme block, @font-face, dark mode, @layer base
    utils/cn.ts               fc-*-aware tailwind-merge — every component uses it
    utils/motion.ts           prefersReducedMotion() and isMobile() helpers
    utils/press.ts            springPress — the one gsap press curve, as a use: action
    utils/field.ts            Field ↔ control context (id, describedBy, invalid)
    utils/dialog.ts           Shared Modal/Drawer controller — internal, not re-exported
    utils/chart.ts            scales, paths, arcs, resize action — shared by charts/
    utils/secret.ts           REDACTED wire contract, isRedacted, maskSecret
    utils/toast.svelte.ts     Module-scope toast queue behind Toaster — toast, toasts
```

Tier counts: 16 atoms, 13 molecules, 9 organisms, 6 charts, 6 motion. `ChartTable.svelte` and
`components/charts/entry.ts` are internal to the charts and not exported.

## Key commands

The library has no build step — components are consumed directly from source via the
`svelte` and `main` exports pointing to `src/lib/index.ts`.

```bash
mise run check        # svelte-check over src/lib and demo/src — the only type check
mise run test         # bun test src/lib — chart maths and the secret helpers
mise run demo         # dev server on http://127.0.0.1:5183
mise run demo:build   # production build of the demo — compiles every component
mise run verify       # check + test + demo:build, i.e. everything CI runs
```

**`demo:build` does not type-check.** Vite strips types without reading them, so the demo
build proves every component *compiles* (template syntax, snippet misuse, unknown DOM props)
and nothing about whether the types agree. `mise run check` is the type check. They catch
different failures; run `mise run verify` before pushing.

Install as dependency in a consumer app:

```bash
bun add "github:FacileStudio/muse#v0.2.0"
```

Install the AI skill (Claude Code / Codex):

```bash
curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash
```

## Design tokens

All tokens live in `src/lib/styles/tokens.css` inside a `@theme` block. Consumer apps import
them once in their root layout:

```ts
import '@facile/muse/styles';
```

The palette is **chroma-zero OKLCH**, matching the shipped suite apps. Namespaces: `fc-page`,
`fc-bg`, `fc-surface`, `fc-component`, `fc-fg`, `fc-fg-muted`, `fc-accent`, `fc-accent-fg`,
`fc-border`, `fc-ring`, `fc-scrim`, `fc-danger`, `fc-danger-fg`, `fc-success`, `fc-info`,
`fc-warning`, `fc-owner`, `fc-admin`, plus `fc-chart-1`…`fc-chart-6` for categorical chart
series (Sablier's identity palette, deepened for legibility). Use via Tailwind utilities like
`bg-fc-bg`, `text-fc-fg`, `rounded-fc-md`.

Type scale is 12/14/16/18/22/28/36px with paired line-heights — **`text-fc-sm` (14px) is the
UI default**. Radii: `fc-xs` 4, `fc-sm` 6, `fc-md` 8, `fc-lg` 12, `fc-pill` 999.
`--ease-fc` is `cubic-bezier(0.77, 0, 0.175, 1)`, the CSS spelling of GSAP's `power3.inOut`,
so a consumer's CSS transition lands on the same curve as a muse animation beside it.

There are **no spacing tokens** — spacing is Tailwind's stock scale. The two `--spacing-fc-nav-*`
entries are fixed nav-item geometry, not a scale.

`tokens.css` also carries a documented z-index scale (content `z-0`, chart overlays `z-10`,
sticky chrome `z-30`, dropdowns `z-40`, viewport-fixed chrome `z-50`, `Rideau` `z-[100]`;
`<dialog>.showModal()` puts modals in the top layer, above all of it) and a global
`prefers-reduced-motion` block that collapses every CSS animation and transition.

Dark mode swaps token values two ways: `prefers-color-scheme` (scoped `:root:not(.light)`)
and an explicit `.dark` class, so apps can offer a manual toggle. The two blocks are
byte-identical duplicates on purpose — **edit both or neither**.

## Conventions

- Read `CHARTE.md` before any UI work -- it is the visual contract.
- Svelte 5 runes only. No legacy `$:` reactivity.
- No hardcoded hex values -- use tokens from `tokens.css`. Ask before adding new ones.
- **Import `twMerge` from `../../utils/cn.js`, never from `tailwind-merge`.** Stock
  tailwind-merge reads `text-fc-sm` as a *colour* and silently deletes `text-fc-fg` from the
  same class string. Any new `fc-*` token must be added to `cn.ts` too.
- One tone vocabulary. `Badge` and `StatusDot` take
  `neutral | accent | info | success | warning | danger | owner | admin`; `Alert` takes the
  status subset (`neutral | info | success | warning | danger`); `ConfirmModal` takes
  `neutral | danger`. `Button` deliberately keeps `variant` (emphasis and shape) as a
  separate axis from tone.
- Callback props are camelCase `onX` — `onChange`, `onSelect`, `onClose`, `onConfirm`,
  `onCancel`, `onReveal`, `onCopy`, `onFiles`, `onReject`. Lowercase `on*` names are reserved
  for native DOM handlers arriving through `...rest`.
- Active and primary states are **inverted** (`bg-fc-accent text-fc-accent-fg`), never tinted.
  Semantic fills are the opposite — tinted (`bg-fc-danger/10 text-fc-danger`), never solid.
- **Never show scrollbars.** `tokens.css` hides them globally in the base layer; scrolling
  still works everywhere. A visible scrollbar takes layout width and shifts content sideways.
  Don't re-enable them, and don't add `[scrollbar-width:none]` utilities — already handled.
- Container surfaces (`Card`, `StatCard`, `Table`) carry **no border** — the `bg-fc-component`
  fill separates them. 1px `border-fc-border` is for separation *inside* a container, form
  controls, `Dropzone`, and floating surfaces. Shadows only on floating things. `ChartTooltip`
  is the one floating surface with no border: it is 60px wide and lives inside a card, so a
  step of fill plus the shadow is enough. A `Toast` keeps its border — nothing frames it.
- Dashboard spacing is ranked, not per-component: `gap-4` inside a card, `p-5` card padding,
  `gap-4` between cards, `gap-10` between sections. A gutter is never tighter than the
  padding of the cards it separates. See CHARTE §4.
- Every `<button>` declares `type` — an undeclared button inside a form submits it.
- One focus ring everywhere:
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring`.
- `...rest` goes on the root element, **last**, so a consumer attribute wins. The exceptions
  are deliberate: `Modal`/`Drawer` spread the dialog controller's handlers after `rest`
  (they are what keeps `open` in sync), and `Tabs`, `Dropzone`, `ColorPicker`, `OptionCards`
  and `SpaceSwitcher` keep their own role/keyboard wiring after it. Motion and chart
  components take `class` only and spread nothing.
- Icons: Solar **`linear`** for chrome, MDI for plus/close/chevrons, `bold-duotone` for brand
  marks only. Icons inherit `currentColor`; always pass `width`, `height` and `class="block"`.
- Mobile-first: minimum supported width is 360px, hit targets >= 44px, use `100dvh` not `100vh`.
- All animations must respect `prefers-reduced-motion: reduce`.
- GSAP with `power3.inOut` ease by default; press feedback goes through `springPress`.
- Components go in `src/lib/components/<tier>/` and must be re-exported from `src/lib/index.ts`.
- Consumer apps must have `@tailwindcss/vite` (or PostCSS) configured.

## Gotchas

- No build step for the library -- it is consumed directly from source. There is no `dist/`.
- The demo does **not** install `@facile/muse`. A `file:..` dependency makes bun copy the whole
  repo into `demo/node_modules` -- including `demo/node_modules` itself -- which recurses and
  dies with `ENOENT: failed copying files from cache to destination`. (`link:..` is worse: bun
  reads it as a *global* link and symlinks `~/.bun/install/global`.) Instead
  `demo/vite.config.ts` aliases `@facile/muse` straight at `../src/lib/index.ts`, with
  `resolve.dedupe` for `svelte`/`gsap`/`tailwind-merge` so imports from outside the demo root
  resolve, and `demo/src/app.css` imports the tokens by relative path. `tsconfig.json` mirrors
  the alias with a `paths` entry so `svelte-check` resolves the demo's imports too.
- Consumers need **both** `import '@facile/muse/styles'` and `@source
  '../node_modules/@facile/muse/src'`. Without the `@source`, Tailwind never scans the
  components and everything renders structurally correct but completely unstyled.
- `iconify-icon` is **not** a dependency. `Button`, `NavButton`, `Tabs`, `OptionCards`,
  `Dropzone`, `UploadProgress`, `SecretField`, `SpaceSwitcher`, `SideBar`, `MobileNav`,
  `Modal`, `Drawer` and `ConfirmModal` render `<iconify-icon>` elements that stay inert
  unless the consumer app registers the custom element.
- `Field` publishes its generated id through context, so muse's own `Input`/`Select`/`Textarea`
  wire themselves up. A control muse does not own takes the ids from the snippet parameters:
  `{#snippet children({ id, describedBy })}`.
- The `@theme static` block for `fc-chart-*` is deliberate: `chartColor()` builds the variable
  name with a template literal, so Tailwind never sees the class names and a plain `@theme`
  would drop the unused slots — and an undefined `var()` in an SVG `fill` renders black.
- Only Goga Medium and Semibold ship, so `font-bold` synthesizes -- prefer `font-semibold`.
  The Goga files are labeled "GogaTest" (test license).
- `peerDependencies` require Svelte 5+ and Tailwind 4+ in the consumer.
