<script lang="ts">
	const WIDTHS = [360, 390, 768, 1024, 1440];
	const HEIGHT = 900;

	type Report = { width: number; scrollWidth: number; offenders: unknown[]; sidebar: string };

	let reports = $state<Record<number, Report>>({});

	function ok(report: Report): boolean {
		return (
			report.scrollWidth <= report.width &&
			report.offenders.length === 0 &&
			report.sidebar !== 'below-fold' &&
			!report.sidebar.startsWith('page-scrolled')
		);
	}

	$effect(() => {
		const onMessage = (event: MessageEvent) => {
			const report = event.data?.overflowProbe as Report | undefined;
			if (report) reports[report.width] = report;
		};
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	});

	const done = $derived(WIDTHS.every((width) => reports[width]));
	const verdict = $derived(!done ? 'pending' : WIDTHS.every((width) => ok(reports[width])) ? 'pass' : 'fail');
</script>

<output id="overflow-report" data-overflow={verdict}>{done ? JSON.stringify(reports) : ''}</output>

{#each WIDTHS as width (width)}
	<iframe title="Overflow probe at {width}px" src="/overflow/frame" {width} height={HEIGHT} class="block border-0"></iframe>
{/each}
