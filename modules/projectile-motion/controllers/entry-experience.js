/**
 * Entry Experience Controller for Projectile Motion
 * 
 * Handles the interactive entry animation that introduces
 * users to the projectile motion module in an engaging way
 */

import ThreeUtils from '../../../core/3d-utils.js';

class EntryExperience {
    constructor() {
        this.container = document.getElementById('entry-visualization');
        
        if (!this.container) {
            console.warn('Entry visualization container not found');
            return;
        }
        
        // Initialize Three.js utilities
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
        this.threeUtils.createGroundPlane(30, 30, 0xdddddd, 0.7);
        this.threeUtils.createGrid(30, 30);
        
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
     * Setup multiple projectiles with different launch parameters
     */
    setupProjectiles() {
        const colors = [0xff0000, 0x00aaff, 0xffaa00, 0x00ddaa, 0xaa00ff];
        const angles = [30, 45, 60, 75, 20];
        const velocities = [12, 15, 10, 8, 14];
        
        for (let i = 0; i < 5; i++) {
            // Create projectile sphere
            const projectile = this.threeUtils.createSphere(0.3, { x: 0, y: 0, z: 0 }, colors[i]);
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
            points.push({ x, y, z: 0 });
        }
        
        // Create and return the line
        return this.threeUtils.createTubeFromPoints(points, 0.05, color);
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
        this.threeUtils.clearScene();
    }
}

// Initialize the entry experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EntryExperience();
});

export default EntryExperience;
