import { keyAction, type KeyAction } from './keys.js';
import { moveActive, typeahead } from './listbox.js';
import { AnchoredPopup, type AcrossHost } from './popup.svelte.js';

const NEED = 200;
const TYPE_RESET_MS = 600;

export type MenuHost = {
    labels: () => string[];
    disabled: () => boolean[];
    trigger: () => HTMLElement | null;
    items: () => HTMLElement[];
    across?: AcrossHost;
};

/**
 * The state and key handling of one `Menu`. Unlike `Select`, a menu moves real DOM focus onto its
 * items (the APG menu button pattern), so activation is the item's own click and the arrows wrap.
 */
export class MenuState extends AnchoredPopup {
    active = $state(-1);
    mode = $state<'keyboard' | 'pointer'>('keyboard');
    host: MenuHost;
    buffer = '';
    timer: ReturnType<typeof setTimeout> | undefined;

    constructor(host: MenuHost) {
        super(host.trigger, NEED, host.across);
        this.host = host;
    }

    show = (at: 'first' | 'last' = 'first'): void => {
        this.land(moveActive(this.host.disabled(), -1, at === 'last' ? 'ArrowUp' : 'ArrowDown'));
        this.place();
        this.open = true;
    };

    hide = (refocus = false): void => {
        this.open = false;
        this.mode = 'keyboard';
        this.active = -1;
        this.buffer = '';
        if (refocus) this.host.trigger()?.focus();
    };

    toggle = (): void => {
        if (this.open) this.hide();
        else this.show();
    };

    point = (index: number): void => {
        if (index === this.active && this.mode === 'pointer') return;
        this.mode = 'pointer';
        this.active = index;
    };

    land = (index: number): void => {
        this.mode = 'keyboard';
        this.active = index;
    };

    focusActive = (): void => {
        if (!this.open || this.mode !== 'keyboard' || this.active < 0) return;
        const item = this.host.items()[this.active];
        item?.focus({ preventScroll: true });
        item?.scrollIntoView?.({ block: 'nearest' });
    };

    type = (char: string): void => {
        const found = typeahead(this.host.labels(), this.host.disabled(), this.active, this.buffer, char);
        this.buffer = found.buffer;
        if (found.index >= 0) this.land(found.index);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => (this.buffer = ''), TYPE_RESET_MS);
    };

    run = (action: KeyAction): void => {
        if (action.kind === 'move') this.land(moveActive(this.host.disabled(), this.active, action.key, true));
        else if (action.kind === 'type') this.type(action.char);
        else if (action.kind === 'close') this.hide(true);
        else if (action.kind === 'tab') this.hide(true);
    };

    keydown = (event: KeyboardEvent): void => {
        const action = keyAction(true, event, this.buffer !== '');
        if (action.kind === 'ignore' || action.kind === 'commit') return;
        if (action.kind !== 'tab') event.preventDefault();
        this.run(action);
    };

    triggerKeydown = (event: KeyboardEvent): void => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        this.show(event.key === 'ArrowUp' ? 'last' : 'first');
    };
}

/** Space presses a menu row like Enter, unless it is part of a type-ahead in progress. */
export function pressOnSpace(event: KeyboardEvent, typing: boolean): void {
    if (event.key !== ' ' || typing) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
}
