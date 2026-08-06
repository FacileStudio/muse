# Charte graphique — Facile UI

Visual contract for every Facile tool. Agents read this **before** generating any UI.

> Status: **matches the shipped Facile Suite look** (Sablier / Nuage / Casier / Plume /
> Courrier), audited 2026-08-06. Chroma-zero OKLCH everywhere except `--fc-danger`.

---

## 1. Brand

- **Name**: Facile
- **Tone**: clean, technical, quiet — no color noise outside destructive states and
  semantic role pills.
- **Voice in UI copy**: <!-- TODO -->

---

## 2. Color tokens

CSS custom properties. Source of truth: `src/lib/styles/tokens.css`.

| Token               | Light                | Dark                  | Usage                       |
|---------------------|----------------------|------------------------|-----------------------------|
| `--fc-page`/`--fc-bg`| `oklch(1 0 0)`       | `oklch(0.09 0 0)`      | page background             |
| `--fc-surface`       | `oklch(0.97 0 0)`    | `oklch(0.18 0 0)`      | muted fills, hover states   |
| `--fc-component`     | `oklch(0.985 0 0)`   | `oklch(0.13 0 0)`      | cards, sidebar/panel bg     |
| `--fc-fg`             | `oklch(0.145 0 0)`  | `oklch(0.985 0 0)`     | primary text                |
| `--fc-fg-muted`       | `oklch(0.556 0 0)`  | `oklch(0.6 0 0)`       | secondary text               |
| `--fc-accent`         | `oklch(0.145 0 0)`  | `oklch(0.985 0 0)`     | primary action — same as fg, **inverted not tinted** |
| `--fc-accent-fg`      | `oklch(1 0 0)`      | `oklch(0.09 0 0)`      | text on accent               |
| `--fc-border`         | `oklch(0.9 0 0)`    | `oklch(1 0 0 / 10%)`   | dividers, outlines            |
| `--fc-ring`           | `oklch(0.4 0 0)`    | `oklch(0.6 0 0)`       | focus rings                   |
| `--fc-danger`         | `oklch(0.55 0.22 29)`| `oklch(0.65 0.22 29)` | destructive — **the one chroma token** |
| `--fc-success`        | `oklch(0.6 0.16 145)`| `oklch(0.7 0.16 145)` | success / positive             |

**Active nav / selected state is inverted (`bg-fc-accent text-fc-accent-fg`), never
tinted.** Role/status pills are the one place extra chroma is allowed outside danger —
see Badge `owner`/`admin` tones below; they're plain Tailwind `amber-500`/`blue-500`,
not tokens.

---

## 3. Typography

- **Sans**: Goga (`'Goga'`, `Helvetica`, `Arial`, `sans-serif`) — `--font-fc-body`
- **Display**: Goga — `--font-fc-title`. Same family as body; the display/body split is
  intentional-in-name-only so consumers can diverge without touching components.
- **Mono**: <!-- e.g. JetBrains Mono — TODO -->
- Only **Medium (500)** and **Semibold (600)** are bundled. Any other weight synthesizes —
  do not reach for `font-bold`, use `font-semibold`.

Scale — `text-fc-*`, each with a paired line-height:

| Token           | Size          | Line-height | Usage                        |
|-----------------|---------------|-------------|------------------------------|
| `--text-fc-xs`  | `0.75rem` 12px| 1rem        | meta, badges, hints          |
| `--text-fc-sm`  | `0.875rem` 14px| 1.25rem    | **body / UI default** — nav rows, buttons, table cells |
| `--text-fc-md`  | `1rem` 16px   | 1.5rem      | lead paragraphs, inputs      |
| `--text-fc-lg`  | `1.125rem` 18px| 1.75rem    | section headings (h3)        |
| `--text-fc-xl`  | `1.375rem` 22px| 1.75rem    | sidebar brand, h2            |
| `--text-fc-2xl` | `1.75rem` 28px| 2.125rem    | page titles                  |
| `--text-fc-3xl` | `2.25rem` 36px| 2.5rem      | hero / h1                    |

`14px` is the workhorse, matching the suite's `text-sm` default. Headings get
`tracking-tight` (`-0.02em`, applied to `h1`–`h6` in the base layer).

---

## 4. Spacing & layout

4-pt grid. Tokens: `--fc-space-1` = 4px, `--fc-space-2` = 8px, `--fc-space-3` = 12px, `--fc-space-4` = 16px, `--fc-space-6` = 24px, `--fc-space-8` = 32px, `--fc-space-12` = 48px.

Container max-widths:
- mobile: 100%
- `sm` ≥ 640px: 600px
- `md` ≥ 768px: 720px
- `lg` ≥ 1024px: 960px
- `xl` ≥ 1280px: 1200px

---

## 5. Radius & elevation

- `--radius-fc-xs` 4px, `--radius-fc-sm` 6px, `--radius-fc-md` 8px, `--radius-fc-lg` 12px, `--radius-fc-pill`/`--radius-fc-full` 999px
- No shadows beyond `shadow-sm`/`shadow-lg` on floating/overlay surfaces (dropdowns, MobileNav bar). Separation is 1px `--fc-border`, not elevation.

---

## 6. Motion

- Default ease: `power3.inOut` (GSAP)
- Default duration: `0.4s` UI, `1.5s` page transitions
- All motion **must** respect `prefers-reduced-motion: reduce` — fall back to opacity-only or instant.

---

## 7. Responsive rules

- Mobile-first: write the small layout, then enhance with `sm:` / `md:` / `lg:`.
- Min supported width: **360px**.
- Hit targets ≥ **44×44px**.
- No fixed pixel heights for content areas; use `min-h-*` instead.
- Test at: 360, 414, 768, 1024, 1440.

---

## 8. Icons

- **Pack**: [Solar](https://icon-sets.iconify.design/solar/) via Iconify (`<iconify-icon>`)
- **Style**: **`linear`** — always `solar:*-linear` for UI chrome. This matches the shipped
  suite (Sablier, Nuage, Plume all use `solar:chart-2-linear`, `solar:folder-linear`, …).
  Reserve `bold-duotone` for **brand marks only** (an app's own logo glyph), never nav or
  action icons.
- **Color**: inherit `currentColor`. Do not tint icons with their own class — let the parent's
  `text-fc-fg-muted` / `text-fc-accent-fg` cascade, so inverted active states flip the icon too.
- **Size**: `width="16"` inline, `width="18"` nav rows, `width="24"` brand mark. Always pass
  `height` alongside `width` and add `class="block"` — `<iconify-icon>` is inline by default
  and its baseline descender knocks icon/label pairs out of vertical alignment.
- **Exception — plus, close, and chevrons (left/right/up/down)**: never Solar for these.
  Use [MDI](https://icon-sets.iconify.design/mdi/) instead — `mdi:plus`, `mdi:close`,
  `mdi:chevron-left/right/up/down`. Solar's plus/close/arrow glyphs read muddy at small
  sizes; MDI's are a single clean stroke.

Example:
```svelte
<iconify-icon icon="solar:settings-linear" width="18" height="18" class="block shrink-0"></iconify-icon>
```

Never default to Lucide or other packs without an explicit request.

### Icon library — `src/lib/icons.ts`

Import via `import { icons } from '@facile/lib'`.

| Key | Icon | Key | Icon |
|-----|------|-----|------|
| `icons.home` | `solar:home-2-linear` | `icons.settings` | `solar:settings-linear` |
| `icons.dashboard` | `solar:chart-2-linear` | `icons.edit` | `solar:pen-new-square-linear` |
| `icons.folder` | `solar:folder-linear` | `icons.remove` | `solar:trash-bin-2-linear` |
| `icons.search` | `solar:magnifer-linear` | `icons.calendar` | `solar:calendar-linear` |
| `icons.collapse` | `solar:sidebar-minimalistic-linear` | `icons.notification` | `solar:bell-linear` |
| `icons.usersGroup` | `solar:users-group-rounded-linear` | `icons.userCircle` | `solar:user-circle-linear` |
| `icons.logout` | `solar:logout-2-linear` | | |
| `icons.plus` | `mdi:plus` | `icons.close` | `mdi:close` |
| `icons.arrow` | `mdi:chevron-right` | `icons.chevronDown` | `mdi:chevron-down` |
| `icons.chevronUp` | `mdi:chevron-up` | `icons.chevronLeft` | `mdi:chevron-left` |

---

## 9. Accessibility

- Color contrast ≥ WCAG AA (4.5:1 body, 3:1 large text).
- Focus ring visible — `:focus-visible` outline using `--fc-accent`.
- All interactive elements reachable by keyboard.
- Iconify icons must have `aria-label` when standalone.

---

## 9. Navigation components

### NavBar

Collapsible vertical nav sidebar. Built on `Component` (inherits `bg-fc-component rounded-fc-md`). Manages its own collapsed state via `$bindable`.

```svelte
<NavBar
  icon="lucide:layout-dashboard"
  title="Facile"
  bind:collapsed
  showSearch
  pages={[
    { label: 'Home',     href: '/',        icon: 'lucide:home',     active: true },
    { label: 'Settings', href: '/settings', icon: 'lucide:settings' }
  ]}
  user={{ name: 'Gian', avatar: '/pfp.jpg' }}
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | — | Iconify icon for the header |
| `title` | `string` | `''` | App / section name |
| `pages` | `Page[]` | `[]` | Nav links. Each: `{ label, href, icon?, active? }` |
| `user` | `User` | — | `{ name, avatar? }` — shown in the footer button |
| `collapsed` | `boolean` | `false` | Bindable. Collapses to `77px` (`--width-fc-nav-collapsed`), labels hidden |
| `showSearch` | `boolean` | `false` | Renders a search NavButton with ⌘K hint |
| `class` | `string` | — | Passed through `twMerge` |

---

**Width tokens**: `--width-fc-nav-collapsed: 77px` / `--width-fc-nav-expanded: 220px`. GSAP animates between these numeric equivalents on collapse toggle (`duration: 0.5, delay: 0.1, ease: power2.inOut`).

**The `icon` prop is the brand mark — it is the one icon that stays `bold-duotone.`**
Everything else in the sidebar (nav rows, search, collapse, the footer settings gear) is
`solar:*-linear`. Pass `solar:<glyph>-bold-duotone` at `width="24"`; the duotone weight is
what makes the app's identity read against a column of hairline chrome icons.

### NavButton

The atomic button unit used inside NavBar. Also standalone for custom nav UIs.

```svelte
<!-- As a link -->
<NavButton href="/dashboard" icon="lucide:home" label="Home" active />

<!-- As a button with custom snippets -->
<NavButton>
  {#snippet children()}
    <Avatar name="Gian" size="sm" />
    <span>Gian</span>
  {/snippet}
  {#snippet right()}
    <iconify-icon icon="lucide:settings" width="14" />
  {/snippet}
</NavButton>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | Renders as `<a>` when provided |
| `icon` | `string` | — | Iconify icon (left) |
| `label` | `string` | — | Text label (hidden when `collapsed`) |
| `active` | `boolean` | `false` | Accent highlight |
| `collapsed` | `boolean` | `false` | Hides label and right snippet |
| `class` | `string` | — | Passed through `twMerge` |
| `children` | `Snippet` | — | Overrides the entire left side |
| `right` | `Snippet` | — | Right-side content (hidden when collapsed) |

**Style invariants**: `px-3 py-3 w-full`, `gap-2`, `rounded-fc-sm`, `overflow-hidden`, icon `width="20"` (no color class — inherits `currentColor`), label via `TextElevate` at `text-fc-sm`. No border. Inactive: `text-fc-fg-muted`, `hover:bg-fc-surface hover:text-fc-fg`. Active: **inverted**, `bg-fc-accent text-fc-accent-fg font-medium` — never a tinted wash.

**Press animation**: scale `0.94` in `0.08s power2.in`, then `elastic.out(1, 0.4)` back to `1` in `0.5s`. Implemented as a `use:springPress` Svelte action.

### SpaceSwitcher

Dropdown to switch between a personal context and a list of team spaces. Ported from
Sablier's `SpaceSwitcher.svelte`, kept framework-agnostic (no `$app/navigation`, no
backend types — consumer wires selection via `onSelect`).

```svelte
<SpaceSwitcher
  spaces={[{ id: '1', name: 'Acme' }]}
  activeId={currentSpaceId}
  onSelect={(id) => setActiveSpaceId(id)}
  manageHref="/spaces"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spaces` | `{ id, name }[]` | `[]` | Team spaces to list |
| `activeId` | `string \| null` | `null` | Currently selected space, `null` = personal |
| `onSelect` | `(id: string \| null) => void` | — | Called on selection |
| `personalLabel` | `string` | `'Personal'` | Label for the personal/no-space option |
| `manageHref` | `string` | — | If set, renders a footer link to manage spaces |
| `manageLabel` | `string` | `'Manage spaces'` | Footer link text |
| `class` | `string` | — | Passed through `twMerge` |

Wired into `SideBar` via its own `spaces` / `activeSpaceId` / `onSpaceSelect` /
`manageSpacesHref` props — renders between the header and search/nav when `spaces` is
non-empty and the sidebar isn't collapsed.

### MobileNav

Floating glass pill bar for `< md` viewports, fixed to the bottom, safe-area aware.
Ported from Sablier's `MobileNav.svelte`.

```svelte
<MobileNav
  items={[{ href: '/dashboard', label: 'Dashboard', icon: 'solar:chart-2-linear', active: true }]}
  user={{ name: 'Gian', avatar: '/pfp.jpg' }}
  profileHref="/settings"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `{ href, label, icon, active? }[]` | `[]` | Nav destinations, icon-only |
| `user` | `{ name, avatar? }` | — | Shown as a trailing avatar pill |
| `profileHref` | `string` | — | Renders the avatar pill as a link |
| `profileActive` | `boolean` | `false` | Inverts the avatar pill like an active item |
| `class` | `string` | — | Passed through `twMerge` |

Style: `rounded-fc-pill border border-fc-border/40 bg-fc-bg/55 backdrop-blur-2xl
backdrop-saturate-150 shadow-lg`, active item inverted (`bg-fc-accent text-fc-accent-fg`).
Hidden at `md:` and above — pair with `SideBar` for desktop.

### Badge role tones

`owner` and `admin` tones render the colored role pills used across Nuage/Courrier/Plume
member lists — the one deliberate exception to the chroma-zero rule, matching real
member-role UI: `owner` → `bg-amber-500/10 text-amber-600`, `admin` → `bg-blue-500/10
text-blue-600`. Use `neutral` for a plain `member` role.

---

## 10. Component checklist

Before exporting a component:
- [ ] Uses tokens, no raw hex / px outside tokens
- [ ] Mobile-first layout, tested at 360px
- [ ] Keyboard + screen-reader accessible
- [ ] Respects `prefers-reduced-motion`
- [ ] Props documented with JSDoc
- [ ] Re-exported from `src/lib/index.ts`
