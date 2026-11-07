const DISMISS_RATIO = 0.25;
const DISMISS_VELOCITY = 0.5;
const STALE_MS = 100;

/**
 * The pointer maths of a draggable bottom sheet: how far it has been pulled and whether letting go
 * should close it. A pull past a quarter of the height closes, and so does a fast downward flick.
 * A pause before release (older than 100ms) cancels the flick.
 */
export class SheetDrag {
    active = false;
    pointer = -1;
    offset = 0;
    startY = 0;
    lastY = 0;
    lastTime = 0;
    velocity = 0;

    begin(pointer: number, y: number, time: number): void {
        this.active = true;
        this.pointer = pointer;
        this.startY = this.lastY = y;
        this.lastTime = time;
        this.offset = 0;
        this.velocity = 0;
    }

    move(y: number, time: number): number {
        const dt = time - this.lastTime;
        if (dt > 0) {
            this.velocity = (y - this.lastY) / dt;
            this.lastY = y;
            this.lastTime = time;
        }
        this.offset = Math.max(0, y - this.startY);
        return this.offset;
    }

    end(time: number, height: number): boolean {
        this.active = false;
        this.pointer = -1;
        const speed = time - this.lastTime > STALE_MS ? 0 : this.velocity;
        return this.offset > height * DISMISS_RATIO || speed > DISMISS_VELOCITY;
    }
}
