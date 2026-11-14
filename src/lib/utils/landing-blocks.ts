import { icons } from '../icons.js';
import type { MuseKey } from '../i18n/messages/index.js';
import { isSafeHref } from './href.js';

/** The heading style every landing section shares, overridable through each block's `headingClass`. */
export const LANDING_HEADING = 'font-fc-title text-fc-2xl font-bold tracking-tight text-fc-fg sm:text-fc-3xl';

/** One connected suite app in `WorksWith`. */
export interface WorksWithApp {
    /** The app's name, such as "Agenda". */
    name: string;
    /** An iconify name. Suite marks are Solar `bold-duotone` and must be registered with `registerIcons`. */
    icon: string;
    /** What the two apps do together, in one short line. */
    line: string;
    /** The app's page. An unsafe value renders the row without a link. */
    href?: string;
}

/** One feature in `FeatureSplit`. */
export interface FeatureItem {
    icon: string;
    title: string;
    text?: string;
}

/** The developer resources `ForDevelopers` knows a default icon and title for. */
export type DeveloperKind = 'cli' | 'api' | 'mcp' | 'source';

/** One row of `ForDevelopers`. `kind` supplies the icon and the title; `icon` and `title` override them. */
export interface DeveloperRow {
    kind?: DeveloperKind;
    icon?: string;
    title?: string;
    text?: string;
    /** The docs, the repository or the install page. An unsafe value renders no link. */
    href?: string;
    /** A shell command to show with a copy button, such as an install one-liner. */
    command?: string;
}

/** A developer row with its icon, title and link settled. `title` is a message key when `fromKey` is true. */
export interface ResolvedDeveloperRow {
    icon: string;
    title: string;
    fromKey: boolean;
    text?: string;
    href: string | null;
    command?: string;
}

const KINDS: Readonly<Record<DeveloperKind, { icon: string; title: MuseKey }>> = {
    cli: { icon: icons.code, title: 'developers.cli' },
    api: { icon: icons.server, title: 'developers.api' },
    mcp: { icon: icons.plug, title: 'developers.mcp' },
    source: { icon: icons.github, title: 'developers.source' }
};

/** Settles each row: the kind's icon and title unless overridden, an unsafe href dropped, rows with no title skipped. */
export function developerRows(rows: readonly DeveloperRow[]): ResolvedDeveloperRow[] {
    return rows.flatMap((row) => {
        const kind = row.kind ? KINDS[row.kind] : undefined;
        const title = row.title ?? kind?.title;
        if (!title) return [];
        return [
            {
                icon: row.icon ?? kind?.icon ?? icons.code,
                title,
                fromKey: row.title === undefined,
                text: row.text,
                href: isSafeHref(row.href) ? row.href : null,
                command: row.command?.trim() || undefined
            }
        ];
    });
}

/** The apps with an unsafe href turned into no link, so a bad value never becomes a live `javascript:` row. */
export function worksWithApps(apps: readonly WorksWithApp[]): (WorksWithApp & { href: string | undefined })[] {
    return apps.map((app) => ({ ...app, href: isSafeHref(app.href) ? app.href : undefined }));
}
