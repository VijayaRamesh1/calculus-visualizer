/**
 * Scene View for Projectile Motion
 * 
 * Handles 3D visualization of projectile motion using Three.js
 * - 3D scene setup
 * - Trajectory visualization
 * - Vector visualization
 * - Animation and controls
 */

class SceneView {
    constructor(container) {
        // Initialize Three.js scene with ThreeUtils
        this.threeUtils = new ThreeUtils(container);
        
        // Animation properties
        this.animating = false;
        this.animationTime = 0;
        this.animationDuration = 3; // 3 seconds for full animation
        
        // Track visualization objects
        this.trajectoryLine = null;
        this.velocityArrows = [];
        this.accelerationArrow = null;
        this.projectile = null;
        
        // Setup scene
        this.setupScene();
    }
    
    /**
     * Setup the 3D scene
     */
    setupScene() {
        // Create coordinate axes
        this.threeUtils.createAxes(10, true);
        
        // Create ground plane
        this.groundPlane = this.threeUtils.createGroundPlane(30, 30);
        
        // Create grid
        this.grid = this.threeUtils.createGrid(30, 30);
        
        // Create projectile
        this.projectile = this.threeUtils.createSphere(0.3, { x: 0, y: 0, z: 0 }, 0xff0000);
    }
    
    /**
     * Update the scene with new trajectory data
     * @param {Object} trajectoryModel - The trajectory model
     */
    updateScene(trajectoryModel) {
        // Clear existing visualization objects
        this.clearVisualizationObjects();
        
        // Update visualization based on settings
        if (trajectoryModel.settings.showTrajectory) {
            this.createTrajectoryLine(trajectoryModel.getTrajectoryPoints3D());
        }
        
        if (trajectoryModel.settings.showVelocityVectors) {
            this.createVelocityArrows(trajectoryModel.getVelocityVectors3D());
        }
        
        if (trajectoryModel.settings.showAcceleration) {
            this.createAccelerationArrow(trajectoryModel.getAccelerationVector3D());
        }
        
        // Reset animation
        this.resetAnimation();
        
        // Store trajectory for animation
        this.trajectoryPoints = trajectoryModel.getTrajectoryPoints3D();
    }
    
    /**
     * Clear all visualization objects from the scene
     */
    clearVisualizationObjects() {
        // Remove trajectory line
        if (this.trajectoryLine) {
            this.threeUtils.scene.remove(this.trajectoryLine);
            this.trajectoryLine = null;
        }
        
        // Remove velocity arrows
        this.velocityArrows.forEach(arrow => {
            this.threeUtils.scene.remove(arrow);
        });
        this.velocityArrows = [];
        
        // Remove acceleration arrow
        if (this.accelerationArrow) {
            this.threeUtils.scene.remove(this.accelerationArrow);
            this.accelerationArrow = null;
        }
    }
    
    /**
     * Create trajectory line from points
     * @param {Array} points - Array of 3D points
     */
    createTrajectoryLine(points) {
        this.trajectoryLine = this.threeUtils.createTubeFromPoints(points, 0.05, 0xff0000);
    }
    
    /**
     * Create velocity arrows
     * @param {Array} vectors - Array of vector data objects
     */
    createVelocityArrows(vectors) {
        vectors.forEach(vector => {
            const arrow = this.threeUtils.createVector(
                vector.origin,
                vector.direction,
                vector.magnitude * 0.2, // Scale for better visualization
                0x00ff00
            );
            
            this.velocityArrows.push(arrow);
        });
    }
    
    /**
     * Create acceleration arrow
     * @param {Object} vector - Acceleration vector data
     */
    createAccelerationArrow(vector) {
        this.accelerationArrow = this.threeUtils.createVector(
            vector.origin,
            vector.direction,
            vector.magnitude * 0.2, // Scale for better visualization
            0x0000ff
        );
    }
    
    /**
     * Toggle animation state
     * @returns {boolean} New animation state
     */
    toggleAnimation() {
        this.animating = !this.animating;
        
        if (this.animating) {
            this.startAnimation();
        }
        
        return this.animating;
    }
    
    /**
     * Start the animation loop
     */
    startAnimation() {
        // If already at the end, reset
        if (this.animationTime >= this.animationDuration) {
            this.resetAnimation();
        }
        
        // Set up animation loop
        this.animate();
    }
    
    /**
     * Reset the animation to the beginning
     */
    resetAnimation() {
        this.animationTime = 0;
        
        if (this.projectile && this.trajectoryPoints && this.trajectoryPoints.length > 0) {
            const startPoint = this.trajectoryPoints[0];
            this.projectile.position.set(startPoint.x, startPoint.y, startPoint.z);
        }
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.animating) return;
        
        // Request next frame
        requestAnimationFrame(() => this.animate());
        
        // Update animation time
        this.animationTime += 0.016; // Approximately 60 fps
        
        // Clamp animation time
        if (this.animationTime > this.animationDuration) {
            this.animationTime = this.animationDuration;
            this.animating = false;
        }
        
        // Update projectile position
        this.updateProjectilePosition();
    }
    
    /**
     * Update the projectile position based on animation time
     */
    updateProjectilePosition() {
        if (!this.projectile || !this.trajectoryPoints || this.trajectoryPoints.length === 0) return;
        
        // Calculate progress (0 to 1)
        const progress = this.animationTime / this.animationDuration;
        
        // Find the index in the trajectory array
        const pointIndex = Math.min(
            Math.floor(progress * (this.trajectoryPoints.length - 1)),
            this.trajectoryPoints.length - 1
        );
        
        // Get the point
        const point = this.trajectoryPoints[pointIndex];
        
        // Update projectile position
        this.projectile.position.set(point.x, point.y, point.z);
    }
    
    /**
     * Toggle between 2D and 3D views
     * @param {boolean} is3D - Whether to use 3D view
     */
    toggleDimension(is3D) {
        if (is3D) {
            // Set camera to 3D perspective view
            this.threeUtils.camera.position.set(15, 10, 15);
            this.threeUtils.camera.lookAt(0, 0, 0);
        } else {
            // Set camera to 2D (side view)
            this.threeUtils.camera.position.set(0, 0, 20);
            this.threeUtils.camera.lookAt(0, 0, 0);
        }
        
        this.threeUtils.controls.update();
    }
    
    /**
     * Reset camera view
     */
    resetView() {
        this.threeUtils.camera.position.set(15, 10, 15);
        this.threeUtils.camera.lookAt(0, 0, 0);
        this.threeUtils.controls.update();
    }
}

// Make the class globally available
window.SceneView = SceneView;