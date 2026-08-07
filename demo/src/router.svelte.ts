export const HOME = '#/dashboard';

/*
 * The current hash lives in a module rather than travelling down as a prop. Only Settings
 * reads it — to pick its section out of `#/settings/<id>` — and a `route` prop on every page
 * just so one of them can have it is a prop the other pages have to declare and ignore.
 */
export const router = $state({ hash: window.location.hash || HOME });

export const segment = (hash: string, index: number) => hash.split('/')[index] ?? '';
