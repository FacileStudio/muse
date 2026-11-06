/**
 * The shared look of a text-like form control: a filled box with no border.
 *
 * The fill is a subtle step off the surface (`fc-field`, about 1.2:1), not a 3:1 boundary: the
 * owner's call. The label, the placeholder and the focus ring identify the control, and
 * `forced-colors` in `tokens.css` restores a real edge. Focus is the one outline ring. An invalid control
 * mixes the danger hue into the fill, and `Field` adds an icon and the message so the state
 * never rests on colour alone.
 */
export const controlFill =
    'rounded-fc-md bg-fc-field text-fc-md text-fc-fg placeholder:text-fc-fg-muted aria-invalid:placeholder:text-fc-fg ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fc-ring ' +
    'aria-invalid:bg-[color-mix(in_oklab,var(--color-fc-danger)_18%,var(--color-fc-field))] ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

/** A single-line control: 44px high, so the touch target is met without padding tricks. */
export const controlLine = `h-11 w-full px-3 ${controlFill}`;
