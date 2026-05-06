# Facile LIB

Svelte / SvelteKit component library for **Facile** tools.
Lives at `/home/gian/DEV/FACILE/LIB/`, sibling of `OUTILS/`.
Default UI source for everything generated under `/home/gian/DEV/FACILE/OUTILS/*`.

> If you (or an agent) are about to write frontend code for a Facile tool: pull from here first. Don't reinvent. Don't redesign.

---

## Why this exists

- One graphical chart for every Facile tool — see `CHARTE.md`
- One responsive baseline (mobile-first, fluid up to desktop)
- Components shareable across tools, no copy-paste drift
- Onboarding-friendly so collaborators can plug in fast

---

## Stack

- **Framework**: Svelte 5 + SvelteKit (runes API: `$state`, `$props`, `$derived`)
- **Styling**: Tailwind CSS (v4) + design tokens in `src/lib/styles/tokens.css`
- **Animation**: GSAP (already used across Obsidian notes)
- **Icons**: `iconify-icon` web component

> React / Next code is **not** generated here by default. Ask explicitly per session if you need it.

---

## Layout

```
FACILE/
├── LIB/                 ← this lib
│   ├── README.md        start here
│   ├── CHARTE.md        graphical chart — colors, type, spacing, motion
│   ├── package.json
│   └── src/lib/
│       ├── components/  *.svelte — exported building blocks
│       ├── styles/      tokens.css
│       ├── utils/       shared helpers
│       └── index.ts     public re-exports
└── OUTILS/              ← consumers
```

---

## Use it from a Facile tool

From any project under `/DEV/FACILE/OUTILS/<tool>`:

```bash
bun add file:../../LIB    # or pnpm/npm equivalent
```

Then:

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
3. Ask `gian` before introducing a new dependency

The agent skill `facile-ui` (in `~/.claude/skills/facile-ui/`) wires this lib into Claude's Facile workflow automatically.
