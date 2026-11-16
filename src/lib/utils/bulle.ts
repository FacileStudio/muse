/** What Bulle is doing. `unavailable` greys the blob out; the button stays usable so the panel can say why. */
export type BulleMood = 'idle' | 'thinking' | 'done' | 'unavailable';

/** The shapes of the Bulle button: a header button, an inline chip, or the blob alone. */
export type BulleVariant = 'header' | 'chip' | 'icon';

/** The blob's face for a mood, as a name the component maps to a `@facile/blob` expression. */
export type BulleFace = 'happy' | 'thinking' | null;

/** How the blob is drawn for a mood. */
export interface BulleLook {
    /** `always` runs the blob's motion; `null` draws it still. */
    animate: 'always' | null;
    face: BulleFace;
    muted: boolean;
}

/** Blob pixel size per variant when the caller gives none. */
export const BULLE_SIZES: Record<BulleVariant, number> = { header: 28, chip: 20, icon: 28 };

/** The blob's fallback name when the app does not know the assistant's. */
export const BULLE_NAME = 'Bulle';

/** Maps a mood to its look. A user who prefers reduced motion never gets the moving blob. */
export function bulleLook(mood: BulleMood, reducedMotion: boolean): BulleLook {
    return {
        animate: mood === 'thinking' && !reducedMotion ? 'always' : null,
        face: mood === 'done' ? 'happy' : mood === 'thinking' ? 'thinking' : null,
        muted: mood === 'unavailable'
    };
}

/** The accessible name: an explicit one, else the visible label, else the fallback the caller translated. */
export function bulleAccessibleName(ariaLabel: string | undefined, label: string | undefined, fallback: string): string {
    return ariaLabel?.trim() || label?.trim() || fallback.trim() || BULLE_NAME;
}

/** A blank name falls back to Bulle so the blob never draws from an empty seed. */
export function bulleName(name: string | null | undefined): string {
    return name?.trim() || BULLE_NAME;
}
