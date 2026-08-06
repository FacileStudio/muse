export const icons = {
  collapse:      'solar:sidebar-minimalistic-linear',
  search:        'solar:magnifer-linear',
  settings:      'solar:settings-linear',
  edit:          'solar:pen-new-square-linear',
  remove:        'solar:trash-bin-2-linear',
  calendar:      'solar:calendar-linear',
  home:          'solar:home-2-linear',
  notification:  'solar:bell-linear',
  dashboard:     'solar:chart-2-linear',
  folder:        'solar:folder-linear',
  usersGroup:    'solar:users-group-rounded-linear',
  userCircle:    'solar:user-circle-linear',
  logout:        'solar:logout-2-linear',
  close:         'mdi:close',
  plus:          'mdi:plus',
  arrow:         'mdi:chevron-right',
  chevronDown:   'mdi:chevron-down',
  chevronUp:     'mdi:chevron-up',
  chevronLeft:   'mdi:chevron-left',
} as const;

export type IconKey = keyof typeof icons;
