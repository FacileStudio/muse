# muse — Development

Working on the library itself, verifying a change without a build step, wiring muse into a
consumer app, and the one setup mistake that makes every component render unstyled.

## Prerequisites

- `bun` — the suite's package manager and TypeScript runtime
- `mise` — optional, but it is how the tasks are wired
- `curl` — the only thing `install.sh` needs; it fetches two files and does not clone

## The checks

There is no build to fail, so three commands stand in for one. They catch different things:

```sh
mise run check        # svelte-check over src/lib AND demo/src — the only type check
mise run test         # bun test src/lib — chart maths and secret helpers
mise run demo:build   # production build of the demo — compiles every component
mise run verify       # all three, in that order: what CI runs
```

**`demo:build` does not type-check.** Vite strips types without reading them. The demo build
proves every component *compiles* — template syntax, snippet misuse, an unknown attribute on a
DOM element — and says nothing about whether the types agree. A prop typed `string` handed a
`number` sails straight through it. `mise run check` is the type check, and it covers the demo
too: `tsconfig.json` includes `demo/src/**` with a `paths` alias mapping `@facile/lib` to
`src/lib/index.ts`, mirroring the vite alias, so the demo's usage is checked against the
library it aliases.

`check` runs with `--fail-on-warnings`, so an unused import or a missing accessibility
attribute fails the same way a type error does.

`.github/workflows/ci.yml` runs the identical three steps on every push to `main` and every
pull request. Run `mise run verify` before pushing and CI holds no surprises.

### Tests

`bun test src/lib` picks up `src/lib/utils/chart.test.ts` and `src/lib/utils/secret.test.ts`.
Those two modules are the only real logic in the repo that is not a Svelte template — axis
scales, path geometry, tick strides, and the masking rules that must never leak a secret's
length. New logic in `utils/` gets a test; new markup does not.

## The demo app

`demo/` is a small Vite + Svelte 5 app that consumes the library from source and renders every
component behind a hash router. It is the playground — use it to see a change before
committing.

```sh
mise run demo          # from the repo root → http://127.0.0.1:5183
```

It resolves `@facile/lib` through a **vite alias**, not a dependency:

```ts
// demo/vite.config.ts
resolve: {
  alias: { '@facile/lib': fileURLToPath(new URL('../src/lib/index.ts', import.meta.url)) },
  dedupe: ['svelte', 'gsap', 'tailwind-merge']
}
```

**Do not replace that with `"@facile/lib": "file:.."` in `demo/package.json`.** Bun copies the
whole repo into `demo/node_modules` — including `demo/node_modules` itself — which recurses
and dies with `ENOENT: failed copying files from cache to destination`. `link:..` is worse:
bun reads it as a *global* link and symlinks `~/.bun/install/global`. The alias also needs
`resolve.dedupe` so `svelte`, `gsap` and `tailwind-merge` imported from outside the demo root
resolve to one copy, and `demo/src/app.css` imports the tokens by relative path rather than
through the package name.

Edits to `src/lib/` hot-reload straight into the page — no publish, no relink.

The demo is excluded from the published package: `files` in the root `package.json` lists only
`src/lib`, `CHARTE.md` and `README.md`.

## The library itself has no build

The root `package.json` declares no build step. The `"svelte"` and `"main"` fields point
straight at `src/lib/index.ts`, and consumers compile the `.svelte` sources out of
`node_modules`. Nothing in `src/lib` produces artifacts, and there is no `dist/`.

## Working against a local checkout

```sh
git clone https://github.com/FacileStudio/muse.git
cd ../your-app
bun add file:../muse
```

Vite treats linked dependencies as external by default. If edits to `../muse` do not show up,
add the package to the SvelteKit app's `optimizeDeps.exclude`, or restart the dev server.

(The `file:` trap above applies to `demo/` specifically, where the target is the *parent* of
`node_modules`. A consumer app in a sibling directory has no such cycle.)

## The `@source` trap

Tailwind v4 scans your source for class names and emits only what it finds. It does **not**
scan `node_modules`. Since every muse component's styling lives in class strings inside
`node_modules/@facile/lib`, Tailwind never sees `bg-fc-component`, `rounded-fc-md`, or any
other `fc-*` utility, and emits none of them.

The result is not a warning or an error. It is a page of correctly structured, entirely
unstyled components — which reads like a broken import and sends people hunting in the wrong
place.

Fix it with one line in the consumer's `app.css`:

```css
@import 'tailwindcss';
@source '../node_modules/@facile/lib/src';
```

The path is relative to the CSS file. From `apps/client/src/app.css` in a suite monorepo that
resolves to `apps/client/node_modules/@facile/lib/src`; if your package manager hoists to the
workspace root, point at the root `node_modules` instead. Verify by inspecting a rendered muse
component — if it has classes but no computed background, the directive is missing or pointing
at the wrong directory.

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
      'font-family':  [{ font: ['fc-body', 'fc-title', 'fc-mono'] }],
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
| Chart | `src/lib/components/charts/` | Renders data as SVG; geometry belongs in `utils/chart.ts`, not the template |
| Motion | `src/lib/components/motion/` | Exists for the animation, not the markup |

The tiers are import paths only; `index.ts` re-exports everything flat.

## Adding a component

1. Create the file in the right tier directory.
2. Type props with `$props()` and a TypeScript type literal. Extend the matching
   `svelte/elements` attribute type (`HTMLButtonAttributes`, `HTMLInputAttributes`, …) and
   spread `...rest` **last** when the component wraps a native element, so the consumer wins.
   Put your own handlers after the spread only when the component stops working without
   them — and leave a comment saying so, as `Modal` and `Dropzone` do.
3. Accept `class: className = ''` and build the final class string in a `$derived` with
   `twMerge(defaults, className)`. `className` goes last. **Import `twMerge` from
   `../../utils/cn.js`, never from `tailwind-merge` directly.**
4. Style with `fc-*` utilities only. No raw hex, no arbitrary pixel values outside the token
   scale. Borders use `border-fc-border`, and container surfaces get **no** border — the
   `bg-fc-component` fill is the separation.
5. Every `<button>` declares `type` — an undeclared button inside a form submits it. Every
   focusable control carries the one ring:
   `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring`.
6. If the component has a semantic colour axis, name it `tone` and use the shared vocabulary
   (`neutral | accent | info | success | warning | danger | owner | admin`, narrowed to the
   subset that means something). Do not invent `muted` or `default` as a synonym for
   `neutral`. Callback props are camelCase `onX`; lowercase `on*` is reserved for native
   handlers arriving through `...rest`.
7. Form controls should read `getFieldContext()` so a wrapping `Field` labels them
   automatically, with an explicit prop always winning.
8. Icons come from `icons.ts`, always the Solar **`linear`** variant, inheriting
   `currentColor` (no tint class). Add a key there rather than inlining an Iconify name.
   `bold-duotone` is reserved for brand marks.
9. Mobile-first: works at 360px, hit targets at least 44px, `h-dvh` rather than `h-screen`.
10. Any animation branches on `prefersReducedMotion()` from `../../utils/motion.js`, or uses
    the `motion-reduce:` variant. Press feedback goes through `use:springPress` from
    `../../utils/press.js` — do not re-inline the curve.
11. Re-export from `src/lib/index.ts` in the matching tier block. A component that is not
    re-exported does not exist.
12. Run `mise run verify`. Then walk the checklist at the end of `CHARTE.md`, and update
    `CHARTE.md` if you changed a token or a documented invariant.

Imports between library files use the `.js` extension (`'../../utils/motion.js'`) because the
package is ESM under bundler resolution.

## The AI skill

`install.sh` registers muse with whichever assistants are on `PATH`. It fetches two files over
HTTPS and copies them — **it does not clone the repo and there is no `lib/` directory**:

```sh
curl -fsSL https://raw.githubusercontent.com/FacileStudio/muse/main/install.sh | bash
```

- It `curl`s `integrations/SKILL.md` and `CHARTE.md` from `main` into a temp dir, failing loudly
  if either download is empty.
- If `claude` is found: writes `~/.claude/skills/muse/SKILL.md` and
  `~/.claude/skills/muse/CHARTE.md`, overwriting both.
- If `codex` is found: writes `~/.codex/muse/CHARTE.md` and injects `SKILL.md` into
  `~/.codex/AGENTS.md` between `<!-- muse:start -->` and `<!-- muse:end -->` markers. Content
  outside the markers is preserved; the marked block is replaced wholesale.
- If neither is found, it prints the re-run instruction and exits 1.

Re-running is the update path — it overwrites unconditionally, so there is no dirty-state
failure mode and nothing to reconcile. Every statement sits inside a function with `main()` as
the last line, so a download truncated mid-flight executes nothing at all.

Edit `integrations/SKILL.md` to change what agents are told — both tools read that one file.
Committing and pushing to `FacileStudio/muse` is what ships it; there is no release step.

## Dependency policy

`gsap` and `tailwind-merge` are the only runtime dependencies. Open a PR before adding a
third — every dependency here lands in every consumer app's bundle. Note in particular that
`iconify-icon` is **not** a dependency: thirteen components render `<iconify-icon>` elements
that stay inert unless the consumer app has registered the custom element itself.

The `gsap` floor is `^3.13.0`, not `^3.12.0`. `WordReveal` imports `gsap/SplitText`, which was
a paid Club GreenSock plugin until 3.13 — on 3.12.x the import does not resolve, and the
failure lands in the consumer's build, not ours.
