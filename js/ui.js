/**
 * ui.js - UI controls and interaction
 */

class UI {
    constructor(engine) {
        this.engine = engine;
        this.activeConcept = null;
        this.activeConceptModule = null;
        this.tooltips = {};
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Concept navigation links
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const concept = e.target.getAttribute('data-concept');
                this.setActiveConcept(concept);
            });
        });
        
        // Function update button
        document.getElementById('update-function').addEventListener('click', () => {
            const functionInput = document.getElementById('function').value;
            this.updateFunction(functionInput);
        });
        
        // Examples dropdown
        document.getElementById('examples').addEventListener('change', (e) => {
            const example = e.target.value;
            if (example) {
                this.loadExample(example);
            }
        });
        
        // Listen for user level changes to update tooltips
        document.addEventListener('userlevelchanged', (e) => {
            const level = e.detail.level;
            this.updateTooltipsForLevel(level);
        });
    }
    
    setActiveConcept(concept) {
        // Remove active class from all links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to selected concept
        const activeLink = document.querySelector(`nav a[data-concept="${concept}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.activeConcept = concept;
        
        // Get the corresponding module
        switch (concept) {
            case 'derivatives':
                this.activeConceptModule = DerivativesModule;
                break;
            case 'integrals':
                this.activeConceptModule = IntegralsModule;
                break;
            case 'limits':
                this.activeConceptModule = LimitsModule;
                break;
            default:
                this.activeConceptModule = DerivativesModule;
                break;
        }
        
        // Initialize module
        this.activeConceptModule.init(this.engine);
        
        // Update UI
        this.updateConceptUI();
        
        // Reset examples dropdown
        document.getElementById('examples').value = '';
        
        // Add tooltips based on user level
        this.addConceptTooltips(concept);
    }
    
    updateConceptUI() {
        // Update concept title and explanation
        document.getElementById('concept-title').textContent = this.activeConceptModule.title;
        document.getElementById('concept-explanation').innerHTML = this.activeConceptModule.explanation;
        
        // Update concept-specific controls
        const controlsContainer = document.getElementById('concept-controls');
        controlsContainer.innerHTML = this.activeConceptModule.generateControls();
        
        // Add event listeners to new controls
        this.activeConceptModule.initControls();
    }
    
    updateFunction(functionExpression) {
        this.engine.updateFunction(functionExpression);
        
        // Refresh visualization via active concept module
        if (this.activeConceptModule) {
            this.activeConceptModule.visualize(this.engine);
        }
    }
    
    loadExample(example) {
        // Find which example set it belongs to
        if (example.startsWith('projectile') || example.startsWith('spring')) {
            PhysicsExamples.loadExample(example, this.engine, this);
        } else {
            EverydayExamples.loadExample(example, this.engine, this);
        }
    }
    
    /**
     * Add beginner-friendly tooltips for the selected concept
     * @param {string} concept - The active concept
     */
    addConceptTooltips(concept) {
        // Only add tooltips in beginner mode
        const currentLevel = Config.getCurrentUserLevel();
        if (currentLevel !== Config.USER_LEVELS.BEGINNER) {
            this.removeAllTooltips();
            return;
        }
        
        // Clear existing tooltips
        this.removeAllTooltips();
        
        // Add concept-specific tooltips
        const tooltips = this.getTooltipsForConcept(concept);
        
        // Create and add tooltips
        for (const selector in tooltips) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const tooltip = this.createTooltip(tooltips[selector]);
                element.appendChild(tooltip);
                
                // Save reference for later removal
                if (!this.tooltips[selector]) {
                    this.tooltips[selector] = [];
                }
                this.tooltips[selector].push(tooltip);
                
                // Add event listeners
                element.addEventListener('mouseenter', () => {
                    tooltip.classList.add('visible');
                });
                
                element.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('visible');
                });
            });
        }
    }
    
    /**
     * Create a tooltip element
     * @param {string} content - The tooltip content
     * @returns {HTMLElement} - The tooltip element
     */
    createTooltip(content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'beginner-tooltip';
        tooltip.innerHTML = content;
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '0.5rem 1rem';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '0.9rem';
        tooltip.style.maxWidth = '250px';
        tooltip.style.zIndex = '100';
        tooltip.style.display = 'none';
        tooltip.style.transition = 'opacity 0.3s';
        
        // Add arrow
        const arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.top = '100%';
        arrow.style.left = '50%';
        arrow.style.transform = 'translateX(-50%)';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderLeft = '8px solid transparent';
        arrow.style.borderRight = '8px solid transparent';
        arrow.style.borderTop = '8px solid rgba(0, 0, 0, 0.8)';
        tooltip.appendChild(arrow);
        
        // Add show/hide
        tooltip.classList.add = function(className) {
            if (className === 'visible') {
                this.style.display = 'block';
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 10);
            }
            return HTMLElement.prototype.classList.add.call(this, className);
        };
        
        tooltip.classList.remove = function(className) {
            if (className === 'visible') {
                this.style.opacity = '0';
                setTimeout(() => {
                    this.style.display = 'none';
                }, 300);
            }
            return HTMLElement.prototype.classList.remove.call(this, className);
        };
        
        return tooltip;
    }
    
    /**
     * Remove all tooltips
     */
    removeAllTooltips() {
        for (const selector in this.tooltips) {
            this.tooltips[selector].forEach(tooltip => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            });
        }
        this.tooltips = {};
    }
    
    /**
     * Update tooltips based on user level
     * @param {string} level - The user level
     */
    updateTooltipsForLevel(level) {
        if (level === Config.USER_LEVELS.BEGINNER) {
            // Add tooltips for the current concept
            if (this.activeConcept) {
                this.addConceptTooltips(this.activeConcept);
            }
        } else {
            // Remove all tooltips for other levels
            this.removeAllTooltips();
        }
    }
    
    /**
     * Get tooltips for a specific concept
     * @param {string} concept - The concept name
     * @returns {Object} - Selector -> tooltip content mapping
     */
    getTooltipsForConcept(concept) {
        const tooltips = {
            // Common tooltips
            '#function': 'Enter a mathematical function using x as the variable. For example, try x^2, sin(x), or 2*x+1.',
            '#update-function': 'Click to update the visualization with your function.',
            '#examples': 'Select from pre-made examples to see calculus concepts in action.',
            
            // Concept-specific tooltips
            derivatives: {
                'nav a[data-concept="derivatives"]': 'Derivatives show how quickly a function changes at any point.',
                '#show-derivative': 'Check this to see the derivative function f\'(x) alongside the original function.',
                '#show-tangent': 'Check this to see the tangent line at a specific point on the curve.',
                '#tangent-point': 'Move this slider to see how the slope of the tangent line changes at different points.'
            },
            integrals: {
                'nav a[data-concept="integrals"]': 'Integrals represent the area under a curve.',
                '#show-integral': 'Check this to see the area under the curve highlighted.',
                '#integral-start': 'The left boundary of your integral.',
                '#integral-end': 'The right boundary of your integral.',
                '#show-antiderivative': 'Check this to see the antiderivative function F(x).'
            },
            limits: {
                'nav a[data-concept="limits"]': 'Limits describe what happens to a function as x approaches a specific value.',
                '#show-limit': 'Check this to visualize how the function approaches a limit.',
                '#limit-point': 'Move this slider to see limits at different x values.',
                'input[name="limit-direction"]': 'Choose whether to approach the limit from the left, right, or both sides.'
            }
        };
        
        // Combine common tooltips with concept-specific ones
        const result = {};
        for (const selector in tooltips) {
            if (typeof tooltips[selector] === 'string') {
                result[selector] = tooltips[selector];
            }
        }
        
        // Add concept-specific tooltips
        if (tooltips[concept]) {
            for (const selector in tooltips[concept]) {
                result[selector] = tooltips[concept][selector];
            }
        }
        
        return result;
    }
}