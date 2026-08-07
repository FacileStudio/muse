import { USER_COLORS } from '@facile/lib';

export type Role = 'owner' | 'admin' | 'member';

export type Member = { id: string; name: string; email: string; role: Role };

export type Workspace = {
    id: string;
    name: string;
    description: string;
    color: string;
    projects: number;
    hours: number;
    members: Member[];
};

export const currentUser = { name: 'Camille', email: 'camille@facile.studio' };

/*
 * One vocabulary for one concept. The pages used to disagree — `member` here, `neutral`
 * there — so the same person rendered as "Member" on one screen and "neutral" on the next.
 * `neutral` is a Badge tone, not a role; the mapping below is where the two meet.
 */
export const roleLabel: Record<Role, string> = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member'
};

export const roleTone: Record<Role, 'owner' | 'admin' | 'neutral'> = {
    owner: 'owner',
    admin: 'admin',
    member: 'neutral'
};

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const owner = (): Member => ({
    id: 'm1',
    name: currentUser.name,
    email: currentUser.email,
    role: 'owner'
});

/*
 * A factory rather than a constant: the pages wrap this in `$state` and push to it, and a
 * shared array would carry one page's invitations into the next one you open.
 */
export const createWorkspaces = (): Workspace[] => [
    {
        id: 'acme',
        name: 'Acme Studio',
        description: 'Client work, invoicing and shared assets.',
        color: USER_COLORS[0],
        projects: 3,
        hours: 390,
        members: [
            owner(),
            { id: 'm2', name: 'Noah', email: 'noah@facile.studio', role: 'admin' },
            { id: 'm3', name: 'Mazouz', email: 'mazouz@facile.studio', role: 'member' },
            { id: 'm4', name: 'Yann', email: 'yann@facile.studio', role: 'member' }
        ]
    },
    {
        id: 'nova',
        name: 'Nova Collective',
        description: 'Side projects and experiments.',
        color: USER_COLORS[5],
        projects: 2,
        hours: 167,
        members: [owner()]
    },
    {
        id: 'hedra',
        name: 'Hedra',
        description: 'Brand identity retainer.',
        color: USER_COLORS[2],
        projects: 0,
        hours: 0,
        members: []
    }
];

export const spaces = createWorkspaces().map(({ id, name }) => ({ id, name }));

export const newMember = (id: string, email: string, role: Role): Member => ({
    id,
    name: email.split('@')[0] ?? email,
    email,
    role
});
