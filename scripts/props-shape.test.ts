import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/*
 * Every component declares its props as a named, exported interface in `<script module>`.
 *
 * Two things depend on this and neither is optional. The docs site extracts prop tables with
 * ts-morph, and ts-morph reads `ast.module` only — a type annotated inline on the `$props()`
 * destructure is invisible to it, so a component that skips this ships an empty table. And
 * consumers get no prop types at all today: `types` points at source, but an anonymous
 * intersection on a destructuring pattern is not importable, so a prop rename in muse cannot
 * fail `svelte-check` in any of the thirteen apps.
 *
 * The interface is named `<Component>Props` and exported, which also makes it importable —
 * `import type { ButtonProps } from '@facile/muse'` is a thing a consumer should be able to do.
 */

const COMPONENTS = join(import.meta.dir, '../src/lib/components');

function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walk(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

/* Charts and motion take `class` only by design and have no interface to export yet; they are
   listed rather than pattern-matched so adding one to the list is a deliberate act. */
const EXEMPT = new Set(['ChartTable.svelte']);

const files = walk(COMPONENTS).filter((f) => !EXEMPT.has(f.split('/').pop()!));

describe('props are declared where a docs generator can read them', () => {
    const offenders: { file: string; reason: string }[] = [];

    for (const file of files) {
        const source = readFileSync(file, 'utf8');
        const name = file.split('/').pop()!.replace('.svelte', '');
        const short = file.slice(COMPONENTS.length + 1);

        if (!source.includes('$props()')) continue;

        const module = /<script\s+module[^>]*>([\s\S]*?)<\/script>/.exec(source);
        if (!module) {
            offenders.push({ file: short, reason: 'no <script module> block' });
            continue;
        }
        /* An alias is allowed where an interface cannot go: `NavButton` is
           `Own & (HTMLAnchorAttributes | HTMLButtonAttributes)`, and an interface cannot
           extend a union. ts-morph reads an exported alias as happily as an interface. */
        const declared =
            module[1].includes(`export interface ${name}Props`) ||
            module[1].includes(`export type ${name}Props`);
        if (!declared) {
            offenders.push({ file: short, reason: `no exported ${name}Props` });
            continue;
        }
        if (!new RegExp(`\\}:\\s*${name}Props\\s*=\\s*\\$props\\(\\)`).test(source)) {
            offenders.push({ file: short, reason: `$props() is not annotated ${name}Props` });
        }
    }

    test('every component exports a named Props interface from <script module>', () => {
        expect(offenders).toEqual([]);
    });
});
