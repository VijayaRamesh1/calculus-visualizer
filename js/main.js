/**
 * Main application entry point for Calculus Visualizer
 */

import Router from './router.js';
import { configureRoutes } from './routes.js';
import UICore from '../core/ui-core.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize UI Core
  const ui = new UICore();
  
  // Set up navigation handling
  setupNavigation();
  
  // Initialize the router
  const router = new Router();
  configureRoutes(router);
  router.initialize();
});

/**
 * Set up navigation link handling to use the router
 */
function setupNavigation() {
  // Intercept all internal links and route them through the router
  document.addEventListener('click', (e) => {
    // Find closest ancestor that is a link
    const link = e.target.closest('a');
    
    if (link && isInternalLink(link.href)) {
      e.preventDefault();
      
      // Get the route path from the link
      const url = new URL(link.href);
      const path = url.pathname.replace('/calculus-visualizer', '');
      
      // Route to the path
      window.router.navigateTo(path);
      
      // Update active link styling
      updateActiveLinks(path);
    }
  });
}

/**
 * Check if a link is internal to the application
 * @param {string} href - The href attribute of the link
 * @returns {boolean} - True if the link is internal
 */
function isInternalLink(href) {
  if (!href) return false;
  
  const url = new URL(href, window.location.origin);
  const siteUrl = new URL(window.location.origin);
  
  // Check if same origin and contains the base path
  return url.origin === siteUrl.origin && 
         url.pathname.startsWith('/calculus-visualizer');
}

/**
 * Update active link styling based on current path
 * @param {string} path - The current path
 */
function updateActiveLinks(path) {
  // Remove active class from all navigation links
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Add active class to links matching the current path
  document.querySelectorAll(`nav a[href$="${path}"]`).forEach(link => {
    link.classList.add('active');
  });
}

// Add router to window for access in setupNavigation
window.router = router;