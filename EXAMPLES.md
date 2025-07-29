# Examples

This folder contains various examples of how to use the Svelte 5 SPA Router.

## Basic Example

```svelte
<!-- App.svelte -->
<script>
	import { Router, Link } from 'svelte5-spa-router';
	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import NotFound from './routes/NotFound.svelte';

	const routes = [
		{ path: '/', component: Home },
		{ path: '/about', component: About }
	];
</script>

<nav>
	<Link href="/">Home</Link>
	<Link href="/about">About</Link>
</nav>

<Router {routes} fallback={NotFound} />
```

## Advanced Example with Parameters

```svelte
<!-- App.svelte -->
<script>
	import { Router, Link, goto } from 'svelte5-spa-router';
	import Home from './routes/Home.svelte';
	import User from './routes/User.svelte';
	import Blog from './routes/Blog.svelte';
	import BlogPost from './routes/BlogPost.svelte';
	import Search from './routes/Search.svelte';
	import Admin from './routes/Admin.svelte';
	import NotFound from './routes/NotFound.svelte';

	const routes = [
		// Static routes
		{ path: '/', component: Home },
		{ path: '/blog', component: Blog },

		// Dynamic routes
		{ path: '/user/:id', component: User },
		{ path: '/blog/:slug', component: BlogPost },

		// Optional parameters
		{ path: '/search/:query?', component: Search },

		// Wildcard routes
		{ path: '/admin/*', component: Admin }
	];

	function navigateToUser(userId) {
		goto(`/user/${userId}`);
	}

	function searchWithQuery(query) {
		goto('/search', { q: query, filter: 'all' });
	}
</script>

<nav>
	<Link href="/">Home</Link>
	<Link href="/blog">Blog</Link>
	<Link href="/user/123">User Profile</Link>
	<button on:click={() => navigateToUser('456')}> Go to User 456 </button>
	<button on:click={() => searchWithQuery('svelte')}> Search Svelte </button>
</nav>

<Router {routes} fallback={NotFound} />
```

## Route Component with Parameters

```svelte
<!-- routes/User.svelte -->
<script>
	import { routeParams, queryParams } from 'svelte5-spa-router';

	// Get parameters from props (recommended)
	let { params = {} } = $props();

	// Or from store
	$: userId = params.id || $routeParams.id;
	$: userName = $queryParams.name || 'Unknown';
</script>

<h1>User Profile</h1><p>User ID: {userId}</p><p>User Name: {userName}</p>
```

## Programmatic Navigation

```svelte
<script>
	import { goto, getQueryParam, updateQueryParams } from 'svelte5-spa-router';

	function handleLogin(userId) {
		// Navigate to user profile
		goto(`/user/${userId}`);
	}

	function handleSearch(query) {
		// Navigate with query parameters
		goto('/search', { q: query, type: 'posts' });
	}

	function updateFilter(filter) {
		// Update only query parameters without navigation
		updateQueryParams({ filter });
	}

	function getCurrentQuery() {
		// Get specific query parameter with default
		return getQueryParam('q', 'default search');
	}
</script>
```

## Route Guards (Custom Implementation)

```svelte
<!-- App.svelte -->
<script>
	import { Router } from 'svelte5-spa-router';
	import { currentRoute } from 'svelte5-spa-router';
	import { isAuthenticated, redirectToLogin } from './auth.js';

	const routes = [
		{ path: '/', component: Home },
		{ path: '/login', component: Login },
		{ path: '/dashboard', component: Dashboard },
		{ path: '/profile', component: Profile }
	];

	// Protected routes
	const protectedRoutes = ['/dashboard', '/profile'];

	// Route guard
	$: if ($currentRoute && protectedRoutes.includes($currentRoute.path)) {
		if (!isAuthenticated()) {
			redirectToLogin();
		}
	}
</script>

<Router {routes} fallback={NotFound} />
```

## Error Handling

```svelte
<!-- routes/NotFound.svelte -->
<script>
	import { goto } from 'svelte5-spa-router';

	function goHome() {
		goto('/');
	}

	function goBack() {
		window.history.back();
	}
</script>

<div class="error-page">
	<h1>404 - Page Not Found</h1>
	<p>The page you're looking for doesn't exist.</p>
	<p>Current URL: <code>{window.location.pathname}</code></p>

	<div class="actions">
		<button on:click={goHome}>Go Home</button>
		<button on:click={goBack}>Go Back</button>
	</div>
</div>
```

## Testing Routes

```javascript
// tests/router.test.js
import { render, fireEvent } from '@testing-library/svelte';
import { goto } from 'svelte5-spa-router';
import App from '../App.svelte';

test('should navigate to about page', async () => {
	const { getByText } = render(App);

	// Click on about link
	await fireEvent.click(getByText('About'));

	// Check if about page is rendered
	expect(getByText('About Page')).toBeInTheDocument();
});

test('should handle dynamic routes', async () => {
	// Navigate programmatically
	goto('/user/123');

	const { getByText } = render(App);
	expect(getByText('User ID: 123')).toBeInTheDocument();
});
```
