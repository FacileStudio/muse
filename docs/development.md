# muse — Development

Working on the library itself, wiring it into a consumer app, and the one setup mistake that
makes every component render unstyled.

## Prerequisites

- `bun` — the suite's package manager and TypeScript runtime
- `git` — `install.sh` clones and fast-forwards the repo in place
- `mise` — optional, but it is how the demo tasks are wired

## The demo app

`demo/` is a small Vite + Svelte 5 app that consumes the library from source and renders
every component. It is the playground — use it to see a change before committing.

```sh
mise run demo          # from the repo root
# or
cd demo && bun install && bun run dev
```

It serves on `http://127.0.0.1:5183`. `demo/package.json` depends on `"@facile/lib": "file:.."`,
so edits to `src/lib/` hot-reload straight into the page — no publish, no relink. `mise run
demo:build` does a production build, which is also the cheapest way to catch a Svelte
compile error across the whole library at once.

The demo is excluded from the published package: `files` in the root `package.json` lists
only `src/lib`, `CHARTE.md` and `README.md`.

## The library itself has no build

The root `package.json` declares no build step. The `"svelte"` and `"main"` fields point
straight at `src/lib/index.ts`, and consumers compile the `.svelte` sources out of
`node_modules`. Nothing in `src/lib` produces artifacts — `demo/` is the only thing here
that builds, and running it is the closest thing to a test suite this repo has.

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

## The `twMerge` trap — why `utils/cn.ts` exists

Stock `tailwind-merge` only knows Tailwind's built-in scales. It has no idea `fc-*` is a
custom namespace, so it classifies **`text-fc-sm` as a text _colour_**, not a font size —
`fc-sm` is not a recognised t-shirt size, and the `text-color` group accepts anything.

The consequence is silent and vicious. Given a component that merges a variant and a size:

```js
twMerge('border border-fc-border text-fc-fg', 'h-9 px-4 text-fc-sm')
// stock tailwind-merge → 'border border-fc-border h-9 px-4 text-fc-sm'
//                                        text-fc-fg is GONE
```

Two "colours" collided, so the later one won and the real colour was dropped. In practice
that shipped an outline button rendering as black text on a black background and avatar
initials that were simply invisible — no error, no warning, just components that look
broken in ways that send you hunting through `tokens.css`.

`src/lib/utils/cn.ts` fixes it once for the whole library by teaching `tailwind-merge` the
`fc-*` scales through `extendTailwindMerge`:

```ts
export const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size':    [{ text: ['fc-xs', 'fc-sm', /* … */] }],
      'text-color':   [{ text: ['fc-fg', 'fc-fg-muted', /* … */] }],
      'bg-color':     [{ bg: [/* … */] }],
      'border-color': [{ border: [/* … */] }],
      rounded:        [{ rounded: ['fc-xs', 'fc-sm', 'fc-md', 'fc-lg', 'fc-pill', 'fc-full'] }]
    }
  }
});
```

Sizes and colours now occupy separate groups and coexist, `rounded-fc-*` values properly
override one another instead of both surviving, and a consumer's `class` still wins.
**Every component imports `twMerge` from this module.** If you add a token to `tokens.css`,
add it to the matching list in `cn.ts` too — a token missing from `cn.ts` reintroduces
exactly this bug for that token.

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
   `twMerge(defaults, className)`. `className` goes last so consumers win. **Import
   `twMerge` from `../../utils/cn.js`, never from `tailwind-merge` directly** — see the
   next section for why that is load-bearing.
4. Style with `fc-*` utilities only. No raw hex, no arbitrary pixel values outside the token
   scale. Borders use the `border-fc-border` token. No colour in the library escapes the
   `fc-*` namespace — keep it that way.
5. Icons come from `icons.ts`, always the Solar **`linear`** variant, inheriting
   `currentColor` (no tint class). Add a key there rather than inlining an Iconify name.
   `bold-duotone` is reserved for brand marks — see `CHARTE.md` §8.
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
  `integrations/SKILL.md` to `~/.claude/skills/muse/SKILL.md`, overwriting it.
- If `codex` is found: clones to `~/.codex/muse/lib` and injects the same file into
  `~/.codex/AGENTS.md` between `<!-- muse:start -->` and `<!-- muse:end -->` markers.
  Content outside the markers is preserved; the marked block is replaced wholesale.
- If neither is found, the script prints the re-run instruction and exits 1.

Re-running updates: an existing clone is refreshed with `git pull --ff-only`, so a dirty or
diverged skill clone will fail the pull rather than clobber local work.

Edit `integrations/SKILL.md` to change what agents are told — both tools read that one file.
Committing and pushing to `FacileStudio/muse` is what ships it; there is no release step.

## Dependency policy

`gsap` and `tailwind-merge` are the only runtime dependencies. Open a PR before adding a
third — every dependency here lands in every consumer app's bundle. Note in particular that
`iconify-icon` is **not** a dependency: `NavButton`, `SideBar` and `Mosaique` render
`<iconify-icon>` elements that stay inert unless the consumer app has registered the custom
element itself.
