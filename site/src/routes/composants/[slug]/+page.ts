import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';
import docs from '$lib/generated/components.json';

/* Prerender one page per exported component, from the same generated index the gallery uses. */
export const entries: EntryGenerator = () => docs.map((d) => ({ slug: d.name.toLowerCase() }));

export const load: PageLoad = ({ params }) => {
    const doc = docs.find((d) => d.name.toLowerCase() === params.slug);
    if (!doc) error(404, `Aucun composant nommé ${params.slug}`);
    return { doc };
};
