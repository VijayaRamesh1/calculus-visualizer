/**
 * limits.js - Limit visualizations
 */

const LimitsModule = {
    title: 'Limits',
    
    explanation: `
        <p>The limit of a function f(x) as x approaches a value c is the value that f(x) gets arbitrarily close to as x gets arbitrarily close to c. It's denoted as lim[x\u2192c] f(x).</p>
        <p>Limits are fundamental to calculus and are used to define derivatives and integrals.</p>
        <p>Use the controls to visualize how the function value approaches the limit as x approaches the specified point. You can also explore one-sided limits (from the left or right).</p>
        <h3>Key Concepts:</h3>
        <ul>
            <li>A limit describes the behavior of a function near a point, not at the point itself</li>
            <li>For a limit to exist, the left-hand and right-hand limits must be equal</li>
            <li>Limits are the foundation of calculus</li>
            <li>Limits can exist even at points where the function is not defined</li>
            <li>Limits help in analyzing functions with discontinuities</li>
        </ul>
    `,
    
    generateControls() {
        return `
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-limit"> Show Limit Visualization
                </label>
                <div id="limit-point-container" style="margin-top: 0.5rem; display: none;">
                    <label for="limit-point">As x approaches: <span id="limit-value">0</span></label>
                    <input type="range" id="limit-point" min="-5" max="5" step="0.1" value="0">
                </div>
            </div>
            
            <div class="control-group" id="limit-direction-container" style="display: none;">
                <label>Approach direction:</label>
                <div>
                    <label>
                        <input type="radio" name="limit-direction" value="both" checked> Both sides
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" name="limit-direction" value="left"> From left (x \u2192 c\u207b)
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" name="limit-direction" value="right"> From right (x \u2192 c\u207a)
                    </label>
                </div>
            </div>
        `;
    },
    
    initControls() {
        const engine = this.engineRef;
        
        // Show limit visualization checkbox
        const limitCheckbox = document.getElementById('show-limit');
        const limitPointContainer = document.getElementById('limit-point-container');
        const limitDirectionContainer = document.getElementById('limit-direction-container');
        
        limitCheckbox.checked = engine.visualizationOptions.showLimit;
        limitPointContainer.style.display = limitCheckbox.checked ? 'block' : 'none';
        limitDirectionContainer.style.display = limitCheckbox.checked ? 'block' : 'none';
        
        limitCheckbox.addEventListener('change', (e) => {
            limitPointContainer.style.display = e.target.checked ? 'block' : 'none';
            limitDirectionContainer.style.display = e.target.checked ? 'block' : 'none';
            engine.updateVisualizationOptions({ showLimit: e.target.checked });
            this.visualize(engine);
        });
        
        // Limit point slider
        const limitPointSlider = document.getElementById('limit-point');
        const limitValueDisplay = document.getElementById('limit-value');
        
        limitPointSlider.value = engine.visualizationOptions.limitPoint;
        limitValueDisplay.textContent = engine.visualizationOptions.limitPoint;
        
        limitPointSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            limitValueDisplay.textContent = value;
            engine.updateVisualizationOptions({ limitPoint: value });
            this.visualize(engine);
        });
        
        // Limit direction radio buttons
        const directionRadios = document.getElementsByName('limit-direction');
        
        // Set the initial selected radio button based on the current direction
        if (engine.visualizationOptions.limitDirection) {
            for (const radio of directionRadios) {
                if (radio.value === engine.visualizationOptions.limitDirection) {
                    radio.checked = true;
                    break;
                }
            }
        } else {
            // Default to 'both' if not specified
            engine.visualizationOptions.limitDirection = 'both';
            directionRadios[0].checked = true;
        }
        
        // Add event listeners to radio buttons
        for (const radio of directionRadios) {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    engine.updateVisualizationOptions({ limitDirection: e.target.value });
                    this.visualize(engine);
                }
            });
        }
    },
    
    init(engine) {
        this.engineRef = engine;
        
        // Add limit direction option if not present
        if (engine.visualizationOptions.limitDirection === undefined) {
            engine.visualizationOptions.limitDirection = 'both';
        }
        
        this.visualize(engine);
    },
    
    visualize(engine) {
        engine.clearFunctionMeshes();
        
        // Get function expression and options
        const fn = engine.currentFunction;
        const { showLimit, limitPoint, limitDirection } = engine.visualizationOptions;
        
        // Create function curve
        engine.createFunctionCurve(fn, 0x3498db, 0.05);
        
        // Create limit visualization if enabled
        if (showLimit) {
            this.createLimitVisualization(engine, fn, limitPoint, limitDirection);
        }
    },
    
    createLimitVisualization(engine, fn, point, direction) {
        // Calculate the limit value
        let limitValue;
        try {
            limitValue = MathUtils.calculateLimit(fn, point, direction);
        } catch (error) {
            console.error('Error calculating limit:', error);
            limitValue = NaN;
        }
        
        // Create a point at the limit position
        if (isFinite(limitValue)) {
            const geometry = new THREE.SphereGeometry(0.1, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: 0xe74c3c });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(point, limitValue, 0);
            engine.scene.add(sphere);
            engine.functionMeshes.push(sphere);
            
            // Create vertical line at the limit point
            const lineGeometry = new THREE.BufferGeometry();
            const lineVertices = new Float32Array([
                point, -10, 0,
                point, 10, 0
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
            const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe74c3c, transparent: true, opacity: 0.5 });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            engine.scene.add(line);
            engine.functionMeshes.push(line);
        }
        
        // Create arrows to visualize the approach
        this.createApproachArrows(engine, fn, point, direction);
        
        // Create text to display limit value
        const limitText = isFinite(limitValue) ? limitValue.toFixed(4) : 'undefined';
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
        
        let directionSymbol = '';
        if (direction === 'left') directionSymbol = '\u207b';
        else if (direction === 'right') directionSymbol = '\u207a';
        
        context.fillText(`lim[x\u2192${point}${directionSymbol}] f(x) = ${limitText}`, canvas.width / 2, canvas.height / 2);
        
        // Create texture and sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 0.5, 1);
        sprite.position.set(point, isFinite(limitValue) ? limitValue + 1 : 0, 0);
        engine.scene.add(sprite);
        engine.functionMeshes.push(sprite);
    },
    
    createApproachArrows(engine, fn, point, direction) {
        const arrowCount = 5;
        const arrowSpacing = 0.5;
        
        // Function to create an arrow
        const createArrow = (startX, startY, endX, endY, color) => {
            // Create line
            const lineGeometry = new THREE.BufferGeometry();
            const lineVertices = new Float32Array([
                startX, startY, 0,
                endX, endY, 0
            ]);
            lineGeometry.setAttribute('position', new THREE.BufferAttribute(lineVertices, 3));
            const lineMaterial = new THREE.LineBasicMaterial({ color: color });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            engine.scene.add(line);
            engine.functionMeshes.push(line);
            
            // Create arrowhead
            const arrowHeadLength = 0.1;
            const angle = Math.atan2(endY - startY, endX - startX);
            
            const coneGeometry = new THREE.ConeGeometry(0.05, arrowHeadLength * 2, 8);
            const coneMaterial = new THREE.MeshBasicMaterial({ color: color });
            const cone = new THREE.Mesh(coneGeometry, coneMaterial);
            cone.position.set(endX, endY, 0);
            cone.rotation.z = angle - Math.PI / 2;
            engine.scene.add(cone);
            engine.functionMeshes.push(cone);
        };
        
        // Approaching from the left
        if (direction === 'left' || direction === 'both') {
            const leftColor = 0x9b59b6; // Purple
            
            for (let i = 1; i <= arrowCount; i++) {
                const startX = point - i * arrowSpacing;
                let startY;
                
                try {
                    startY = math.evaluate(fn, { x: startX });
                    if (!isFinite(startY)) continue;
                } catch (error) {
                    continue;
                }
                
                const endX = point - (i - 1) * arrowSpacing;
                let endY;
                
                if (i === 1) {
                    try {
                        // Try to evaluate at the exact limit point
                        endY = math.evaluate(fn, { x: point });
                        if (!isFinite(endY)) {
                            // If not defined at the limit point, approximate
                            endY = MathUtils.calculateLimit(fn, point, 'left');
                        }
                    } catch (error) {
                        endY = MathUtils.calculateLimit(fn, point, 'left');
                    }
                } else {
                    try {
                        endY = math.evaluate(fn, { x: endX });
                        if (!isFinite(endY)) continue;
                    } catch (error) {
                        continue;
                    }
                }
                
                createArrow(startX, startY, endX, endY, leftColor);
            }
        }
        
        // Approaching from the right
        if (direction === 'right' || direction === 'both') {
            const rightColor = 0xe67e22; // Orange
            
            for (let i = 1; i <= arrowCount; i++) {
                const startX = point + i * arrowSpacing;
                let startY;
                
                try {
                    startY = math.evaluate(fn, { x: startX });
                    if (!isFinite(startY)) continue;
                } catch (error) {
                    continue;
                }
                
                const endX = point + (i - 1) * arrowSpacing;
                let endY;
                
                if (i === 1) {
                    try {
                        // Try to evaluate at the exact limit point
                        endY = math.evaluate(fn, { x: point });
                        if (!isFinite(endY)) {
                            // If not defined at the limit point, approximate
                            endY = MathUtils.calculateLimit(fn, point, 'right');
                        }
                    } catch (error) {
                        endY = MathUtils.calculateLimit(fn, point, 'right');
                    }
                } else {
                    try {
                        endY = math.evaluate(fn, { x: endX });
                        if (!isFinite(endY)) continue;
                    } catch (error) {
                        continue;
                    }
                }
                
                createArrow(startX, startY, endX, endY, rightColor);
            }
        }
    }
};