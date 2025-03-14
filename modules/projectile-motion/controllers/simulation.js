/**
 * Simulation Controller for Projectile Motion
 * 
 * Orchestrates the Model-View interactions:
 * - Initializes models and views
 * - Handles user input
 * - Updates views based on model changes
 * - Controls animation flow
 * - Manages environment settings
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
        
        // Make instance globally available for environment controls
        window.SimulationController = this;
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
        
        // Environment controls
        const timeOfDaySelect = document.getElementById('time-of-day');
        if (timeOfDaySelect) {
            timeOfDaySelect.addEventListener('change', () => {
                this.setTimeOfDay(timeOfDaySelect.value);
            });
        }
        
        const environmentTypeSelect = document.getElementById('environment-type');
        if (environmentTypeSelect) {
            environmentTypeSelect.addEventListener('change', () => {
                this.setEnvironmentType(environmentTypeSelect.value);
            });
        }
        
        const weatherEffectSelect = document.getElementById('weather-effect');
        if (weatherEffectSelect) {
            weatherEffectSelect.addEventListener('change', () => {
                this.setWeatherEffect(weatherEffectSelect.value);
            });
        }
        
        // Focus mode toggle
        const focusModeBtn = document.getElementById('focus-mode-btn');
        if (focusModeBtn) {
            focusModeBtn.addEventListener('click', () => {
                const moduleLayout = document.querySelector('.module-layout');
                moduleLayout.classList.toggle('focus-mode');
                
                // Update button text
                if (moduleLayout.classList.contains('focus-mode')) {
                    focusModeBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 3H21V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 3H3V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 21H21V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 21H3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Exit Focus
                    `;
                } else {
                    focusModeBtn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Focus Mode
                    `;
                }
                
                // Resize window to trigger responsive layout adjustments
                window.dispatchEvent(new Event('resize'));
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
    
    /**
     * Set the time of day for the environment
     * @param {string} timeOfDay - 'day', 'sunset', or 'night'
     */
    setTimeOfDay(timeOfDay) {
        if (this.sceneView) {
            this.sceneView.setTimeOfDay(timeOfDay);
        }
    }
    
    /**
     * Set the environment type
     * @param {string} type - 'grassland', 'desert', or 'snow'
     */
    setEnvironmentType(type) {
        if (this.sceneView) {
            this.sceneView.setEnvironmentType(type);
        }
    }
    
    /**
     * Set weather effects
     * @param {string} effect - 'clear', 'rain', 'wind', or 'fog'
     * @param {number} intensity - Intensity level from 0 to 1
     */
    setWeatherEffect(effect, intensity = 0.5) {
        if (this.sceneView) {
            this.sceneView.setWeatherEffect(effect, intensity);
            
            // Update model if wind effects should influence trajectory
            if (effect === 'wind') {
                this.trajectoryModel.updateParameters({ 
                    windEffect: { 
                        active: true, 
                        strength: intensity * 5,
                        direction: { x: -1, y: 0, z: 0 }
                    }
                });
            } else {
                this.trajectoryModel.updateParameters({
                    windEffect: { active: false }
                });
            }
            
            this.updateViews();
        }
    }
}

// Initialize simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simulationController = new SimulationController();
});
