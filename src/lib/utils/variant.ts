/** One emphasis vocabulary for `Button` and `IconButton`. */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'ghost-danger';

/** @deprecated `outline` is `secondary`: the control has no outline any more. */
export type LegacyButtonVariant = 'outline';

export type IconButtonVariant = 'secondary' | 'ghost' | 'ghost-danger';

/** @deprecated `default` is `secondary` and `danger` is `ghost-danger`, the look it has always had on `IconButton`. */
export type LegacyIconButtonVariant = 'default' | 'danger';

/** The canonical `Button` variant for a current or deprecated name. */
export function buttonVariant(variant: ButtonVariant | LegacyButtonVariant): ButtonVariant {
    return variant === 'outline' ? 'secondary' : variant;
}

/** The canonical `IconButton` variant for a current or deprecated name. */
export function iconButtonVariant(variant: IconButtonVariant | LegacyIconButtonVariant): IconButtonVariant {
    if (variant === 'default') return 'secondary';
    return variant === 'danger' ? 'ghost-danger' : variant;
}
