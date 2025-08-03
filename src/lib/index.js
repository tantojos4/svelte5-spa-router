// Default export for compatibility with import Router from 'svelte5-spa-router'
import RouterComponent from './Router.svelte';

// Main router components
export { default as Router } from './Router.svelte';
export default RouterComponent;
export { default as Link } from './Link.svelte';

// Router core functionality and stores
export { 
  router, 
  currentRoute, 
  routeParams, 
  queryParams, 
  hashFragment,
  goto,
  getQueryParam,
  updateQueryParams
} from './routers.js';
