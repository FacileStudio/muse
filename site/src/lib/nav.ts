/*
 * The information architecture, in one place, because it is the argument.
 *
 * Components come fourth, not first. A design system whose front door is a component list
 * teaches people to shop for widgets; the two sections above exist because the recurring
 * failure in this suite was never "which component" but "how does a page hold together" —
 * eight different page containers, nine settings shells, and buttons welded to separators.
 */
export type NavLink = { href: string; label: string; blurb?: string };
export type NavGroup = { title: string; intent: string; links: NavLink[] };

export const NAV: NavGroup[] = [
    {
        title: 'Commencer',
        intent: 'Ce que muse est, et ce qu’il n’est pas.',
        links: [
            { href: '/', label: 'Introduction' },
            { href: '/commencer/installer', label: 'Installer' },
            { href: '/commencer/agents', label: 'Pour les agents' }
        ]
    },
    {
        title: 'Principes',
        intent: 'Les décisions qui rejettent quelque chose.',
        links: [{ href: '/principes', label: 'Principes' }]
    },
    {
        title: 'Fondations',
        intent: 'Le vocabulaire : ce avec quoi une page est faite.',
        links: [
            { href: '/fondations/espacement', label: 'Espacement & rythme' },
            { href: '/fondations/couleur', label: 'Couleur' },
            { href: '/fondations/typographie', label: 'Typographie' },
            { href: '/fondations/etats', label: 'États' }
        ]
    },
    {
        title: 'Structure d’app',
        intent: 'La grammaire : comment une page tient debout.',
        links: [
            { href: '/structure/anatomie', label: 'Anatomie d’une app Facile' },
            { href: '/structure/reglages', label: 'Archétype : réglages' }
        ]
    },
    {
        title: 'Composants',
        intent: 'La référence.',
        links: [{ href: '/composants', label: 'Tous les composants' }]
    }
];

export const FLAT: NavLink[] = NAV.flatMap((g) => g.links);
