export type Handler<E> = ((event: E) => void) | null | undefined;

export function chain<E>(consumer: Handler<E>, internal: (event: E) => void): (event: E) => void {
    return (event) => {
        try {
            consumer?.(event);
        } finally {
            internal(event);
        }
    };
}

export function consumeEscape(event: Pick<KeyboardEvent, 'key' | 'stopPropagation'>, open: boolean, close: () => void): boolean {
    if (!open || event.key !== 'Escape') return false;
    event.stopPropagation();
    close();
    return true;
}
