import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'svelte/compiler';

/*
 * The rule: a surface never sits on a surface.
 *
 * `bg-fc-surface` is translucent, so two of them stacked read as a third, brighter step that
 * nothing in the palette names. The fill belongs to the leaf (a field, a row, a card of text),
 * and whatever holds several of them stays bare: a list is rows with a gap, not a card of rows.
 * `surface-hover` inside a surface is the one allowed step, and `surface-solid` is the base of
 * things that float, so neither counts here.
 */

const REPO = join(import.meta.dir, '../../..');
const SCANNED = ['src/lib/components', 'demo/src', 'site/src/lib/examples'];

const ALWAYS = new Set(['Card', 'StatCard', 'Input', 'Select', 'Textarea', 'ColorPicker', 'SecretField', 'Dropzone', 'ListItem', 'MediaCard', 'OptionCards', 'ToggleGroup']);

type Node = Record<string, unknown>;

function walkFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walkFiles(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

function attribute(node: Node, name: string): Node | undefined {
    return ((node.attributes ?? []) as Node[]).find((a) => a.type === 'Attribute' && a.name === name);
}

function staticValue(attr: Node | undefined): string | true | undefined {
    if (!attr) return undefined;
    if (attr.value === true) return true;
    const parts = (Array.isArray(attr.value) ? attr.value : [attr.value]) as Node[];
    return parts.map((p) => (p.type === 'Text' ? (p.data as string) : '')).join('');
}

function literals(node: unknown, found: string[] = []): string[] {
    if (!node || typeof node !== 'object') return found;
    if (Array.isArray(node)) {
        node.forEach((n) => literals(n, found));
        return found;
    }
    const record = node as Node;
    if (record.type === 'Literal' && typeof record.value === 'string') found.push(record.value);
    for (const key of Object.keys(record)) if (key !== 'loc') literals(record[key], found);
    return found;
}

function classText(node: Node, instance: unknown): string {
    const attr = attribute(node, 'class');
    if (!attr || attr.value === true) return '';
    const parts = (Array.isArray(attr.value) ? attr.value : [attr.value]) as Node[];
    return parts
        .map((p) => {
            if (p.type === 'Text') return p.data as string;
            const expression = p.expression as Node;
            if (expression?.type !== 'Identifier') return literals(expression).join(' ');
            // follow `class={classes}` to its $derived declaration
            const found: string[] = [];
            const visit = (n: unknown) => {
                if (!n || typeof n !== 'object') return;
                if (Array.isArray(n)) return n.forEach(visit);
                const r = n as Node;
                if (r.type === 'VariableDeclarator' && (r.id as Node)?.name === expression.name) found.push(...literals(r.init));
                for (const key of Object.keys(r)) if (key !== 'loc') visit(r[key]);
            };
            visit(instance);
            return found.join(' ');
        })
        .join(' ');
}

/* Only the resting fill counts: `hover:bg-fc-surface` is a state, not a layer. */
const hasSurfaceClass = (classes: string) => classes.split(/\s+/).includes('bg-fc-surface');

function isSurface(node: Node, instance: unknown): boolean {
    const name = node.name as string;
    if (node.type === 'Component') {
        if (ALWAYS.has(name)) return true;
        if (name === 'Section') return staticValue(attribute(node, 'card')) !== undefined;
        if (name === 'Button') return staticValue(attribute(node, 'variant')) === 'outline';
        if (name === 'IconButton') return [undefined, 'default'].includes(staticValue(attribute(node, 'variant')) as string);
        return false;
    }
    return node.type === 'RegularElement' && hasSurfaceClass(classText(node, instance));
}

const CHILDREN = ['fragment', 'nodes', 'body', 'consequent', 'alternate', 'fallback', 'pending', 'then', 'catch'];

function offences(nodes: unknown, instance: unknown, file: string, under: string | null, out: string[]) {
    if (!nodes || typeof nodes !== 'object') return;
    if (Array.isArray(nodes)) return nodes.forEach((n) => offences(n, instance, file, under, out));
    const node = nodes as Node;
    let next = under;
    if (node.type === 'Component' || node.type === 'RegularElement') {
        if (isSurface(node, instance)) {
            const line = (node.start as number) ?? 0;
            if (under) out.push(`${file}@${line} <${node.name as string}> inside <${under}>`);
            next = node.name as string;
        }
    }
    for (const key of CHILDREN) if (key in node) offences(node[key], instance, file, next, out);
}

describe('no surface sits on a surface', () => {
    test('no surfaced element is nested in another', () => {
        const found: string[] = [];
        for (const dir of SCANNED) {
            for (const path of walkFiles(join(REPO, dir))) {
                const ast = parse(readFileSync(path, 'utf8'), { modern: true });
                offences(ast.fragment, ast.instance, relative(REPO, path), null, found);
            }
        }
        expect(found).toEqual([]);
    });

    test('the walker sees nesting at all', () => {
        const ast = parse('<Card><div><Input /></div></Card>', { modern: true });
        const found: string[] = [];
        offences(ast.fragment, ast.instance, 'probe', null, found);
        expect(found.length).toBe(1);
    });
});
