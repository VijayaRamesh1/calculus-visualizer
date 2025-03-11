/**
 * tooltips.js - Contextual tooltips for UI elements and mathematical concepts
 */

const TooltipSystem = {
    // Tooltip definitions for all UI elements
    tooltips: {
        // Function input area
        'function-input': 'Enter a mathematical function using x as the variable. For example: x^2, sin(x), or e^x. For 3D functions, you can use both x and y variables.',
        'update-function': 'Click to update the visualization with your function.',
        
        // Dimension toggle
        'dimension-toggle': 'Switch between 2D and 3D visualization modes. 3D mode allows you to rotate and zoom the visualization.',
        
        // Concept tabs
        'concept-derivatives': 'Derivatives show the rate of change of a function at any point.',
        'concept-integrals': 'Integrals represent the area under a curve or accumulation of a quantity.',
        'concept-limits': 'Limits describe the behavior of a function as the input approaches a specific value.',
        
        // Derivative controls
        'show-derivative': 'Display the derivative function f\'(x) alongside the original function.',
        'show-tangent': 'Show the tangent line at a specific point on the curve.',
        'tangent-point': 'Move this slider to see how the slope changes at different points along the curve.',
        
        // Integral controls
        'show-integral': 'Highlight the area under the curve within the specified range.',
        'integral-start': 'The lower bound of the definite integral.',
        'integral-end': 'The upper bound of the definite integral.',
        'show-antiderivative': 'Display the antiderivative function F(x) alongside the original function.',
        
        // Limit controls
        'show-limit': 'Visualize how the function behaves as x approaches a specific value.',
        'limit-point': 'The x-value that is being approached.',
        'limit-direction-both': 'Approach the limit point from both sides.',
        'limit-direction-left': 'Approach the limit point from the left only.',
        'limit-direction-right': 'Approach the limit point from the right only.',
        
        // Examples dropdown
        'examples-dropdown': 'Choose from pre-defined examples showing calculus concepts in real-world scenarios.',
        
        // Visualization controls
        'reset-view': 'Reset the camera to the default position.',
        'color-scheme': 'Change the coloring method for the visualization.',
        'toggle-animation': 'Start or stop the animation of the function surface.',
        
        // Professional tools
        'enable-high-precision': 'Increase the resolution and precision of calculations for more accurate results.',
        'export-visualization': 'Save the current visualization as an image file.',
        'precision-digits': 'Set the number of significant digits shown in numerical results.'
    },
    
    // Mathematical concept tooltips
    conceptTooltips: {
        // Derivative concepts
        'derivative': 'The derivative f\'(x) measures how quickly a function changes at a point. Geometrically, it\'s the slope of the tangent line to the function at that point.',
        'slope': 'The slope of a line is its steepness, calculated as rise/run or Δy/Δx.',
        'tangent-line': 'A line that touches a curve at exactly one point and has the same slope as the curve at that point.',
        'critical-point': 'A point where the derivative equals zero or is undefined. Critical points can be maxima, minima, or inflection points.',
        
        // Integral concepts
        'integral': 'The definite integral ∫[a,b] f(x) dx represents the signed area between the function and the x-axis from a to b.',
        'antiderivative': 'The antiderivative F(x) of a function f(x) is a function whose derivative equals f(x). Also called an indefinite integral.',
        'fundamental-theorem': 'The Fundamental Theorem of Calculus connects differentiation and integration, stating that ∫[a,b] f(x) dx = F(b) - F(a) where F\'(x) = f(x).',
        
        // Limit concepts
        'limit': 'The limit of f(x) as x approaches c is the value that f(x) gets arbitrarily close to as x gets arbitrarily close to c.',
        'continuity': 'A function is continuous at a point if the limit at that point exists and equals the function value at that point.',
        'one-sided-limit': 'A limit that approaches a value from only one side (left or right).'
    },
    
    // Initialize the tooltip system
    init() {
        this.addTooltipsToElements();
        this.addConceptTooltips();
        this.setupFunctionTooltip();
    },
    
    // Add tooltips to UI elements
    addTooltipsToElements() {
        // For each tooltip definition, find matching elements and add tooltips
        for (const [id, text] of Object.entries(this.tooltips)) {
            const elements = document.querySelectorAll(`#${id}, .${id}, [data-tooltip="${id}"]`);
            
            elements.forEach(element => {
                // Add tooltip trigger class
                element.classList.add('tooltip-trigger');
                
                // Add tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = text;
                
                // Add tooltip to element
                element.appendChild(tooltip);
            });
        }
    },
    
    // Add tooltips for mathematical concept terms in the explanation panel
    addConceptTooltips() {
        const explanationPanel = document.getElementById('concept-explanation');
        if (!explanationPanel) return;
        
        // Process the explanation content to add tooltips to mathematical terms
        for (const [term, text] of Object.entries(this.conceptTooltips)) {
            // Find term in explanation text (case-insensitive)
            const termRegex = new RegExp(`\\b${term}\\b`, 'gi');
            
            // Replace the HTML content, adding tooltip wrappers around the term
            explanationPanel.innerHTML = explanationPanel.innerHTML.replace(
                termRegex,
                match => `<span class="tooltip-trigger concept-term">${match}<div class="tooltip">${text}</div></span>`
            );
        }
    },
    
    // Set up function tooltip that follows the mouse in the visualization
    setupFunctionTooltip() {
        const canvas = document.getElementById('visualization');
        if (!canvas) return;
        
        // Create the tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'function-tooltip';
        tooltip.style.display = 'none';
        document.body.appendChild(tooltip);
        
        // Add mouse move event listener to the canvas
        canvas.addEventListener('mousemove', (e) => {
            // Get canvas position and dimensions
            const rect = canvas.getBoundingClientRect();
            
            // Calculate normalized position (0 to 1) within the canvas
            const normalizedX = (e.clientX - rect.left) / rect.width;
            const normalizedY = (e.clientY - rect.top) / rect.height;
            
            // Convert to function coordinates based on the visualization options
            const engine = window.calcEngine;
            if (!engine) return;
            
            const { xRange, yRange } = engine.visualizationOptions;
            
            // Calculate point coordinates
            const x = xRange[0] + normalizedX * (xRange[1] - xRange[0]);
            const y = yRange[0] + (1 - normalizedY) * (yRange[1] - yRange[0]);
            
            // Try to evaluate the function at this point
            try {
                let z = 0;
                const fn = engine.currentFunction;
                
                if (engine.is3DMode) {
                    // 3D function - evalute at (x,y)
                    z = math.evaluate(fn, { x, y });
                } else {
                    // 2D function - evaluate at x
                    z = math.evaluate(fn, { x });
                }
                
                // Only show if result is valid
                if (isFinite(z)) {
                    const precision = engine.precision || 2;
                    
                    // Format tooltip content
                    let tooltipContent = engine.is3DMode
                        ? `f(${x.toFixed(precision)}, ${y.toFixed(precision)}) = ${z.toFixed(precision)}`
                        : `f(${x.toFixed(precision)}) = ${z.toFixed(precision)}`;
                    
                    // Position tooltip near mouse cursor
                    tooltip.style.left = `${e.clientX + 15}px`;
                    tooltip.style.top = `${e.clientY - 15}px`;
                    tooltip.textContent = tooltipContent;
                    tooltip.style.display = 'block';
                } else {
                    tooltip.style.display = 'none';
                }
            } catch (error) {
                tooltip.style.display = 'none';
            }
        });
        
        // Hide tooltip when mouse leaves the canvas
        canvas.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    },
    
    // Show a temporary tooltip at a specific position
    showTemporaryTooltip(text, element, duration = 3000) {
        // Create a temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip tooltip-temp';
        tooltip.textContent = text;
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        
        // Add to element
        element.classList.add('tooltip-trigger');
        element.appendChild(tooltip);
        
        // Remove after duration
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
                element.classList.remove('tooltip-trigger');
            }, 300);
        }, duration);
    }
};

// Initialize tooltips when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TooltipSystem.init();
});