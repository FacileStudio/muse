# Migrating to muse v1.0

Written as the breaking changes land, not reconstructed afterwards. Every entry says what
broke, how it shows up, and what to do about it.

Thirteen apps consume muse: Journal, Plume, Capsule, Antenne, Nuage, Vision, Casier, Sablier,
Agenda, Perception, Boutique, Courrier, Jardin. Nine are on `#v0.5.0`, three on `#v0.4.0`
(Journal, Capsule, Perception), and Boutique is the first on `#v0.6.0`.
~~Boutique floats on the default branch with no tag~~ — pinned on 2026-08-09, and note how that
pin landed: changing `package.json` without
regenerating `bun.lock` fails the consumer's Docker build outright, because the client stage
runs `bun install --frozen-lockfile`. The deploy errors and production silently keeps serving
the previous image. **Bump the pin and the lockfile in the same commit.**

Nothing here breaks an app that stays on its current tag. Read this when you bump.

---

## 1. No bundled typeface

**Symptom:** headings and body copy render in the platform sans stack instead of Goga.

**Why:** the shipped faces were the trial cut — 68 codepoints, no accented Latin, no
apostrophe, no colon, no `%`. In a French-language suite every accented character fell back to
Helvetica mid-word, as did every clock time and every percentage. They were also redistributed
under a test licence.

**Do:** delete any local `@font-face` block or `<link rel=preload>` still pointing at Goga —
several apps kept one from before muse shipped the fonts. Nothing else to change; the tokens
still resolve. `src/lib/styles/fonts.test.ts` guards the replacement.

## 2. `Divider` carries no margin

**Symptom:** rules sit tighter than before, or weld to their neighbour.

**Why:** it shipped `my-4`, and **all twenty-four call sites across the suite cancelled it**
with `class="my-0"` — including two inside muse itself. A default nobody wants is not a default.

**Do:** delete every `class="my-0"` on a `Divider` (a no-op now, but it teaches the next
reader the wrong thing). Where a rule now looks welded, the parent is missing a gap — wrap the
group in `<Stack gap="content">`. Two apps re-set the margin instead of cancelling it
(`my-1` in Courrier's `EmailItem`, `my-5` in Agenda's `ManageCalendarModal`); those keep
working, but check they still read right.

## 3. Tailwind's stock palette is gone

**Symptom:** a colour utility silently produces no CSS. The element renders unstyled rather
than wrong, and nothing errors.

**Why:** `tokens.css` resets the `--color-*` namespace, so an off-system colour is impossible
rather than discouraged. `white`, `black`, `transparent` and `current` are kept — they are
theme-neutral primitives, not palette choices.

**Do:** grep for it before bumping.

```sh
grep -rnE '\b(bg|text|border|ring|fill|stroke|from|to|via|outline|divide)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b' src
```

Twelve of the thirteen apps return nothing. **Agenda returns 13**, all beside its parallel
shadcn `ui/` directory — map them onto `fc-*` tokens, or onto the status tones if they were
semantic (`red` → `fc-danger`, `green` → `fc-success`).

## 4. Four motion components are deleted

`Carousel`, `Mosaique`, `Rideau` and `WordReveal` are gone. `PageTransition` and `TextElevate`
stay.

**Who this touches:** only **Jardin**, which uses `WordReveal` three times on its landing page
(`apps/client/src/routes/+page.svelte`). The other three had no consumer anywhere in the suite.

**Do, for Jardin only:** vendor the component before bumping. The last version is at
`git show v0.5.0:src/lib/components/motion/WordReveal.svelte`. It needs `gsap` plus
`gsap/ScrollTrigger` and `gsap/SplitText` as **direct** dependencies — Jardin currently gets
gsap transitively through muse, and that stops being reliable once muse demotes it. Two traps
that come with it, both already solved in the file: the ScrollTrigger must be built inside a
`gsap.context()` and reverted on teardown or it recomputes on every scroll for the life of the
page, and `SplitText` is not collected by the context so it reverts separately. It also scrubs
against `window` by default, so in the Facile shell (`<main>` is the scroller) the consumer must
call `ScrollTrigger.defaults({ scroller })` **before** the component mounts.

**Why:** three of the four had zero consumers — `Mosaique` is a randomised-scatter layout with
rejection sampling, in a suite of project-management and time-tracking tools. `WordReveal` was
the library's only GSAP-plugin consumer, pulling two plugins for one landing page in one app.

## 5. `Section` exists, `SettingsSection` is now its preset

**Symptom:** none. `SettingsSection` keeps its API and its card default.

**Why:** it was always structurally generic and nine repos used it only under `/settings`
because of what it was called, hand-rolling identical markup everywhere else.

**Do:** nothing required. When touching a page, reach for `Section` outside settings — and for
`Page`, `PageHeader`, `Stack` and `Inline` instead of the hand-written shells. See §6.

## 6. The layout tier replaces the hand-written page shell

Not breaking, but it is the reason to bump. Every app hand-wrote its own page column and they
disagreed eight ways — max widths from `fc-md` to `max-w-7xl`, column gaps of 4, 6, 8 and 10,
one page with no gap at all.

**Do:** replace the outer `<div class="mx-auto flex max-w-… flex-col gap-… px-… py-…">` in
each route with `<Page>`, and the hand-rolled title block with `<PageHeader>`. `Page` goes
*inside* the shell's scroll container — the shell keeps the rail, the mobile nav and the single
scroller. Pick `width="xl"` for dashboards, leave the default `lg` for reading pages.

`gap` takes four named rungs: `bound` (4px, two parts of one thing), `tight` (8px, controls
used together), `content` (16px, siblings in a block), `section` (40px, separate topics).

Three apps (Journal, Nuage, Casier) have a local `PageHeader.svelte`, all three different and
all three citing CHARTE §4 in a comment. Delete them.

**A component owns its padding and never its margin** — enforced by
`src/lib/components/no-outer-margin.test.ts`. If you were separating muse components with
`class="mt-4"`, that is the pattern to drop: wrap them in a `Stack`.

## 7. Every component exports a `Props` type

Additive, and the reason the bump is worth doing even if nothing else in this file applies.

**Before:** `types` pointed at source, but each component annotated its props with an anonymous
intersection on the `$props()` destructure. Nothing was importable, so a prop rename in muse
could not fail `svelte-check` in any of the thirteen apps.

**Now:** each component declares `export interface <Name>Props` in `<script module>` and the
barrel re-exports it.

```ts
import type { ButtonProps, SectionProps } from '@facile/muse';

type Props = Omit<ButtonProps, 'variant'> & { intent: 'save' | 'discard' };
```

Three components export a `type` alias rather than an interface, because their props are a
union an interface cannot extend (`NavButton`) or already an `Omit` intersection. Same import
either way.

## 8. `Field`'s snippet parameters work now

**Symptom before:** `{#snippet children({ id, describedBy })}` failed with *"Expected 1 or
more, but got 0"*, so consumers reached for `getFieldContext()` instead — the workaround the
wiki recorded and several apps carry.

**Why:** `FieldProps` intersected `HTMLAttributes<HTMLDivElement>`, which declares its own
`children?: Snippet<[]>`. The intersection of that with `Snippet<[{ id, describedBy }]>` accepts
neither arity. An intersection swallows the contradiction; the `interface extends` form checks
compatibility and reported it immediately.

**Do:** nothing required — `getFieldContext()` still works and stays the right call for a
control muse does not own. For your own markup inside a `Field`, the snippet parameters are now
usable and are the shorter path.

## 9. `ColorPicker` is now the free-choice one; the palette one is `SwatchPicker`

**Symptom:** `import { ColorPicker } from '@facile/muse'` still resolves, still type-checks,
and renders something else — a hex field with an OS picker instead of your six identity
swatches. `colors`, `showLabels`, `size` and `onSelect` are gone from it, so the type check
does fail at the call site. It is a rename, not a silent behaviour swap.

**Why:** the name was on the wrong component. What shipped as `ColorPicker` never picked a
colour — it picked one of six, from a closed palette that is a persisted data contract with
Sablier. Meanwhile the thing everyone reached for `Input` to do, because muse had nothing
else, was picking an *arbitrary* colour. Boutique's back office was asking shop owners to
hand-type a hex into a text box. The obvious name has to belong to the general component, or
every consumer imports the wrong one first and finds out at review.

**Who this touches:** three call sites, all on the identity palette, all a pure rename —
Sablier `apps/client/src/routes/(app)/settings/profile/+page.svelte`, and Agenda's
`CreateCalendarModal.svelte` and `ManageCalendarModal.svelte`.

**Do:**

```sh
grep -rl 'ColorPicker' src | xargs sed -i '' 's/ColorPicker/SwatchPicker/g'
```

Then, and only then, reach for the new `ColorPicker` anywhere you are currently asking a human
to type a hex into an `Input`. Props in [docs/api.md](docs/api.md#colorpicker); the two
components' swatches differ on purpose — `SwatchPicker`'s *are* the input (a `radiogroup`
with roving tabindex), `ColorPicker`'s are shortcuts into a field that accepts anything.

## 10. Binding to a key that does not exist yet freezes the screen

Not a change in this release. A trap this library hands you, which reached production, and
which nothing in the type system will warn you about.

**Symptom:** a spinner that never stops, over a request the network tab shows returning **200**
with the right body. Or a screen stuck mid-update, ignoring clicks. The console has a Svelte
`effect_update_depth_exceeded` in it, and nothing else. It reads exactly like a hung fetch, so
that is where you will look first, and the fetch is fine.

**Why:** most muse controls declare `value = $bindable('')` — a default. Svelte applies a
`$bindable` default by **writing it back into the parent** when the component is created, if
the bound expression is `undefined`. So:

```svelte
{#each rows as row}
  <Input bind:value={draft[row.id]} />   <!-- draft[row.id] does not exist yet -->
{/each}
```

...writes `''` into `draft[row.id]` as each `Input` mounts. If `draft` is `$state` that the
`{#each}` (or anything upstream of it) reads, that write schedules another render, which
recreates the inputs, which write again. Svelte stops the loop at the update-depth limit and
**abandons the flush** — so the DOM keeps whatever it last committed, forever. Every loading
flag set before the flush stays on screen no matter what the API returns.

An empty-string default makes this cheap to hit and hard to see; a non-empty one (`'#000000'`,
`'md'`, `0`) makes it certain, because the value written back is never what the parent had.

**Do:** seed the keys before rendering, and empty them rather than deleting them.

```ts
let draft = $state<Record<string, string>>(
  Object.fromEntries(rows.map((r) => [r.id, '']))   // every key exists up front
);

draft[id] = '';        // yes
delete draft[id];      // no — the next render re-creates the write-back
```

If the shape is dynamic, derive the record from the rows in one place so a row and its key are
created together, and never let a component's mount be the thing that creates a key.

**In muse itself:** new components take an empty `$bindable` default and derive their
"nothing chosen yet" rendering from it, rather than defaulting to a real value. `ColorPicker`
is the worked example — it defaults to `''` and shows the picker black, instead of defaulting
to `'#000000'` and writing black into your record.

## 11. `Checkbox`, `Radio` and `Switch` adopt `Field`'s ids

**Symptom before:** `<Field label="Notify me"><Checkbox /></Field>` type-checked, rendered, and
looked correct — while emitting `<label for="…-control">` pointing at nothing and a checkbox
with no accessible name. `Input`, `Select` and `Textarea` were wired to the field context; the
three controls that wrap themselves in their own `<label>` were not.

**Do:** nothing required, it is a fix. One thing to check while you are there: a control with
its own visible `label` **inside** a `Field` is now labelled twice. In a `SettingsRow` the row
owns the label, so the control takes `aria-label`, never `label` — CHARTE §14 already said so
and it is now the difference between one accessible name and two.

`scripts/smoke.sh` pulls every `<label for>` out of the server-rendered HTML and fails if any
of them points at an id no labelable element carries.

## 12. Smaller corrections

- **`Spinner` under reduced motion slows instead of stopping.** `motion-reduce:animate-none`
  froze it into a static ring — a busy indicator indicating nothing. It now turns once every
  three seconds. `Skeleton` and `StatusDot` still hide outright; their absence reads correctly.
- **`Toaster` moves from `z-50` to `z-60`.** It shared a rung with `MobileNav`, so on a phone
  the toast strip and the bottom bar were tied and resolved by DOM order — the exact collision
  the documented z-scale exists to prevent. If your app pins something at `z-50` expecting to
  sit above toasts, it no longer does.
- **`LineChart`, `BarChart`, `DonutChart`, `Sparkline` and `Toaster` spread `...rest`.** They
  took `class` alone, so `id`, `data-*` and `aria-label` had nowhere to go.

## 13. A button on the same row as a form control takes `size="lg"`

Not a code change — a rule the charter was missing, and one **36 places across the suite**
currently break.

`Input`, `Select`, `Textarea` and `SecretField` are all `h-11` (44px). `Button` defaults to
`h-9` (36px), which is deliberate desktop density and stays. But a default button standing
*beside* one of those controls on a single row sits 8px short, and the row reads as a mistake.

**Do:** grep your `sm:flex-row` and `flex-row` blocks for a `<Button>` sharing a line with a
form control, and give it `size="lg"`. muse's own invite form got this wrong until v1.0.

```svelte
<form class="flex flex-col gap-3 sm:flex-row">
  <Input class="flex-1" />
  <Button size="lg">Send invite</Button>
</form>
```

A button *stacked under* a field keeps the default — the rule is about siblings on one line.
CHARTE §7 now states it beside the touch-target exception it was hiding behind.

## 14. Icons are bundled — no runtime fetch, no custom element

**The change:** muse rendered `<iconify-icon>`, a custom element that fetches its glyph from
`api.iconify.design` on first paint. It now renders an inline `<svg>` from paths frozen into the
package. `icons` and every `icon` prop keep the same shape, so no call site changes.

**Three things stop being your problem:**

- **The registration step is gone.** `if (browser) void import('iconify-icon')` was one of the
  three documented adoption traps, and forgetting it made every icon vanish with no error. You
  can delete it, and drop `iconify-icon` from `package.json`.
- **No external request.** A suite that promises "zéro dépendance cloud" was fetching its
  chevrons from a CDN. It no longer does.
- **No flash.** The element had no intrinsic size and its `width`/`height` attributes did
  nothing until the fetch landed — measured at ~400ms, during which every icon was 0×0 and
  buttons rendered narrow then jumped. An `<svg>` has its box from the first frame, and now
  renders during SSR.

**If you pass a name muse does not carry** — Sablier's transport controls, Agenda's calendar
set — it still works: `Icon` falls back to `<iconify-icon>`, which needs the custom element and
the network. Two ways out, best first:

1. Add the key to muse's `icons` map and re-run `bun run scripts/build-icons.ts`. That is what
   the map is for, and the whole suite gets it.
2. Bundle your own, generated the same way, and register them once before first render:

```ts
import { registerIcons } from '@facile/muse';
import data from './icons-data.json';
registerIcons(data);
```

**Attribution travels with the artwork.** Solar is CC BY 4.0 and Material Design Icons is
Apache 2.0; both are credited in muse's `LICENSE`, and a test fails the build if a bundled
collection is not. If you bundle your own, do the same — the trial typeface this repo shipped
through v0.5.0 is the reason that is a rule rather than a suggestion.

## 15. `SideBar`'s nav column scrolls

**Symptom before:** a rail with more entries than a short viewport could hold was clipped, with
no way to reach the rest. On a phone the gesture chained into the document, so the page moved
behind the menu instead.

**Why:** the rail's root is `overflow-hidden` — it has to be, or the collapse tween shows
content spilling past a shrinking rail — and the column inside it had no scroll of its own.

**Do:** nothing. If you were working around it by capping your `pages` array or overriding the
rail's overflow, you can stop. A sheet or drawer holding a `SideBar` on mobile should still
lock the document while it is open: `overscroll-contain` stops a gesture that starts *inside*
the rail from chaining, but one that starts on the scrim is the host's problem.
