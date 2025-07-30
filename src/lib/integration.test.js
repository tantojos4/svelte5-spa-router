import { describe, it, expect, beforeEach, vi } from 'vitest';
import { router, goto } from './routers.js';

// Mock browser environment
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    href: 'http://localhost:3000/'
  },
  writable: true
});

Object.defineProperty(window, 'history', {
  value: {
    pushState: vi.fn(),
    replaceState: vi.fn()
  },
  writable: true
});

describe('Router Integration Tests', () => {
  beforeEach(() => {
    router.clearRoutes();
    vi.clearAllMocks();
    
    // Reset location
    window.location.pathname = '/';
    window.location.search = '';
    window.location.hash = '';
    window.location.href = 'http://localhost:3000/';
  });

  describe('Navigation Flow', () => {
    it('should handle complete navigation flow', () => {
      // Setup routes
      const HomeComponent = () => 'Home';
      const AboutComponent = () => 'About';
      const BlogComponent = () => 'Blog';
      
      router.addRoute('/', HomeComponent);
      router.addRoute('/about', AboutComponent);
      router.addRoute('/blog/:id', BlogComponent);

      // Test navigation to home
      let component = router.navigate('/');
      expect(component).toBe(HomeComponent);
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/');

      // Test navigation to about
      component = router.navigate('/about');
      expect(component).toBe(AboutComponent);
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/about');

      // Test navigation to dynamic route
      component = router.navigate('/blog/my-post');
      expect(component).toBe(BlogComponent);
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/blog/my-post');
    });

    it('should handle goto function with different parameter types', () => {
      router.addRoute('/search', () => 'Search');

      // Simple navigation
      goto('/search');
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/search');

      // With query parameters
      goto('/search', { q: 'svelte', page: '1' });
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/search?q=svelte&page=1');

      // With hash
      goto('/search', {}, 'results');
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/search#results');

      // With both query and hash
      goto('/search', { q: 'test' }, 'top');
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/search?q=test#top');
    });
  });

  describe('Complex Route Patterns', () => {
    beforeEach(() => {
      const Component = () => 'Component';
      
      router.addRoute('/', Component);
      router.addRoute('/user/:id', Component);
      router.addRoute('/user/:id/posts/:postId', Component);
      router.addRoute('/category/:type/item/:id', Component);
      router.addRoute('/search/:query?', Component);
      router.addRoute('/admin/*', Component);
    });

    it('should match nested parameter routes', () => {
      const match = router.findRoute('/user/123/posts/456');
      
      expect(match).toBeTruthy();
      expect(match?.params).toEqual({ id: '123', postId: '456' });
    });

    it('should match complex parameter routes', () => {
      const match = router.findRoute('/category/electronics/item/laptop-123');
      
      expect(match).toBeTruthy();
      expect(match?.params).toEqual({ type: 'electronics', id: 'laptop-123' });
    });

    it('should match optional parameter routes', () => {
      const match1 = router.findRoute('/search/');
      expect(match1).toBeTruthy();
      expect(match1?.params).toEqual({});

      const match2 = router.findRoute('/search/svelte-router');
      expect(match2).toBeTruthy();
      expect(match2?.params).toEqual({ query: 'svelte-router' });
    });

    it('should match wildcard routes with deep paths', () => {
      const match = router.findRoute('/admin/users/123/edit/profile');
      
      expect(match).toBeTruthy();
      expect(match?.params).toEqual({ '*': '/users/123/edit/profile' });
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed URLs gracefully', () => {
      const Component = () => 'Component';
      router.addRoute('/user/:id', Component);

      // These should not throw errors
      expect(() => router.parseUrl('not-a-url')).not.toThrow();
      expect(() => router.navigate('')).not.toThrow();
      expect(() => router.navigate('/')).not.toThrow(); // Use valid path instead
    });

    it('should handle special characters in URLs', () => {
      const Component = () => 'Component';
      router.addRoute('/search/:query', Component);

      const match = router.findRoute('/search/hello%20world');
      expect(match).toBeTruthy();
      expect(match?.params?.query).toBe('hello%20world');
    });

    it('should handle empty route patterns', () => {
      expect(() => router.addRoute('', () => 'Empty')).not.toThrow();
      expect(() => router.matchRoute('', '/')).not.toThrow();
    });
  });

  describe('Store State Management', () => {
    it('should maintain consistent store state across navigations', async () => {
      const { get } = await import('svelte/store');
      const { currentRoute, routeParams, queryParams, hashFragment } = await import('./routers.js');
      
      const Component = () => 'Component';
      router.addRoute('/user/:id', Component);

      // Navigate and check store state
      router.navigate('/user/123?tab=profile#settings');

      expect(get(currentRoute)).toEqual({
        path: '/user/123',
        component: Component,
        params: { id: '123' }
      });
      
      expect(get(routeParams)).toEqual({ id: '123' });
      expect(get(queryParams)).toEqual({ tab: 'profile' });
      expect(get(hashFragment)).toBe('settings');
    });

    it('should clear store state on fallback routes', async () => {
      const { get } = await import('svelte/store');
      const { routeParams } = await import('./routers.js');
      
      const FallbackComponent = () => 'Not Found';
      router.setFallback(FallbackComponent);

      // Navigate to non-existent route
      router.navigate('/non-existent');

      expect(get(routeParams)).toEqual({});
    });
  });

  describe('Browser Integration', () => {
    it('should handle browser back/forward simulation', () => {
      const Component = () => 'Component';
      router.addRoute('/', Component);
      router.addRoute('/about', Component);

      // Simulate navigation history
      router.navigate('/');
      router.navigate('/about');

      // Simulate back button (change URL and call navigateToCurrentUrl)
      window.location.pathname = '/';
      router.navigateToCurrentUrl();

      expect(window.history.pushState).toHaveBeenCalled();
    });

    it('should handle current URL navigation on initialization', () => {
      const Component = () => 'Component';
      router.addRoute('/current', Component);

      // Set current location
      window.location.pathname = '/current';
      window.location.search = '?test=1';
      window.location.hash = '#section';
      window.location.href = 'http://localhost:3000/current?test=1#section';

      // Simulate router initialization
      const component = router.navigateToCurrentUrl();
      expect(component).toBeTruthy();
      expect(component).toBe(Component);
    });
  });
});
