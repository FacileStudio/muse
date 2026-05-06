# muse

Svelte / SvelteKit component library + design system for Facile tools.

> If you're about to write frontend for a Facile tool — pull from here first.

---

## Install the AI skill

```bash
curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash
```

Detects which AI tools are installed and registers muse for each:

| Tool | Install path |
|------|-------------|
| Claude Code | `~/.claude/skills/muse/` |
| Codex | `~/.codex/muse/` |

Works with either, or both. Re-run the same command to update.

---

## Use as a dependency

```bash
bun add github:FacileStudio/muse
```

Or local:

```bash
git clone https://github.com/FacileStudio/muse.git
bun add file:../muse
```

Then in your app:

```svelte
<script lang="ts">
  import { Rideau, TextElevate } from '@facile/lib';
</script>
```

Pull tokens once in root layout:

```ts
import '@facile/lib/styles';
```

Requires `@tailwindcss/vite` (or PostCSS) in the consumer app.

---

## Stack

- **Svelte 5 + SvelteKit** — runes API (`$state`, `$props`, `$derived`)
- **Tailwind CSS v4** — design tokens in `src/lib/styles/tokens.css`
- **GSAP** — animation
- **iconify-icon** — icons

---

## Layout

```
muse/
├── CHARTE.md              graphical chart — colors, type, spacing, motion
├── install.sh             one-line installer (Claude Code + Codex)
├── integrations/
│   └── MUSE.md            shared AI skill definition (Claude Code + Codex)
└── src/lib/
    ├── components/        *.svelte exports
    ├── styles/            tokens.css (@theme block)
    ├── utils/             shared helpers
    └── index.ts           public re-exports
```

---

## Adding a component

1. Drop `MyThing.svelte` into `src/lib/components/`
2. Re-export from `src/lib/index.ts`
3. Mobile-first, no hardcoded hex — use tokens from `CHARTE.md`
4. Hit targets ≥ 44px, works at 360px width, respects `prefers-reduced-motion`

---

## Contributing

1. Read `CHARTE.md` — visual contract
2. Browse `src/lib/components/` before writing something new
3. Open a PR before adding a new runtime dependency
