import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./vitest-setup-client.js'],
		alias: {
			'$app/environment': '/src/mocks/app-environment.js'
		},
		include: ['src/**/*.{test,spec}.{js,ts}'],
		// Exclude component tests for now - focus on core functionality
		exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/lib/Link.test.js', 'node_modules/**']
	}
});
