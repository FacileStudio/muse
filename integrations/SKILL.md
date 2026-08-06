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

Library path (Claude Code): `~/.claude/skills/muse/lib`
Library path (Codex): `~/.codex/muse/lib`
Package name when consumed: `@facile/lib`
Repo: `https://github.com/FacileStudio/muse`

## When to apply

Auto-apply when the task involves frontend for a Facile tool: component, page, layout, style, animation.
Do not apply for backend, infra, scripts, or non-UI work.
Do not apply if the user asks for React, Next, Vue, Solid, or plain HTML.
Opt-out triggers: "no muse", "skip lib", "raw svelte" → dormant for the session.

## Rules

- Read `lib/CHARTE.md` first — visual contract (colors, type, spacing, motion, a11y)
- Read `lib/src/lib/index.ts` — reuse existing components before creating new ones
- Generate Svelte 5 + SvelteKit only; runes API: `$state`, `$props`, `$derived`, `$effect`; TypeScript on
- Style with Tailwind v4 token utilities only. Token source: `lib/src/lib/styles/tokens.css`
- GSAP for animations; always respect `prefers-reduced-motion`
- Mobile-first: min width 360px, hit targets ≥ 44px, use `100dvh` not `100vh`
- Never hardcode hex — use tokens or ask before adding a new one

## What is in the box

Import everything flat from `@facile/lib`; the tier directories are import paths only.

| Tier | Components |
|---|---|
| Atoms | `Alert` `Avatar` `Badge` `Button` `Card` `Checkbox` `Component` `Divider` `IconButton` `Input` `Radio` `Select` `Skeleton` `Spinner` `Switch` `Textarea` |
| Molecules | `Field` `NavButton` `SpaceSwitcher` `StatCard` |
| Organisms | `MobileNav` `Modal` `SideBar` `Table` `Topbar` |
| Motion | `Carousel` `Mosaique` `Rideau` `TextElevate` `WordReveal` |
| Utils | `icons` `cn` / `twMerge` `prefersReducedMotion` `isMobile` |

App shell = `SideBar` (desktop, collapsible) + `MobileNav` (the `md:hidden` floating pill bar).
`SideBar` takes `spaces` / `activeSpaceId` / `onSpaceSelect` and renders `SpaceSwitcher` itself.

## Token vocabulary

Colours are **chroma-zero OKLCH** — the palette is greyscale except `fc-danger`,
`fc-success`, `fc-warning`, `fc-owner`, `fc-admin`.

`bg-fc-page` `bg-fc-bg` `bg-fc-surface` `bg-fc-component` · `text-fc-fg` `text-fc-fg-muted`
`bg-fc-accent` / `text-fc-accent-fg` · `border-fc-border` · `outline-fc-ring` ·
`text-fc-danger` `text-fc-success` `text-fc-warning`

Radii: `rounded-fc-xs` 4 · `fc-sm` 6 · `fc-md` 8 · `fc-lg` 12 · `fc-pill` 999
Type: `text-fc-xs` 12 · **`text-fc-sm` 14 ← the UI default** · `fc-md` 16 · `fc-lg` 18 · `fc-xl` 22 · `fc-2xl` 28 · `fc-3xl` 36

Three house rules that make generated UI look like the suite rather than generic Tailwind:

1. **Active and primary states are inverted, never tinted.** `bg-fc-accent text-fc-accent-fg`
   — `fc-accent` deliberately equals `fc-fg`, so a selected nav row is a solid inverted slab.
2. **Semantic fills are tinted, not solid.** `bg-fc-danger/10 text-fc-danger`, matching the
   suite's `bg-destructive/10`. A solid saturated block is wrong.
3. **Separation is a 1px `border-fc-border`, not elevation.** Shadows only on genuinely
   floating things — dropdowns, `Modal`, the `MobileNav` bar.

`Button` is a pill. Buttons, badges and avatars are `rounded-fc-pill`; panels are `fc-md`/`fc-lg`.

## Icons

- **Solar `linear`** for all UI chrome — `solar:settings-linear`, `solar:folder-linear`, …
- **`bold-duotone` is for an app's brand mark only** (what you pass to `SideBar`'s `icon` prop). Never for nav or action icons.
- **MDI for plus, close and chevrons** — `mdi:plus` `mdi:close` `mdi:chevron-right|left|up|down`. Solar's versions of those read muddy at 16px.
- Prefer a key from `lib/src/lib/icons.ts` over inlining a name; add a key there if it is missing.
- Icons inherit `currentColor` — do not give them their own colour class, or inverted active states will not flip them.
- Always pass `width` **and** `height` plus `class="block"`. `<iconify-icon>` is inline by default and its baseline descender knocks icon/label pairs out of alignment.
- Sizes: 16 inline · 18 nav rows · 24 brand mark.

## Traps that produce silently broken UI

**1. Merge classes with muse's `cn`, never raw `tailwind-merge`.**
Stock `tailwind-merge` does not know `fc-*` is a custom scale, so it classifies `text-fc-sm`
as a *colour* and silently deletes `text-fc-fg` from the same string — yielding black-on-black
buttons and invisible avatar initials, with no error. Inside the library import
`twMerge` from `../../utils/cn.js`; in a consumer app import `cn` from `@facile/lib`.
Add any new `fc-*` token to the matching list in `utils/cn.ts` or you reintroduce this.

**2. Tailwind v4 does not scan `node_modules`.** A consumer needs both lines in `app.css`,
or every muse component renders structurally correct and completely unstyled:

```css
@import 'tailwindcss';
@import '@facile/lib/styles';
@source '../node_modules/@facile/lib/src';
```

**3. `iconify-icon` is not a muse dependency.** `SideBar`, `NavButton`, `SpaceSwitcher`,
`MobileNav` and `Mosaique` render `<iconify-icon>` elements that stay inert unless the
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

There is no build or test step for `src/lib` itself, so `mise run demo:build` is the
cheapest way to catch a compile error across every component at once. Run it before pushing.

## Adding to the library

1. Drop the component in `lib/src/lib/components/<atoms|molecules|organisms|motion>/`
2. Accept `class` and merge with `twMerge(defaults, className)` — `className` last
3. Re-export from `lib/src/lib/index.ts` — a component that is not re-exported does not exist
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
