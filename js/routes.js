/**
 * Routes configuration for Calculus Visualizer
 * Maps URL paths to component loaders
 */

// Import components and views as needed
import { loadHomeView } from './views/home.js';
import { loadDerivativesView } from './views/derivatives.js';
import { loadIntegralsView } from './views/integrals.js';
import { loadLimitsView } from './views/limits.js';
import { loadVectorView } from './views/vector.js';
import { loadAccessibilityView } from './views/accessibility.js';

// Module loaders for standalone examples
// These redirect to the appropriate module directories
const loadProjectileMotion = function() {
  window.location.href = '/calculus-visualizer/modules/projectile-motion/index.html';
};

const loadHarmonicMotion = function() {
  window.location.href = '/calculus-visualizer/modules/harmonic-motion/index.html';
};

const loadAreaCurves = function() {
  window.location.href = '/calculus-visualizer/modules/area-curves/index.html';
};

const loadTaylorSeries = function() {
  window.location.href = '/calculus-visualizer/modules/taylor-series/index.html';
};

const loadPopulationGrowth = function() {
  window.location.href = '/calculus-visualizer/modules/population-growth/index.html';
};

// Import application loaders
import { loadCarAcceleration } from './applications/car-acceleration.js';
import { loadSpringOscillation } from './applications/spring-oscillation.js';
import { loadWavePropagation } from './applications/wave-propagation.js';
import { loadMarketEquilibrium } from './applications/market-equilibrium.js';

// Import user resources
import { loadGuideView } from './views/guide.js';
import { loadShortcutsView } from './views/shortcuts.js';
import { loadAboutView } from './views/about.js';
import { loadContactView } from './views/contact.js';

// Import settings views
import { loadThemeSettings } from './settings/theme-settings.js';
import { loadLevelSettings } from './settings/level-settings.js';

// Not found handler
import { loadNotFoundView } from './views/not-found.js';

/**
 * Configure routes for the application
 * @param {Router} router - The router instance
 */
export function configureRoutes(router) {
  // Main Application URLs
  router.registerRoute('/', loadHomeView);
  router.registerRoute('/accessibility', loadAccessibilityView);
  
  // Core Calculus Concept URLs
  router.registerRoute('/derivatives', loadDerivativesView);
  router.registerRoute('/integrals', loadIntegralsView);
  router.registerRoute('/limits', loadLimitsView);
  router.registerRoute('/vector', loadVectorView);
  
  // Application Examples URLs
  router.registerRoute('/examples/projectile-motion', loadProjectileMotion);
  router.registerRoute('/examples/harmonic-motion', loadHarmonicMotion);
  router.registerRoute('/examples/area-curves', loadAreaCurves);
  router.registerRoute('/examples/taylor-series', loadTaylorSeries);
  router.registerRoute('/examples/population-growth', loadPopulationGrowth);
  
  // Real-World Applications URLs
  router.registerRoute('/applications/car-acceleration', loadCarAcceleration);
  router.registerRoute('/applications/spring-oscillation', loadSpringOscillation);
  router.registerRoute('/applications/wave-propagation', loadWavePropagation);
  router.registerRoute('/applications/market-equilibrium', loadMarketEquilibrium);
  
  // User Resources URLs
  router.registerRoute('/guide', loadGuideView);
  router.registerRoute('/shortcuts', loadShortcutsView);
  router.registerRoute('/about', loadAboutView);
  router.registerRoute('/contact', loadContactView);
  
  // User Settings URLs
  router.registerRoute('/settings/theme', loadThemeSettings);
  router.registerRoute('/settings/level', loadLevelSettings);
  
  // Set not found handler
  router.setNotFoundCallback(loadNotFoundView);
}