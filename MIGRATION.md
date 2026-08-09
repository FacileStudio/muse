# Migrating to muse v1.0

Written as the breaking changes land, not reconstructed afterwards. Every entry says what
broke, how it shows up, and what to do about it.

Thirteen apps consume muse: Journal, Plume, Capsule, Antenne, Nuage, Vision, Casier, Sablier,
Agenda, Perception, Boutique, Courrier, Jardin. Nine are on `#v0.5.0`, three on `#v0.4.0`
(Journal, Capsule, Perception), and Boutique floats on the default branch with no tag at all —
fix that pin first, whatever else you do.

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
