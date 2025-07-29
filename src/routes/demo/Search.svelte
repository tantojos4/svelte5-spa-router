<script lang="ts">
	import { routeParams, queryParams, goto } from '../../lib/router.js';

	interface RouteParams {
		query?: string;
		q?: string;
		[key: string]: string | undefined;
	}

	let { params = {} as RouteParams } = $props();

	// Get search query from route or query parameters
	const searchQuery = $derived(
		params.query || ($routeParams as RouteParams).query || ($queryParams as RouteParams).q || ''
	);

	let searchInput = $state('');
	let results = $state<{ id: number; title: string; type: string; url: string }[]>([]);
	let isSearching = $state(false);

	// Sample search results
	const sampleResults = [
		{
			id: 1,
			title: 'Getting Started with Svelte 5',
			type: 'Documentation',
			url: '/docs/getting-started'
		},
		{ id: 2, title: 'Router Configuration', type: 'Guide', url: '/docs/router' },
		{ id: 3, title: 'Dynamic Routes', type: 'Tutorial', url: '/tutorials/dynamic-routes' },
		{ id: 4, title: 'User Profile Component', type: 'Component', url: '/components/user-profile' },
		{ id: 5, title: 'Blog Post Template', type: 'Template', url: '/templates/blog-post' }
	];

	// Simulate search
	function performSearch(query: string) {
		if (!query.trim()) {
			results = [];
			return;
		}

		isSearching = true;

		// Simulate API delay
		setTimeout(() => {
			results = sampleResults.filter(
				(item) =>
					item.title.toLowerCase().includes(query.toLowerCase()) ||
					item.type.toLowerCase().includes(query.toLowerCase())
			);
			isSearching = false;
		}, 500);
	}

	// Search when query changes
	$effect(() => {
		const currentQuery = searchQuery; // Capture current value
		if (currentQuery) {
			searchInput = currentQuery;
			performSearch(currentQuery);
		}
	});

	function handleSearch(event: Event) {
		event.preventDefault();
		const query = searchInput.trim();
		if (query) {
			// Update URL with search query
			goto(`/search/${encodeURIComponent(query)}`);
		}
	}

	function clearSearch() {
		searchInput = '';
		results = [];
		goto('/search');
	}
</script>

<div class="search-page">
	<header class="search-header">
		<h1>🔍 Search</h1>
		<p>Search through documentation, guides, and examples</p>
	</header>

	<form class="search-form" onsubmit={handleSearch}>
		<div class="search-input-container">
			<input
				type="text"
				bind:value={searchInput}
				placeholder="Enter your search query..."
				class="search-input"
			/>
			<button type="submit" class="search-button">Search</button>
			{#if searchQuery}
				<button type="button" class="clear-button" onclick={clearSearch}>Clear</button>
			{/if}
		</div>
	</form>

	{#if searchQuery}
		<div class="search-info">
			<p>
				{#if isSearching}
					Searching for: <strong>"{searchQuery}"</strong>
				{:else}
					Found {results.length} result{results.length !== 1 ? 's' : ''} for:
					<strong>"{searchQuery}"</strong>
				{/if}
			</p>
		</div>
	{/if}

	<div class="search-results">
		{#if isSearching}
			<div class="loading">
				<div class="spinner"></div>
				<p>Searching...</p>
			</div>
		{:else if searchQuery && results.length === 0}
			<div class="no-results">
				<div class="no-results-icon">😔</div>
				<h2>No results found</h2>
				<p>Try a different search term or browse our categories below.</p>
			</div>
		{:else if results.length > 0}
			<div class="results-list">
				{#each results as result}
					<div
						class="result-item"
						role="button"
						tabindex="0"
						onclick={() => goto(result.url)}
						onkeydown={(e) => e.key === 'Enter' && goto(result.url)}
					>
						<h3>{result.title}</h3>
						<span class="result-type">{result.type}</span>
						<p class="result-url">{result.url}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if !searchQuery}
		<div class="search-suggestions">
			<h2>Popular Searches</h2>
			<div class="suggestion-tags">
				<button
					class="tag"
					onclick={() => {
						searchInput = 'router';
						handleSearch(new Event('submit'));
					}}>router</button
				>
				<button
					class="tag"
					onclick={() => {
						searchInput = 'svelte';
						handleSearch(new Event('submit'));
					}}>svelte</button
				>
				<button
					class="tag"
					onclick={() => {
						searchInput = 'component';
						handleSearch(new Event('submit'));
					}}>component</button
				>
				<button
					class="tag"
					onclick={() => {
						searchInput = 'tutorial';
						handleSearch(new Event('submit'));
					}}>tutorial</button
				>
				<button
					class="tag"
					onclick={() => {
						searchInput = 'documentation';
						handleSearch(new Event('submit'));
					}}>documentation</button
				>
			</div>
		</div>
	{/if}

	<div class="debug-section">
		<h3>Debug Information</h3>
		<div class="debug-info">
			<p><strong>Route Params:</strong> {JSON.stringify(params)}</p>
			<p><strong>Store Route Params:</strong> {JSON.stringify($routeParams)}</p>
			<p><strong>Query Params:</strong> {JSON.stringify($queryParams)}</p>
			<p><strong>Search Query:</strong> {searchQuery}</p>
			<p><strong>Results Count:</strong> {results.length}</p>
		</div>
	</div>
</div>

<style>
	.search-page {
		padding: 2rem;
		max-width: 800px;
	}

	.search-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.search-header h1 {
		color: #2d3748;
		margin: 0 0 0.5rem 0;
	}

	.search-header p {
		color: #4a5568;
		margin: 0;
	}

	.search-form {
		margin-bottom: 2rem;
	}

	.search-input-container {
		display: flex;
		gap: 0.5rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 2px solid #e2e8f0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: #007acc;
	}

	.search-button,
	.clear-button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.search-button {
		background: #007acc;
		color: white;
	}

	.search-button:hover {
		background: #005a99;
	}

	.clear-button {
		background: #718096;
		color: white;
	}

	.clear-button:hover {
		background: #4a5568;
	}

	.search-info {
		background: #edf2f7;
		border: 1px solid #cbd5e0;
		border-radius: 6px;
		padding: 1rem;
		margin-bottom: 2rem;
		text-align: center;
	}

	.loading {
		text-align: center;
		padding: 3rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #e2e8f0;
		border-top: 4px solid #007acc;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.no-results {
		text-align: center;
		padding: 3rem;
	}

	.no-results-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.no-results h2 {
		color: #2d3748;
		margin: 0 0 1rem 0;
	}

	.results-list {
		display: grid;
		gap: 1rem;
	}

	.result-item {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.result-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: #007acc;
	}

	.result-item h3 {
		margin: 0 0 0.5rem 0;
		color: #2d3748;
	}

	.result-type {
		background: #007acc;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.result-url {
		color: #718096;
		font-size: 0.9rem;
		margin: 0.5rem 0 0 0;
		font-family: monospace;
	}

	.search-suggestions {
		margin: 3rem 0;
		text-align: center;
	}

	.search-suggestions h2 {
		color: #2d3748;
		margin: 0 0 1rem 0;
	}

	.suggestion-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.tag {
		background: #f7fafc;
		border: 1px solid #e2e8f0;
		color: #4a5568;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.tag:hover {
		background: #edf2f7;
		border-color: #cbd5e0;
	}

	.debug-section {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid #e0e0e0;
	}

	.debug-section h3 {
		color: #2d3748;
		margin: 0 0 1rem 0;
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
		word-break: break-all;
	}

	@media (max-width: 768px) {
		.search-page {
			padding: 1rem;
		}

		.search-input-container {
			flex-direction: column;
		}

		.suggestion-tags {
			justify-content: flex-start;
		}
	}
</style>
