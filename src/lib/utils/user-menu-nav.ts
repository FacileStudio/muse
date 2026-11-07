import { LOCALES, isLocale, type Locale } from '../i18n/locale.js';
import type { UserMenuRow, UserMenuView } from './user-menu.js';

/** The rows a keyboard can land on: everything but the spacing gap. */
export function actionable(rows: UserMenuRow[]): UserMenuRow[] {
    return rows.filter((row) => row.kind !== 'gap');
}

/** Where focus starts when a view opens: the checked choice, else the first row. */
export function startIndex(rows: UserMenuRow[]): number {
    return Math.max(0, actionable(rows).findIndex((row) => row.checked));
}

/** The view change a key asks for. Enter and Space on a row are its click, so only the arrows and Escape are keys here. */
export function drillKey(view: UserMenuView, kind: UserMenuRow['kind'] | undefined, key: string): 'enter' | 'leave' | null {
    if (view === 'root') return kind === 'submenu' && key === 'ArrowRight' ? 'enter' : null;
    return key === 'ArrowLeft' || key === 'Escape' ? 'leave' : null;
}

/** The locales a menu offers: `wanted` without duplicates or unknown values, or all of `LOCALES` when nothing valid is left. */
export function offeredLocales(wanted?: readonly string[] | null): readonly Locale[] {
    const kept = [...new Set((wanted ?? []).filter(isLocale))];
    return kept.length > 0 ? kept : LOCALES;
}
