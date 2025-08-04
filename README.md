## 🔒 Route Guards: Auth, Async, Role-based (beforeEnter)

Svelte5 SPA Router mendukung route guard berbasis fungsi `beforeEnter` pada setiap route. Anda bisa membuat guard untuk autentikasi, async check, maupun role-based (admin/user).

### Contoh Penggunaan

```svelte
<script>
	import Router from 'svelte5-spa-router/Router.svelte';
	import Link from 'svelte5-spa-router/Link.svelte';
	import { goto } from 'svelte5-spa-router';
	import ProtectedPage from './ProtectedPage.svelte';
	import AdminPanel from './AdminPanel.svelte';
	import Home from './Home.svelte';

	// Guard: hanya user login
	function authGuard(to, from) {
		const isAuthenticated = localStorage.getItem('user') !== null;
		if (!isAuthenticated) {
			alert('Access denied! Please login first.');
			return false;
		}
		return true;
	}

	// Guard: async (misal cek token ke server)
	async function asyncAuthGuard(to, from) {
		return new Promise((resolve) => {
			setTimeout(() => {
				const isAuthenticated = localStorage.getItem('user') !== null;
				resolve(isAuthenticated);
			}, 300);
		});
	}

	// Guard: hanya admin
	function roleGuard(to, from) {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		if (user.role !== 'admin') {
			alert('Only admin can access this route!');
			return false;
		}
		return true;
	}

	const routes = [
		{ path: '/', component: Home },
		{ path: '/protected', component: ProtectedPage, beforeEnter: authGuard },
		{ path: '/admin/:id?', component: ProtectedPage, beforeEnter: asyncAuthGuard },
		{ path: '/admin-panel', component: AdminPanel, beforeEnter: roleGuard }
	];

	function simulateLogin(role = 'user') {
		const name = role === 'admin' ? 'John Admin' : 'Jane User';
		localStorage.setItem('user', JSON.stringify({ name, role }));
		alert(`Login as ${role} successful!`);
	}
	function simulateLogout() {
		localStorage.removeItem('user');
		alert('Logged out!');
		goto('/');
	}
</script>

<div>
	<button on:click={() => simulateLogin('admin')}>Login as Admin</button>
	<button on:click={() => simulateLogin('user')}>Login as User</button>
	<button on:click={simulateLogout}>Logout</button>
	<nav>
		<Link href="/">Home</Link>
		<Link href="/protected">Protected</Link>
		<Link href="/admin/123">Admin Async</Link>
		<Link href="/admin-panel">Admin Panel</Link>
	</nav>
	<Router {routes} />
</div>

// ProtectedPage.svelte dan AdminPanel.svelte bisa berupa halaman biasa.
```

#### Penjelasan

- `beforeEnter`: Fungsi (sync/async) yang dijalankan sebelum route diakses. Return `true` untuk lanjut, `false` untuk blokir.
- `authGuard`: Hanya user login yang bisa akses.
- `asyncAuthGuard`: Contoh guard async (misal cek token ke server).
- `roleGuard`: Hanya user dengan `role: 'admin'` yang bisa akses.
- Simulasi login/logout menggunakan localStorage.

#### Hasil Demo

- Login sebagai **user**: Bisa akses `/protected` dan `/admin/123`, tidak bisa `/admin-panel`.
- Login sebagai **admin**: Semua route bisa diakses.

Lihat file `src/routes/demo.svelte` untuk demo lengkap.

# 🆕 v1.1.8 & v1.1.9: Reactive locationStore for Layout Control

## New: `locationStore` for Layout Reactivity

You can now use a reactive Svelte store to track the current location (pathname, search, hash) for advanced layout logic (e.g. sidebar, header, breadcrumbs) in your app:

```js
import { locationStore } from 'svelte5-spa-router';
$: $locationStore.pathname; // Reacts to path changes
```

**locationStore** is always up-to-date with browser navigation, pushState, replaceState, and popstate events.

## Example: Hide Sidebar on Login Page

```svelte
<script>
	import { locationStore } from 'svelte5-spa-router';
	$: hideSidebar = $locationStore.pathname === '/login';
</script>

{#if !hideSidebar}
	<Sidebar />
{/if}
```

---

## Changelog (Recent)

- **v1.1.9**: Clean import order, fix TDZ, ensure clean state, publish locationStore
- **v1.1.8**: Add and export locationStore for layout reactivity
- **v1.1.7**: Fix optional param bug in matchRoute
- **v1.1.0+**: Universal SPA router, Svelte 5 compatible

---

# Svelte 5 SPA Router – Universal Routing Example

## 🚀 Quick Start

> **Important for Universal SPA:**
> To ensure routing works on all paths (e.g. `/login`, `/about`), make sure your static server rewrites all requests to `index.html` (see Troubleshooting below).

### 1. Install

```bash
npm install svelte5-spa-router
```

### 2. Definisikan Route dan Komponen (REKOMENDASI UTAMA)

### 2. Define Routes and Components (RECOMMENDED)

```svelte
<script>
	import Router from 'svelte5-spa-router/Router.svelte';
	import Link from 'svelte5-spa-router/Link.svelte';
	import { goto, routeParams, queryParams } from 'svelte5-spa-router';

	import Home from './Home.svelte';
	import About from './About.svelte';
	import Blog from './Blog.svelte';
	import BlogPost from './BlogPost.svelte';
	import UserProfile from './UserProfile.svelte';
	import Search from './Search.svelte';
	import NotFound from './NotFound.svelte';

	// Array-based config (recommended for all universal SPAs)
	const routes = [
		{ path: '/', component: Home },
		{ path: '/about', component: About },
		{ path: '/blog', component: Blog },
		{ path: '/blog/:id', component: BlogPost },
		{ path: '/user/:id', component: UserProfile },
		{ path: '/search/:query?', component: Search }
	];

	function navigateToBlog() {
		goto('/blog/my-first-post');
	}
	function navigateWithQuery() {
		goto('/search', { q: 'svelte', category: 'frontend' });
	}
	function searchBlog() {
		goto('/blog', { search: 'router' });
	}
</script>

<nav>
	<Link href="/">Home</Link>
	<Link href="/about">About</Link>
	<Link href="/blog">Blog</Link>
	<Link href="/user/123">User Profile</Link>
	<Link href="/search">Search</Link>
	<button on:click={navigateToBlog}>Go to Blog Post</button>
	<button on:click={navigateWithQuery}>Search with Query</button>
	<button on:click={searchBlog}>Search Blog</button>
</nav>

<Router {routes} fallback={NotFound} />

<!-- Access params in your component -->
<p>Route Params: {JSON.stringify($routeParams)}</p>
<p>Query Params: {JSON.stringify($queryParams)}</p>
```

---

#### Note:

- **The array-based config above is the default and most recommended for universal SPAs.**
- The imperative way (`router.addRoute`) is only for advanced use-cases (e.g. dynamic/plugin route injection), not needed for most apps.

---

- Always import from the package (`svelte5-spa-router`), not from `src/lib/`.
- To access params, use `$routeParams` and `$queryParams` in your template.
- No SvelteKit required, works directly with Vite + Svelte 5.

---

# 🚀 Svelte 5 SPA Router on SvelteKit runes support

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

### Basic Setup

```svelte
<!-- App.svelte -->
<script>
	import Router from 'svelte5-spa-router/Router.svelte';
	import Link from 'svelte5-spa-router/Link.svelte';
	import { router } from 'svelte5-spa-router';

	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import UserProfile from './routes/UserProfile.svelte';
	import NotFound from './routes/NotFound.svelte';

	// Setup routes
	router.addRoute('/', Home);
	router.addRoute('/about', About);
	router.addRoute('/user/:id', UserProfile);
	router.setFallback(NotFound);
</script>

<nav>
	<Link href="/">Home</Link>
	<Link href="/about">About</Link>
	<Link href="/user/123">User Profile</Link>
</nav>

<Router />
```

### Available Imports

```javascript
// Components
import Router from 'svelte5-spa-router/Router.svelte';
import Link from 'svelte5-spa-router/Link.svelte';

// Router instance and functions
import {
	router, // Main router instance
	goto, // Programmatic navigation
	getQueryParam, // Get query parameter
	updateQueryParams // Update query params
} from 'svelte5-spa-router';

// Reactive stores
import {
	currentRoute, // Current route info
	routeParams, // Route parameters
	queryParams, // Query parameters
	hashFragment // Hash fragment
} from 'svelte5-spa-router';
```

## 🛣️ Route Setup

### Setting Up Routes

```javascript
import { router } from 'svelte5-spa-router';
import Home from './components/Home.svelte';
import About from './components/About.svelte';
import UserProfile from './components/UserProfile.svelte';
import BlogPost from './components/BlogPost.svelte';
import Search from './components/Search.svelte';
import AdminPanel from './components/AdminPanel.svelte';
import NotFound from './components/NotFound.svelte';

// Static Routes
router.addRoute('/', Home);
router.addRoute('/about', About);

// Dynamic Routes with Parameters
router.addRoute('/user/:id', UserProfile);
router.addRoute('/blog/:slug', BlogPost);
router.addRoute('/category/:type/item/:id', ItemDetail);

// Optional Parameters
router.addRoute('/search/:query?', Search);

// Wildcard Routes
router.addRoute('/admin/*', AdminPanel);

// Set fallback for 404
router.setFallback(NotFound);
```

## 🧭 Navigation

### Using Link Component

```svelte
<script>
	import Link from 'svelte5-spa-router/Link.svelte';
</script>

<Link href="/about">About Us</Link>
<Link href="/user/123">User Profile</Link>
<Link href="/search?q=svelte">Search Svelte</Link>
<Link href="/docs#introduction">Documentation</Link>
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

// Combined
goto('/search', { q: 'svelte', category: 'frontend' }, 'results');
```

## 📊 Accessing Route Data

### Route Parameters

```svelte
<script>
	import { routeParams } from 'svelte5-spa-router';

	// Access route parameters reactively
	const userId = $derived($routeParams.id);
	const allParams = $derived($routeParams);
</script>

<h1>User Profile: {userId}</h1><p>All params: {JSON.stringify(allParams)}</p>
```

### Query Parameters

```svelte
<script>
	import { queryParams, getQueryParam, updateQueryParams } from 'svelte5-spa-router';

	// Get single parameter with default
	const searchQuery = $derived(getQueryParam('q', ''));

	// Get all parameters
	const allQueryParams = $derived($queryParams);

	// Update query parameters
	function updateSearch(newQuery) {
		updateQueryParams({ q: newQuery });
	}

	// Replace all query parameters
	function setFilters() {
		updateQueryParams({ category: 'tech', sort: 'date' }, true);
	}
</script>

<input bind:value={searchQuery} onchange={() => updateSearch(searchQuery)} />
<p>Current query: {searchQuery}</p>
<p>All params: {JSON.stringify(allQueryParams)}</p>
```

### Hash Fragments

```svelte
<script>
	import { hashFragment } from 'svelte5-spa-router';

	const currentHash = $derived($hashFragment);
</script>

<p>Current hash: {currentHash}</p>
```

## 🔧 API Reference

### Components

### Components

#### `<Router>`

Main router component that renders the current route based on the URL.

**Usage:**

```svelte
<script>
	import Router from 'svelte5-spa-router/Router.svelte';
	import { router } from 'svelte5-spa-router';

	// Setup your routes first
	router.addRoute('/', HomeComponent);
	router.setFallback(NotFoundComponent);
</script>

<Router />
```

#### `<Link>`

Link component with automatic active state handling and proper navigation.

**Props:**

- `href` (string): Target URL
- `class` (string, optional): CSS class for the link

**Usage:**

```svelte
<script>
	import Link from 'svelte5-spa-router/Link.svelte';
</script>

<Link href="/about" class="nav-link">About</Link>
```

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

## 🎨 Styling Links

```svelte
<script>
	import Link from 'svelte5-spa-router/Link.svelte';
</script>

<Link href="/" class="nav-link">Home</Link>

<style>
	:global(.nav-link) {
		text-decoration: none;
		color: #007acc;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	:global(.nav-link:hover) {
		background-color: #f0f0f0;
	}
</style>
```

## 🔒 Route Guards (Custom Implementation)

```svelte
<!-- App.svelte -->
<script>
	import Router from 'svelte5-spa-router/Router.svelte';
	import { currentRoute, goto, router } from 'svelte5-spa-router';

	const protectedRoutes = ['/dashboard', '/profile'];

	// Route guard
	$effect(() => {
		if ($currentRoute && protectedRoutes.includes($currentRoute.path)) {
			if (!isAuthenticated()) {
				goto('/login');
			}
		}
	});

	function isAuthenticated() {
		// Your authentication logic
		return localStorage.getItem('token') !== null;
	}
</script>

<Router />
```

## 🧪 Testing

```javascript
// vitest example
import { render, fireEvent } from '@testing-library/svelte';
import { goto, router } from 'svelte5-spa-router';
import Home from '../components/Home.svelte';
import About from '../components/About.svelte';
import App from '../App.svelte';

beforeEach(() => {
	// Setup routes for testing
	router.clearRoutes();
	router.addRoute('/', Home);
	router.addRoute('/about', About);
});

test('should navigate to about page', async () => {
	const { getByText } = render(App);

	await fireEvent.click(getByText('About'));
	expect(getByText('About Page')).toBeInTheDocument();
});

test('should handle dynamic routes', async () => {
	router.addRoute('/user/:id', UserProfile);
	goto('/user/123');

	const { getByText } = render(App);
	expect(getByText('User ID: 123')).toBeInTheDocument();
});
```

## 🔄 Migration from Other Routers

### From svelte-spa-router

```diff
- import router from 'svelte-spa-router'
+ import Router from 'svelte5-spa-router/Router.svelte'
+ import { router } from 'svelte5-spa-router'

- <Router {routes} />
+ // Setup routes first
+ router.addRoute('/', HomeComponent);
+ router.setFallback(NotFoundComponent);
+ <Router />
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
<!-- src/app.html or main component -->
<script>
	import Router from 'svelte5-spa-router/Router.svelte';
	import { router } from 'svelte5-spa-router';
	import Home from './routes/Home.svelte';
	import About from './routes/About.svelte';
	import NotFound from './routes/NotFound.svelte';

	// Setup routes
	router.addRoute('/', Home);
	router.addRoute('/about', About);
	router.setFallback(NotFound);
</script>

<Router />
```

## 🐛 Troubleshooting

### Link Tidak Bekerja Saat Diklik

1. Pastikan import Link seperti ini:
   ```svelte
   import Link from 'svelte5-spa-router/Link.svelte';
   ```
2. Gunakan `<Link href="/about">About</Link>`, bukan `<a>` biasa.
3. Pastikan tidak ada elemen lain (overlay/z-index) yang menutupi Link.
4. Cek console browser untuk error JS.

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

[Report Bug](https://github.com/tantojos4/svelte5-spa-router/issues) • [Request Feature](https://github.com/tantojos4/svelte5-spa-router/issues) • [Documentation](https://github.com/tantojos4/svelte5-spa-router#readme)

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
