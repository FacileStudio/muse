import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

test('IdeaCard outputs are not keyed by href: two outputs may share a link', () => {
    const source = readFileSync(join(import.meta.dir, 'IdeaCard.svelte'), 'utf8');
    const each = /\{#each outputs as [^}]*\}/.exec(source)?.[0] ?? '';
    expect(each).not.toBe('');
    expect(each).not.toContain('output.href');
    expect(each).not.toContain('output.label');
});
