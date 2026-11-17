const NAMES: Record<string, { apple: string; other: string }> = {
    mod: { apple: '⌘', other: 'Ctrl' },
    cmd: { apple: '⌘', other: 'Ctrl' },
    ctrl: { apple: '⌃', other: 'Ctrl' },
    alt: { apple: '⌥', other: 'Alt' },
    option: { apple: '⌥', other: 'Alt' },
    shift: { apple: '⇧', other: 'Shift' },
    enter: { apple: '↵', other: 'Enter' },
    esc: { apple: 'esc', other: 'Esc' },
    escape: { apple: 'esc', other: 'Esc' },
    up: { apple: '↑', other: '↑' },
    down: { apple: '↓', other: '↓' },
    left: { apple: '←', other: '←' },
    right: { apple: '→', other: '→' },
    space: { apple: 'Space', other: 'Space' },
    tab: { apple: '⇥', other: 'Tab' },
    backspace: { apple: '⌫', other: 'Backspace' },
    delete: { apple: '⌦', other: 'Del' }
};

/** The key caps of a shortcut such as `mod+shift+k`, spelled for Apple platforms or the rest. */
export function keyCaps(shortcut: string, apple: boolean): string[] {
    return shortcut
        .split('+')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            const named = NAMES[part.toLowerCase()];
            if (named) return apple ? named.apple : named.other;
            return part.length === 1 ? part.toUpperCase() : part;
        });
}

const ARIA: Record<string, string> = {
    ctrl: 'Control',
    alt: 'Alt',
    option: 'Alt',
    shift: 'Shift',
    enter: 'Enter',
    esc: 'Escape',
    escape: 'Escape',
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    space: 'Space',
    tab: 'Tab',
    backspace: 'Backspace',
    delete: 'Delete'
};

/** The `aria-keyshortcuts` value of a shortcut such as `mod+shift+k`: `Meta+Shift+K` on Apple platforms, `Control+Shift+K` elsewhere. */
export function ariaKeyShortcuts(shortcut: string, apple: boolean): string {
    return shortcut
        .split('+')
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            const name = part.toLowerCase();
            if (name === 'mod' || name === 'cmd') return apple ? 'Meta' : 'Control';
            return ARIA[name] ?? part[0].toUpperCase() + part.slice(1);
        })
        .join('+');
}

/** A shortcut as one short run of text: `⌘⇧K` on Apple platforms, `Ctrl+Shift+K` elsewhere. */
export function shortcutText(shortcut: string, apple: boolean): string {
    return keyCaps(shortcut, apple).join(apple ? '' : '+');
}

/** True on macOS, iOS and iPadOS, where `mod` means Command. Only call it in the browser. */
export function isApplePlatform(): boolean {
    return /Mac|iPhone|iPad/.test(navigator.platform);
}
