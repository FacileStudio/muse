import { icons } from '@facile/muse';

/*
 * Icons come from muse's map, never as a raw iconify string. `solar:palette-linear` looked
 * right and does not exist — the real name carries Solar's own typo, `solar:pallete-2-linear`.
 * A hardcoded name that misses the bundle falls through to the network fallback and renders
 * nothing, which is precisely why the map exists.
 *
 * The information architecture, in one place, because it is the argument.
 *
 * Components come fourth, not first. A design system whose front door is a component list
 * teaches people to shop for widgets; the two sections above exist because the recurring
 * failure in this suite was never "which component" but "how does a page hold together" —
 * eight different page containers, nine settings shells, and buttons welded to separators.
 */
export type NavLink = { href: string; label: string; icon?: string; blurb?: string };
export type NavGroup = { title: string; intent: string; links: NavLink[] };

export const NAV: NavGroup[] = [
    {
        title: 'Commencer',
        intent: 'Ce que muse est, et ce qu’il n’est pas.',
        links: [
            { href: '/', label: 'Introduction', icon: icons.home },
            { href: '/commencer/installer', label: 'Installer', icon: icons.download },
            { href: '/commencer/agents', label: 'Pour les agents', icon: icons.code }
        ]
    },
    {
        title: 'Principes',
        intent: 'Les décisions qui rejettent quelque chose.',
        links: [{ href: '/principes', label: 'Principes', icon: icons.compass }]
    },
    {
        title: 'Fondations',
        intent: 'Le vocabulaire : ce avec quoi une page est faite.',
        links: [
            { href: '/fondations/espacement', label: 'Espacement & rythme', icon: icons.ruler },
            { href: '/fondations/couleur', label: 'Couleur', icon: icons.palette },
            { href: '/fondations/typographie', label: 'Typographie', icon: icons.text },
            { href: '/fondations/etats', label: 'États', icon: icons.refresh }
        ]
    },
    {
        title: 'Structure d’app',
        intent: 'La grammaire : comment une page tient debout.',
        links: [
            { href: '/structure/anatomie', label: 'Anatomie d’une app', icon: icons.widget },
            { href: '/archetypes/tableau-de-bord', label: 'Archétype : tableau de bord', icon: icons.dashboard },
            { href: '/archetypes/index', label: 'Archétype : index', icon: icons.folder },
            { href: '/archetypes/detail', label: 'Archétype : détail', icon: icons.eye },
            { href: '/archetypes/formulaire', label: 'Archétype : formulaire', icon: icons.edit },
            { href: '/archetypes/auth', label: 'Archétype : authentification', icon: icons.key },
            { href: '/structure/reglages', label: 'Archétype : réglages', icon: icons.settings }
        ]
    },
    {
        title: 'Composants',
        intent: 'La référence.',
        links: [{ href: '/composants', label: 'Tous les composants', icon: icons.layers }]
    }
];

export const FLAT: NavLink[] = NAV.flatMap((g) => g.links);

/* Flattened for `SideBar`, which takes one array and prints a heading when `group` changes. */
export const RAIL = NAV.flatMap((g) =>
    g.links.map((l) => ({ ...l, group: g.title }))
);
