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
    'fc-danger',
    'fc-danger-fg',
    'fc-success',
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

export const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'font-size': [{ text: sizes }],
            'text-color': [{ text: colors }],
            'bg-color': [{ bg: colors }],
            'border-color': [{ border: colors }],
            rounded: [{ rounded: radii }]
        }
    }
});

export const cn = twMerge;
