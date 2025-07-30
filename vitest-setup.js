import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup globals
global.HTMLElement = class HTMLElement {};
global.Element = class Element {
  appendChild = vi.fn();
  removeChild = vi.fn();
  setAttribute = vi.fn();
  getAttribute = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  querySelector = vi.fn();
  querySelectorAll = vi.fn();
};

// Mock browser environment
global.window = {
  location: {
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    href: 'http://localhost:3000/'
  },
  history: {
    pushState: vi.fn(),
    replaceState: vi.fn()
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
};

global.document = {
  title: 'Test',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  createElement: vi.fn((tagName) => {
    const element = {
      tagName: tagName.toUpperCase(),
      style: {},
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      appendChild: vi.fn(),
      removeChild: vi.fn(),
      innerHTML: '',
      textContent: '',
      children: [],
      parentNode: null,
      firstChild: null,
      lastChild: null,
      nextSibling: null,
      previousSibling: null,
      querySelector: vi.fn(),
      querySelectorAll: vi.fn()
    };
    return element;
  }),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    children: [],
    querySelector: vi.fn(),
    querySelectorAll: vi.fn()
  },
  head: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    children: []
  },
  querySelector: vi.fn(),
  querySelectorAll: vi.fn()
};

// Mock SvelteKit environment
vi.mock('$app/environment', () => ({
  browser: true,
  dev: true
}));

// Setup fetch mock
global.fetch = vi.fn();

// Setup URL constructor
global.URL = class URL {
  constructor(url, base) {
    if (base && !url.startsWith('http')) {
      this.href = base + (url.startsWith('/') ? '' : '/') + url;
    } else {
      this.href = url;
    }
    
    const match = this.href.match(/^(https?:\/\/[^/]+)?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/);
    this.origin = match[1] || 'http://localhost:3000';
    this.pathname = match[2] || '/';
    this.search = match[3] || '';
    this.hash = match[4] || '';
    this.searchParams = new URLSearchParams(this.search);
  }
};

global.URLSearchParams = class URLSearchParams {
  constructor(search) {
    this.params = new Map();
    if (search) {
      if (typeof search === 'object' && !(search instanceof URLSearchParams)) {
        // Handle object input
        for (const [key, value] of Object.entries(search)) {
          if (value !== null && value !== undefined) {
            this.params.set(key, String(value));
          }
        }
      } else {
        // Handle string input
        const searchStr = typeof search === 'string' ? search : search.toString();
        const cleanSearch = searchStr.replace(/^\?/, '');
        if (cleanSearch) {
          const pairs = cleanSearch.split('&');
          pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key) {
              this.params.set(
                decodeURIComponent(key), 
                decodeURIComponent(value || '')
              );
            }
          });
        }
      }
    }
  }
  
  get(key) {
    return this.params.get(key) || null;
  }
  
  set(key, value) {
    this.params.set(key, value);
  }
  
  has(key) {
    return this.params.has(key);
  }
  
  delete(key) {
    this.params.delete(key);
  }
  
  forEach(callback) {
    this.params.forEach(callback);
  }
  
  toString() {
    const pairs = [];
    this.params.forEach((value, key) => {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    return pairs.join('&');
  }
  
  *[Symbol.iterator]() {
    for (const [key, value] of this.params) {
      yield [key, value];
    }
  }
};
