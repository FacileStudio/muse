# Sign in with Facile: brand rules

The button that starts a Facile sign-in is `SignInWithFacile`. Every app uses it as shipped.
These rules keep it recognisable across the suite and on any third-party site that adds it.

## Use the component

- Render `SignInWithFacile` from `@facile/muse`. Do not rebuild it from `Button` and an icon.
- Point `href` at the app's porte route, `/auth/oidc` by default. The component already sets
  `rel="external"` so SvelteKit does a full page load.
- One sign-in button per screen. Put it above any other way in.

## Label

Use the canonical label. muse picks it from the session locale:

| Locale | Label |
|---|---|
| fr | Se connecter avec Facile |
| en | Sign in with Facile |
| es | Iniciar sesión con Facile |
| de | Mit Facile anmelden |

Do not shorten it to "Facile", "Log in" or "Continue". The `label` prop exists for a legal or
accessibility requirement, not for copywriting.

## Size

- Minimum height 40px (`size="sm"`). Use `md` (44px) on touch screens and `lg` (48px) on a
  sign-in page.
- Never scale the mark on its own. It is 16, 18 or 20px with the size.
- The label never wraps or truncates. If it does not fit, the container is too narrow: give it
  at least 240px, or use `fullWidth` in a column.

## Clear space

Keep at least 8px around the button, free of other controls, text and borders. Inside a stack,
a `gap-2` or larger satisfies it.

## Colour

- The button is the inverted accent pair, `bg-fc-accent text-fc-accent-fg`. It reads black on
  light and white on dark, from the tokens.
- Never recolour the button or the mark. No brand tints, gradients, outlines or shadows.
- Never place it on a busy image. Use `bg-fc-page`, `bg-fc-bg` or `bg-fc-component` behind it.

## Mark

- The Facile mark is the "F." glyph, drawn in `currentColor`.
- Do not rotate, stretch, outline or animate it, and do not use it without the label.
- To show Facile's logo elsewhere, use the file in Registre (`static/logos/facile.svg`), not a
  copy cut out of this button.

## States

- Loading: pass `loading`, or let the first click set it. The spinner replaces the mark and the
  label reads "Signing in…" in the locale. A second click does nothing.
- Focus: the suite's one focus ring. Never remove it.
