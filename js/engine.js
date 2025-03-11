/**
 * engine.js - Three.js setup and core rendering
 */

class Engine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        
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
        this.camera.position.set(0, 0, 5);
        
        // Initialize renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Add axes helper
        this.axesHelper = new THREE.AxesHelper(2);
        this.scene.add(this.axesHelper);
        
        // Add grid helper
        this.gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(this.gridHelper);
        
        // Current function visualization meshes
        this.functionMeshes = [];
        
        // Current function expression
        this.currentFunction = 'x^2';
        
        // Visualization options
        this.visualizationOptions = {
            xRange: [-5, 5],
            yRange: [-5, 5],
            resolution: 50,
            showDerivative: false,
            showTangentLine: false,
            tangentPoint: 1,
            showIntegral: false,
            integralRange: [-2, 2],
            showLimit: false,
            limitPoint: 0
        };
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
    
    refreshVisualization() {
        this.clearFunctionMeshes();
        
        // The current active concept module will add specific visualizations
        // This will be called from the active concept module
    }
    
    createFunctionSurface(fn, color = 0x3498db) {
        const { xRange, yRange, resolution } = this.visualizationOptions;
        
        // Create surface geometry
        const geometry = new THREE.BufferGeometry();
        const xStep = (xRange[1] - xRange[0]) / resolution;
        const yStep = (yRange[1] - yRange[0]) / resolution;
        
        const vertices = [];
        const indices = [];
        
        // Generate vertices
        for (let y = 0; y <= resolution; y++) {
            for (let x = 0; x <= resolution; x++) {
                const xPos = xRange[0] + x * xStep;
                const yPos = yRange[0] + y * yStep;
                let zPos;
                
                try {
                    const scope = { x: xPos, y: yPos };
                    zPos = math.evaluate(fn, scope);
                    
                    // Handle NaN, Infinity, etc.
                    if (!isFinite(zPos)) zPos = 0;
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
        
        // Set geometry attributes
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        
        // Create material and mesh
        const material = new THREE.MeshPhongMaterial({
            color: color,
            side: THREE.DoubleSide,
            flatShading: false,
            transparent: true,
            opacity: 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.functionMeshes.push(mesh);
        
        return mesh;
    }
    
    createFunctionCurve(fn, color = 0x3498db, thickness = 0.05) {
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
        const material = new THREE.MeshPhongMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        
        this.scene.add(mesh);
        this.functionMeshes.push(mesh);
        
        return mesh;
    }
}