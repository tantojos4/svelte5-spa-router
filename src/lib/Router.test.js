import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Router from './Router.svelte';
import { router } from './routers.js';

describe('Router Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    router.clearRoutes();
  });

  it('should render without errors', () => {
    const { container } = render(Router);
    expect(container).toBeTruthy();
  });

  it('should render router component', () => {
    // Simple test to ensure component renders
    const component = render(Router);
    expect(component).toBeTruthy();
  });

  it('should handle empty routes', () => {
    router.clearRoutes();
    const { container } = render(Router);
    expect(container).toBeTruthy();
  });
});
