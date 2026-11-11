import type { SuiteApp } from './apps.ts';
import { escapeXml } from './svg.ts';

/** The canonical `<head>` block for an app: title, description, icons, theme colours, Open Graph and Twitter. */
export function headHtml(app: SuiteApp): string {
    const title = escapeXml(`${app.name} · ${app.title}`);
    const description = escapeXml(app.description);
    const image = `${app.url}/og-image.png`;
    return [
        `<title>${title}</title>`,
        `<meta name="description" content="${description}" />`,
        '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
        '<link rel="icon" href="/favicon.ico" sizes="48x48" />',
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
        '<link rel="manifest" href="/site.webmanifest" />',
        '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafafa" />',
        '<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />',
        '<meta property="og:type" content="website" />',
        '<meta property="og:site_name" content="Facile" />',
        '<meta property="og:locale" content="en_US" />',
        `<meta property="og:url" content="${app.url}/" />`,
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:image" content="${image}" />`,
        '<meta property="og:image:width" content="1200" />',
        '<meta property="og:image:height" content="630" />',
        `<meta property="og:image:alt" content="${escapeXml(`${app.name}: ${app.title}`)}" />`,
        '<meta name="twitter:card" content="summary_large_image" />',
        `<meta name="twitter:title" content="${title}" />`,
        `<meta name="twitter:description" content="${description}" />`,
        `<meta name="twitter:image" content="${image}" />`
    ].join('\n') + '\n';
}

/** The web app manifest: name, the 192 and 512 icons, and the light theme colours. */
export function webManifest(app: SuiteApp): string {
    const manifest = {
        name: app.name,
        short_name: app.name,
        description: app.description,
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ],
        theme_color: '#fafafa',
        background_color: '#fafafa',
        display: 'standalone',
        start_url: '/'
    };
    return `${JSON.stringify(manifest, null, 2)}\n`;
}
