import { extendTailwindMerge } from 'tailwind-merge';

const sizes = ['fc-xs', 'fc-sm', 'fc-md', 'fc-lg', 'fc-xl', 'fc-2xl', 'fc-3xl'];
const colors = [
    'fc-page',
    'fc-bg',
    'fc-surface',
    'fc-component',
    'fc-fg',
    'fc-fg-muted',
    'fc-accent',
    'fc-accent-fg',
    'fc-border',
    'fc-ring',
    'fc-scrim',
    'fc-danger',
    'fc-danger-fg',
    'fc-success',
    'fc-info',
    'fc-warning',
    'fc-owner',
    'fc-admin',
    'fc-chart-1',
    'fc-chart-2',
    'fc-chart-3',
    'fc-chart-4',
    'fc-chart-5',
    'fc-chart-6'
];
const radii = ['fc-xs', 'fc-sm', 'fc-md', 'fc-lg', 'fc-pill', 'fc-full'];

/* Container and nav tokens are not on any scale tailwind-merge knows, so without these it
   cannot tell that a consumer's `max-w-4xl` conflicts with `Page`'s `max-w-fc-lg` — both
   survive the merge and the cascade decides, which is the silent-override failure this whole
   module exists to prevent. */
const containers = ['fc-sm', 'fc-md', 'fc-lg', 'fc-xl'];
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
            'max-w': [{ 'max-w': containers }],
            w: [{ w: navWidths }],
            size: [{ size: navWidths }]
        }
    }
});

export const cn = twMerge;
