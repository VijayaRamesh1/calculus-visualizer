/**
 * tutorials.js - Guided tutorials for beginners
 */

const TutorialManager = {
    activeTutorial: null,
    currentStep: 0,
    tutorials: {
        derivatives: {
            title: 'Understanding Derivatives',
            subtitle: 'Learn how to visualize the rate of change',
            imagePath: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
            steps: [
                {
                    title: 'What are Derivatives?',
                    content: 'A derivative represents the rate of change of a function at any point. Think of it as the slope of the tangent line to a curve at a specific point.',
                    target: 'nav a[data-concept="derivatives"]',
                    action: () => {}
                },
                {
                    title: 'Try a Simple Function',
                    content: 'Let\'s start with a basic function like x². Enter "x^2" in the function input box and click Update.',
                    target: '#function',
                    action: () => {
                        document.getElementById('function').value = 'x^2';
                    }
                },
                {
                    title: 'Show the Derivative',
                    content: 'Check the "Show Derivative" box to visualize f\'(x) = 2x, which is the derivative of f(x) = x².',
                    target: '#show-derivative',
                    action: () => {
                        const checkbox = document.getElementById('show-derivative');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    }
                },
                {
                    title: 'Add a Tangent Line',
                    content: 'The tangent line shows the derivative at a specific point. Check "Show Tangent Line" to see it in action.',
                    target: '#show-tangent',
                    action: () => {
                        const checkbox = document.getElementById('show-tangent');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    }
                },
                {
                    title: 'Move the Tangent Point',
                    content: 'Use the slider to move the tangent point. Notice how the slope changes as you move along the curve.',
                    target: '#tangent-point',
                    action: () => {}
                },
                {
                    title: 'Try a Real-World Example',
                    content: 'Select "Projectile Motion" from the Examples dropdown to see derivatives in action in physics.',
                    target: '#examples',
                    action: () => {
                        document.getElementById('examples').value = 'projectile-motion';
                        const event = new Event('change');
                        document.getElementById('examples').dispatchEvent(event);
                    }
                }
            ]
        },
        integrals: {
            title: 'Exploring Integrals',
            subtitle: 'Understand area under curves',
            imagePath: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
            steps: [
                {
                    title: 'What are Integrals?',
                    content: 'An integral represents the area under a curve. It\'s the total accumulation of a function over an interval.',
                    target: 'nav a[data-concept="integrals"]',
                    action: () => {}
                },
                {
                    title: 'Try a Simple Function',
                    content: 'Let\'s start with a basic function. Enter "x" in the function input box and click Update.',
                    target: '#function',
                    action: () => {
                        document.getElementById('function').value = 'x';
                    }
                },
                {
                    title: 'Show the Integral Area',
                    content: 'Check the "Show Integral Area" box to visualize the area under the line y = x.',
                    target: '#show-integral',
                    action: () => {
                        const checkbox = document.getElementById('show-integral');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    }
                },
                {
                    title: 'Change the Integral Range',
                    content: 'Adjust the integral range to see how the area changes. Try setting it from 0 to 2.',
                    target: '#integral-start',
                    action: () => {
                        document.getElementById('integral-start').value = '0';
                        document.getElementById('integral-end').value = '2';
                        const event = new Event('change');
                        document.getElementById('integral-end').dispatchEvent(event);
                    }
                },
                {
                    title: 'Try the Antiderivative',
                    content: 'Check "Show Antiderivative" to see F(x) = x²/2, which is the antiderivative of f(x) = x.',
                    target: '#show-antiderivative',
                    action: () => {
                        const checkbox = document.getElementById('show-antiderivative');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    }
                },
                {
                    title: 'Try a Real-World Example',
                    content: 'Select "Car Acceleration" from the Examples dropdown to see integrals in a real-world context.',
                    target: '#examples',
                    action: () => {
                        document.getElementById('examples').value = 'car-acceleration';
                        const event = new Event('change');
                        document.getElementById('examples').dispatchEvent(event);
                    }
                }
            ]
        },
        limits: {
            title: 'Understanding Limits',
            subtitle: 'See what happens as x approaches a value',
            imagePath: 'https://images.unsplash.com/photo-1624953587687-daf255b6b80a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
            steps: [
                {
                    title: 'What are Limits?',
                    content: 'A limit describes what happens to a function as x approaches a specific value, even if the function isn\'t defined at that exact point.',
                    target: 'nav a[data-concept="limits"]',
                    action: () => {}
                },
                {
                    title: 'Try a Simple Function',
                    content: 'Let\'s examine a function with a singularity. Enter "1/x" in the function input box and click Update.',
                    target: '#function',
                    action: () => {
                        document.getElementById('function').value = '1/x';
                    }
                },
                {
                    title: 'Show the Limit',
                    content: 'Check the "Show Limit Visualization" box to see what happens as x approaches 0.',
                    target: '#show-limit',
                    action: () => {
                        const checkbox = document.getElementById('show-limit');
                        if (checkbox && !checkbox.checked) {
                            checkbox.click();
                        }
                    }
                },
                {
                    title: 'Choose the Approach Direction',
                    content: 'Try the "From left" and "From right" options to see that the limit doesn\'t exist because the left and right limits differ.',
                    target: 'input[name="limit-direction"][value="left"]',
                    action: () => {
                        const radio = document.querySelector('input[name="limit-direction"][value="left"]');
                        if (radio) {
                            radio.click();
                        }
                    }
                },
                {
                    title: 'Change the Limit Point',
                    content: 'Move the slider to see the behavior as x approaches different values.',
                    target: '#limit-point',
                    action: () => {
                        const slider = document.getElementById('limit-point');
                        if (slider) {
                            slider.value = '2';
                            const event = new Event('input');
                            slider.dispatchEvent(event);
                        }
                    }
                }
            ]
        }
    },
    
    // Calculus glossary for beginners
    glossary: {
        "Derivative": "A measure of how a function changes as its input changes. Geometrically, it's the slope of the tangent line to the function at a point.",
        "Integral": "The area under a curve. A definite integral calculates this area between two specific x-values.",
        "Limit": "The value a function approaches as the input approaches a certain value, even if the function isn't defined at that exact point.",
        "Tangent Line": "A straight line that touches a curve at a single point and has the same slope as the curve at that point.",
        "Antiderivative": "A function F(x) whose derivative is f(x). The indefinite integral of f(x).",
        "Rate of Change": "How quickly a quantity is changing with respect to another quantity, often represented by a derivative.",
        "Critical Point": "A point where the derivative equals zero or is undefined, potentially indicating a maximum, minimum, or inflection point.",
        "Fundamental Theorem of Calculus": "Connects differentiation and integration, showing they are inverse processes."
    },
    
    // Initialize the tutorial system
    init() {
        // Add event listener for concept changes
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                const concept = e.target.getAttribute('data-concept');
                this.checkForTutorial(concept);
            });
        });
        
        // Check if we should show a tutorial for the current concept
        const activeConceptLink = document.querySelector('nav a.active');
        if (activeConceptLink) {
            const concept = activeConceptLink.getAttribute('data-concept');
            this.checkForTutorial(concept);
        }
        
        // Add help button for beginners
        this.addHelpButton();
    },
    
    // Check if we should show a tutorial for a concept
    checkForTutorial(concept) {
        // Only show tutorials for beginners
        if (Config.getCurrentUserLevel() !== Config.USER_LEVELS.BEGINNER) {
            return;
        }
        
        // Check if this tutorial has been seen before
        const settings = Config.getSettings();
        const seenTutorials = settings.seenTutorials || [];
        
        // If tutorial hasn't been seen, offer it
        if (!seenTutorials.includes(concept) && this.tutorials[concept]) {
            this.offerTutorial(concept);
        }
    },
    
    // Offer a tutorial to the user
    offerTutorial(concept) {
        const tutorial = this.tutorials[concept];
        
        // Create confirmation dialogue
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        card.style.maxWidth = '500px';
        
        card.innerHTML = `
            <div class="tutorial-content" style="width: 100%">
                <div class="tutorial-header">
                    <h2 class="tutorial-title">Would you like a guided tour?</h2>
                    <p class="tutorial-subtitle">Learn about ${tutorial.title}</p>
                </div>
                <div class="tutorial-body">
                    <p>This short tutorial will walk you through the basics of ${concept} and how to use this visualization tool.</p>
                </div>
                <div class="tutorial-footer">
                    <button class="tutorial-nav-button tutorial-prev">Skip</button>
                    <button class="tutorial-nav-button tutorial-next">Start Tutorial</button>
                </div>
            </div>
        `;
        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        // Add event listeners for buttons
        card.querySelector('.tutorial-prev').addEventListener('click', () => {
            // Mark as seen
            const settings = Config.getSettings();
            settings.seenTutorials = settings.seenTutorials || [];
            if (!settings.seenTutorials.includes(concept)) {
                settings.seenTutorials.push(concept);
            }
            Config.saveSettings(settings);
            
            // Remove overlay
            overlay.remove();
        });
        
        card.querySelector('.tutorial-next').addEventListener('click', () => {
            // Remove overlay
            overlay.remove();
            
            // Start tutorial
            this.startTutorial(concept);
        });
    },
    
    // Start a tutorial
    startTutorial(concept) {
        this.activeTutorial = concept;
        this.currentStep = 0;
        this.showTutorialStep();
    },
    
    // Show a tutorial step
    showTutorialStep() {
        if (!this.activeTutorial) return;
        
        const tutorial = this.tutorials[this.activeTutorial];
        const step = tutorial.steps[this.currentStep];
        
        // Create tutorial card
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        
        // Create tutorial content
        card.innerHTML = `
            <div class="tutorial-image" style="background-image: url('${tutorial.imagePath}')"></div>
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h2 class="tutorial-title">${tutorial.title}</h2>
                    <p class="tutorial-subtitle">${tutorial.subtitle}</p>
                </div>
                <div class="tutorial-body">
                    <div class="tutorial-step">
                        <div class="tutorial-step-number">${this.currentStep + 1}</div>
                        <div class="tutorial-step-content">
                            <div class="tutorial-step-title">${step.title}</div>
                            <p>${step.content}</p>
                        </div>
                    </div>
                </div>
                <div class="tutorial-footer">
                    ${this.currentStep > 0 ? '<button class="tutorial-nav-button tutorial-prev">Previous</button>' : '<div></div>'}
                    ${this.currentStep < tutorial.steps.length - 1 
                        ? '<button class="tutorial-nav-button tutorial-next">Next</button>' 
                        : '<button class="tutorial-nav-button tutorial-finish">Finish</button>'}
                </div>
                <div class="tutorial-progress">
                    ${tutorial.steps.map((_, i) => `
                        <div class="tutorial-dot ${i === this.currentStep ? 'active' : ''}"></div>
                    `).join('')}
                </div>
            </div>
        `;
        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        // Highlight target element
        const targetElement = document.querySelector(step.target);
        if (targetElement) {
            targetElement.classList.add('tutorial-target');
            
            // Execute step action
            if (step.action) {
                step.action();
            }
        }
        
        // Add event listeners for buttons
        if (this.currentStep > 0) {
            card.querySelector('.tutorial-prev').addEventListener('click', () => {
                this.navigateTutorial(-1);
            });
        }
        
        if (this.currentStep < tutorial.steps.length - 1) {
            card.querySelector('.tutorial-next').addEventListener('click', () => {
                this.navigateTutorial(1);
            });
        } else {
            card.querySelector('.tutorial-finish').addEventListener('click', () => {
                this.finishTutorial();
            });
        }
        
        // Add event listeners for dots
        card.querySelectorAll('.tutorial-dot').forEach((dot, i) => {
            dot.addEventListener('click', () => {
                this.navigateTutorial(i - this.currentStep);
            });
        });
    },
    
    // Navigate through tutorial steps
    navigateTutorial(delta) {
        // Remove highlight from current target
        const tutorial = this.tutorials[this.activeTutorial];
        const currentStep = tutorial.steps[this.currentStep];
        const currentTarget = document.querySelector(currentStep.target);
        if (currentTarget) {
            currentTarget.classList.remove('tutorial-target');
        }
        
        // Remove current tutorial overlay
        document.querySelector('.tutorial-overlay').remove();
        
        // Update step
        this.currentStep += delta;
        
        // Show new step
        this.showTutorialStep();
    },
    
    // Finish a tutorial
    finishTutorial() {
        // Remove highlight from current target
        const tutorial = this.tutorials[this.activeTutorial];
        const currentStep = tutorial.steps[this.currentStep];
        const currentTarget = document.querySelector(currentStep.target);
        if (currentTarget) {
            currentTarget.classList.remove('tutorial-target');
        }
        
        // Remove tutorial overlay
        document.querySelector('.tutorial-overlay').remove();
        
        // Mark tutorial as seen
        const settings = Config.getSettings();
        settings.seenTutorials = settings.seenTutorials || [];
        if (!settings.seenTutorials.includes(this.activeTutorial)) {
            settings.seenTutorials.push(this.activeTutorial);
        }
        Config.saveSettings(settings);
        
        // Clear active tutorial
        this.activeTutorial = null;
    },
    
    // Add a help button for beginners
    addHelpButton() {
        // Only add for beginners
        if (Config.getCurrentUserLevel() !== Config.USER_LEVELS.BEGINNER) {
            return;
        }
        
        // Create help button
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button glossary-trigger';
        helpButton.innerHTML = '?';
        helpButton.setAttribute('aria-label', 'Open calculus glossary');
        helpButton.title = 'Open calculus glossary';
        
        document.body.appendChild(helpButton);
        
        // Add event listener
        helpButton.addEventListener('click', () => {
            this.showGlossary();
        });
    },
    
    // Show calculus glossary
    showGlossary() {
        // Remove existing glossary if any
        const existingGlossary = document.querySelector('.concept-glossary');
        if (existingGlossary) {
            existingGlossary.remove();
            return;
        }
        
        // Create glossary
        const glossary = document.createElement('div');
        glossary.className = 'concept-glossary';
        
        // Create glossary content
        glossary.innerHTML = `
            <div class="glossary-header">
                <h3 class="glossary-title">Calculus Glossary</h3>
                <button class="glossary-close">&times;</button>
            </div>
            <div class="glossary-content">
                ${Object.entries(this.glossary).map(([term, definition]) => `
                    <div class="glossary-term">
                        <h4 class="glossary-term-title">${term}</h4>
                        <p class="glossary-term-definition">${definition}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(glossary);
        
        // Add event listener for close button
        glossary.querySelector('.glossary-close').addEventListener('click', () => {
            glossary.remove();
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TutorialManager.init();
});
