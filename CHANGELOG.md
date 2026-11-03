# Changelog

## v0.8.0 (2026-11-03)

### Changed

- No decorative borders. `Topbar`, `Modal`, `Drawer` (panel and footer), `Toast`,
  `SpaceSwitcher` (trigger, dropdown and its footer), `SettingsRow`, `ProfileCard` meta rows
  and dividers, `UploadProgress` rows and `OptionCards` now separate by fill, shadow and
  spacing. Borders stay on form controls, `Dropzone`, `Table` row rules, `Divider` and focus
  rings.
- Surface tokens: `fc-component` 0.975 light / 0.16 dark, `fc-surface` 0.95 / 0.21, so cards
  stay distinct from the page without an outline (1.08:1 light, 1.07:1 dark, up from 1.04:1).
- `fc-fg-muted` 0.5 light / 0.64 dark, and the light `danger`, `success`, `info`, `warning`
  and `owner` tokens 0.50–0.54, so muted and tinted text keep 4.5:1 on the new surfaces.
- CHARTE §5, the docs site and the agent skill state the rule; `no-decorative-border.test.ts`
  fails the build on a decorative border in any component.

See MIGRATION.md §18 for what consuming apps should change.
