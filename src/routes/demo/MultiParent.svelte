<script>
	import { routeParams, queryParams } from '../../lib/routers.js';
	export let childComponent = null;
	export let childParams = {};
</script>

<div style="border:2px solid #009688; padding:1em; margin:1em 0;">
	<h2>Multi Parent</h2>
	<p>Params: {JSON.stringify($routeParams)}</p>
	<p>Query: {JSON.stringify($queryParams)}</p>
	{#if childComponent}
		<svelte:component this={childComponent} {childParams} />
	{/if}
</div>
