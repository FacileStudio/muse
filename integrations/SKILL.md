---
name: muse
description: >
  Default frontend generator for Facile tools. When the user asks for frontend, component,
  page, layout, style, or animation work for a Facile tool, pull components, tokens, and the
  graphical chart from the muse component library at the lib path below.
  Svelte/SvelteKit only — never produce React or Next code unless the user explicitly requests
  it for the current session. Auto-triggers on UI work in any Facile tool project. Also runs
  on "/muse".
---

# muse — Facile UI component library

Visual contract (Claude Code): `~/.claude/skills/muse/CHARTE.md`
Visual contract (Codex): `~/.codex/muse/CHARTE.md`
Package name when consumed: `@facile/lib`
Source of truth in a consumer app: `node_modules/@facile/lib/src/lib/`
Repo: `https://github.com/FacileStudio/muse`

## When to apply

Auto-apply when the task involves frontend for a Facile tool: component, page, layout, style, animation.
Do not apply for backend, infra, scripts, or non-UI work.
Do not apply if the user asks for React, Next, Vue, Solid, or plain HTML.
Opt-out triggers: "no muse", "skip lib", "raw svelte" → dormant for the session.

## Rules

- Read `CHARTE.md` (installed beside this file) first — the visual contract: colours, type,
  spacing, motion, a11y, and the invariants that make UI look like the suite
- Read `node_modules/@facile/lib/src/lib/index.ts` — reuse existing components before
  creating new ones; if the package is not installed, read the table below
- Generate Svelte 5 + SvelteKit only; runes API: `$state`, `$props`, `$derived`, `$effect`; TypeScript on
- Style with Tailwind v4 token utilities only. Token source: `node_modules/@facile/lib/src/lib/styles/tokens.css`
- GSAP for animations; always respect `prefers-reduced-motion`
- Mobile-first: min width 360px, hit targets ≥ 44px, use `100dvh` not `100vh`
- Never hardcode hex — use tokens or ask before adding a new one

## What is in the box

Import everything flat from `@facile/lib`; the tier directories are import paths only.

| Tier | Components |
|---|---|
| Atoms | `Alert` `Avatar` `Badge` `Button` `Card` `Checkbox` `Component` `Divider` `IconButton` `Input` `Radio` `Select` `Skeleton` `Spinner` `Switch` `Textarea` |
| Molecules | `ColorPicker` `Dropzone` `Field` `NavButton` `SpaceSwitcher` `StatCard` `UploadProgress` |
| Organisms | `ConfirmModal` `Drawer` `MobileNav` `Modal` `ProfileCard` `SideBar` `Table` `Topbar` |
| Charts | `BarChart` `ChartLegend` `ChartTooltip` `DonutChart` `LineChart` `Sparkline` |
| Motion | `Carousel` `Mosaique` `PageTransition` `Rideau` `TextElevate` `WordReveal` |
| Utils | `icons` `cn` / `twMerge` `prefersReducedMotion` `isMobile` `chartColor` `formatCompact` `niceScale` `USER_COLORS` `normalizeUserColor` |

Reach for these before hand-rolling — they are the ones agents most often rebuild by mistake:

- **Confirmation** → `ConfirmModal` (`tone="danger"`, async `onconfirm` shows a spinner and
  stays open on reject). Never a bare `Modal` with two buttons.
- **Bottom sheet / mobile filters** → `Drawer` (drag-to-dismiss, safe-area aware).
- **Any chart** → `LineChart` `BarChart` `DonutChart` `Sparkline`. Dependency-free SVG; do
  not add a charting library, and do not pass your own series colours.
- **Identity colour** → `ColorPicker` + `USER_COLORS` (Sablier's palette, a persisted data
  contract — do not restyle the six hexes).
- **File upload** → `Dropzone` + `UploadProgress` (the consumer owns the actual upload).
- **Profile / identity block** → `ProfileCard`.
- **Route changes** → `PageTransition` keyed on the route.

App shell = `SideBar` (desktop, collapsible) + `MobileNav` (the `md:hidden` floating pill bar).
`SideBar` takes `spaces` / `activeSpaceId` / `onSpaceSelect` and renders `SpaceSwitcher` itself.

## Token vocabulary

Colours are **chroma-zero OKLCH** — the palette is greyscale except `fc-danger`,
`fc-success`, `fc-warning`, `fc-owner`, `fc-admin`, and the six chart series slots.

`bg-fc-page` `bg-fc-bg` `bg-fc-surface` `bg-fc-component` · `text-fc-fg` `text-fc-fg-muted`
`bg-fc-accent` / `text-fc-accent-fg` · `border-fc-border` · `outline-fc-ring` ·
`text-fc-danger` `text-fc-success` `text-fc-warning`

Chart series: `fc-chart-1`…`fc-chart-6` (purple, orange, aqua, red, green, pink) — Sablier's
identity palette. Assign **by series index in fixed order, never by rank**; `fc-danger` and
`fc-success` are reserved for status and are never series colours. The slot order is
CVD-validated — do not reorder it by taste.

Radii: `rounded-fc-xs` 4 · `fc-sm` 6 · `fc-md` 8 · `fc-lg` 12 · `fc-pill` 999
Type: `text-fc-xs` 12 · **`text-fc-sm` 14 ← the UI default** · `fc-md` 16 · `fc-lg` 18 · `fc-xl` 22 · `fc-2xl` 28 · `fc-3xl` 36

Three house rules that make generated UI look like the suite rather than generic Tailwind:

1. **Active and primary states are inverted, never tinted.** `bg-fc-accent text-fc-accent-fg`
   — `fc-accent` deliberately equals `fc-fg`, so a selected nav row is a solid inverted slab.
2. **Semantic fills are tinted, not solid.** `bg-fc-danger/10 text-fc-danger`, matching the
   suite's `bg-destructive/10`. A solid saturated block is wrong.
3. **Container surfaces carry no border.** `Card`, `StatCard` and `Table` separate from the
   page with their `bg-fc-component` fill. Do not add `border border-fc-border` to a card, a
   chart wrapper or a list container. 1px borders are for separation *inside* a container
   (list rows, table row rules), form controls, `Dropzone`, and floating surfaces — which
   also get the only shadows (`Modal`, `Drawer`, dropdowns, `MobileNav`).
4. **Never show scrollbars.** `tokens.css` hides them globally; scrolling still works. Do not
   re-enable them and do not add `[scrollbar-width:none]` utilities — already handled.
5. **Never put a border or ring on an avatar.**

`Button` is a pill. Buttons, badges and avatars are `rounded-fc-pill`; panels are `fc-md`/`fc-lg`.

### Buttons take icons as props

```svelte
<Button icon={icons.plus}>New project</Button>
<Button variant="danger" icon={icons.remove}>Delete</Button>
```

Never hand-write `<iconify-icon>` inside a `Button` — the prop sizes the glyph to the button
and emits the required `width`/`height`/`class="block"`. Action buttons should carry an icon:
creation `icons.plus`, destruction `icons.remove`.

Variants: `primary` `outline` `ghost` `danger` `ghost-danger`. Use **`ghost-danger` for
destructive row actions** (delete in a table or member list) — muted at rest, red on hover.
`danger` is always-tinted, for standalone destructive buttons. Both route through
`ConfirmModal`, never delete on click.

## Icons

- **Solar `linear`** for all UI chrome — `solar:settings-linear`, `solar:folder-linear`, …
- **`bold-duotone` is for an app's brand mark only** (what you pass to `SideBar`'s `icon` prop). Never for nav or action icons.
- **MDI for plus, close and chevrons** — `mdi:plus` `mdi:close` `mdi:chevron-right|left|up|down`. Solar's versions of those read muddy at 16px.
- Prefer a key from `@facile/lib`'s `icons` map over inlining a name; add a key there if missing.
- Icons inherit `currentColor` — do not give them their own colour class, or inverted active states will not flip them.
- Always pass `width` **and** `height` plus `class="block"`. `<iconify-icon>` is inline by default and its baseline descender knocks icon/label pairs out of alignment.
- Sizes: 16 inline · 18 nav rows · 24 brand mark.

## Traps that produce silently broken UI

**1. Merge classes with muse's `cn`, never raw `tailwind-merge`.**
Stock `tailwind-merge` does not know `fc-*` is a custom scale, so it classifies `text-fc-sm`
as a *colour* and silently deletes `text-fc-fg` from the same string — yielding black-on-black
buttons and invisible avatar initials, with no error. Inside the library import
`twMerge` from `../../utils/cn.js`; in a consumer app import `cn` from `@facile/lib`.
Add any new `fc-*` token to the matching list in `src/lib/utils/cn.ts` or you reintroduce this.

**2. Tailwind v4 does not scan `node_modules`.** A consumer needs both lines in `app.css`,
or every muse component renders structurally correct and completely unstyled:

```css
@import 'tailwindcss';
@import '@facile/lib/styles';
@source '../node_modules/@facile/lib/src';
```

**3. `iconify-icon` is not a muse dependency.** `Button`, `SideBar`, `NavButton`,
`SpaceSwitcher`, `MobileNav`, `Dropzone`, `UploadProgress` and `Mosaique` render `<iconify-icon>` elements that stay inert unless the
consumer registers the custom element (`import 'iconify-icon'`, or the CDN script in
`app.html` as the Go-family apps do).

## Dark mode

Follows the OS automatically. To let a user toggle it, put `dark` / `light` on `<html>` —
both beat the media query, which is scoped `:root:not(.light)` precisely so forcing light
works while the OS is dark. `demo/src/App.svelte` has a working persisted toggle.

## Seeing your work

`demo/` is a Vite app that renders the library from source:

```bash
mise run demo      # from the repo root → http://127.0.0.1:5183
```

`demo/src/pages/` holds the example pages (Dashboard, Projects, Spaces, Settings) — read one
before building a page, they show the intended composition end to end.

`mise run demo:build` is the cheapest way to catch a compile error across every component at
once; `mise run test` covers the chart maths. Run both before pushing.

## Adding to the library

1. Drop the component in `src/lib/components/<atoms|molecules|organisms|charts|motion>/`
2. Accept `class` and merge with `twMerge(defaults, className)` — `className` last
3. Re-export from `src/lib/index.ts` — a component that is not re-exported does not exist
4. Update `CHARTE.md` if you changed a token or a documented invariant
5. Commit and push to `FacileStudio/muse`

## Consuming from a Facile tool

```bash
bun add github:FacileStudio/muse
```

```svelte
<script lang="ts">
  import { Button, SideBar, icons } from '@facile/lib';
</script>
```

Root layout once: `import '@facile/lib/styles';`
Consumer app needs `@tailwindcss/vite` (or PostCSS) configured, plus the `@source` line above.

An app that already has its own palette should **alias `fc-*` onto its own tokens** in
`app.css` (`--color-fc-accent: var(--primary)`, …) rather than forking muse — see
`docs/configuration.md`.
