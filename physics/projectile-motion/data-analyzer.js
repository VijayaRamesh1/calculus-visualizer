/**
 * DataAnalyzer.js
 * 
 * Analyzes and visualizes flight data from projectile motion simulation
 * Shows position, velocity, acceleration, and energy graphs
 */

class DataAnalyzer {
  constructor(containerId) {
    console.log('[DataAnalyzer] Initializing with container:', containerId);
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('[DataAnalyzer] Container not found:', containerId);
    }
    this.data = null;
    this.chart = null;
    this.currentGraph = 'position';
    
    // Connect graph selector buttons
    this.setupGraphSelectors();
  }
  
  /**
   * Setup event listeners for graph selector buttons
   */
  setupGraphSelectors() {
    const graphButtons = document.querySelectorAll('.graph-btn');
    
    console.log('[DataAnalyzer] Found graph buttons:', graphButtons.length);
    
    graphButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('[DataAnalyzer] Button clicked:', button.dataset.graph);
        // Update active button
        graphButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update current graph
        this.currentGraph = button.dataset.graph;
        
        // Refresh graph
        if (this.data) {
          this.renderGraph();
        } else {
          console.warn('[DataAnalyzer] No data available for graph rendering');
        }
      });
    });
  }
  
  /**
   * Update data and refresh graph
   */
  updateData(flightData) {
    console.log('[DataAnalyzer] Updating data');
    if (!flightData) {
      console.warn('[DataAnalyzer] No data provided to updateData');
      return;
    }
    
    // Validate data structure
    if (!this.validateData(flightData)) {
      console.error('[DataAnalyzer] Invalid data structure provided');
      return;
    }
    
    this.data = flightData;
    this.renderGraph();
  }
  
  /**
   * Validate data structure
   */
  validateData(data) {
    try {
      if (!data.time || !Array.isArray(data.time) || data.time.length === 0) {
        console.error('[DataAnalyzer] Missing or invalid time array');
        return false;
      }
      
      if (!data.position || !data.position.x || !data.position.y) {
        console.error('[DataAnalyzer] Missing position data');
        return false;
      }
      
      if (!data.velocity || !data.velocity.x || !data.velocity.y) {
        console.error('[DataAnalyzer] Missing velocity data');
        return false;
      }
      
      if (!data.acceleration || !data.acceleration.x || !data.acceleration.y) {
        console.error('[DataAnalyzer] Missing acceleration data');
        return false;
      }
      
      if (!data.energy || !data.energy.kinetic || !data.energy.potential || !data.energy.total) {
        console.error('[DataAnalyzer] Missing energy data');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[DataAnalyzer] Error validating data:', error);
      return false;
    }
  }
  
  /**
   * Render current graph type
   */
  renderGraph() {
    console.log('[DataAnalyzer] Rendering graph:', this.currentGraph);
    
    if (!this.data) {
      console.warn('[DataAnalyzer] No data available for rendering');
      return;
    }
    
    if (!this.container) {
      console.error('[DataAnalyzer] Container not available for rendering');
      return;
    }
    
    // Destroy existing chart if it exists
    if (this.chart) {
      console.log('[DataAnalyzer] Destroying existing chart');
      try {
        this.chart.destroy();
      } catch (error) {
        console.warn('[DataAnalyzer] Error destroying chart:', error);
      }
    }
    
    // Create appropriate graph based on selection
    try {
      switch (this.currentGraph) {
        case 'position':
          this.createPositionGraph();
          break;
        case 'velocity':
          this.createVelocityGraph();
          break;
        case 'acceleration':
          this.createAccelerationGraph();
          break;
        case 'energy':
          this.createEnergyGraph();
          break;
        default:
          console.error('[DataAnalyzer] Unknown graph type:', this.currentGraph);
      }
    } catch (error) {
      console.error('[DataAnalyzer] Error rendering graph:', error);
    }
  }
  
  /**
   * Create position vs. time graph
   */
  createPositionGraph() {
    console.log('[DataAnalyzer] Creating position graph');
    const ctx = this.getChartContext();
    if (!ctx) {
      console.error('[DataAnalyzer] Could not get chart context for position graph');
      return;
    }
    
    try {
      // Check if Chart is available
      if (typeof Chart === 'undefined') {
        console.error('[DataAnalyzer] Chart.js is not loaded');
        return;
      }
      
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.time.map(t => t.toFixed(1)),
          datasets: [
            {
              label: 'x position (m)',
              data: this.data.position.x,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'y position (m)',
              data: this.data.position.y,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 0, 110, 0.1)',
              tension: 0.4,
              pointRadius: 0
            }
          ]
        },
        options: this.getChartOptions('Position vs. Time', 'Time (s)', 'Position (m)')
      });
      
      // Update insight text for position graph
      this.updateInsightText('The parabolic shape of the y position graph is the result of constant acceleration due to gravity. The first derivative of position gives velocity, and the second derivative gives acceleration.');
      
      console.log('[DataAnalyzer] Position graph created successfully');
    } catch (error) {
      console.error('[DataAnalyzer] Error creating position graph:', error);
    }
  }
  
  /**
   * Create velocity vs. time graph
   */
  createVelocityGraph() {
    console.log('[DataAnalyzer] Creating velocity graph');
    const ctx = this.getChartContext();
    if (!ctx) {
      console.error('[DataAnalyzer] Could not get chart context for velocity graph');
      return;
    }
    
    try {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.time.map(t => t.toFixed(1)),
          datasets: [
            {
              label: 'vx (m/s)',
              data: this.data.velocity.x,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'vy (m/s)',
              data: this.data.velocity.y,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 0, 110, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Magnitude (m/s)',
              data: this.data.velocity.magnitude,
              borderColor: '#fb5607',
              backgroundColor: 'rgba(251, 86, 7, 0.1)',
              tension: 0.4,
              pointRadius: 0,
              borderDash: [5, 5]
            }
          ]
        },
        options: this.getChartOptions('Velocity vs. Time', 'Time (s)', 'Velocity (m/s)')
      });
      
      // Update insight text for velocity graph
      this.updateInsightText('The horizontal velocity (vx) is constant without air resistance. The vertical velocity (vy) decreases linearly due to constant acceleration of gravity. The slope of this line is -g = -9.8 m/s².');
      
      console.log('[DataAnalyzer] Velocity graph created successfully');
    } catch (error) {
      console.error('[DataAnalyzer] Error creating velocity graph:', error);
    }
  }
  
  /**
   * Create acceleration vs. time graph
   */
  createAccelerationGraph() {
    console.log('[DataAnalyzer] Creating acceleration graph');
    const ctx = this.getChartContext();
    if (!ctx) {
      console.error('[DataAnalyzer] Could not get chart context for acceleration graph');
      return;
    }
    
    try {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.time.map(t => t.toFixed(1)),
          datasets: [
            {
              label: 'ax (m/s²)',
              data: this.data.acceleration.x,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'ay (m/s²)',
              data: this.data.acceleration.y,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 0, 110, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Magnitude (m/s²)',
              data: this.data.acceleration.magnitude,
              borderColor: '#fb5607',
              backgroundColor: 'rgba(251, 86, 7, 0.1)',
              tension: 0.4,
              pointRadius: 0,
              borderDash: [5, 5]
            }
          ]
        },
        options: this.getChartOptions('Acceleration vs. Time', 'Time (s)', 'Acceleration (m/s²)')
      });
      
      // Update insight text for acceleration graph
      this.updateInsightText('The horizontal acceleration (ax) is zero without air resistance. The vertical acceleration (ay) is constant at -9.8 m/s² due to gravity. This constant acceleration is what defines projectile motion.');
      
      console.log('[DataAnalyzer] Acceleration graph created successfully');
    } catch (error) {
      console.error('[DataAnalyzer] Error creating acceleration graph:', error);
    }
  }
  
  /**
   * Create energy vs. time graph
   */
  createEnergyGraph() {
    console.log('[DataAnalyzer] Creating energy graph');
    const ctx = this.getChartContext();
    if (!ctx) {
      console.error('[DataAnalyzer] Could not get chart context for energy graph');
      return;
    }
    
    try {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.data.time.map(t => t.toFixed(1)),
          datasets: [
            {
              label: 'Kinetic Energy (J)',
              data: this.data.energy.kinetic,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 0, 110, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Potential Energy (J)',
              data: this.data.energy.potential,
              borderColor: '#06d6a0',
              backgroundColor: 'rgba(6, 214, 160, 0.1)',
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Total Energy (J)',
              data: this.data.energy.total,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              tension: 0.4,
              pointRadius: 0,
              borderDash: [5, 5]
            }
          ]
        },
        options: this.getChartOptions('Energy vs. Time', 'Time (s)', 'Energy (J)')
      });
      
      // Update insight text for energy graph
      this.updateInsightText('Without air resistance, total energy remains constant (conservation of energy). Kinetic energy decreases as the arrow rises (velocity decreases) while potential energy increases. At the peak, KE is minimum and PE is maximum.');
      
      console.log('[DataAnalyzer] Energy graph created successfully');
    } catch (error) {
      console.error('[DataAnalyzer] Error creating energy graph:', error);
    }
  }
  
  /**
   * Get chart context
   */
  getChartContext() {
    // Check if container exists
    if (!this.container) {
      console.error('[DataAnalyzer] Container not available for chart context');
      return null;
    }
    
    // Check if canvas already exists in container
    let canvas = this.container.querySelector('canvas');
    console.log('[DataAnalyzer] Canvas found in container:', !!canvas);
    
    // Create canvas if it doesn't exist
    if (!canvas) {
      console.log('[DataAnalyzer] Creating new canvas');
      canvas = document.createElement('canvas');
      this.container.appendChild(canvas);
    }
    
    try {
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('[DataAnalyzer] Failed to get 2D context from canvas');
      }
      return context;
    } catch (error) {
      console.error('[DataAnalyzer] Error getting canvas context:', error);
      return null;
    }
  }
  
  /**
   * Get standard chart options
   */
  getChartOptions(title, xLabel, yLabel) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xLabel,
            font: {
              weight: 'bold'
            },
            padding: {
              top: 10
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          title: {
            display: true,
            text: yLabel,
            font: {
              weight: 'bold'
            },
            padding: {
              bottom: 10
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      animation: {
        duration: 500
      }
    };
  }
  
  /**
   * Update insight text beneath graph
   */
  updateInsightText(text) {
    const insightElement = document.querySelector('.data-insight p');
    console.log('[DataAnalyzer] Insight element found:', !!insightElement);
    if (insightElement) {
      insightElement.innerHTML = text;
    } else {
      console.warn('[DataAnalyzer] Could not find .data-insight p element');
    }
  }
}