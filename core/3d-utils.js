/**
 * 3D Utilities for Calculus Visualizer
 * 
 * Utilities for working with Three.js for 3D visualizations
 * Provides simplified APIs for common operations:
 * - Scene setup and management
 * - Camera controls
 * - Basic geometry creation
 * - Material management
 * - Coordinate axes
 * - Vector visualization
 */

class ThreeUtils {
    constructor(container) {
        // Initialize Three.js components
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        // Setup renderer
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        
        // Setup camera position and controls
        this.camera.position.set(5, 5, 10);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        
        // Setup lighting
        this.setupLighting();
        
        // Create container reference
        this.container = container;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Animation loop
        this.animate();
    }
    
    /**
     * Setup default lighting for the scene
     */
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
        
        // Hemisphere light for better shadows
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 0.8);
        this.scene.add(hemisphereLight);
    }
    
    /**
     * Handle window resize events
     */
    onWindowResize() {
        if (!this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Create coordinate axes
     * @param {number} length - Length of each axis
     * @param {boolean} showLabels - Whether to show X,Y,Z labels
     * @returns {THREE.Group} - Group containing axes
     */
    createAxes(length = 10, showLabels = true) {
        const axesGroup = new THREE.Group();
        
        // X-axis (red)
        const xAxis = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, 0),
            length,
            0xff0000,
            0.5,
            0.3
        );
        axesGroup.add(xAxis);
        
        // Y-axis (green)
        const yAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            length,
            0x00ff00,
            0.5,
            0.3
        );
        axesGroup.add(yAxis);
        
        // Z-axis (blue)
        const zAxis = new THREE.ArrowHelper(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, 0),
            length,
            0x0000ff,
            0.5,
            0.3
        );
        axesGroup.add(zAxis);
        
        if (showLabels) {
            // Add text labels for axes
            const loader = new THREE.FontLoader();
            loader.load('https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                const textOptions = {
                    font: font,
                    size: 0.5,
                    height: 0.1
                };
                
                // X label
                const xLabel = new THREE.Mesh(
                    new THREE.TextGeometry('X', textOptions),
                    new THREE.MeshBasicMaterial({ color: 0xff0000 })
                );
                xLabel.position.set(length + 0.5, 0, 0);
                axesGroup.add(xLabel);
                
                // Y label
                const yLabel = new THREE.Mesh(
                    new THREE.TextGeometry('Y', textOptions),
                    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
                );
                yLabel.position.set(0, length + 0.5, 0);
                axesGroup.add(yLabel);
                
                // Z label
                const zLabel = new THREE.Mesh(
                    new THREE.TextGeometry('Z', textOptions),
                    new THREE.MeshBasicMaterial({ color: 0x0000ff })
                );
                zLabel.position.set(0, 0, length + 0.5);
                axesGroup.add(zLabel);
            });
        }
        
        this.scene.add(axesGroup);
        return axesGroup;
    }
    
    /**
     * Create a grid helper in the XZ plane
     * @param {number} size - Size of the grid
     * @param {number} divisions - Number of divisions
     * @param {number} color1 - Color of main grid lines
     * @param {number} color2 - Color of secondary grid lines
     */
    createGrid(size = 20, divisions = 20, color1 = 0x888888, color2 = 0x444444) {
        const grid = new THREE.GridHelper(size, divisions, color1, color2);
        this.scene.add(grid);
        return grid;
    }
    
    /**
     * Create a ground plane
     * @param {number} width - Width of the plane
     * @param {number} height - Height of the plane
     * @param {number} color - Color of the plane
     * @param {number} opacity - Opacity of the plane (0-1)
     */
    createGroundPlane(width = 20, height = 20, color = 0xdddddd, opacity = 0.7) {
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            transparent: opacity < 1,
            opacity: opacity,
            side: THREE.DoubleSide
        });
        
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2; // Rotate to horizontal
        plane.position.y = 0; // At ground level
        plane.receiveShadow = true;
        
        this.scene.add(plane);
        return plane;
    }
    
    /**
     * Create a line from a series of points
     * @param {Array} points - Array of points {x,y,z}
     * @param {number} color - Line color
     * @param {number} lineWidth - Line width (if supported)
     */
    createLineFromPoints(points, color = 0xff0000, lineWidth = 2) {
        const geometry = new THREE.BufferGeometry();
        
        // Convert points to vertices
        const vertices = [];
        points.forEach(point => {
            vertices.push(point.x, point.y, point.z);
        });
        
        // Add vertices to geometry
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        // Create material and line
        const material = new THREE.LineBasicMaterial({ color: color, linewidth: lineWidth });
        const line = new THREE.Line(geometry, material);
        
        this.scene.add(line);
        return line;
    }
    
    /**
     * Create a curved line or tube from a series of points
     * @param {Array} points - Array of points {x,y,z}
     * @param {number} radius - Tube radius
     * @param {number} color - Tube color
     */
    createTubeFromPoints(points, radius = 0.05, color = 0xff0000) {
        // Create a smooth curve through the points
        const curvePoints = points.map(p => new THREE.Vector3(p.x, p.y, p.z));
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        
        // Create tube geometry
        const geometry = new THREE.TubeGeometry(curve, points.length * 10, radius, 8, false);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const tube = new THREE.Mesh(geometry, material);
        
        this.scene.add(tube);
        return tube;
    }
    
    /**
     * Create a vector arrow
     * @param {Object} origin - Origin point {x,y,z}
     * @param {Object} direction - Direction vector {x,y,z}
     * @param {number} length - Arrow length (0 to use direction magnitude)
     * @param {number} color - Arrow color
     * @param {number} headLength - Length of arrow head
     * @param {number} headWidth - Width of arrow head
     */
    createVector(origin, direction, length = 0, color = 0xffff00, headLength = 0.2, headWidth = 0.1) {
        const originVec = new THREE.Vector3(origin.x, origin.y, origin.z);
        const dirVec = new THREE.Vector3(direction.x, direction.y, direction.z);
        
        // Use provided length or calculate from direction
        const arrowLength = length || dirVec.length();
        
        // Normalize direction vector
        dirVec.normalize();
        
        // Create arrow helper
        const arrow = new THREE.ArrowHelper(
            dirVec,
            originVec,
            arrowLength,
            color,
            headLength * arrowLength,
            headWidth * arrowLength
        );
        
        this.scene.add(arrow);
        return arrow;
    }
    
    /**
     * Create a parametric surface
     * @param {Function} func - Function that takes (u,v) and returns {x,y,z}
     * @param {number} uSegments - Segments in u direction
     * @param {number} vSegments - Segments in v direction
     * @param {number} uStart - Start value for u
     * @param {number} uEnd - End value for u
     * @param {number} vStart - Start value for v
     * @param {number} vEnd - End value for v
     * @param {number} color - Surface color
     */
    createParametricSurface(func, uSegments = 20, vSegments = 20, 
                             uStart = 0, uEnd = 1, vStart = 0, vEnd = 1, 
                             color = 0x00aaff) {
        // Create parametric geometry
        const geometry = new THREE.ParametricGeometry(
            (u, v, target) => {
                // Map u,v to the desired range
                const mappedU = uStart + u * (uEnd - uStart);
                const mappedV = vStart + v * (vEnd - vStart);
                
                // Calculate position
                const pos = func(mappedU, mappedV);
                target.set(pos.x, pos.y, pos.z);
            },
            uSegments,
            vSegments
        );
        
        // Create material and mesh
        const material = new THREE.MeshStandardMaterial({
            color: color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            wireframe: false
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        return mesh;
    }
    
    /**
     * Clear the scene (remove all objects)
     */
    clearScene() {
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
        this.setupLighting(); // Re-add lights after clearing
    }
    
    /**
     * Toggle wireframe mode for all meshes in the scene
     * @param {boolean} wireframe - Whether to enable wireframe mode
     */
    setWireframe(wireframe) {
        this.scene.traverse(object => {
            if (object.isMesh && object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => {
                        mat.wireframe = wireframe;
                    });
                } else {
                    object.material.wireframe = wireframe;
                }
            }
        });
    }
    
    /**
     * Toggle visibility of an object
     * @param {THREE.Object3D} object - The object to toggle
     * @param {boolean} visible - Whether the object should be visible
     */
    setObjectVisibility(object, visible) {
        if (object) {
            object.visible = visible;
        }
    }
    
    /**
     * Create a sphere
     * @param {number} radius - Sphere radius
     * @param {Object} position - Position {x,y,z}
     * @param {number} color - Sphere color
     */
    createSphere(radius = 0.2, position = {x: 0, y: 0, z: 0}, color = 0xff0000) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        
        sphere.position.set(position.x, position.y, position.z);
        this.scene.add(sphere);
        return sphere;
    }
}

// Export the ThreeUtils class for use in other modules
export default ThreeUtils;