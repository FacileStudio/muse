/**
 * The shared look of a text-like form control: a filled box with no border.
 *
 * The fill is the boundary, so it is `fc-field`, the one token measured at 3:1 against the page,
 * a card and `fc-surface` (WCAG 2.2 1.4.11). Focus is the one outline ring. An invalid control
 * mixes the danger hue into the fill, and `Field` adds an icon and the message so the state
 * never rests on colour alone.
 */
export const controlFill =
    'rounded-fc-md bg-fc-field text-fc-md text-fc-fg placeholder:text-fc-field-hint ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring ' +
    'aria-invalid:bg-[color-mix(in_oklab,var(--color-fc-danger)_30%,var(--color-fc-field))] ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

/** A single-line control: 44px high, so the touch target is met without padding tricks. */
export const controlLine = `h-11 w-full px-3 ${controlFill}`;
