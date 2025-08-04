import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  test: {
	environment: 'jsdom',
	globals: true,
	setupFiles: ['./vitest-setup-client.js'],
	alias: {
	  '$app/environment': '/src/mocks/app-environment.js'
	},
	include: ['src/**/*.{test,spec}.{js,ts}'],
	// Do not exclude Svelte component tests
	// exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/lib/Link.test.js', 'node_modules/**']
	exclude: ['node_modules/**']
  }
});
