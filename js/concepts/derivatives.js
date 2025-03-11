/**
 * derivatives.js - Derivative visualizations
 */

const DerivativesModule = {
    title: 'Derivatives',
    
    explanation: `
        <p>The derivative of a function represents its rate of change at any given point. Geometrically, it's the slope of the tangent line to the function's graph at that point.</p>
        <p>The derivative of a function f(x) is denoted as f'(x) or df/dx.</p>
        <p>Use the controls to visualize the original function f(x) and its derivative f'(x). You can also see the tangent line at a specific point to understand the geometric meaning of derivatives.</p>
        <h3>Key Concepts:</h3>
        <ul>
            <li>The derivative measures the instantaneous rate of change</li>
            <li>Geometrically, it's the slope of the tangent line at a point</li>
            <li>When f'(x) > 0, the function is increasing</li>
            <li>When f'(x) < 0, the function is decreasing</li>
            <li>When f'(x) = 0, the function has a critical point (potential maximum, minimum, or inflection point)</li>
        </ul>
    `,
    
    generateControls() {
        return `
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-derivative"> Show Derivative f'(x)
                </label>
            </div>
            
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-tangent"> Show Tangent Line
                </label>
                <div id="tangent-point-container" style="margin-top: 0.5rem; display: none;">
                    <label for="tangent-point">Tangent Point (x = <span id="tangent-value">1</span>)</label>
                    <input type="range" id="tangent-point" min="-5" max="5" step="0.1" value="1">
                </div>
            </div>
        `;
    },
    
    initControls() {
        const engine = this.engineRef;
        
        // Show derivative checkbox
        const derivativeCheckbox = document.getElementById('show-derivative');
        derivativeCheckbox.checked = engine.visualizationOptions.showDerivative;
        derivativeCheckbox.addEventListener('change', (e) => {
            engine.updateVisualizationOptions({ showDerivative: e.target.checked });
            this.visualize(engine);
        });
        
        // Show tangent line checkbox
        const tangentCheckbox = document.getElementById('show-tangent');
        const tangentPointContainer = document.getElementById('tangent-point-container');
        
        tangentCheckbox.checked = engine.visualizationOptions.showTangentLine;
        tangentPointContainer.style.display = tangentCheckbox.checked ? 'block' : 'none';
        
        tangentCheckbox.addEventListener('change', (e) => {
            tangentPointContainer.style.display = e.target.checked ? 'block' : 'none';
            engine.updateVisualizationOptions({ showTangentLine: e.target.checked });
            this.visualize(engine);
        });
        
        // Tangent point slider
        const tangentPointSlider = document.getElementById('tangent-point');
        const tangentValueDisplay = document.getElementById('tangent-value');
        
        tangentPointSlider.value = engine.visualizationOptions.tangentPoint;
        tangentValueDisplay.textContent = engine.visualizationOptions.tangentPoint;
        
        tangentPointSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            tangentValueDisplay.textContent = value;
            engine.updateVisualizationOptions({ tangentPoint: value });
            this.visualize(engine);
        });
    },
    
    init(engine) {
        this.engineRef = engine;
        this.visualize(engine);
    },
    
    visualize(engine) {
        engine.clearFunctionMeshes();
        
        // Get function expression and options
        const fn = engine.currentFunction;
        const { showDerivative, showTangentLine, tangentPoint } = engine.visualizationOptions;
        
        // Create function curve
        engine.createFunctionCurve(fn, 0x3498db, 0.05);
        
        // Create derivative curve if enabled
        if (showDerivative) {
            const derivativeFn = MathUtils.getDerivativeExpression(fn);
            engine.createFunctionCurve(derivativeFn, 0xe74c3c, 0.05);
        }
        
        // Create tangent line if enabled
        if (showTangentLine) {
            this.createTangentLine(engine, fn, tangentPoint);
        }
    },
    
    createTangentLine(engine, fn, x) {
        // Calculate the function value at point x
        let y;
        try {
            y = math.evaluate(fn, { x });
        } catch (error) {
            console.error('Error evaluating function at tangent point:', error);
            return;
        }
        
        // Calculate the derivative value at point x (slope of tangent)
        const derivativeFn = MathUtils.getDerivativeExpression(fn);
        let slope;
        try {
            slope = math.evaluate(derivativeFn, { x });
        } catch (error) {
            console.error('Error evaluating derivative at tangent point:', error);
            return;
        }
        
        // Create tangent line geometry
        // y - y0 = m(x - x0) => y = m(x - x0) + y0 => y = mx - mx0 + y0
        const tangentFn = `${slope} * (x - ${x}) + ${y}`;
        
        // Create tangent line with a different color
        engine.createFunctionCurve(tangentFn, 0xf39c12, 0.03);
        
        // Add a point at the tangent position
        const geometry = new THREE.SphereGeometry(0.1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xf39c12 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, 0);
        engine.scene.add(sphere);
        engine.functionMeshes.push(sphere);
    }
};