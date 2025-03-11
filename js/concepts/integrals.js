/**
 * integrals.js - Integral visualizations
 */

const IntegralsModule = {
    title: 'Integrals',
    
    explanation: `
        <p>An integral represents the area under a curve. The definite integral of a function f(x) from a to b, denoted as \u222b[a,b] f(x) dx, calculates the net area between the function curve and the x-axis over the interval [a, b].</p>
        <p>The indefinite integral, or antiderivative, is a function F(x) whose derivative is f(x).</p>
        <p>Use the controls to visualize the original function f(x) and the area under its curve (definite integral) within a specified range.</p>
        <h3>Key Concepts:</h3>
        <ul>
            <li>The definite integral measures the net area under a curve</li>
            <li>Areas above the x-axis are positive, below are negative</li>
            <li>The Fundamental Theorem of Calculus connects derivatives and integrals</li>
            <li>The indefinite integral is the family of all antiderivatives of a function</li>
            <li>Definite integrals have many applications in physics, engineering, and other fields</li>
        </ul>
    `,
    
    generateControls() {
        return `
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-integral"> Show Integral Area
                </label>
                <div id="integral-range-container" style="margin-top: 0.5rem; display: none;">
                    <label>Integral Range:</label>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <input type="number" id="integral-start" min="-5" max="5" step="0.1" value="-2" style="width: 60px;">
                        <span>to</span>
                        <input type="number" id="integral-end" min="-5" max="5" step="0.1" value="2" style="width: 60px;">
                    </div>
                </div>
            </div>
            
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-antiderivative"> Show Antiderivative F(x)
                </label>
            </div>
        `;
    },
    
    initControls() {
        const engine = this.engineRef;
        
        // Show integral area checkbox
        const integralCheckbox = document.getElementById('show-integral');
        const integralRangeContainer = document.getElementById('integral-range-container');
        
        integralCheckbox.checked = engine.visualizationOptions.showIntegral;
        integralRangeContainer.style.display = integralCheckbox.checked ? 'block' : 'none';
        
        integralCheckbox.addEventListener('change', (e) => {
            integralRangeContainer.style.display = e.target.checked ? 'block' : 'none';
            engine.updateVisualizationOptions({ showIntegral: e.target.checked });
            this.visualize(engine);
        });
        
        // Integral range inputs
        const integralStartInput = document.getElementById('integral-start');
        const integralEndInput = document.getElementById('integral-end');
        
        integralStartInput.value = engine.visualizationOptions.integralRange[0];
        integralEndInput.value = engine.visualizationOptions.integralRange[1];
        
        const updateIntegralRange = () => {
            const start = parseFloat(integralStartInput.value);
            const end = parseFloat(integralEndInput.value);
            engine.updateVisualizationOptions({ 
                integralRange: [start, end] 
            });
            this.visualize(engine);
        };
        
        integralStartInput.addEventListener('change', updateIntegralRange);
        integralEndInput.addEventListener('change', updateIntegralRange);
        
        // Show antiderivative checkbox
        const antiderivativeCheckbox = document.getElementById('show-antiderivative');
        antiderivativeCheckbox.checked = engine.visualizationOptions.showAntiderivative;
        
        antiderivativeCheckbox.addEventListener('change', (e) => {
            engine.updateVisualizationOptions({ showAntiderivative: e.target.checked });
            this.visualize(engine);
        });
    },
    
    init(engine) {
        this.engineRef = engine;
        
        // Add antiderivative option if not present
        if (engine.visualizationOptions.showAntiderivative === undefined) {
            engine.visualizationOptions.showAntiderivative = false;
        }
        
        this.visualize(engine);
    },
    
    visualize(engine) {
        engine.clearFunctionMeshes();
        
        // Get function expression and options
        const fn = engine.currentFunction;
        const { showIntegral, integralRange, showAntiderivative } = engine.visualizationOptions;
        
        // Create function curve
        engine.createFunctionCurve(fn, 0x3498db, 0.05);
        
        // Create antiderivative curve if enabled
        if (showAntiderivative) {
            try {
                const antiderivativeFn = MathUtils.getAntiderivativeExpression(fn);
                engine.createFunctionCurve(antiderivativeFn, 0x27ae60, 0.05);
            } catch (error) {
                console.error('Error generating antiderivative:', error);
            }
        }
        
        // Create integral area visualization if enabled
        if (showIntegral) {
            this.createIntegralVisualization(engine, fn, integralRange);
        }
    },
    
    createIntegralVisualization(engine, fn, range) {
        const [a, b] = range;
        const resolution = 50;
        const step = (b - a) / resolution;
        
        // Create geometry for the filled area
        const shape = new THREE.Shape();
        
        // Start at the leftmost point on the x-axis
        shape.moveTo(a, 0);
        
        // Add points along the curve
        for (let i = 0; i <= resolution; i++) {
            const x = a + i * step;
            let y;
            
            try {
                y = math.evaluate(fn, { x });
                if (!isFinite(y)) y = 0;
            } catch (error) {
                y = 0;
            }
            
            shape.lineTo(x, y);
        }
        
        // Close the shape by going back to the x-axis
        shape.lineTo(b, 0);
        shape.lineTo(a, 0);
        
        // Create geometry and material
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x3498db,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        // Create the mesh and add to scene
        const mesh = new THREE.Mesh(geometry, material);
        engine.scene.add(mesh);
        engine.functionMeshes.push(mesh);
        
        // Calculate the definite integral value
        let integralValue;
        try {
            integralValue = MathUtils.calculateDefiniteIntegral(fn, a, b);
        } catch (error) {
            console.error('Error calculating definite integral:', error);
            integralValue = NaN;
        }
        
        // Create text to display integral value
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '20px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`\u222b[${a}, ${b}] f(x) dx = ${integralValue.toFixed(4)}`, canvas.width / 2, canvas.height / 2);
        
        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 0.5, 1);
        sprite.position.set((a + b) / 2, -1, 0);
        engine.scene.add(sprite);
        engine.functionMeshes.push(sprite);
    }
};