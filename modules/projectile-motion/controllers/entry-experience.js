/**
 * Entry Experience Controller for Projectile Motion
 * 
 * Handles the interactive entry animation that introduces
 * users to the projectile motion module in an engaging way
 */

// Remove import statement
// import ThreeUtils from '../../../core/3d-utils.js';

class EntryExperience {
    constructor() {
        this.container = document.getElementById('entry-visualization');
        
        if (!this.container) {
            console.warn('Entry visualization container not found');
            return;
        }
        
        // Initialize Three.js utilities using ThreeUtils from the projectile module
        // instead of the core module
        this.threeUtils = new ThreeUtils(this.container);
        
        // Animation state
        this.animationTime = 0;
        this.projectiles = [];
        this.trails = [];
        this.isPlaying = true;
        
        // Setup scene
        this.setupScene();
        
        // Start animation
        this.animate();
    }
    
    /**
     * Setup the 3D scene for entry animation
     */
    setupScene() {
        // Set camera position
        this.threeUtils.camera.position.set(5, 3, 10);
        this.threeUtils.camera.lookAt(0, 0, 0);
        
        // Create ground and grid
        this.createGroundPlane(30, 30, 0xdddddd, 0.7);
        this.createGrid(30, 30);
        
        // Add soft ambient lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.threeUtils.scene.add(ambientLight);
        
        // Set up multiple projectiles with different colors at different launch angles
        this.setupProjectiles();
        
        // Set up auto-rotation for more visual interest
        this.threeUtils.controls.autoRotate = true;
        this.threeUtils.controls.autoRotateSpeed = 0.5;
    }

    /**
     * Create a ground plane (we'll implement this here since 
     * we're not using the core ThreeUtils)
     * @param {number} width - Width of the plane
     * @param {number} depth - Depth of the plane
     * @param {number} color - Color of the plane
     * @param {number} opacity - Opacity of the plane
     */
    createGroundPlane(width, depth, color, opacity) {
        const geometry = new THREE.PlaneGeometry(width, depth);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            side: THREE.DoubleSide
        });
        
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.01;
        plane.receiveShadow = true;
        
        this.threeUtils.scene.add(plane);
        return plane;
    }

    /**
     * Create a grid (we'll implement this here since we're not using the core ThreeUtils)
     * @param {number} width - Width of the grid
     * @param {number} depth - Depth of the grid
     */
    createGrid(width, depth) {
        const grid = new THREE.GridHelper(width, depth, 0x888888, 0x888888);
        grid.position.y = 0.01;
        grid.material.transparent = true;
        grid.material.opacity = 0.4;
        
        this.threeUtils.scene.add(grid);
        return grid;
    }
    
    /**
     * Setup multiple projectiles with different launch parameters
     */
    setupProjectiles() {
        const colors = [0xff0000, 0x00aaff, 0xffaa00, 0x00ddaa, 0xaa00ff];
        const angles = [30, 45, 60, 75, 20];
        const velocities = [12, 15, 10, 8, 14];
        
        for (let i = 0; i < 5; i++) {
            // Create projectile sphere
            const projectile = this.createSphere(0.3, { x: 0, y: 0, z: 0 }, colors[i]);
            this.projectiles.push({
                mesh: projectile,
                angle: angles[i],
                velocity: velocities[i],
                position: 0,
                timeOffset: i * Math.PI / 5 // Offset time for each projectile
            });
            
            // Create visible trajectory
            const trajectory = this.createTrajectoryLine(angles[i], velocities[i], colors[i]);
            this.trails.push(trajectory);
        }
    }

    /**
     * Create a sphere (we'll implement this here since we're not using the core ThreeUtils)
     * @param {number} radius - Radius of the sphere
     * @param {Object} position - Position of the sphere
     * @param {number} color - Color of the sphere
     * @returns {THREE.Mesh} Sphere mesh
     */
    createSphere(radius, position, color) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.4,
            metalness: 0.6
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(position.x, position.y, position.z);
        sphere.castShadow = true;
        
        this.threeUtils.scene.add(sphere);
        return sphere;
    }
    
    /**
     * Create a trajectory line
     * @param {number} angle - Launch angle in degrees
     * @param {number} velocity - Initial velocity
     * @param {number} color - Line color
     * @returns {THREE.Line} Line mesh
     */
    createTrajectoryLine(angle, velocity, color) {
        const angleRad = angle * Math.PI / 180;
        const gravity = 9.8;
        const points = [];
        
        // Calculate time of flight
        const totalTime = (2 * velocity * Math.sin(angleRad)) / gravity;
        
        // Create points for trajectory
        for (let t = 0; t <= totalTime; t += totalTime / 50) {
            const x = velocity * Math.cos(angleRad) * t;
            const y = velocity * Math.sin(angleRad) * t - 0.5 * gravity * t * t;
            points.push(new THREE.Vector3(x, y, 0));
        }
        
        // Create and return the line
        return this.createTubeFromPoints(points, 0.05, color);
    }

    /**
     * Create a tube from points (we'll implement this here since we're not using the core ThreeUtils)
     * @param {Array} points - Array of points
     * @param {number} radius - Radius of the tube
     * @param {number} color - Color of the tube
     * @returns {THREE.Mesh} Tube mesh
     */
    createTubeFromPoints(points, radius, color) {
        const path = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(path, 50, radius, 8, false);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            transparent: true,
            opacity: 0.7,
            roughness: 0.3,
            metalness: 0.7
        });
        
        const tube = new THREE.Mesh(geometry, material);
        this.threeUtils.scene.add(tube);
        return tube;
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.isPlaying) return;
        
        requestAnimationFrame(() => this.animate());
        
        // Increment animation time
        this.animationTime += 0.01;
        
        // Update projectile positions
        this.updateProjectiles();
    }
    
    /**
     * Update projectile positions based on physics
     */
    updateProjectiles() {
        const gravity = 9.8;
        
        this.projectiles.forEach(proj => {
            // Calculate time with offset to stagger projectiles
            const time = (this.animationTime + proj.timeOffset) % 5;
            
            // Calculate projectile position using physics equations
            const angleRad = proj.angle * Math.PI / 180;
            const x = proj.velocity * Math.cos(angleRad) * time;
            const y = proj.velocity * Math.sin(angleRad) * time - 0.5 * gravity * time * time;
            
            // Skip if projectile is below ground
            if (y < 0) {
                proj.mesh.visible = false;
                return;
            }
            
            // Update projectile position
            proj.mesh.position.set(x, y, 0);
            proj.mesh.visible = true;
            
            // Add subtle wobble for visual interest
            proj.mesh.rotation.x = time * 2;
            proj.mesh.rotation.z = time * 3;
        });
        
        // Add interactive elements
        this.addInteractiveHighlights();
    }
    
    /**
     * Add interactive highlights to projectiles
     */
    addInteractiveHighlights() {
        // Mouse hover effect to pause rotation
        this.container.addEventListener('mousemove', () => {
            this.threeUtils.controls.autoRotate = false;
            
            // Resume auto-rotation after 2 seconds
            clearTimeout(this.rotateTimeout);
            this.rotateTimeout = setTimeout(() => {
                this.threeUtils.controls.autoRotate = true;
            }, 2000);
        });
        
        // On click effect
        this.container.addEventListener('click', () => {
            // Add a quick flash effect to indicate interactivity
            const flash = new THREE.AmbientLight(0xffffff, 1.5);
            this.threeUtils.scene.add(flash);
            
            // Remove flash after brief period
            setTimeout(() => {
                this.threeUtils.scene.remove(flash);
            }, 150);
        });
    }
    
    /**
     * Add a highlight around a projectile
     * @param {number} index - Index of projectile to highlight
     */
    highlightProjectile(index) {
        if (index < 0 || index >= this.projectiles.length) return;
        
        const proj = this.projectiles[index];
        
        // Create a glowing sphere around the projectile
        const glowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        proj.mesh.add(glowSphere);
        
        // Animate the glow
        const animateGlow = () => {
            glowSphere.scale.x = 1 + 0.2 * Math.sin(this.animationTime * 5);
            glowSphere.scale.y = 1 + 0.2 * Math.sin(this.animationTime * 5);
            glowSphere.scale.z = 1 + 0.2 * Math.sin(this.animationTime * 5);
            
            requestAnimationFrame(animateGlow);
        };
        
        animateGlow();
    }
    
    /**
     * Clean up resources when no longer needed
     */
    dispose() {
        this.isPlaying = false;
        
        // Remove event listeners
        this.container.removeEventListener('mousemove', this.onMouseMove);
        this.container.removeEventListener('click', this.onClick);
        
        // Dispose of Three.js resources
        this.clearScene();
    }

    /**
     * Clear the scene (we'll implement this here since we're not using the core ThreeUtils)
     */
    clearScene() {
        while (this.threeUtils.scene.children.length > 0) {
            const object = this.threeUtils.scene.children[0];
            this.threeUtils.scene.remove(object);

            // Dispose of geometries and materials
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        }
    }
}

// Initialize the entry experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.entryExperience = new EntryExperience();
});

// Make the class globally available
window.EntryExperience = EntryExperience;