# muse

Svelte 5 component library and design system for Facile tools, published as `@facile/muse`.

muse ships 84 components arranged as layout primitives, atoms, molecules, organisms, charts and
two motion pieces,
a Tailwind v4 token theme, the Iconify icon map and the Magnetik typeface. It is consumed
directly from source — there is no build step and no `dist/`. An `install.sh` also registers
muse as an AI skill for Claude Code and Codex so agents generate suite-shaped UI by default.

The palette matches what the suite actually ships: chroma-zero OKLCH, inverted (never tinted)
active states, borderless container surfaces, hidden scrollbars, and Solar `linear`
icons — plus a six-slot chart palette derived from Sablier's identity colours.

## What it does

- Exports 97 Svelte 5 components: layout primitives, atoms, molecules, organisms, charts and
  motion pieces
- Speaks fr, en, es and de: a dependency-free message helper (`provideLocale`, `createTranslator`)
  drives every muse string, and apps reuse it for their own catalogs
- Ships the launch surfaces every app shares: `SignInWithFacile`, `SignUpWithFacile`, `LandingCta`,
  `AuthScreen`, `PlanLimit`, `LegalFooter`, `LocaleSwitch`, `PricingPlans`, `DownloadCta`, `DownloadSection`,
  `FeatureSplit`, `WorksWith`, `ForDevelopers`, `LandingHeader` and `LandingFooter`
- Standardises the settings page — `Tabs`, `SettingsSection`, `SettingsRow`, and a
  `SecretField` that masks, reveals-then-re-hides, and copies credentials the same way in
  every app
- Ships dependency-free SVG charts (`LineChart`, `BarChart`, `DonutChart`, `Sparkline`) with
  hover, empty states and a screen-reader data table — no charting library
- Publishes a Tailwind v4 `@theme` block under the `fc-*` namespace — colors, radii, type
  scale, fonts, easing, container and nav widths — plus a documented z-index scale and a
  global `prefers-reduced-motion` rule
- Merges consumer classes over component defaults with an `fc-*`-aware `tailwind-merge`
  (`cn`), so `class` always wins **and** sizes stop colliding with colours
- Labels forms correctly by default: `Field` renders a real `<label for>` and muse's own
  `Input` / `Select` / `Textarea` / `ColorPicker` adopt its id, `aria-describedby` and
  `aria-invalid` through context
- Exports `icons`, a keyed map of 45 Iconify names — Solar `linear` for chrome, MDI for
  plus/close/chevrons — with an `IconKey` type
- Bundles Magnetik (Regular 400, Medium 500 and 600, Bold 700) as woff2 with `font-display: swap`,
  in front of the platform sans stack. Mono stays on the platform stack
- Supports OS dark mode out of the box, plus a `.dark` / `.light` class override so apps can
  offer a theme toggle
- Ships `prefersReducedMotion()`, `isMobile()` and the `springPress` action so every
  animation can degrade
- Asks for a colour with a real picker: `ColorPicker` pairs `<input type="color">` with a hex
  field that accepts `fff`, `#FFF` or `#ffffff` and never clobbers a half-typed one
- Exports `USER_COLORS`, the identity palette shared with Sablier, plus its normalizers, and
  the chart maths (`niceScale`, `linePath`, `areaPath`, `arcPath`, `tickStride`, `resize`)
- Registers itself as an AI skill for Claude Code (`~/.claude/skills/muse/`) and Codex
  (`~/.codex/muse/`) through `install.sh`

## Landing pages

Every app landing uses the same blocks, in this order of importance:

| Block | What it does |
|---|---|
| `LandingCta` | "Créer un compte gratuit" first, "Se connecter avec Facile" second, same height, stacked full width below 640px |
| `FeatureSplit` | Heading and one line on one side, an icon list on the other; `reverse` flips the sides |
| `WorksWith` | The suite apps this one really connects to: icon, name, one line, optional link |
| `PricingPlans` | On an app page: `highlight` + `highlightOnly`, `notes` per plan key (a note every plan shares shows once under the cards), `recommended="pro"`, `suiteHref` for the "one subscription covers every app" line, `freeLabel` / `freeHref` for the free plan's button |
| `ForDevelopers` | Bottom block: CLI, API, MCP and source rows with copyable commands (long ones wrap between path segments), and `selfHostHref` |

The section blocks lay out on their own width (container queries), so they behave the same inside
an app shell and on a full-width page. Their headings default to `LANDING_HEADING`.

**The sign-up href.** `SignUpWithFacile` links to `https://sso.facile.studio/signup`, plus
`?lang=<locale>` when the locale is known. Registre's sign-up is public (proof of work, no puzzle,
then an e-mailed link). Nothing an app can put on its porte route (`/auth/oidc`) opens Registre on
the sign-up form: `/authorize` always lands on `/login?auth_request=…`, and porte forwards only
`ui_locales`. So a visitor who signs up ends on Registre's home, signed in; the app's
`SignInWithFacile` then completes without a password. Pass `signUpHref` only to point at another
Registre.

## Stack

| Layer | Tech |
|---|---|
| Runtime | Svelte 5 runes (peer `^5.0.0`), SvelteKit |
| Client | Tailwind CSS 4 (peer `^4.0.0`), GSAP `^3.13.0`, tailwind-merge `^3.5.0` |
| Checks | `svelte-check` `^4.1.0` + TypeScript `^5.7.0`, `bun test` |

## Install

```sh
bun add "github:FacileStudio/muse#v0.6.0"
```

Import the theme once in the root layout, then use components anywhere:

```svelte
<script lang="ts">
  import '@facile/muse/styles';
  import { Button, Card, Field, Input } from '@facile/muse';

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
CHARTE.md                  Visual contract — color, type, spacing, motion, icons, accessibility
install.sh                 Installs the AI skill for Claude Code and Codex
mise.toml                  check · test · demo · demo:build · verify
tsconfig.json              svelte-check config — covers src/lib *and* demo/src
.github/workflows/ci.yml   The same three steps `mise run verify` runs
demo/                      Vite playground rendering every component from source
integrations/
  SKILL.md                 The shared skill definition both tools read
src/lib/
  index.ts                 Public re-exports — the whole surface
  icons.ts                 Iconify name map and the IconKey type
  colors.ts                USER_COLORS identity palette and its normalizers
  components/              atoms/ molecules/ organisms/ charts/ motion/
  styles/tokens.css        Tailwind v4 @theme block, dark mode, base layer
  utils/cn.ts              fc-*-aware tailwind-merge — every component uses it
  utils/motion.ts          prefersReducedMotion(), isMobile()
  utils/press.ts           springPress — the shared gsap press action
  utils/field.ts           Field ↔ control context (label id, describedBy, invalid)
  utils/dialog.ts          Shared Modal/Drawer controller — internal, not exported
  utils/chart.ts           Scales, paths, arcs, the resize action — shared by charts/
  utils/secret.ts          REDACTED wire contract, isRedacted, maskSecret
```

## Checks

```sh
mise run check        # svelte-check over src/lib and demo/src — the only type check
mise run test         # bun test — every test in the repo
mise run demo         # dev server on http://127.0.0.1:5183
mise run demo:build   # production build of the demo — compiles every component
mise run verify       # check + test + demo:build, i.e. everything CI runs
```

`demo:build` and `check` catch different things and neither replaces the other. Vite strips
types without checking them, so `demo:build` proves every component **compiles** — template
syntax, unknown props on DOM elements, bad snippet usage — and says nothing about whether the
types line up. `mise run check` is the one that reads the types. Run `verify` before pushing.

## Demo

```sh
mise run demo          # → http://127.0.0.1:5183
```

`demo/` aliases `@facile/muse` straight at `../src/lib/index.ts` in `vite.config.ts` — it is
deliberately *not* a path dependency — so edits to `src/lib/` hot-reload straight into the
page. `demo/src/pages/` holds the example pages; read one before building a page in a
consumer app, they show the intended composition end to end.

## Documentation

| Doc | What's in it |
|---|---|
| [Architecture](docs/architecture.md) | How the library reaches a consumer app, and the skill path |
| [Configuration](docs/configuration.md) | Every published token, and how suite apps alias them |
| [Development](docs/development.md) | Local setup, the checks, the `@source` trap, adding a component |
| [API](docs/api.md) | Every exported component with its props |

---

Part of the [Facile Suite](https://facile.studio) — self-hosted tools for creative studios
and freelancers. One login, zero cloud dependency.
