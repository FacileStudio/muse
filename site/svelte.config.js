import { fileURLToPath } from 'node:url';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';

/*
 * One highlighter instance for the whole build. Creating one per fence loads the grammars and
 * both themes again each time, which turns a 30-page build into a minute of nothing.
 */
const highlighter = await createHighlighter({
    themes: ['github-light-default', 'github-dark-default'],
    langs: ['svelte', 'typescript', 'javascript', 'css', 'html', 'bash', 'json', 'markdown']
});

/** @type {import('@sveltejs/kit').Config} */
export default {
    extensions: ['.svelte', '.md'],
    preprocess: [
        mdsvex({
            extensions: ['.md'],
            /* Resolved absolutely: mdsvex resolves a layout path relative to each markdown
               file, so a project-root-relative one only works for pages at the root. */
            layout: {
                _: fileURLToPath(new URL('./src/lib/prose/Layout.svelte', import.meta.url))
            },
            highlight: {
                highlighter(code, lang) {
                    const html = highlighter.codeToHtml(code, {
                        lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
                        themes: { light: 'github-light-default', dark: 'github-dark-default' },
                        defaultColor: false
                    });
                    /*
                     * Two rewrites, both load-bearing. mdsvex hands the result straight to the
                     * Svelte compiler, so a stray brace or backtick in a code sample is read as
                     * an expression. And shiki marks the `<pre>` focusable, which is right — a
                     * scrollable region has to be reachable by keyboard — but a bare
                     * `tabindex="0"` on a non-interactive element is what Svelte's a11y check
                     * flags. The fix is the role that justifies it, not dropping the tabindex.
                     */
                    const labelled = html.replace(
                        '<pre class="shiki',
                        '<pre role="region" aria-label="Extrait de code" class="shiki'
                    );
                    const escaped = labelled.replace(/[{}`]/g, (c) => `{'${c}'}`);
                    return `<div class="fc-code">${escaped}</div>`;
                }
            }
        })
    ],
    kit: {
        adapter: adapter({ fallback: undefined, precompress: false, strict: true }),
        /*
         * Traefik in front of nginx serves `/a/index.html` for `/a/` but not for `/a`, so
         * pages are emitted as directories. Getting this wrong 404s every deep link in
         * production while `vite preview` stays perfectly green.
         */
        prerender: {
            entries: ['*'],
            /*
             * A rendered example is app markup, so it links where an app links — `/projets`,
             * `/equipe`, `/exports/temps.csv`. Those are not documentation links and this site
             * does not serve them; failing the build on one would mean writing examples that
             * link nowhere, which is worse documentation.
             *
             * The rule is the target, not the referrer: a link to a **docs** path that 404s is
             * a genuine broken link and still fails. Anything outside the docs namespace is an
             * example's own route and is let through.
             */
            handleHttpError: ({ path, message }) => {
                const docs = [
                    '/commencer',
                    '/principes',
                    '/fondations',
                    '/structure',
                    '/composants',
                    '/archetypes'
                ];
                if (docs.some((d) => path.startsWith(d))) throw new Error(message);
            },
            /* Same reasoning for `href="#"` in an example: a placeholder anchor is markup a
               reader copies, not a promise that the id exists on this page. */
            handleMissingId: 'ignore'
        },
        paths: { relative: false }
    }
    /*
     * No global `runes: true`. mdsvex emits `<Layout {...$$props}>` for every markdown page,
     * which is legacy syntax and hard-errors under a forced runes mode. Every `.svelte` file
     * here uses a rune and is inferred as runes anyway; the generated `.md` wrappers stay
     * legacy, and the two coexist per-file.
     */
};
