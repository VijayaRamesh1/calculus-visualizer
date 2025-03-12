/**
 * Simple Data Analyzer
 * Minimal implementation with direct rendering approach
 */

class SimpleAnalyzer {
  constructor(containerId) {
    console.log('SimpleAnalyzer: Initializing with container', containerId);
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('SimpleAnalyzer: Container not found', containerId);
      return;
    }
    
    this.chart = null;
    this.data = this.generateDefaultData();
    this.currentGraph = 'position';
    
    // Set up event listeners
    this.setupButtons();
    
    // Initial render
    this.renderCurrentGraph();
    
    console.log('SimpleAnalyzer: Initialization complete');
  }
  
  // Generate sample data for initial display
  generateDefaultData() {
    console.log('SimpleAnalyzer: Generating default data');
    const data = {
      time: [],
      position: { x: [], y: [] },
      velocity: { x: [], y: [], magnitude: [] },
      acceleration: { x: [], y: [], magnitude: [] },
      energy: { kinetic: [], potential: [], total: [] }
    };
    
    for (let i = 0; i < 50; i++) {
      const t = i / 10;
      data.time.push(t);
      
      // Basic parabolic motion
      data.position.x.push(5 * t);
      data.position.y.push(10 * t - 4.9 * t * t);
      
      data.velocity.x.push(5);
      data.velocity.y.push(10 - 9.8 * t);
      data.velocity.magnitude.push(Math.sqrt(25 + Math.pow(10 - 9.8 * t, 2)));
      
      data.acceleration.x.push(0);
      data.acceleration.y.push(-9.8);
      data.acceleration.magnitude.push(9.8);
      
      data.energy.kinetic.push(25 + Math.pow(10 - 9.8 * t, 2));
      data.energy.potential.push(9.8 * (10 * t - 4.9 * t * t));
      data.energy.total.push(25 + Math.pow(10 - 9.8 * t, 2) + 9.8 * (10 * t - 4.9 * t * t));
    }
    
    return data;
  }
  
  // Set up graph selector buttons
  setupButtons() {
    console.log('SimpleAnalyzer: Setting up buttons');
    const buttons = document.querySelectorAll('.graph-btn');
    
    if (buttons.length === 0) {
      console.error('SimpleAnalyzer: No graph buttons found');
      return;
    }
    
    console.log('SimpleAnalyzer: Found', buttons.length, 'buttons');
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        console.log('SimpleAnalyzer: Button clicked', button.dataset.graph);
        
        // Update active button
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update graph type
        this.currentGraph = button.dataset.graph;
        
        // Render the new graph
        this.renderCurrentGraph();
      });
    });
  }
  
  // Update data from external source
  updateData(data) {
    console.log('SimpleAnalyzer: Updating data');
    if (!data) {
      console.warn('SimpleAnalyzer: Invalid data provided');
      return;
    }
    this.data = data;
    this.renderCurrentGraph();
  }
  
  // Render the current graph type
  renderCurrentGraph() {
    console.log('SimpleAnalyzer: Rendering graph', this.currentGraph);
    
    if (!this.container) {
      console.error('SimpleAnalyzer: Container not available');
      return;
    }
    
    try {
      // Get canvas
      let canvas = this.container.querySelector('canvas');
      if (!canvas) {
        console.log('SimpleAnalyzer: Creating new canvas');
        canvas = document.createElement('canvas');
        this.container.appendChild(canvas);
      }
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('SimpleAnalyzer: Could not get canvas context');
        return;
      }
      
      // Clear existing chart
      if (this.chart) {
        this.chart.destroy();
      }
      
      // Render based on type
      switch (this.currentGraph) {
        case 'position':
          this.renderPositionGraph(ctx);
          break;
        case 'velocity':
          this.renderVelocityGraph(ctx);
          break;
        case 'acceleration':
          this.renderAccelerationGraph(ctx);
          break;
        case 'energy':
          this.renderEnergyGraph(ctx);
          break;
        default:
          console.error('SimpleAnalyzer: Unknown graph type', this.currentGraph);
      }
    } catch (error) {
      console.error('SimpleAnalyzer: Error rendering graph', error);
    }
  }
  
  // Position graph
  renderPositionGraph(ctx) {
    console.log('SimpleAnalyzer: Rendering position graph');
    
    try {
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
      
      this.updateInsightText('The parabolic shape of the y position graph is the result of constant acceleration due to gravity. The first derivative of position gives velocity, and the second derivative gives acceleration.');
    } catch (error) {
      console.error('SimpleAnalyzer: Error creating position graph', error);
    }
  }
  
  // Velocity graph
  renderVelocityGraph(ctx) {
    console.log('SimpleAnalyzer: Rendering velocity graph');
    
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
      
      this.updateInsightText('The horizontal velocity (vx) is constant without air resistance. The vertical velocity (vy) decreases linearly due to constant acceleration of gravity. The slope of this line is -g = -9.8 m/s².');
    } catch (error) {
      console.error('SimpleAnalyzer: Error creating velocity graph', error);
    }
  }
  
  // Acceleration graph
  renderAccelerationGraph(ctx) {
    console.log('SimpleAnalyzer: Rendering acceleration graph');
    
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
      
      this.updateInsightText('The horizontal acceleration (ax) is zero without air resistance. The vertical acceleration (ay) is constant at -9.8 m/s² due to gravity. This constant acceleration is what defines projectile motion.');
    } catch (error) {
      console.error('SimpleAnalyzer: Error creating acceleration graph', error);
    }
  }
  
  // Energy graph
  renderEnergyGraph(ctx) {
    console.log('SimpleAnalyzer: Rendering energy graph');
    
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
      
      this.updateInsightText('Without air resistance, total energy remains constant (conservation of energy). Kinetic energy decreases as the arrow rises (velocity decreases) while potential energy increases. At the peak, KE is minimum and PE is maximum.');
    } catch (error) {
      console.error('SimpleAnalyzer: Error creating energy graph', error);
    }
  }
  
  // Chart options
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
  
  // Update insight text
  updateInsightText(text) {
    const insightElement = document.querySelector('.data-insight p');
    if (insightElement) {
      insightElement.innerHTML = text;
    } else {
      console.warn('SimpleAnalyzer: Insight element not found');
    }
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('SimpleAnalyzer: DOM loaded, auto-initializing');
  
  // Check for Chart.js
  if (typeof Chart === 'undefined') {
    console.error('SimpleAnalyzer: Chart.js is not loaded');
    return;
  }
  
  // Check for container
  const container = document.getElementById('data-graph');
  if (!container) {
    console.error('SimpleAnalyzer: Container not found');
    return;
  }
  
  // Initialize
  window.dataAnalyzer = new SimpleAnalyzer('data-graph');
  
  // Make available globally for debugging
  console.log('SimpleAnalyzer: Global instance created as window.dataAnalyzer');
});