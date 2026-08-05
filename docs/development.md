# muse — Development

Working on the library itself, wiring it into a consumer app, and the one setup mistake that
makes every component render unstyled.

## Prerequisites

- `bun` — the suite's package manager and TypeScript runtime
- `git` — `install.sh` clones and fast-forwards the repo in place
- A Svelte 5 / Tailwind 4 app to render against; muse has no playground of its own

## There is no build

`package.json` declares no `scripts` block at all. No `dev`, no `build`, no `test`, no lint.
The `"svelte"` and `"main"` fields point straight at `src/lib/index.ts`, and consumers
compile the `.svelte` sources out of `node_modules`. Nothing in this repo produces artifacts,
so there is nothing to run before committing — and nothing that would have caught a typo
either.

The practical consequence: a broken component is only discovered inside a consumer app.
Develop against one.

## Working against a local checkout

```sh
git clone https://github.com/FacileStudio/muse.git
cd ../your-app
bun add file:../muse
```

Vite treats linked dependencies as external by default. If edits to `../muse` do not show up,
add the package to the SvelteKit app's `optimizeDeps.exclude`, or restart the dev server.

## The `@source` trap

Tailwind v4 scans your source for class names and emits only what it finds. It does **not**
scan `node_modules`. Since every muse component's styling lives in class strings inside
`node_modules/@facile/lib`, Tailwind never sees `bg-fc-surface`, `rounded-fc-md`, or any
other `fc-*` utility, and emits none of them.

The result is not a warning or an error. It is a page of correctly structured, entirely
unstyled components — which reads like a broken import and sends people hunting in the wrong
place.

Fix it with one line in the consumer's `app.css`:

```css
@import 'tailwindcss';
@source '../node_modules/@facile/lib/src';
```

The path is relative to the CSS file. From `apps/client/src/app.css` in a suite monorepo
that resolves to `apps/client/node_modules/@facile/lib/src`; if your package manager hoists
to the workspace root, point at the root `node_modules` instead. Verify by inspecting a
rendered muse component — if it has classes but no computed background, the directive is
missing or pointing at the wrong directory.

This is separate from `import '@facile/lib/styles'`. The import brings in the token
definitions; `@source` is what makes Tailwind generate utilities from them. You need both.

## Where a component goes

| Tier | Directory | Rule |
|---|---|---|
| Atom | `src/lib/components/atoms/` | Wraps a single element, composes nothing from the library |
| Molecule | `src/lib/components/molecules/` | Composes atoms or motion pieces into one reusable unit |
| Organism | `src/lib/components/organisms/` | Page-level structure — dialogs, nav, headers, tables |
| Motion | `src/lib/components/motion/` | Exists for the animation, not the markup |

The tiers are import paths only; `index.ts` re-exports everything flat.

## Adding a component

1. Create the file in the right tier directory.
2. Type props with `$props()` and a TypeScript type literal. Extend the matching
   `svelte/elements` attribute type (`HTMLButtonAttributes`, `HTMLInputAttributes`, …) and
   spread `...rest` when the component wraps a native element.
3. Accept `class: className = ''` and build the final class string in a `$derived` with
   `twMerge(defaults, className)`. `className` goes last so consumers win.
4. Style with `fc-*` utilities only. No raw hex, no arbitrary pixel values outside the token
   scale. Borders are `border-fc-fg/7` (nav chrome) or `border-fc-fg/10` (inputs, tables) —
   there is no border color token. `Alert`'s hardcoded `yellow-500` is the existing
   violation, not the precedent.
5. Icons come from `icons.ts`, always the Solar `bold-duotone` variant, tinted
   `text-fc-fg/66`. Add a key there rather than inlining an Iconify name.
6. Mobile-first: works at 360px, hit targets at least 44px, `h-dvh` rather than `h-screen`.
7. Any animation branches on `prefersReducedMotion()` from `../../utils/motion.js`, or uses
   the `motion-reduce:` Tailwind variant. Reuse the house spring press — scale down in
   `0.08s` `power2.in`, back with `elastic.out(1, 0.4)` over `0.5s` — as a `use:` action if
   the component can render as either `<a>` or `<button>`.
8. Re-export from `src/lib/index.ts` in the matching tier block. A component that is not
   re-exported does not exist.
9. Walk the checklist at the end of `CHARTE.md` before opening a PR, and update `CHARTE.md`
   if you changed a token or a documented invariant.

Imports between library files use the `.js` extension (`'../../utils/motion.js'`) because the
package is ESM under NodeNext-style resolution.

## The AI skill

`install.sh` registers muse with whichever assistants are on `PATH`:

```sh
curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash
```

- If `claude` is found: clones the repo to `~/.claude/skills/muse/lib` and copies
  `integrations/MUSE.md` to `~/.claude/skills/muse/SKILL.md`, overwriting it.
- If `codex` is found: clones to `~/.codex/muse/lib` and injects the same file into
  `~/.codex/AGENTS.md` between `<!-- muse:start -->` and `<!-- muse:end -->` markers.
  Content outside the markers is preserved; the marked block is replaced wholesale.
- If neither is found, the script prints the re-run instruction and exits 1.

Re-running updates: an existing clone is refreshed with `git pull --ff-only`, so a dirty or
diverged skill clone will fail the pull rather than clobber local work.

Edit `integrations/MUSE.md` to change what agents are told — both tools read that one file.
Committing and pushing to `FacileStudio/muse` is what ships it; there is no release step.

## Dependency policy

`gsap` and `tailwind-merge` are the only runtime dependencies. Open a PR before adding a
third — every dependency here lands in every consumer app's bundle. Note in particular that
`iconify-icon` is **not** a dependency: `NavButton`, `SideBar` and `Mosaique` render
`<iconify-icon>` elements that stay inert unless the consumer app has registered the custom
element itself.
