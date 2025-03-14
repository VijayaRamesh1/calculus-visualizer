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
    
    /**
     * Animate the impact marker expansion and fading
     */
    animateImpactMarker() {
        if (!this.impactMarker) return;
        
        const startTime = Date.now();
        const expandDuration = 1500; // ms
        
        const expandRing = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / expandDuration, 1.0);
            
            // Scale up and fade out
            const scale = 1 + progress * 3;
            const opacity = 1 - progress;
            
            this.impactMarker.scale.set(scale, scale, scale);
            this.impactMarker.material.opacity = opacity;
            
            if (progress < 1.0) {
                requestAnimationFrame(expandRing);
            } else {
                // Remove when animation completes
                this.threeUtils.scene.remove(this.impactMarker);
                this.impactMarker = null;
            }
        };
        
        expandRing();
    }
    
    /**
     * Set the time of day for realistic lighting
     * @param {string} timeOfDay - 'day', 'sunset', or 'night'
     */
    setTimeOfDay(timeOfDay) {
        this.timeOfDay = timeOfDay;
        
        // Use the enhanced environment's time of day system
        this.environment.setTimeOfDay(timeOfDay);
    }
    
    /**
     * Add weather effects
     * @param {string} effect - 'rain', 'snow', 'wind', 'fog', or 'clear'
     * @param {number} intensity - Intensity level [0,1]
     */
    setWeatherEffect(effect, intensity = 0.5) {
        // Store weather settings
        this.weatherEffects.type = effect;
        this.weatherEffects.intensity = intensity;
        
        // Apply to enhanced environment
        this.environment.setWeatherEffect(effect);
        
        // Set wind effect for trajectory calculation if needed
        if (effect === 'wind') {
            this.weatherEffects.wind.active = true;
            this.weatherEffects.wind.strength = intensity * 5;
            this.weatherEffects.wind.direction = new THREE.Vector3(-1, 0, 0);
        } else {
            this.weatherEffects.wind.active = false;
            this.weatherEffects.wind.strength = 0;
        }
    }
    
    /**
     * Clear all weather effects
     */
    clearWeatherEffects() {
        // Reset wind
        this.weatherEffects.wind.active = false;
        this.weatherEffects.wind.strength = 0;
        
        // Clear in environment
        this.environment.setWeatherEffect('clear');
    }
    
    /**
     * Set environment type (grassland, desert, snow)
     * @param {string} type - Environment type
     */
    setEnvironmentType(type) {
        this.environmentType = type;
        
        // Apply to enhanced environment
        this.environment.setEnvironmentType(type);
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
        
        // Clear trail
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
     * Animation loop
     */
    animate() {
        if (!this.animating) return;
        
        // Request next frame
        requestAnimationFrame(() => this.animate());
        
        // Update animation time
        const deltaTime = 0.016 * this.animationSpeed; // Approximately 60 fps
        this.animationTime += deltaTime;
        
        // Clamp animation time
        if (this.animationTime > this.animationDuration) {
            this.animationTime = this.animationDuration;
            this.animating = false;
            
            // Show impact at end
            if (this.trajectoryPoints && this.trajectoryPoints.length > 0) {
                const landingPoint = this.trajectoryPoints[this.trajectoryPoints.length - 1];
                this.createImpactMarker(landingPoint);
            }
        }
        
        // Update projectile position
        this.updateProjectilePosition();
        
        // Update camera transition if active
        this.updateCameraTransition();
        
        // Update environment
        this.environment.update(deltaTime);
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
        
        // Add velocity-based rotation to the projectile
        if (pointIndex < this.trajectoryPoints.length - 1) {
            const nextPoint = this.trajectoryPoints[Math.min(pointIndex + 1, this.trajectoryPoints.length - 1)];
            const direction = new THREE.Vector3(
                nextPoint.x - point.x,
                nextPoint.y - point.y,
                nextPoint.z - point.z
            ).normalize();
            
            // Apply rotation based on direction
            this.projectile.rotation.y = Math.atan2(direction.x, direction.z);
            this.projectile.rotation.x = Math.atan2(direction.y, Math.sqrt(direction.x * direction.x + direction.z * direction.z));
        }
        
        // Update trail
        this.threeUtils.updateProjectileTrail(this.projectile);
    }