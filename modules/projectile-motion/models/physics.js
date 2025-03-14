/**
 * Physics Model for Projectile Motion
 * 
 * Contains the core physics calculations for projectile motion, including:
 * - Position calculations
 * - Velocity calculations
 * - Acceleration calculations
 * - Trajectory generation
 * - Flight time and range calculations
 */

class PhysicsModel {
    constructor() {
        // Default values
        this.initialVelocity = 10;  // m/s
        this.launchAngle = 45;      // degrees
        this.gravity = 9.8;         // m/s²
        this.windEffect = { active: false, strength: 0, direction: { x: 0, y: 0, z: 0 } };
    }
    
    /**
     * Update physics parameters
     * @param {Object} params - Parameters to update
     */
    updateParameters(params) {
        if (params.initialVelocity !== undefined) {
            this.initialVelocity = params.initialVelocity;
        }
        
        if (params.launchAngle !== undefined) {
            this.launchAngle = params.launchAngle;
        }
        
        if (params.gravity !== undefined) {
            this.gravity = params.gravity;
        }
        
        if (params.windEffect !== undefined) {
            this.windEffect = {
                ...this.windEffect,
                ...params.windEffect
            };
        }
    }
    
    /**
     * Calculate the flight time of the projectile
     * @returns {number} Time in seconds
     */
    calculateFlightTime() {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // If wind is active, adjust flight time approximation
        if (this.windEffect.active && this.windEffect.strength > 0) {
            // Basic wind adjustment - simplified model
            const windFactor = 1 + (this.windEffect.direction.x * this.windEffect.strength) / (50 * v0);
            // Time of flight with wind effect = (2 * v0 * sin(θ)) / g * windFactor
            return (2 * v0 * Math.sin(theta)) / g * windFactor;
        } else {
            // Standard time of flight = (2 * v0 * sin(θ)) / g
            return (2 * v0 * Math.sin(theta)) / g;
        }
    }
    
    /**
     * Calculate the range of the projectile
     * @returns {number} Range in meters
     */
    calculateRange() {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // If wind is active, adjust range calculation
        if (this.windEffect.active && this.windEffect.strength > 0) {
            // Basic wind adjustment - simplified model
            const windFactor = 1 + (this.windEffect.direction.x * this.windEffect.strength) / (20 * v0);
            // Range with wind = (v0² * sin(2θ)) / g * windFactor
            return (v0 * v0 * Math.sin(2 * theta)) / g * windFactor;
        } else {
            // Standard range = (v0² * sin(2θ)) / g
            return (v0 * v0 * Math.sin(2 * theta)) / g;
        }
    }
    
    /**
     * Calculate the maximum height of the projectile
     * @returns {number} Maximum height in meters
     */
    calculateMaxHeight() {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // Max height = (v0² * sin²(θ)) / (2g)
        return (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);
    }
    
    /**
     * Calculate position at a given time
     * @param {number} t - Time in seconds
     * @returns {Object} Position {x, y, z}
     */
    calculatePosition(t) {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // Basic position calculation
        // x(t) = v0 * cos(θ) * t
        let x = v0 * Math.cos(theta) * t;
        
        // y(t) = v0 * sin(θ) * t - (1/2) * g * t²
        let y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
        
        // Add wind effect if active
        if (this.windEffect.active && this.windEffect.strength > 0) {
            // Simple wind model - quadratic effect on x position
            x += this.windEffect.direction.x * this.windEffect.strength * t * t * 0.05;
        }
        
        return { x, y, z: 0 };
    }
    
    /**
     * Calculate velocity at a given time
     * @param {number} t - Time in seconds
     * @returns {Object} Velocity {x, y, z}
     */
    calculateVelocity(t) {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // vx(t) = v0 * cos(θ)
        let vx = v0 * Math.cos(theta);
        
        // vy(t) = v0 * sin(θ) - g * t
        const vy = v0 * Math.sin(theta) - g * t;
        
        // Add wind effect if active
        if (this.windEffect.active && this.windEffect.strength > 0) {
            // Wind effect on horizontal velocity
            vx += this.windEffect.direction.x * this.windEffect.strength * 0.1 * t;
        }
        
        return { x: vx, y: vy, z: 0 };
    }
    
    /**
     * Calculate acceleration at a given time
     * @returns {Object} Acceleration {x, y, z}
     */
    calculateAcceleration() {
        // Default acceleration is just gravity
        let ax = 0;
        const ay = -this.gravity;
        
        // Add wind effect on acceleration if active
        if (this.windEffect.active && this.windEffect.strength > 0) {
            ax = this.windEffect.direction.x * this.windEffect.strength * 0.01;
        }
        
        return { x: ax, y: ay, z: 0 };
    }
    
    /**
     * Generate a trajectory with evenly spaced time steps
     * @param {number} steps - Number of points to generate
     * @returns {Array} Array of position points
     */
    generateTrajectory(steps = 100) {
        const trajectory = [];
        const flightTime = this.calculateFlightTime();
        const timeStep = flightTime / steps;
        
        for (let i = 0; i <= steps; i++) {
            const t = i * timeStep;
            trajectory.push(this.calculatePosition(t));
        }
        
        return trajectory;
    }
    
    /**
     * Generate velocity vectors along the trajectory
     * @param {number} count - Number of vectors to generate
     * @returns {Array} Array of {position, velocity} objects
     */
    generateVelocityVectors(count = 10) {
        const vectors = [];
        const flightTime = this.calculateFlightTime();
        const timeStep = flightTime / count;
        
        for (let i = 0; i <= count; i++) {
            const t = i * timeStep;
            const position = this.calculatePosition(t);
            const velocity = this.calculateVelocity(t);
            
            vectors.push({ position, velocity });
        }
        
        return vectors;
    }
}

// Make the class globally available
window.PhysicsModel = PhysicsModel;