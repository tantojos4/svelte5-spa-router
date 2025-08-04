<script>
	import Router from '../lib/Router.svelte';
	import Link from '../lib/Link.svelte';
	import { goto, routeParams, queryParams, router } from '../lib/routers.js';

	// Sample components for demo
	import Home from './demo/Home.svelte';
	import About from './demo/About.svelte';
	import Blog from './demo/Blog.svelte';
	import BlogPost from './demo/BlogPost.svelte';
	import UserProfile from './demo/UserProfile.svelte';
	import Search from './demo/Search.svelte';
	import NotFound from './demo/NotFound.svelte';
	import ProtectedRoute from './demo/ProtectedRoute.svelte';

	// Route guard example: simple authentication check
	function authGuard(to, from) {
		console.log(`Route guard: navigating from ${from} to ${to}`);
		
		// Simulate authentication check
		const isAuthenticated = localStorage.getItem('user') !== null;
		
		if (!isAuthenticated) {
			alert('Access denied! Please login first.');
			return false; // Block navigation
		}
		
		console.log('Route guard: access granted');
		return true; // Allow navigation
	}

	// Async route guard example
	async function asyncAuthGuard(to, from) {
		console.log(`Async route guard: navigating from ${from} to ${to}`);
		
		// Simulate async authentication check (API call)
		return new Promise((resolve) => {
			setTimeout(() => {
				const isAuthenticated = localStorage.getItem('user') !== null;
				if (!isAuthenticated) {
					alert('Async check: Access denied! Please login first.');
					resolve(false);
				} else {
					console.log('Async route guard: access granted');
					resolve(true);
				}
			}, 500); // Simulate API delay
		});
	}

	const routes = [
		{ path: '/', component: Home },
		{ path: '/about', component: About },
		{ path: '/blog', component: Blog },
		{ path: '/blog/:id', component: BlogPost },
		{ path: '/user/:id', component: UserProfile },
		{ path: '/search/:query?', component: Search }
	];

	// Routes with guards - using manual addRoute for demonstration
	function setupRoutesWithGuards() {
		// Clear existing routes
		router.clearRoutes();
		
		// Add regular routes
		routes.forEach(route => {
			router.addRoute(route.path, route.component);
		});
		
		// Add protected routes with guards
		router.addRoute('/protected', ProtectedRoute, { beforeEnter: authGuard });
		router.addRoute('/admin/:id?', ProtectedRoute, { beforeEnter: asyncAuthGuard });
		
		// Set fallback
		router.setFallback(NotFound);
	}

	// Initialize routes with guards
	setupRoutesWithGuards();

	function navigateToBlog() {
		goto('/blog/my-first-post');
	}

	function navigateWithQuery() {
		goto('/search', { q: 'svelte', category: 'frontend' });
	}

	function navigateToProtected() {
		goto('/protected');
	}

	function navigateToAdmin() {
		goto('/admin/123');
	}

	function simulateLogin() {
		localStorage.setItem('user', JSON.stringify({ name: 'John Doe', role: 'admin' }));
		alert('Login successful! Now try accessing protected routes.');
	}

	function simulateLogout() {
		localStorage.removeItem('user');
		alert('Logged out! Protected routes will now be blocked.');
	}

	function searchBlog() {
		goto('/blog', { search: 'router' });
	}
</script>

<div class="app">
	<header>
		<h1>Svelte 5 SPA Router Demo</h1>
		<nav>
			<Link href="/">Home</Link>
			<Link href="/about">About</Link>
			<Link href="/blog">Blog</Link>
			<Link href="/user/123">User Profile</Link>
			<Link href="/search">Search</Link>
			<button onclick={navigateToBlog}>Go to Blog Post</button>
			<button onclick={navigateWithQuery}>Search with Query</button>
			<button onclick={searchBlog}>Search Blog</button>
		</nav>
		
		<!-- Route Guard Demo Section -->
		<div class="auth-demo">
			<h3>🔐 Route Guard Demo</h3>
			<div class="auth-controls">
				<button onclick={simulateLogin} class="login-btn">Simulate Login</button>
				<button onclick={simulateLogout} class="logout-btn">Simulate Logout</button>
			</div>
			<div class="protected-links">
				<button onclick={navigateToProtected} class="protected-btn">Protected Route (Sync Guard)</button>
				<button onclick={navigateToAdmin} class="protected-btn">Admin Route (Async Guard)</button>
			</div>
		</div>
	</header>

	<main>
		<Router {routes} fallback={NotFound} />
	</main>

	<footer>
		<div class="debug-info">
			<h3>Debug Info:</h3>
			<p>Route Params: {JSON.stringify($routeParams)}</p>
			<p>Query Params: {JSON.stringify($queryParams)}</p>
		</div>
	</footer>
</div>

<style>
	.app {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
	}

	header {
		border-bottom: 1px solid #e0e0e0;
		padding-bottom: 1rem;
		margin-bottom: 2rem;
	}

	nav {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-top: 1rem;
	}

	nav :global(a) {
		text-decoration: none;
		color: #007acc;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	nav :global(a:hover) {
		background-color: #f0f0f0;
	}

	nav :global(a.active) {
		background-color: #007acc;
		color: white;
	}

	button {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background: #005a99;
	}

	.auth-demo {
		background: #f8f9fa;
		padding: 15px;
		border-radius: 8px;
		margin-top: 15px;
		border: 2px solid #dee2e6;
	}

	.auth-demo h3 {
		margin: 0 0 10px 0;
		color: #495057;
	}

	.auth-controls {
		margin-bottom: 10px;
	}

	.login-btn {
		background: #28a745;
		margin-right: 10px;
	}

	.login-btn:hover {
		background: #218838;
	}

	.logout-btn {
		background: #dc3545;
	}

	.logout-btn:hover {
		background: #c82333;
	}

	.protected-btn {
		background: #6f42c1;
		margin-right: 10px;
		margin-top: 5px;
	}

	.protected-btn:hover {
		background: #5a32a3;
	}

	.debug-info {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 2rem;
		font-family: monospace;
		font-size: 0.9rem;
	}
</style>
