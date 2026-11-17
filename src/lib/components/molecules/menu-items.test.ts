import { describe, expect, test } from 'bun:test';
import { render } from 'svelte/server';
import MenuItems from './MenuItems.svelte';
import type { MenuEntry } from './Menu.svelte';
import { MenuState } from '../../utils/menu.svelte.js';

function html(entries: MenuEntry[]): string {
    const menu = new MenuState({ labels: () => [], disabled: () => [], trigger: () => null, items: () => [] });
    return render(MenuItems, { props: { entries, menu, choose: () => {} } }).body;
}

describe('MenuItems shortcuts', () => {
    const body = html([{ label: 'Rechercher', shortcut: 'mod+shift+k' }]);

    test('the shortcut is announced once, through aria-keyshortcuts', () => {
        expect(body).toContain('aria-keyshortcuts="Control+Shift+K"');
        expect(body).toMatch(/<kbd aria-hidden="true"[^>]*>Ctrl\+Shift\+K<\/kbd>/);
    });

    test('the shortcut is muted, small and monospaced, after the label', () => {
        expect(body).toMatch(/<kbd[^>]*class="[^"]*font-fc-mono[^"]*text-fc-xs[^"]*text-fc-fg-muted/);
        expect(body.indexOf('Rechercher')).toBeLessThan(body.indexOf('<kbd'));
    });
});

describe('MenuItems submenus', () => {
    const body = html([{ label: 'Exporter', items: [{ label: 'PDF' }, { label: 'CSV' }] }]);

    test('a parent row says it opens a menu and starts collapsed', () => {
        expect(body).toContain('aria-haspopup="menu"');
        expect(body).toContain('aria-expanded="false"');
    });

    test('the submenu is not drawn until it opens', () => {
        expect(body).not.toContain('PDF');
    });
});

describe('MenuItems without the new fields', () => {
    const body = html([{ label: 'Ouvrir' }, { separator: true }, { label: 'Lien', href: '/x' }]);

    test('renders no shortcut, no submenu wiring', () => {
        expect(body).not.toContain('aria-keyshortcuts');
        expect(body).not.toContain('aria-haspopup');
        expect(body).not.toContain('<kbd');
        expect(body).toContain('role="separator"');
        expect(body).toContain('href="/x"');
    });
});
