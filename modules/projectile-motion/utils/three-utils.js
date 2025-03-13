/**
 * Three.js Utilities for Projectile Motion Visualization
 * 
 * Enhanced version with better materials, lighting, and scene elements
 * for a more picturesque and appealing visualization
 */

class ThreeUtils {
    constructor(container) {
        // Store reference to container
        this.container = container;
        
        // Initialize core Three.js components
        this.initThreeJS();
        
        // Start the render loop
        this.animate();
    }
    
    /**
     * Initialize Three.js components
     */
    initThreeJS() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Add fog for depth perception
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);
        
        // Create camera
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.set(10, 6, 12);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer with antialiasing and better shadows
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Add renderer to container
        this.container.appendChild(this.renderer.domElement);
        
        // Add orbit controls for interactivity
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 50;
        
        // Add lights
        this.setupLights();
        
        // Create environment
        this.setupEnvironment();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Set up lighting for the scene
     */
    setupLights() {
        // Main directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        this.sunLight.position.set(10, 20, 15);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 50;
        this.sunLight.shadow.camera.left = -20;
        this.sunLight.shadow.camera.right = 20;
        this.sunLight.shadow.camera.top = 20;
        this.sunLight.shadow.camera.bottom = -20;
        this.sunLight.shadow.bias = -0.0001;
        this.scene.add(this.sunLight);
        
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Hemisphere light for better outdoor lighting
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        this.scene.add(hemiLight);
    }
    
    /**
     * Set up environment elements
     */
    setupEnvironment() {
        // Create terrain with realistic materials
        this.createTerrain();
        
        // Add skydome
        this.createSkyDome();
        
        // Add decorative elements
        this.addDecorations();
    }
    
    /**
     * Create terrain with PBR materials
     */
    createTerrain() {
        // Create base ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x567d46,  // Grass green
            roughness: 0.8,
            metalness: 0.2,
            side: THREE.DoubleSide
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.position.y = -0.01;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // Add subtle terrain details
        this.addTerrainDetails();
        
        // Add grid for distance measurement
        this.addMeasurementGrid();
    }
    
    /**
     * Add terrain detail elements
     */
    addTerrainDetails() {
        // Add hill in the background
        const hillGeometry = new THREE.SphereGeometry(30, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
        const hillMaterial = new THREE.MeshStandardMaterial({
            color: 0x3a5f2a,  // Darker green
            roughness: 0.9,
            metalness: 0.1
        });
        
        const hill = new THREE.Mesh(hillGeometry, hillMaterial);
        hill.position.set(0, -28, -40);
        hill.castShadow = true;
        hill.receiveShadow = true;
        this.scene.add(hill);
        
        // Add a small lake/water area
        const waterGeometry = new THREE.CircleGeometry(10, 32);
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a85b7,  // Water blue
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.rotation.x = -Math.PI / 2;
        water.position.set(-25, 0.02, -20);
        water.receiveShadow = true;
        this.scene.add(water);
    }
    
    /**
     * Add sky dome for environment
     */
    createSkyDome() {
        const skyGeometry = new THREE.SphereGeometry(400, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,  // Sky blue
            side: THREE.BackSide
        });
        
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }
    
    /**
     * Add decorative elements to scene
     */
    addDecorations() {
        // Add trees
        this.addTrees();
        
        // Add boulders/rocks
        this.addRocks();
        
        // Add a simple target marker at max distance
        this.addTargetMarker();
    }
    
    /**
     * Add tree models to the scene
     */
    addTrees() {
        // Simple procedural trees - could be replaced with actual models
        this.addSimpleTree(15, 5, 15);
        this.addSimpleTree(-12, 0, 12);
        this.addSimpleTree(20, 0, -10);
        this.addSimpleTree(-18, 0, -8);
        this.addSimpleTree(25, 0, 0);
    }
    
    /**
     * Create a simple tree
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    addSimpleTree(x, y, z) {
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,  // Brown
            roughness: 0.9,
            metalness: 0.1
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, y + 1, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.scene.add(trunk);
        
        // Tree foliage (multiple cones)
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2E8B57,  // Forest green
            roughness: 0.8,
            metalness: 0.1
        });
        
        const foliage1 = new THREE.Mesh(
            new THREE.ConeGeometry(1.5, 3, 8),
            foliageMaterial
        );
        foliage1.position.set(x, y + 3, z);
        foliage1.castShadow = true;
        this.scene.add(foliage1);
        
        const foliage2 = new THREE.Mesh(
            new THREE.ConeGeometry(1.2, 2.5, 8),
            foliageMaterial
        );
        foliage2.position.set(x, y + 4.5, z);
        foliage2.castShadow = true;
        this.scene.add(foliage2);
        
        const foliage3 = new THREE.Mesh(
            new THREE.ConeGeometry(0.8, 2, 8),
            foliageMaterial
        );
        foliage3.position.set(x, y + 6, z);
        foliage3.castShadow = true;
        this.scene.add(foliage3);
    }
    
    /**
     * Add rock formations
     */
    addRocks() {
        this.addRock(5, 0, 10, 0.8);
        this.addRock(-8, 0, -5, 1.2);
        this.addRock(12, 0, -8, 0.7);
    }
    
    /**
     * Add a single rock formation
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     * @param {number} scale - Size scale factor
     */
    addRock(x, y, z, scale) {
        // Create a geometry with random vertices for a rock-like shape
        const rockGeometry = new THREE.DodecahedronGeometry(1, 1);
        
        // Distort vertices for more natural look
        const positionAttribute = rockGeometry.getAttribute('position');
        const positions = positionAttribute.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * 0.2;
            positions[i + 1] += (Math.random() - 0.5) * 0.2;
            positions[i + 2] += (Math.random() - 0.5) * 0.2;
        }
        
        rockGeometry.computeVertexNormals();
        
        // Material with rocky texture
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x7f7f7f,  // Gray
            roughness: 0.9,
            metalness: 0.1
        });
        
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, y + scale / 2, z);
        rock.scale.set(scale, scale, scale);
        rock.castShadow = true;
        rock.receiveShadow = true;
        this.scene.add(rock);
    }
    
    /**
     * Add a target marker at maximum distance
     */
    addTargetMarker() {
        // This will be populated once we know the range of the projectile
        this.targetMarker = null;
    }
    
    /**
     * Create a target marker at a specific distance
     * @param {number} distance - The distance to place the target
     */
    createTargetMarker(distance) {
        // Remove existing marker if any
        if (this.targetMarker) {
            this.scene.remove(this.targetMarker);
        }
        
        // Create a target ring
        const targetGeometry = new THREE.RingGeometry(0.8, 1, 32);
        const targetMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            side: THREE.DoubleSide
        });
        
        this.targetMarker = new THREE.Mesh(targetGeometry, targetMaterial);
        this.targetMarker.rotation.x = -Math.PI / 2;
        this.targetMarker.position.set(distance, 0.05, 0);
        this.scene.add(this.targetMarker);
        
        // Add a pole for better visibility
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(distance, 1.5, 0);
        pole.castShadow = true;
        this.scene.add(pole);
        
        // Add a flag on top
        const flagGeometry = new THREE.PlaneGeometry(1, 0.6);
        const flagMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            side: THREE.DoubleSide
        });
        
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(distance + 0.5, 3, 0);
        flag.rotation.y = -Math.PI / 2;
        this.scene.add(flag);
    }
    
    /**
     * Add measurement grid with distance markers
     */
    addMeasurementGrid() {
        // Create a subtle grid on the ground
        const gridHelper = new THREE.GridHelper(100, 100, 0x000000, 0x444444);
        gridHelper.position.y = 0.01;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        
        // Create distance markers every 5 units
        this.distanceMarkers = new THREE.Group();
        this.scene.add(this.distanceMarkers);
        
        for (let i = 5; i <= 50; i += 5) {
            this.addDistanceMarker(i, 0, 0);
        }
    }
    
    /**
     * Add a distance marker at a position
     * @param {number} x - X position (distance)
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    addDistanceMarker(x, y, z) {
        // Create text geometry for distance marker
        const div = document.createElement('div');
        div.className = 'distance-marker';
        div.textContent = `${x}m`;
        div.style.color = 'black';
        div.style.background = 'rgba(255, 255, 255, 0.7)';
        div.style.padding = '2px 5px';
        div.style.borderRadius = '3px';
        div.style.fontSize = '0.8em';
        
        // Position it
        div.style.position = 'absolute';
        div.style.transform = 'translate(-50%, -50%)';
        
        // Add to DOM
        this.container.appendChild(div);
        
        // Store reference for updating
        if (!this.distanceMarkerElements) {
            this.distanceMarkerElements = [];
        }
        
        this.distanceMarkerElements.push({
            element: div,
            position: new THREE.Vector3(x, 0.1, z)
        });
    }
    
    /**
     * Update distance marker positions based on camera view
     */
    updateDistanceMarkers() {
        if (!this.distanceMarkerElements) return;
        
        const widthHalf = this.container.clientWidth / 2;
        const heightHalf = this.container.clientHeight / 2;
        
        for (const marker of this.distanceMarkerElements) {
            // Calculate screen position
            const vector = marker.position.clone();
            vector.project(this.camera);
            
            // Convert to screen coordinates
            const x = (vector.x * widthHalf) + widthHalf;
            const y = -(vector.y * heightHalf) + heightHalf;
            
            // Update marker position
            marker.element.style.left = `${x}px`;
            marker.element.style.top = `${y}px`;
            
            // Hide if behind camera
            marker.element.style.display = vector.z < 1 ? 'block' : 'none';
        }
    }
    
    /**
     * Create trajectory from points with glowing effect
     * @param {Array} points - Array of 3D points
     * @param {number} radius - Radius of tube
     * @param {number} color - Color in hex format
     * @returns {THREE.Object3D} - Trajectory object
     */
    createTrajectoryLine(points) {
        // Create a smooth curve from points
        const curve = new THREE.CatmullRomCurve3(
            points.map(p => new THREE.Vector3(p.x, p.y, p.z))
        );
        
        // Create tube geometry with higher quality
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.05, 8, false);
        
        // Create glowing material
        const tubeMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF5555,
            emissive: 0xFF0000,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.castShadow = true;
        this.scene.add(tube);
        
        return tube;
    }
    
    /**
     * Create projectile object
     * @param {number} radius - Radius of the projectile
     * @param {Object} position - Position {x,y,z}
     * @returns {THREE.Object3D} - Projectile object
     */
    createProjectile(radius = 0.3, position = { x: 0, y: 0, z: 0 }) {
        // Create projectile with better materials
        const projectileGeometry = new THREE.SphereGeometry(radius, 24, 24);
        const projectileMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF0000,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x330000,
            emissiveIntensity: 0.2
        });
        
        const projectile = new THREE.Mesh(projectileGeometry, projectileMaterial);
        projectile.position.set(position.x, position.y, position.z);
        projectile.castShadow = true;
        
        // Add a subtle motion trail
        this.createProjectileTrail(projectile);
        
        this.scene.add(projectile);
        return projectile;
    }
    
    /**
     * Create a motion trail for the projectile
     * @param {THREE.Object3D} projectile - The projectile object
     */
    createProjectileTrail(projectile) {
        // Will be implemented for animations
        this.trailPoints = [];
        this.trailLine = null;
    }
    
    /**
     * Update projectile trail during animation
     * @param {THREE.Object3D} projectile - The projectile object
     */
    updateProjectileTrail(projectile) {
        if (!this.trailPoints) {
            this.trailPoints = [];
        }
        
        // Add current position to trail
        this.trailPoints.push(projectile.position.clone());
        
        // Keep only recent points
        if (this.trailPoints.length > 20) {
            this.trailPoints.shift();
        }
        
        // Remove existing trail line
        if (this.trailLine) {
            this.scene.remove(this.trailLine);
        }
        
        // Create new trail if enough points
        if (this.trailPoints.length > 2) {
            const curve = new THREE.CatmullRomCurve3(this.trailPoints);
            const geometry = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
            const material = new THREE.MeshBasicMaterial({
                color: 0xFF8888,
                transparent: true,
                opacity: 0.5
            });
            
            this.trailLine = new THREE.Mesh(geometry, material);
            this.scene.add(this.trailLine);
        }
    }
    
    /**
     * Create velocity vector arrow
     * @param {Object} origin - Origin position
     * @param {Object} direction - Direction vector
     * @param {number} length - Arrow length
     * @param {number} color - Arrow color
     * @returns {THREE.Object3D} - Arrow object
     */
    createVelocityVector(origin, direction, length, color = 0x00FF00) {
        // Create arrow helper
        const originVec = new THREE.Vector3(origin.x, origin.y, origin.z);
        const dirVec = new THREE.Vector3(direction.x, direction.y, direction.z);
        
        const arrowHelper = new THREE.ArrowHelper(
            dirVec.normalize(),
            originVec,
            length,
            color,
            length * 0.2,
            length * 0.1
        );
        
        this.scene.add(arrowHelper);
        return arrowHelper;
    }
    
    /**
     * Create acceleration vector arrow
     * @param {Object} origin - Origin position
     * @param {Object} direction - Direction vector
     * @param {number} length - Arrow length
     * @param {number} color - Arrow color
     * @returns {THREE.Object3D} - Arrow object
     */
    createAccelerationVector(origin, direction, length, color = 0x0000FF) {
        // Same implementation as velocity vector, but different default color
        return this.createVelocityVector(origin, direction, length, color);
    }
    
    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Update distance markers
        this.updateDistanceMarkers();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Make the class globally available
window.ThreeUtils = ThreeUtils;