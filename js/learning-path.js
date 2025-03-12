/**
 * Learning Path Manager
 * Enables customizable learning paths based on user preferences and progress
 */

class LearningPathManager {
  constructor() {
    this.preferences = {
      visualLearning: false,
      applicationsFocus: false,
      challengeLevel: 'standard' // standard, advanced
    };
    
    // Define topic dependencies and prerequisites
    this.topicGraph = {
      'derivatives-intro': {
        prerequisites: [],
        next: ['derivatives-applications']
      },
      'derivatives-applications': {
        prerequisites: ['derivatives-intro'],
        next: ['integrals-intro']
      },
      'integrals-intro': {
        prerequisites: ['derivatives-intro'],
        next: ['limits-intro']
      },
      'limits-intro': {
        prerequisites: [],
        next: []
      }
    };
    
    // Define learning styles and their impact on recommendations
    this.learningStyles = {
      visualLearning: {
        prioritize: ['3d-visualizations', 'interactive-examples'],
        deprioritize: ['formula-explanations', 'proofs']
      },
      applicationsFocus: {
        prioritize: ['real-world-examples', 'applied-problems'],
        deprioritize: ['theoretical-concepts', 'abstract-math']
      }
    };
  }

  initialize() {
    this.loadPreferences();
    this.createLearningPathUI();
    this.setupEventListeners();
  }

  loadPreferences() {
    const savedPreferences = localStorage.getItem('calculusVisualizerPreferences');
    if (savedPreferences) {
      try {
        this.preferences = {...this.preferences, ...JSON.parse(savedPreferences)};
      } catch (e) {
        console.error('Error loading learning preferences:', e);
      }
    }
  }

  savePreferences() {
    try {
      localStorage.setItem('calculusVisualizerPreferences', JSON.stringify(this.preferences));
    } catch (e) {
      console.error('Error saving learning preferences:', e);
    }
  }

  createLearningPathUI() {
    // Create learning path card
    const learningPathCard = document.createElement('div');
    learningPathCard.className = 'card learning-path-card';
    learningPathCard.id = 'learning-path-card';
    learningPathCard.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">Your Learning Path</h3>
      </div>
      <div class="learning-path-content">
        <div class="path-section">
          <h4>Recommended Next</h4>
          <div class="recommended-topics"></div>
        </div>
        <div class="path-section">
          <h4>Customize Your Path</h4>
          <div class="learning-preferences">
            <label>
              <input type="checkbox" class="preference-checkbox" data-pref="visualLearning" ${this.preferences.visualLearning ? 'checked' : ''}>
              Visual Learning
            </label>
            <label>
              <input type="checkbox" class="preference-checkbox" data-pref="applicationsFocus" ${this.preferences.applicationsFocus ? 'checked' : ''}>
              Focus on Applications
            </label>
            <label>
              <input type="checkbox" class="preference-checkbox" data-pref="challengeLevel" data-value="advanced" ${this.preferences.challengeLevel === 'advanced' ? 'checked' : ''}>
              Challenge Me
            </label>
          </div>
        </div>
      </div>
      <button class="btn btn-primary" id="update-learning-path">Update Path</button>
    `;
    
    // Add to DOM
    const sidebar = document.querySelector('.controls-sidebar');
    if (sidebar) {
      sidebar.appendChild(learningPathCard);
    } else {
      console.warn('Controls sidebar not found for learning path card insertion');
    }
  }

  setupEventListeners() {
    // Update button
    document.getElementById('update-learning-path')?.addEventListener('click', () => {
      this.updatePreferences();
      this.generateRecommendations();
      
      // Show confirmation
      this.showNotification('Learning path updated based on your preferences!');
    });
    
    // Preference checkboxes
    document.querySelectorAll('.preference-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        // Mark the path as needing update
        const updateButton = document.getElementById('update-learning-path');
        if (updateButton) {
          updateButton.classList.add('btn-attention');
          updateButton.textContent = 'Update Path*';
        }
      });
    });
  }

  updatePreferences() {
    // Get values from UI
    document.querySelectorAll('.preference-checkbox').forEach(checkbox => {
      const pref = checkbox.getAttribute('data-pref');
      const value = checkbox.getAttribute('data-value') || true;
      
      if (pref === 'challengeLevel') {
        this.preferences.challengeLevel = checkbox.checked ? 'advanced' : 'standard';
      } else if (pref) {
        this.preferences[pref] = checkbox.checked;
      }
    });
    
    // Save updated preferences
    this.savePreferences();
    
    // Reset update button state
    const updateButton = document.getElementById('update-learning-path');
    if (updateButton) {
      updateButton.classList.remove('btn-attention');
      updateButton.textContent = 'Update Path';
    }
  }

  generateRecommendations() {
    // Get user progress
    let userProgress = {};
    
    if (window.progressTracker) {
      userProgress = window.progressTracker.modules;
    }
    
    // Determine completed topics
    const completedTopics = [];
    const modules = ['derivatives', 'integrals', 'limits'];
    
    modules.forEach(module => {
      if (userProgress[module]) {
        userProgress[module].sections.walkthroughs.forEach(walkthrough => {
          if (walkthrough.completed) {
            completedTopics.push(walkthrough.id);
          }
        });
      }
    });
    
    // Find available next topics (prerequisites met, not yet completed)
    const availableTopics = [];
    
    Object.keys(this.topicGraph).forEach(topicId => {
      const topic = this.topicGraph[topicId];
      
      // Skip if already completed
      if (completedTopics.includes(topicId)) return;
      
      // Check if all prerequisites are completed
      const prerequisitesMet = topic.prerequisites.every(prereq => 
        completedTopics.includes(prereq)
      );
      
      if (prerequisitesMet) {
        availableTopics.push(topicId);
      }
    });
    
    // Score and sort available topics based on preferences
    const scoredTopics = availableTopics.map(topicId => {
      let score = 0;
      
      // Priority for topics that come after completed ones
      completedTopics.forEach(completedId => {
        if (this.topicGraph[completedId].next.includes(topicId)) {
          score += 10;
        }
      });
      
      // Adjust based on learning preferences
      if (this.preferences.visualLearning) {
        if (topicId.includes('3d') || topicId.includes('visual')) score += 5;
      }
      
      if (this.preferences.applicationsFocus) {
        if (topicId.includes('application')) score += 5;
      }
      
      return { id: topicId, score };
    });
    
    // Sort by score (highest first)
    scoredTopics.sort((a, b) => b.score - a.score);
    
    // Get top 3 recommendations (or fewer if not available)
    const recommendations = scoredTopics.slice(0, 3);
    
    // Update UI with recommendations
    this.displayRecommendations(recommendations);
  }

  displayRecommendations(recommendations) {
    const container = document.querySelector('.recommended-topics');
    if (!container) return;
    
    // Clear existing recommendations
    container.innerHTML = '';
    
    if (recommendations.length === 0) {
      container.innerHTML = `
        <div class="empty-recommendations">
          <p>Great job! You've completed all available topics.</p>
        </div>
      `;
      return;
    }
    
    // Map topic IDs to readable names
    const topicNames = {
      'derivatives-intro': 'Introduction to Derivatives',
      'derivatives-applications': 'Applications of Derivatives',
      'integrals-intro': 'Understanding Integrals',
      'limits-intro': 'Exploring Limits'
    };
    
    // Add recommendations to UI
    recommendations.forEach(recommendation => {
      const topicElement = document.createElement('div');
      topicElement.className = 'recommended-topic';
      
      const topicName = topicNames[recommendation.id] || recommendation.id;
      
      topicElement.innerHTML = `
        <span class="topic-title">${topicName}</span>
        <button class="btn btn-sm btn-outline start-topic" data-topic="${recommendation.id}">Start</button>
      `;
      
      container.appendChild(topicElement);
      
      // Add event listener to start button
      topicElement.querySelector('.start-topic').addEventListener('click', (e) => {
        const topicId = e.target.getAttribute('data-topic');
        this.startTopic(topicId);
      });
    });
  }

  startTopic(topicId) {
    // Start the relevant walkthrough
    if (window.walkthroughManager) {
      window.walkthroughManager.startWalkthrough(topicId);
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'path-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <p>${message}</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // This is called when a concept is selected in the nav
  refreshForConcept(concept) {
    // Generate initial recommendations based on the active concept
    this.generateRecommendations();
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.learningPathManager = new LearningPathManager();
  window.learningPathManager.initialize();
  
  // Connect to nav links to update recommendations when concept changes
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const concept = e.target.getAttribute('data-concept');
      if (concept && window.learningPathManager) {
        window.learningPathManager.refreshForConcept(concept);
      }
    });
  });
});
