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
