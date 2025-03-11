/**
 * main.js - Application initialization and main controller
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the 3D engine
    const engine = new Engine('visualization');
    
    // Initialize UI manager
    const ui = new UI(engine);
    
    // Start with derivatives as the default concept
    const defaultConcept = 'derivatives';
    ui.setActiveConcept(defaultConcept);
    
    // Render loop
    function animate() {
        requestAnimationFrame(animate);
        engine.update();
        engine.render();
    }
    
    // Start animation loop
    animate();
    
    // Window resize handler
    window.addEventListener('resize', function() {
        engine.resize();
    });
    
    // Setup professional tools if available
    setupProfessionalTools(engine);
    
    console.log('Calculus Visualizer initialized successfully!');
});

/**
 * Set up professional-level tools and functionality
 * @param {Engine} engine - The visualization engine instance
 */
function setupProfessionalTools(engine) {
    // High-precision mode toggle
    const highPrecisionCheckbox = document.getElementById('enable-high-precision');
    if (highPrecisionCheckbox) {
        highPrecisionCheckbox.addEventListener('change', function(e) {
            if (e.target.checked) {
                // Increase calculation precision
                engine.visualizationOptions.resolution = 100; // Double the default
                
                // Update all calculations with higher precision
                const currentConcept = document.querySelector('nav a.active')?.getAttribute('data-concept');
                if (currentConcept) {
                    const fn = engine.currentFunction;
                    engine.updateFunction(fn); // This will refresh the visualization
                }
            } else {
                // Reset to default precision
                engine.visualizationOptions.resolution = 50;
                
                // Update visualization with default precision
                const fn = engine.currentFunction;
                engine.updateFunction(fn);
            }
        });
    }
    
    // Export visualization button
    const exportButton = document.getElementById('export-visualization');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // Create a capture of the visualization
            const canvas = document.getElementById('visualization');
            
            // Use toDataURL to get image data
            try {
                const dataUrl = canvas.toDataURL('image/png');
                
                // Create a temporary link element
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'calculus-visualization.png';
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (e) {
                console.error('Error exporting visualization:', e);
                alert('Failed to export visualization. Make sure you are using a secure (HTTPS) connection.');
            }
        });
    }
    
    // Apply user level settings to engine
    const currentUserLevel = Config.getCurrentUserLevel();
    const levelDef = Config.getUserLevelDefinition(currentUserLevel);
    
    // Set precision based on user level
    if (levelDef.precision) {
        engine.precision = levelDef.precision;
    }
}