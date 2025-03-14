/**
 * Enhanced Scene View for Projectile Motion
 * 
 * Handles 3D visualization of projectile motion using enhanced Three.js utilities
 * - High-quality 3D environment with realistic terrain 
 * - Picturesque visualization elements with environment awareness
 * - Advanced animation effects and particle trails
 * - Smooth camera transitions
 * - Visual impact indicators and effects
 * - Dynamic lighting and time-of-day effects
 * - Enhanced terrain with realistic materials
 */

class SceneView {
    constructor(container) {
        // Initialize enhanced Three.js utilities
        this.threeUtils = new ThreeUtils(container);
        
        // Initialize enhanced environment
        this.environment = new EnhancedEnvironment(this.threeUtils);
        
        // Animation properties
        this.animating = false;
        this.animationTime = 0;
        this.animationDuration = 4; // 4 seconds for full animation
        this.animationSpeed = 1.0;  // Animation speed multiplier
        
        // Track visualization objects
        this.trajectoryLine = null;
        this.velocityArrows = [];
        this.accelerationArrow = null;
        this.projectile = null;
        this.impactMarker = null;
        
        // Weather and environment effects
        this.weatherEffects = {
            particles: null,
            wind: { active: false, direction: new THREE.Vector3(0, 0, 0), strength: 0 }
        };
        
        // Time of day and environment effects
        this.timeOfDay = 'day'; // Can be 'day', 'sunset', 'night'
        this.environmentType = 'grassland'; // Can be 'grassland', 'desert', 'snow'
        
        // Visual quality settings
        this.visualQuality = 'high'; // Can be 'low', 'medium', 'high'
        
        // Create projectile
        this.setupProjectile();
        
        // Setup camera transitions
        this.setupCameraTransitions();
    }
    
    /**
     * Create the projectile object
     */
    setupProjectile() {
        this.projectile = this.threeUtils.createProjectile(0.3, { x: 0, y: 0, z: 0 });
    }
    
    /**
     * Setup camera transition effects
     */
    setupCameraTransitions() {
        this.cameraTransition = {
            active: false,
            startPosition: null,
            targetPosition: null,
            startTime: 0,
            duration: 1.0, // 1 second transitions
            easing: this.easeInOutCubic
        };
    }
    
    /**
     * Easing function for smooth transitions
     * @param {number} t - Time parameter [0,1]
     * @returns {number} - Eased value
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    /**
     * Update the scene with new trajectory data
     * @param {Object} trajectoryModel - The trajectory model
     */
    updateScene(trajectoryModel) {
        // Clear existing visualization objects
        this.clearVisualizationObjects();
        
        // Get trajectory data
        const trajectoryPoints = trajectoryModel.getTrajectoryPoints3D();
        
        // Get the range/distance to place the target
        const range = trajectoryModel.trajectoryProperties.range;
        
        // Create target marker at calculated range
        if (range > 0) {
            this.threeUtils.createTargetMarker(range);
        }
        
        // Update visualization based on settings
        if (trajectoryModel.settings.showTrajectory) {
            this.createTrajectoryLine(trajectoryPoints);
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
        this.trajectoryPoints = trajectoryPoints;
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
        
        // Reset projectile position
        if (this.projectile) {
            this.projectile.position.set(0, 0, 0);
        }
        
        // Clear trail points
        this.threeUtils.trailPoints = [];
        if (this.threeUtils.trailLine) {
            this.threeUtils.scene.remove(this.threeUtils.trailLine);
            this.threeUtils.trailLine = null;
        }
        
        // Remove impact marker
        if (this.impactMarker) {
            this.threeUtils.scene.remove(this.impactMarker);
            this.impactMarker = null;
        }
    }
    
    /**
     * Create enhanced trajectory line from points
     * @param {Array} points - Array of 3D points
     */
    createTrajectoryLine(points) {
        this.trajectoryLine = this.threeUtils.createTrajectoryLine(points);
    }
    
    /**
     * Create velocity arrows with enhanced visuals
     * @param {Array} vectors - Array of vector data objects
     */
    createVelocityArrows(vectors) {
        // Create velocity arrows at specific points along trajectory (not all points)
        // This makes the visualization cleaner with fewer arrows
        const arrowPoints = [];
        const totalPoints = vectors.length;
        
        // Use at most 5 arrows distributed evenly
        const numArrows = Math.min(5, totalPoints);
        const step = Math.floor(totalPoints / numArrows);
        
        for (let i = 0; i < totalPoints; i += step) {
            if (arrowPoints.length < numArrows) {
                arrowPoints.push(vectors[i]);
            }
        }
        
        // Create arrows for selected points
        arrowPoints.forEach(vector => {
            const arrow = this.threeUtils.createVelocityVector(
                vector.origin,
                vector.direction,
                vector.magnitude * 0.2, // Scale for better visualization
                0x00FF00
            );
            
            this.velocityArrows.push(arrow);
        });
    }
    
    /**
     * Create acceleration arrow with enhanced visuals
     * @param {Object} vector - Acceleration vector data
     */
    createAccelerationArrow(vector) {
        this.accelerationArrow = this.threeUtils.createAccelerationVector(
            vector.origin,
            vector.direction,
            vector.magnitude * 0.3, // Slightly larger for better visibility
            0x0000FF
        );
    }
    
    /**
     * Create an impact marker at the landing point
     * @param {Object} position - Impact position {x,y,z}
     */
    createImpactMarker(position) {
        // Remove existing impact marker
        if (this.impactMarker) {
            this.threeUtils.scene.remove(this.impactMarker);
        }
        
        // Create a circular ripple effect
        const ringGeometry = new THREE.RingGeometry(0.1, 0.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        this.impactMarker = new THREE.Mesh(ringGeometry, ringMaterial);
        this.impactMarker.rotation.x = -Math.PI / 2; // Lay flat on ground
        this.impactMarker.position.set(position.x, 0.05, position.z);
        
        this.threeUtils.scene.add(this.impactMarker);
        
        // Animate the impact marker (expand and fade)
        this.animateImpactMarker();
    }