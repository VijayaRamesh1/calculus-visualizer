/**
 * Calculus Visualizer - Landing Page Animations
 * 
 * This script creates interactive mathematical visualizations and animations
 * for the landing page, embodying the philosophy of making mathematical beauty
 * accessible through intuitive interaction.
 */

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations for content elements
    initRevealAnimations();
    
    // Initialize mathematical particle background
    initParticleBackground();
    
    // Initialize hero graph visualization
    initHeroGraph();
    
    // Add parallax effect to mathematical symbols
    initParallaxEffect();
    
    // Handle header scroll effect
    initHeaderScrollEffect();
});

/**
 * Initialize animations that reveal content as the user scrolls
 */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Create a mathematical particle background
 * Represents mathematical concepts in motion
 */
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Mathematical particles for conceptual visualization
    const particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    
    // Generate particles with mathematical properties
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: getRandomColor(),
            velocity: {
                x: (Math.random() - 0.5) * 0.5,
                y: (Math.random() - 0.5) * 0.5
            },
            // Mathematical function parameters
            amplitude: Math.random() * 2,
            frequency: Math.random() * 0.01,
            phase: Math.random() * Math.PI * 2
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each particle
        particles.forEach(particle => {
            // Mathematical movement patterns
            particle.x += particle.velocity.x + Math.sin(Date.now() * particle.frequency + particle.phase) * particle.amplitude * 0.1;
            particle.y += particle.velocity.y + Math.cos(Date.now() * particle.frequency + particle.phase) * particle.amplitude * 0.1;
            
            // Boundary checks with wrap-around
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw the particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });
        
        // Draw connection lines between nearby particles (representing mathematical relationships)
        drawConnections(particles, ctx, 100);
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/**
 * Draw connection lines between particles that are close to each other
 * representing mathematical relationships and interconnectedness
 */
function drawConnections(particles, ctx, maxDistance) {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                // Opacity based on distance (closer = more opaque)
                const opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(67, 98, 238, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

/**
 * Generate a subtle, thematic color for particles
 */
function getRandomColor() {
    // Generate colors within the blue/purple theme
    const hue = Math.floor(Math.random() * 40) + 220; // Blues and purples
    const saturation = Math.floor(Math.random() * 30) + 60; // Vibrant but not too saturated
    const lightness = Math.floor(Math.random() * 20) + 50; // Medium to bright
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Hero graph visualization with animated mathematical function
 */
function initHeroGraph() {
    const canvas = document.getElementById('hero-graph');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size with higher resolution for retina displays
    function resizeCanvas() {
        const width = canvas.parentElement.offsetWidth;
        const height = canvas.parentElement.offsetHeight;
        
        // Set canvas resolution
        canvas.width = width * 2;
        canvas.height = height * 2;
        ctx.scale(2, 2);
        
        // Set display size
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Function to animate a beautiful mathematical visualization
    function animateMathFunction() {
        let time = 0;
        
        function draw() {
            const width = canvas.width / 2;
            const height = canvas.height / 2;
            
            ctx.clearRect(0, 0, width, height);
            
            // Draw grid (representing Cartesian coordinates)
            drawGrid(ctx, width, height);
            
            // Draw animated function
            drawFunction(ctx, width, height, time);
            
            // Update time for animation
            time += 0.02;
            requestAnimationFrame(draw);
        }
        
        draw();
    }
    
    animateMathFunction();
}

/**
 * Draw a subtle grid background for the mathematical graph
 */
function drawGrid(ctx, width, height) {
    // Draw subtle grid
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    const gridStep = 30;
    for (let x = 0; x <= width; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 1;
    
    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // y-axis
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

/**
 * Draw an animated mathematical function
 */
function drawFunction(ctx, width, height, time) {
    const centerY = height / 2;
    
    // Primary function (sine wave)
    ctx.strokeStyle = '#4362EE';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
        // Composite trigonometric function with animation
        const y = centerY - 
            Math.sin((x / width * 6 * Math.PI) + time) * (height / 6) -
            Math.sin((x / width * 3 * Math.PI) - time * 0.5) * (height / 12);
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Secondary function (cosine wave)
    ctx.strokeStyle = 'rgba(62, 223, 207, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    for (let x = 0; x < width; x++) {
        const y = centerY - 
            Math.cos((x / width * 4 * Math.PI) - time) * (height / 8) -
            Math.cos((x / width * 2 * Math.PI) + time * 0.7) * (height / 16);
        
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
}

/**
 * Create a parallax effect for mathematical symbols
 */
function initParallaxEffect() {
    const symbols = document.querySelectorAll('.math-symbol');
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        symbols.forEach(symbol => {
            // Calculate movement based on symbol position
            const moveFactor = parseFloat(symbol.getAttribute('data-factor') || 1);
            const moveX = (mouseX - 0.5) * 20 * moveFactor;
            const moveY = (mouseY - 0.5) * 20 * moveFactor;
            
            // Apply the movement
            symbol.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // Set random movement factors
    symbols.forEach(symbol => {
        symbol.setAttribute('data-factor', Math.random() * 0.5 + 0.25);
    });
}

/**
 * Header scroll effect
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.app-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}
