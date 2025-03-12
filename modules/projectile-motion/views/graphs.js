/**
 * Graphs View for Projectile Motion
 * 
 * Handles 2D visualization of mathematical functions related to projectile motion
 * - Position vs. time graphs
 * - Velocity vs. time graphs
 * - Trajectory path
 * - Function derivatives
 */

import ChartUtils from '../../../core/chart-utils.js';

export default class GraphsView {
    constructor(container) {
        // Initialize charts
        this.chartUtils = new ChartUtils(container);
        
        // Set default window
        this.chartUtils.setWindow(0, 10, 0, 10);
        
        // Draw baseline grid and axes
        this.chartUtils.drawGrid();
        this.chartUtils.drawAxes();
    }
    
    /**
     * Update graphs with new data
     * @param {Object} trajectoryModel - The trajectory model
     */
    updateGraphs(trajectoryModel) {
        // Clear previous graphs
        this.chartUtils.clear();
        this.chartUtils.drawGrid();
        this.chartUtils.drawAxes();
        
        // Check if math functions should be displayed
        if (!trajectoryModel.settings.showMathFunctions) return;
        
        // Get flight time and max height for scaling
        const flightTime = trajectoryModel.physics.calculateFlightTime();
        const maxHeight = trajectoryModel.physics.calculateMaxHeight();
        const range = trajectoryModel.physics.calculateRange();
        
        // Set appropriate viewing window
        this.chartUtils.setWindow(
            0,                      // xMin
            flightTime * 1.1,       // xMax with 10% padding
            0,                      // yMin
            Math.max(maxHeight, range) * 1.1  // yMax with 10% padding
        );
        
        // Plot position vs. time
        this.plotPositionVsTime(trajectoryModel);
        
        // Plot velocity vs. time if needed
        if (trajectoryModel.settings.showVelocityVectors) {
            this.plotVelocityVsTime(trajectoryModel);
        }
    }
    
    /**
     * Plot position vs. time graphs
     * @param {Object} trajectoryModel - The trajectory model
     */
    plotPositionVsTime(trajectoryModel) {
        // Get data
        const { xData, yData } = trajectoryModel.getPositionTimeGraphData();
        
        // Plot x-position vs. time
        this.chartUtils.plotFunction(
            t => {
                const v0 = trajectoryModel.physics.initialVelocity;
                const theta = trajectoryModel.physics.launchAngle * Math.PI / 180;
                return v0 * Math.cos(theta) * t;
            },
            '#ff0000'
        );
        
        // Plot y-position vs. time
        this.chartUtils.plotFunction(
            t => {
                const v0 = trajectoryModel.physics.initialVelocity;
                const theta = trajectoryModel.physics.launchAngle * Math.PI / 180;
                const g = trajectoryModel.physics.gravity;
                return v0 * Math.sin(theta) * t - 0.5 * g * t * t;
            },
            '#0000ff'
        );
        
        // Add labels
        this.chartUtils.addLabel('Position vs. Time', { x: 2, y: 1 });
        this.chartUtils.addLabel('x(t) = v₀cos(θ)t', { x: 4, y: 2 }, '#ff0000');
        this.chartUtils.addLabel('y(t) = v₀sin(θ)t - ½gt²', { x: 4, y: 3 }, '#0000ff');
    }
    
    /**
     * Plot velocity vs. time graphs
     * @param {Object} trajectoryModel - The trajectory model
     */
    plotVelocityVsTime(trajectoryModel) {
        // Get data
        const { vxData, vyData } = trajectoryModel.getVelocityTimeGraphData();
        
        // Plot horizontal velocity vs. time (constant)
        this.chartUtils.plotFunction(
            t => {
                const v0 = trajectoryModel.physics.initialVelocity;
                const theta = trajectoryModel.physics.launchAngle * Math.PI / 180;
                return v0 * Math.cos(theta);
            },
            '#00aa00'
        );
        
        // Plot vertical velocity vs. time (linear)
        this.chartUtils.plotFunction(
            t => {
                const v0 = trajectoryModel.physics.initialVelocity;
                const theta = trajectoryModel.physics.launchAngle * Math.PI / 180;
                const g = trajectoryModel.physics.gravity;
                return v0 * Math.sin(theta) - g * t;
            },
            '#aa00aa'
        );
        
        // Add labels
        this.chartUtils.addLabel('Velocity vs. Time', { x: 2, y: 5 });
        this.chartUtils.addLabel('vx(t) = v₀cos(θ)', { x: 4, y: 6 }, '#00aa00');
        this.chartUtils.addLabel('vy(t) = v₀sin(θ) - gt', { x: 4, y: 7 }, '#aa00aa');
    }
    
    /**
     * Plot trajectory path (parametric)
     * @param {Object} trajectoryModel - The trajectory model
     */
    plotTrajectory(trajectoryModel) {
        const points = trajectoryModel.getTrajectoryPoints3D().map(p => ({ x: p.x, y: p.y }));
        
        // Determine appropriate window
        const range = trajectoryModel.physics.calculateRange();
        const maxHeight = trajectoryModel.physics.calculateMaxHeight();
        
        this.chartUtils.setWindow(
            0,              // xMin
            range * 1.1,    // xMax with 10% padding
            0,              // yMin
            maxHeight * 1.1 // yMax with 10% padding
        );
        
        // Plot points
        this.chartUtils.plotPoints(points, '#ff0000', 2);
        
        // Add labels
        this.chartUtils.addLabel('Trajectory', { x: range / 2, y: maxHeight / 2 }, '#000000');
        this.chartUtils.addLabel('x', { x: range * 0.95, y: 0.3 });
        this.chartUtils.addLabel('y', { x: 0.3, y: maxHeight * 0.95 });
    }
}