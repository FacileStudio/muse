# muse

Svelte 5 component library and design system for Facile tools, published as `@facile/lib`.

muse ships 28 components arranged as atoms, molecules, organisms and motion pieces, a
Tailwind v4 token theme, the Solar icon map, and the bundled Goga typeface. It is consumed
directly from source — there is no build step and no `dist/`. An `install.sh` also registers
muse as an AI skill for Claude Code and Codex so agents generate suite-shaped UI by default.

## What it does

- Exports 28 Svelte 5 components: 16 atoms, 3 molecules, 4 organisms, 5 GSAP motion pieces
- Publishes a Tailwind v4 `@theme` block under the `fc-*` namespace — colors, radii, type
  scale, fonts, easing, container and nav widths
- Merges consumer classes over component defaults with `tailwind-merge`, so `class` always wins
- Exports `icons`, a keyed map of Solar `bold-duotone` Iconify names, with an `IconKey` type
- Bundles the Goga typeface (Medium and Semibold) as `@font-face` rules
- Ships `prefersReducedMotion()` and `isMobile()` so every animation can degrade
- Registers itself as an AI skill for Claude Code (`~/.claude/skills/muse/`) and Codex
  (`~/.codex/muse/`) through `install.sh`

## Stack

| Layer | Tech |
|---|---|
| Runtime | Svelte 5 runes (peer `^5.0.0`), SvelteKit |
| Client | Tailwind CSS 4 (peer `^4.0.0`), GSAP `^3.12.0`, tailwind-merge `^3.5.0` |

## Install

```sh
bun add github:FacileStudio/muse
```

Import the theme once in the root layout, then use components anywhere:

```svelte
<script lang="ts">
  import '@facile/lib/styles';
  import { Button, Card, Field, Input } from '@facile/lib';

  let email = $state('');
</script>

<Card>
  <Field label="Email" helper="We only use it for the login link">
    <Input type="email" bind:value={email} placeholder="you@example.com" />
  </Field>
  <Button onclick={() => console.log(email)}>Send</Button>
</Card>
```

The consumer app needs `@tailwindcss/vite` (or the PostCSS plugin) configured, and a
`@source` directive pointing at muse inside `node_modules` — without it Tailwind never scans
the components and nothing is styled. See [docs/development.md](docs/development.md).

## Structure

```
CHARTE.md              Visual contract — color, type, spacing, motion, icons, accessibility
install.sh             Installs the AI skill for Claude Code and Codex
integrations/
  MUSE.md              The shared skill definition both tools read
src/lib/
  index.ts             Public re-exports — the whole surface
  icons.ts             Solar icon name map and the IconKey type
  components/          atoms/ molecules/ organisms/ motion/
  fonts/               Goga Medium and Goga Semibold (.otf)
  styles/tokens.css    Tailwind v4 @theme block, @font-face rules, dark mode
  utils/motion.ts      prefersReducedMotion(), isMobile()
```

## Documentation

| Doc | What's in it |
|---|---|
| [Architecture](docs/architecture.md) | How the library reaches a consumer app, and the skill path |
| [Configuration](docs/configuration.md) | Every published token, and how suite apps alias them |
| [Development](docs/development.md) | Local setup, the `@source` trap, adding a component |
| [API](docs/api.md) | Every exported component with its props |

---

Part of the [Facile Suite](https://facile.studio) — self-hosted tools for creative studios
and freelancers. One login, zero cloud dependency.
