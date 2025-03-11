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
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in vehicle design, traffic flow analysis, and driving safety calculations. It helps determine stopping distances, fuel efficiency, and performance specifications.</p>
                </div>
            `,
            conceptToActivate: 'integrals',
            initialOptions: {
                showIntegral: true,
                integralRange: [0, 5],
                showAntiderivative: true
            },
            is3D: false
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
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in demography, ecology, epidemiology, and economics to predict future population sizes, bacterial growth, viral spread, and compound interest growth.</p>
                </div>
            `,
            conceptToActivate: 'limits',
            initialOptions: {
                showLimit: true,
                limitPoint: 10,
                limitDirection: 'left'
            },
            is3D: false
        },
        'market-equilibrium': {
            title: 'Market Equilibrium',
            function: 'supply - demand',
            parameters: { supply: '2*x + 5', demand: '100 - 3*x', x: 'x' },
            description: `
                <p>This example shows market equilibrium between supply and demand. The function represents:</p>
                <p>E(p) = S(p) - D(p)</p>
                <p>Where:</p>
                <ul>
                    <li>S(p) = 2p + 5 (supply function)</li>
                    <li>D(p) = 100 - 3p (demand function)</li>
                    <li>p = price (variable)</li>
                </ul>
                <p>The equilibrium price occurs where E(p) = 0, meaning supply equals demand.</p>
                <p>The derivative E'(p) = S'(p) - D'(p) = 2 - (-3) = 5 represents how quickly the excess supply changes with price, helping determine market stability.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in economics to predict prices, analyze market stability, and understand how external factors affect markets. It helps businesses set optimal pricing and policymakers design effective economic interventions.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                showDerivative: true
            },
            is3D: false
        },
        'loan-repayment': {
            title: 'Loan Repayment',
            function: 'P * (1 + r)^t',
            parameters: { P: 10000, r: 0.05, t: 'x' },
            description: `
                <p>This example shows the growth of a loan balance with compound interest. The function represents:</p>
                <p>B(t) = P * (1 + r)^t</p>
                <p>Where:</p>
                <ul>
                    <li>P = principal amount ($10,000)</li>
                    <li>r = interest rate (5% annually)</li>
                    <li>t = time in years (variable)</li>
                </ul>
                <p>The derivative B'(t) = P * (1 + r)^t * ln(1 + r) represents how quickly the balance is growing at any point in time.</p>
                <p>Looking at the limit as t approaches infinity shows what happens to unpaid debt over time.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in personal finance for loan amortization, credit card payments, and mortgage calculations. It helps individuals understand the long-term impact of interest rates and make informed financial decisions.</p>
                </div>
            `,
            conceptToActivate: 'limits',
            initialOptions: {
                showLimit: true,
                limitPoint: 30,
                limitDirection: 'right'
            },
            is3D: false
        },
        'consumer-preference': {
            title: '3D Consumer Utility',
            function: 'x^0.6 * y^0.4',
            parameters: {},
            description: `
                <p>This example shows a Cobb-Douglas utility function, which represents consumer preferences between two goods. The function is:</p>
                <p>U(x,y) = x^α * y^β</p>
                <p>Where:</p>
                <ul>
                    <li>x = quantity of good X</li>
                    <li>y = quantity of good Y</li>
                    <li>α = preference weight for good X (0.6)</li>
                    <li>β = preference weight for good Y (0.4)</li>
                    <li>α + β = 1 (constant returns to scale)</li>
                </ul>
                <p>The partial derivatives ∂U/∂x and ∂U/∂y represent marginal utilities - how much additional satisfaction comes from one more unit of each good.</p>
                <p>The ratio of marginal utilities equals the marginal rate of substitution, which shows how consumers trade off between goods.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in economics to analyze consumer behavior, design pricing strategies, and predict market demand. It helps businesses understand how preferences affect purchasing decisions and optimize product offerings.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                colorScheme: 'gradient',
                surfaceOpacity: 0.85
            },
            is3D: true
        },
        'retail-location': {
            title: '3D Geographic Sales',
            function: '200 - 2*sqrt(x^2 + y^2)',
            parameters: {},
            description: `
                <p>This example shows how sales decrease with distance from a retail center. The function represents:</p>
                <p>S(x,y) = S₀ - k*d</p>
                <p>Where:</p>
                <ul>
                    <li>S₀ = maximum sales at the center ($200)</li>
                    <li>k = distance decay factor (2)</li>
                    <li>d = distance from center √(x² + y²)</li>
                    <li>x,y = location coordinates</li>
                </ul>
                <p>The gradient ∇S points toward the direction of maximum sales increase, which is always toward the center.</p>
                <p>The Laplacian ∇²S indicates how the sales at a point compare to the average sales in its neighborhood.</p>
                <div class="real-world-application">
                    <h4>Real-world application</h4>
                    <p>This model is used in retail location analysis, urban planning, and real estate valuation. It helps businesses optimize store locations, predict sales performance, and understand customer shopping patterns based on geography.</p>
                </div>
            `,
            conceptToActivate: 'derivatives',
            initialOptions: {
                colorScheme: 'height',
                surfaceOpacity: 0.9
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