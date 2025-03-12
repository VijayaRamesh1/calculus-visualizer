/**
 * UI Core for Calculus Visualizer
 * 
 * Provides functionality for common UI elements and interactions
 * - Collapsible panels
 * - Parameter controls
 * - Theme management
 * - Responsive layout
 * - Focus mode
 */

class UICore {
    constructor() {
        // Default theme (light/dark)
        this.theme = 'light';
        
        // Selectors for common elements
        this.selectors = {
            theme: '[data-theme]',
            themeToggle: '#theme-toggle',
            collapsible: '.section-title.collapsible',
            parameterSlider: '.parameter-slider',
            checkbox: '.checkbox-control input[type="checkbox"]',
            focusMode: '#focus-mode-btn'
        };
        
        // Initialize UI controls
        this.initThemeToggle();
        this.initCollapsiblePanels();
        this.initParameterControls();
        this.initFocusMode();
    }
    
    /**
     * Initialize theme toggle functionality
     */
    initThemeToggle() {
        const toggle = document.querySelector(this.selectors.themeToggle);
        if (!toggle) return;
        
        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const body = document.querySelector('body');
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        this.theme = newTheme;
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    }
    
    /**
     * Set specific theme
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') return;
        
        const body = document.querySelector('body');
        body.setAttribute('data-theme', theme);
        this.theme = theme;
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    /**
     * Initialize collapsible panels
     */
    initCollapsiblePanels() {
        const collapsibles = document.querySelectorAll(this.selectors.collapsible);
        
        collapsibles.forEach(header => {
            header.addEventListener('click', () => {
                // Toggle collapsed class
                header.classList.toggle('collapsed');
                
                // Toggle content visibility
                const content = header.nextElementSibling;
                if (content && content.classList.contains('section-content')) {
                    if (header.classList.contains('collapsed')) {
                        content.style.maxHeight = '0';
                        content.style.opacity = '0';
                        content.style.padding = '0';
                        content.style.overflow = 'hidden';
                    } else {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        content.style.opacity = '1';
                        content.style.padding = '';
                        content.style.overflow = '';
                    }
                }
            });
        });
    }
    
    /**
     * Initialize parameter controls (sliders, inputs)
     */
    initParameterControls() {
        // Initialize sliders
        const sliders = document.querySelectorAll(this.selectors.parameterSlider);
        
        sliders.forEach(slider => {
            const valueDisplay = slider.parentElement.querySelector('.parameter-value');
            
            // Set initial value
            if (valueDisplay) {
                this.updateSliderValueDisplay(slider, valueDisplay);
            }
            
            // Add event listener for changes
            slider.addEventListener('input', () => {
                if (valueDisplay) {
                    this.updateSliderValueDisplay(slider, valueDisplay);
                }
                
                // Dispatch change event
                slider.dispatchEvent(new CustomEvent('parameter-change', {
                    bubbles: true,
                    detail: { 
                        id: slider.id,
                        value: parseFloat(slider.value)
                    }
                }));
            });
        });
        
        // Initialize checkboxes
        const checkboxes = document.querySelectorAll(this.selectors.checkbox);
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                // Dispatch change event
                checkbox.dispatchEvent(new CustomEvent('parameter-change', {
                    bubbles: true,
                    detail: { 
                        id: checkbox.id,
                        value: checkbox.checked
                    }
                }));
            });
        });
    }
    
    /**
     * Update slider value display
     * @param {HTMLElement} slider - The slider element
     * @param {HTMLElement} valueDisplay - The element to display the value in
     */
    updateSliderValueDisplay(slider, valueDisplay) {
        // Get units from attribute or empty string
        const units = slider.dataset.units || '';
        
        // Get precision from attribute or default to 1
        const precision = parseInt(slider.dataset.precision || '1');
        
        // Format value
        const value = parseFloat(slider.value).toFixed(precision);
        
        // Update display
        valueDisplay.textContent = `${value}${units}`;
    }
    
    /**
     * Initialize focus mode
     */
    initFocusMode() {
        const focusModeBtn = document.querySelector(this.selectors.focusMode);
        if (!focusModeBtn) return;
        
        focusModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('focus-mode');
            
            // Update button text
            if (document.body.classList.contains('focus-mode')) {
                focusModeBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 9L2 2M9 15L2 22M15 9L22 2M15 15L22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Exit Focus
                `;
            } else {
                focusModeBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Focus Mode
                `;
            }
            
            // Dispatch focus mode change event
            window.dispatchEvent(new CustomEvent('focusmodechange', { 
                detail: { 
                    focusMode: document.body.classList.contains('focus-mode')
                }
            }));
        });
    }
    
    /**
     * Register a parameter change handler
     * @param {string} parameterId - ID of the parameter element
     * @param {Function} handler - Function to call when parameter changes
     */
    onParameterChange(parameterId, handler) {
        document.addEventListener('parameter-change', event => {
            if (event.detail && event.detail.id === parameterId) {
                handler(event.detail.value);
            }
        });
    }
    
    /**
     * Update a parameter control value
     * @param {string} parameterId - ID of the parameter element
     * @param {number|boolean} value - New value for the parameter
     */
    setParameterValue(parameterId, value) {
        const element = document.getElementById(parameterId);
        if (!element) return;
        
        if (element.type === 'checkbox') {
            element.checked = Boolean(value);
        } else if (element.type === 'range' || element.type === 'number') {
            element.value = value;
            
            // Update display if it's a slider
            const valueDisplay = element.parentElement.querySelector('.parameter-value');
            if (valueDisplay) {
                this.updateSliderValueDisplay(element, valueDisplay);
            }
        }
    }
    
    /**
     * Add animation class to an element
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - Animation class to add
     */
    animateElement(element, animationClass) {
        if (!element) return;
        
        // Remove any existing animation classes
        element.classList.remove('fade-in', 'slide-in-right', 'slide-in-up');
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Add the animation class
        element.classList.add(animationClass);
    }
    
    /**
     * Show a section and hide others
     * @param {string} sectionId - ID of the section to show
     */
    showSection(sectionId) {
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Hide all sections first
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the requested section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.animateElement(targetSection, 'fade-in');
        }
    }
}

// Export the UICore class for use in other modules
export default UICore;