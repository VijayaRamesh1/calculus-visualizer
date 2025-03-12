/**
 * Simulation Controller for Projectile Motion
 * 
 * Orchestrates the Model-View interactions:
 * - Initializes models and views
 * - Handles user input
 * - Updates views based on model changes
 * - Controls animation flow
 */

import TrajectoryModel from '../models/trajectory.js';
import SceneView from '../views/scene.js';
import GraphsView from '../views/graphs.js';
import UICore from '../../../core/ui-core.js';

class SimulationController {
    constructor() {
        // Initialize UI
        this.ui = new UICore();
        
        // Initialize model
        this.trajectoryModel = new TrajectoryModel();
        
        // Initialize views when DOM is loaded
        this.initializeViews();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    /**
     * Initialize views
     */
    initializeViews() {
        // Get visualization container
        const visualizationContainer = document.getElementById('visualization-canvas');
        
        // Initialize 3D scene view
        this.sceneView = new SceneView(visualizationContainer);
        
        // Initial update
        this.updateViews();
    }
    
    /**
     * Initialize event listeners for controls
     */
    initializeEventListeners() {
        // Parameter controls
        this.ui.onParameterChange('initial-velocity', value => {
            this.trajectoryModel.updateParameters({ initialVelocity: value });
            this.updateViews();
        });
        
        this.ui.onParameterChange('launch-angle', value => {
            this.trajectoryModel.updateParameters({ launchAngle: value });
            this.updateViews();
        });
        
        this.ui.onParameterChange('gravity', value => {
            this.trajectoryModel.updateParameters({ gravity: value });
            this.updateViews();
        });
        
        // Visualization options
        this.ui.onParameterChange('show-trajectory', value => {
            this.trajectoryModel.updateSettings({ showTrajectory: value });
            this.updateViews();
        });
        
        this.ui.onParameterChange('show-velocity-vectors', value => {
            this.trajectoryModel.updateSettings({ showVelocityVectors: value });
            this.updateViews();
        });
        
        this.ui.onParameterChange('show-acceleration', value => {
            this.trajectoryModel.updateSettings({ showAcceleration: value });
            this.updateViews();
        });
        
        this.ui.onParameterChange('show-math-functions', value => {
            this.trajectoryModel.updateSettings({ showMathFunctions: value });
            this.updateViews();
        });
        
        // Control buttons
        const toggleAnimationBtn = document.getElementById('toggle-animation');
        if (toggleAnimationBtn) {
            toggleAnimationBtn.addEventListener('click', () => {
                const isPlaying = this.sceneView.toggleAnimation();
                toggleAnimationBtn.classList.toggle('active', isPlaying);
                
                // Update icon
                if (isPlaying) {
                    toggleAnimationBtn.innerHTML = `
                        <svg class="pause-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 4H6V20H10V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18 4H14V20H18V4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                } else {
                    toggleAnimationBtn.innerHTML = `
                        <svg class="play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3L19 12L5 21V3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                }
            });
        }
        
        const toggleDimensionBtn = document.getElementById('toggle-dimension');
        if (toggleDimensionBtn) {
            toggleDimensionBtn.addEventListener('click', () => {
                const is3D = toggleDimensionBtn.textContent.trim() === '3D';
                
                // Toggle between 2D and 3D
                if (is3D) {
                    this.sceneView.toggleDimension(true);
                    toggleDimensionBtn.textContent = '2D';
                } else {
                    this.sceneView.toggleDimension(false);
                    toggleDimensionBtn.textContent = '3D';
                }
            });
        }
        
        const resetViewBtn = document.getElementById('reset-view');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => {
                this.sceneView.resetView();
            });
        }
    }
    
    /**
     * Update all views based on current model state
     */
    updateViews() {
        // Update 3D scene
        this.sceneView.updateScene(this.trajectoryModel);
    }
}

// Initialize simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SimulationController();
});
