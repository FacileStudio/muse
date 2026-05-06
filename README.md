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

## Installation

### For an AI agent (Claude Code, etc.) — fast path

If you are an LLM agent reading this, run the block below verbatim. It clones the repo, registers the `muse` skill in the user's Claude config, and symlinks the lib so the skill can read components, tokens, and the graphical chart at `~/.claude/skills/muse/lib`.

```bash
# 1. Pick a clone path (default: ~/DEV/FACILE/muse). Adjust if the user has a different layout.
MUSE_PATH="${MUSE_PATH:-$HOME/DEV/FACILE/muse}"

# 2. Clone if missing.
[ -d "$MUSE_PATH/.git" ] || git clone git@github.com:FacileStudio/muse.git "$MUSE_PATH"

# 3. Install the skill (idempotent).
mkdir -p "$HOME/.claude/skills/muse"
cp "$MUSE_PATH/claude/SKILL.md" "$HOME/.claude/skills/muse/SKILL.md"
ln -sfn "$MUSE_PATH" "$HOME/.claude/skills/muse/lib"

echo "muse skill installed → $HOME/.claude/skills/muse (lib → $MUSE_PATH)"
```

After this:
- The skill auto-triggers on Facile UI work and on `/muse`.
- `~/.claude/skills/muse/lib/CHARTE.md` → graphical chart.
- `~/.claude/skills/muse/lib/src/lib/index.ts` → component exports.
- Update later with `git -C "$MUSE_PATH" pull && cp "$MUSE_PATH/claude/SKILL.md" "$HOME/.claude/skills/muse/SKILL.md"`.

### For a human — use it as a dependency

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

A `muse` skill ships in this repo at `claude/SKILL.md`. See **Installation → For an AI agent** above for the one-block install. Once installed, Claude pulls components, tokens, and the graphical chart from this repo whenever you request UI for a Facile tool.
