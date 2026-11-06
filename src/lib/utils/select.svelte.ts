import { keyAction, type KeyAction } from './keys.js';
import { moveActive, typeahead, type ListModel } from './listbox.js';
import { AnchoredPopup } from './popup.svelte.js';

const NEED = 240;
const TYPE_RESET_MS = 600;

export type SelectHost = {
    model: () => ListModel;
    value: () => string;
    trigger: () => HTMLElement | null;
    native: () => HTMLSelectElement | null;
};

/**
 * The state and key handling of one `Select`: open flag, active option, popup geometry and the
 * type-ahead buffer. The decisions come from `keys.ts` and `listbox.ts`; this class applies them.
 */
export class SelectState extends AnchoredPopup {
    active = $state(-1);
    host: SelectHost;
    buffer = '';
    timer: ReturnType<typeof setTimeout> | undefined;

    constructor(host: SelectHost) {
        super(host.trigger, NEED);
        this.host = host;
    }

    show = (at: 'selected' | 'first' | 'last' = 'selected'): void => {
        const { options } = this.host.model();
        const flags = options.map((o) => o.disabled);
        const chosen = options.findIndex((o) => o.value === this.host.value() && !o.disabled);
        if (at === 'selected' && chosen >= 0) this.active = chosen;
        else this.active = moveActive(flags, -1, at === 'last' ? 'ArrowUp' : 'ArrowDown');
        this.place();
        this.open = true;
    };

    hide = (): void => {
        this.open = false;
        this.buffer = '';
    };

    pick = (index: number): void => {
        const option = this.host.model().options[index];
        if (!option || option.disabled) return;
        const native = this.host.native();
        if (native && native.value !== option.value) {
            native.value = option.value;
            native.dispatchEvent(new Event('input', { bubbles: true }));
            native.dispatchEvent(new Event('change', { bubbles: true }));
        }
        this.hide();
        this.host.trigger()?.focus();
    };

    toggle = (): void => {
        if (this.open) this.hide();
        else this.show();
        this.host.trigger()?.focus();
    };

    type = (char: string): void => {
        const { options } = this.host.model();
        if (!this.open) this.show();
        const labels = options.map((o) => o.label);
        const found = typeahead(labels, options.map((o) => o.disabled), this.active, this.buffer, char);
        this.buffer = found.buffer;
        if (found.index >= 0) this.active = found.index;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => (this.buffer = ''), TYPE_RESET_MS);
    };

    finish = (leaving: boolean): void => {
        if (this.active < 0) this.hide();
        else if (!leaving) this.pick(this.active);
        else this.leave();
    };

    leave = (): void => {
        const option = this.host.model().options[this.active];
        if (option && !option.disabled && option.value !== this.host.value()) this.pick(this.active);
        this.hide();
    };

    run = (action: KeyAction): void => {
        if (action.kind === 'open') this.show(action.at);
        else if (action.kind === 'type') this.type(action.char);
        else if (action.kind === 'close') this.hide();
        else if (action.kind === 'commit' || action.kind === 'tab') this.finish(action.kind === 'tab');
        else if (action.kind === 'move') {
            const flags = this.host.model().options.map((o) => o.disabled);
            this.active = moveActive(flags, this.active, action.key);
        }
    };

    keydown = (event: KeyboardEvent): void => {
        const action = keyAction(this.open, event, this.buffer !== '');
        if (action.kind === 'ignore') return;
        if (action.kind !== 'tab') event.preventDefault();
        this.run(action);
    };
}
