<script>
	import { goto } from './router.js';

	let { href, query = {}, hash = '', children, ...props } = $props();

	/**
	 * @param {Event} e
	 */
	function handleClick(e) {
		e.preventDefault();
		goto(href, query, hash);
	}

	// Build full href for accessibility and SEO
	const fullHref = $derived(
		(() => {
			let url = href;
			const searchParams = new URLSearchParams(query);
			if (searchParams.toString()) {
				url += '?' + searchParams.toString();
			}
			if (hash) {
				url += '#' + hash;
			}
			return url;
		})()
	);
</script>

<a href={fullHref} onclick={handleClick} {...props}>
	{@render children()}
</a>
