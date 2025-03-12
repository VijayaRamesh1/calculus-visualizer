/**
 * Debug script to diagnose visualization issues
 */

// Execute this after the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== VISUALIZATION DEBUG SCRIPT ===');
  
  // Check if the required elements exist
  const vizCanvas = document.getElementById('visualization-canvas');
  console.log('3D Canvas element exists:', !!vizCanvas);
  
  const dataGraphContainer = document.getElementById('data-graph');
  console.log('Data graph container exists:', !!dataGraphContainer);
  
  // Check if Chart.js is loaded
  console.log('Chart.js is loaded:', typeof Chart !== 'undefined');
  
  // Check if Three.js is loaded
  console.log('Three.js is loaded:', typeof THREE !== 'undefined');
  
  // Check if graph buttons exist
  const graphButtons = document.querySelectorAll('.graph-btn');
  console.log('Graph buttons count:', graphButtons.length);
  graphButtons.forEach(btn => {
    console.log('Graph button:', btn.dataset.graph);
  });
  
  // Check if there's any canvas in the data-graph container
  if (dataGraphContainer) {
    const canvas = dataGraphContainer.querySelector('canvas');
    console.log('Canvas in data-graph container exists:', !!canvas);
    
    // Try to manually create a canvas and chart if none exists
    if (!canvas) {
      try {
        console.log('Attempting to manually create a canvas and chart');
        const newCanvas = document.createElement('canvas');
        dataGraphContainer.appendChild(newCanvas);
        
        if (typeof Chart !== 'undefined') {
          const ctx = newCanvas.getContext('2d');
          if (ctx) {
            // Create a simple chart
            const chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: [0, 1, 2, 3, 4, 5],
                datasets: [{
                  label: 'Debug Data',
                  data: [0, 1, 4, 9, 16, 25],
                  borderColor: 'blue',
                  backgroundColor: 'rgba(0, 0, 255, 0.1)'
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
            console.log('Debug chart created successfully');
          } else {
            console.error('Failed to get 2D context from canvas');
          }
        } else {
          console.error('Chart.js is not available for creating debug chart');
        }
      } catch (error) {
        console.error('Error creating debug chart:', error);
      }
    }
  }
  
  // Force direct initialization of the visualization
  console.log('Attempting to directly initialize data analyzer');
  try {
    // Create minimal data set
    const sampleData = createSampleData();
    
    // Direct rendering attempt
    renderToCanvas(sampleData);
  } catch (error) {
    console.error('Error in direct initialization:', error);
  }
  
  /**
   * Create sample data for testing
   */
  function createSampleData() {
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
  
  /**
   * Directly render to canvas
   */
  function renderToCanvas(data) {
    const graphContainer = document.getElementById('data-graph');
    if (!graphContainer) {
      console.error('Graph container not found');
      return;
    }
    
    // Create canvas if it doesn't exist
    let canvas = graphContainer.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '300px';
      graphContainer.appendChild(canvas);
      console.log('Created new canvas for direct rendering');
    }
    
    // Ensure Chart.js is available
    if (typeof Chart === 'undefined') {
      console.error('Chart.js is not available for direct rendering');
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get 2D context from canvas');
      return;
    }
    
    // Create a chart
    try {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.time.map(t => t.toFixed(1)),
          datasets: [
            {
              label: 'x position (m)',
              data: data.position.x,
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              tension: 0.4
            },
            {
              label: 'y position (m)',
              data: data.position.y,
              borderColor: '#ff006e',
              backgroundColor: 'rgba(255, 0, 110, 0.1)',
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      console.log('Direct rendering chart created successfully');
    } catch (error) {
      console.error('Error creating chart in direct rendering:', error);
    }
  }
  
  console.log('=== DEBUG SCRIPT COMPLETED ===');
});
