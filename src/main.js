import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('app');
if (target) {
  mount(App, { target });
} else {
  throw new Error("Target element with id 'app' not found.");
}
