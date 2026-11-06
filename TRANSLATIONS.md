# Translations

muse ships its own strings in four catalogs under `src/lib/i18n/messages/`. English (`en.ts`)
is the source: it defines the keys, and TypeScript makes `fr.ts`, `es.ts` and `de.ts` carry
every one. `src/lib/i18n/i18n.test.ts` also fails when a translation drops or renames a
`{placeholder}`.

## Review status

| Locale | Status |
|---|---|
| en | Source |
| fr | Reviewed (native) |
| es | **Needs native review.** Machine-quality draft by an agent, 2026-11-04 |
| de | **Needs native review.** Machine-quality draft by an agent, 2026-11-04 |

Points to check first in es and de:

- `legal.*`: the names of the legal documents must match the titles Registre publishes.
  German uses "Impressum" for the legal notice; check whether Facile publishes "AGB" for the
  terms of sale instead of "Verkaufsbedingungen".
- `spaceSwitcher.*`: "espacio" and "Bereich" for a Facile space. Use whatever the apps say.
- `planLimit.*`: "plan" (es) and "Tarif" (de) for the subscription tier.
- `pricing.*`, `feature.*`, `download.*` (v0.11.0): plan and feature wording on the pricing
  cards, including "Teilnehmende" (de) and "buzón de correo" (es).
- Tone: es uses the informal "tú" ("Crea tu cuenta"), de uses the formal "Sie". Confirm both.

## Adding a string

1. Add the key to `en.ts`.
2. Add it to `fr.ts`, `es.ts` and `de.ts`. The type check fails until you do.
3. Read it in the component with `getI18n().t('key')`, and let a prop override it.
4. If es or de is not native-checked, add the key to the list above.
