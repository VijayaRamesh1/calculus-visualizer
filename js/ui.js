/**
 * ui.js - UI controls and interaction
 */

class UI {
    constructor(engine) {
        this.engine = engine;
        this.activeConcept = null;
        this.activeConceptModule = null;
        
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
}