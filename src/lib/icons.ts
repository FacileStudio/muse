export const icons = {
  collapse:      'solar:layers-bold-duotone',
  search:        'solar:magnifer-bold-duotone',
  settings:      'solar:settings-bold-duotone',
  edit:          'solar:pen-new-square-bold-duotone',
  remove:        'solar:trash-bin-2-bold-duotone',
  calendar:      'solar:calendar-add-line-bold-duotone',
  home:          'solar:home-2-bold-duotone',
  close:         'solar:close-circle-bold-duotone',
  plus:          'solar:add-circle-bold-duotone',
  notification:  'solar:bell-bold-duotone',
  arrow:         'solar:alt-arrow-right-bold-duotone',
  dashboard:     'solar:qr-code-bold-duotone',
  folder:        'solar:folder-open-bold-duotone',
} as const;

export type IconKey = keyof typeof icons;
