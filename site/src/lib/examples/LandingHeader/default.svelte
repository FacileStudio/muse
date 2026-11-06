<script lang="ts">
    import { LandingHeader, icons } from '@facile/muse';
</script>

<div class="h-72 overflow-auto rounded-fc-lg bg-fc-page">
    <LandingHeader
        appName="Muse"
        icon={icons.paletteMark}
        links={[
            { href: '#features', label: 'Features', active: true },
            { href: '#pricing', label: 'Pricing' }
        ]}
    />
    <div class="h-[40rem]"></div>
</div>
