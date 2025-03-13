/**
 * Interactive Landing Experience Visualization
 * 
 * This file implements the interactive 3D visualization for the landing page,
 * creating an engaging entry point that immediately demonstrates the power of
 * the calculus visualization tool.
 */

import ThreeUtils from './3d-utils.js';

class LandingVisualization {
    constructor(container) {
        // Initialize 3D utilities with container
        this.container = container;
        this.threeUtils = new ThreeUtils(container);
        
        // Animation properties
        this.animationTime = 0;
        this.autoRotate = true;
        this.surfaces = [];
        this.currentSurfaceIndex = 0;
        
        // Setup scene
        this.setupScene();
        
        // Setup hover interactions
        this.setupInteractions();
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Set up the 3D scene
     */
    setupScene() {
        // Set camera position
        this.threeUtils.camera.position.set(5, 4, 5);
        this.threeUtils.camera.lookAt(0, 0, 0);
        
        // Enable auto-rotation for orbit controls
        this.threeUtils.controls.autoRotate = true;
        this.threeUtils.controls.autoRotateSpeed = 1.0;
        
        // Add gentle lighting for dramatic effect
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.threeUtils.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        this.threeUtils.scene.add(directionalLight);
        
        // Add surfaces
        this.addSurfaces();
    }
    
    /**
     * Add various calculus-related surfaces
     */
    addSurfaces() {
        // 1. Saddle surface - demonstrates multivariable calculus
        this.addSaddleSurface();
        
        // 2. Wave function - demonstrates periodic functions and time evolution
        this.addWaveSurface();
        
        // 3. Sphere with gradients - demonstrates vector calculus
        this.addGradientSphere();
        
        // Show only the first surface initially
        this.showSurface(0);
    }
    
    /**
     * Add a saddle surface (hyperbolic paraboloid)
     */
    addSaddleSurface() {
        const surfaceFunc = (u, v) => {
            // Map u,v from [0,1] to [-1,1]
            const x = 2 * u - 1;
            const z = 2 * v - 1;
            
            // Hyperbolic paraboloid equation
            const y = x*x - z*z;
            
            return { x: 2*x, y: y, z: 2*z };
        };
        
        const surface = this.threeUtils.createParametricSurface(
            surfaceFunc, 40, 40, 0, 1, 0, 1, 0x4361ee
        );
        
        // Add details object for tooltip and interactive elements
        surface.userData = {
            title: "Saddle Surface",
            description: "Explore multivariable calculus with critical points and saddle points",
            relatedTo: "Vector Calculus"
        };
        
        this.surfaces.push(surface);
        surface.visible = false;
    }
    
    /**
     * Add a wave surface
     */
    addWaveSurface() {
        const surfaceFunc = (u, v) => {
            // Map u,v from [0,1] to [-1,1]
            const x = 4 * u - 2;
            const z = 4 * v - 2;
            
            // Wave equation
            const y = 0.5 * Math.sin(3 * x) * Math.cos(3 * z);
            
            return { x: x, y: y, z: z };
        };
        
        const surface = this.threeUtils.createParametricSurface(
            surfaceFunc, 40, 40, 0, 1, 0, 1, 0x4cc9f0
        );
        
        // Add details object for tooltip and interactive elements
        surface.userData = {
            title: "Wave Function",
            description: "Visualize differential equations and wave propagation",
            relatedTo: "Taylor Series"
        };
        
        this.surfaces.push(surface);
        surface.visible = false;
    }
    
    /**
     * Add a sphere with gradient vectors
     */
    addGradientSphere() {
        // Create a sphere
        const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x5e60ce,
            transparent: true,
            opacity: 0.7
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        
        // Add vectors around the sphere
        const vectorGroup = new THREE.Group();
        
        for (let i = 0; i < 10; i++) {
            const phi = Math.acos(-1 + (2 * i) / 10);
            
            for (let j = 0; j < 10; j++) {
                const theta = 2 * Math.PI * j / 10;
                
                // Position on sphere
                const x = 1.5 * Math.sin(phi) * Math.cos(theta);
                const y = 1.5 * Math.sin(phi) * Math.sin(theta);
                const z = 1.5 * Math.cos(phi);
                
                // Create a normalized vector pointing outward
                const origin = { x, y, z };
                const direction = { x, y, z };
                
                // Only show some vectors for less clutter
                if (Math.random() > 0.8) {
                    const vector = this.threeUtils.createVector(
                        origin, direction, 0.5, 0xffff00, 0.2, 0.1
                    );
                    vectorGroup.add(vector);
                }
            }
        }
        
        // Combine sphere and vectors into one object
        const combinedObject = new THREE.Group();
        combinedObject.add(sphere);
        combinedObject.add(vectorGroup);
        
        // Add to scene
        this.threeUtils.scene.add(combinedObject);
        
        // Add details object for tooltip and interactive elements
        combinedObject.userData = {
            title: "Vector Field on a Sphere",
            description: "Understand gradient fields and surface integrals",
            relatedTo: "Vector Calculus"
        };
        
        this.surfaces.push(combinedObject);
        combinedObject.visible = false;
    }
    
    /**
     * Show a specific surface and hide others
     * @param {number} index - Index of surface to show
     */
    showSurface(index) {
        this.surfaces.forEach((surface, i) => {
            surface.visible = (i === index);
        });
        
        this.currentSurfaceIndex = index;
        this.updateSurfaceInfo();
    }
    
    /**
     * Update surface information in the DOM
     */
    updateSurfaceInfo() {
        const surface = this.surfaces[this.currentSurfaceIndex];
        const infoBox = document.querySelector('.visualization-info');
        
        if (infoBox && surface) {
            const titleEl = infoBox.querySelector('.viz-title');
            const descEl = infoBox.querySelector('.viz-description');
            const relatedEl = infoBox.querySelector('.related-module');
            
            if (titleEl) titleEl.textContent = surface.userData.title;
            if (descEl) descEl.textContent = surface.userData.description;
            if (relatedEl) relatedEl.textContent = surface.userData.relatedTo;
        }
    }
    
    /**
     * Set up mouse hover interactions
     */
    setupInteractions() {
        // Add event listeners for hover
        this.container.addEventListener('mousemove', (event) => {
            this.threeUtils.controls.autoRotate = false;
            clearTimeout(this.rotateTimeout);
            
            // Resume auto-rotation after 2 seconds of inactivity
            this.rotateTimeout = setTimeout(() => {
                this.threeUtils.controls.autoRotate = true;
            }, 2000);
        });
        
        // Add event listeners for "Try Me" buttons
        const nextButton = document.getElementById('next-surface');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const nextIndex = (this.currentSurfaceIndex + 1) % this.surfaces.length;
                this.showSurface(nextIndex);
            });
        }
        
        // Add event listeners for module links
        const moduleLinks = document.querySelectorAll('.try-module');
        if (moduleLinks) {
            moduleLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    // Stop propagation to prevent double navigation
                    event.stopPropagation();
                });
            });
        }
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update animation time
        this.animationTime += 0.01;
        
        // Add "breathing" effect to the active surface
        if (this.surfaces[this.currentSurfaceIndex]) {
            const surface = this.surfaces[this.currentSurfaceIndex];
            const breathingScale = 1 + 0.05 * Math.sin(this.animationTime);
            surface.scale.set(breathingScale, breathingScale, breathingScale);
        }
    }
    
    /**
     * Clean up resources when no longer needed
     */
    dispose() {
        // Remove event listeners
        window.removeEventListener('resize', this.threeUtils.onWindowResize);
        
        // Dispose of Three.js resources
        this.threeUtils.clearScene();
        this.threeUtils.renderer.dispose();
    }
}

// Export for use in other modules
export default LandingVisualization;
