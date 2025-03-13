/**
 * Home view module for Calculus Visualizer
 */

import VisualizationManager from '../core/visualization-manager.js';

/**
 * Load the home view
 */
export function loadHomeView() {
  const mainContent = document.getElementById('main-content');
  
  // Update page title
  document.title = 'Calculus Visualizer - Interactive Calculus Learning';
  
  // You could load the content from a template or build it dynamically
  mainContent.innerHTML = `
    <!-- Interactive Hero Section -->
    <section class="hero-section">
      <!-- 3D Visualization -->
      <div class="visualization-wrapper">
        <div id="hero-visualization" class="visualization-canvas"></div>
      </div>
      
      <!-- Hero Content -->
      <div class="hero-content">
        <h1>Discover Calculus in 3D</h1>
        <p>Explore calculus concepts through interactive 3D visualizations and real-world applications</p>
        <a href="#modules-heading" class="cta-button pulse">Start Exploring</a>
      </div>
      
      <!-- Visualization Info Box -->
      <div class="visualization-info">
        <a href="/calculus-visualizer/vector" class="try-module" aria-label="Explore Vector Calculus module">Related: <span class="related-module">Vector Calculus</span></a>
        <h3 class="viz-title">Saddle Surface</h3>
        <p class="viz-description">Explore multivariable calculus concepts like critical points and saddle points</p>
        <div class="visualization-controls">
          <button id="next-surface" class="try-me-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Next Example
          </button>
          <a href="/calculus-visualizer/examples/projectile-motion" class="try-me-button">
            Try Me
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
    
    <!-- Modules Section -->
    <h2 id="modules-heading">Explore Calculus Concepts</h2>
    <div class="module-cards" role="list" aria-labelledby="modules-heading">
      <a href="/calculus-visualizer/examples/projectile-motion" class="module-card" role="listitem">
        <div class="module-card-image" style="background-color: #7209b7;" aria-hidden="true"></div>
        <h3>Projectile Motion</h3>
        <p>Explore derivatives through the physics of projectile motion</p>
      </a>
      
      <a href="/calculus-visualizer/examples/harmonic-motion" class="module-card" role="listitem">
        <div class="module-card-image" style="background-color: #5e60ce;" aria-hidden="true"></div>
        <h3>Harmonic Motion</h3>
        <p>Understand oscillation with derivatives and integrals</p>
      </a>
      
      <a href="/calculus-visualizer/examples/area-curves" class="module-card" role="listitem">
        <div class="module-card-image" style="background-color: #4ea8de;" aria-hidden="true"></div>
        <h3>Area Under Curves</h3>
        <p>Visualize the concept of definite integrals</p>
      </a>
      
      <a href="/calculus-visualizer/vector" class="module-card" role="listitem">
        <div class="module-card-image" style="background-color: #4361ee;" aria-hidden="true"></div>
        <h3>Vector Calculus</h3>
        <p>Explore gradients, divergence and curl in 3D space</p>
      </a>
      
      <a href="/calculus-visualizer/examples/taylor-series" class="module-card" role="listitem">
        <div class="module-card-image" style="background-color: #4cc9f0;" aria-hidden="true"></div>
        <h3>Taylor Series</h3>
        <p>Visualize polynomial approximations of functions</p>
      </a>
      
      <a href="/calculus-visualizer/examples/population-growth" class="module-card" role="listitem">
        <div class="module-card-image" style="background-color: #4895ef;" aria-hidden="true"></div>
        <h3>Population Growth</h3>
        <p>Differential equations in biological systems</p>
      </a>
    </div>
    
    <!-- Features Section -->
    <section class="features-section">
      <h2>Why Visualize Calculus?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" stroke="currentColor" stroke-width="2"/>
            <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h3 class="feature-title">See Abstract Concepts</h3>
          <p class="feature-description">Transform abstract mathematical concepts into intuitive visual representations that are easier to understand and remember.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V8C21 5.79086 19.2091 4 17 4H7C4.79086 4 3 5.79086 3 8V16C3 18.2091 4.79086 20 7 20H17C19.2091 20 21 18.2091 21 16Z" stroke="currentColor" stroke-width="2"/>
            <path d="M9 10L12 13L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3 class="feature-title">Interactive Learning</h3>
          <p class="feature-description">Manipulate parameters in real-time to see how changes affect mathematical outcomes and develop intuitive understanding.</p>
        </div>
        
        <div class="feature-card">
          <svg class="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h3 class="feature-title">Real-World Applications</h3>
          <p class="feature-description">Connect calculus to real-world applications in physics, engineering, biology, and more through practical examples.</p>
        </div>
      </div>
    </section>
  `;
  
  // Initialize the visualization
  const visualizationContainer = document.getElementById('hero-visualization');
  if (visualizationContainer) {
    const visualization = new VisualizationManager(visualizationContainer);
    visualization.initialize();
  }
  
  // Add event listeners
  const nextSurfaceButton = document.getElementById('next-surface');
  if (nextSurfaceButton) {
    nextSurfaceButton.addEventListener('click', () => {
      // Handle next surface logic
    });
  }
}