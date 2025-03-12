/**
 * Interactive Walkthroughs Module
 * Provides guided step-by-step learning experiences for calculus concepts
 */

class WalkthroughManager {
  constructor() {
    this.currentWalkthrough = null;
    this.currentStep = 0;
    this.container = null;
    
    // Initialize walkthrough data
    this.walkthroughs = {
      derivatives: [
        {
          id: 'derivatives-intro',
          title: 'Introduction to Derivatives',
          steps: [
            {
              title: 'What is a Derivative?',
              content: 'A derivative measures the rate at which a function changes at any given point.',
              action: 'showBasicFunction',
              visualization: {
                function: 'x^2',
                showTangent: false,
                zoom: 'normal'
              }
            },
            {
              title: 'Slope of a Function',
              content: 'The derivative represents the slope of the tangent line at any point on the function.',
              action: 'showTangentLine',
              visualization: {
                function: 'x^2',
                showTangent: true,
                tangentPoint: 1,
                showDerivative: false
              }
            },
            {
              title: 'Instantaneous Rate of Change',
              content: 'As we zoom in on a single point, the derivative gives us the instantaneous rate of change.',
              action: 'animateZoomToPoint',
              visualization: {
                function: 'x^2',
                showTangent: true,
                tangentPoint: 1,
                zoom: 'close'
              }
            },
            {
              title: 'The Derivative Function',
              content: 'The derivative of f(x) = x² is f\'(x) = 2x. Notice how the slope changes at different points.',
              action: 'showDerivativeFunction',
              visualization: {
                function: 'x^2',
                showDerivative: true,
                showTangent: true
              }
            },
            {
              title: 'Try It Yourself',
              content: 'Drag the point to see how the derivative (slope) changes along the curve.',
              action: 'enableInteraction',
              visualization: {
                function: 'x^2',
                showDerivative: true,
                showTangent: true,
                interactive: true
              }
            }
          ]
        },
        {
          id: 'derivatives-applications',
          title: 'Applications of Derivatives',
          steps: [
            {
              title: 'Velocity and Acceleration',
              content: 'The derivative of position is velocity, and the derivative of velocity is acceleration.',
              action: 'showPhysicsExample',
              visualization: {
                example: 'carAcceleration',
                showVelocity: true,
                showAcceleration: false
              }
            },
            {
              title: 'Finding Maxima and Minima',
              content: 'Derivatives help us find where functions reach their highest or lowest points.',
              action: 'showMaximaMinima',
              visualization: {
                function: 'x^3 - 6*x^2 + 9*x + 1',
                showCriticalPoints: true
              }
            },
            {
              title: 'Optimization Problems',
              content: 'We can use derivatives to find optimal solutions to real-world problems.',
              action: 'showOptimizationExample',
              visualization: {
                example: 'boxOptimization'
              }
            }
          ]
        }
      ],
      integrals: [
        {
          id: 'integrals-intro',
          title: 'Understanding Integrals',
          steps: [
            {
              title: 'What is an Integral?',
              content: 'An integral represents the area under a curve between two points.',
              action: 'showBasicIntegral',
              visualization: {
                function: 'x^2',
                bounds: [0, 2],
                showArea: true
              }
            },
            {
              title: 'Definite Integrals',
              content: 'A definite integral has specific bounds and gives us a numerical value.',
              action: 'showDefiniteIntegral',
              visualization: {
                function: 'x^2',
                bounds: [0, 2],
                showArea: true,
                showValue: true
              }
            },
            {
              title: 'Riemann Sums',
              content: 'We can approximate the area using rectangles called Riemann sums.',
              action: 'showRiemannSums',
              visualization: {
                function: 'x^2',
                bounds: [0, 2],
                showRiemannSums: true,
                rectangles: 6
              }
            },
            {
              title: 'Indefinite Integrals',
              content: 'An indefinite integral gives us the family of antiderivative functions.',
              action: 'showIndefiniteIntegral',
              visualization: {
                function: 'x^2',
                showAntiderivative: true
              }
            },
            {
              title: 'Try It Yourself',
              content: 'Adjust the bounds to see how the area under the curve changes.',
              action: 'enableBoundAdjustment',
              visualization: {
                function: 'x^2',
                bounds: [0, 2],
                showArea: true,
                interactive: true
              }
            }
          ]
        }
      ],
      limits: [
        {
          id: 'limits-intro',
          title: 'Exploring Limits',
          steps: [
            {
              title: 'What is a Limit?',
              content: 'A limit describes the value a function approaches as the input approaches a specific value.',
              action: 'showBasicLimit',
              visualization: {
                function: '(x^2 - 1)/(x - 1)',
                limitPoint: 1,
                approachAnimation: true
              }
            },
            {
              title: 'One-sided Limits',
              content: 'A function can approach different values from the left and right sides.',
              action: 'showOneSidedLimits',
              visualization: {
                function: 'x/abs(x)',
                limitPoint: 0,
                showLeftLimit: true,
                showRightLimit: true
              }
            },
            {
              title: 'Limits and Continuity',
              content: 'Limits help us understand where functions are continuous or have discontinuities.',
              action: 'showContinuityExample',
              visualization: {
                function: 'floor(x)',
                limitPoint: 1,
                showContinuityCheck: true
              }
            },
            {
              title: 'Limits at Infinity',
              content: 'We can also examine what happens to a function as x approaches infinity.',
              action: 'showLimitAtInfinity',
              visualization: {
                function: '1/x',
                limitPoint: 'infinity',
                showAsymptote: true
              }
            },
            {
              title: 'Try It Yourself',
              content: 'Use the slider to approach the limit point and observe the function values.',
              action: 'enableLimitSlider',
              visualization: {
                function: 'sin(x)/x',
                limitPoint: 0,
                interactive: true
              }
            }
          ]
        }
      ]
    };
  }

  initialize() {
    this.createWalkthroughUI();
    this.addStartButtons();
    this.setupEventListeners();
  }

  createWalkthroughUI() {
    // Create modal container for walkthroughs
    this.container = document.createElement('div');
    this.container.className = 'walkthrough-container';
    this.container.innerHTML = `
      <div class="walkthrough-modal">
        <div class="walkthrough-header">
          <h3 class="walkthrough-title"></h3>
          <button class="btn-close" id="close-walkthrough">&times;</button>
        </div>
        <div class="walkthrough-content">
          <div class="step-title"></div>
          <div class="step-content"></div>
        </div>
        <div class="walkthrough-controls">
          <button class="btn btn-secondary" id="prev-step">Previous</button>
          <div class="step-indicators"></div>
          <button class="btn btn-primary" id="next-step">Next</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    this.container.style.display = 'none';
  }

  addStartButtons() {
    // Add walkthrough start buttons to each concept card
    Object.keys(this.walkthroughs).forEach(concept => {
      const conceptCard = document.querySelector(`#${concept}-card`);
      if (!conceptCard) return;
      
      const walkthroughList = document.createElement('div');
      walkthroughList.className = 'walkthrough-list';
      walkthroughList.innerHTML = '<h4>Interactive Walkthroughs</h4>';
      
      this.walkthroughs[concept].forEach(walkthrough => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline walkthrough-start-btn';
        button.textContent = walkthrough.title;
        button.setAttribute('data-walkthrough', walkthrough.id);
        walkthroughList.appendChild(button);
      });
      
      conceptCard.appendChild(walkthroughList);
    });
  }

  setupEventListeners() {
    // Start walkthrough buttons
    document.querySelectorAll('.walkthrough-start-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const walkthroughId = e.target.getAttribute('data-walkthrough');
        this.startWalkthrough(walkthroughId);
      });
    });
    
    // Navigation controls
    document.getElementById('prev-step')?.addEventListener('click', () => this.previousStep());
    document.getElementById('next-step')?.addEventListener('click', () => this.nextStep());
    document.getElementById('close-walkthrough')?.addEventListener('click', () => this.closeWalkthrough());
  }

  startWalkthrough(walkthroughId) {
    // Find the requested walkthrough
    let foundWalkthrough = null;
    let concept = null;
    
    Object.keys(this.walkthroughs).some(conceptKey => {
      const found = this.walkthroughs[conceptKey].find(w => w.id === walkthroughId);
      if (found) {
        foundWalkthrough = found;
        concept = conceptKey;
        return true;
      }
      return false;
    });
    
    if (!foundWalkthrough) return;
    
    // Set as current walkthrough
    this.currentWalkthrough = foundWalkthrough;
    this.currentConcept = concept;
    this.currentStep = 0;
    
    // Update UI
    document.querySelector('.walkthrough-title').textContent = foundWalkthrough.title;
    
    // Create step indicators
    const indicators = document.querySelector('.step-indicators');
    indicators.innerHTML = '';
    
    foundWalkthrough.steps.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.className = `step-indicator ${index === 0 ? 'active' : ''}`;
      indicators.appendChild(indicator);
    });
    
    // Show the first step
    this.showStep(0);
    
    // Show the walkthrough container
    this.container.style.display = 'flex';
    
    // Track progress
    this.trackProgress('walkthrough_started', {
      walkthrough_id: walkthroughId,
      concept: concept
    });
  }

  showStep(stepIndex) {
    if (!this.currentWalkthrough || 
        stepIndex < 0 || 
        stepIndex >= this.currentWalkthrough.steps.length) {
      return;
    }
    
    const step = this.currentWalkthrough.steps[stepIndex];
    
    // Update content
    document.querySelector('.step-title').textContent = step.title;
    document.querySelector('.step-content').textContent = step.content;
    
    // Update indicators
    const indicators = document.querySelectorAll('.step-indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === stepIndex);
      indicator.classList.toggle('completed', index < stepIndex);
    });
    
    // Update button states
    document.getElementById('prev-step').disabled = stepIndex === 0;
    
    const nextButton = document.getElementById('next-step');
    if (stepIndex === this.currentWalkthrough.steps.length - 1) {
      nextButton.textContent = 'Finish';
    } else {
      nextButton.textContent = 'Next';
    }
    
    // Apply visualization settings
    if (step.visualization && window.calcEngine) {
      this.applyVisualizationSettings(step.visualization);
    }
    
    // Execute step action if defined
    if (step.action && typeof this[step.action] === 'function') {
      this[step.action]();
    }
    
    // Track progress
    this.trackProgress('walkthrough_step_viewed', {
      walkthrough_id: this.currentWalkthrough.id,
      step_index: stepIndex,
      step_title: step.title
    });
  }

  nextStep() {
    if (!this.currentWalkthrough) return;
    
    if (this.currentStep < this.currentWalkthrough.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    } else {
      // Last step - complete walkthrough
      this.completeWalkthrough();
    }
  }

  previousStep() {
    if (!this.currentWalkthrough) return;
    
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  closeWalkthrough() {
    this.container.style.display = 'none';
    
    // Reset visualizations to default state
    if (window.calcEngine) {
      window.calcEngine.resetVisualization();
    }
    
    // Track event
    this.trackProgress('walkthrough_closed', {
      walkthrough_id: this.currentWalkthrough?.id,
      completed: false,
      last_step_viewed: this.currentStep
    });
  }

  completeWalkthrough() {
    // Track completion
    this.trackProgress('walkthrough_completed', {
      walkthrough_id: this.currentWalkthrough.id,
      concept: this.currentConcept
    });
    
    // Update progress tracking
    if (window.progressTracker) {
      window.progressTracker.markComplete(
        this.currentConcept, 
        'walkthrough', 
        this.currentWalkthrough.id
      );
    }
    
    // Close walkthrough
    this.container.style.display = 'none';
    
    // Show completion message
    this.showCompletionMessage();
    
    // Offer quiz if available
    setTimeout(() => {
      if (window.quizManager) {
        window.quizManager.offerQuiz(this.currentConcept);
      }
    }, 1500);
  }

  showCompletionMessage() {
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.innerHTML = `
      <div class="completion-content">
        <div class="completion-icon">✓</div>
        <h3>Walkthrough Completed!</h3>
        <p>Great job learning about ${this.currentWalkthrough.title}.</p>
        <button class="btn btn-primary" id="dismiss-completion">Continue</button>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Add event listener to dismiss button
    document.getElementById('dismiss-completion').addEventListener('click', () => {
      document.body.removeChild(message);
    });
  }

  applyVisualizationSettings(settings) {
    if (!window.calcEngine) return;
    
    // Apply function if specified
    if (settings.function) {
      window.calcEngine.setFunction(settings.function);
    }
    
    // Apply specific example
    if (settings.example) {
      window.calcEngine.loadExample(settings.example);
    }
    
    // Apply visualization options
    const options = {
      showDerivative: settings.showDerivative,
      showTangent: settings.showTangent,
      showArea: settings.showArea,
      showRiemannSums: settings.showRiemannSums,
      showAntiderivative: settings.showAntiderivative,
      rectangles: settings.rectangles,
      tangentPoint: settings.tangentPoint,
      bounds: settings.bounds,
      limitPoint: settings.limitPoint,
      showLeftLimit: settings.showLeftLimit,
      showRightLimit: settings.showRightLimit,
      showCriticalPoints: settings.showCriticalPoints,
      showAsymptote: settings.showAsymptote,
      zoom: settings.zoom,
      interactive: settings.interactive
    };
    
    window.calcEngine.updateVisualizationOptions(options);
    
    // Trigger animations if needed
    if (settings.approachAnimation) {
      window.calcEngine.animateLimitApproach();
    }
    
    if (settings.interactive) {
      window.calcEngine.enableInteraction();
    } else {
      window.calcEngine.disableInteraction();
    }
  }

  trackProgress(event, data) {
    // Track events for learning analytics
    if (window.analyticsTracker) {
      window.analyticsTracker.trackEvent(event, data);
    }
    
    // For debugging
    console.log(`[Walkthrough] ${event}`, data);
  }
  
  // Specific visualization actions
  showBasicFunction() {
    // Implemented via visualization settings
  }
  
  showTangentLine() {
    // Implemented via visualization settings
  }
  
  animateZoomToPoint() {
    if (window.calcEngine) {
      window.calcEngine.animateZoom('in');
    }
  }
  
  showDerivativeFunction() {
    // Implemented via visualization settings
  }
  
  enableInteraction() {
    if (window.calcEngine) {
      window.calcEngine.enableDragging();
    }
  }
  
  showBasicIntegral() {
    // Implemented via visualization settings
  }
  
  showDefiniteIntegral() {
    // Implemented via visualization settings
  }
  
  showRiemannSums() {
    // Implemented via visualization settings
  }
  
  showIndefiniteIntegral() {
    // Implemented via visualization settings
  }
  
  enableBoundAdjustment() {
    if (window.calcEngine) {
      window.calcEngine.enableBoundDragging();
    }
  }
  
  showBasicLimit() {
    // Implemented via visualization settings
  }
  
  showOneSidedLimits() {
    // Implemented via visualization settings
  }
  
  showContinuityExample() {
    // Implemented via visualization settings
  }
  
  showLimitAtInfinity() {
    // Implemented via visualization settings
  }
  
  enableLimitSlider() {
    if (window.calcEngine) {
      window.calcEngine.enableLimitSlider();
    }
  }
  
  showPhysicsExample() {
    // Implemented via visualization settings
  }
  
  showMaximaMinima() {
    // Implemented via visualization settings
  }
  
  showOptimizationExample() {
    // Implemented via visualization settings
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.walkthroughManager = new WalkthroughManager();
  window.walkthroughManager.initialize();
});
