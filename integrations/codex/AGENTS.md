# muse — Facile UI component library

You have access to the muse component library at `~/.codex/muse/lib`.
Package name when consumed: `@facile/lib`. Repo: `https://github.com/FacileStudio/muse`.

## When to apply

Apply automatically when the task involves frontend code for a Facile tool: components, pages, layouts, styles, or animations.
Do not apply for backend, infra, scripts, or non-UI work.
Do not apply if the user asks for React, Next, Vue, or plain HTML.

## Rules

- Read `lib/CHARTE.md` before generating any UI — it is the visual contract (colors, type, spacing, motion)
- Read `lib/src/lib/index.ts` to see available components — reuse before creating new ones
- Generate Svelte 5 + SvelteKit only (runes API: `$state`, `$props`, `$derived`, `$effect`), TypeScript on
- Style with Tailwind v4 utilities backed by design tokens: `bg-fc-bg`, `text-fc-fg`, `border-fc-border`, `rounded-fc-pill`, etc.
- Token source: `lib/src/lib/styles/tokens.css`
- Use GSAP for animations; always respect `prefers-reduced-motion`
- Mobile-first: min width 360px, hit targets ≥ 44px, use `100dvh` not `100vh`
- Never use hardcoded hex — use tokens or ask before adding a new one

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

Root layout: `import '@facile/lib/styles';`
