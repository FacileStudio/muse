/*
 * The curtain is a singleton at the app root, not a per-page component. A Rideau mounted
 * inside the routed view can only ever play its reveal half: by the time it exists the old
 * page is already gone, so arriving looks like a teleport to a blank panel that then wipes.
 * Living above the router lets the same instance cover the page you are leaving and uncover
 * the one you land on — and, being outside PageTransition's transform, `position: fixed`
 * resolves against the viewport, so it covers the rail too instead of the content column.
 */
type Curtain = { close: (href?: string) => void; open: () => void };

export const curtain = $state<{ el: Curtain | null }>({ el: null });

export const CURTAIN_ROUTE = '#/motion';
