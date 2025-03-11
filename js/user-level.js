/**
 * user-level.js - User level management and onboarding
 */

const UserLevelManager = {
    init() {
        this.setupUserLevelSelector();
        this.applyUserLevel();
        this.checkForOnboarding();
    },

    setupUserLevelSelector() {
        const selector = document.getElementById('user-level-selector');
        if (!selector) return;

        // Set initial value
        selector.value = Config.getCurrentUserLevel();
        
        // Add change listener
        selector.addEventListener('change', (e) => {
            const newLevel = e.target.value;
            if (Config.setUserLevel(newLevel)) {
                this.applyUserLevel();
                this.showOnboarding(newLevel);
            }
        });
    },

    applyUserLevel() {
        const level = Config.getCurrentUserLevel();
        const levelDef = Config.getUserLevelDefinition(level);
        
        // Apply class to body
        document.body.classList.remove('user-level-beginner', 'user-level-expert', 'user-level-professional');
        document.body.classList.add(`user-level-${level}`);
        
        // Update UI elements based on level
        this.updateUIForLevel(level, levelDef);
        
        console.log(`Applied user level: ${level}`);
    },

    updateUIForLevel(level, levelDef) {
        // Update precision display in numerical outputs
        const precisionElements = document.querySelectorAll('[data-precision]');
        precisionElements.forEach(el => {
            if (el.dataset.originalValue) {
                const value = parseFloat(el.dataset.originalValue);
                el.textContent = value.toFixed(levelDef.precision);
            }
        });
        
        // Update any level badges
        const badges = document.querySelectorAll('.current-level-name');
        badges.forEach(badge => {
            badge.textContent = levelDef.name;
        });
        
        // Conditional display based on level
        this.updateControlVisibility(levelDef);
    },
    
    updateControlVisibility(levelDef) {
        // Hide/show controls based on level definition
        if (!levelDef.showAdvancedControls) {
            document.querySelectorAll('.advanced-control').forEach(el => {
                el.style.display = 'none';
            });
        } else {
            document.querySelectorAll('.advanced-control').forEach(el => {
                el.style.display = '';
            });
        }
        
        // Professional tools
        if (levelDef.showProfessionalTools) {
            document.querySelectorAll('.professional-tool').forEach(el => {
                el.style.display = '';
            });
        } else {
            document.querySelectorAll('.professional-tool').forEach(el => {
                el.style.display = 'none';
            });
        }
    },

    checkForOnboarding() {
        const settings = Config.getSettings();
        const currentLevel = Config.getCurrentUserLevel();
        
        // Check if this level has been seen before
        if (!settings.onboardedLevels || !settings.onboardedLevels.includes(currentLevel)) {
            this.showOnboarding(currentLevel);
            
            // Update onboarded levels
            settings.onboardedLevels = settings.onboardedLevels || [];
            if (!settings.onboardedLevels.includes(currentLevel)) {
                settings.onboardedLevels.push(currentLevel);
            }
            Config.saveSettings(settings);
        }
    },

    showOnboarding(level) {
        const levelDef = Config.getUserLevelDefinition(level);
        
        // Create onboarding elements
        const overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'onboarding-modal';
        
        // Build modal content based on level
        let features = [];
        switch(level) {
            case Config.USER_LEVELS.BEGINNER:
                features = [
                    'Simplified controls for easier learning',
                    'Guided tooltips explaining each concept',
                    'Basic examples with real-world applications',
                    'Visual glossary of calculus terms'
                ];
                break;
            case Config.USER_LEVELS.EXPERT:
                features = [
                    'Advanced parameter controls',
                    'Detailed mathematical explanations',
                    'Ability to save and load configurations',
                    'Comparative visualizations between concepts'
                ];
                break;
            case Config.USER_LEVELS.PROFESSIONAL:
                features = [
                    'High-precision calculations',
                    'Multiple visualization views',
                    'Export functionality for presentations',
                    'Advanced customization options'
                ];
                break;
        }
        
        // Create modal content
        modal.innerHTML = `
            <div class="onboarding-header">
                <div class="onboarding-level-icon icon-${level}">
                    ${level.charAt(0).toUpperCase()}
                </div>
                <h2>Welcome to ${levelDef.name} Mode</h2>
            </div>
            <div class="onboarding-content">
                <p>${levelDef.description}</p>
                <p>Features available in this mode:</p>
                <ul class="feature-list">
                    ${features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            <div class="onboarding-actions">
                <button class="btn btn-secondary" id="switch-level-btn">Switch Level</button>
                <button class="btn btn-primary" id="continue-btn">Continue</button>
            </div>
        `;
        
        // Add to document
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('continue-btn').addEventListener('click', () => {
            overlay.remove();
        });
        
        document.getElementById('switch-level-btn').addEventListener('click', () => {
            overlay.remove();
            document.getElementById('user-level-selector').focus();
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UserLevelManager.init();
});
