<script>
	import { goto } from '../../lib/router.js';
</script>

<div class="home">
	<h1>🏠 Home Page</h1>
	<p>Welcome to the Svelte 5 SPA Router demo!</p>

	<div class="features">
		<h2>Router Features:</h2>
		<ul>
			<li>✅ Dynamic routing with parameters</li>
			<li>✅ Wildcard routes</li>
			<li>✅ Optional parameters</li>
			<li>✅ Query parameters support</li>
			<li>✅ Hash fragment support</li>
			<li>✅ Programmatic navigation</li>
			<li>✅ Browser history support</li>
			<li>✅ Automatic link interception</li>
		</ul>
	</div>

	<div class="actions">
		<button onclick={() => goto('/about')}>Go to About</button>
		<button onclick={() => goto('/blog')}>View Blog</button>
		<button onclick={() => goto('/user/456')}>User Profile</button>
	</div>
</div>

<style>
	.home {
		padding: 2rem;
	}

	.features {
		background: #f9f9f9;
		padding: 1.5rem;
		border-radius: 8px;
		margin: 2rem 0;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	li {
		padding: 0.5rem 0;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	button {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
	}

	button:hover {
		background: #005a99;
	}
</style>
