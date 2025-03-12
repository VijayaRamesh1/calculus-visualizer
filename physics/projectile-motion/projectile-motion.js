/**
 * ProjectileMotionSimulator.js
 * 
 * 3D simulation of projectile motion with an archery focus
 */

class ProjectileMotionSimulator {
  constructor(canvasId) {
    console.log('[ProjectileMotionSimulator] Initializing with canvas:', canvasId);
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.dataAnalyzer = null;
    this.simulationData = this.generateDefaultData();
    
    if (!this.canvas) {
      console.error('[ProjectileMotionSimulator] Canvas element not found:', canvasId);
      return;
    }
    
    // Initialize 3D scene here
    this.initScene();
    
    // Set up event listeners for controls
    this.setupEventListeners();
    
    console.log('[ProjectileMotionSimulator] Initialization complete');
  }
  
  /**
   * Initialize the 3D scene
   */
  initScene() {
    try {
      console.log('[ProjectileMotionSimulator] Initializing 3D scene');
      
      // Three.js setup
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
      
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setClearColor(0xf0f0f0);
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);
      
      // Set camera position
      this.camera.position.set(0, 5, 20);
      this.camera.lookAt(0, 0, 0);
      
      // Add ground plane
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x7cba92 });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.5;
      this.scene.add(ground);
      
      // Add archer and target
      this.addArcher();
      this.addTarget();
      
      // Start animation loop
      this.animate();
      
      console.log('[ProjectileMotionSimulator] 3D scene initialized successfully');
    } catch (error) {
      console.error('[ProjectileMotionSimulator] Error initializing 3D scene:', error);
    }
  }
  
  /**
   * Add archer to the scene
   */
  addArcher() {
    try {
      console.log('[ProjectileMotionSimulator] Adding archer');
      
      // Simple placeholder for archer
      const archerGeometry = new THREE.BoxGeometry(1, 2, 1);
      const archerMaterial = new THREE.MeshStandardMaterial({ color: 0x3366ff });
      this.archer = new THREE.Mesh(archerGeometry, archerMaterial);
      this.archer.position.set(-10, 0.5, 0);
      this.scene.add(this.archer);
    } catch (error) {
      console.error('[ProjectileMotionSimulator] Error adding archer:', error);
    }
  }
  
  /**
   * Add target to the scene
   */
  addTarget() {
    try {
      console.log('[ProjectileMotionSimulator] Adding target');
      
      // Simple placeholder for target
      const targetGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32);
      const targetMaterial = new THREE.MeshStandardMaterial({ color: 0xff3366 });
      this.target = new THREE.Mesh(targetGeometry, targetMaterial);
      this.target.position.set(10, 0.6, 0);
      this.target.rotation.x = Math.PI / 2;
      this.scene.add(this.target);
    } catch (error) {
      console.error('[ProjectileMotionSimulator] Error adding target:', error);
    }
  }
  
  /**
   * Animation loop
   */
  animate() {
    try {
      requestAnimationFrame(() => this.animate());
      this.renderer.render(this.scene, this.camera);
    } catch (error) {
      console.error('[ProjectileMotionSimulator] Error in animation loop:', error);
    }
  }
  
  /**
   * Set up event listeners for controls
   */
  setupEventListeners() {
    try {
      console.log('[ProjectileMotionSimulator] Setting up event listeners');
      
      // Find control buttons
      const fireButton = document.getElementById('fire-arrow');
      const resetButton = document.getElementById('reset-shot');
      const toggleViewButton = document.getElementById('toggle-view');
      const playPauseButton = document.getElementById('play-pause');
      
      // Fire arrow button
      if (fireButton) {
        fireButton.addEventListener('click', () => {
          console.log('[ProjectileMotionSimulator] Fire arrow button clicked');
          this.fireArrow();
        });
      }
      
      // Reset button
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          console.log('[ProjectileMotionSimulator] Reset button clicked');
          this.resetSimulation();
        });
      }
      
      // Toggle view button
      if (toggleViewButton) {
        toggleViewButton.addEventListener('click', () => {
          console.log('[ProjectileMotionSimulator] Toggle view button clicked');
          this.toggleView();
        });
      }
      
      // Play/pause button
      if (playPauseButton) {
        playPauseButton.addEventListener('click', () => {
          console.log('[ProjectileMotionSimulator] Play/pause button clicked');
          this.togglePlayPause();
        });
      }
      
      // Parameter sliders
      const drawStrengthSlider = document.getElementById('draw-strength');
      const launchAngleSlider = document.getElementById('launch-angle');
      const arrowWeightSlider = document.getElementById('arrow-weight');
      
      if (drawStrengthSlider) {
        drawStrengthSlider.addEventListener('input', () => {
          this.updateParameters();
        });
      }
      
      if (launchAngleSlider) {
        launchAngleSlider.addEventListener('input', () => {
          this.updateParameters();
        });
      }
      
      if (arrowWeightSlider) {
        arrowWeightSlider.addEventListener('input', () => {
          this.updateParameters();
        });
      }
      
      // Send data to analyzer immediately
      this.updateAnalyzerWithCurrentData();
      
      console.log('[ProjectileMotionSimulator] Event listeners set up successfully');
    } catch (error) {
      console.error('[ProjectileMotionSimulator] Error setting up event listeners:', error);
    }
  }
  
  /**
   * Fire arrow simulation
   */
  fireArrow() {
    console.log('[ProjectileMotionSimulator] Firing arrow');
    
    // Generate new simulation data based on current parameters
    this.simulationData = this.generateSimulationData();
    
    // Update data analyzer
    this.updateAnalyzerWithCurrentData();
  }
  
  /**
   * Reset simulation
   */
  resetSimulation() {
    console.log('[ProjectileMotionSimulator] Resetting simulation');
    
    // Reset to default data
    this.simulationData = this.generateDefaultData();
    
    // Update data analyzer
    this.updateAnalyzerWithCurrentData();
  }
  
  /**
   * Toggle camera view
   */
  toggleView() {
    console.log('[ProjectileMotionSimulator] Toggling view');
    
    // Toggle between different views (archer, target, overhead)
    const views = [
      { position: [0, 5, 20], lookAt: [0, 0, 0] }, // Default
      { position: [-12, 2, 0], lookAt: [10, 0, 0] }, // Archer view
      { position: [12, 2, 0], lookAt: [-10, 0, 0] }, // Target view
      { position: [0, 20, 0], lookAt: [0, 0, 0] }  // Overhead view
    ];
    
    // Cycle through views
    this.currentViewIndex = (this.currentViewIndex + 1) % views.length || 0;
    const view = views[this.currentViewIndex];
    
    this.camera.position.set(...view.position);
    this.camera.lookAt(...view.lookAt);
  }
  
  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    console.log('[ProjectileMotionSimulator] Toggling play/pause');
    this.playing = !this.playing;
  }
  
  /**
   * Update simulation parameters from UI
   */
  updateParameters() {
    console.log('[ProjectileMotionSimulator] Updating parameters');
    
    // Get values from sliders
    const drawStrengthSlider = document.getElementById('draw-strength');
    const launchAngleSlider = document.getElementById('launch-angle');
    const arrowWeightSlider = document.getElementById('arrow-weight');
    
    if (drawStrengthSlider) {
      this.drawStrength = parseFloat(drawStrengthSlider.value);
      const valueDisplay = drawStrengthSlider.nextElementSibling;
      if (valueDisplay) {
        valueDisplay.textContent = `${this.drawStrength} lbs`;
      }
    }
    
    if (launchAngleSlider) {
      this.launchAngle = parseFloat(launchAngleSlider.value);
      const valueDisplay = launchAngleSlider.nextElementSibling;
      if (valueDisplay) {
        valueDisplay.textContent = `${this.launchAngle}°`;
      }
    }
    
    if (arrowWeightSlider) {
      this.arrowWeight = parseFloat(arrowWeightSlider.value);
      const valueDisplay = arrowWeightSlider.nextElementSibling;
      if (valueDisplay) {
        valueDisplay.textContent = `${this.arrowWeight} grain`;
      }
    }
  }
  
  /**
   * Connect data analyzer
   */
  setDataAnalyzer(analyzer) {
    console.log('[ProjectileMotionSimulator] Setting data analyzer');
    this.dataAnalyzer = analyzer;
    
    // Send initial data to analyzer
    this.updateAnalyzerWithCurrentData();
  }
  
  /**
   * Update analyzer with current data
   */
  updateAnalyzerWithCurrentData() {
    console.log('[ProjectileMotionSimulator] Updating analyzer with current data');
    if (this.dataAnalyzer) {
      this.dataAnalyzer.updateData(this.simulationData);
    } else {
      console.warn('[ProjectileMotionSimulator] Data analyzer not connected');
    }
  }
  
  /**
   * Generate default simulation data
   */
  generateDefaultData() {
    console.log('[ProjectileMotionSimulator] Generating default data');
    
    return this.generateSimulationData();
  }
  
  /**
   * Generate simulation data based on current parameters
   */
  generateSimulationData() {
    try {
      console.log('[ProjectileMotionSimulator] Generating simulation data');
      
      // Default parameters if not set
      const drawStrength = this.drawStrength || 40; // lbs
      const launchAngle = this.launchAngle || 45; // degrees
      const arrowWeight = this.arrowWeight || 400; // grain
      
      // Convert to SI units
      const angleRad = launchAngle * Math.PI / 180;
      
      // Calculate initial velocity based on draw strength and arrow weight
      // Simple model: v0 = k * sqrt(drawStrength / arrowWeight)
      const k = 30; // Scaling factor
      const v0 = k * Math.sqrt(drawStrength / (arrowWeight / 400));
      
      // Gravity
      const g = 9.8; // m/s²
      
      // Generate trajectory data
      const timePoints = 100;
      const maxTime = 5;
      
      const time = [];
      const posX = [];
      const posY = [];
      const velX = [];
      const velY = [];
      const accX = [];
      const accY = [];
      const kinetic = [];
      const potential = [];
      const total = [];
      
      for (let i = 0; i < timePoints; i++) {
        const t = (i / (timePoints - 1)) * maxTime;
        
        // Position
        const x = v0 * Math.cos(angleRad) * t;
        const y = v0 * Math.sin(angleRad) * t - 0.5 * g * t * t;
        
        // Make sure we don't go below ground
        const adjustedY = Math.max(0, y);
        
        // Velocity
        const vx = v0 * Math.cos(angleRad);
        const vy = v0 * Math.sin(angleRad) - g * t;
        
        // Acceleration
        const ax = 0;
        const ay = -g;
        
        // Energy (assume mass = arrowWeight/400 kg for simplicity)
        const mass = arrowWeight / 400;
        const ke = 0.5 * mass * (vx * vx + vy * vy);
        const pe = mass * g * adjustedY;
        
        time.push(t);
        posX.push(x);
        posY.push(adjustedY);
        velX.push(vx);
        velY.push(vy);
        accX.push(ax);
        accY.push(ay);
        kinetic.push(ke);
        potential.push(pe);
        total.push(ke + pe);
      }
      
      // Package data
      return {
        time: time,
        position: {
          x: posX,
          y: posY
        },
        velocity: {
          x: velX,
          y: velY,
          magnitude: velX.map((vx, i) => Math.sqrt(vx * vx + velY[i] * velY[i]))
        },
        acceleration: {
          x: accX,
          y: accY,
          magnitude: accX.map((ax, i) => Math.sqrt(ax * ax + accY[i] * accY[i]))
        },
        energy: {
          kinetic: kinetic,
          potential: potential,
          total: total
        }
      };
    } catch (error) {
      console.error('[ProjectileMotionSimulator] Error generating simulation data:', error);
      return this.createEmptyDataSet();
    }
  }
  
  /**
   * Create empty data set as fallback
   */
  createEmptyDataSet() {
    console.warn('[ProjectileMotionSimulator] Creating empty dataset as fallback');
    
    // Create minimal dataset with zeros
    const emptyArray = Array(10).fill(0);
    
    return {
      time: emptyArray,
      position: {
        x: emptyArray,
        y: emptyArray
      },
      velocity: {
        x: emptyArray,
        y: emptyArray,
        magnitude: emptyArray
      },
      acceleration: {
        x: emptyArray,
        y: emptyArray,
        magnitude: emptyArray
      },
      energy: {
        kinetic: emptyArray,
        potential: emptyArray,
        total: emptyArray
      }
    };
  }
}