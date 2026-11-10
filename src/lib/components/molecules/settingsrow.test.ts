import { expect, test } from 'bun:test';
import { createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import SettingsRow from './SettingsRow.svelte';
import Textarea from '../atoms/Textarea.svelte';

const children = createRawSnippet(() => ({ render: () => '<span>x</span>' }));

test('stacked SettingsRow stretches its children in a column', () => {
    const body = render(SettingsRow, { props: { stacked: true, children } }).body;
    expect(body).toContain('flex flex-col items-stretch gap-2');
    expect(body).not.toContain('flex items-center gap-2');
});

test('side-by-side SettingsRow keeps the horizontal wrapper', () => {
    const body = render(SettingsRow, { props: { children } }).body;
    expect(body).toContain('flex items-center gap-2 sm:shrink-0');
});

test('Textarea auto-grows unless autoGrow is false', () => {
    expect(render(Textarea, { props: {} }).body).toContain('field-sizing-content');
    expect(render(Textarea, { props: { autoGrow: false } }).body).not.toContain('field-sizing-content');
});
