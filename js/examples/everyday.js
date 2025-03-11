/**
 * everyday.js - Everyday application examples
 */

const EverydayExamples = {
    examples: {
        'car-acceleration': {
            title: 'Car Acceleration',
            function: 'v0 + a * t',
            parameters: { v0: 0, a: 3, t: 'x' },
            description: `
                <p>This example shows the velocity of a car under constant acceleration. The function represents:</p>
                <p>v(t) = v₀ + a * t</p>
                <p>Where:</p>
                <ul>
                    <li>v₀ = initial velocity (0 m/s)</li>
                    <li>a = acceleration (3 m/s²)</li>
                    <li>t = time (seconds)</li>
                </ul>
                <p>The derivative of this function (v'(t) = a) is constant, representing the constant acceleration.</p>
                <p>The integral of this function (∫v(t) dt = v₀*t + 0.5*a*t²) represents the position of the car at time t.</p>
                <p>This shows how calculus connects position, velocity, and acceleration in physics and everyday scenarios.</p>
            `,
            conceptToActivate: 'integrals',
            initialOptions: {
                showIntegral: true,
                integralRange: [0, 5],
                showAntiderivative: true
            }
        },
        'population-growth': {
            title: 'Population Growth',
            function: 'P0 * e^(r * t)',
            parameters: { P0: 1000, r: 0.1, t: 'x' },
            description: `
                <p>This example models exponential population growth. The function represents:</p>
                <p>P(t) = P₀ * e^(r * t)</p>
                <p>Where:</p>
                <ul>
                    <li>P₀ = initial population (1000)</li>
                    <li>r = growth rate (0.1 or 10% per time unit)</li>
                    <li>t = time (years)</li>
                </ul>
                <p>The derivative of this function (P'(t) = r * P₀ * e^(r * t) = r * P(t)) is proportional to the population itself, showing that the rate of growth increases as the population increases.</p>
                <p>This is a fundamental model in ecology, economics, and other fields where growth depends on the current state.</p>
                <p>The limit concept helps us understand what happens to the population as time approaches infinity, while derivatives help analyze the growth rate.</p>
            `,
            conceptToActivate: 'limits',
            initialOptions: {
                showLimit: true,
                limitPoint: 10,
                limitDirection: 'left'
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