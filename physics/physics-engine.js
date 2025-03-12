/**
 * physics-engine.js
 * 
 * Core physics engine for the physics module visualizations
 * Provides shared functionality across different physics concepts
 */

class PhysicsEngine {
  constructor() {
    // Physics constants
    this.constants = {
      G: 9.80665,         // Gravitational acceleration (m/s²)
      AIR_DENSITY: 1.225, // Air density at sea level (kg/m³)
      PI: Math.PI,
      DEG_TO_RAD: Math.PI / 180,
      RAD_TO_DEG: 180 / Math.PI
    };
    
    // Vector operations
    this.vector = {
      /**
       * Add two vectors
       */
      add: (v1, v2) => {
        return {
          x: v1.x + v2.x,
          y: v1.y + v2.y,
          z: v1.z + v2.z
        };
      },
      
      /**
       * Subtract v2 from v1
       */
      subtract: (v1, v2) => {
        return {
          x: v1.x - v2.x,
          y: v1.y - v2.y,
          z: v1.z - v2.z
        };
      },
      
      /**
       * Scale vector by scalar
       */
      scale: (v, scalar) => {
        return {
          x: v.x * scalar,
          y: v.y * scalar,
          z: v.z * scalar
        };
      },
      
      /**
       * Calculate vector magnitude
       */
      magnitude: (v) => {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      },
      
      /**
       * Normalize vector (unit vector)
       */
      normalize: (v) => {
        const mag = this.vector.magnitude(v);
        if (mag === 0) return { x: 0, y: 0, z: 0 };
        
        return {
          x: v.x / mag,
          y: v.y / mag,
          z: v.z / mag
        };
      },
      
      /**
       * Dot product of two vectors
       */
      dot: (v1, v2) => {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
      },
      
      /**
       * Cross product of two vectors
       */
      cross: (v1, v2) => {
        return {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x
        };
      }
    };
  }
  
  /**
   * Calculate projectile motion with air resistance
   * 
   * @param {Object} params - Motion parameters
   * @param {number} params.initialVelocity - Initial velocity magnitude (m/s)
   * @param {number} params.angle - Launch angle in degrees
   * @param {number} params.height - Initial height (m)
   * @param {number} params.mass - Projectile mass (kg)
   * @param {number} params.dragCoefficient - Drag coefficient
   * @param {number} params.crossSectionalArea - Cross-sectional area (m²)
   * @param {number} params.timeStep - Simulation time step (s)
   * @param {number} params.maxTime - Maximum simulation time (s)
   * @param {Object} params.wind - Wind vector {x, y, z} (m/s)
   * 
   * @returns {Object} Simulation results with position, velocity, and acceleration arrays
   */
  calculateProjectileMotion(params) {
    const {
      initialVelocity,
      angle = 45,
      height = 0,
      mass = 1,
      dragCoefficient = 0,
      crossSectionalArea = 0.001,
      timeStep = 0.01,
      maxTime = 10,
      wind = { x: 0, y: 0, z: 0 }
    } = params;
    
    // Convert angle to radians
    const angleRad = angle * this.constants.DEG_TO_RAD;
    
    // Initial velocity components
    const vx0 = initialVelocity * Math.cos(angleRad);
    const vy0 = initialVelocity * Math.sin(angleRad);
    const vz0 = 0;
    
    // Initial position
    const x0 = 0;
    const y0 = height;
    const z0 = 0;
    
    // Results arrays
    const results = {
      time: [],
      position: { x: [], y: [], z: [] },
      velocity: { x: [], y: [], z: [], magnitude: [] },
      acceleration: { x: [], y: [], z: [], magnitude: [] },
      energy: { kinetic: [], potential: [], total: [] }
    };
    
    // Current state
    let t = 0;
    let x = x0;
    let y = y0;
    let z = z0;
    let vx = vx0;
    let vy = vy0;
    let vz = vz0;
    
    // Simulation loop
    while (t <= maxTime && y >= 0) {
      // Store current state
      results.time.push(t);
      results.position.x.push(x);
      results.position.y.push(y);
      results.position.z.push(z);
      results.velocity.x.push(vx);
      results.velocity.y.push(vy);
      results.velocity.z.push(vz);
      
      // Calculate velocity magnitude
      const vMag = Math.sqrt(vx * vx + vy * vy + vz * vz);
      results.velocity.magnitude.push(vMag);
      
      // Calculate acceleration
      let ax = 0;
      let ay = -this.constants.G;
      let az = 0;
      
      // Add air resistance if enabled
      if (dragCoefficient > 0) {
        // Calculate drag force
        const airDensity = this.constants.AIR_DENSITY;
        const relVx = vx - wind.x;
        const relVy = vy - wind.y;
        const relVz = vz - wind.z;
        const relVMag = Math.sqrt(relVx * relVx + relVy * relVy + relVz * relVz);
        
        // Drag force magnitude
        const dragForce = 0.5 * airDensity * dragCoefficient * crossSectionalArea * relVMag * relVMag;
        
        // Drag force components (opposite to relative velocity)
        if (relVMag > 0) {
          const dragAx = -dragForce * relVx / (mass * relVMag);
          const dragAy = -dragForce * relVy / (mass * relVMag);
          const dragAz = -dragForce * relVz / (mass * relVMag);
          
          ax += dragAx;
          ay += dragAy;
          az += dragAz;
        }
      }
      
      // Store acceleration
      results.acceleration.x.push(ax);
      results.acceleration.y.push(ay);
      results.acceleration.z.push(az);
      results.acceleration.magnitude.push(Math.sqrt(ax * ax + ay * ay + az * az));
      
      // Calculate energy
      const kineticEnergy = 0.5 * mass * vMag * vMag;
      const potentialEnergy = mass * this.constants.G * y;
      const totalEnergy = kineticEnergy + potentialEnergy;
      
      results.energy.kinetic.push(kineticEnergy);
      results.energy.potential.push(potentialEnergy);
      results.energy.total.push(totalEnergy);
      
      // Update velocity using acceleration
      vx += ax * timeStep;
      vy += ay * timeStep;
      vz += az * timeStep;
      
      // Update position using velocity
      x += vx * timeStep;
      y += vy * timeStep;
      z += vz * timeStep;
      
      // Advance time
      t += timeStep;
    }
    
    // Handle final point if projectile went below ground
    if (y < 0) {
      // Linearly interpolate to find exact ground impact
      const tPrev = t - timeStep;
      const yPrev = results.position.y[results.position.y.length - 1];
      
      // Time fraction from previous point to ground impact
      const frac = yPrev / (yPrev - y);
      const tGround = tPrev + frac * timeStep;
      
      // Final position at ground impact
      const xGround = results.position.x[results.position.x.length - 1] + 
                      frac * (x - results.position.x[results.position.x.length - 1]);
      const zGround = results.position.z[results.position.z.length - 1] + 
                     frac * (z - results.position.z[results.position.z.length - 1]);
      
      // Update the last point to be exactly at ground level
      results.time.push(tGround);
      results.position.x.push(xGround);
      results.position.y.push(0); // Ground level
      results.position.z.push(zGround);
      
      // Final velocity components
      const vxGround = results.velocity.x[results.velocity.x.length - 1] + 
                      frac * (vx - results.velocity.x[results.velocity.x.length - 1]);
      const vyGround = results.velocity.y[results.velocity.y.length - 1] + 
                      frac * (vy - results.velocity.y[results.velocity.y.length - 1]);
      const vzGround = results.velocity.z[results.velocity.z.length - 1] + 
                      frac * (vz - results.velocity.z[results.velocity.z.length - 1]);
      
      results.velocity.x.push(vxGround);
      results.velocity.y.push(vyGround);
      results.velocity.z.push(vzGround);
      results.velocity.magnitude.push(Math.sqrt(vxGround * vxGround + vyGround * vyGround + vzGround * vzGround));
      
      // Final acceleration components
      results.acceleration.x.push(results.acceleration.x[results.acceleration.x.length - 1]);
      results.acceleration.y.push(results.acceleration.y[results.acceleration.y.length - 1]);
      results.acceleration.z.push(results.acceleration.z[results.acceleration.z.length - 1]);
      results.acceleration.magnitude.push(results.acceleration.magnitude[results.acceleration.magnitude.length - 1]);
      
      // Final energy values (at ground level, potential energy is 0)
      const finalKineticEnergy = 0.5 * mass * results.velocity.magnitude[results.velocity.magnitude.length - 1] * results.velocity.magnitude[results.velocity.magnitude.length - 1];
      results.energy.kinetic.push(finalKineticEnergy);
      results.energy.potential.push(0);
      results.energy.total.push(finalKineticEnergy);
    }
    
    // Calculate additional metrics
    const metrics = this.calculateProjectileMetrics(results);
    
    return {
      ...results,
      metrics
    };
  }
  
  /**
   * Calculate key metrics for projectile motion
   */
  calculateProjectileMetrics(results) {
    const metrics = {};
    
    // Range (maximum horizontal distance)
    metrics.range = Math.max(...results.position.x);
    
    // Maximum height
    metrics.maxHeight = Math.max(...results.position.y);
    
    // Time of flight
    metrics.timeOfFlight = results.time[results.time.length - 1];
    
    // Find index of maximum height
    const maxHeightIndex = results.position.y.indexOf(metrics.maxHeight);
    
    // Time to apex
    metrics.timeToApex = results.time[maxHeightIndex];
    
    // Impact velocity
    const finalIndex = results.velocity.magnitude.length - 1;
    metrics.impactVelocity = results.velocity.magnitude[finalIndex];
    metrics.impactAngle = Math.atan2(results.velocity.y[finalIndex], results.velocity.x[finalIndex]) * this.constants.RAD_TO_DEG;
    
    return metrics;
  }
  
  /**
   * Calculate analytical solution for projectile motion (without air resistance)
   * 
   * @param {Object} params - Motion parameters
   * @returns {Object} Analytical solution formulas and key metrics
   */
  getProjectileAnalyticalSolution(params) {
    const {
      initialVelocity,
      angle = 45,
      height = 0
    } = params;
    
    // Convert angle to radians
    const angleRad = angle * this.constants.DEG_TO_RAD;
    const g = this.constants.G;
    const v0 = initialVelocity;
    const v0x = v0 * Math.cos(angleRad);
    const v0y = v0 * Math.sin(angleRad);
    
    // Calculate key metrics
    const timeOfFlight = (v0y + Math.sqrt(v0y * v0y + 2 * g * height)) / g;
    const range = v0x * timeOfFlight;
    const maxHeight = height + (v0y * v0y) / (2 * g);
    const timeToApex = v0y / g;
    
    // Formulas as text for display
    const formulas = {
      position: {
        x: `x(t) = ${v0x.toFixed(2)} · t`,
        y: `y(t) = ${height} + ${v0y.toFixed(2)} · t - ${(g/2).toFixed(2)} · t²`
      },
      velocity: {
        x: `vx(t) = ${v0x.toFixed(2)}`,
        y: `vy(t) = ${v0y.toFixed(2)} - ${g.toFixed(2)} · t`
      },
      acceleration: {
        x: 'ax(t) = 0',
        y: `ay(t) = -${g.toFixed(2)}`
      },
      range: `R = ${range.toFixed(2)} m = (v₀² · sin(2θ)) / g`,
      maxHeight: `H = ${maxHeight.toFixed(2)} m = (v₀² · sin²θ) / (2g)`,
      timeOfFlight: `T = ${timeOfFlight.toFixed(2)} s = (2 · v₀ · sinθ) / g`
    };
    
    return {
      formulas,
      metrics: {
        range,
        maxHeight,
        timeOfFlight,
        timeToApex
      }
    };
  }
  
  /**
   * Calculate harmonic motion
   * 
   * @param {Object} params - Motion parameters
   * @returns {Object} Simulation results
   */
  calculateHarmonicMotion(params) {
    // Implementation for harmonic motion - will be expanded in future
    return {};
  }
  
  /**
   * Calculate circular motion
   * 
   * @param {Object} params - Motion parameters
   * @returns {Object} Simulation results
   */
  calculateCircularMotion(params) {
    // Implementation for circular motion - will be expanded in future
    return {};
  }
  
  /**
   * Calculate fluid flow
   * 
   * @param {Object} params - Flow parameters
   * @returns {Object} Simulation results
   */
  calculateFluidFlow(params) {
    // Implementation for fluid flow - will be expanded in future
    return {};
  }
}

// Create a global instance if in browser context
if (typeof window !== 'undefined') {
  window.physicsEngine = new PhysicsEngine();
}