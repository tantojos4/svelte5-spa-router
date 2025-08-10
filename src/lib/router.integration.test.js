/// <reference types="vitest" />
import { render } from '@testing-library/svelte';
import { test, expect, beforeEach } from 'vitest';
import { router, goto } from './routers.js';
import MultiParent from '../routes/demo/MultiParent.svelte';
import MultiChild from '../routes/demo/MultiChild.svelte';
import MultiGrandchild from '../routes/demo/MultiGrandchild.svelte';
import NestedParent from '../routes/demo/NestedParent.svelte';
import NestedChild from '../routes/demo/NestedChild.svelte';
import NotFound from '../routes/demo/NotFound.svelte';
import Router from './Router.svelte';

beforeEach(() => {
  router.clearRoutes();
  router.addRoute({ path: '/multi/:id', component: MultiParent });
  router.addRoute({ path: '/multi/:id/child/:slug', component: MultiChild });
  router.addRoute({ path: '/multi/:id/child/:slug/grandchild/:foo', component: MultiGrandchild });
  router.addRoute({ path: '/nested', component: NestedParent });
  router.addRoute({ path: '/nested/child', component: NestedChild });
  router.setFallback(NotFound);
});

test('should render MultiParent for /multi/123', async () => {
  await goto('/multi/123');
  const { getByText } = render(Router);
  expect(getByText(/Multi Parent/i)).toBeInTheDocument();
});

test('should render MultiChild for /multi/123/child/abc', async () => {
  await goto('/multi/123/child/abc');
  const { getByText } = render(Router);
  expect(getByText(/Multi Child/i)).toBeInTheDocument();
});

test('should render MultiGrandchild for /multi/123/child/abc/grandchild/foo', async () => {
  await goto('/multi/123/child/abc/grandchild/foo');
  const { getByText } = render(Router);
  expect(getByText(/Multi Grandchild/i)).toBeInTheDocument();
});

test('should render NestedParent for /nested', async () => {
  await goto('/nested');
  const { getByText } = render(Router);
  expect(getByText(/Multi Parent|Nested Parent/i)).toBeInTheDocument();
});

test('should render NestedChild for /nested/child', async () => {
  await goto('/nested/child');
  const { getByText } = render(Router);
  expect(getByText(/Multi Child|Nested Child/i)).toBeInTheDocument();
});

test('should render NotFound for unknown route', async () => {
  await goto('/unknown/path');
  const { getByText } = render(Router);
  expect(getByText(/404|Not Found/i)).toBeInTheDocument();
});
