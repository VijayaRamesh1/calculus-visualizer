/**
 * Progress Tracker Module
 * Tracks and displays user progress through the learning materials
 */

class ProgressTracker {
  constructor() {
    // Define module structure
    this.modules = {
      derivatives: {
        title: "Derivatives",
        sections: {
          walkthroughs: [
            { id: "derivatives-intro", title: "Introduction to Derivatives", completed: false },
            { id: "derivatives-applications", title: "Applications of Derivatives", completed: false }
          ],
          quiz: { score: 0, completed: false, lastAttempt: null }
        },
        totalSections: 3,  // 2 walkthroughs + 1 quiz
        completedSections: 0
      },
      integrals: {
        title: "Integrals",
        sections: {
          walkthroughs: [
            { id: "integrals-intro", title: "Understanding Integrals", completed: false }
          ],
          quiz: { score: 0, completed: false, lastAttempt: null }
        },
        totalSections: 2,  // 1 walkthrough + 1 quiz
        completedSections: 0
      },
      limits: {
        title: "Limits",
        sections: {
          walkthroughs: [
            { id: "limits-intro", title: "Exploring Limits", completed: false }
          ],
          quiz: { score: 0, completed: false, lastAttempt: null }
        },
        totalSections: 2,  // 1 walkthrough + 1 quiz
        completedSections: 0
      }
    };
    
    // Theme colors for each module
    this.moduleThemes = {
      derivatives: {
        primary: '#6366f1',  // Indigo
        secondary: '#818cf8',
        accent: '#f43f5e'
      },
      integrals: {
        primary: '#14b8a6',  // Teal
        secondary: '#2dd4bf',
        accent: '#fb923c'
      },
      limits: {
        primary: '#8b5cf6',  // Violet
        secondary: '#a78bfa',
        accent: '#fbbf24'
      }
    };
  }

  initialize() {
    this.loadProgress();
    this.createProgressUI();
    this.refreshProgressDisplay();
  }

  loadProgress() {
    const savedProgress = localStorage.getItem('calculusVisualizerProgress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        
        // Update modules with saved progress
        Object.keys(parsedProgress).forEach(module => {
          if (this.modules[module]) {
            // Update walkthroughs
            if (parsedProgress[module].sections && parsedProgress[module].sections.walkthroughs) {
              parsedProgress[module].sections.walkthroughs.forEach(savedWalkthrough => {
                const walkthrough = this.modules[module].sections.walkthroughs.find(w => w.id === savedWalkthrough.id);
                if (walkthrough) {
                  walkthrough.completed = savedWalkthrough.completed;
                }
              });
            }
            
            // Update quiz
            if (parsedProgress[module].sections && parsedProgress[module].sections.quiz) {
              this.modules[module].sections.quiz = parsedProgress[module].sections.quiz;
            }
            
            // Update completion counts
            this.modules[module].completedSections = parsedProgress[module].completedSections || 0;
          }
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
  }

  saveProgress() {
    try {
      localStorage.setItem('calculusVisualizerProgress', JSON.stringify(this.modules));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  createProgressUI() {
    // Create progress cards for each module
    Object.keys(this.modules).forEach(moduleId => {
      const module = this.modules[moduleId];
      
      // Create module progress card
      const progressCard = document.createElement('div');
      progressCard.className = 'card progress-card';
      progressCard.id = `${moduleId}-progress-card`;
      progressCard.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">Your Progress</h3>
        </div>
        <div class="progress-overview">
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: 0%"></div>
          </div>
          <div class="progress-stats">
            <span class="progress-percentage">0%</span>
            <span class="progress-fraction">0/${module.totalSections}</span>
          </div>
        </div>
        <div class="module-sections">
          <h4>Module Sections</h4>
          <ul class="section-list"></ul>
        </div>
      `;
      
      // Add to DOM (initially hidden, will be shown for active module)
      progressCard.style.display = 'none';
      
      // Find insertion point in the sidebar
      const sidebar = document.querySelector('.controls-sidebar');
      if (sidebar) {
        // Insert after examples card or at the end if not found
        const examplesCard = document.querySelector('#examples-card');
        if (examplesCard) {
          sidebar.insertBefore(progressCard, examplesCard.nextSibling);
        } else {
          sidebar.appendChild(progressCard);
        }
      } else {
        console.warn('Controls sidebar not found for progress card insertion');
      }
    });
    
    // Add summary progress to navigation
    this.addProgressToNav();
  }

  addProgressToNav() {
    // Add progress indicators to the navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const concept = link.getAttribute('data-concept');
      if (concept && this.modules[concept]) {
        const module = this.modules[concept];
        const percentage = Math.round((module.completedSections / module.totalSections) * 100) || 0;
        
        // Create progress indicator
        const indicator = document.createElement('span');
        indicator.className = 'nav-progress-indicator';
        indicator.innerHTML = `
          <svg viewBox="0 0 36 36">
            <path class="progress-circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="progress-circle"
                  stroke-dasharray="${percentage}, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style="stroke: ${this.moduleThemes[concept].primary}"/>
          </svg>
          <span class="progress-text">${percentage}%</span>
        `;
        
        link.appendChild(indicator);
      }
    });
  }

  refreshProgressDisplay() {
    // Update all progress displays
    Object.keys(this.modules).forEach(moduleId => {
      this.updateModuleProgress(moduleId);
    });
  }

  updateModuleProgress(moduleId) {
    const module = this.modules[moduleId];
    if (!module) return;
    
    // Calculate progress percentage
    const percentage = Math.round((module.completedSections / module.totalSections) * 100) || 0;
    
    // Update progress card
    const progressCard = document.getElementById(`${moduleId}-progress-card`);
    if (progressCard) {
      const progressBar = progressCard.querySelector('.progress-bar');
      const progressPercentage = progressCard.querySelector('.progress-percentage');
      const progressFraction = progressCard.querySelector('.progress-fraction');
      
      if (progressBar) progressBar.style.width = `${percentage}%`;
      if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
      if (progressFraction) progressFraction.textContent = `${module.completedSections}/${module.totalSections}`;
      
      // Update section list
      const sectionList = progressCard.querySelector('.section-list');
      if (sectionList) {
        sectionList.innerHTML = ''; // Clear existing items
        
        // Add walkthrough items
        module.sections.walkthroughs.forEach(walkthrough => {
          const listItem = document.createElement('li');
          listItem.className = `section-item ${walkthrough.completed ? 'completed' : ''}`;
          listItem.innerHTML = `
            <span class="section-icon">
              ${walkthrough.completed ? 
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' : 
                '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'
              }
            </span>
            <span class="section-title">${walkthrough.title}</span>
            ${walkthrough.completed ? 
              '<span class="completion-badge">Completed</span>' : 
              `<button class="btn btn-sm btn-outline start-walkthrough" data-walkthrough="${walkthrough.id}">Start</button>`
            }
          `;
          
          sectionList.appendChild(listItem);
          
          // Add event listener to start button if present
          const startButton = listItem.querySelector('.start-walkthrough');
          if (startButton) {
            startButton.addEventListener('click', (e) => {
              const walkthroughId = e.target.getAttribute('data-walkthrough');
              if (window.walkthroughManager) {
                window.walkthroughManager.startWalkthrough(walkthroughId);
              }
            });
          }
        });
        
        // Add quiz item
        const quizItem = document.createElement('li');
        quizItem.className = `section-item ${module.sections.quiz.completed ? 'completed' : ''}`;
        quizItem.innerHTML = `
          <span class="section-icon">
            ${module.sections.quiz.completed ? 
              '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' : 
              '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'
            }
          </span>
          <span class="section-title">Knowledge Check</span>
          ${module.sections.quiz.completed ? 
            `<span class="completion-badge">Score: ${module.sections.quiz.score}%</span>` : 
            `<button class="btn btn-sm btn-outline start-quiz" data-quiz="${moduleId}">Take Quiz</button>`
          }
        `;
        
        sectionList.appendChild(quizItem);
        
        // Add event listener to quiz button if present
        const quizButton = quizItem.querySelector('.start-quiz');
        if (quizButton) {
          quizButton.addEventListener('click', (e) => {
            const quizType = e.target.getAttribute('data-quiz');
            if (window.quizManager) {
              window.quizManager.startQuiz(quizType);
            }
          });
        }
      }
    }
    
    // Update nav progress indicator
    const navLink = document.querySelector(`.nav-link[data-concept="${moduleId}"]`);
    if (navLink) {
      const indicator = navLink.querySelector('.nav-progress-indicator');
      if (indicator) {
        const progressPath = indicator.querySelector('.progress-circle');
        const progressText = indicator.querySelector('.progress-text');
        
        if (progressPath) progressPath.setAttribute('stroke-dasharray', `${percentage}, 100`);
        if (progressText) progressText.textContent = `${percentage}%`;
      }
    }
  }

  showModuleProgress(moduleId) {
    // Hide all progress cards
    document.querySelectorAll('.progress-card').forEach(card => {
      card.style.display = 'none';
    });
    
    // Show the selected module's progress card
    const progressCard = document.getElementById(`${moduleId}-progress-card`);
    if (progressCard) {
      progressCard.style.display = 'block';
    }
    
    // Apply module theme
    if (this.moduleThemes[moduleId]) {
      const theme = this.moduleThemes[moduleId];
      document.documentElement.style.setProperty('--progress-primary-color', theme.primary);
      document.documentElement.style.setProperty('--progress-secondary-color', theme.secondary);
      document.documentElement.style.setProperty('--progress-accent-color', theme.accent);
    }
  }

  markComplete(moduleId, sectionType, sectionId) {
    const module = this.modules[moduleId];
    if (!module) return;
    
    let wasUpdated = false;
    
    if (sectionType === 'walkthrough') {
      // Find and mark walkthrough as completed
      const walkthrough = module.sections.walkthroughs.find(w => w.id === sectionId);
      if (walkthrough && !walkthrough.completed) {
        walkthrough.completed = true;
        module.completedSections++;
        wasUpdated = true;
      }
    }
    
    if (wasUpdated) {
      this.saveProgress();
      this.refreshProgressDisplay();
      
      // Check if module is complete
      this.checkModuleCompletion(moduleId);
    }
  }

  updateQuizScore(moduleId, score) {
    const module = this.modules[moduleId];
    if (!module) return;
    
    const wasAlreadyCompleted = module.sections.quiz.completed;
    
    // Update quiz data
    module.sections.quiz.score = score;
    module.sections.quiz.completed = true;
    module.sections.quiz.lastAttempt = new Date().toISOString();
    
    // Update completion count if not already counted
    if (!wasAlreadyCompleted) {
      module.completedSections++;
    }
    
    this.saveProgress();
    this.refreshProgressDisplay();
    
    // Check if module is complete
    this.checkModuleCompletion(moduleId);
  }

  checkModuleCompletion(moduleId) {
    const module = this.modules[moduleId];
    if (!module) return;
    
    // Check if all sections are complete
    if (module.completedSections >= module.totalSections) {
      // Show completion celebration
      this.showModuleCompletionMessage(moduleId);
      
      // Recommend the next module
      this.recommendNextModule(moduleId);
    }
  }

  showModuleCompletionMessage(moduleId) {
    const module = this.modules[moduleId];
    if (!module) return;
    
    // Create completion message
    const message = document.createElement('div');
    message.className = 'module-completion-message';
    message.innerHTML = `
      <div class="completion-content">
        <div class="completion-icon">🎉</div>
        <h3>Module Completed!</h3>
        <p>Congratulations! You've completed the ${module.title} module.</p>
        <button class="btn btn-primary" id="dismiss-completion">Continue</button>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Add event listener to dismiss button
    document.getElementById('dismiss-completion').addEventListener('click', () => {
      document.body.removeChild(message);
    });
  }

  recommendNextModule(currentModuleId) {
    // Determine the next module to recommend
    const moduleOrder = ['derivatives', 'integrals', 'limits'];
    const currentIndex = moduleOrder.indexOf(currentModuleId);
    
    if (currentIndex >= 0 && currentIndex < moduleOrder.length - 1) {
      const nextModuleId = moduleOrder[currentIndex + 1];
      const nextModule = this.modules[nextModuleId];
      
      // Check if the next module is already completed
      const nextModuleCompleted = nextModule.completedSections >= nextModule.totalSections;
      if (nextModuleCompleted) return;
      
      // Show recommendation
      setTimeout(() => {
        const recommendation = document.createElement('div');
        recommendation.className = 'module-recommendation';
        recommendation.innerHTML = `
          <div class="recommendation-content">
            <h4>Ready for the Next Step?</h4>
            <p>Now that you've mastered ${this.modules[currentModuleId].title}, we recommend exploring ${nextModule.title} next.</p>
            <button class="btn btn-primary" id="go-to-recommended-module" data-module="${nextModuleId}">Explore ${nextModule.title}</button>
            <button class="btn btn-outline" id="dismiss-recommendation">Later</button>
          </div>
        `;
        
        document.body.appendChild(recommendation);
        
        // Add event listeners
        document.getElementById('go-to-recommended-module')?.addEventListener('click', (e) => {
          const moduleId = e.target.getAttribute('data-module');
          document.body.removeChild(recommendation);
          
          // Switch to the recommended module
          const navLink = document.querySelector(`.nav-link[data-concept="${moduleId}"]`);
          if (navLink) navLink.click();
        });
        
        document.getElementById('dismiss-recommendation')?.addEventListener('click', () => {
          document.body.removeChild(recommendation);
        });
      }, 1500);
    }
  }

  getNextIncomplete(moduleId) {
    const module = this.modules[moduleId];
    if (!module) return null;
    
    // Check for incomplete walkthroughs
    const incompleteWalkthrough = module.sections.walkthroughs.find(w => !w.completed);
    if (incompleteWalkthrough) {
      return {
        type: 'walkthrough',
        id: incompleteWalkthrough.id,
        title: incompleteWalkthrough.title
      };
    }
    
    // Check if quiz is incomplete
    if (!module.sections.quiz.completed) {
      return {
        type: 'quiz',
        id: moduleId,
        title: 'Knowledge Check'
      };
    }
    
    return null;
  }

  trackSectionView(moduleId, sectionType, sectionId) {
    // Track which sections the user has viewed
    // This can be used for analytics or to suggest resume points
    
    const viewHistory = JSON.parse(localStorage.getItem('calculusVisualizerViewHistory') || '{}');
    
    // Initialize module history if needed
    if (!viewHistory[moduleId]) {
      viewHistory[moduleId] = {
        sections: {},
        lastViewed: null
      };
    }
    
    // Record view timestamp
    const now = new Date().toISOString();
    viewHistory[moduleId].sections[`${sectionType}-${sectionId}`] = now;
    viewHistory[moduleId].lastViewed = now;
    
    // Save updated history
    localStorage.setItem('calculusVisualizerViewHistory', JSON.stringify(viewHistory));
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.progressTracker = new ProgressTracker();
  window.progressTracker.initialize();
  
  // Setup navigation listeners to show relevant progress
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const concept = e.target.getAttribute('data-concept');
      if (concept && window.progressTracker) {
        window.progressTracker.showModuleProgress(concept);
        window.progressTracker.trackSectionView(concept, 'module', 'overview');
      }
    });
  });
});
