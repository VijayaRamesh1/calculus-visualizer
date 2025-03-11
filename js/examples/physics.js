/**
 * physics.js - Physics-based examples
 */

const PhysicsExamples = {
    examples: {
        'projectile-motion': {
            title: 'Projectile Motion',
            function: 'h - 0.5 * g * t^2 + v * t',
            parameters: { h: 10, v: 15, g: 9.8, t: 'x' },
            description: `
                <p>This example visualizes the height of a projectile as a function of time. The function represents:</p>
                <p>h(t) = h₀ - 0.5 * g * t² + v₀ * t</p>
                <p>Where:</p>
                <ul>
                    <li>h₀ = initial height (10 meters)</li>
                    <li>v₀ = initial vertical velocity (15 m/s)</li>
                    <li>g = gravitational acceleration (9.8 m/s²)</li>
                    <li>t = time (seconds)</li>
                </ul>
                <p>The derivative of this function (h'(t) = -g*t + v₀) represents the velocity at time t, and the second derivative (h''(t) = -g) represents the acceleration.</p>
                <p>The integral of velocity gives position, which is the original height function.</p>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                showDerivative: true,
                showTangentLine: true,
                tangentPoint: 1.5
            }
        },
        'spring-oscillation': {
            title: 'Spring Oscillation',
            function: 'A * cos(sqrt(k/m) * t)',
            parameters: { A: 3, k: 1, m: 1, t: 'x' },
            description: `
                <p>This example shows simple harmonic motion in a spring-mass system. The function represents:</p>
                <p>x(t) = A * cos(ω * t)</p>
                <p>Where:</p>
                <ul>
                    <li>A = amplitude (3 meters)</li>
                    <li>ω = angular frequency = √(k/m)</li>
                    <li>k = spring constant (1 N/m)</li>
                    <li>m = mass (1 kg)</li>
                    <li>t = time (seconds)</li>
                </ul>
                <p>The derivative of this function (x'(t) = -A * ω * sin(ω * t)) represents the velocity of the oscillating mass.</p>
                <p>The second derivative (x''(t) = -A * ω² * cos(ω * t) = -ω² * x(t)) is proportional to the position, showing that the acceleration is always directed toward the equilibrium position.</p>
            `,
            conceptToActivate: 'integrals',
            initialOptions: {
                showIntegral: true,
                integralRange: [0, 3]
            }
        }
    },
    
    loadExample(example, engine, ui) {
        const exampleData = this.examples[example];
        if (!exampleData) return;
        
        // Update the function input with the example function
        let functionStr = exampleData.function;
        
        // Replace parameter names with their values
        for (const [param, value] of Object.entries(exampleData.parameters)) {
            if (value !== 'x') { // Don't replace 'x' with anything
                functionStr = functionStr.replace(new RegExp(param, 'g'), `(${value})`);
            }
        }
        
        // Update the function input field
        document.getElementById('function').value = functionStr;
        
        // Switch to the appropriate concept
        if (exampleData.conceptToActivate) {
            ui.setActiveConcept(exampleData.conceptToActivate);
        }
        
        // Apply initial options
        if (exampleData.initialOptions) {
            engine.updateVisualizationOptions(exampleData.initialOptions);
            
            // Update UI controls to match options
            if (ui.activeConceptModule && ui.activeConceptModule.initControls) {
                ui.activeConceptModule.initControls();
            }
        }
        
        // Update the explanation panel with the example description
        document.getElementById('concept-explanation').innerHTML = exampleData.description;
        document.getElementById('concept-title').textContent = exampleData.title;
        
        // Update the visualization
        ui.updateFunction(functionStr);
    }
};