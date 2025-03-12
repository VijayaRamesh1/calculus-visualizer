/**
 * Car Acceleration Visualization
 * 
 * This module demonstrates how calculus relates to car acceleration
 * using a 3D model and interactive visualization.
 */

class CarAccelerationDemo {
  constructor(canvasId, options = {}) {
    this.canvasElement = document.getElementById(canvasId);
    
    // Default options
    this.options = {
      isometric: true,
      showDerivatives: true,
      showTangent: false,
      roadLength: 100,
      roadWidth: 10,
      ...options
    };
    
    // Animation state
    this.animating = false;
    this.time = 0;
    this.maxTime = 10;
    this.animationSpeed = 1;
    
    // Car motion parameters - position function: x(t) = t^2 + 2t
    this.positionFunction = (t) => t*t + 2*t;
    this.velocityFunction = (t) => 2*t + 2; // First derivative: v(t) = 2t + 2
    this.accelerationFunction = () => 2;     // Second derivative: a(t) = 2 (constant)
    
    // Initialize
    this.init();
  }
  
  init() {
    this.initThree();
    this.createEnvironment();
    this.createCar();
    this.createGraphs();
    this.setupCamera();
    this.setupLights();
    this.setupControls();
    this.render();
  }
  
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvasElement.parentElement.clientWidth, this.canvasElement.parentElement.clientHeight);
    this.renderer.shadowMap.enabled = true;
    
    // Camera
    const aspect = this.canvasElement.parentElement.clientWidth / this.canvasElement.parentElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  }
  
  setupCamera() {
    if (this.options.isometric) {
      // Isometric view
      this.camera.position.set(70, 40, 70);
      this.camera.lookAt(30, 0, 0);
    } else {
      // Side view
      this.camera.position.set(30, 15, 50);
      this.camera.lookAt(30, 5, 0);
    }
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    this.scene.add(dirLight);
  }
  
  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.rotateSpeed = 0.7;
  }
  
  createEnvironment() {
    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7CFC00, 
      roughness: 0.8,
      metalness: 0.2
    });
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.2;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
    
    // Road
    const roadGeometry = new THREE.PlaneGeometry(this.options.roadLength, this.options.roadWidth);
    const roadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.9,
      metalness: 0
    });
    this.road = new THREE.Mesh(roadGeometry, roadMaterial);
    this.road.rotation.x = -Math.PI / 2;
    this.road.position.y = -0.1;
    this.road.receiveShadow = true;
    this.scene.add(this.road);
    
    // Road markings
    this.createRoadMarkings();
    
    // Position markers
    this.createPositionMarkers();
  }
  
  createRoadMarkings() {
    const markingGeometry = new THREE.PlaneGeometry(3, 0.3);
    const markingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      roughness: 0.7 
    });
    
    for (let i = -this.options.roadLength/2 + 5; i < this.options.roadLength/2; i += 10) {
      const marking = new THREE.Mesh(markingGeometry, markingMaterial);
      marking.rotation.x = -Math.PI / 2;
      marking.position.set(i, -0.05, 0);
      this.scene.add(marking);
    }
  }
  
  createPositionMarkers() {
    // Create position markers along the road
    const markerGeometry = new THREE.BoxGeometry(0.5, 1, 1);
    const markerMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
    
    this.positionMarkers = [];
    
    for (let t = 0; t <= this.maxTime; t += 1) {
      const x = this.positionFunction(t);
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x - this.options.roadLength/2, 0.5, -this.options.roadWidth/2 - 2);
      
      // Add time label
      const textGeometry = new THREE.TextGeometry(`t=${t}`, {
        font: new THREE.Font({}), // Placeholder - would need to load a font
        size: 0.8,
        height: 0.1
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      marker.add(textMesh);
      textMesh.position.set(0, 1.2, 0);
      
      this.scene.add(marker);
      this.positionMarkers.push(marker);
    }
  }
  
  createCar() {
    // Create simple car model
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf43f5e,
      roughness: 0.2,
      metalness: 0.8
    });
    const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carBody.position.y = 1;
    carBody.castShadow = true;
    carGroup.add(carBody);
    
    // Car cabin
    const cabinGeometry = new THREE.BoxGeometry(2, 1, 1.8);
    const cabinMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x14b8a6,
      roughness: 0.1,
      metalness: 0.9,
      opacity: 0.7,
      transparent: true
    });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(-0.5, 1.9, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const wheelPositions = [
      { x: 1.3, y: 0.6, z: 1.1 },  // front right
      { x: 1.3, y: 0.6, z: -1.1 }, // front left
      { x: -1.3, y: 0.6, z: 1.1 }, // back right
      { x: -1.3, y: 0.6, z: -1.1 } // back left
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      carGroup.add(wheel);
    });
    
    // Add to scene and save reference
    this.car = carGroup;
    this.scene.add(this.car);
    
    // Initial position
    const initialX = this.positionFunction(0) - this.options.roadLength/2;
    this.car.position.set(initialX, 0, 0);
  }
  
  createGraphs() {
    // Position, velocity, and acceleration graphs
    this.createPositionGraph();
    this.createVelocityGraph();
    this.createAccelerationGraph();
  }
  
  createPositionGraph() {
    const material = new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 2 });
    const points = [];
    
    // Create a curve showing position over time
    for (let t = 0; t <= this.maxTime; t += 0.1) {
      // Scale for visibility
      const x = t * 5;
      const y = this.positionFunction(t) / 10 + 10;
      const z = -this.options.roadWidth/2 - 6;
      
      points.push(new THREE.Vector3(x - this.options.roadLength/2, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.positionCurve = new THREE.Line(geometry, material);
    this.scene.add(this.positionCurve);
    
    // Add labels
    this.addLabel("Position (x)", points[Math.floor(points.length/2)].x, points[Math.floor(points.length/2)].y + 2, points[Math.floor(points.length/2)].z);
  }
  
  createVelocityGraph() {
    const material = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2 });
    const points = [];
    
    // Create a curve showing velocity over time
    for (let t = 0; t <= this.maxTime; t += 0.1) {
      // Scale for visibility
      const x = t * 5;
      const y = this.velocityFunction(t) + 5;
      const z = -this.options.roadWidth/2 - 12;
      
      points.push(new THREE.Vector3(x - this.options.roadLength/2, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.velocityCurve = new THREE.Line(geometry, material);
    this.scene.add(this.velocityCurve);
    
    // Add labels
    this.addLabel("Velocity (v)", points[Math.floor(points.length/2)].x, points[Math.floor(points.length/2)].y + 2, points[Math.floor(points.length/2)].z);
  }
  
  createAccelerationGraph() {
    const material = new THREE.LineBasicMaterial({ color: 0x14b8a6, linewidth: 2 });
    const points = [];
    
    // Create a curve showing acceleration over time
    for (let t = 0; t <= this.maxTime; t += 0.1) {
      // Scale for visibility
      const x = t * 5;
      const y = this.accelerationFunction(t) + 1;
      const z = -this.options.roadWidth/2 - 18;
      
      points.push(new THREE.Vector3(x - this.options.roadLength/2, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.accelerationCurve = new THREE.Line(geometry, material);
    this.scene.add(this.accelerationCurve);
    
    // Add labels
    this.addLabel("Acceleration (a)", points[Math.floor(points.length/2)].x, points[Math.floor(points.length/2)].y + 1, points[Math.floor(points.length/2)].z);
  }
  
  addLabel(text, x, y, z) {
    // This is a placeholder - in a real implementation, you would use
    // a library like THREE.TextGeometry or HTML overlay for labels
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const geometry = new THREE.PlaneGeometry(10, 2.5);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.lookAt(this.camera.position);
    
    this.scene.add(mesh);
  }
  
  toggleAnimation() {
    this.animating = !this.animating;
    if (this.animating) {
      this.time = 0;
      this.animate();
    }
  }
  
  resetAnimation() {
    this.time = 0;
    this.updateCarPosition();
  }
  
  updateCarPosition() {
    // Calculate position based on current time
    const x = this.positionFunction(this.time) - this.options.roadLength/2;
    this.car.position.x = x;
    
    // Rotate wheels based on velocity
    const velocity = this.velocityFunction(this.time);
    this.car.children.forEach((child, index) => {
      // Skip body and cabin (index 0 and 1)
      if (index > 1) {
        child.rotation.x += velocity * 0.1;
      }
    });
    
    // Update tangent line if enabled
    if (this.options.showTangent) {
      this.updateTangentLine();
    }
  }
  
  updateTangentLine() {
    // Remove existing tangent line if it exists
    if (this.tangentLine) {
      this.scene.remove(this.tangentLine);
    }
    
    // Create new tangent line at current position
    const currentX = this.positionFunction(this.time) - this.options.roadLength/2;
    const currentVelocity = this.velocityFunction(this.time);
    
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 });
    const points = [
      new THREE.Vector3(currentX - 5, 10 + (this.positionFunction(this.time - 0.5) - this.positionFunction(this.time)) / 10, -this.options.roadWidth/2 - 6),
      new THREE.Vector3(currentX, 10 + this.positionFunction(this.time) / 10, -this.options.roadWidth/2 - 6),
      new THREE.Vector3(currentX + 5, 10 + (this.positionFunction(this.time + 0.5) - this.positionFunction(this.time)) / 10 + currentVelocity / 2, -this.options.roadWidth/2 - 6)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    this.tangentLine = new THREE.Line(geometry, material);
    this.scene.add(this.tangentLine);
  }
  
  animate() {
    if (!this.animating) return;
    
    requestAnimationFrame(() => this.animate());
    
    // Update time
    this.time += 0.01 * this.animationSpeed;
    
    // Loop animation
    if (this.time > this.maxTime) {
      this.time = 0;
    }
    
    this.updateCarPosition();
    this.render();
  }
  
  render() {
    // Update controls
    if (this.controls) {
      this.controls.update();
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
  
  // Public methods for interactivity
  setShowDerivatives(show) {
    this.options.showDerivatives = show;
    this.velocityCurve.visible = show;
    this.accelerationCurve.visible = show;
  }
  
  setShowTangent(show) {
    this.options.showTangent = show;
    if (!show && this.tangentLine) {
      this.scene.remove(this.tangentLine);
      this.tangentLine = null;
    } else if (show) {
      this.updateTangentLine();
    }
  }
  
  setIsometric(isometric) {
    this.options.isometric = isometric;
    this.setupCamera();
  }
  
  setAnimationSpeed(speed) {
    this.animationSpeed = speed;
  }
  
  resize() {
    const width = this.canvasElement.parentElement.clientWidth;
    const height = this.canvasElement.parentElement.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  }
}

// Define the car acceleration example for the main app
window.examples = window.examples || {};
window.examples.carAcceleration = {
  init: function(canvasId) {
    // Create the demonstration
    const demo = new CarAccelerationDemo(canvasId);
    
    // Set up UI connections
    document.getElementById('toggle-animation')?.addEventListener('click', () => {
      demo.toggleAnimation();
    });
    
    document.getElementById('reset-view')?.addEventListener('click', () => {
      demo.resetAnimation();
    });
    
    document.getElementById('show-derivative')?.addEventListener('change', (e) => {
      demo.setShowDerivatives(e.target.checked);
    });
    
    document.getElementById('show-tangent')?.addEventListener('change', (e) => {
      demo.setShowTangent(e.target.checked);
    });
    
    document.getElementById('dimension-toggle')?.addEventListener('click', () => {
      demo.setIsometric(!demo.options.isometric);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      demo.resize();
    });
    
    // Initial animation
    setTimeout(() => {
      demo.toggleAnimation();
    }, 1000);
    
    return demo;
  },
  
  description: {
    title: "Car Acceleration",
    content: `
      <p>This visualization demonstrates how calculus is used to understand car acceleration.</p>
      <p>The car's position is modeled by the function x(t) = t² + 2t, which produces non-uniform acceleration.</p>
      <p>The velocity (first derivative) is v(t) = 2t + 2, and the acceleration (second derivative) is a constant a(t) = 2.</p>
      <p>The three graphs show:</p>
      <ul>
        <li>Position (blue) - How far the car has traveled</li>
        <li>Velocity (red) - How fast the car is moving at each moment</li>
        <li>Acceleration (teal) - The rate of change of velocity (constant in this case)</li>
      </ul>
      <p>Toggle the "Show Tangent" option to see the tangent line representing the instantaneous velocity at any point.</p>
    `
  }
};
