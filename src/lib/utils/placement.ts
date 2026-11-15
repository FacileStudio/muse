/** Where a popup opens relative to its trigger. Pure arithmetic, checked by `placement.test.ts`. */

export type PlacementInput = {
    triggerTop: number;
    triggerBottom: number;
    viewportHeight: number;
    gap: number;
    margin: number;
    need: number;
};

export type Placement = { up: boolean; maxHeight: number };

/** Opens downward unless the space below is under `need` and the space above is larger. */
export function placePopup(input: PlacementInput): Placement {
    const below = input.viewportHeight - input.triggerBottom - input.gap - input.margin;
    const above = input.triggerTop - input.gap - input.margin;
    const up = below < input.need && above > below;
    return { up, maxHeight: Math.max(input.need, Math.floor(up ? above : below)) };
}

export type Align = 'start' | 'center' | 'end' | 'auto';

export type AcrossInput = {
    triggerLeft: number;
    triggerRight: number;
    viewportWidth: number;
    width: number;
    margin: number;
    align: Align;
};

export type Across = { left: number; align: 'start' | 'center' | 'end' };

/**
 * Where a popup of `width` sits horizontally. `start` lines its left edge with the trigger, `end`
 * lines its right edge, `center` centres on the trigger, `auto` takes `start` unless it overflows and
 * `end` has more room. The result is always clamped inside the viewport margins.
 */
export function placeAcross(input: AcrossInput): Across {
    const { triggerLeft, triggerRight, viewportWidth, width, margin } = input;
    const roomStart = viewportWidth - margin - triggerLeft;
    const roomEnd = triggerRight - margin;
    const end = input.align === 'end' || (input.align === 'auto' && width > roomStart && roomEnd > roomStart);
    const center = input.align === 'center';
    const wanted = center ? (triggerLeft + triggerRight - width) / 2 : end ? triggerRight - width : triggerLeft;
    const left = Math.max(margin, Math.min(wanted, viewportWidth - margin - width));
    return { left, align: center ? 'center' : end ? 'end' : 'start' };
}

export type Side = 'top' | 'bottom' | 'left' | 'right';

export type Box = { left: number; top: number; right: number; bottom: number };

export type SideInput = {
    anchor: Box;
    width: number;
    height: number;
    viewportWidth: number;
    viewportHeight: number;
    side: Side;
    align: Align;
    gap: number;
    margin: number;
};

export type SidePlacement = { left: number; top: number; side: Side; maxHeight: number };

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

function crossStart(align: Align, low: number, high: number, size: number): number {
    if (align === 'start') return low;
    if (align === 'end') return high - size;
    return (low + high - size) / 2;
}

/**
 * Where a popup of `width` by `height` sits on one `side` of an anchor box. It flips to the opposite
 * side when the preferred one is too tight and the other has more room, then shifts along the edge so
 * the popup stays inside the viewport margins. `auto` centres on the anchor.
 */
export function placeSide(input: SideInput): SidePlacement {
    const { anchor, width, height, viewportWidth, viewportHeight, gap, margin } = input;
    const room: Record<Side, number> = {
        top: anchor.top - gap - margin,
        bottom: viewportHeight - anchor.bottom - gap - margin,
        left: anchor.left - gap - margin,
        right: viewportWidth - anchor.right - gap - margin
    };
    const need = input.side === 'top' || input.side === 'bottom' ? height : width;
    const other = OPPOSITE[input.side];
    const side = room[input.side] < need && room[other] > room[input.side] ? other : input.side;
    const vertical = side === 'top' || side === 'bottom';
    const maxHeight = vertical ? Math.max(0, Math.floor(room[side])) : Math.max(0, viewportHeight - 2 * margin);
    const h = Math.min(height, maxHeight);
    const clamp = (value: number, size: number, extent: number) => Math.max(margin, Math.min(value, extent - margin - size));
    if (vertical) {
        const left = clamp(crossStart(input.align, anchor.left, anchor.right, width), width, viewportWidth);
        return { left, top: side === 'bottom' ? anchor.bottom + gap : anchor.top - gap - h, side, maxHeight };
    }
    const top = clamp(crossStart(input.align, anchor.top, anchor.bottom, h), h, viewportHeight);
    return { left: side === 'right' ? anchor.right + gap : anchor.left - gap - width, top, side, maxHeight };
}
