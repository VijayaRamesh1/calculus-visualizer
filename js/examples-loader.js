/**
 * examples-loader.js
 * Handles loading and initializing example data and visualizations
 */

class ExamplesLoader {
  constructor() {
    // Store reference to the engine when it's initialized
    this.engine = null;
    this.uiController = null;
    
    // Current example data
    this.currentExample = null;
    
    // Listen for engine initialization
    window.addEventListener('engineInitialized', (event) => {
      this.engine = event.detail.engine;
    });
    
    // Initialize with delay to ensure other components are loaded
    setTimeout(() => {
      this.initialize();
    }, 100);
  }
  
  initialize() {
    // Find the UI controller instance
    if (window.uiController) {
      this.uiController = window.uiController;
    }
    
    // Listen for visualization option changes
    document.addEventListener('visualizationOptionChanged', this.handleVisualizationOptionChange.bind(this));
    document.addEventListener('parameterChanged', this.handleParameterChange.bind(this));
    document.addEventListener('animationToggled', this.handleAnimationToggle.bind(this));
    document.addEventListener('dimensionToggled', this.handleDimensionToggle.bind(this));
    document.addEventListener('viewReset', this.handleViewReset.bind(this));
  }
  
  loadExample(exampleId) {
    // Get the appropriate example module
    const exampleData = this.getExampleData(exampleId);
    if (!exampleData) {
      console.error(`Example not found: ${exampleId}`);
      return;
    }
    
    this.currentExample = exampleData;
    
    // Update UI with example data
    if (this.uiController) {
      this.uiController.updateUIForExample(exampleData);
    }
    
    // Initialize visualization if engine is available
    if (this.engine) {
      this.initializeVisualization(exampleData);
    }
  }
  
  getExampleData(exampleId) {
    // Map of available examples
    const examples = {
      // Physics examples
      'projectile-motion': {
        concept: 'Derivatives: Position, Velocity, Acceleration',
        description: 'In projectile motion, derivatives show how position changes over time. The first derivative gives velocity, while the second derivative gives acceleration.',
        parameters: {
          'initial-velocity': { min: 1, max: 20, value: 10, step: 1 },
          'launch-angle': { min: 0, max: 90, value: 45, step: 1 },
          'gravity': { min: 1, max: 20, value: 9.8, step: 0.1 }
        },
        options: {
          'show-trajectory': true,
          'show-velocity-vectors': false,
          'show-acceleration': false,
          'show-math-functions': false
        },
        visualizationFunction: this.initializeProjectileMotion.bind(this)
      },
      'simple-harmonic': {
        concept: 'Derivatives: Simple Harmonic Motion',
        description: 'Simple harmonic motion demonstrates periodic oscillations where the restoring force is proportional to displacement, showing derivatives in action.',
        parameters: {
          'spring-constant': { min: 0.1, max: 10, value: 1, step: 0.1 },
          'mass': { min: 0.1, max: 5, value: 1, step: 0.1 },
          'amplitude': { min: 0.1, max: 5, value: 2, step: 0.1 }
        },
        options: {
          'show-trajectory': true,
          'show-velocity-vectors': false,
          'show-acceleration': false,
          'show-math-functions': false
        },
        visualizationFunction: this.initializeSimpleHarmonic.bind(this)
      },
      'circular-motion': {
        concept: 'Derivatives: Circular Motion',
        description: 'Circular motion demonstrates the relationship between position, velocity, and acceleration in a rotating system.',
        parameters: {
          'radius': { min: 1, max: 10, value: 5, step: 0.1 },
          'angular-velocity': { min: 0.1, max: 5, value: 1, step: 0.1 }
        },
        options: {
          'show-trajectory': true,
          'show-velocity-vectors': false,
          'show-acceleration': false,
          'show-math-functions': false
        },
        visualizationFunction: this.initializeCircularMotion.bind(this)
      },
      
      // Economics examples
      'market-equilibrium': {
        concept: 'Derivatives: Market Equilibrium',
        description: 'Market equilibrium demonstrates how derivatives help find the price and quantity where supply and demand are equal.',
        parameters: {
          'demand-elasticity': { min: 0.1, max: 5, value: 1, step: 0.1 },
          'supply-elasticity': { min: 0.1, max: 5, value: 1, step: 0.1 },
          'market-shock': { min: -5, max: 5, value: 0, step: 0.1 }
        },
        options: {
          'show-equilibrium-point': true,
          'show-consumer-surplus': false,
          'show-producer-surplus': false,
          'show-math-functions': false
        },
        visualizationFunction: this.initializeMarketEquilibrium.bind(this)
      }
      
      // Additional examples would be added here
    };
    
    return examples[exampleId];
  }
  
  initializeVisualization(exampleData) {
    if (exampleData.visualizationFunction) {
      exampleData.visualizationFunction(exampleData);
    }
  }
  
  // Event handlers
  handleVisualizationOptionChange(event) {
    const { option, checked } = event.detail;
    
    // Update the current example's options
    if (this.currentExample && this.currentExample.options) {
      this.currentExample.options[option] = checked;
    }
    
    // Refresh visualization
    this.refreshVisualization();
  }
  
  handleParameterChange(event) {
    const { parameter, value } = event.detail;
    
    // Update the current example's parameters
    if (this.currentExample && this.currentExample.parameters) {
      if (this.currentExample.parameters[parameter]) {
        this.currentExample.parameters[parameter].value = value;
      }
    }
    
    // Refresh visualization with debounce for sliders
    if (this.paramChangeTimeout) {
      clearTimeout(this.paramChangeTimeout);
    }
    
    this.paramChangeTimeout = setTimeout(() => {
      this.refreshVisualization();
    }, 50);
  }
  
  handleAnimationToggle(event) {
    const { isAnimating } = event.detail;
    
    if (this.engine) {
      this.engine.animateFunction = isAnimating;
    }
  }
  
  handleDimensionToggle(event) {
    const { is3D } = event.detail;
    
    if (this.engine) {
      this.engine.is3DMode = is3D;
      this.refreshVisualization();
    }
  }
  
  handleViewReset() {
    if (this.engine) {
      this.engine.resetView();
    }
  }
  
  refreshVisualization() {
    if (this.engine && this.currentExample) {
      this.initializeVisualization(this.currentExample);
    }
  }
  
  // Example-specific initialization functions
  initializeProjectileMotion(exampleData) {
    if (!this.engine) return;
    
    // Clear previous visualization
    this.engine.clearFunctionMeshes();
    
    // Get parameters
    const v0 = exampleData.parameters['initial-velocity'].value;
    const angle = exampleData.parameters['launch-angle'].value * (Math.PI / 180); // Convert to radians
    const g = exampleData.parameters['gravity'].value;
    
    // Create trajectory visualization
    if (exampleData.options['show-trajectory']) {
      this.createProjectileTrajectory(v0, angle, g);
    }
    
    // Show velocity vectors if enabled
    if (exampleData.options['show-velocity-vectors']) {
      this.createVelocityVectors(v0, angle, g);
    }
    
    // Show acceleration if enabled
    if (exampleData.options['show-acceleration']) {
      this.createAccelerationVector(g);
    }
    
    // Show mathematical functions if enabled
    if (exampleData.options['show-math-functions']) {
      this.createMathFunctions(v0, angle, g);
    }
  }
  
  createProjectileTrajectory(v0, angle, g) {
    // Example functionality - in the real implementation, this would create
    // a 3D visualization of the projectile trajectory using Three.js
    // For now, we'll use placeholder code
    
    // Calculate time of flight
    const tFlight = (2 * v0 * Math.sin(angle)) / g;
    
    // Create curve points
    const points = [];
    const timeSteps = 50;
    const timeStep = tFlight / timeSteps;
    
    for (let i = 0; i <= timeSteps; i++) {
      const t = i * timeStep;
      const x = v0 * Math.cos(angle) * t;
      const y = v0 * Math.sin(angle) * t - 0.5 * g * t * t;
      
      // For 3D mode, set z = 0, for 2D mode set z as y and y as 0
      if (this.engine.is3DMode) {
        points.push(new THREE.Vector3(x, y, 0));
      } else {
        points.push(new THREE.Vector3(x, 0, y));
      }
    }
    
    // Create tube geometry for the trajectory
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
    const material = new THREE.MeshPhongMaterial({ color: 0x4361ee });
    
    const mesh = new THREE.Mesh(geometry, material);
    this.engine.scene.add(mesh);
    this.engine.functionMeshes.push(mesh);
    
    // Add a sphere for the projectile
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xf72585 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    // Position at the start of the trajectory
    if (this.engine.is3DMode) {
      sphere.position.set(points[0].x, points[0].y, points[0].z);
    } else {
      sphere.position.set(points[0].x, points[0].y, points[0].z);
    }
    
    this.engine.scene.add(sphere);
    this.engine.functionMeshes.push(sphere);
    
    // Store animation data for the projectile
    sphere.userData.animationData = {
      points: points,
      currentIndex: 0,
      maxIndex: points.length - 1
    };
    
    // Update the animation handler to animate the projectile
    const originalUpdateFunc = this.engine.update.bind(this.engine);
    this.engine.update = () => {
      originalUpdateFunc();
      
      // Animate the projectile if animation is enabled
      if (this.engine.animateFunction && sphere.userData.animationData) {
        const animData = sphere.userData.animationData;
        
        // Increment index
        animData.currentIndex = (animData.currentIndex + 1) % animData.maxIndex;
        
        // Update position
        const point = animData.points[animData.currentIndex];
        sphere.position.copy(point);
      }
    };
  }
  
  createVelocityVectors(v0, angle, g) {
    // Placeholder for velocity vector visualization
    // This would show the changing velocity vector at different points along the trajectory
  }
  
  createAccelerationVector(g) {
    // Placeholder for acceleration vector visualization
    // This would show the constant acceleration due to gravity
  }
  
  createMathFunctions(v0, angle, g) {
    // Placeholder for showing mathematical function representations
    // This would display the equations that govern projectile motion
  }
  
  // Other example initialization functions
  initializeSimpleHarmonic(exampleData) {
    // Placeholder for simple harmonic motion visualization
  }
  
  initializeCircularMotion(exampleData) {
    // Placeholder for circular motion visualization
  }
  
  initializeMarketEquilibrium(exampleData) {
    // Placeholder for market equilibrium visualization
  }
}
