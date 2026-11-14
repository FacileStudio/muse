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
        title: 'Your team\'s week, in one place.',
        description: 'Meetings, deadlines and team availability, synced to your phone and your computer. Free to start.'
    },
    {
        id: 'antenne', name: 'Antenne', icon: 'solar:translation-2-bold-duotone', url: 'https://antenne.facile.studio',
        title: 'Alerts and the suite event bus',
        description: 'Watches your providers, routes every alert to the right place and keeps the Facile apps in sync.'
    },
    {
        id: 'ardoise', name: 'Ardoise', icon: 'solar:bill-list-bold-duotone', url: 'https://ardoise.facile.studio',
        title: 'From quote to paid, without the paperwork.',
        description: 'Send quotes, turn them into compliant invoices and track every payment. The contract goes out '
            + 'for signature in Plume. Free to start.'
    },
    {
        id: 'boite', name: 'Boîte', icon: 'solar:box-minimalistic-bold-duotone', url: 'https://boite.facile.studio',
        title: 'Break things safely.',
        description: 'A throwaway machine for your code and your AI agents. Take a snapshot, break everything, roll '
            + 'back in one command.'
    },
    {
        id: 'boutique', name: 'Boutique', icon: BOUTIQUE_GLYPH, url: 'https://boutique.facile.studio',
        title: 'The base for client shops',
        description: 'Self-hosted shop base for client stores: a SvelteKit storefront, Stripe Checkout and '
            + 'weight-based shipping.'
    },
    {
        id: 'bulle', name: 'Bulle', icon: 'solar:smile-circle-bold-duotone', url: 'https://bulle.facile.studio',
        title: 'The assistant that takes care of the rest.',
        description: 'Bulle reads your mail, finds a slot in your calendar and files your tasks across the Facile '
            + 'apps. It asks before it acts.'
    },
    {
        id: 'capsule', name: 'Capsule', icon: 'solar:pill-bold-duotone', url: 'https://capsule.facile.studio',
        title: 'Send a password. It\'s gone once read.',
        description: 'A link that opens once, encrypted before it leaves your device. No account needed.'
    },
    {
        id: 'casier', name: 'Casier', icon: 'solar:key-minimalistic-square-bold-duotone',
        url: 'https://casier.facile.studio',
        title: 'No more .env files lying around.',
        description: 'Your team\'s secrets, encrypted in one place and injected into your apps at launch. Every read '
            + 'is logged. Free to start.'
    },
    {
        id: 'courrier', name: 'Courrier', icon: 'solar:letter-opened-bold-duotone', url: 'https://courrier.facile.studio',
        title: 'All your email, in one calm inbox.',
        description: 'Bring your Gmail or OVH addresses into one clear inbox, share it with your team and let Bulle '
            + 'sum up long threads. Free to start.'
    },
    {
        id: 'docs', name: 'Docs', icon: 'solar:documents-bold-duotone', url: 'https://docs.facile.studio',
        title: 'Documents your team writes together.',
        description: 'Notes, meeting minutes and wikis written together, live, with your Feuilles sheets and Toile '
            + 'boards right in the page. Free to start.'
    },
    {
        id: 'feuilles', name: 'Feuilles', icon: 'solar:table-minimalistic-bold-duotone',
        url: 'https://feuilles.facile.studio',
        title: 'Spreadsheets your team fills in together.',
        description: 'Budgets, trackers and lists, together and live. Import your Excel files, your formulas work '
            + 'here. Free to start.'
    },
    {
        id: 'fusible', name: 'Fusible', icon: 'solar:cpu-bolt-bold-duotone', url: 'https://fusible.facile.studio',
        title: 'Check your board before you order it.',
        description: 'Describe your circuit board in code. Fusible checks every rule and blocks the export while an '
            + 'error remains.'
    },
    {
        id: 'gare', name: 'Gare', icon: 'solar:tram-bold-duotone', url: 'https://garev2.facile.studio',
        title: 'Deploy from git to your own server.',
        description: 'Push to git: Gare builds the app, puts it live and rolls back to the last version if it breaks.'
    },
    {
        id: 'glouton', name: 'Glouton', icon: 'solar:magnet-wave-bold-duotone', url: 'https://glouton.facile.studio',
        title: 'Your next clients, found while you sleep.',
        description: 'Glouton finds businesses near you, scores every lead and drafts the first message.'
    },
    {
        id: 'journal', name: 'Journal', icon: 'solar:notebook-bold-duotone', url: 'https://journal.facile.studio',
        title: 'Every log, one place.',
        description: 'Find why it crashed in one search, across all your apps, and follow errors live.'
    },
    {
        id: 'muse', name: 'muse', icon: 'solar:pallete-2-bold-duotone', url: 'https://muse.facile.studio',
        title: 'The Facile design system',
        description: 'The Svelte 5 component library behind the Facile Suite: tokens, primitives and the charter '
            + 'every app uses.'
    },
    {
        id: 'mycelium', name: 'Mycelium', icon: 'solar:structure-bold-duotone', url: 'https://mycelium.facile.studio',
        title: 'One brain for your AI coding agents',
        description: 'One store of memory, rules and skills for every AI coding agent, synced across all your machines.'
    },
    {
        id: 'nuage', name: 'Nuage', icon: 'solar:cloud-bold-duotone', url: 'https://nuage.facile.studio',
        title: 'Your files, everywhere. Shared in one link.',
        description: 'Keep your photos and documents, share them by link and work together in team folders. Free to '
            + 'start.'
    },
    {
        id: 'opus', name: 'Opus', icon: 'solar:slider-vertical-minimalistic-bold-duotone',
        url: 'https://opus.facile.studio',
        title: 'Your projects, clear to the whole team.',
        description: 'Tasks, boards and timelines shared live. Time spent comes in from Sablier and your deadlines '
            + 'show up in Agenda. Free to start.'
    },
    {
        id: 'pastille', name: 'Pastille', icon: 'solar:circle-dot-bold-duotone', url: 'https://pastille.facile.studio',
        title: 'Wear your assistant.',
        description: 'A small round 42 mm charm with a screen, linked to Bulle, your assistant. Pre-orders are open, '
            + 'shipping planned for March 2027.'
    },
    {
        id: 'perception', name: 'Perception', icon: 'solar:eye-scan-bold-duotone',
        url: 'https://perception.facile.studio',
        title: 'The context brain for operations',
        description: 'Ingests events from across the suite, keeps a business memory and answers operational '
            + 'questions in plain words.'
    },
    {
        id: 'place', name: 'Place', icon: 'solar:cup-hot-bold-duotone', url: 'https://place.facile.studio',
        title: 'Ask your questions, the Facile team answers.',
        description: 'Help, release announcements and talks with the team, in one place. Your Discord threads show '
            + 'up here. Free to start.'
    },
    {
        id: 'plume', name: 'Plume', icon: 'solar:pen-new-square-bold-duotone', url: 'https://plume.facile.studio',
        title: 'Get your documents signed with one link.',
        description: 'Send a PDF, your client signs from their phone, and you get the signed copy with its proof. '
            + 'Free to start.'
    },
    {
        id: 'prisme', name: 'Prisme', icon: 'solar:chat-round-bold-duotone', url: 'https://prisme.facile.studio',
        title: 'Team chat, with Bulle in the conversation.',
        description: 'A room per project, a video call in one click, and Bulle answering when you mention it. Free '
            + 'to start.'
    },
    {
        id: 'registre', name: 'Registre', icon: 'solar:key-square-bold-duotone', url: 'https://sso.facile.studio',
        title: 'One account. Every app.',
        description: 'Sign in once, and the Facile apps open with the same account. One subscription unlocks the '
            + 'whole suite. Free to start.'
    },
    {
        id: 'sablier', name: 'Sablier', icon: 'solar:hourglass-bold-duotone', url: 'https://sablier.facile.studio',
        title: 'Track time. Count every hour.',
        description: 'One click starts the timer. Every hour lands in the right project, at your hourly rate. Free '
            + 'to start.'
    },
    {
        id: 'scribe', name: 'Scribe', icon: 'solar:microphone-2-bold-duotone', url: 'https://scribe.facile.studio',
        title: 'Your meetings, written up for you.',
        description: 'Scribe transcribes your meetings on your Mac and writes the minutes, with decisions and next '
            + 'steps. Coming soon.'
    },
    {
        id: 'sonar', name: 'sonar', icon: SONAR_GLYPH, url: 'https://sonar.facile.studio',
        title: 'Multi-engine web search',
        description: 'Runs one query across several search APIs, your SearXNG instances and scrape fallbacks, then '
            + 'merges the results.'
    },
    {
        id: 'sonde', name: 'Sonde', icon: 'solar:radar-bold-duotone', url: 'https://sonde.facile.studio',
        title: 'Is it up? Know in a minute.',
        description: 'Sonde alerts you the moment a site, a port or a cron job goes down, and your clients follow '
            + 'the status on a public page. Free to start.'
    },
    {
        id: 'suite', name: 'Facile Suite', icon: 'solar:widget-5-bold-duotone', url: 'https://suite.facile.studio',
        title: 'We keep it simple, you create.',
        description: '26 apps for your work, one Facile account. We host them, you start in a minute. Free to start.'
    },
    {
        id: 'toile', name: 'Toile', icon: 'solar:tablet-bold-duotone', url: 'https://toile.facile.studio',
        title: 'An endless whiteboard to share.',
        description: 'Stickies, arrows and drawings on an endless board, with your whole team live. Free to start.'
    },
    {
        id: 'vision', name: 'Vision', icon: 'solar:panorama-bold-duotone', url: 'https://vision.facile.studio',
        title: 'Your stats, without cookies.',
        description: 'See who visits your site and where they come from. Vision uses no cookies. Free to start.'
    },
    {
        id: 'vitrine', name: 'Facile Studio', icon: FACILE_GLYPH, url: 'https://facile.studio',
        title: 'Web design and engineering studio',
        description: 'Showcase sites, custom web apps, art direction and hosting, from the studio behind the Facile '
            + 'Suite.'
    }
];
