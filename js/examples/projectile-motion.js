/**
 * projectile-motion.js
 * Specific implementation for projectile motion example
 */

class ProjectileMotion {
  constructor(engine) {
    this.engine = engine;
    this.trajectoryMesh = null;
    this.projectileMesh = null;
    this.velocityArrows = [];
    this.accelerationArrow = null;
    this.mathFunctionMeshes = [];
    
    // Default parameters
    this.params = {
      initialVelocity: 10,
      launchAngle: 45 * (Math.PI / 180), // Convert to radians
      gravity: 9.8,
      timeStep: 0.1,
      maxTime: null, // Will be calculated
      showTrajectory: true,
      showVelocityVectors: false,
      showAcceleration: false,
      showMathFunctions: false
    };
    
    // Animation properties
    this.animationTime = 0;
    this.paused = true;
  }
  
  initialize(parameters = {}) {
    // Update parameters with any provided values
    Object.assign(this.params, parameters);
    
    // Calculate time of flight
    this.calculateTimeOfFlight();
    
    // Clear any existing visualization
    this.clear();
    
    // Create the visualization elements
    this.createVisualization();
  }
  
  calculateTimeOfFlight() {
    // Time it takes for projectile to return to launch height
    // t = (2 * v0 * sin(θ)) / g
    const v0 = this.params.initialVelocity;
    const theta = this.params.launchAngle;
    const g = this.params.gravity;
    
    this.params.maxTime = (2 * v0 * Math.sin(theta)) / g;
  }
  
  clear() {
    // Remove all existing meshes
    if (this.trajectoryMesh) {
      this.engine.scene.remove(this.trajectoryMesh);
      this.trajectoryMesh.geometry.dispose();
      this.trajectoryMesh.material.dispose();
      this.trajectoryMesh = null;
    }
    
    if (this.projectileMesh) {
      this.engine.scene.remove(this.projectileMesh);
      this.projectileMesh.geometry.dispose();
      this.projectileMesh.material.dispose();
      this.projectileMesh = null;
    }
    
    // Clear velocity arrows
    this.velocityArrows.forEach(arrow => {
      this.engine.scene.remove(arrow);
      if (arrow.geometry) arrow.geometry.dispose();
      if (arrow.material) arrow.material.dispose();
    });
    this.velocityArrows = [];
    
    // Clear acceleration arrow
    if (this.accelerationArrow) {
      this.engine.scene.remove(this.accelerationArrow);
      this.accelerationArrow.geometry.dispose();
      this.accelerationArrow.material.dispose();
      this.accelerationArrow = null;
    }
    
    // Clear math function meshes
    this.mathFunctionMeshes.forEach(mesh => {
      this.engine.scene.remove(mesh);
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) mesh.material.dispose();
    });
    this.mathFunctionMeshes = [];
  }
  
  createVisualization() {
    // Create trajectory
    if (this.params.showTrajectory) {
      this.createTrajectory();
    }
    
    // Create projectile
    this.createProjectile();
    
    // Create velocity vectors
    if (this.params.showVelocityVectors) {
      this.createVelocityVectors();
    }
    
    // Create acceleration vector
    if (this.params.showAcceleration) {
      this.createAccelerationVector();
    }
    
    // Create mathematical function visualizations
    if (this.params.showMathFunctions) {
      this.createMathFunctions();
    }
  }
  
  createTrajectory() {
    // Create curve points for the trajectory
    const points = this.calculateTrajectoryPoints();
    
    // Create tube geometry for the trajectory
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x4361ee,
      transparent: true,
      opacity: 0.7
    });
    
    this.trajectoryMesh = new THREE.Mesh(geometry, material);
    this.engine.scene.add(this.trajectoryMesh);
  }
  
  calculateTrajectoryPoints() {
    const v0 = this.params.initialVelocity;
    const theta = this.params.launchAngle;
    const g = this.params.gravity;
    const maxTime = this.params.maxTime;
    
    const points = [];
    const timeSteps = 50;
    const timeStep = maxTime / timeSteps;
    
    for (let i = 0; i <= timeSteps; i++) {
      const t = i * timeStep;
      const x = v0 * Math.cos(theta) * t;
      const y = v0 * Math.sin(theta) * t - 0.5 * g * t * t;
      
      // For 3D mode, set z = 0, for 2D mode set z as y and y as 0
      if (this.engine.is3DMode) {
        points.push(new THREE.Vector3(x, y, 0));
      } else {
        points.push(new THREE.Vector3(x, 0, y));
      }
    }
    
    return points;
  }
  
  createProjectile() {
    // Create a sphere for the projectile
    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xf72585 });
    this.projectileMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    
    // Position at the start of the trajectory
    const initialPosition = this.calculatePosition(0);
    this.projectileMesh.position.copy(initialPosition);
    
    this.engine.scene.add(this.projectileMesh);
    
    // Store animation properties
    this.animationTime = 0;
  }
  
  calculatePosition(time) {
    const v0 = this.params.initialVelocity;
    const theta = this.params.launchAngle;
    const g = this.params.gravity;
    
    // Calculate position at given time
    const x = v0 * Math.cos(theta) * time;
    const y = v0 * Math.sin(theta) * time - 0.5 * g * time * time;
    
    // For 3D mode, set z = 0, for 2D mode set z as y and y as 0
    if (this.engine.is3DMode) {
      return new THREE.Vector3(x, y, 0);
    } else {
      return new THREE.Vector3(x, 0, y);
    }
  }
  
  calculateVelocity(time) {
    const v0 = this.params.initialVelocity;
    const theta = this.params.launchAngle;
    const g = this.params.gravity;
    
    // Calculate velocity components at given time
    // vx = v0 * cos(θ) [constant]
    // vy = v0 * sin(θ) - g * t [decreases with time]
    const vx = v0 * Math.cos(theta);
    const vy = v0 * Math.sin(theta) - g * time;
    
    // For 3D mode, set z = 0, for 2D mode set z as y and y as 0
    if (this.engine.is3DMode) {
      return new THREE.Vector3(vx, vy, 0);
    } else {
      return new THREE.Vector3(vx, 0, vy);
    }
  }
  
  createVelocityVectors() {
    // Create velocity vectors at different points along trajectory
    const timeSteps = 5; // Number of velocity vectors to show
    const maxTime = this.params.maxTime;
    const timeStep = maxTime / timeSteps;
    
    // Arrow parameters
    const arrowLength = 1.0; // Base length, will be scaled by velocity magnitude
    
    for (let i = 0; i <= timeSteps; i++) {
      const time = i * timeStep;
      
      // Calculate position and velocity at this time
      const position = this.calculatePosition(time);
      const velocity = this.calculateVelocity(time);
      
      // Normalize velocity and scale by arrow length
      const velocityMag = velocity.length();
      const direction = velocity.clone().normalize();
      const scaledLength = Math.min(arrowLength * (velocityMag / 10), 3); // Scale, but cap maximum
      
      // Create arrow
      const arrowHelper = new THREE.ArrowHelper(
        direction, 
        position, 
        scaledLength, 
        0x00ff00, // Green for velocity
        0.2, // Head length
        0.1  // Head width
      );
      
      this.engine.scene.add(arrowHelper);
      this.velocityArrows.push(arrowHelper);
    }
  }
  
  createAccelerationVector() {
    // Create an arrow showing the acceleration due to gravity
    // Acceleration is always downward with magnitude g
    
    // Center position for the arrow
    const midTime = this.params.maxTime / 2;
    const midPosition = this.calculatePosition(midTime);
    
    // Direction is always down in world coordinates
    const direction = new THREE.Vector3(0, -1, 0);
    if (!this.engine.is3DMode) {
      direction.set(0, 0, -1); // Down in 2D mode
    }
    
    // Create arrow
    const arrowLength = 1.5; // Length representing acceleration
    this.accelerationArrow = new THREE.ArrowHelper(
      direction,
      midPosition,
      arrowLength,
      0xff0000, // Red for acceleration
      0.3, // Head length
      0.15 // Head width
    );
    
    this.engine.scene.add(this.accelerationArrow);
  }
  
  createMathFunctions() {
    // Display the mathematical functions as 3D objects in the scene
    // This is a simplified implementation - in a real version, this would
    // create text objects or other visual representations of the formulas
    
    // Position equations
    this.createFormulaPlane("x(t) = v₀·cos(θ)·t", 
      new THREE.Vector3(-5, 4, 0), 
      new THREE.Vector3(4, 1, 0),
      0x4361ee);
      
    this.createFormulaPlane("y(t) = v₀·sin(θ)·t - ½·g·t²", 
      new THREE.Vector3(-5, 3, 0), 
      new THREE.Vector3(4, 1, 0),
      0x4361ee);
    
    // Velocity equations
    this.createFormulaPlane("vx(t) = v₀·cos(θ)", 
      new THREE.Vector3(-5, 1, 0), 
      new THREE.Vector3(3, 1, 0),
      0x00ff00);
      
    this.createFormulaPlane("vy(t) = v₀·sin(θ) - g·t", 
      new THREE.Vector3(-5, 0, 0), 
      new THREE.Vector3(3, 1, 0),
      0x00ff00);
    
    // Acceleration equations
    this.createFormulaPlane("ax(t) = 0", 
      new THREE.Vector3(-5, -2, 0), 
      new THREE.Vector3(2, 1, 0),
      0xff0000);
      
    this.createFormulaPlane("ay(t) = -g", 
      new THREE.Vector3(-5, -3, 0), 
      new THREE.Vector3(2, 1, 0),
      0xff0000);
  }
  
  createFormulaPlane(text, position, size, color) {
    // Create a simple placeholder for formula display
    // In a real implementation, this would use a TextGeometry or sprite
    
    const geometry = new THREE.PlaneGeometry(size.x, size.y);
    const material = new THREE.MeshBasicMaterial({ 
      color: color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const plane = new THREE.Mesh(geometry, material);
    plane.position.copy(position);
    
    this.engine.scene.add(plane);
    this.mathFunctionMeshes.push(plane);
    
    // Store the text for reference
    plane.userData.formulaText = text;
  }
  
  update(deltaTime) {
    // Update animation time
    if (!this.paused) {
      this.animationTime += deltaTime;
      
      // Loop animation
      if (this.animationTime > this.params.maxTime) {
        this.animationTime = 0;
      }
      
      // Update projectile position
      if (this.projectileMesh) {
        const position = this.calculatePosition(this.animationTime);
        this.projectileMesh.position.copy(position);
      }
    }
  }
  
  play() {
    this.paused = false;
  }
  
  pause() {
    this.paused = true;
  }
  
  toggle() {
    this.paused = !this.paused;
    return !this.paused; // Return true if playing
  }
  
  reset() {
    this.animationTime = 0;
    
    // Reset projectile position
    if (this.projectileMesh) {
      const initialPosition = this.calculatePosition(0);
      this.projectileMesh.position.copy(initialPosition);
    }
  }
}

// Register the example module
if (typeof window !== 'undefined' && window.exampleModules === undefined) {
  window.exampleModules = {};
}

if (typeof window !== 'undefined') {
  window.exampleModules.projectileMotion = ProjectileMotion;
}
