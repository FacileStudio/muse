import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const chips: Record<string, string[]> = {
    'atoms/Badge.svelte': ['whitespace-nowrap', 'max-w-full', 'truncate'],
    'atoms/StatusDot.svelte': ['whitespace-nowrap', 'truncate'],
    'molecules/Tabs.svelte': ['whitespace-nowrap']
};

for (const [file, classes] of Object.entries(chips)) {
    test(`${file} keeps its text on one line`, () => {
        const source = readFileSync(join(import.meta.dir, file), 'utf8');
        for (const name of classes) expect(source).toContain(name);
    });
}
