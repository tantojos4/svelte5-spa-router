import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Setup globals (DISABLED: use JSDOM provided by Vitest)
// global.HTMLElement = class HTMLElement {};
// global.Element = class Element {
//   appendChild = vi.fn();
//   removeChild = vi.fn();
//   setAttribute = vi.fn();
//   getAttribute = vi.fn();
//   addEventListener = vi.fn();
//   removeEventListener = vi.fn();
//   querySelector = vi.fn();
//   querySelectorAll = vi.fn();
// };


// Mock SvelteKit environment
vi.mock('$app/environment', () => ({
  browser: true,
  dev: true
}));

// Setup fetch mock
global.fetch = vi.fn();

// Setup URL constructor

  // global.URLSearchParams = class URLSearchParams {
  //   constructor(search) {
  //     this.params = new Map();
  //     if (search) {
  //       if (typeof search === 'object' && !(search instanceof URLSearchParams)) {
  //         // Handle object input
  //         for (const [key, value] of Object.entries(search)) {
  //           if (value !== null && value !== undefined) {
  //             this.params.set(key, String(value));
  //           }
  //         }
  //       } else {
  //         // Handle string input
  //         const searchStr = typeof search === 'string' ? search : search.toString();
  //         const cleanSearch = searchStr.replace(/^\?/, '');
  //         if (cleanSearch) {
  //           const pairs = cleanSearch.split('&');
  //           pairs.forEach(pair => {
  //             const [key, value] = pair.split('=');
  //             if (key) {
  //               this.params.set(
  //                 decodeURIComponent(key), 
  //                 decodeURIComponent(value || '')
  //               );
  //             }
  //           });
  //         }
  //       }
  //     }
  //   }
  //   
  //   get(key) {
  //     return this.params.get(key) || null;
  //   }
  //   
  //   set(key, value) {
  //     this.params.set(key, value);
  //   }
  //   
  //   has(key) {
  //     return this.params.has(key);
  //   }
  //   
  //   delete(key) {
  //     this.params.delete(key);
  //   }
  //   
  //   forEach(callback) {
  //     this.params.forEach(callback);
  //   }
  //   
  //   toString() {
  //     const pairs = [];
  //     this.params.forEach((value, key) => {
  //       pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
  //     });
  //     return pairs.join('&');
  //   }
  //   
  //   *[Symbol.iterator]() {
  //     for (const [key, value] of this.params) {
  //       yield [key, value];
  //     }
  //   }
  // };
