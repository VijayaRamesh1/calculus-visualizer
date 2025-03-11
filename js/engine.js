/**
 * engine.js - Three.js setup and core rendering
 */

class Engine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.is3DMode = true; // Default to 3D mode
        
        // Initialize scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Initialize camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.getAspectRatio(), 
            0.1, 
            1000
        );
        this.camera.position.set(3, 3, 5);
        
        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.7;
        this.controls.zoomSpeed = 1.2;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);

        // Add second directional light for better illumination
        const secondaryLight = new THREE.DirectionalLight(0xffffff, 0.5);
        secondaryLight.position.set(-5, 5, -5);
        this.scene.add(secondaryLight);
        
        // Add axes helper
        this.axesHelper = new THREE.AxesHelper(2);
        this.scene.add(this.axesHelper);
        
        // Add grid helper
        this.gridHelper = new THREE.GridHelper(10, 10);
        this.gridHelper.rotation.x = Math.PI / 2; // Make grid horizontal
        this.scene.add(this.gridHelper);
        
        // Add axis labels
        this.addAxisLabels();
        
        // Current function visualization meshes
        this.functionMeshes = [];
        
        // Current function expression
        this.currentFunction = 'x^2';
        
        // Visualization options
        this.visualizationOptions = {
            xRange: [-5, 5],
            yRange: [-5, 5],
            zRange: [-5, 5],
            resolution: 50,
            showDerivative: false,
            showTangentLine: false,
            tangentPoint: 1,
            showIntegral: false,
            integralRange: [-2, 2],
            showLimit: false,
            limitPoint: 0,
            colorScheme: 'gradient', // Options: 'gradient', 'height', 'curvature'
            surfaceOpacity: 0.8
        };
        
        // Initialize animation variables
        this.animationTime = 0;

        // Enable animation loop
        this.animateFunction = false;
        
        // Dispatch event that engine is initialized
        window.dispatchEvent(new CustomEvent('engineInitialized', { detail: { engine: this } }));
    }
    
    addAxisLabels() {
        const createLabel = (text, position) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 32;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '24px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.copy(position);
            sprite.scale.set(0.5, 0.25, 1);
            
            return sprite;
        };
        
        // X axis label
        const xLabel = createLabel('X', new THREE.Vector3(3, 0, 0));
        this.scene.add(xLabel);
        
        // Y axis label
        const yLabel = createLabel('Y', new THREE.Vector3(0, 3, 0));
        this.scene.add(yLabel);
        
        // Z axis label
        const zLabel = createLabel('Z', new THREE.Vector3(0, 0, 3));
        this.scene.add(zLabel);
    }
    
    getAspectRatio() {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }
    
    resize() {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }
    
    update() {
        this.controls.update();
        
        // Update animation time
        this.animationTime += 0.01;
        
        // If function animation is enabled, update the function
        if (this.animateFunction) {
            this.animateFunctionVisualization();
        }
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    clearFunctionMeshes() {
        // Remove all function-related meshes from the scene
        this.functionMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.functionMeshes = [];
    }
    
    updateFunction(functionExpression) {
        this.currentFunction = functionExpression;
        this.refreshVisualization();
    }
    
    updateVisualizationOptions(options) {
        Object.assign(this.visualizationOptions, options);
        this.refreshVisualization();
    }
    
    toggleDimension() {
        this.is3DMode = !this.is3DMode;
        
        if (this.is3DMode) {
            // Transition to 3D view
            this.camera.position.set(3, 3, 5);
            this.controls.enableRotate = true;
        } else {
            // Transition to 2D view (top-down)
            this.camera.position.set(0, 0, 10);
            this.camera.lookAt(0, 0, 0);
            this.controls.enableRotate = false;
        }
        
        this.refreshVisualization();
    }
    
    refreshVisualization() {
        this.clearFunctionMeshes();
        
        // The current active concept module will add specific visualizations
        // This will be called from the active concept module
    }
    
    animateFunctionVisualization() {
        // Wave animation for the function surface
        this.functionMeshes.forEach(mesh => {
            if (mesh.type === 'surface') {
                const positions = mesh.geometry.attributes.position.array;
                const originalPositions = mesh.userData.originalPositions;
                
                for (let i = 0; i < positions.length; i += 3) {
                    const x = originalPositions[i];
                    const y = originalPositions[i + 1];
                    
                    // Add wave effect
                    positions[i + 2] = originalPositions[i + 2] + 
                        Math.sin(this.animationTime * 2 + x + y) * 0.1;
                }
                
                mesh.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
    
    createFunctionSurface(fn, color = 0x3498db) {
        const { xRange, yRange, resolution, colorScheme, surfaceOpacity } = this.visualizationOptions;
        
        if (this.is3DMode) {
            // 3D Surface z = f(x,y)
            return this.create3DSurface(fn, color);
        } else {
            // 2D Surface y = f(x)
            return this.create2DCurve(fn, color);
        }
    }
    
    create3DSurface(fn, baseColor = 0x3498db) {
        const { xRange, yRange, resolution, colorScheme, surfaceOpacity } = this.visualizationOptions;
        
        // Create surface geometry
        const geometry = new THREE.BufferGeometry();
        const xStep = (xRange[1] - xRange[0]) / resolution;
        const yStep = (yRange[1] - yRange[0]) / resolution;
        
        const vertices = [];
        const indices = [];
        const colors = [];
        
        // Store min/max function values for color mapping
        let minZ = Infinity;
        let maxZ = -Infinity;
        
        // Generate vertices
        for (let y = 0; y <= resolution; y++) {
            for (let x = 0; x <= resolution; x++) {
                const xPos = xRange[0] + x * xStep;
                const yPos = yRange[0] + y * yStep;
                let zPos;
                
                try {
                    // For 3D surface, evaluate z = f(x,y)
                    // We substitute y in the function with y from the grid
                    const scope = { x: xPos, y: yPos };
                    zPos = math.evaluate(fn, scope);
                    
                    // Handle NaN, Infinity, etc.
                    if (!isFinite(zPos)) zPos = 0;
                    
                    // Track min/max for color mapping
                    minZ = Math.min(minZ, zPos);
                    maxZ = Math.max(maxZ, zPos);
                } catch (error) {
                    zPos = 0;
                }
                
                vertices.push(xPos, yPos, zPos);
            }
        }
        
        // Generate indices for triangles
        for (let y = 0; y < resolution; y++) {
            for (let x = 0; x < resolution; x++) {
                const v1 = y * (resolution + 1) + x;
                const v2 = v1 + 1;
                const v3 = (y + 1) * (resolution + 1) + x;
                const v4 = v3 + 1;
                
                // First triangle
                indices.push(v1, v2, v3);
                // Second triangle
                indices.push(v2, v4, v3);
            }
        }
        
        // Generate colors based on the selected scheme
        if (colorScheme === 'gradient') {
            for (let i = 0; i < vertices.length; i += 3) {
                const zPos = vertices[i + 2];
                const t = (zPos - minZ) / (maxZ - minZ);
                
                // Create a gradient from blue to red
                const r = Math.floor(t * 255);
                const g = Math.floor((1 - Math.abs(2 * t - 1)) * 255);
                const b = Math.floor((1 - t) * 255);
                
                colors.push(r / 255, g / 255, b / 255);
            }
        } else if (colorScheme === 'height') {
            for (let i = 0; i < vertices.length; i += 3) {
                const zPos = vertices[i + 2];
                const t = (zPos - minZ) / (maxZ - minZ);
                
                // Rainbow coloring
                const hue = t * 270; // 0 to 270 degrees (purple to red)
                const rgb = this.hslToRgb(hue / 360, 1, 0.5);
                
                colors.push(rgb[0], rgb[1], rgb[2]);
            }
        } else {
            // Default to base color
            for (let i = 0; i < vertices.length / 3; i++) {
                const color = new THREE.Color(baseColor);
                colors.push(color.r, color.g, color.b);
            }
        }
        
        // Set geometry attributes
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();
        
        // Store original positions for animation
        const originalPositions = vertices.slice();
        
        // Create material and mesh
        const material = new THREE.MeshPhongMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
            flatShading: false,
            transparent: true,
            opacity: surfaceOpacity,
            shininess: 30
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.type = 'surface'; // Custom property for identification
        mesh.userData.originalPositions = originalPositions;
        
        this.scene.add(mesh);
        this.functionMeshes.push(mesh);
        
        return mesh;
    }
    
    create2DCurve(fn, color = 0x3498db, thickness = 0.05) {
        const { xRange, resolution } = this.visualizationOptions;
        
        // Calculate points for the curve
        const points = [];
        const xStep = (xRange[1] - xRange[0]) / resolution;
        
        for (let i = 0; i <= resolution; i++) {
            const x = xRange[0] + i * xStep;
            let y;
            
            try {
                y = math.evaluate(fn, { x: x });
                if (!isFinite(y)) continue; // Skip NaN, Infinity, etc.
            } catch (error) {
                continue;
            }
            
            // For 2D view, use y as the function value and set z to 0
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        // Create curve from points
        const curve = new THREE.CatmullRomCurve3(points);
        
        // Create tube geometry along the curve
        const geometry = new THREE.TubeGeometry(
            curve,
            resolution,
            thickness,
            8,
            false
        );
        
        // Create material and mesh
        const material = new THREE.MeshPhongMaterial({ 
            color: color,
            emissive: new THREE.Color(color).multiplyScalar(0.2)
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        this.scene.add(mesh);
        this.functionMeshes.push(mesh);
        
        return mesh;
    }
    
    createFunctionCurve(fn, color = 0x3498db, thickness = 0.05) {
        return this.create2DCurve(fn, color, thickness);
    }
    
    // Utility function to convert HSL to RGB
    hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [r, g, b];
    }
}