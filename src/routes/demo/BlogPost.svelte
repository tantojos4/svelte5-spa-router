<script lang="ts">
	import { routeParams, goto } from '../../lib/routers.js';

	interface RouteParams {
		id?: string;
		[key: string]: string | undefined;
	}

	// At the top level:
	const props = $props();
	const params: RouteParams = props.params ?? {};

	// Get post ID from route parameters
	const postId = $derived(params.id ?? ($routeParams as RouteParams).id ?? '');

	// Sample post data
	interface PostData {
		title: string;
		content?: string;
		date: string;
		author: string;
	}
	const posts: { [key: string]: PostData } = {
		'getting-started': {
			title: 'Getting Started with Svelte 5 Router',
			content: `
		<p>Welcome to the Svelte 5 Router! This router is designed specifically for Svelte 5 with runes support.</p>
		
		<h2>Installation</h2>
		<p>Copy the lib folder to your project or install as a package:</p>
		<pre><code>npm install svelte5-spa-router</code></pre>
		
		<h2>Basic Setup</h2>
		<p>Import the Router component and define your routes:</p>
		<pre><code>
import Router from './lib/Router.svelte';
import Home from './routes/Home.svelte';
import About from './routes/About.svelte';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
];
		</code></pre>
		
		<p>That's it! Your router is ready to use.</p>
	  `,
			date: '2025-01-15',
			author: 'Router Team'
		},
		'dynamic-routes': {
			title: 'Dynamic Routes and Parameters',
			content: `
		<p>Learn how to handle dynamic URL segments and route parameters.</p>
		
		<h2>Parameter Routes</h2>
		<p>Define routes with dynamic segments using the colon syntax:</p>
		<pre><code>
const routes = [
  { path: '/user/:id', component: UserProfile },
  { path: '/blog/:slug', component: BlogPost },
  { path: '/category/:type/item/:id', component: Item }
];
		</code></pre>
		
		<h2>Accessing Parameters</h2>
		<p>Access parameters in your components using props or the store:</p>
		<pre><code>
// Using props
let { params = {} } = $props();
const userId = params.id;

// Using store
import { routeParams } from './lib/routers.js';
$: userId = $routeParams.id;
		</code></pre>
		
		<h2>Optional Parameters</h2>
		<p>Make parameters optional by adding a question mark:</p>
		<pre><code>
{ path: '/search/:query?', component: Search }
		</code></pre>
	  `,
			date: '2025-01-14',
			author: 'Router Team'
		},
		'my-custom-post': {
			title: 'Custom Blog Post',
			date: '2025-01-16',
			author: 'Demo Author'
		}
	};

	const post = $derived(
		posts[postId] || {
			title: 'Post Not Found',
			date: 'Unknown',
			author: 'System'
		}
	);

	// Dynamic content based on postId
	const postContent = $derived(() => {
		if (posts[postId]) {
			if (postId === 'my-custom-post') {
				return `
		  <p>This is a custom blog post to demonstrate how the router handles dynamic routes!</p>
		  
		  <p>The post ID from the URL is: <strong>${postId}</strong></p>
		  
		  <h2>How This Works</h2>
		  <p>When you navigate to <code>/blog/my-custom-post</code>, the router:</p>
		  <ol>
			<li>Matches the route pattern <code>/blog/:id</code></li>
			<li>Extracts the <code>id</code> parameter</li>
			<li>Passes it to the BlogPost component</li>
			<li>The component renders content based on the ID</li>
		  </ol>
		  
		  <p>Try changing the URL to see different content!</p>
		`;
			}
			return posts[postId].content || '';
		} else {
			return `
		<p>Sorry, the blog post "<strong>${postId}</strong>" could not be found.</p>
		<p>This demonstrates how the router handles non-existent dynamic routes.</p>
		<p>The route parameter is still available: <strong>${postId}</strong></p>
	  `;
		}
	});

	function goBack() {
		goto('/blog');
	}
</script>

<div class="blog-post">
	<header class="post-header">
		<button class="back-button" onclick={goBack}>← Back to Blog</button>
		<h1>{post.title}</h1>
		<div class="meta">
			<span>By {post.author}</span>
			<span>•</span>
			<span>{post.date}</span>
			<span>•</span>
			<span>Route param: <code>{postId}</code></span>
		</div>
	</header>

	<article class="content">
		{@html postContent}
	</article>

	<footer class="post-footer">
		<div class="debug-info">
			<strong>Debug Info:</strong>
			<p>Route Parameters: {JSON.stringify(params)}</p>
			<p>Store Parameters: {JSON.stringify($routeParams)}</p>
			<p>Post ID: {postId}</p>
		</div>
	</footer>
</div>

<style>
	.blog-post {
		padding: 2rem;
		max-width: 800px;
	}

	.post-header {
		border-bottom: 1px solid #e0e0e0;
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
	}

	.back-button {
		background: #f7fafc;
		border: 1px solid #e2e8f0;
		color: #4a5568;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.back-button:hover {
		background: #edf2f7;
		border-color: #cbd5e0;
	}

	.post-header h1 {
		margin: 1rem 0 0.5rem 0;
		color: #2d3748;
		font-size: 2rem;
		line-height: 1.2;
	}

	.meta {
		color: #718096;
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.meta code {
		background: #edf2f7;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.8rem;
	}

	.content {
		line-height: 1.7;
		font-size: 1.1rem;
	}

	.content :global(h2) {
		color: #2d3748;
		margin: 2rem 0 1rem 0;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}

	.content :global(p) {
		margin: 1rem 0;
	}

	.content :global(pre) {
		background: #2d3748;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	.content :global(code) {
		background: #edf2f7;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9rem;
	}

	.content :global(pre code) {
		background: transparent;
		padding: 0;
	}

	.content :global(ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.content :global(li) {
		margin: 0.5rem 0;
	}

	.post-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e0e0e0;
	}

	.debug-info {
		background: #f7fafc;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		padding: 1rem;
		font-family: monospace;
		font-size: 0.9rem;
	}

	.debug-info p {
		margin: 0.5rem 0;
	}

	@media (max-width: 768px) {
		.blog-post {
			padding: 1rem;
		}

		.post-header h1 {
			font-size: 1.5rem;
		}

		.meta {
			flex-wrap: wrap;
		}
	}
</style>
