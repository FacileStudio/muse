/*
 * Every example is a real `.svelte` file, imported twice: once as a component to render, once
 * with `?raw` to show. One file, two imports, and the source on the page cannot drift from the
 * source that ran — which is the whole failure mode a docs site has to design against.
 *
 * Both globs are eager so the pages prerender; a lazy import would resolve after the HTML is
 * already written.
 */
import type { Component } from 'svelte';

const modules = import.meta.glob<{ default: Component }>('./**/*.svelte', { eager: true });
const sources = import.meta.glob<string>('./**/*.svelte', {
    eager: true,
    query: '?raw',
    import: 'default'
});

export type Example = { id: string; component: Component; source: string };

/* `./Button/variants.svelte` → owner `Button`, id `variants`. */
function parse(path: string): { owner: string; id: string } | null {
    const m = /^\.\/([^/]+)\/([^/]+)\.svelte$/.exec(path);
    return m ? { owner: m[1], id: m[2] } : null;
}

const byOwner = new Map<string, Example[]>();

for (const [path, mod] of Object.entries(modules)) {
    const parsed = parse(path);
    if (!parsed) continue;
    const list = byOwner.get(parsed.owner) ?? [];
    list.push({
        id: parsed.id,
        component: mod.default,
        /* The leading comment in an example is guidance for the reader of the docs, not of the
           file, so it is rendered as prose above the code rather than inside it. */
        source: (sources[path] ?? '').trim()
    });
    byOwner.set(parsed.owner, list);
}

for (const list of byOwner.values()) {
    /* `default` first when present, then alphabetical — a component page should open on the
       plain case before the variants. */
    list.sort((a, b) => (a.id === 'default' ? -1 : b.id === 'default' ? 1 : a.id.localeCompare(b.id)));
}

export function examplesFor(owner: string): Example[] {
    return byOwner.get(owner) ?? [];
}

export function owners(): string[] {
    return [...byOwner.keys()].sort();
}
