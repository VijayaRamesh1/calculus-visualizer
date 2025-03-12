/**
 * Module Summary Manager
 * Creates summary and recap sections for each module
 */

class ModuleSummaryManager {
  constructor() {
    // Module summaries data
    this.summaries = {
      derivatives: {
        title: "Derivatives Summary",
        description: "The derivative measures the rate of change of a function at any given point.",
        keyPoints: [
          "The derivative of a function f(x) at x = a is the slope of the tangent line at the point (a, f(a)).",
          "If f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹ (Power Rule).",
          "The derivative of sin(x) is cos(x), and the derivative of cos(x) is -sin(x).",
          "The Chain Rule allows us to find the derivative of composite functions.",
          "Applications include finding rates of change, optimization, and motion analysis."
        ],
        formulas: [
          { name: "Definition", formula: "f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h" },
          { name: "Power Rule", formula: "If f(x) = x<sup>n</sup>, then f'(x) = nx<sup>n-1</sup>" },
          { name: "Product Rule", formula: "If h(x) = f(x)·g(x), then h'(x) = f'(x)·g(x) + f(x)·g'(x)" },
          { name: "Chain Rule", formula: "If h(x) = f(g(x)), then h'(x) = f'(g(x))·g'(x)" }
        ],
        nextSteps: [
          { id: "derivatives-applications", title: "Applications of Derivatives" },
          { id: "integrals-intro", title: "Introduction to Integrals" }
        ]
      },
      
      integrals: {
        title: "Integrals Summary",
        description: "An integral represents the area under a curve or the accumulation of quantities.",
        keyPoints: [
          "The definite integral ∫(a to b) f(x) dx represents the net area between f(x) and the x-axis from x = a to x = b.",
          "The indefinite integral ∫f(x) dx gives the family of antiderivative functions F(x) + C.",
          "The Fundamental Theorem of Calculus connects differentiation and integration.",
          "If F'(x) = f(x), then ∫(a to b) f(x) dx = F(b) - F(a).",
          "Applications include finding areas, volumes, and total change over time."
        ],
        formulas: [
          { name: "Indefinite Integral", formula: "∫f(x) dx = F(x) + C, where F'(x) = f(x)" },
          { name: "Power Rule", formula: "∫x<sup>n</sup> dx = x<sup>n+1</sup>/(n+1) + C, for n ≠ -1" },
          { name: "Fundamental Theorem", formula: "∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) - F(a), where F'(x) = f(x)" }
        ],
        nextSteps: [
          { id: "integrals-applications", title: "Applications of Integrals" },
          { id: "limits-intro", title: "Introduction to Limits" }
        ]
      },
      
      limits: {
        title: "Limits Summary",
        description: "A limit describes the value a function approaches as the input approaches a specific value.",
        keyPoints: [
          "The notation lim(x→a) f(x) = L means f(x) approaches L as x approaches a.",
          "A limit exists if the left-hand limit equals the right-hand limit.",
          "A function is continuous at x = a if f(a) is defined, lim(x→a) f(x) exists, and lim(x→a) f(x) = f(a).",
          "Limits can exist even when the function is undefined at that point.",
          "Limits are foundational for both derivatives and integrals."
        ],
        formulas: [
          { name: "Definition", formula: "lim<sub>x→a</sub> f(x) = L if for every ε > 0, there exists δ > 0 such that if 0 < |x - a| < δ, then |f(x) - L| < ε" },
          { name: "Left-hand Limit", formula: "lim<sub>x→a-</sub> f(x) = L if f(x) approaches L as x approaches a from values less than a" },
          { name: "Right-hand Limit", formula: "lim<sub>x→a+</sub> f(x) = L if f(x) approaches L as x approaches a from values greater than a" }
        ],
        nextSteps: [
          { id: "limits-applications", title: "Applications of Limits" },
          { id: "derivatives-intro", title: "Introduction to Derivatives" }
        ]
      }
    };
  }

  initialize() {
    this.createSummaryUI();
    this.setupEventListeners();
  }

  createSummaryUI() {
    // Create summary card container for each module
    Object.keys(this.summaries).forEach(moduleId => {
      const summary = this.summaries[moduleId];
      
      const summaryCard = document.createElement('div');
      summaryCard.className = 'card summary-card';
      summaryCard.id = `${moduleId}-summary-card`;
      summaryCard.innerHTML = `
        <div class="card-header">
          <div class="summary-header">
            <div class="summary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 class="card-title">${summary.title}</h3>
          </div>
        </div>
        <div class="summary-content">
          <p class="summary-description">${summary.description}</p>
          
          <h4>Key Points</h4>
          <ul class="key-points">
            ${summary.keyPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
          
          <h4>Important Formulas</h4>
          <div class="formulas-list">
            ${summary.formulas.map(formula => `
              <div class="formula-item">
                <span class="formula-name">${formula.name}:</span>
                <div class="formula">${formula.formula}</div>
              </div>
            `).join('')}
          </div>
          
          <h4>Next Steps</h4>
          <div class="next-steps">
            ${summary.nextSteps.map(step => `
              <button class="btn btn-outline next-step-btn" data-topic="${step.id}">
                ${step.title}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      
      // Add to DOM (initially hidden, will be shown for active module)
      summaryCard.style.display = 'none';
      
      // Find insertion point in the sidebar
      const sidebar = document.querySelector('.controls-sidebar');
      if (sidebar) {
        sidebar.appendChild(summaryCard);
      } else {
        console.warn('Controls sidebar not found for summary card insertion');
      }
    });
  }

  setupEventListeners() {
    // Next step buttons
    document.querySelectorAll('.next-step-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const topicId = e.target.getAttribute('data-topic');
        this.navigateToTopic(topicId);
      });
    });
  }

  navigateToTopic(topicId) {
    // Extract concept from topic ID (e.g., "derivatives-intro" -> "derivatives")
    const concept = topicId.split('-')[0];
    
    // First navigate to the correct concept tab
    const conceptLink = document.querySelector(`.nav-link[data-concept="${concept}"]`);
    if (conceptLink) {
      conceptLink.click();
    }
    
    // Then start the specific walkthrough if available
    if (window.walkthroughManager) {
      setTimeout(() => {
        window.walkthroughManager.startWalkthrough(topicId);
      }, 300); // Small delay to allow concept switch to complete
    }
  }

  showSummary(moduleId) {
    // Hide all summary cards
    document.querySelectorAll('.summary-card').forEach(card => {
      card.style.display = 'none';
    });
    
    // Show the selected module's summary card
    const summaryCard = document.getElementById(`${moduleId}-summary-card`);
    if (summaryCard) {
      summaryCard.style.display = 'block';
    }
  }

  // Check if the module is completed and show summary
  checkAndShowSummary(moduleId) {
    // Only show summary if module is completed
    if (window.progressTracker) {
      const module = window.progressTracker.modules[moduleId];
      if (module && module.completedSections >= module.totalSections) {
        this.showSummary(moduleId);
      }
    }
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.moduleSummaryManager = new ModuleSummaryManager();
  window.moduleSummaryManager.initialize();
  
  // Connect to progress tracker to show summaries when modules are completed
  if (window.progressTracker) {
    const originalCheckModuleCompletion = window.progressTracker.checkModuleCompletion;
    
    window.progressTracker.checkModuleCompletion = function(moduleId) {
      // Call original method
      originalCheckModuleCompletion.call(this, moduleId);
      
      // Show summary if module is complete
      if (window.moduleSummaryManager) {
        window.moduleSummaryManager.checkAndShowSummary(moduleId);
      }
    };
  }
  
  // Add summary button to the concept explanation area
  const addSummaryButtons = () => {
    const modules = ['derivatives', 'integrals', 'limits'];
    
    modules.forEach(moduleId => {
      const explanationPanel = document.querySelector('#explanation-panel');
      if (explanationPanel) {
        const summaryButton = document.createElement('button');
        summaryButton.className = 'btn btn-outline summary-toggle-btn';
        summaryButton.setAttribute('data-module', moduleId);
        summaryButton.textContent = 'Show Summary';
        summaryButton.style.display = 'none'; // Initially hidden
        
        explanationPanel.appendChild(summaryButton);
        
        // Show only the relevant button when that concept is active
        document.querySelector(`.nav-link[data-concept="${moduleId}"]`)?.addEventListener('click', () => {
          document.querySelectorAll('.summary-toggle-btn').forEach(btn => {
            btn.style.display = 'none';
          });
          summaryButton.style.display = 'block';
        });
        
        // Add click handler
        summaryButton.addEventListener('click', () => {
          window.moduleSummaryManager.showSummary(moduleId);
        });
      }
    });
  };
  
  addSummaryButtons();
});
