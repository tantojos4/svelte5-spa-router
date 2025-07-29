<script>
	import Router from '../lib/Router.svelte';
	import Link from '../lib/Link.svelte';
	import { goto, routeParams, queryParams } from '../lib/router.js';

	// Sample components for demo
	import Home from './demo/Home.svelte';
	import About from './demo/About.svelte';
	import Blog from './demo/Blog.svelte';
	import BlogPost from './demo/BlogPost.svelte';
	import UserProfile from './demo/UserProfile.svelte';
	import Search from './demo/Search.svelte';
	import NotFound from './demo/NotFound.svelte';

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
		flex-wrap: wrap;
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
		font-size: 0.9rem;
	}

	button:hover {
		background: #005a99;
	}

	.debug-info {
		background: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		margin-top: 2rem;
		font-family: monospace;
		font-size: 0.9rem;
	}

	@media (max-width: 768px) {
		.app {
			padding: 0.5rem;
		}

		nav {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}

		nav :global(a),
		button {
			text-align: center;
		}
	}
</style>
