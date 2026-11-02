import { extendTailwindMerge } from 'tailwind-merge';

const sizes = ['fc-title', 'fc-subtitle', 'fc-lead', 'fc-p', 'fc-subtext'];
const colors = [
    'fc-bg',
    'fc-surface',
    'fc-surface-hover',
    'fc-surface-solid',
    'fc-ink',
    'fc-muted',
    'fc-faint',
    'fc-brand',
    'fc-brand-bg',
    'fc-scrim',
    'fc-danger',
    'fc-success',
    'fc-info',
    'fc-warning',
    'fc-owner',
    'fc-admin'
];
const radii = ['fc'];

/* Nav widths are on no scale tailwind-merge knows, so without these a consumer's `w-64`
   and the sidebar's `w-fc-nav-expanded` both survive the merge. */
const navWidths = ['fc-nav-collapsed', 'fc-nav-expanded', 'fc-nav-content', 'fc-nav-item'];

export const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-family': [{ font: ['fc-body', 'fc-title', 'fc-mono'] }],
            'font-size': [{ text: sizes }],
            'text-color': [{ text: colors }],
            'bg-color': [{ bg: colors }],
            'border-color': [{ border: colors }],
            rounded: [{ rounded: radii }],
            w: [{ w: navWidths }],
            size: [{ size: navWidths }]
        }
    }
});

export const cn = twMerge;
