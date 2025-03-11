/**
 * config.js - User levels and configuration
 */

const Config = {
    // User levels
    USER_LEVELS: {
        BEGINNER: 'beginner',
        EXPERT: 'expert',
        PROFESSIONAL: 'professional'
    },

    // Default user level
    defaultUserLevel: 'beginner',

    // User level definitions
    userLevelDefinitions: {
        beginner: {
            name: 'Beginner',
            description: 'New to calculus concepts with simplified controls',
            showAdvancedControls: false,
            showTechnicalDetails: false,
            showGuidedHelp: true,
            defaultExamples: ['projectile-motion', 'car-acceleration'],
            precision: 2
        },
        expert: {
            name: 'Expert',
            description: 'Comfortable with calculus and wants more control',
            showAdvancedControls: true,
            showTechnicalDetails: true,
            showGuidedHelp: false,
            defaultExamples: ['spring-oscillation', 'population-growth'],
            precision: 4
        },
        professional: {
            name: 'Professional',
            description: 'Advanced user requiring high-precision and detailed controls',
            showAdvancedControls: true,
            showTechnicalDetails: true,
            showGuidedHelp: false,
            showProfessionalTools: true,
            defaultExamples: [],
            precision: 6
        }
    },

    // Persistent storage key
    STORAGE_KEY: 'calculus_visualizer_settings',

    // Get current user level from storage or use default
    getCurrentUserLevel() {
        const settings = this.getSettings();
        return settings.userLevel || this.defaultUserLevel;
    },

    // Get user level definition
    getUserLevelDefinition(level) {
        return this.userLevelDefinitions[level] || this.userLevelDefinitions[this.defaultUserLevel];
    },

    // Set user level and save to storage
    setUserLevel(level) {
        if (this.userLevelDefinitions[level]) {
            const settings = this.getSettings();
            settings.userLevel = level;
            this.saveSettings(settings);
            return true;
        }
        return false;
    },

    // Get all settings from storage
    getSettings() {
        try {
            const settings = localStorage.getItem(this.STORAGE_KEY);
            return settings ? JSON.parse(settings) : {};
        } catch (e) {
            console.error('Error loading settings:', e);
            return {};
        }
    },

    // Save settings to storage
    saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    },

    // Check if a feature should be shown based on current user level
    shouldShowFeature(featureName) {
        const currentLevel = this.getCurrentUserLevel();
        const levelDef = this.getUserLevelDefinition(currentLevel);
        return !!levelDef[featureName];
    }
};
