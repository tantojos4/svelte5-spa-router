import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * @typedef {Object.<string, string>} RouteParams
 */

// Store untuk current route
export const currentRoute = writable({ path: '/', component: null, params: {} });

// Store untuk route parameters
/** @type {import('svelte/store').Writable<RouteParams>} */
export const routeParams = writable({});

// Store untuk query parameters
/** @type {import('svelte/store').Writable<RouteParams>} */
export const queryParams = writable({});

// Store untuk hash
export const hashFragment = writable('');

// Router class
class Router {
  constructor() {
    /** @type {Array<{path: string, component: any}>} */
    this.routes = [];
    /** @type {any} */
    this.fallback = null;
    
    // Only run in browser
    if (!browser) return;
    
    // Listen to popstate event (back/forward button)
    window.addEventListener('popstate', () => {
      this.navigateToCurrentUrl();
    });
    
    // Listen to clicks on links
    document.addEventListener('click', (/** @type {Event} */ e) => {
      const target = /** @type {HTMLAnchorElement} */ (e.target);
      if (target.tagName === 'A' && target.href && target.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = target.getAttribute('href');
        if (path) {
          this.navigate(path);
        }
      }
    });
  }
  
  /**
   * @param {string} path 
   * @param {any} component 
   */
  addRoute(path, component) {
    this.routes.push({ path, component });
  }
  
  /**
   * Clear all routes
   */
  clearRoutes() {
    this.routes = [];
  }
  
  /**
   * @param {any} component 
   */
  setFallback(component) {
    this.fallback = component;
  }
  
  /**
   * @param {string} fullPath 
   */
  navigate(fullPath) {
    if (!browser) return null;
    
    // Parse full URL
    const urlInfo = this.parseUrl(fullPath);
    
    // Update browser URL
    window.history.pushState({}, '', fullPath);
    
    // Find matching route
    const route = this.findRoute(urlInfo.pathname);
    
    if (route) {
      // Update stores with route info
      currentRoute.set({
        path: urlInfo.pathname,
        component: route.component,
        params: route.params
      });
      routeParams.set(route.params);
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
      return route.component;
    } else if (this.fallback) {
      // Update stores with fallback
      currentRoute.set({
        path: urlInfo.pathname,
        component: this.fallback,
        params: {}
      });
      routeParams.set({});
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
      return this.fallback;
    }
    
    return null;
  }

  navigateToCurrentUrl() {
    if (!browser) return;
    
    const urlInfo = this.parseUrl(window.location.href);
    const route = this.findRoute(urlInfo.pathname);
    
    if (route) {
      currentRoute.set({
        path: urlInfo.pathname,
        component: route.component,
        params: route.params
      });
      routeParams.set(route.params);
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
    } else if (this.fallback) {
      currentRoute.set({
        path: urlInfo.pathname,
        component: this.fallback,
        params: {}
      });
      routeParams.set({});
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
    }
  }

  /**
   * Parse URL into components
   * @param {string} url 
   */
  parseUrl(url) {
    if (!browser) {
      return {
        pathname: '/',
        queryParams: {},
        hash: ''
      };
    }
    
    const urlObj = new URL(url, window.location.origin);
    
    // Parse query parameters
    /** @type {Record<string, string>} */
    const queryParams = {};
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    
    return {
      pathname: urlObj.pathname,
      queryParams,
      hash: urlObj.hash.slice(1) // Remove # symbol
    };
  }

  /**
   * @param {string} path 
   */
  findRoute(path) {
    for (const route of this.routes) {
      const match = this.matchRoute(route.path, path);
      if (match) {
        return {
          component: route.component,
          params: match.params
        };
      }
    }
    return null;
  }

  /**
   * Enhanced route matching with wildcards and optional params
   * @param {string} routePath 
   * @param {string} currentPath 
   */
  matchRoute(routePath, currentPath) {
    // Handle wildcard routes
    if (routePath.endsWith('/*')) {
      const basePath = routePath.slice(0, -2);
      if (currentPath.startsWith(basePath)) {
        return { 
          params: { 
            '*': currentPath.slice(basePath.length) 
          } 
        };
      }
    }

    // Handle exact and parameter routes
    const routeParts = routePath.split('/');
    const pathParts = currentPath.split('/');
    
    if (routeParts.length !== pathParts.length) {
      return null;
    }

    /** @type {Record<string, string>} */
    const params = {};
    
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];
      
      if (routePart.startsWith(':')) {
        // Parameter route (e.g., :id)
        const paramName = routePart.slice(1);
        // Handle optional parameters
        if (paramName.endsWith('?')) {
          const actualParamName = paramName.slice(0, -1);
          if (pathPart) {
            params[actualParamName] = pathPart;
          }
        } else {
          params[paramName] = pathPart;
        }
      } else if (routePart !== pathPart) {
        // Exact match required
        return null;
      }
    }
    
    return { params };
  }  getCurrentComponent() {
    if (!browser) return null;
    
    const path = window.location.pathname;
    const route = this.findRoute(path);
    
    if (route) {
      return route.component;
    } else if (this.fallback) {
      return this.fallback;
    }
    
    return null;
  }
}

// Create singleton router instance
export const router = new Router();

// Helper function to navigate programmatically
/**
 * @param {string} path 
 * @param {Record<string, string>=} queryParams
 * @param {string=} hash
 */
export function goto(path, queryParams = {}, hash = '') {
  if (!browser) return;
  
  let fullPath = path;
  
  // Add query parameters
  const searchParams = new URLSearchParams(queryParams);
  if (searchParams.toString()) {
    fullPath += '?' + searchParams.toString();
  }
  
  // Add hash
  if (hash) {
    fullPath += '#' + hash;
  }
  
  router.navigate(fullPath);
}

// Helper to get current query param
/**
 * @param {string} key
 * @param {string=} defaultValue
 */
export function getQueryParam(key, defaultValue = '') {
  /** @type {Record<string, string>} */
  let currentQuery = {};
  queryParams.subscribe(q => currentQuery = q)();
  return currentQuery[key] || defaultValue;
}

// Helper to update query params without navigation
/**
 * @param {Record<string, string>} newParams
 * @param {boolean=} replace
 */
export function updateQueryParams(newParams, replace = false) {
  if (!browser) return;
  
  const url = new URL(window.location.href);
  
  if (replace) {
    // Replace all query params
    url.search = '';
    Object.entries(newParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  } else {
    // Update existing query params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
  }
  
  window.history.replaceState({}, '', url.toString());
  
  // Update stores
  const urlInfo = router.parseUrl(url.toString());
  queryParams.set(urlInfo.queryParams);
}
