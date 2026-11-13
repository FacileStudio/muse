import { plugin } from 'bun';
import { compile, compileModule } from 'svelte/compiler';

const typescript = new Bun.Transpiler({ loader: 'ts' });

plugin({
    name: 'svelte-ssr',
    setup(build) {
        build.onLoad({ filter: /\.svelte$/ }, async ({ path }) => {
            const source = await Bun.file(path).text();
            const { js } = compile(source, { filename: path, generate: 'server' });
            return { contents: js.code, loader: 'js' };
        });
        build.onLoad({ filter: /\.svelte\.(ts|js)$/ }, async ({ path }) => {
            const source = await Bun.file(path).text();
            const plain = path.endsWith('.ts') ? typescript.transformSync(source) : source;
            const { js } = compileModule(plain, { filename: path, generate: 'server' });
            return { contents: js.code, loader: 'js' };
        });
    },
});
