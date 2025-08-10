<script>
	import { router, currentRoute } from '../../lib/routers.js';
	import NestedParent from './NestedParent.svelte';
	import NestedChild from './NestedChild.svelte';

	// Register nested/group route
	router.clearRoutes();
	router.addRoute({
		path: '/nested',
		component: NestedParent,
		children: [
			{
				path: 'child',
				component: NestedChild
			}
		]
	});
</script>

<h1>Demo Nested/Group Routing</h1>
<ul>
	<li><a href="/nested">Parent Only</a></li>
	<li><a href="/nested/child">Parent + Child</a></li>
</ul>

<!-- Render current route branch -->
{#if $currentRoute.branch && $currentRoute.branch.length > 0 && $currentRoute.branch[0].component}
	<svelte:component
		this={$currentRoute.branch[0].component}
		childComponent={$currentRoute.branch.length > 1 && $currentRoute.branch[1].component
			? $currentRoute.branch[1].component
			: null}
	/>
{:else}
	<p>Tidak ada route yang cocok.</p>
{/if}
