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
    
    console.log('Calculus Visualizer initialized successfully!');
});