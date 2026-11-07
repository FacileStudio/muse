import { r2 } from './round.js';
import { TAU } from './types.js';

const FULL_EPS = 1e-4;

/**
 * Largest corner radius an annulus sector can hold: half its radial thickness, and small
 * enough that the fillets at the two ends of the *inner* edge do not meet — the inner edge
 * is the short one, so it runs out of room first. Returned as 0 when the sector is a full
 * ring, which has no corners to round.
 */
export function arcCorner(
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number,
    corner: number
): number {
    const span = endAngle - startAngle;
    if (!(corner > 0) || !(span > 0) || span >= TAU - FULL_EPS) return 0;
    if (!(rOuter > 0) || !(rInner > 0) || rInner >= rOuter) return 0;
    const half = Math.min(span / 2, Math.PI / 2);
    const sin = Math.sin(half);
    if (!(sin > 0)) return 0;
    /* k/(rInner + k) = sin(half) at the point where the two inner fillets touch, and
       k/(rOuter − k) = sin(half) where the outer two do. */
    const byInner = sin >= 1 ? Infinity : (rInner * sin) / (1 - sin);
    const byOuter = (rOuter * sin) / (1 + sin);
    return Math.max(0, Math.min(corner, (rOuter - rInner) / 2, byInner, byOuter));
}

/**
 * A slice that spans the whole circle: two half arcs per edge, so there is no seam, no
 * rounded end and no gap. The inner circle runs the other way and cuts the hole under the
 * default nonzero fill rule. `rInner` of 0 yields a plain disc.
 */
function circlePath(cx: number, cy: number, rOuter: number, rInner: number): string {
    const ring = (r: number, sweep: 0 | 1) =>
        `M${r2(cx)} ${r2(cy - r)}A${r2(r)} ${r2(r)} 0 1 ${sweep} ${r2(cx)} ${r2(cy + r)}A${r2(r)} ${r2(r)} 0 1 ${sweep} ${r2(cx)} ${r2(cy - r)}Z`;
    const ri = Math.max(0, Math.min(rInner, rOuter));
    return ri > 0 ? ring(rOuter, 1) + ring(ri, 0) : ring(rOuter, 1);
}

/**
 * Donut segment. Angles are radians measured from 12 o'clock, growing clockwise,
 * which matches SVG's y-down space with `sweep-flag=1`. `rInner` of 0 yields a pie wedge.
 *
 * `corner` rounds the four ends of the ring band, clamped by `arcCorner`. Each fillet is
 * tangent to both the radial edge and the arc it meets, so the segment keeps its exact
 * angular span — the alternative, a round `stroke-linecap`, would push every segment
 * half a thickness past the angle it represents and make the slices lie.
 */
export function arcPath(
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number,
    corner = 0
): string {
    if (!(rOuter > 0) || !(endAngle > startAngle)) return '';
    if (endAngle - startAngle >= TAU - FULL_EPS) return circlePath(cx, cy, rOuter, rInner);
    const a0 = startAngle;
    const a1 = endAngle;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const px = (r: number, a: number) => r2(cx + r * Math.sin(a));
    const py = (r: number, a: number) => r2(cy - r * Math.cos(a));
    const ri = Math.max(0, Math.min(rInner, rOuter));
    if (ri <= 0) {
        return `M${r2(cx)} ${r2(cy)}L${px(rOuter, a0)} ${py(rOuter, a0)}A${r2(rOuter)} ${r2(rOuter)} 0 ${large} 1 ${px(rOuter, a1)} ${py(rOuter, a1)}Z`;
    }
    const k = arcCorner(rOuter, ri, a0, a1, corner);
    if (k <= 0) {
        return `M${px(rOuter, a0)} ${py(rOuter, a0)}A${r2(rOuter)} ${r2(rOuter)} 0 ${large} 1 ${px(rOuter, a1)} ${py(rOuter, a1)}L${px(ri, a1)} ${py(ri, a1)}A${r2(ri)} ${r2(ri)} 0 ${large} 0 ${px(ri, a0)} ${py(ri, a0)}Z`;
    }
    /* Fillet centres sit at rOuter − k and rInner + k; `dOut`/`dIn` are the angles their
       tangent points are offset by, and `fOut`/`fIn` the radii where they leave the
       radial edge. Every corner turns the same way as the outline, so all four take
       sweep 1 while the inner arc keeps sweep 0. */
    const dOut = Math.asin(k / (rOuter - k));
    const dIn = Math.asin(k / (ri + k));
    const fOut = (rOuter - k) * Math.cos(dOut);
    const fIn = (ri + k) * Math.cos(dIn);
    const arcOut = a1 - dOut - (a0 + dOut) > Math.PI ? 1 : 0;
    const arcIn = a1 - dIn - (a0 + dIn) > Math.PI ? 1 : 0;
    const r = r2(k);
    return (
        `M${px(fIn, a0)} ${py(fIn, a0)}` +
        `L${px(fOut, a0)} ${py(fOut, a0)}` +
        `A${r} ${r} 0 0 1 ${px(rOuter, a0 + dOut)} ${py(rOuter, a0 + dOut)}` +
        `A${r2(rOuter)} ${r2(rOuter)} 0 ${arcOut} 1 ${px(rOuter, a1 - dOut)} ${py(rOuter, a1 - dOut)}` +
        `A${r} ${r} 0 0 1 ${px(fOut, a1)} ${py(fOut, a1)}` +
        `L${px(fIn, a1)} ${py(fIn, a1)}` +
        `A${r} ${r} 0 0 1 ${px(ri, a1 - dIn)} ${py(ri, a1 - dIn)}` +
        `A${r2(ri)} ${r2(ri)} 0 ${arcIn} 0 ${px(ri, a0 + dIn)} ${py(ri, a0 + dIn)}` +
        `A${r} ${r} 0 0 1 ${px(fIn, a0)} ${py(fIn, a0)}Z`
    );
}
