# muse

Svelte 5 component library and design system for Facile tools, published as `@facile/lib`.

muse ships 49 components arranged as atoms, molecules, organisms, charts and motion pieces,
a Tailwind v4 token theme, the Iconify icon map, and the bundled Goga typeface. It is consumed
directly from source — there is no build step and no `dist/`. An `install.sh` also registers
muse as an AI skill for Claude Code and Codex so agents generate suite-shaped UI by default.

The palette matches what the suite actually ships: chroma-zero OKLCH, inverted (never tinted)
active states, borderless container surfaces, hidden scrollbars, Goga, and Solar `linear`
icons — plus a CVD-validated six-slot chart palette derived from Sablier's identity colours.

## What it does

- Exports 49 Svelte 5 components: 17 atoms, 12 molecules, 8 organisms, 6 charts, 6 motion pieces
- Standardises the settings page — `Tabs`, `SettingsSection`, `SettingsRow`, and a
  `SecretField` that masks, reveals-then-re-hides, and copies credentials the same way in
  every app
- Ships dependency-free SVG charts (`LineChart`, `BarChart`, `DonutChart`, `Sparkline`) with
  hover, empty states and a screen-reader data table — no charting library
- Publishes a Tailwind v4 `@theme` block under the `fc-*` namespace — colors, radii, type
  scale, fonts, easing, container and nav widths
- Merges consumer classes over component defaults with an `fc-*`-aware `tailwind-merge`
  (`cn`), so `class` always wins **and** sizes stop colliding with colours
- Exports `icons`, a keyed map of Iconify names — Solar `linear` for chrome, MDI for
  plus/close/chevrons — with an `IconKey` type
- Bundles the Goga typeface (Medium and Semibold) as `@font-face` rules
- Supports OS dark mode out of the box, plus a `.dark` / `.light` class override so apps can
  offer a theme toggle
- Ships `prefersReducedMotion()` and `isMobile()` so every animation can degrade
- Exports `USER_COLORS`, the identity palette shared with Sablier, plus its normalizers
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
mise.toml              `mise run demo` / `demo:build`
demo/                  Vite playground rendering every component from source
integrations/
  SKILL.md              The shared skill definition both tools read
src/lib/
  index.ts             Public re-exports — the whole surface
  icons.ts             Iconify name map and the IconKey type
  components/          atoms/ molecules/ organisms/ motion/
  fonts/               Goga Medium and Goga Semibold (.otf)
  styles/tokens.css    Tailwind v4 @theme block, @font-face rules, dark mode
  utils/cn.ts          fc-*-aware tailwind-merge — every component uses it
  utils/motion.ts      prefersReducedMotion(), isMobile()
```

## Demo

```sh
mise run demo          # → http://127.0.0.1:5183
```

`demo/` aliases `@facile/lib` straight at `../src/lib/index.ts` in `vite.config.ts` — it is
deliberately *not* a path dependency — so edits to `src/lib/` hot-reload straight into the
page. Since `src/lib` has no build or test step, `mise run
demo:build` is the cheapest way to compile-check every component at once — run it before
pushing.

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
