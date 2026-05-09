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

## 8. Accessibility

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
| `collapsed` | `boolean` | `false` | Bindable. Collapses to `w-16`, labels hidden |
| `showSearch` | `boolean` | `false` | Renders a search NavButton with ⌘K hint |
| `class` | `string` | — | Passed through `twMerge` |

---

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

**Style invariants**: `h-10 w-full`, `border: 1px solid rgba(36,36,36,0.07)`, `hover:bg-[rgba(36,36,36,0.07)]`.

---

## 10. Component checklist

Before exporting a component:
- [ ] Uses tokens, no raw hex / px outside tokens
- [ ] Mobile-first layout, tested at 360px
- [ ] Keyboard + screen-reader accessible
- [ ] Respects `prefers-reduced-motion`
- [ ] Props documented with JSDoc
- [ ] Re-exported from `src/lib/index.ts`
