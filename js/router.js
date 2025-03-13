/**
 * Router for the Calculus Visualizer application
 * Handles mapping URLs to application components and views
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
    
    if (pushState) {
      history.pushState(null, '', fullPath);
    }
    
    this.handleRoute(path);
  }
  
  /**
   * Handle route based on current path
   * @param {string} path - The path to handle
   */
  handleRoute(path) {
    const route = this.routes[path];
    
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
    const path = window.location.pathname.replace(this.baseUrl, '');
    this.handleRoute(path);
  }
  
  /**
   * Initialize the router with the current URL
   */
  initialize() {
    const path = window.location.pathname.replace(this.baseUrl, '');
    this.handleRoute(path);
  }
}

export default Router;