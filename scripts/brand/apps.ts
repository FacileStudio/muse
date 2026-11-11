import { BOUTIQUE_GLYPH, FACILE_GLYPH, SONAR_GLYPH, type Glyph } from './glyphs.ts';

/** A Solar icon name such as `solar:cloud-bold-duotone`, or an app's own glyph. */
export type AppIcon = string | Glyph;

/** One app of the Facile suite, as its favicon, manifest and link preview describe it. */
export interface SuiteApp {
    id: string;
    name: string;
    icon: AppIcon;
    url: string;
    title: string;
    description: string;
}

/** Every app of the suite. The one source for brand assets: apps never hand-edit the generated files. */
export const APPS: SuiteApp[] = [
    {
        id: 'agenda', name: 'Agenda', icon: 'solar:calendar-add-bold-duotone', url: 'https://agenda.facile.studio',
        title: 'The shared studio calendar',
        description: 'Appointments, deadlines and team availability in one calendar. Native CalDAV, no Google account needed.'
    },
    {
        id: 'antenne', name: 'Antenne', icon: 'solar:translation-2-bold-duotone', url: 'https://antenne.facile.studio',
        title: 'Alerts and the suite event bus',
        description: 'Watches your providers, routes every alert to the right place and keeps the Facile apps in sync.'
    },
    {
        id: 'ardoise', name: 'Ardoise', icon: 'solar:bill-list-bold-duotone', url: 'https://ardoise.facile.studio',
        title: 'Invoice, get paid, move on',
        description: 'Quotes that become invoices in one click, Stripe payments, automatic reminders and PDF receipts.'
    },
    {
        id: 'boite', name: 'Boîte', icon: 'solar:box-minimalistic-bold-duotone', url: 'https://boite.facile.studio',
        title: 'Packages and build artifacts',
        description: 'Hosts your private packages, Docker images and binary artifacts on your own server, next to your code.'
    },
    {
        id: 'boutique', name: 'Boutique', icon: BOUTIQUE_GLYPH, url: 'https://boutique.facile.studio',
        title: 'The base for client shops',
        description: 'Self-hosted shop base for client stores: a SvelteKit storefront, Stripe Checkout and weight-based shipping.'
    },
    {
        id: 'bulle', name: 'Bulle', icon: 'solar:smile-circle-bold-duotone', url: 'https://bulle.facile.studio',
        title: 'An AI companion in its own VM',
        description: 'A full engineering agent in a persistent microVM. Talk to it in Matrix chat and watch it work.'
    },
    {
        id: 'capsule', name: 'Capsule', icon: 'solar:pill-bold-duotone', url: 'https://capsule.facile.studio',
        title: 'Share a secret that self-destructs',
        description: 'Encrypted end to end in the browser, so the server never sees the content. You choose when it expires.'
    },
    {
        id: 'casier', name: 'Casier', icon: 'solar:key-minimalistic-square-bold-duotone',
        url: 'https://casier.facile.studio',
        title: 'A secrets vault for your team',
        description: 'AES-256-GCM encryption, secrets injected into your shell, a version history and an audit log.'
    },
    {
        id: 'courrier', name: 'Courrier', icon: 'solar:letter-opened-bold-duotone', url: 'https://courrier.facile.studio',
        title: 'Your email, on your server',
        description: 'Native IMAP and SMTP, several accounts in one place, and a calm inbox without ads or distractions.'
    },
    {
        id: 'docs', name: 'Docs', icon: 'solar:documents-bold-duotone', url: 'https://docs.facile.studio',
        title: 'Documents written together',
        description: 'A tree of pages per space, real-time co-editing, search and PDF export. Agents read and write them over MCP.'
    },
    {
        id: 'feuilles', name: 'Feuilles', icon: 'solar:table-minimalistic-bold-duotone',
        url: 'https://feuilles.facile.studio',
        title: 'The collaborative spreadsheet',
        description: 'Spreadsheets on the IronCalc engine, with live co-editing and xlsx import and export. Agents read them over MCP.'
    },
    {
        id: 'fusible', name: 'Fusible', icon: 'solar:cpu-bolt-bold-duotone', url: 'https://fusible.facile.studio',
        title: 'Boards, firmware and enclosures, verified',
        description: 'Electrical and physical linting, generated Rust firmware pins, 3D parts in code and fabrication files.'
    },
    {
        id: 'glouton', name: 'Glouton', icon: 'solar:magnet-wave-bold-duotone', url: 'https://glouton.facile.studio',
        title: 'Find new clients while you sleep',
        description: 'Crawls the web, detects the technical stack of each site and qualifies leads for the studio.'
    },
    {
        id: 'journal', name: 'Journal', icon: 'solar:notebook-bold-duotone', url: 'https://journal.facile.studio',
        title: 'Central logs for your infrastructure',
        description: 'Collects Docker logs, searches them instantly, spots errors and sends an alert before your users notice.'
    },
    {
        id: 'muse', name: 'muse', icon: 'solar:pallete-2-bold-duotone', url: 'https://muse.facile.studio',
        title: 'The Facile design system',
        description: 'The Svelte 5 component library behind the Facile Suite: tokens, primitives and the charter every app uses.'
    },
    {
        id: 'mycelium', name: 'Mycelium', icon: 'solar:structure-bold-duotone', url: 'https://mycelium.facile.studio',
        title: 'One brain for your coding agents',
        description: 'One store of memory, rules and skills for every AI coding agent, synced across all your machines.'
    },
    {
        id: 'nuage', name: 'Nuage', icon: 'solar:cloud-bold-duotone', url: 'https://nuage.facile.studio',
        title: 'File storage for the studio',
        description: 'The studio drive, connected to every tool through an S3-compatible API. Share files with no middleman.'
    },
    {
        id: 'opus', name: 'Opus', icon: 'solar:slider-vertical-minimalistic-bold-duotone',
        url: 'https://opus.facile.studio',
        title: 'Project management that stays fast',
        description: 'Kanban boards, linked tasks and instant search. Nothing you do not need, nothing that slows you down.'
    },
    {
        id: 'pastille', name: 'Pastille', icon: 'solar:circle-dot-bold-duotone', url: 'https://pastille.facile.studio',
        title: 'An open voice beacon, 38 mm wide',
        description: 'Open BOHS-01 hardware with duplex 16 kHz audio, a round IPS screen and Rust Embassy firmware.'
    },
    {
        id: 'perception', name: 'Perception', icon: 'solar:eye-scan-bold-duotone',
        url: 'https://perception.facile.studio',
        title: 'The context brain for operations',
        description: 'Ingests events from across the suite, keeps a business memory and answers operational questions in plain words.'
    },
    {
        id: 'place', name: 'Place', icon: 'solar:cup-hot-bold-duotone', url: 'https://place.facile.studio',
        title: 'The Facile community forum',
        description: 'A web forum linked to Discord. Ask questions, follow the announcements and talk with the Facile team.'
    },
    {
        id: 'plume', name: 'Plume', icon: 'solar:pen-new-square-bold-duotone', url: 'https://plume.facile.studio',
        title: 'E-signatures without the bloat',
        description: 'Upload a PDF, place the signature fields and send the link to your client. Simple and legally binding.'
    },
    {
        id: 'prisme', name: 'Prisme', icon: 'solar:chat-round-bold-duotone', url: 'https://prisme.facile.studio',
        title: 'Team chat on Matrix',
        description: 'A channel per project, encrypted calls and Bulle AI teammates you can mention. No subscription.'
    },
    {
        id: 'registre', name: 'Registre', icon: 'solar:key-square-bold-duotone', url: 'https://sso.facile.studio',
        title: 'One account for the whole suite',
        description: 'Standard OpenID Connect sign-in with one session shared across every Facile app. Sign in once.'
    },
    {
        id: 'sablier', name: 'Sablier', icon: 'solar:hourglass-bold-duotone', url: 'https://sablier.facile.studio',
        title: 'Billable hours, tracked in one click',
        description: 'One click to start, one click to stop. Time split by project, with sessions shared live with the team.'
    },
    {
        id: 'scribe', name: 'Scribe', icon: 'solar:microphone-2-bold-duotone', url: 'https://scribe.facile.studio',
        title: 'Meeting transcripts and minutes',
        description: 'Records your meetings, transcribes them locally in real time and writes the minutes for you.'
    },
    {
        id: 'sonar', name: 'sonar', icon: SONAR_GLYPH, url: 'https://sonar.facile.studio',
        title: 'Multi-engine web search',
        description: 'Runs one query across several search APIs, your SearXNG instances and scrape fallbacks, then merges the results.'
    },
    {
        id: 'sonde', name: 'Sonde', icon: 'solar:radar-bold-duotone', url: 'https://sonde.facile.studio',
        title: 'Uptime monitoring and status pages',
        description: 'Heartbeats, multi-region probes and a public status page, with an alert as soon as a service goes down.'
    },
    {
        id: 'suite', name: 'Facile Suite', icon: 'solar:widget-5-bold-duotone', url: 'https://suite.facile.studio',
        title: 'Every Facile tool in one place',
        description: 'Tools that talk to each other on your own server: time, projects, invoices and monitoring behind one login.'
    },
    {
        id: 'toile', name: 'Toile', icon: 'solar:tablet-bold-duotone', url: 'https://toile.facile.studio',
        title: 'An infinite shared whiteboard',
        description: 'Sticky notes, shapes, arrows and ink on one infinite board, drawn together with your team in real time.'
    },
    {
        id: 'vision', name: 'Vision', icon: 'solar:panorama-bold-duotone', url: 'https://vision.facile.studio',
        title: 'Web analytics that respects visitors',
        description: 'A lightweight script, no cookies and real-time numbers. GDPR compliant by design, hosted on your server.'
    },
    {
        id: 'vitrine', name: 'Facile Studio', icon: FACILE_GLYPH, url: 'https://facile.studio',
        title: 'Web design and engineering studio',
        description: 'Showcase sites, custom web apps, art direction and sovereign hosting, from the studio behind the Facile Suite.'
    }
];
