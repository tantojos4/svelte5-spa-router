/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />

import { vi, beforeEach, afterEach } from 'vitest';

// Force client-side environment for Svelte component testing
Object.defineProperty(globalThis, 'window', {
  value: global.window || {},
  writable: true,
  configurable: true
});

Object.defineProperty(globalThis, 'document', {
  value: global.document || {},
  writable: true,
  configurable: true
});

// Mock browser APIs
beforeEach(() => {
  // Mock URL constructor and URLSearchParams
  global.URL = vi.fn().mockImplementation((url, base) => {
    const parsedUrl = new (vi.importActual('url').URL)(url, base || 'http://localhost/');
    return {
      ...parsedUrl,
      searchParams: new (vi.importActual('url').URLSearchParams)(parsedUrl.search)
    };
  });

  global.URLSearchParams = vi.fn().mockImplementation((init) => {
    const RealURLSearchParams = vi.importActual('url').URLSearchParams;
    if (typeof init === 'object' && init !== null && !Array.isArray(init)) {
      // Convert object to array of key-value pairs
      const entries = Object.entries(init);
      return new RealURLSearchParams(entries);
    }
    return new RealURLSearchParams(init);
  });

  // Mock history API
  global.history = {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    go: vi.fn(),
    length: 1,
    state: null,
    scrollRestoration: 'auto'
  };

  // Mock location
  global.location = {
    href: 'http://localhost/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    toString: () => 'http://localhost/'
  };

  // Mock window events
  global.addEventListener = vi.fn();
  global.removeEventListener = vi.fn();
  global.dispatchEvent = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});