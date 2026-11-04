<script module lang="ts">
    import type { HTMLSelectAttributes } from 'svelte/elements';
    import type { Locale } from '../../i18n/locale.js';

    export interface LocaleSwitchProps extends Omit<HTMLSelectAttributes, 'value'> {
        /** Defaults to the locale set by `provideLocale`. */
        value?: Locale;
        /** Persist the choice here (cookie, Registre profile). The muse locale already follows it. */
        onChange?: (locale: Locale) => void;
        class?: string;
    }
</script>

<script lang="ts">
    import { twMerge } from '../../utils/cn.js';
    import Select from '../atoms/Select.svelte';
    import { getI18n } from '../../i18n/context.svelte.js';
    import { LOCALES, LOCALE_NAMES, resolveLocale } from '../../i18n/locale.js';

    let { value, onChange, class: className = '', ...rest }: LocaleSwitchProps = $props();

    const i18n = getI18n();
    const current = $derived(value ?? i18n.locale);

    function choose(event: Event & { currentTarget: HTMLSelectElement }) {
        const locale = resolveLocale(event.currentTarget.value);
        i18n.set(locale);
        onChange?.(locale);
    }
</script>

<!--
@component
Le choix de langue : les quatre langues de la suite, chacune écrite dans sa propre langue, branché sur `provideLocale`.
-->

<Select
    aria-label={i18n.t('locale.label')}
    value={current}
    onchange={choose}
    class={twMerge('w-auto text-fc-sm', className)}
    {...rest}
>
    {#each LOCALES as locale (locale)}
        <option value={locale} lang={locale}>{LOCALE_NAMES[locale]}</option>
    {/each}
</Select>
