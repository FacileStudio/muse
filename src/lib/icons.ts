export const icons = {
  collapse:      'iconoir:sidebar-collapse',
  search:        'iconoir:search',
  settings:      'iconoir:settings',
  edit:          'iconoir:edit-pencil',
  remove:        'iconoir:trash',
  calendar:      'iconoir:calendar',
  home:          'iconoir:home-simple',
  notification:  'iconoir:bell',
  dashboard:     'iconoir:stats-report',
  folder:        'iconoir:folder',
  usersGroup:    'iconoir:group',
  userCircle:    'iconoir:user-circle',
  logout:        'iconoir:log-out',
  warning:       'iconoir:warning-triangle',
  error:         'iconoir:xmark-circle',
  info:          'iconoir:info-circle',
  upload:        'iconoir:cloud-upload',
  clock:         'iconoir:clock',
  refresh:       'iconoir:refresh',
  eye:           'iconoir:eye',
  eyeClosed:     'iconoir:eye-closed',
  copy:          'iconoir:copy',
  check:         'iconoir:check-circle',
  key:           'iconoir:key',
  revoke:        'iconoir:prohibition',
  shield:        'iconoir:shield-check',
  palette:       'iconoir:palette',
  sun:           'iconoir:sun-light',
  moon:          'iconoir:half-moon',
  monitor:       'iconoir:computer',
  globe:         'iconoir:globe',
  plug:          'iconoir:ev-plug',
  bolt:          'iconoir:flash',
  server:        'iconoir:server',
  code:          'iconoir:code',
  history:       'iconoir:clock-rotate-right',
  card:          'iconoir:credit-card',
  download:      'iconoir:download',
  filter:        'iconoir:filter',
  mail:          'iconoir:mail',
  close:         'iconoir:xmark',
  plus:          'iconoir:plus',
  minus:         'iconoir:minus',
  arrow:         'iconoir:nav-arrow-right',
  chevronDown:   'iconoir:nav-arrow-down',
  chevronUp:     'iconoir:nav-arrow-up',
  chevronLeft:   'iconoir:nav-arrow-left',
  paletteMark:   'iconoir:palette',
  compass:       'iconoir:compass',
  ruler:         'iconoir:ruler',
  text:          'iconoir:text',
  widget:        'iconoir:view-grid',
  layers:        'iconoir:multiple-pages-empty',
} as const;

export type IconKey = keyof typeof icons;

/*
 * Icons a consuming app bundles for itself.
 *
 * muse ships the paths for every name above, so nothing it draws touches the network. An app
 * that needs a glyph muse does not carry — Sablier's transport controls, Agenda's calendar
 * set — bundles its own rather than falling back to api.iconify.design:
 *
 *   import { registerIcons } from '@facile/muse';
 *   import data from './icons-data.json';   // generated the same way muse generates its own
 *   registerIcons(data);
 *
 * Call it once, before the first render. Adding the key upstream to `icons` is still the
 * better answer when the glyph is one the whole suite will want.
 */
export type IconData = { body: string; width: number; height: number };

export const extraIcons: Record<string, IconData> = {};

export function registerIcons(data: Record<string, IconData>): void {
    Object.assign(extraIcons, data);
}
