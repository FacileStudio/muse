import { expect, test } from 'bun:test';
import { render } from 'svelte/server';
import Checkbox from './Checkbox.svelte';
import Radio from './Radio.svelte';
import Switch from './Switch.svelte';
import RadioGroup from '../molecules/RadioGroup.svelte';

const dense = /<label[^>]*data-dense/;

test('dense reaches the label of Checkbox, Radio and Switch', () => {
    expect(render(Checkbox, { props: { dense: true } }).body).toMatch(dense);
    expect(render(Radio, { props: { dense: true } }).body).toMatch(dense);
    expect(render(Switch, { props: { dense: true } }).body).toMatch(dense);
    expect(render(Checkbox, { props: {} }).body).not.toMatch(dense);
    expect(render(Radio, { props: {} }).body).not.toMatch(dense);
    expect(render(Switch, { props: {} }).body).not.toMatch(dense);
});

test('RadioGroup passes dense to every radio', () => {
    const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }];
    const body = render(RadioGroup, { props: { options, dense: true } }).body;
    expect(body.match(/data-dense/g)?.length).toBe(2);
    expect(render(RadioGroup, { props: { options } }).body).not.toContain('data-dense');
});
