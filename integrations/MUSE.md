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
- Style with Tailwind v4 token utilities: `bg-fc-bg`, `text-fc-fg`, `border-fc-border`, `rounded-fc-pill`, etc.
- Token source: `lib/src/lib/styles/tokens.css`
- GSAP for animations; always respect `prefers-reduced-motion`
- Mobile-first: min width 360px, hit targets ≥ 44px, use `100dvh` not `100vh`
- Never hardcode hex — use tokens or ask before adding a new one

## Adding to the library

1. Drop component in `lib/src/lib/components/`
2. Re-export from `lib/src/lib/index.ts`
3. Commit and push to `FacileStudio/muse`

## Consuming from a Facile tool

```bash
bun add github:FacileStudio/muse
```

```svelte
<script lang="ts">
  import { ComponentName } from '@facile/lib';
</script>
```

Root layout once: `import '@facile/lib/styles';`
Consumer app needs `@tailwindcss/vite` (or PostCSS) configured.
