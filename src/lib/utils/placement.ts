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

export type Align = 'start' | 'end' | 'auto';

export type AcrossInput = {
    triggerLeft: number;
    triggerRight: number;
    viewportWidth: number;
    width: number;
    margin: number;
    align: Align;
};

export type Across = { left: number; align: 'start' | 'end' };

/**
 * Where a popup of `width` sits horizontally. `start` lines its left edge with the trigger, `end`
 * lines its right edge, `auto` takes `start` unless it overflows and `end` has more room. The result
 * is always clamped inside the viewport margins.
 */
export function placeAcross(input: AcrossInput): Across {
    const { triggerLeft, triggerRight, viewportWidth, width, margin } = input;
    const roomStart = viewportWidth - margin - triggerLeft;
    const roomEnd = triggerRight - margin;
    const end = input.align === 'end' || (input.align === 'auto' && width > roomStart && roomEnd > roomStart);
    const wanted = end ? triggerRight - width : triggerLeft;
    const left = Math.max(margin, Math.min(wanted, viewportWidth - margin - width));
    return { left, align: end ? 'end' : 'start' };
}
