import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { router, goto, currentRoute, routeParams, queryParams, hashFragment, getQueryParam, updateQueryParams } from './routers.js';

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

// Mock components
const HomeComponent = () => 'Home';
const AboutComponent = () => 'About';
const BlogComponent = () => 'Blog';
const NotFoundComponent = () => 'Not Found';

describe('Router Core Functionality', () => {
  beforeEach(() => {
    // Clear routes before each test
    router.clearRoutes();
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Reset window location
    window.location.pathname = '/';
    window.location.search = '';
    window.location.hash = '';
    window.location.href = 'http://localhost:3000/';
  });

  describe('Route Registration', () => {
    it('should register routes correctly', () => {
      router.addRoute('/', HomeComponent);
      router.addRoute('/about', AboutComponent);
      
      expect(router.routes).toHaveLength(2);
      expect(router.routes[0]).toEqual({ path: '/', component: HomeComponent });
      expect(router.routes[1]).toEqual({ path: '/about', component: AboutComponent });
    });

    it('should clear routes', () => {
      router.addRoute('/', HomeComponent);
      router.addRoute('/about', AboutComponent);
      
      expect(router.routes).toHaveLength(2);
      
      router.clearRoutes();
      
      expect(router.routes).toHaveLength(0);
    });

    it('should set fallback component', () => {
      router.setFallback(NotFoundComponent);
      
      expect(router.fallback).toBe(NotFoundComponent);
    });
  });

  describe('Route Matching', () => {
    beforeEach(() => {
      router.addRoute('/', HomeComponent);
      router.addRoute('/about', AboutComponent);
      router.addRoute('/blog/:id', BlogComponent);
      router.addRoute('/user/:id/posts/:postId', BlogComponent);
      router.addRoute('/search/:query?', BlogComponent);
      router.addRoute('/admin/*', BlogComponent);
    });

    it('should match exact routes', () => {
      const match = router.matchRoute('/', '/');
      expect(match).toEqual({ params: {} });
      
      const match2 = router.matchRoute('/about', '/about');
      expect(match2).toEqual({ params: {} });
    });

    it('should match dynamic routes with parameters', () => {
      const match = router.matchRoute('/blog/:id', '/blog/123');
      expect(match).toEqual({ params: { id: '123' } });
      
      const match2 = router.matchRoute('/user/:id/posts/:postId', '/user/456/posts/789');
      expect(match2).toEqual({ params: { id: '456', postId: '789' } });
    });

    it('should match optional parameters', () => {
      const match1 = router.matchRoute('/search/:query?', '/search/');
      expect(match1).toEqual({ params: {} });
      
      const match2 = router.matchRoute('/search/:query?', '/search/svelte');
      expect(match2).toEqual({ params: { query: 'svelte' } });
    });

    it('should match wildcard routes', () => {
      const match = router.matchRoute('/admin/*', '/admin/users/edit');
      expect(match).toEqual({ params: { '*': '/users/edit' } });
    });

    it('should not match incorrect routes', () => {
      const match1 = router.matchRoute('/blog/:id', '/blog');
      expect(match1).toBeNull();
      
      const match2 = router.matchRoute('/about', '/contact');
      expect(match2).toBeNull();
    });
  });

  describe('URL Parsing', () => {
    it('should parse simple URLs', () => {
      const parsed = router.parseUrl('http://localhost:3000/about');
      expect(parsed).toEqual({
        pathname: '/about',
        queryParams: {},
        hash: ''
      });
    });

    it('should parse URLs with query parameters', () => {
      const parsed = router.parseUrl('http://localhost:3000/search?q=svelte&page=1');
      expect(parsed).toEqual({
        pathname: '/search',
        queryParams: { q: 'svelte', page: '1' },
        hash: ''
      });
    });

    it('should parse URLs with hash fragments', () => {
      const parsed = router.parseUrl('http://localhost:3000/docs#introduction');
      expect(parsed).toEqual({
        pathname: '/docs',
        queryParams: {},
        hash: 'introduction'
      });
    });

    it('should parse complex URLs', () => {
      const parsed = router.parseUrl('http://localhost:3000/search?q=svelte&category=frontend#results');
      expect(parsed).toEqual({
        pathname: '/search',
        queryParams: { q: 'svelte', category: 'frontend' },
        hash: 'results'
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      router.addRoute('/', HomeComponent);
      router.addRoute('/about', AboutComponent);
      router.addRoute('/blog/:id', BlogComponent);
      router.setFallback(NotFoundComponent);
    });

    it('should navigate to existing routes', () => {
      const component = router.navigate('/about');
      
      expect(component).toBe(AboutComponent);
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/about');
      expect(get(currentRoute)).toEqual({
        path: '/about',
        component: AboutComponent,
        params: {}
      });
    });

    it('should navigate to dynamic routes', () => {
      const component = router.navigate('/blog/123');
      
      expect(component).toBe(BlogComponent);
      expect(get(routeParams)).toEqual({ id: '123' });
    });

    it('should handle query parameters', () => {
      router.navigate('/search?q=svelte&page=1');
      
      expect(get(queryParams)).toEqual({ q: 'svelte', page: '1' });
    });

    it('should handle hash fragments', () => {
      router.navigate('/docs#introduction');
      
      expect(get(hashFragment)).toBe('introduction');
    });

    it('should use fallback for non-existent routes', () => {
      const component = router.navigate('/non-existent');
      
      expect(component).toBe(NotFoundComponent);
      expect(get(currentRoute)).toEqual({
        path: '/non-existent',
        component: NotFoundComponent,
        params: {}
      });
    });
  });
});

describe('Helper Functions', () => {
  beforeEach(() => {
    // Reset stores
    queryParams.set({});
  });

  describe('goto function', () => {
    beforeEach(() => {
      // Reset all mocks before each test
      vi.clearAllMocks();
      window.history.pushState = vi.fn();
    });

    it('should navigate with simple path', () => {
      goto('/about');
      
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/about');
    });

    it('should navigate with query parameters', () => {
      goto('/search', { q: 'svelte', page: '1' });
      
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/search?q=svelte&page=1');
    });

    it('should navigate with hash fragment', () => {
      goto('/docs', {}, 'introduction');
      
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/docs#introduction');
    });

    it('should navigate with query parameters and hash', () => {
      goto('/search', { q: 'svelte' }, 'results');
      
      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/search?q=svelte#results');
    });
  });

  describe('getQueryParam function', () => {
    it('should return query parameter value', () => {
      queryParams.set({ q: 'svelte', page: '1' });
      
      expect(getQueryParam('q')).toBe('svelte');
      expect(getQueryParam('page')).toBe('1');
    });

    it('should return default value for non-existent parameter', () => {
      queryParams.set({ q: 'svelte' });
      
      expect(getQueryParam('page', '1')).toBe('1');
      expect(getQueryParam('category', 'all')).toBe('all');
    });

    it('should return empty string as default when no default provided', () => {
      queryParams.set({});
      
      expect(getQueryParam('q')).toBe('');
    });
  });

  describe('updateQueryParams function', () => {
    beforeEach(() => {
      window.location.href = 'http://localhost:3000/search?q=old&page=1';
    });

    it('should update existing query parameters', () => {
      updateQueryParams({ q: 'new', category: 'frontend' });
      
      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it('should replace all query parameters when replace=true', () => {
      updateQueryParams({ q: 'new' }, true);
      
      expect(window.history.replaceState).toHaveBeenCalled();
    });

    it('should remove parameters with null/undefined values', () => {
      updateQueryParams({ page: null, q: 'test' });
      
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });
});

describe('Store Reactivity', () => {
  it('should update stores when navigating', () => {
    router.addRoute('/blog/:id', BlogComponent);
    
    router.navigate('/blog/123?category=tech#comments');
    
    expect(get(currentRoute)).toEqual({
      path: '/blog/123',
      component: BlogComponent,
      params: { id: '123' }
    });
    
    expect(get(routeParams)).toEqual({ id: '123' });
    expect(get(queryParams)).toEqual({ category: 'tech' });
    expect(get(hashFragment)).toBe('comments');
  });

  it('should reset stores on failed navigation', () => {
    router.setFallback(NotFoundComponent);
    
    router.navigate('/non-existent');
    
    expect(get(routeParams)).toEqual({});
  });
});
