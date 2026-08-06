# muse

Svelte 5 component library and design system for Facile tools. Published as `@facile/lib`.

## Tech stack

- Svelte 5 (runes API: `$state`, `$props`, `$derived`, `$effect`) + SvelteKit
- Tailwind CSS v4 with custom `@theme` tokens
- GSAP for animations
- TypeScript
- Bundled font: Goga (Medium 500 + Semibold 600)

## Project structure

```
muse/
  CHARTE.md                   Visual contract (colors, type, spacing, motion, a11y rules)
  install.sh                  One-line installer for Claude Code and Codex AI skill integration
  mise.toml                   `mise run demo` / `demo:build`
  demo/                       Vite playground rendering every component from source
  integrations/SKILL.md       Shared AI skill definition
  src/lib/
    index.ts                  Public re-exports (all components + utils)
    icons.ts                  Iconify name map + IconKey type
    components/               30 Svelte components (atoms/ molecules/ organisms/ motion/)
    fonts/                    Bundled Goga font files (.otf)
    styles/tokens.css         Tailwind v4 @theme block, @font-face, dark mode, @layer base
    utils/cn.ts               fc-*-aware tailwind-merge — every component uses it
    utils/motion.ts           prefersReducedMotion() and isMobile() helpers
```

## Key commands

The library itself has no build, test or lint step — components are consumed directly from
source via the `svelte` and `main` exports pointing to `src/lib/index.ts`.

The demo is the only thing that builds, and it is the closest thing to a test suite:

```bash
mise run demo         # dev server on http://127.0.0.1:5183
mise run demo:build   # compile-checks every component at once — run before pushing
```

Install as dependency in a consumer app:

```bash
bun add github:FacileStudio/muse
```

Install the AI skill (Claude Code / Codex):

```bash
curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash
```

## Design tokens

All tokens live in `src/lib/styles/tokens.css` inside a `@theme` block. Consumer apps import
them once in their root layout:

```ts
import '@facile/lib/styles';
```

The palette is **chroma-zero OKLCH**, matching the shipped suite apps. Namespaces: `fc-page`,
`fc-bg`, `fc-surface`, `fc-component`, `fc-fg`, `fc-fg-muted`, `fc-accent`, `fc-accent-fg`,
`fc-border`, `fc-ring`, `fc-danger`, `fc-danger-fg`, `fc-success`, `fc-warning`, `fc-owner`,
`fc-admin`. Use via Tailwind utilities like `bg-fc-bg`, `text-fc-fg`, `rounded-fc-md`.

Type scale is 12/14/16/18/22/28/36px with paired line-heights — **`text-fc-sm` (14px) is the
UI default**. Radii: `fc-xs` 4, `fc-sm` 6, `fc-md` 8, `fc-lg` 12, `fc-pill` 999.

Dark mode swaps token values two ways: `prefers-color-scheme` (scoped `:root:not(.light)`)
and an explicit `.dark` class, so apps can offer a manual toggle.

## Conventions

- Read `CHARTE.md` before any UI work -- it is the visual contract.
- Svelte 5 runes only. No legacy `$:` reactivity.
- No hardcoded hex values -- use tokens from `tokens.css`. Ask before adding new ones.
- **Import `twMerge` from `../../utils/cn.js`, never from `tailwind-merge`.** Stock
  tailwind-merge reads `text-fc-sm` as a *colour* and silently deletes `text-fc-fg` from the
  same class string. Any new `fc-*` token must be added to `cn.ts` too.
- Active and primary states are **inverted** (`bg-fc-accent text-fc-accent-fg`), never tinted.
  Semantic fills are the opposite — tinted (`bg-fc-danger/10 text-fc-danger`), never solid.
- Separation is a 1px `border-fc-border`; shadows only on floating things.
- Icons: Solar **`linear`** for chrome, MDI for plus/close/chevrons, `bold-duotone` for brand
  marks only. Icons inherit `currentColor`; always pass `width`, `height` and `class="block"`.
- Mobile-first: minimum supported width is 360px, hit targets >= 44px, use `100dvh` not `100vh`.
- All animations must respect `prefers-reduced-motion: reduce`.
- GSAP with `power3.inOut` ease by default.
- Components go in `src/lib/components/<tier>/` and must be re-exported from `src/lib/index.ts`.
- Consumer apps must have `@tailwindcss/vite` (or PostCSS) configured.

## Gotchas

- No build step for the library -- it is consumed directly from source. There is no `dist/`.
- Consumers need **both** `import '@facile/lib/styles'` and `@source
  '../node_modules/@facile/lib/src'`. Without the `@source`, Tailwind never scans the
  components and everything renders structurally correct but completely unstyled.
- `iconify-icon` is **not** a dependency. `SideBar`, `NavButton`, `SpaceSwitcher`, `MobileNav`
  and `Mosaique` render `<iconify-icon>` elements that stay inert unless the consumer app
  registers the custom element.
- Only Goga Medium and Semibold ship, so `font-bold` synthesizes -- prefer `font-semibold`.
  The Goga files are labeled "GogaTest" (test license).
- `peerDependencies` require Svelte 5+ and Tailwind 4+ in the consumer.
