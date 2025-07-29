<div class="about">
	<h1>📖 About This Router</h1>
	<p>This is a simple, flexible SPA router built specifically for Svelte 5 with runes support.</p>

	<div class="info-section">
		<h2>Why This Router?</h2>
		<ul>
			<li><strong>Svelte 5 Native:</strong> Built from the ground up for Svelte 5 with runes</li>
			<li><strong>Lightweight:</strong> No external dependencies</li>
			<li>
				<strong>Flexible:</strong> Supports dynamic routes, wildcards, and optional parameters
			</li>
			<li><strong>Developer Friendly:</strong> Easy to use and understand</li>
		</ul>
	</div>

	<div class="info-section">
		<h2>How It Works</h2>
		<p>The router uses:</p>
		<ul>
			<li>Svelte stores for state management</li>
			<li>Browser History API for navigation</li>
			<li>URL pattern matching for route resolution</li>
			<li>Event delegation for link interception</li>
		</ul>
	</div>

	<div class="code-example">
		<h3>Basic Usage:</h3>
		<pre><code
				>{`<script>
  import Router from '../../lib/Router.svelte';
  import Home from './Home.svelte';
  import About from './About.svelte';
  import NotFound from './NotFound.svelte';

  const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ];
</script>

<Router {routes} fallback={NotFound} />`}</code
			></pre>
	</div>
</div>

<style>
	.about {
		padding: 2rem;
		max-width: 800px;
	}

	.info-section {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 1.5rem 0;
	}

	ul {
		margin: 1rem 0;
	}

	li {
		margin: 0.5rem 0;
	}

	.code-example {
		background: #f5f5f5;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 2rem 0;
	}

	pre {
		background: #2d3748;
		color: #e2e8f0;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	code {
		font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
	}

	h1 {
		color: #2d3748;
	}

	h2 {
		color: #4a5568;
		border-bottom: 2px solid #e2e8f0;
		padding-bottom: 0.5rem;
	}
</style>
