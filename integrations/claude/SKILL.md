---
name: muse
description: >
  Default frontend generator for Facile tools. When the user asks for frontend, component,
  page, layout, style, or animation work for a Facile tool, pull components, tokens, and the
  graphical chart from the muse component library symlinked at ~/.claude/skills/muse/lib.
  Svelte/SvelteKit only — never produce React or Next code unless the user explicitly requests
  it for the current session. Auto-triggers on UI work in any Facile tool project. Also runs
  on "/muse".
---

# muse skill

Library lives at `~/.claude/skills/muse/lib` (cloned by the installer).
Package name when consumed: `@facile/lib`. Repo: `https://github.com/FacileStudio/muse`.

## When this skill applies

Auto-apply when **all** of these hold:
- The task involves frontend code for a Facile tool: a component, a page, a layout, a style, an animation
- The user has not opted out for the session ("no muse", "skip lib", "raw svelte" → opt-out)

Do **not** auto-apply when:
- The user explicitly asks for React, Next, Vue, Solid, plain HTML — only build that on demand for the current session
- The work is backend, infra, scripts, or non-UI

## What to do

1. **Read first, don't reinvent**:
   - `lib/CHARTE.md` — graphical chart (colors, type, spacing, motion, a11y)
   - `lib/src/lib/index.ts` — list of exported components
   - Open the closest existing component before writing a new one

2. **Generate Svelte 5 + SvelteKit only**:
   - Runes API: `$state`, `$props`, `$derived`, `$effect`
   - TypeScript on by default
   - Tailwind v4 utility classes for styling. Tokens are exposed as utilities — `bg-fc-bg`, `text-fc-fg`, `border-fc-border`, `rounded-fc-pill`, `text-fc-lg`, etc.
   - Source of token definitions: `lib/src/lib/styles/tokens.css` (Tailwind v4 `@theme` block)
   - GSAP for motion when an animation is requested

3. **Mobile-proof every component**:
   - Mobile-first CSS, breakpoints `sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280
   - Min supported width 360px — verify no horizontal scroll
   - Hit targets ≥ 44×44px
   - Use `100dvh` not `100vh` for full-height
   - Respect `prefers-reduced-motion` for any animation — fall back to instant or opacity-only

4. **Tokens, not hex**:
   - Use the Tailwind utilities backed by tokens (`bg-fc-*`, `text-fc-*`, `rounded-fc-*`, …) or `var(--color-fc-*)` when you need raw CSS.
   - If a token does not exist, ask before adding hardcoded values.
   - Never invent brand colors. The chart is the contract.

5. **If you add to the library**:
   - Drop the component in `lib/src/lib/components/` (this resolves to your local muse clone via the symlink)
   - Re-export from `lib/src/lib/index.ts`
   - Run the component checklist in `CHARTE.md` § 9
   - Commit + push to `FacileStudio/muse` so collaborators pick it up

6. **Consume from a Facile tool**:
   ```bash
   bun add file:../path/to/muse   # or: bun add github:FacileStudio/muse
   ```
   Then `import { ComponentName } from '@facile/lib';`
   Token import once in root layout: `import '@facile/lib/styles';`
   Make sure the consumer app has `@tailwindcss/vite` (or PostCSS) wired up.

## Onboarding for collaborators

This skill + lib are shared. Keep things digestible:
- Comment props with short JSDoc at the top of each `.svelte` file
- Keep `CHARTE.md` as the single source of truth for visuals
- Keep `lib/README.md` newcomer-friendly — install, use, contribute, in that order
- Don't add esoteric build tooling without good reason

## Out of scope by default

- React / Next / Vue / Solid components (per-session opt-in only)
- Backend logic, API routes, database
- New design tokens without explicit approval

## Triggers

- User asks for "frontend", "page", "component", "UI" on a Facile tool
- User invokes `/muse`
- User names a Facile tool by name

## Override

User says "stop muse" or "raw svelte" → skill stays dormant for the session.
