import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'svelte/compiler';

/*
 * The rule this enforces: a component owns its padding and never its margin.
 *
 * Space between two elements is a property of the relationship between them, so it belongs to
 * whatever contains both. A component that reaches outside its own box makes that space
 * unpredictable at every call site — and muse shipped exactly one component that did.
 * `Divider` carried `my-4`, all twenty-four call sites across the suite cancelled it with
 * `class="my-0"`, and the workaround became the documented idiom, which is how agents learned
 * to weld buttons to separators.
 *
 * Prose could not have stopped that; CHARTE §4 already said the right thing and was skipped.
 * A failing test is read by everyone, including the agent that has to make the build pass.
 *
 * `auto` is exempt. `m-auto` and `mx-auto` centre a box inside a parent that already sized it
 * — they do not displace siblings — and `mt-auto` pushes a footer to the bottom of a flex
 * column its parent asked for. Zero is exempt because it is the absence of the thing.
 */

const ROOT = import.meta.dir;
const MARGIN = /^-?m[trblxyse]?-(.+)$/;

function walkFiles(dir: string): string[] {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) return walkFiles(path);
        return path.endsWith('.svelte') ? [path] : [];
    });
}

function stringLiterals(node: unknown, found: string[] = []): string[] {
    if (!node || typeof node !== 'object') return found;
    if (Array.isArray(node)) {
        for (const child of node) stringLiterals(child, found);
        return found;
    }
    const record = node as Record<string, unknown>;
    if (record.type === 'Literal' && typeof record.value === 'string') found.push(record.value);
    if (record.type === 'TemplateLiteral') {
        for (const quasi of record.quasis as { value: { cooked?: string } }[]) {
            if (quasi.value.cooked) found.push(quasi.value.cooked);
        }
    }
    for (const key of Object.keys(record)) {
        if (key === 'type' || key === 'loc') continue;
        stringLiterals(record[key], found);
    }
    return found;
}

/* Roots are the outermost rendered elements. Control flow at the top level is transparent —
   an `{#if}` wrapping two alternative roots still produces a root — so descend through blocks
   and stop at the first thing that renders a box. */
function rootNodes(nodes: unknown[], collected: Record<string, unknown>[] = []) {
    for (const raw of nodes) {
        const node = raw as Record<string, unknown> & { fragment?: { nodes: unknown[] } };
        const type = node.type as string;
        if (type === 'RegularElement' || type === 'Component' || type === 'SvelteElement') {
            collected.push(node);
        } else if (type === 'IfBlock') {
            rootNodes((node.consequent as { nodes: unknown[] }).nodes, collected);
            if (node.alternate) rootNodes((node.alternate as { nodes: unknown[] }).nodes, collected);
        } else if (type === 'EachBlock' || type === 'KeyBlock' || type === 'AwaitBlock') {
            /* The nested fragment is spelled differently per block — EachBlock has `body` plus
               an optional `fallback`, KeyBlock has `fragment`, AwaitBlock has three branches. */
            for (const key of ['body', 'fallback', 'fragment', 'pending', 'then', 'catch']) {
                const branch = node[key] as { nodes?: unknown[] } | undefined;
                if (branch?.nodes) rootNodes(branch.nodes, collected);
            }
        }
    }
    return collected;
}

function classSources(root: Record<string, unknown>, instance: unknown): string[] {
    const attributes = (root.attributes ?? []) as Record<string, unknown>[];
    const attr = attributes.find((a) => a.type === 'Attribute' && a.name === 'class');
    if (!attr || attr.value === true) return [];

    const values = Array.isArray(attr.value) ? attr.value : [attr.value];
    const out: string[] = [];

    for (const raw of values as Record<string, unknown>[]) {
        if (raw.type === 'Text') {
            out.push(raw.data as string);
            continue;
        }
        const expression = raw.expression as Record<string, unknown> | undefined;
        if (!expression) continue;

        /* `class={classes}` is muse's dominant shape, where `classes` is a $derived twMerge
           call in the instance script. Follow the identifier to its declaration rather than
           giving up — otherwise this check would silently pass on nearly every component. */
        if (expression.type === 'Identifier') {
            const name = expression.name as string;
            const declarators = stringLiteralsOfBinding(instance, name);
            out.push(...declarators);
        } else {
            out.push(...stringLiterals(expression));
        }
    }
    return out;
}

function stringLiteralsOfBinding(instance: unknown, name: string): string[] {
    const found: string[] = [];
    const visit = (node: unknown) => {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) return node.forEach(visit);
        const record = node as Record<string, unknown>;
        if (
            record.type === 'VariableDeclarator' &&
            (record.id as Record<string, unknown>)?.name === name
        ) {
            found.push(...stringLiterals(record.init));
        }
        for (const key of Object.keys(record)) {
            if (key === 'type' || key === 'loc') continue;
            visit(record[key]);
        }
    };
    visit(instance);
    return found;
}

function offendingUtilities(classList: string): string[] {
    return classList
        .split(/\s+/)
        .filter(Boolean)
        .map((token) => token.slice(token.lastIndexOf(':') + 1))
        .filter((utility) => {
            const match = MARGIN.exec(utility);
            if (!match) return false;
            const value = match[1];
            return value !== 'auto' && value !== '0' && value !== 'px-0';
        });
}

const files = walkFiles(ROOT);

describe('no component pushes its own siblings around', () => {
    test('no root element carries a margin utility', () => {
        const offences: string[] = [];

        for (const file of files) {
            const source = readFileSync(file, 'utf8');
            const ast = parse(source, { modern: true });
            const roots = rootNodes(ast.fragment.nodes as unknown[]);

            for (const root of roots) {
                for (const classList of classSources(root, ast.instance)) {
                    for (const utility of offendingUtilities(classList)) {
                        offences.push(`${file.slice(ROOT.length + 1)} <${root.name}> ${utility}`);
                    }
                }
            }
        }

        expect(offences).toEqual([]);
    });

    /* Without this the check above passes trivially the day the AST shape changes and every
       class string stops resolving. It asserts the parser is still finding what it reads. */
    test('the check actually resolved class strings for the library', () => {
        const resolved = files.filter((file) => {
            const ast = parse(readFileSync(file, 'utf8'), { modern: true });
            return rootNodes(ast.fragment.nodes as unknown[]).some(
                (root) => classSources(root, ast.instance).length > 0
            );
        });

        expect(files.length).toBeGreaterThan(45);
        expect(resolved.length / files.length).toBeGreaterThan(0.8);
    });
});
