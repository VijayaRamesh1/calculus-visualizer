/**
 * animations.js - Enhanced animations for visualizations
 */

const EnhancedAnimations = {
    // Track active animations
    activeAnimations: {},
    
    /**
     * Initialize animations based on user level
     * @param {string} level - User level (beginner, expert, professional)
     */
    initForLevel(level) {
        // Clear existing animations
        this.clearAllAnimations();
        
        // Apply level-specific animations
        switch(level) {
            case Config.USER_LEVELS.BEGINNER:
                this.applyBeginnerAnimations();
                break;
            case Config.USER_LEVELS.EXPERT:
                this.applyExpertAnimations();
                break;
            case Config.USER_LEVELS.PROFESSIONAL:
                this.applyProfessionalAnimations();
                break;
        }
    },
    
    /**
     * Apply beginner-friendly animations
     */
    applyBeginnerAnimations() {
        // Add gentle function curve animation
        this.addFunctionAnimation('gentle-wave');
        
        // Add highlight effect for critical points
        this.addCriticalPointHighlights();
        
        // Smooth transitions between concepts
        this.addConceptTransitions();
    },
    
    /**
     * Apply expert-level animations
     */
    applyExpertAnimations() {
        // Add subtle function animations
        this.addFunctionAnimation('subtle-pulse');
        
        // Add data-driven animations
        this.addDataDrivenAnimations();
    },
    
    /**
     * Apply professional-level animations
     */
    applyProfessionalAnimations() {
        // Add minimal, non-distracting animations
        this.addFunctionAnimation('minimal');
        
        // Add precision indicator animations
        this.addPrecisionIndicators();
    },
    
    /**
     * Add animation to function curves
     * @param {string} style - Animation style
     */
    addFunctionAnimation(style) {
        const animate = () => {
            // Find all function curves
            const curves = document.querySelectorAll('.function-curve');
            const time = performance.now() / 1000;
            
            curves.forEach(curve => {
                switch(style) {
                    case 'gentle-wave':
                        // Gentle wave effect
                        const wavePhase = time * 0.5;
                        const waveAmplitude = 0.05;
                        curve.style.transform = `translateY(${Math.sin(wavePhase) * waveAmplitude}px)`;
                        break;
                        
                    case 'subtle-pulse':
                        // Subtle pulsing effect
                        const pulsePhase = time;
                        const pulseScale = 1 + Math.sin(pulsePhase) * 0.01;
                        curve.style.transform = `scale(1, ${pulseScale})`;
                        break;
                        
                    case 'minimal':
                        // Very subtle transform on hover only
                        curve.style.transition = 'transform 0.3s ease';
                        break;
                }
            });
            
            // Continue animation
            this.activeAnimations['functionAnimation'] = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    },
    
    /**
     * Highlight critical points (where derivative is zero)
     */
    addCriticalPointHighlights() {
        const engine = window.calcEngine;
        if (!engine) return;
        
        // Find critical points where derivative equals zero
        const fn = engine.currentFunction;
        const derivative = MathUtils.getDerivativeExpression(fn);
        
        // Sample points to find where derivative crosses zero
        const { xRange } = engine.visualizationOptions;
        const samples = 100;
        const step = (xRange[1] - xRange[0]) / samples;
        
        let criticalPoints = [];
        let prevDerivValue = null;
        
        for (let i = 0; i <= samples; i++) {
            const x = xRange[0] + i * step;
            
            try {
                const derivValue = math.evaluate(derivative, { x });
                
                // Check for sign change (zero crossing)
                if (prevDerivValue !== null && 
                    ((prevDerivValue < 0 && derivValue >= 0) || 
                     (prevDerivValue > 0 && derivValue <= 0))) {
                    // Approximate critical point location
                    const criticalX = x - step * (derivValue / (derivValue - prevDerivValue));
                    criticalPoints.push(criticalX);
                }
                
                prevDerivValue = derivValue;
            } catch (error) {
                prevDerivValue = null;
            }
        }
        
        // Create highlights for critical points
        criticalPoints.forEach(x => {
            try {
                const y = math.evaluate(fn, { x });
                this.createCriticalPointHighlight(x, y);
            } catch (error) {
                console.error('Error evaluating function at critical point:', error);
            }
        });
    },
    
    /**
     * Create a visual highlight for a critical point
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    createCriticalPointHighlight(x, y) {
        const scene = window.calcEngine?.scene;
        if (!scene) return;
        
        // Create a pulsing sphere at the critical point
        const geometry = new THREE.SphereGeometry(0.15, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xe74c3c,
            transparent: true,
            opacity: 0.7
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(x, y, 0.1);
        scene.add(sphere);
        
        // Add to function meshes
        window.calcEngine.functionMeshes.push(sphere);
        
        // Add pulsing animation
        const animate = () => {
            const time = performance.now() / 1000;
            const scale = 1 + Math.sin(time * 2) * 0.3;
            
            sphere.scale.set(scale, scale, scale);
            
            // Store animation ID
            this.activeAnimations[`criticalPoint_${x}_${y}`] = requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    /**
     * Add smooth transitions between concepts
     */
    addConceptTransitions() {
        // Add event listener for concept changes
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Add transitions to panels
                document.querySelectorAll('#controls-panel, #explanation-panel').forEach(panel => {
                    panel.classList.add('fade-in');
                    
                    // Remove class after animation completes
                    setTimeout(() => {
                        panel.classList.remove('fade-in');
                    }, 500);
                });
            });
        });
    },
    
    /**
     * Add data-driven animations for expert users
     */
    addDataDrivenAnimations() {
        // Animate derivative to show relationship with original function
        const engine = window.calcEngine;
        if (!engine) return;
        
        const animate = () => {
            // Find derivative curve
            const derivativeCurve = document.querySelector('.derivative-curve');
            if (derivativeCurve) {
                const time = performance.now() / 1000;
                
                // Subtle wave that follows the original function's slope
                const wavePhase = time * 0.3;
                const waveScale = 1 + Math.sin(wavePhase) * 0.02;
                
                derivativeCurve.style.transform = `scaleY(${waveScale})`;
            }
            
            // Continue animation
            this.activeAnimations['derivativeAnimation'] = requestAnimationFrame(animate);
        };
        
        // Start animation
        animate();
    },
    
    /**
     * Add precision indicators for professional users
     */
    addPrecisionIndicators() {
        // Add precise grid markers that pulse subtly on hover
        const gridLines = document.querySelectorAll('.grid-line');
        
        gridLines.forEach(line => {
            line.addEventListener('mouseenter', () => {
                line.style.transition = 'transform 0.2s ease';
                line.style.transform = 'scaleY(1.02)';
            });
            
            line.addEventListener('mouseleave', () => {
                line.style.transform = 'scaleY(1)';
            });
        });
    },
    
    /**
     * Clear all active animations
     */
    clearAllAnimations() {
        // Cancel all animation frames
        Object.values(this.activeAnimations).forEach(id => {
            cancelAnimationFrame(id);
        });
        
        // Reset animation tracking
        this.activeAnimations = {};
        
        // Reset any animated elements
        document.querySelectorAll('.function-curve, .derivative-curve').forEach(el => {
            el.style.transform = '';
        });
    }
};

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Store engine reference for animations
    window.addEventListener('engineInitialized', (e) => {
        window.calcEngine = e.detail.engine;
        
        // Initialize animations based on current user level
        const currentLevel = Config.getCurrentUserLevel();
        EnhancedAnimations.initForLevel(currentLevel);
    });
    
    // Listen for user level changes
    document.addEventListener('userlevelchanged', (e) => {
        EnhancedAnimations.initForLevel(e.detail.level);
    });
});
