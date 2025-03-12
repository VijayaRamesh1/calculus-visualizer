/**
 * Direct Renderer - Immediately executes to ensure visualizations appear
 */

(function() {
  console.log('Direct renderer executing...');
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  function initialize() {
    console.log('Initializing direct renderer...');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.error('Chart.js not loaded - attempting to load it');
      loadScript('https://cdn.jsdelivr.net/npm/chart.js@3.7.0/dist/chart.min.js', renderGraphs);
    } else {
      console.log('Chart.js is loaded');
      renderGraphs();
    }
  }
  
  function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
  }
  
  function renderGraphs() {
    console.log('Rendering graphs directly');
    
    // Find or create container
    let container = document.getElementById('data-graph');
    if (!container) {
      console.log('Container not found, creating one');
      container = document.createElement('div');
      container.id = 'data-graph';
      container.style.height = '300px';
      container.style.width = '100%';
      container.style.border = '1px solid #ccc';
      container.style.borderRadius = '4px';
      container.style.padding = '10px';
      container.style.marginBottom = '20px';
      container.style.backgroundColor = '#f9f9f9';
      
      // Find a suitable place to insert
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.insertBefore(container, mainContent.firstChild);
      } else {
        document.body.appendChild(container);
      }
    }
    
    // Add canvas to container
    let canvas = container.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      container.appendChild(canvas);
    }
    
    // Create data
    const data = generateData();
    
    // Render position graph
    try {
      renderPositionGraph(canvas, data);
    } catch (error) {
      console.error('Error rendering graph:', error);
    }
    
    // Add graph selectors if they don't exist
    addGraphSelectors(container, canvas, data);
  }
  
  function addGraphSelectors(container, canvas, data) {
    let selectorDiv = document.querySelector('.graph-selector');
    
    if (!selectorDiv) {
      selectorDiv = document.createElement('div');
      selectorDiv.className = 'graph-selector';
      selectorDiv.style.display = 'flex';
      selectorDiv.style.gap = '10px';
      selectorDiv.style.marginBottom = '10px';
      
      const graphs = [
        { name: 'position', label: 'Position' },
        { name: 'velocity', label: 'Velocity' },
        { name: 'acceleration', label: 'Acceleration' },
        { name: 'energy', label: 'Energy' }
      ];
      
      graphs.forEach((graph, index) => {
        const button = document.createElement('button');
        button.className = 'graph-btn' + (index === 0 ? ' active' : '');
        button.setAttribute('data-graph', graph.name);
        button.textContent = graph.label;
        button.style.padding = '8px 16px';
        button.style.backgroundColor = index === 0 ? '#3a86ff' : '#eee';
        button.style.color = index === 0 ? 'white' : 'black';
        button.style.border = '1px solid #ddd';
        button.style.cursor = 'pointer';
        
        button.addEventListener('click', () => {
          // Update active button
          selectorDiv.querySelectorAll('.graph-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.backgroundColor = '#eee';
            btn.style.color = 'black';
          });
          button.classList.add('active');
          button.style.backgroundColor = '#3a86ff';
          button.style.color = 'white';
          
          // Render the selected graph
          switch (graph.name) {
            case 'position':
              renderPositionGraph(canvas, data);
              break;
            case 'velocity':
              renderVelocityGraph(canvas, data);
              break;
            case 'acceleration':
              renderAccelerationGraph(canvas, data);
              break;
            case 'energy':
              renderEnergyGraph(canvas, data);
              break;
          }
        });
        
        selectorDiv.appendChild(button);
      });
      
      // Add insight text div
      const insightDiv = document.createElement('div');
      insightDiv.className = 'data-insight';
      insightDiv.style.marginTop = '10px';
      insightDiv.style.padding = '10px';
      insightDiv.style.backgroundColor = '#f5f5f5';
      insightDiv.style.borderLeft = '3px solid #3a86ff';
      
      const insightText = document.createElement('p');
      insightText.innerHTML = 'The parabolic shape of the y position graph is the result of constant acceleration due to gravity. The first derivative of position gives velocity, and the second derivative gives acceleration.';
      insightDiv.appendChild(insightText);
      
      // Insert elements
      container.parentNode.insertBefore(selectorDiv, container);
      container.parentNode.appendChild(insightDiv);
    }
  }
  
  function generateData() {
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
  
  // Chart instances
  let chart = null;
  
  function renderPositionGraph(canvas, data) {
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.time.map(t => t.toFixed(1)),
        datasets: [
          {
            label: 'x position (m)',
            data: data.position.x,
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'y position (m)',
            data: data.position.y,
            borderColor: '#ff006e',
            backgroundColor: 'rgba(255, 0, 110, 0.1)',
            tension: 0.4,
            pointRadius: 0
          }
        ]
      },
      options: getChartOptions('Position vs. Time', 'Time (s)', 'Position (m)')
    });
    
    updateInsightText('The parabolic shape of the y position graph is the result of constant acceleration due to gravity. The first derivative of position gives velocity, and the second derivative gives acceleration.');
  }
  
  function renderVelocityGraph(canvas, data) {
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.time.map(t => t.toFixed(1)),
        datasets: [
          {
            label: 'vx (m/s)',
            data: data.velocity.x,
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'vy (m/s)',
            data: data.velocity.y,
            borderColor: '#ff006e',
            backgroundColor: 'rgba(255, 0, 110, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Magnitude (m/s)',
            data: data.velocity.magnitude,
            borderColor: '#fb5607',
            backgroundColor: 'rgba(251, 86, 7, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            borderDash: [5, 5]
          }
        ]
      },
      options: getChartOptions('Velocity vs. Time', 'Time (s)', 'Velocity (m/s)')
    });
    
    updateInsightText('The horizontal velocity (vx) is constant without air resistance. The vertical velocity (vy) decreases linearly due to constant acceleration of gravity. The slope of this line is -g = -9.8 m/s².');
  }
  
  function renderAccelerationGraph(canvas, data) {
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.time.map(t => t.toFixed(1)),
        datasets: [
          {
            label: 'ax (m/s²)',
            data: data.acceleration.x,
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'ay (m/s²)',
            data: data.acceleration.y,
            borderColor: '#ff006e',
            backgroundColor: 'rgba(255, 0, 110, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Magnitude (m/s²)',
            data: data.acceleration.magnitude,
            borderColor: '#fb5607',
            backgroundColor: 'rgba(251, 86, 7, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            borderDash: [5, 5]
          }
        ]
      },
      options: getChartOptions('Acceleration vs. Time', 'Time (s)', 'Acceleration (m/s²)')
    });
    
    updateInsightText('The horizontal acceleration (ax) is zero without air resistance. The vertical acceleration (ay) is constant at -9.8 m/s² due to gravity. This constant acceleration is what defines projectile motion.');
  }
  
  function renderEnergyGraph(canvas, data) {
    if (chart) chart.destroy();
    
    const ctx = canvas.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.time.map(t => t.toFixed(1)),
        datasets: [
          {
            label: 'Kinetic Energy (J)',
            data: data.energy.kinetic,
            borderColor: '#ff006e',
            backgroundColor: 'rgba(255, 0, 110, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Potential Energy (J)',
            data: data.energy.potential,
            borderColor: '#06d6a0',
            backgroundColor: 'rgba(6, 214, 160, 0.1)',
            tension: 0.4,
            pointRadius: 0
          },
          {
            label: 'Total Energy (J)',
            data: data.energy.total,
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            tension: 0.4,
            pointRadius: 0,
            borderDash: [5, 5]
          }
        ]
      },
      options: getChartOptions('Energy vs. Time', 'Time (s)', 'Energy (J)')
    });
    
    updateInsightText('Without air resistance, total energy remains constant (conservation of energy). Kinetic energy decreases as the arrow rises (velocity decreases) while potential energy increases. At the peak, KE is minimum and PE is maximum.');
  }
  
  function getChartOptions(title, xLabel, yLabel) {
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
  
  function updateInsightText(text) {
    const insightElement = document.querySelector('.data-insight p');
    if (insightElement) {
      insightElement.innerHTML = text;
    }
  }
})();