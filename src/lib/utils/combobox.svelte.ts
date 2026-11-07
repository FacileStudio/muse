import { moveActive } from './listbox.js';
import { AnchoredPopup } from './popup.svelte.js';

const NEED = 200;

export type ComboboxHost = {
    input: () => HTMLInputElement | null;
    disabled: () => boolean[];
    text: () => string;
    setText: (text: string) => void;
    pick: (index: number) => void;
};

/**
 * The state and key handling of one `Combobox`: the APG editable combobox with list autocomplete and
 * manual selection. The text field keeps DOM focus, and the highlighted option is `active`, announced
 * with `aria-activedescendant`.
 */
export class ComboboxState extends AnchoredPopup {
    active = $state(-1);
    host: ComboboxHost;

    constructor(host: ComboboxHost) {
        super(host.input, NEED);
        this.host = host;
    }

    show = (at: 'first' | 'last' | 'none' = 'none'): void => {
        this.active = at === 'none' ? -1 : moveActive(this.host.disabled(), -1, at === 'last' ? 'ArrowUp' : 'ArrowDown');
        this.place();
        this.open = true;
    };

    hide = (): void => {
        this.open = false;
        this.active = -1;
    };

    typed = (): void => {
        if (!this.open) this.place();
        this.open = true;
        this.active = -1;
    };

    move = (key: 'ArrowDown' | 'ArrowUp'): void => {
        if (!this.open) return this.show(key === 'ArrowUp' ? 'last' : 'first');
        this.active = moveActive(this.host.disabled(), this.active, key);
    };

    keydown = (event: KeyboardEvent): void => {
        const { key } = event;
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            event.preventDefault();
            this.move(key);
        } else if (key === 'Enter' && this.open && this.active >= 0) {
            event.preventDefault();
            this.host.pick(this.active);
        } else if (key === 'Escape') {
            if (this.open) {
                event.preventDefault();
                event.stopPropagation();
                this.hide();
            } else if (this.host.text() !== '') {
                event.preventDefault();
                this.host.setText('');
            }
        } else if (key === 'Tab') {
            this.hide();
        }
    };
}
