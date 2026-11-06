<script lang="ts">
    import { Select } from '@facile/muse';

    let zone = $state('paris');
</script>

<Select bind:value={zone} aria-label="Fuseau horaire">
    <optgroup label="Europe">
        <option value="paris">Paris</option>
        <option value="berlin">Berlin</option>
    </optgroup>
    <optgroup label="Amériques">
        <option value="montreal">Montréal</option>
        <option value="sao-paulo" disabled>São Paulo</option>
    </optgroup>
</Select>
