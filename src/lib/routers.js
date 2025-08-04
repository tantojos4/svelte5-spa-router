import { writable } from 'svelte/store';
const browser = typeof window !== 'undefined';

// --- Stores ---
export const locationStore = writable({
  pathname: browser ? window.location.pathname : '/',
  search: browser ? window.location.search : '',
  hash: browser ? window.location.hash : ''
});
export const currentRoute = writable({ path: '/', component: null, params: {} });
export const routeParams = writable({});
export const queryParams = writable({});
export const hashFragment = writable('');

function updateLocationStore() {
  locationStore.set({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash
  });
}

// --- Router Class ---
class Router {
  constructor() {
    /**
     * @type {Array<{path: string, component: any, beforeEnter?: (to: string, from: string) => boolean|Promise<boolean>}>}
     */
    this.routes = [];
    /** @type {any} */
    this.fallback = null;
    this._lastPath = '/';
    if (!browser) return;
    window.addEventListener('popstate', () => {
      this.navigateToCurrentUrl();
    });
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
   * @param {object} [options]
   * @param {(to: string, from: string) => boolean|Promise<boolean>} [options.beforeEnter]
   */
  /**
   * @param {string} path
   * @param {any} component
   * @param {{ beforeEnter?: (to: string, from: string) => boolean|Promise<boolean> }} [options]
   */
  addRoute(path, component, options = {}) {
    this.routes.push({ path, component, beforeEnter: options.beforeEnter });
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
   * @returns {Promise<any>}
   */
  async navigate(fullPath) {
    if (!browser) return null;
    const urlInfo = this.parseUrl(fullPath);
    const route = this.findRoute(urlInfo.pathname);
    // Route guard: beforeEnter
    if (route && route.beforeEnter) {
      const allow = await route.beforeEnter(urlInfo.pathname, this._lastPath);
      if (!allow) {
        // Navigation cancelled
        return null;
      }
    }
    window.history.pushState({}, '', fullPath);
    updateLocationStore();
    if (route) {
      currentRoute.set({
        path: urlInfo.pathname,
        component: route.component,
        params: route.params
      });
      routeParams.set(route.params);
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
      this._lastPath = urlInfo.pathname;
      return route.component;
    } else if (this.fallback) {
      currentRoute.set({
        path: urlInfo.pathname,
        component: this.fallback,
        params: {}
      });
      routeParams.set({});
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
      this._lastPath = urlInfo.pathname;
      return this.fallback;
    }
    return null;
  }

  /**
   * @returns {Promise<any>}
   */
  async navigateToCurrentUrl() {
    if (!browser) return null;
    const urlInfo = this.parseUrl(window.location.href);
    const route = this.findRoute(urlInfo.pathname);
    // Route guard: beforeEnter
    if (route && route.beforeEnter) {
      const allow = await route.beforeEnter(urlInfo.pathname, this._lastPath);
      if (!allow) {
        // Navigation cancelled
        return null;
      }
    }
    updateLocationStore();
    if (route) {
      currentRoute.set({
        path: urlInfo.pathname,
        component: route.component,
        params: route.params
      });
      routeParams.set(route.params);
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
      this._lastPath = urlInfo.pathname;
      return route.component;
    } else if (this.fallback) {
      currentRoute.set({
        path: urlInfo.pathname,
        component: this.fallback,
        params: {}
      });
      routeParams.set({});
      queryParams.set(urlInfo.queryParams);
      hashFragment.set(urlInfo.hash);
      this._lastPath = urlInfo.pathname;
      return this.fallback;
    }
    return null;
  }

  /**
   * @param {string} url
   * @returns {{ pathname: string, queryParams: Record<string, string>, hash: string }}
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
    /** @type {Record<string, string>} */
    const queryParams = {};
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    return {
      pathname: urlObj.pathname,
      queryParams,
      hash: urlObj.hash.slice(1)
    };
  }

  /**
   * @param {string} path
   * @returns {any}
   */
  findRoute(path) {
    for (const route of this.routes) {
      const match = this.matchRoute(route.path, path);
      if (match) {
        return {
          ...route,
          params: match.params
        };
      }
    }
    return null;
  }

  /**
   * @param {string} routePath
   * @param {string} currentPath
   * @returns {{ params: Record<string, string> } | null}
   */
  matchRoute(routePath, currentPath) {
    /**
     * @param {string} p
     * @returns {string}
     */
    const normalize = (p) => {
      if (!p || p === '' || p === '/' || p === '//') return '/';
      return p.endsWith('/') && p !== '/' ? p.slice(0, -1) : p;
    };
    routePath = normalize(routePath);
    currentPath = normalize(currentPath);
    if (routePath === '/' && currentPath === '/') {
      return { params: {} };
    }
    if (routePath.endsWith('/*')) {
      const basePath = routePath.slice(0, -2);
      if (currentPath.startsWith(basePath)) {
        return { params: { '*': currentPath.slice(basePath.length) } };
      }
    }
    const routeParts = routePath.split('/');
    const pathParts = currentPath.split('/');
    let allowOptional = false;
    if (routeParts.length - pathParts.length === 1) {
      const lastRoutePart = routeParts[routeParts.length - 1];
      if (lastRoutePart.startsWith(':') && lastRoutePart.endsWith('?')) {
        allowOptional = true;
      }
    }
    if (routeParts.length !== pathParts.length && !allowOptional) {
      return null;
    }
    /** @type {Record<string, string>} */
    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];
      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        if (paramName.endsWith('?')) {
          const actualParamName = paramName.slice(0, -1);
          if (typeof pathPart !== 'undefined' && pathPart !== '') {
            params[actualParamName] = pathPart;
          }
        } else {
          if (typeof pathPart === 'undefined') return null;
          params[paramName] = pathPart;
        }
      } else {
        if (typeof pathPart === 'undefined' && allowOptional && i === routeParts.length - 1) {
          continue;
        }
        if (routePart !== pathPart) {
          return null;
        }
      }
    }
    return { params };
  }

  /**
   * @returns {any}
   */
  getCurrentComponent() {
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

// --- Singleton Router ---
export const router = new Router();

// --- Helpers ---
/**
 * @param {string} path
 * @param {Record<string, string>} [queryParams]
 * @param {string} [hash]
 */
export function goto(path, queryParams = {}, hash = '') {
  if (!browser) return;
  let fullPath = path;
  const searchParams = new URLSearchParams(queryParams);
  if (searchParams.toString()) {
    fullPath += '?' + searchParams.toString();
  }
  if (hash) {
    fullPath += '#' + hash;
  }
  router.navigate(fullPath);
}

/**
 * @param {string} key
 * @param {string} [defaultValue]
 * @returns {string}
 */
export function getQueryParam(key, defaultValue = '') {
  /** @type {Record<string, string>} */
  let currentQuery = {};
  queryParams.subscribe(q => currentQuery = q)();
  return currentQuery[key] || defaultValue;
}

/**
 * @param {Record<string, string>} newParams
 * @param {boolean} [replace]
 */
export function updateQueryParams(newParams, replace = false) {
  if (!browser) return;
  const url = new URL(window.location.href);
  if (replace) {
    url.search = '';
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  } else {
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }
    });
  }
  window.history.replaceState({}, '', url.toString());
  const urlInfo = router.parseUrl(url.toString());
  queryParams.set(urlInfo.queryParams);
}
