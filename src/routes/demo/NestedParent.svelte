<script>
	/**
	 * @type {typeof import('svelte').SvelteComponent | null}
	 */
	export let childComponent = null;
</script>

<div style="border:2px solid #0077cc; padding:1em; margin:1em 0;">
	<h2>Nested Parent</h2>
	<p>Ini adalah parent route. Di bawah ini adalah child route:</p>
	{#if childComponent && typeof childComponent === 'function'}
		<svelte:component this={childComponent} />
	{/if}
</div>
