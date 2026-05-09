# Charte graphique — Facile UI

Visual contract for every Facile tool. Agents read this **before** generating any UI.

> Status: **draft skeleton — awaiting fuller Facile specs**.
> Until tokens below are filled with real values, agents must ask before picking colors, fonts, or radii.

---

## 1. Brand

- **Name**: Facile
- **Tone**: <!-- e.g. clean, technical, friendly — TODO -->
- **Voice in UI copy**: <!-- TODO -->

---

## 2. Color tokens

CSS custom properties. Source of truth: `src/lib/styles/tokens.css`.

| Token              | Light          | Dark           | Usage                       |
|--------------------|----------------|----------------|-----------------------------|
| `--fc-bg`          | `#ffffff` *    | `#0b0b0c` *    | page background             |
| `--fc-surface`     | TODO           | TODO           | cards, panels               |
| `--fc-fg`          | TODO           | TODO           | primary text                |
| `--fc-fg-muted`    | TODO           | TODO           | secondary text              |
| `--fc-accent`      | TODO           | TODO           | primary action / brand      |
| `--fc-accent-fg`   | TODO           | TODO           | text on accent              |
| `--fc-border`      | TODO           | TODO           | dividers, outlines          |
| `--fc-danger`      | TODO           | TODO           | destructive                 |
| `--fc-success`     | TODO           | TODO           | success / positive          |

\* placeholder until gian provides palette.

---

## 3. Typography

- **Sans**: Helvetica (`Helvetica Neue`, `Helvetica`, `Arial`, `sans-serif`)
- **Display**: Goga
- **Mono**: <!-- e.g. JetBrains Mono — TODO -->

Scale (mobile → desktop, fluid):

| Token           | Mobile  | Desktop | Usage         |
|-----------------|---------|---------|---------------|
| `--fc-text-xs`  | 12px    | 12px    | meta, labels  |
| `--fc-text-sm`  | 14px    | 14px    | body small    |
| `--fc-text-md`  | 16px    | 16px    | body          |
| `--fc-text-lg`  | 18px    | 20px    | lead          |
| `--fc-text-xl`  | 22px    | 28px    | h3            |
| `--fc-text-2xl` | 28px    | 36px    | h2            |
| `--fc-text-3xl` | 34px    | 48px    | h1            |

Line-height: `1.2` headings, `1.5` body.

Usage:
- Titles and headings use **Goga**
- Body copy, labels, and UI chrome use **Helvetica**

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

- `--fc-radius-sm` 6px, `--fc-radius-md` 12px, `--fc-radius-lg` 20px, `--fc-radius-pill` 999px
- Shadows: TODO

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
- **Style**: `bold-duotone` — always use the `solar:*-bold-duotone` variant unless explicitly overridden
- **Color**: `text-fc-fg/66` (`rgba(36,36,36,0.66)`) on all UI chrome icons
- **Size**: `width="16"` for inline / nav icons, `width="20"` for standalone actions

Example:
```svelte
<iconify-icon icon="solar:settings-bold-duotone" width="16" class="text-fc-fg/66"></iconify-icon>
```

Never default to Lucide or other packs without an explicit request.

### Icon library — `src/lib/icons.ts`

Import via `import { icons } from '@facile/lib'`.

| Key | Icon |
|-----|------|
| `icons.home` | `solar:home-2-bold-duotone` |
| `icons.dashboard` | `solar:qr-code-bold-duotone` |
| `icons.folder` | `solar:folder-open-bold-duotone` |
| `icons.search` | `solar:magnifer-bold-duotone` |
| `icons.collapse` | `solar:layers-bold-duotone` |
| `icons.settings` | `solar:settings-bold-duotone` |
| `icons.edit` | `solar:pen-new-square-bold-duotone` |
| `icons.remove` | `solar:trash-bin-2-bold-duotone` |
| `icons.calendar` | `solar:calendar-add-line-bold-duotone` |
| `icons.notification` | `solar:bell-bold-duotone` |
| `icons.plus` | `solar:add-circle-bold-duotone` |
| `icons.close` | `solar:close-circle-bold-duotone` |
| `icons.arrow` | `solar:alt-arrow-right-bold-duotone` |

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

**Style invariants**: `px-3 py-3 w-full`, `gap-2`, `rounded-fc-md`, `overflow-hidden`, icon `width="20"`, label via `TextElevate` at `text-fc-sm`, `border border-fc-fg/7`, `hover:bg-fc-fg/7`, active `bg-fc-fg/7`.

**Press animation**: scale `0.94` in `0.08s power2.in`, then `elastic.out(1, 0.4)` back to `1` in `0.5s`. Implemented as a `use:springPress` Svelte action.

---

## 10. Component checklist

Before exporting a component:
- [ ] Uses tokens, no raw hex / px outside tokens
- [ ] Mobile-first layout, tested at 360px
- [ ] Keyboard + screen-reader accessible
- [ ] Respects `prefers-reduced-motion`
- [ ] Props documented with JSDoc
- [ ] Re-exported from `src/lib/index.ts`
