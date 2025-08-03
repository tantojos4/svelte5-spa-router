<script>
	import { onMount } from 'svelte';
	const browser = typeof window !== 'undefined';
	import { currentRoute, router } from './routers.js';

	let { routes = [], fallback = null } = $props();

	let currentPath = $state('/');
	let currentComponent = $state(null);
	let routeParams = $state({});
	let ready = $state(false);

	onMount(() => {
		if (!browser) return;

		// Clear existing routes first
		router.clearRoutes();

		// Register routes
		routes.forEach((route) => {
			router.addRoute(route.path, route.component);
		});

		// Set fallback
		if (fallback) {
			router.setFallback(fallback);
		}

		// Subscribe to route changes
		const unsubscribe = currentRoute.subscribe((routeInfo) => {
			if (routeInfo && typeof routeInfo === 'object') {
				// New format with path, component, and params
				currentPath = routeInfo.path || '/';
				currentComponent = routeInfo.component;
				routeParams = routeInfo.params || {};
			}
		});

		// Navigate to current URL after routes are registered
		router.navigateToCurrentUrl();
		ready = true;
		return unsubscribe;
	});
</script>

{#if currentComponent && typeof currentComponent === 'function'}
	{@const Component = /** @type {any} */ (currentComponent)}
	<Component params={routeParams} />
{:else if ready && fallback && typeof fallback === 'function'}
	{@const Fallback = /** @type {any} */ (fallback)}
	<Fallback />
{:else}
	<div>Loading...</div>
{/if}
