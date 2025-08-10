<script>
	import { routeParams, queryParams } from '../../lib/routers.js';
	export let grandchildComponent = null;
	export let grandchildParams = {};
</script>

<div style="border:1.5px dashed #009688; padding:1em; margin:1em 0;">
	<h3>Multi Child</h3>
	<p>Params: {JSON.stringify($routeParams)}</p>
	<p>Query: {JSON.stringify($queryParams)}</p>
	{#if grandchildComponent}
		<svelte:component this={grandchildComponent} {grandchildParams} />
	{/if}
</div>
