/**
 * Enhanced router implementation for the Calculus Visualizer application
 * Handles mapping URLs to application components and views
 * Includes special handling for module paths
 */

class Router {
  constructor() {
    this.routes = {};
    this.baseUrl = '/calculus-visualizer';
    this.notFoundCallback = () => {
      console.error('Route not found');
    };
    
    // Listen for history changes
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }
  
  /**
   * Register a route with the router
   * @param {string} path - The URL path to register
   * @param {Function} callback - The function to call when this route is activated
   */
  registerRoute(path, callback) {
    this.routes[path] = callback;
  }
  
  /**
   * Set the callback for when a route is not found
   * @param {Function} callback - The function to call when route is not found
   */
  setNotFoundCallback(callback) {
    this.notFoundCallback = callback;
  }
  
  /**
   * Navigate to the specified path
   * @param {string} path - The path to navigate to
   * @param {boolean} pushState - Whether to add this to browser history
   */
  navigateTo(path, pushState = true) {
    const fullPath = this.baseUrl + path;
    
    // Check if this is a module path that should be directly accessed
    if (this.isModulePath(path)) {
      window.location.href = fullPath;
      return;
    }
    
    if (pushState) {
      history.pushState(null, '', fullPath);
    }
    
    this.handleRoute(path);
  }
  
  /**
   * Check if a path is a direct module path
   * @param {string} path - The path to check
   * @returns {boolean} - Whether this is a module path
   */
  isModulePath(path) {
    return path.includes('/modules/');
  }
  
  /**
   * Handle route based on current path
   * @param {string} path - The path to handle
   */
  handleRoute(path) {
    // Skip handling for direct module paths
    if (this.isModulePath(path)) {
      return;
    }
    
    const route = this.routes[path] || this.routes[path + '/'];
    
    if (route) {
      route();
    } else {
      this.notFoundCallback();
    }
  }
  
  /**
   * Handle popstate event (browser back/forward)
   */
  handlePopState() {
    const rawPath = window.location.pathname;
    
    // Skip handling for direct module paths
    if (rawPath.includes('/modules/')) {
      return;
    }
    
    const path = rawPath.replace(this.baseUrl, '') || '/';
    this.handleRoute(path);
  }
  
  /**
   * Initialize the router with the current URL
   */
  initialize() {
    const rawPath = window.location.pathname;
    
    // Skip initialization for direct module paths
    if (rawPath.includes('/modules/')) {
      return;
    }
    
    const path = rawPath.replace(this.baseUrl, '') || '/';
    this.handleRoute(path);
  }
}

export default Router;