import { isSafeHref } from './href.js';
import { scrollParent } from './motion.js';

export const SCROLL_ENTER = 16;
export const SCROLL_LEAVE = 4;

const HASH = /^#[^\s\\\p{Cc}]*$/u;
const CONTACT = /^(?:mailto|tel):[^\s\\\p{Cc}]+$/iu;

export interface LandingLink {
    href: string;
    label: string;
    icon?: string;
    active?: boolean;
    external?: boolean;
}

export function linkAttrs(link: { external?: boolean }): { target?: '_blank'; rel?: string } {
    return link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}

export function nextScrolled(y: number, was: boolean): boolean {
    return y > (was ? SCROLL_LEAVE : SCROLL_ENTER);
}

export function landingHref(raw: unknown): string | null {
    if (typeof raw !== 'string') return null;
    return isSafeHref(raw) || HASH.test(raw) || CONTACT.test(raw) ? raw : null;
}

export function safeLinks<T extends { href: string }>(links: readonly T[]): (T & { href: string })[] {
    return links.flatMap((link) => {
        const href = landingHref(link.href);
        return href === null ? [] : [{ ...link, href }];
    });
}

export function watchScrolled(node: Element, onChange: (scrolled: boolean) => void): () => void {
    const scroller = scrollParent(node);
    const target: EventTarget = scroller ?? window;
    let scrolled = false;
    const read = () => {
        const next = nextScrolled(scroller ? scroller.scrollTop : window.scrollY, scrolled);
        if (next === scrolled) return;
        scrolled = next;
        onChange(next);
    };
    read();
    target.addEventListener('scroll', read, { passive: true });
    return () => target.removeEventListener('scroll', read);
}
