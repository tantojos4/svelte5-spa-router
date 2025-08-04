<script>
	import { goto } from '../../lib/routers.js';

	const browser = typeof window !== 'undefined';
	$: currentUrl = browser ? window.location.pathname : '';
</script>

<div class="not-found">
	<div class="error-container">
		<div class="error-icon">🔍</div>
		<h1>404 - Page Not Found</h1>
		<p>The page you're looking for doesn't exist or has been moved.</p>

		<div class="current-url">
			<strong>Current URL:</strong>
			<code>{currentUrl}</code>
		</div>

		<div class="suggestions">
			<h2>Try these instead:</h2>
			<div class="suggestion-links">
				<button on:click={() => goto('/')}>🏠 Home</button>
				<button on:click={() => goto('/about')}>📖 About</button>
				<button on:click={() => goto('/blog')}>📝 Blog</button>
				<button on:click={() => goto('/user/123')}>👤 User Profile</button>
			</div>
		</div>

		<div class="debug-note">
			<h3>Developer Note:</h3>
			<p>
				This NotFound component is rendered when no route matches the current URL. This is a great
				place to:
			</p>
			<ul>
				<li>Show helpful navigation options</li>
				<li>Log 404 errors for analytics</li>
				<li>Suggest similar pages</li>
				<li>Display a search form</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.not-found {
		min-height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.error-container {
		text-align: center;
		max-width: 600px;
	}

	.error-icon {
		font-size: 5rem;
		margin-bottom: 1rem;
	}

	h1 {
		color: #2d3748;
		font-size: 2.5rem;
		margin: 0 0 1rem 0;
	}

	p {
		color: #4a5568;
		font-size: 1.2rem;
		margin-bottom: 2rem;
		line-height: 1.5;
	}

	.current-url {
		background: #fed7d7;
		border: 1px solid #feb2b2;
		border-radius: 8px;
		padding: 1rem;
		margin: 2rem 0;
		color: #742a2a;
	}

	.current-url code {
		background: rgba(0, 0, 0, 0.1);
		padding: 0.3rem 0.6rem;
		border-radius: 4px;
		font-weight: bold;
	}

	.suggestions {
		margin: 2rem 0;
	}

	.suggestions h2 {
		color: #2d3748;
		margin-bottom: 1rem;
	}

	.suggestion-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
	}

	button {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	button:hover {
		background: #005a99;
		transform: translateY(-1px);
	}

	.debug-note {
		background: #edf2f7;
		border: 1px solid #cbd5e0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-top: 3rem;
		text-align: left;
	}

	.debug-note h3 {
		color: #2d3748;
		margin: 0 0 1rem 0;
	}

	.debug-note p {
		margin: 0 0 1rem 0;
		font-size: 1rem;
	}

	.debug-note ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.debug-note li {
		margin: 0.5rem 0;
		color: #4a5568;
	}

	@media (max-width: 768px) {
		.not-found {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		.suggestion-links {
			flex-direction: column;
			align-items: center;
		}

		button {
			width: 200px;
			justify-content: center;
		}
	}
</style>
