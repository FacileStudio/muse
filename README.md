# muse

Svelte / SvelteKit component library + design system for **Facile** tools.
Maintained collaboratively (humans + AI) under the Facile graphical chart.

> If you (or your agent) are about to write frontend code for a Facile tool: pull from here first. Don't reinvent. Don't redesign.

---

## Why this exists

- One graphical chart for every Facile tool — see `CHARTE.md`
- One responsive baseline (mobile-first, fluid up to desktop)
- Components shareable across tools, no copy-paste drift
- Onboarding-friendly so collaborators can plug in fast

---

## Stack

- **Framework**: Svelte 5 + SvelteKit (runes API: `$state`, `$props`, `$derived`)
- **Styling**: Tailwind CSS v4 + design tokens in `src/lib/styles/tokens.css`
- **Animation**: GSAP
- **Icons**: `iconify-icon` web component

> React / Next code is **not** generated here by default. Ask explicitly per session if you need it.

---

## Layout

```
muse/
├── README.md        start here
├── CHARTE.md        graphical chart — colors, type, spacing, motion
├── package.json
└── src/lib/
    ├── components/  *.svelte — exported building blocks
    ├── styles/      tokens.css (Tailwind v4 @theme)
    ├── utils/       shared helpers
    └── index.ts     public re-exports
```

---

## Install

Clone next to your consumer project, then add as a local dependency:

```bash
git clone git@github.com:FacileStudio/muse.git
cd <your-facile-tool>
bun add file:../muse        # or pnpm / npm equivalent
```

Or pull straight from git:

```bash
bun add github:FacileStudio/muse
```

---

## Use it from a Facile tool

```svelte
<script lang="ts">
  import { Rideau, TextElevate } from '@facile/lib';
</script>

<Rideau />
<TextElevate text="Hello Facile" />
```

Pull the design tokens once in your root layout:

```ts
import '@facile/lib/styles';
```

The styles entry imports Tailwind v4 and exposes the Facile tokens as utilities (`bg-fc-bg`, `text-fc-fg`, `rounded-fc-pill`, …). Make sure your consumer app has `@tailwindcss/vite` (or PostCSS) configured.

---

## Add a component

1. Drop `MyThing.svelte` into `src/lib/components/`
2. Re-export it from `src/lib/index.ts`
3. Component **must** be responsive (mobile-first, scale up)
4. Component **must** use tokens from `CHARTE.md` — no hardcoded hex
5. Document props with a short JSDoc block at the top of the file

Mobile-proof checklist before merging:
- works at `360px` width
- no horizontal scroll
- hit targets ≥ `44px`
- respects `prefers-reduced-motion` for any GSAP animation

---

## For collaborators

If this is your first time:
1. Read `CHARTE.md` — that's the visual contract
2. Browse `src/lib/components/` — pick the closest existing component before writing a new one
3. Open a PR before introducing a new runtime dependency

### Claude Code users

A `muse` skill can wire this lib into your Claude Code workflow automatically. Drop it into `~/.claude/skills/muse/` (with a `lib` symlink pointing at your local clone) and Claude will pull components, tokens, and the graphical chart from this repo when generating UI for any Facile tool.
