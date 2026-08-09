/*
 * The component index is read out of the library at build time, never hand-listed.
 *
 * muse's own README shipped three different component counts at once (48, 51, 58) precisely
 * because they were typed by hand in three places. The barrel is the only thing that knows
 * what is exported, and the `<script module>` interfaces are the only thing that knows what a
 * component takes — so both are parsed rather than transcribed.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '../../src/lib');

export type PropDoc = { name: string; type: string; optional: boolean; doc?: string };
export type ComponentDoc = {
    name: string;
    tier: string;
    file: string;
    extends: string[];
    props: PropDoc[];
    lead?: string;
};

const TIERS: Record<string, string> = {
    layout: 'Mise en page',
    atoms: 'Atomes',
    molecules: 'Molécules',
    organisms: 'Organismes',
    charts: 'Graphiques',
    motion: 'Motion'
};

function exported(): { name: string; path: string }[] {
    const barrel = readFileSync(join(LIB, 'index.ts'), 'utf8');
    const out: { name: string; path: string }[] = [];
    for (const line of barrel.split('\n')) {
        const m = /^export \{ default as (\w+) \} from '\.\/(components\/[^']+)';/.exec(line);
        if (m) out.push({ name: m[1], path: m[2] });
    }
    return out;
}

/* Balanced-brace scan: a prop whose type is an object literal contains semicolons and
   newlines, so splitting the interface body on either loses half of it. */
function interfaceBody(source: string, name: string): { body: string; ext: string[] } | null {
    const decl = new RegExp(`export (?:interface|type) ${name}Props([^{]*)\\{`).exec(source);
    if (!decl) return null;
    const ext = (decl[1].match(/extends ([^{]+)/)?.[1] ?? decl[1].replace('=', ''))
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s && s !== '=');

    let depth = 0;
    let i = decl.index + decl[0].length - 1;
    const start = i + 1;
    for (; i < source.length; i++) {
        if (source[i] === '{') depth++;
        else if (source[i] === '}') {
            depth--;
            if (depth === 0) break;
        }
    }
    return { body: source.slice(start, i), ext };
}

function parseProps(body: string): PropDoc[] {
    const props: PropDoc[] = [];
    let doc: string | undefined;
    let buffer = '';
    let depth = 0;

    for (const raw of body.split('\n')) {
        const line = raw.trim();
        if (!line) continue;
        if (line.startsWith('/**')) {
            doc = line.replace(/^\/\*+\s*/, '').replace(/\s*\*+\/$/, '');
            continue;
        }
        if (line.startsWith('*') || line.startsWith('/*')) continue;

        buffer = buffer ? `${buffer} ${line}` : line;
        for (const ch of line) {
            if ('{(<['.includes(ch)) depth++;
            if ('})>]'.includes(ch)) depth--;
        }
        if (depth > 0) continue;

        const m = /^'?([\w-]+)'?(\?)?:\s*(.+?);?$/.exec(buffer);
        buffer = '';
        if (!m) continue;
        props.push({
            name: m[1],
            optional: Boolean(m[2]),
            type: m[3].replace(/;$/, '').trim(),
            doc
        });
        doc = undefined;
    }
    return props;
}

/* The first sentence of the component's own leading block comment. These comments are the
   most reliable prose in the repo — they were written to explain a decision to the next
   reader, which is exactly what a docs blurb is. */
function lead(source: string): string | undefined {
    const m = /<script lang="ts">[\s\S]*?\/\*\s*\n?([\s\S]*?)\*\//.exec(source);
    if (!m) return undefined;
    const text = m[1]
        .split('\n')
        .map((l) => l.replace(/^\s*\*?\s?/, '').trim())
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    const first = text.split(/(?<=\.)\s/)[0];
    return first && first.length > 25 && first.length < 320 ? first : undefined;
}

export function collect(): ComponentDoc[] {
    return exported()
        .map(({ name, path }) => {
            const file = join(LIB, `${path}`);
            const source = readFileSync(file, 'utf8');
            const parsed = interfaceBody(source, name);
            return {
                name,
                tier: TIERS[path.split('/')[1]] ?? path.split('/')[1],
                file: path,
                extends: parsed?.ext ?? [],
                props: parsed ? parseProps(parsed.body) : [],
                lead: lead(source)
            };
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

if (import.meta.main) {
    const docs = collect();
    mkdirSync(join(HERE, '../src/lib/generated'), { recursive: true });
    writeFileSync(
        join(HERE, '../src/lib/generated/components.json'),
        JSON.stringify(docs, null, 2) + '\n'
    );
    const withProps = docs.filter((d) => d.props.length > 0).length;
    console.log(`${docs.length} components, ${withProps} with parsed props`);
    if (docs.length < 45) throw new Error(`only ${docs.length} components found — the barrel parse broke`);
    if (withProps / docs.length < 0.8) {
        throw new Error(`only ${withProps}/${docs.length} yielded props — the interface parse broke`);
    }
}
