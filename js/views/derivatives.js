/**
 * Derivatives view module for Calculus Visualizer
 */

import VisualizationManager from '../core/visualization-manager.js';

/**
 * Load the derivatives view
 */
export function loadDerivativesView() {
  const mainContent = document.getElementById('main-content');
  
  // Update page title
  document.title = 'Derivatives | Calculus Visualizer';
  
  // Load the derivatives view content
  mainContent.innerHTML = `
    <div class="content-container derivatives-module">
      <div class="visualization-container">
        <div id="derivatives-visualization" class="visualization-canvas"></div>
        
        <div class="visualization-controls">
          <button id="play-pause" class="control-button" aria-label="Play or pause animation">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button id="reset-view" class="control-button" aria-label="Reset view">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" stroke-width="2"/>
              <path d="M16 12L8 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13 9L16 12L13 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button id="view-mode" class="control-button" aria-label="Toggle 2D/3D view">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16.0002V8.00024C21 5.79111 19.2091 4.00024 17 4.00024H7C4.79086 4.00024 3 5.79111 3 8.00024V16.0002C3 18.2093 4.79086 20.0002 7 20.0002H17C19.2091 20.0002 21 18.2093 21 16.0002Z" stroke="currentColor" stroke-width="2"/>
              <path d="M3 8.00024L12 13.0002L21 8.00024" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="sidebar">
        <div class="card">
          <h2>Function Input</h2>
          <div class="input-group">
            <label for="function-input">f(x) =</label>
            <input type="text" id="function-input" value="x^2" aria-label="Function input">
            <button id="update-function" class="primary-button">Update</button>
          </div>
        </div>
        
        <div class="card">
          <h2>Controls</h2>
          <div class="control-group">
            <div class="checkbox-group">
              <input type="checkbox" id="show-derivative" checked>
              <label for="show-derivative">Show Derivative</label>
            </div>
            
            <div class="checkbox-group">
              <input type="checkbox" id="show-tangent" checked>
              <label for="show-tangent">Show Tangent Line</label>
            </div>
            
            <div class="slider-group">
              <label for="x-value">x value:</label>
              <input type="range" id="x-value" min="-5" max="5" step="0.1" value="0">
              <span id="x-value-display">0</span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2>Examples</h2>
          <select id="examples-dropdown">
            <option value="x^2">Parabola (x²)</option>
            <option value="sin(x)">Sine Wave</option>
            <option value="e^x">Exponential</option>
            <option value="1/x">Reciprocal</option>
            <option value="x^3-2*x">Cubic Function</option>
          </select>
        </div>
        
        <div class="card explanation-card">
          <h2>Derivatives</h2>
          <p>The derivative of a function represents the rate of change at each point. Geometrically, it's the slope of the tangent line at that point.</p>
          <p>For a function f(x), the derivative f'(x) gives us information about how the output changes when we make small changes to the input.</p>
          <div class="mathematical-notation">
            <p>f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h</p>
          </div>
          
          <div class="applications">
            <h3>Real-world Applications</h3>
            <ul>
              <li>Velocity is the derivative of position</li>
              <li>Acceleration is the derivative of velocity</li>
              <li>Marginal cost is the derivative of total cost</li>
            </ul>
          </div>
          
          <a href="/calculus-visualizer/applications/car-acceleration" class="link-button">
            See Car Acceleration Example
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;
  
  // Initialize the visualization
  const visualizationContainer = document.getElementById('derivatives-visualization');
  if (visualizationContainer) {
    const visualization = new VisualizationManager(visualizationContainer, {
      type: 'derivatives',
      initialFunction: 'x^2'
    });
    visualization.initialize();
  }
  
  // Add event listeners
  const functionInput = document.getElementById('function-input');
  const updateButton = document.getElementById('update-function');
  const xValueSlider = document.getElementById('x-value');
  const xValueDisplay = document.getElementById('x-value-display');
  const showDerivativeCheckbox = document.getElementById('show-derivative');
  const showTangentCheckbox = document.getElementById('show-tangent');
  const examplesDropdown = document.getElementById('examples-dropdown');
  
  // Update function
  updateButton.addEventListener('click', () => {
    // Implementation details would go here
    console.log('Updating function to:', functionInput.value);
  });
  
  // Update x value
  xValueSlider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    xValueDisplay.textContent = value.toFixed(1);
    // Implementation details would go here
  });
  
  // Toggle derivative visibility
  showDerivativeCheckbox.addEventListener('change', (e) => {
    // Implementation details would go here
    console.log('Show derivative:', e.target.checked);
  });
  
  // Toggle tangent line visibility
  showTangentCheckbox.addEventListener('change', (e) => {
    // Implementation details would go here
    console.log('Show tangent:', e.target.checked);
  });
  
  // Change example function
  examplesDropdown.addEventListener('change', (e) => {
    const selectedFunction = e.target.value;
    functionInput.value = selectedFunction;
    // Implementation details would go here
    console.log('Selected example:', selectedFunction);
  });
}