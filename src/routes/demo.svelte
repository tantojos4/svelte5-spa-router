<script>
	// Role-based guard: hanya admin yang boleh akses
	/**
	 * Role-based guard: hanya admin yang boleh akses
	 * @param {string} to - The route being navigated to
	 * @param {string} from - The route being navigated from
	 * @returns {boolean} - True to allow navigation, false to block
	 */
	function roleGuard(to, from) {
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		if (user.role !== 'admin') {
			alert('Only admin can access this route!');
			return false;
		}
		return true;
	}
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	// Store untuk status user
	const userStatus = writable({ name: null, role: null });
	function updateUserStatus() {
		const user = JSON.parse(localStorage.getItem('user') || 'null');
		if (user && user.name && user.role) {
			userStatus.set(user);
		} else {
			userStatus.set({ name: null, role: null });
		}
	}

	// Helper: cek dan redirect jika akses protected tanpa login
	function checkProtectedOnLoad() {
		const isAuthenticated = localStorage.getItem('user') !== null;
		const path = window.location.pathname;
		if (!isAuthenticated && (path === '/protected' || path.startsWith('/admin'))) {
			alert('Access denied! Please login first.');
			goto('/');
		}
	}

	onMount(() => {
		updateUserStatus();
		checkProtectedOnLoad();
		window.addEventListener('popstate', checkProtectedOnLoad);
	});
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

	/**
	 * Route guard example: simple authentication check
	 * @param {string} to - The route being navigated to
	 * @param {string} from - The route being navigated from
	 * @returns {boolean} - True to allow navigation, false to block
	 */
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

	/**
	 * Async route guard example
	 * @param {string} to - The route being navigated to
	 * @param {string} from - The route being navigated from
	 * @returns {Promise<boolean>} - Promise that resolves to true/false
	 */
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
		{ path: '/search/:query?', component: Search },
		{ path: '/protected', component: ProtectedRoute, beforeEnter: authGuard },
		{ path: '/admin/:id?', component: ProtectedRoute, beforeEnter: asyncAuthGuard },
		{ path: '/admin-panel', component: ProtectedRoute, beforeEnter: roleGuard }
	];
	function navigateToAdminPanel() {
		goto('/admin-panel');
	}

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

	function simulateLogin(role = 'user') {
		const name = role === 'admin' ? 'John Admin' : 'Jane User';
		localStorage.setItem('user', JSON.stringify({ name, role }));
		alert(`Login as ${role} successful! Now try accessing protected routes.`);
		updateUserStatus();
	}

	function simulateLogout() {
		localStorage.removeItem('user');
		alert('Logged out! Protected routes will now be blocked.');
		updateUserStatus();
		goto('/'); // Redirect ke home agar guard dievaluasi ulang
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
			<button on:click={navigateToBlog}>Go to Blog Post</button>
			<button on:click={navigateWithQuery}>Search with Query</button>
			<button on:click={searchBlog}>Search Blog</button>
		</nav>

		<!-- Route Guard Demo Section -->
		<div class="auth-demo">
			<h3>🔐 Route Guard Demo</h3>
			<div class="auth-controls">
				<button on:click={() => simulateLogin('admin')} class="login-btn">Login as Admin</button>
				<button on:click={() => simulateLogin('user')} class="login-btn">Login as User</button>
				<button on:click={simulateLogout} class="logout-btn">Logout</button>
			</div>
			<div class="user-status">
				{#if $userStatus.name}
					<p>👤 Logged in as: <b>{$userStatus.name}</b> (<code>{$userStatus.role}</code>)</p>
				{:else}
					<p>🚫 Not logged in</p>
				{/if}
			</div>
			<div class="protected-links">
				<button on:click={navigateToProtected} class="protected-btn"
					>Protected Route (Sync Guard)</button
				>
				<button on:click={navigateToAdmin} class="protected-btn">Admin Route (Async Guard)</button>
				<button on:click={navigateToAdminPanel} class="protected-btn"
					>Admin Panel (Role Guard)</button
				>
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
