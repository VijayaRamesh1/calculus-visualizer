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
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model describes the trajectory of objects like thrown balls, artillery shells, or jumping athletes. It's used in sports physics, ballistics, and game development.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                showDerivative: true,
                showTangentLine: true,
                tangentPoint: 1.5
            },
            is3D: false
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
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This describes oscillations in mechanical systems like vehicle suspensions and musical instruments, as well as electronic circuits and pendulums. It's also used in modeling atomic vibrations.</p>
                </div>
            `,
            conceptToActivate: 'integrals',
            initialOptions: {
                showIntegral: true,
                integralRange: [0, 3]
            },
            is3D: false
        },
        'wave-propagation': {
            title: 'Wave Propagation',
            function: 'A * sin(k*x - omega*t)',
            parameters: { A: 1, k: 1, omega: 2, t: 0.5, x: 'x' },
            description: `
                <p>This example shows a traveling wave in one dimension. The function represents:</p>
                <p>y(x,t) = A * sin(kx - ωt)</p>
                <p>Where:</p>
                <ul>
                    <li>A = amplitude (1 unit)</li>
                    <li>k = wave number (1 rad/m)</li>
                    <li>ω = angular frequency (2 rad/s)</li>
                    <li>t = time (0.5 seconds)</li>
                    <li>x = position (variable)</li>
                </ul>
                <p>The partial derivative ∂y/∂t represents the velocity of a point on the wave, while ∂y/∂x represents how quickly the wave changes with position.</p>
                <p>The wave equation ∂²y/∂t² = v² * ∂²y/∂x² describes how waves propagate, where v = ω/k is the wave velocity.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model describes electromagnetic waves (light, radio), sound waves, water waves, and many other wave phenomena including quantum mechanical waves.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                showDerivative: true
            },
            is3D: false
        },
        'heat-distribution': {
            title: '3D Heat Distribution',
            function: 'e^(-(x^2+y^2)/5) * cos(sqrt(x^2+y^2))',
            parameters: {},
            description: `
                <p>This example shows a 3D heat distribution on a surface. The function represents:</p>
                <p>T(x,y) = e<sup>-(x²+y²)/5</sup> * cos(√(x²+y²))</p>
                <p>This models a temperature field with a heat source at the origin that creates circular waves of hot and cold regions, with temperature diminishing at greater distances.</p>
                <p>The gradient ∇T gives the direction of fastest temperature increase, while the Laplacian ∇²T describes how the temperature at a point compares to its surroundings.</p>
                <p>The heat equation ∂T/∂t = α∇²T describes how heat diffuses over time.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This type of model is used in thermal analysis for electronics cooling, building insulation design, weather forecasting, and studying geothermal activity.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                colorScheme: 'gradient',
                surfaceOpacity: 0.9
            },
            is3D: true
        },
        'electric-potential': {
            title: '3D Electric Potential',
            function: '1/sqrt(x^2 + y^2 + 0.5)',
            parameters: {},
            description: `
                <p>This example shows the electric potential around a point charge. The function represents:</p>
                <p>V(x,y) = k·q/√(x² + y² + c)</p>
                <p>Where:</p>
                <ul>
                    <li>k = Coulomb constant (set to 1 for simplicity)</li>
                    <li>q = charge (set to 1 for simplicity)</li>
                    <li>c = small constant to avoid division by zero (0.5)</li>
                </ul>
                <p>The electric field E = -∇V is the gradient of the potential. The divergence ∇·E = ρ/ε₀ relates to charge density.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in electrostatics to design capacitors, particle accelerators, electron microscopes, and electrical shielding for sensitive equipment.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                colorScheme: 'height',
                surfaceOpacity: 0.85
            },
            is3D: true
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
        
        // Set 3D/2D mode
        if (exampleData.is3D !== undefined && engine.is3DMode !== exampleData.is3D) {
            engine.toggleDimension();
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