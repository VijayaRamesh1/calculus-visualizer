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

export default class PhysicsModel {
    constructor() {
        // Default values
        this.initialVelocity = 10;  // m/s
        this.launchAngle = 45;      // degrees
        this.gravity = 9.8;         // m/s²
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
    }
    
    /**
     * Calculate the flight time of the projectile
     * @returns {number} Time in seconds
     */
    calculateFlightTime() {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // Time of flight = (2 * v0 * sin(θ)) / g
        return (2 * v0 * Math.sin(theta)) / g;
    }
    
    /**
     * Calculate the range of the projectile
     * @returns {number} Range in meters
     */
    calculateRange() {
        const v0 = this.initialVelocity;
        const theta = this.launchAngle * Math.PI / 180;
        const g = this.gravity;
        
        // Range = (v0² * sin(2θ)) / g
        return (v0 * v0 * Math.sin(2 * theta)) / g;
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
        
        // x(t) = v0 * cos(θ) * t
        const x = v0 * Math.cos(theta) * t;
        
        // y(t) = v0 * sin(θ) * t - (1/2) * g * t²
        const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
        
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
        const vx = v0 * Math.cos(theta);
        
        // vy(t) = v0 * sin(θ) - g * t
        const vy = v0 * Math.sin(theta) - g * t;
        
        return { x: vx, y: vy, z: 0 };
    }
    
    /**
     * Calculate acceleration at a given time
     * @returns {Object} Acceleration {x, y, z}
     */
    calculateAcceleration() {
        // ax(t) = 0
        // ay(t) = -g
        return { x: 0, y: -this.gravity, z: 0 };
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