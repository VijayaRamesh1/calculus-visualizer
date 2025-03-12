/**
 * Trajectory Model for Projectile Motion
 * 
 * Handles trajectory-specific calculations and data processing for visualizations:
 * - Trajectory discretization
 * - Data formatting for visualization
 * - Statistical properties of trajectories
 * - Derivative calculations along trajectory
 */

import PhysicsModel from './physics.js';

export default class TrajectoryModel {
    constructor() {
        this.physics = new PhysicsModel();
        this.trajectoryPoints = [];
        this.velocityVectors = [];
        
        // Default visualization settings
        this.settings = {
            showTrajectory: true,
            showVelocityVectors: false,
            showAcceleration: false,
            showMathFunctions: false
        };
        
        // Generate initial trajectory
        this.generateTrajectoryData();
    }
    
    /**
     * Update physics parameters
     * @param {Object} params - Parameters to update
     */
    updateParameters(params) {
        this.physics.updateParameters(params);
        this.generateTrajectoryData();
    }
    
    /**
     * Update visualization settings
     * @param {Object} settings - Settings to update
     */
    updateSettings(settings) {
        Object.assign(this.settings, settings);
    }
    
    /**
     * Generate trajectory and associated data
     */
    generateTrajectoryData() {
        // Generate trajectory points
        this.trajectoryPoints = this.physics.generateTrajectory(100);
        
        // Generate velocity vectors
        this.velocityVectors = this.physics.generateVelocityVectors(10);
        
        // Calculate trajectory properties
        this.trajectoryProperties = {
            flightTime: this.physics.calculateFlightTime(),
            range: this.physics.calculateRange(),
            maxHeight: this.physics.calculateMaxHeight(),
            initialVelocity: this.physics.initialVelocity,
            launchAngle: this.physics.launchAngle,
            gravity: this.physics.gravity
        };
    }
    
    /**
     * Get trajectory points in a format suitable for 3D visualization
     * @returns {Array} Array of 3D points
     */
    getTrajectoryPoints3D() {
        return this.trajectoryPoints.map(point => ({
            x: point.x,
            y: point.y,
            z: 0
        }));
    }
    
    /**
     * Get velocity vectors in a format suitable for 3D visualization
     * @returns {Array} Array of {origin, direction, magnitude}
     */
    getVelocityVectors3D() {
        return this.velocityVectors.map(item => {
            const { position, velocity } = item;
            const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            
            return {
                origin: { x: position.x, y: position.y, z: 0 },
                direction: {
                    x: velocity.x / magnitude,
                    y: velocity.y / magnitude,
                    z: 0
                },
                magnitude
            };
        });
    }
    
    /**
     * Get acceleration vector in a format suitable for 3D visualization
     * @returns {Object} {origin, direction, magnitude}
     */
    getAccelerationVector3D() {
        const acceleration = this.physics.calculateAcceleration();
        const magnitude = Math.abs(acceleration.y);
        
        return {
            origin: { x: 0, y: 0, z: 0 },
            direction: {
                x: 0,
                y: acceleration.y / magnitude,
                z: 0
            },
            magnitude
        };
    }
    
    /**
     * Get trajectory statistics for display
     * @returns {Object} Trajectory statistics
     */
    getTrajectoryStatistics() {
        return {
            flightTime: this.trajectoryProperties.flightTime.toFixed(2) + ' s',
            range: this.trajectoryProperties.range.toFixed(2) + ' m',
            maxHeight: this.trajectoryProperties.maxHeight.toFixed(2) + ' m',
            initialVelocity: this.trajectoryProperties.initialVelocity.toFixed(1) + ' m/s',
            launchAngle: this.trajectoryProperties.launchAngle.toFixed(0) + '°',
            gravity: this.trajectoryProperties.gravity.toFixed(1) + ' m/s²'
        };
    }
    
    /**
     * Generate data for position vs. time graph
     * @returns {Object} Graph data for x and y positions
     */
    getPositionTimeGraphData() {
        const flightTime = this.physics.calculateFlightTime();
        const steps = 100;
        const timeStep = flightTime / steps;
        
        const xData = [];
        const yData = [];
        
        for (let i = 0; i <= steps; i++) {
            const t = i * timeStep;
            const position = this.physics.calculatePosition(t);
            
            xData.push({ t, x: position.x });
            yData.push({ t, y: position.y });
        }
        
        return { xData, yData };
    }
    
    /**
     * Generate data for velocity vs. time graph
     * @returns {Object} Graph data for x and y velocities
     */
    getVelocityTimeGraphData() {
        const flightTime = this.physics.calculateFlightTime();
        const steps = 100;
        const timeStep = flightTime / steps;
        
        const vxData = [];
        const vyData = [];
        
        for (let i = 0; i <= steps; i++) {
            const t = i * timeStep;
            const velocity = this.physics.calculateVelocity(t);
            
            vxData.push({ t, vx: velocity.x });
            vyData.push({ t, vy: velocity.y });
        }
        
        return { vxData, vyData };
    }
    
    /**
     * Generate data for the position function in parametric form
     * @returns {Function} Parametric function that returns {x, y, z} given t
     */
    getParametricPositionFunction() {
        const v0 = this.physics.initialVelocity;
        const theta = this.physics.launchAngle * Math.PI / 180;
        const g = this.physics.gravity;
        
        return (t) => {
            const x = v0 * Math.cos(theta) * t;
            const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
            return { x, y, z: 0 };
        };
    }
}