# Svelte 5 SPA Router

A simple and flexible SPA router for Svelte 5 with runes support.

## Features

- Dynamic routing with parameters (`:id`)
- Wildcard routes (`/*`)
- Optional parameters (`:id?`)
- Query parameters support
- Hash fragment support
- Programmatic navigation
- Browser history support (back/forward buttons)
- Automatic link interception

## Installation

Copy the `lib` folder to your Svelte project or install as a package.

## Basic Usage

```svelte
<!-- App.svelte -->
<script>
	import Router from './lib/Router.svelte';
	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import Blog from './routes/Blog.svelte';
	import NotFound from './routes/NotFound.svelte';

	const routes = [
		{ path: '/', component: Home },
		{ path: '/about', component: About },
		{ path: '/blog', component: Blog },
		{ path: '/blog/:id', component: Blog }
	];
</script>

<Router {routes} fallback={NotFound} />
```

## Route Parameters

Routes can include parameters:

```javascript
const routes = [
	{ path: '/user/:id', component: UserProfile },
	{ path: '/blog/:slug', component: BlogPost },
	{ path: '/category/:type/item/:id', component: Item }
];
```

Access parameters in your components:

```svelte
<!-- UserProfile.svelte -->
<script>
	import { routeParams } from './lib/router.js';

	let { params = {} } = $props();

	// Or use the store
	$: userId = $routeParams.id;
</script>

<h1>User Profile: {params.id}</h1>
```

## Wildcard Routes

```javascript
const routes = [{ path: '/admin/*', component: AdminPanel }];
```

## Optional Parameters

```javascript
const routes = [{ path: '/search/:query?', component: Search }];
```

## Programmatic Navigation

```javascript
import { goto } from './lib/router.js';

// Simple navigation
goto('/about');

// With query parameters
goto('/search', { q: 'svelte', page: '1' });

// With hash
goto('/docs', {}, 'introduction');
```

## Query Parameters

```javascript
import { queryParams, getQueryParam } from './lib/router.js';

// Get query parameter
const searchQuery = getQueryParam('q', 'default');

// Access all query parameters
$: allParams = $queryParams;
```

## Link Component

Use the provided Link component for navigation:

```svelte
<script>
	import Link from './lib/Link.svelte';
</script>

<Link href="/about">About Us</Link>
<Link href="/blog/123">Blog Post</Link>
```

## Stores

The router provides several stores:

- `currentRoute`: Current route information
- `routeParams`: Parameters from the current route
- `queryParams`: Query string parameters
- `hashFragment`: Current hash fragment

```svelte
<script>
	import { currentRoute, routeParams, queryParams } from './lib/router.js';
</script>

<p>Current path: {$currentRoute.path}</p>
<p>Route params: {JSON.stringify($routeParams)}</p>
<p>Query params: {JSON.stringify($queryParams)}</p>
```

## Advanced Example

```svelte
<script>
	import Router from './lib/Router.svelte';
	import { goto } from './lib/router.js';

	// Import your components
	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import Blog from './routes/Blog.svelte';
	import BlogPost from './routes/BlogPost.svelte';
	import UserProfile from './routes/UserProfile.svelte';
	import Admin from './routes/Admin.svelte';
	import NotFound from './routes/NotFound.svelte';

	const routes = [
		// Static routes
		{ path: '/', component: Home },
		{ path: '/about', component: About },
		{ path: '/blog', component: Blog },

		// Dynamic routes
		{ path: '/blog/:slug', component: BlogPost },
		{ path: '/user/:id', component: UserProfile },
		{ path: '/user/:id/settings', component: UserSettings },

		// Optional parameters
		{ path: '/search/:query?', component: Search },

		// Wildcard routes
		{ path: '/admin/*', component: Admin }
	];

	function handleNavigation() {
		goto('/blog/my-awesome-post');
	}
</script>

<nav>
	<Link href="/">Home</Link>
	<Link href="/about">About</Link>
	<Link href="/blog">Blog</Link>
	<button on:click={handleNavigation}>Go to Blog Post</button>
</nav>

<Router {routes} fallback={NotFound} />
```

## Route Guards (Coming Soon)

Future versions will support route guards for authentication and authorization.

## License

MIT
