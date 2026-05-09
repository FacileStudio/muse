export const icons = {
  collapse:  'solar:layers-bold-duotone',
  search:    'solar:magnifer-bold-duotone',
  settings:  'solar:settings-bold-duotone',
  edit:      'solar:pen-new-square-bold-duotone',
  remove:    'solar:trash-bin-2-bold-duotone',
  calendar:  'solar:calendar-add-line-bold-duotone',
} as const;

export type IconKey = keyof typeof icons;
