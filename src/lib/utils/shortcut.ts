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
