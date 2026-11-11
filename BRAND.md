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

# App icons, favicons and link previews

Every suite app gets its tab icon, touch icons, link preview and `<head>` from one generator.
The catalog of apps (name, icon, URL, English title and description) is `scripts/brand/apps.ts`.

```sh
bun scripts/brand/generate.ts <id> <outDir>                 # one app; prints the head block
bun scripts/brand/generate.ts <id> <outDir> --head <file>   # also writes the head block to <file>
bun scripts/brand/generate.ts --all <dir>                   # every app, into <dir>/<id>/, head.html included
```

It writes:

| File | What it is |
|---|---|
| `favicon.svg` | The glyph, no background. `#0a0a0a`, or `#fafafa` under `prefers-color-scheme: dark`. |
| `favicon.ico` | 16, 32 and 48 px, transparent, glyph in `#737373` so it reads on light and dark tabs. |
| `apple-touch-icon.png` | 180 px, `#0a0a0a` glyph at 62% on an opaque `#fafafa` square. |
| `icon-192.png`, `icon-512.png` | The same tile, for the manifest. |
| `og-image.png` | The 1200x630 link preview Discord, Slack and social sites show. |
| `site.webmanifest` | Name, the two icons, `#fafafa` theme and background, `standalone`. |
| head block | The canonical `<head>` block: title, description, icons, theme colours, Open Graph, Twitter. Printed to stdout; written to a file only with `--head <file>`, so it never lands in a public `static/` dir. |

Rules:

- Apps never hand-edit these files. Change the catalog or the generator in muse, regenerate,
  and copy the output into the app's `static/`. Paste the printed head block into `src/app.html`.
- Icons are Solar `bold-duotone` names, checked against `@iconify-json/solar`. An app with its
  own mark (Boutique, sonar, the Facile "F." for the studio site) passes a glyph instead.
- Titles are 3 to 7 words and descriptions 90 to 155 characters, in English. `brand.test.ts`
  fails otherwise.
- The banner text is set in Inter (OFL, `scripts/brand/fonts/`). No system font is read.

muse's own site runs it through `bun site/scripts/favicon.ts`, which also rewrites
`site/src/app.html`.
