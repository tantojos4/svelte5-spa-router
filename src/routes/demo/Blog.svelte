<script lang="ts">
	import { goto, queryParams } from '../../lib/router.js';

	interface BlogPost {
		id: string;
		title: string;
		excerpt: string;
		date: string;
		tags: string[];
	}

	// Get search query from URL parameters
	const searchQuery = $derived(($queryParams as { search?: string }).search || '');

	let searchInput = $state('');

	const blogPosts: BlogPost[] = [
		{
			id: 'getting-started',
			title: 'Getting Started with Svelte 5 Router',
			excerpt: 'Learn how to set up and use this simple router...',
			date: '2025-01-15',
			tags: ['svelte', 'router', 'getting-started', 'tutorial']
		},
		{
			id: 'dynamic-routes',
			title: 'Dynamic Routes and Parameters',
			excerpt: 'Understanding how to handle dynamic URL segments...',
			date: '2025-01-14',
			tags: ['svelte', 'router', 'dynamic', 'parameters']
		},
		{
			id: 'advanced-features',
			title: 'Advanced Router Features',
			excerpt: 'Explore wildcards, optional params, and more...',
			date: '2025-01-13',
			tags: ['advanced', 'wildcards', 'parameters', 'features']
		},
		{
			id: 'migration-guide',
			title: 'Migrating from Other Routers',
			excerpt: 'Tips for switching to this router from others...',
			date: '2025-01-12',
			tags: ['migration', 'guide', 'tips', 'comparison']
		}
	];

	// Filter posts based on search query
	const filteredPosts = $derived(() => {
		if (!searchQuery.trim()) {
			return blogPosts;
		}

		const query = searchQuery.toLowerCase();
		return blogPosts.filter(
			(post) =>
				post.title.toLowerCase().includes(query) ||
				post.excerpt.toLowerCase().includes(query) ||
				post.tags.some((tag) => tag.toLowerCase().includes(query))
		);
	});

	// Handle search form submission
	function handleSearch(event: Event) {
		event.preventDefault();
		const query = searchInput.trim();

		if (query) {
			goto('/blog', { search: query });
		} else {
			goto('/blog');
		}
	}

	// Clear search
	function clearSearch() {
		searchInput = '';
		goto('/blog');
	}

	function viewPost(id: string) {
		goto(`/blog/${id}`);
	}

	// Update search input when URL changes
	$effect(() => {
		searchInput = searchQuery;
	});
</script>

<div class="blog">
	<h1>📝 Blog</h1>
	<p>Articles about using the Svelte 5 SPA Router</p>

	<!-- Search Form -->
	<form class="search-form" onsubmit={handleSearch}>
		<div class="search-container">
			<input
				type="text"
				bind:value={searchInput}
				placeholder="Search blog posts..."
				class="search-input"
			/>
			<button type="submit" class="search-button">Search</button>
			{#if searchQuery}
				<button type="button" class="clear-button" onclick={clearSearch}>Clear</button>
			{/if}
		</div>
	</form>

	<!-- Search Results Info -->
	{#if searchQuery}
		<div class="search-info">
			<p>
				Found {filteredPosts().length} result{filteredPosts().length !== 1 ? 's' : ''} for:
				<strong>"{searchQuery}"</strong>
			</p>
		</div>
	{/if}

	<div class="posts">
		{#each filteredPosts() as post}
			<div
				class="post-card"
				role="button"
				tabindex="0"
				onclick={() => viewPost(post.id)}
				onkeydown={(e) => e.key === 'Enter' && viewPost(post.id)}
			>
				<h2>{post.title}</h2>
				<p class="excerpt">{post.excerpt}</p>
				<div class="tags">
					{#each post.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
				<div class="meta">
					<span class="date">{post.date}</span>
					<span class="read-more">Read more →</span>
				</div>
			</div>
		{:else}
			{#if searchQuery}
				<div class="no-results">
					<h2>No posts found</h2>
					<p>No blog posts match your search: <strong>"{searchQuery}"</strong></p>
					<button onclick={clearSearch}>Clear search</button>
				</div>
			{/if}
		{/each}
	</div>

	<div class="actions">
		<button onclick={() => goto('/blog/my-custom-post')}> View Custom Post </button>
		<button onclick={() => goto('/blog/non-existent')}> Try Non-existent Post </button>
	</div>
</div>

<style>
	.blog {
		padding: 2rem;
	}

	.search-form {
		margin: 2rem 0;
	}

	.search-container {
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
		margin: 1rem 0;
		text-align: center;
	}

	.no-results {
		text-align: center;
		padding: 3rem;
		background: #f7fafc;
		border-radius: 8px;
		margin: 2rem 0;
	}

	.no-results h2 {
		color: #2d3748;
		margin: 0 0 1rem 0;
	}

	.no-results button {
		background: #007acc;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		margin-top: 1rem;
	}

	.posts {
		display: grid;
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.post-card {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 1.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.post-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border-color: #007acc;
	}

	.post-card h2 {
		margin: 0 0 0.5rem 0;
		color: #2d3748;
		font-size: 1.25rem;
	}

	.excerpt {
		color: #4a5568;
		margin: 0.5rem 0 1rem 0;
		line-height: 1.5;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0 0 1rem 0;
	}

	.tag {
		background: #edf2f7;
		color: #4a5568;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 500;
	}

	.meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
	}

	.date {
		color: #718096;
	}

	.read-more {
		color: #007acc;
		font-weight: 500;
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

	@media (max-width: 768px) {
		.blog {
			padding: 1rem;
		}

		.actions {
			flex-direction: column;
		}
	}
</style>
