<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { currentRoute, router } from './router.js';

	let { routes = [], fallback = null } = $props();

	let currentPath = $state('/');
	let currentComponent = $state(null);
	let routeParams = $state({});

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

		return unsubscribe;
	});
</script>

{#if currentComponent && typeof currentComponent === 'function'}
	<svelte:component this={currentComponent} params={routeParams} />
{:else if fallback && typeof fallback === 'function'}
	<svelte:component this={fallback} />
{:else}
	<div>Loading...</div>
{/if}
