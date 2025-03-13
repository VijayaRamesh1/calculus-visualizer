/**
 * Visualization Manager for the Calculus Visualizer
 * Handles the creation and management of 3D visualizations
 */

class VisualizationManager {
  /**
   * Create a visualization manager
   * @param {HTMLElement} container - The DOM element to render into
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      type: 'default',
      initialFunction: 'x^2',
      ...options
    };
    
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.isPlaying = false;
    this.surfaces = {};
    this.curves = {};
    this.mathExpression = this.options.initialFunction;
  }
  
  /**
   * Initialize the visualization
   */
  initialize() {
    this.initThreeJS();
    this.createLights();
    this.createCoordinateSystem();
    
    // Create initial visualization based on type
    switch (this.options.type) {
      case 'derivatives':
        this.createDerivativeVisualization();
        break;
      case 'integrals':
        this.createIntegralVisualization();
        break;
      case 'limits':
        this.createLimitsVisualization();
        break;
      case 'vector':
        this.createVectorVisualization();
        break;
      default:
        this.createDefaultVisualization();
    }
    
    // Start animation loop
    this.animate();
  }
  
  /**
   * Initialize Three.js renderer, scene, camera and controls
   */
  initThreeJS() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8fafc);
    
    // Create camera
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
    
    // Create orbit controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }
  
  /**
   * Create lights for the scene
   */
  createLights() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    this.scene.add(directionalLight);
  }
  
  /**
   * Create coordinate system (axes and grid)
   */
  createCoordinateSystem() {
    // Create axes
    const axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);
    
    // Create grid
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.rotation.x = Math.PI / 2;
    this.scene.add(gridHelper);
  }
  
  /**
   * Create a default visualization (3D surface)
   */
  createDefaultVisualization() {
    // Create a 3D surface
    const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
      const x = 5 * (u - 0.5);
      const z = 5 * (v - 0.5);
      const y = Math.sin(x) * Math.cos(z);
      target.set(x, y, z);
    }, 50, 50);
    
    // Create material with vibrant color
    const material = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 50,
    });
    
    // Create mesh and add to scene
    const surface = new THREE.Mesh(geometry, material);
    this.scene.add(surface);
    this.surfaces.default = surface;
  }
  
  /**
   * Create a visualization for derivatives
   */
  createDerivativeVisualization() {
    // Create a function surface
    const functionSurface = this.createFunctionSurface(this.mathExpression);
    this.scene.add(functionSurface);
    this.surfaces.function = functionSurface;
    
    // Create derivative curve
    const derivativeCurve = this.createDerivativeCurve(this.mathExpression);
    this.scene.add(derivativeCurve);
    this.curves.derivative = derivativeCurve;
    
    // Create tangent line
    const tangentLine = this.createTangentLine(0);
    this.scene.add(tangentLine);
    this.curves.tangent = tangentLine;
  }
  
  /**
   * Create a visualization for integrals
   */
  createIntegralVisualization() {
    // Create a function curve
    const functionCurve = this.createFunctionCurve(this.mathExpression);
    this.scene.add(functionCurve);
    this.curves.function = functionCurve;
    
    // Create integral area
    const integralArea = this.createIntegralArea(-2, 2);
    this.scene.add(integralArea);
    this.surfaces.integral = integralArea;
  }
  
  /**
   * Create a visualization for limits
   */
  createLimitsVisualization() {
    // Create a function curve with discontinuity
    const functionCurve = this.createDiscontinuousCurve('1/x');
    this.scene.add(functionCurve);
    this.curves.function = functionCurve;
    
    // Create limit indicators
    const limitIndicators = this.createLimitIndicators(0);
    this.scene.add(limitIndicators);
    this.curves.limitIndicators = limitIndicators;
  }
  
  /**
   * Create a visualization for vector calculus
   */
  createVectorVisualization() {
    // Create a vector field
    const vectorField = this.createVectorField();
    this.scene.add(vectorField);
    this.surfaces.vectorField = vectorField;
  }
  
  /**
   * Create a 3D function surface
   * @param {string} expression - Mathematical expression to visualize
   * @returns {THREE.Mesh} - The created surface mesh
   */
  createFunctionSurface(expression) {
    // Implementation would use mathjs to evaluate the expression
    // This is a placeholder that creates a parabola surface
    const geometry = new THREE.ParametricBufferGeometry((u, v, target) => {
      const x = 5 * (u - 0.5);
      const z = 5 * (v - 0.5);
      const y = Math.pow(x, 2);
      target.set(x, y, z);
    }, 50, 50);
    
    const material = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 50,
    });
    
    return new THREE.Mesh(geometry, material);
  }
  
  /**
   * Create a curve representing the derivative of a function
   * @param {string} expression - Mathematical expression to derive
   * @returns {THREE.Line} - The derivative curve
   */
  createDerivativeCurve(expression) {
    // This is a placeholder that creates a line
    const points = [];
    for (let x = -5; x <= 5; x += 0.1) {
      // For x^2, the derivative is 2x
      const y = 2 * x;
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    
    return new THREE.Line(geometry, material);
  }
  
  /**
   * Create a tangent line at a specific x-value
   * @param {number} x - The x-value where to create the tangent
   * @returns {THREE.Line} - The tangent line
   */
  createTangentLine(x) {
    // For x^2, the tangent at point x has slope 2x and passes through (x, x^2)
    const slope = 2 * x;
    const y = x * x;
    
    const points = [
      new THREE.Vector3(x - 2, y - 2 * slope, 0),
      new THREE.Vector3(x + 2, y + 2 * slope, 0)
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xf97316, linewidth: 3 });
    
    return new THREE.Line(geometry, material);
  }
  
  /**
   * Create a curve for a function
   * @param {string} expression - Mathematical expression to visualize
   * @returns {THREE.Line} - The function curve
   */
  createFunctionCurve(expression) {
    // This is a placeholder that creates a parabola curve
    const points = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const y = Math.pow(x, 2);
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 3 });
    
    return new THREE.Line(geometry, material);
  }
  
  /**
   * Create a surface representing the area under a curve (integral)
   * @param {number} a - Lower bound
   * @param {number} b - Upper bound
   * @returns {THREE.Mesh} - The integral area
   */
  createIntegralArea(a, b) {
    // This is a placeholder that creates a surface under a parabola
    const points = [];
    
    // Add bottom points
    for (let x = a; x <= b; x += 0.1) {
      points.push(new THREE.Vector3(x, 0, 0));
    }
    
    // Add top points in reverse
    for (let x = b; x >= a; x -= 0.1) {
      const y = Math.pow(x, 2);
      points.push(new THREE.Vector3(x, y, 0));
    }
    
    const shape = new THREE.Shape(points.map(p => new THREE.Vector2(p.x, p.y)));
    const geometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    
    return new THREE.Mesh(geometry, material);
  }
  
  /**
   * Create a curve with discontinuity for limits visualization
   * @param {string} expression - Mathematical expression to visualize
   * @returns {THREE.Group} - Group containing the curve segments
   */
  createDiscontinuousCurve(expression) {
    // This is a placeholder that creates a 1/x function
    const negPoints = [];
    for (let x = -5; x <= -0.1; x += 0.05) {
      const y = 1 / x;
      negPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const posPoints = [];
    for (let x = 0.1; x <= 5; x += 0.05) {
      const y = 1 / x;
      posPoints.push(new THREE.Vector3(x, y, 0));
    }
    
    const negGeometry = new THREE.BufferGeometry().setFromPoints(negPoints);
    const posGeometry = new THREE.BufferGeometry().setFromPoints(posPoints);
    const material = new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 3 });
    
    const negCurve = new THREE.Line(negGeometry, material);
    const posCurve = new THREE.Line(posGeometry, material);
    
    const group = new THREE.Group();
    group.add(negCurve);
    group.add(posCurve);
    
    return group;
  }
  
  /**
   * Create indicators for limits visualization
   * @param {number} x - The x-value to approach
   * @returns {THREE.Group} - Group containing the indicators
   */
  createLimitIndicators(x) {
    // This is a placeholder
    const group = new THREE.Group();
    
    // Create arrows for left and right limits
    const leftArrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const leftArrowMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const leftArrow = new THREE.Mesh(leftArrowGeometry, leftArrowMaterial);
    leftArrow.position.set(-0.5, 1 / -0.5, 0);
    leftArrow.rotation.z = -Math.PI / 4;
    
    const rightArrowGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const rightArrowMaterial = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const rightArrow = new THREE.Mesh(rightArrowGeometry, rightArrowMaterial);
    rightArrow.position.set(0.5, 1 / 0.5, 0);
    rightArrow.rotation.z = Math.PI / 4;
    
    group.add(leftArrow);
    group.add(rightArrow);
    
    return group;
  }
  
  /**
   * Create a vector field visualization
   * @returns {THREE.Group} - Group containing the vector field
   */
  createVectorField() {
    const group = new THREE.Group();
    
    // Create a grid of arrows
    for (let x = -4; x <= 4; x += 1) {
      for (let z = -4; z <= 4; z += 1) {
        // Example vector field: (x, y, z) -> (z, 1, -x)
        const origin = new THREE.Vector3(x, 0, z);
        const direction = new THREE.Vector3(z, 1, -x).normalize();
        
        const arrowLength = 0.5;
        const arrowHelper = new THREE.ArrowHelper(
          direction,
          origin,
          arrowLength,
          0x6366f1
        );
        
        group.add(arrowHelper);
      }
    }
    
    return group;
  }
  
  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  /**
   * Update the visualization based on a new function
   * @param {string} expression - New mathematical expression
   */
  updateFunction(expression) {
    this.mathExpression = expression;
    
    // Remove existing visualization
    this.removeVisualization();
    
    // Create new visualization based on type
    switch (this.options.type) {
      case 'derivatives':
        this.createDerivativeVisualization();
        break;
      case 'integrals':
        this.createIntegralVisualization();
        break;
      case 'limits':
        this.createLimitsVisualization();
        break;
      case 'vector':
        this.createVectorVisualization();
        break;
      default:
        this.createDefaultVisualization();
    }
  }
  
  /**
   * Remove current visualization from scene
   */
  removeVisualization() {
    // Remove all surfaces
    Object.values(this.surfaces).forEach(surface => {
      if (surface && this.scene.children.includes(surface)) {
        this.scene.remove(surface);
      }
    });
    
    // Remove all curves
    Object.values(this.curves).forEach(curve => {
      if (curve && this.scene.children.includes(curve)) {
        this.scene.remove(curve);
      }
    });
    
    // Clear references
    this.surfaces = {};
    this.curves = {};
  }
  
  /**
   * Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    // Update controls
    this.controls.update();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

export default VisualizationManager;