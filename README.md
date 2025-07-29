# 🚀 Svelte 5 SPA Router

[![npm version](https://badge.fury.io/js/svelte5-spa-router.svg)](https://badge.fury.io/js/svelte5-spa-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple, flexible, and lightweight SPA router specifically designed for **Svelte 5** with **runes** support.

## ✨ Features

- 🎯 **Svelte 5 Native**: Built from ground up for Svelte 5 with runes
- 🛣️ **Dynamic Routing**: Support for parameters (`:id`), optional parameters (`:id?`), and wildcards (`/*`)
- ❓ **Query Parameters**: Full support for URL query strings and hash fragments
- 🔄 **Programmatic Navigation**: Navigate with `goto()` function and reactive stores
- 📱 **Browser History**: Full back/forward button support with automatic link interception
- 🏗️ **SSR Compatible**: Works perfectly with SvelteKit and server-side rendering
- 📦 **TypeScript Ready**: Fully typed for better developer experience
- 🪶 **Lightweight**: Zero external dependencies, minimal bundle size

## 📦 Installation

```bash
npm install svelte5-spa-router
# or
yarn add svelte5-spa-router
# or
pnpm add svelte5-spa-router
```

## 🎯 Quick Start

```svelte
<!-- App.svelte -->
<script>
	import { Router, Link } from 'svelte5-spa-router';
	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import NotFound from './routes/NotFound.svelte';

	const routes = [
		{ path: '/', component: Home },
		{ path: '/about', component: About },
		{ path: '/user/:id', component: UserProfile }
	];
</script>

<nav>
	<Link href="/">Home</Link>
	<Link href="/about">About</Link>
</nav>

<Router {routes} fallback={NotFound} />
```

## 🛣️ Route Types

### Static Routes

```javascript
{ path: '/', component: Home }
{ path: '/about', component: About }
```

### Dynamic Routes with Parameters

```javascript
{ path: '/user/:id', component: UserProfile }
{ path: '/blog/:slug', component: BlogPost }
{ path: '/category/:type/item/:id', component: Item }
```

### Optional Parameters

```javascript
{ path: '/search/:query?', component: Search }
```

### Wildcard Routes

```javascript
{ path: '/admin/*', component: AdminPanel }
```

## 🧭 Navigation

### Using Link Component

```svelte
<script>
	import { Link } from 'svelte5-spa-router';
</script>

<Link href="/about">About Us</Link>
<Link href="/user/123">User Profile</Link>
```

### Programmatic Navigation

```javascript
import { goto } from 'svelte5-spa-router';

// Simple navigation
goto('/about');

// With query parameters
goto('/search', { q: 'svelte', page: '1' });

// With hash fragment
goto('/docs', {}, 'introduction');
```

## 📊 Accessing Route Data

### Route Parameters

```svelte
<script>
	import { routeParams } from 'svelte5-spa-router';

	let { params = {} } = $props();

	// From props (recommended)
	const userId = $derived(params.id);

	// From store
	const userIdFromStore = $derived($routeParams.id);
</script>

<h1>User Profile: {userId}</h1>
```

### Query Parameters

```svelte
<script>
	import { queryParams, getQueryParam } from 'svelte5-spa-router';

	// Get single parameter with default
	const searchQuery = $derived(getQueryParam('q', ''));

	// Get all parameters
	const allQueryParams = $derived($queryParams);
</script>
```

## 🔧 API Reference

### Components

#### `<Router>`

Main router component that renders matched routes.

**Props:**

- `routes` (Array): Array of route objects `{ path: string, component: Component }`
- `fallback` (Component, optional): Component to show for unmatched routes

#### `<Link>`

Link component with automatic active state handling.

**Props:**

- `href` (string): Target URL
- `activeClass` (string, optional): CSS class for active links

### Functions

#### `goto(path, queryParams?, hash?)`

Navigate programmatically.

- `path`: Target path
- `queryParams`: Object of query parameters
- `hash`: Hash fragment

#### `getQueryParam(key, defaultValue?)`

Get a specific query parameter.

#### `updateQueryParams(params, replace?)`

Update URL query parameters without navigation.

### Stores

All stores are reactive and can be used with `$` syntax:

- `currentRoute`: Current route information `{ path, component, params }`
- `routeParams`: Parameters from current route
- `queryParams`: Current query parameters object
- `hashFragment`: Current hash fragment string

## 🎨 Styling Active Links

```svelte
<Link href="/" activeClass="router-link-active">Home</Link>

<style>
	:global(.router-link-active) {
		font-weight: bold;
		color: #007acc;
	}
</style>
```

## 🔒 Route Guards (Custom Implementation)

```svelte
<!-- App.svelte -->
<script>
	import { Router, currentRoute, goto } from 'svelte5-spa-router';

	const protectedRoutes = ['/dashboard', '/profile'];

	// Route guard
	$effect(() => {
		if ($currentRoute && protectedRoutes.includes($currentRoute.path)) {
			if (!isAuthenticated()) {
				goto('/login');
			}
		}
	});
</script>
```

## 🧪 Testing

```javascript
// vitest example
import { render, fireEvent } from '@testing-library/svelte';
import { goto } from 'svelte5-spa-router';
import App from '../App.svelte';

test('should navigate to about page', async () => {
	const { getByText } = render(App);

	await fireEvent.click(getByText('About'));
	expect(getByText('About Page')).toBeInTheDocument();
});

test('should handle dynamic routes', async () => {
	goto('/user/123');
	const { getByText } = render(App);
	expect(getByText('User ID: 123')).toBeInTheDocument();
});
```

## 🔄 Migration from Other Routers

### From svelte-spa-router

```diff
- import router from 'svelte-spa-router'
+ import { Router } from 'svelte5-spa-router'

- <Router {routes} />
+ <Router {routes} fallback={NotFound} />
```

### From @roxi/routify

```diff
- import { router } from '@roxi/routify'
+ import { goto } from 'svelte5-spa-router'

- $router.goto('/path')
+ goto('/path')
```

## 🏗️ SvelteKit Integration

This router works perfectly with SvelteKit for client-side routing:

```svelte
<!-- src/app.html -->
<script>
	import { Router } from 'svelte5-spa-router';
	// Your routes and components
</script>

<Router {routes} fallback={NotFound} />
```

## 🐛 Troubleshooting

### SSR Issues

Make sure you're importing from the correct path and the router handles SSR automatically.

### Route Not Matching

Check your route patterns and ensure they match the URL structure exactly.

### Active Links Not Working

Ensure you're using the `Link` component and not regular `<a>` tags.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the amazing Svelte 5 and its new runes system
- Inspired by various SPA routers in the ecosystem
- Thanks to the Svelte community for feedback and suggestions

---

**Made with ❤️ for the Svelte community**

[Report Bug](https://github.com/yourusername/svelte5-spa-router/issues) • [Request Feature](https://github.com/yourusername/svelte5-spa-router/issues) • [Documentation](https://github.com/yourusername/svelte5-spa-router#readme)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm run package
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
