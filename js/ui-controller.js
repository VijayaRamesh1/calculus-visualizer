/**
 * ui-controller.js
 * Handles UI controls, theme switching, and interactive elements
 */

class UIController {
  constructor() {
    // Theme handling
    this.themeToggle = document.getElementById('theme-toggle');
    this.defaultTheme = 'light';
    
    // User level controls
    this.levelButtons = document.querySelectorAll('.level-btn');
    
    // Panel sections with collapsible content
    this.collapsibleTitles = document.querySelectorAll('.section-title.collapsible');
    
    // Parameter sliders and their value displays
    this.parameterSliders = document.querySelectorAll('.parameter-slider');
    
    // Visualizer UI controls
    this.toggleAnimationBtn = document.getElementById('toggle-animation');
    this.toggleDimensionBtn = document.getElementById('toggle-dimension');
    this.resetViewBtn = document.getElementById('reset-view');
    this.visualizationOptions = document.querySelectorAll('.checkbox-control input[type="checkbox"]');
    
    // Initialize UI
    this.initTheme();
    this.attachEventListeners();
    this.initCollapsibleSections();
  }
  
  initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || this.defaultTheme;
    document.body.setAttribute('data-theme', savedTheme);
  }
  
  attachEventListeners() {
    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
    }
    
    // User level controls
    this.levelButtons.forEach(button => {
      button.addEventListener('click', this.setUserLevel.bind(this, button));
    });
    
    // Collapsible sections
    this.collapsibleTitles.forEach(title => {
      title.addEventListener('click', this.toggleSection.bind(this, title));
    });
    
    // Parameter sliders
    this.parameterSliders.forEach(slider => {
      slider.addEventListener('input', this.updateParameterValue.bind(this, slider));
    });
    
    // Visualization controls
    if (this.toggleAnimationBtn) {
      this.toggleAnimationBtn.addEventListener('click', this.toggleAnimation.bind(this));
    }
    
    if (this.toggleDimensionBtn) {
      this.toggleDimensionBtn.addEventListener('click', this.toggleDimension.bind(this));
    }
    
    if (this.resetViewBtn) {
      this.resetViewBtn.addEventListener('click', this.resetView.bind(this));
    }
    
    // Visualization options
    this.visualizationOptions.forEach(checkbox => {
      checkbox.addEventListener('change', this.updateVisualizationOption.bind(this, checkbox));
    });
  }
  
  toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  setUserLevel(clickedButton) {
    // Update active state
    this.levelButtons.forEach(button => {
      button.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    // Set user level
    const level = clickedButton.getAttribute('data-level');
    document.body.setAttribute('data-level', level);
    
    // Event for other components to react to level change
    const event = new CustomEvent('userLevelChanged', { detail: { level: level } });
    document.dispatchEvent(event);
  }
  
  toggleSection(titleElement) {
    const contentElement = titleElement.nextElementSibling;
    
    // Toggle collapsed state
    titleElement.classList.toggle('collapsed');
    
    // Toggle content visibility with animation
    if (titleElement.classList.contains('collapsed')) {
      contentElement.style.maxHeight = '0';
      contentElement.style.opacity = '0';
      
      // Save collapsed state
      localStorage.setItem(`section-${titleElement.textContent.trim()}-collapsed`, 'true');
    } else {
      contentElement.style.maxHeight = contentElement.scrollHeight + 'px';
      contentElement.style.opacity = '1';
      
      // Save expanded state
      localStorage.setItem(`section-${titleElement.textContent.trim()}-collapsed`, 'false');
    }
  }
  
  initCollapsibleSections() {
    // Initialize all collapsible sections based on saved state
    this.collapsibleTitles.forEach(title => {
      const content = title.nextElementSibling;
      const sectionKey = `section-${title.textContent.trim()}-collapsed`;
      const isCollapsed = localStorage.getItem(sectionKey) === 'true';
      
      // Set initial state
      if (isCollapsed) {
        title.classList.add('collapsed');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
      }
      
      // Add transition properties (after initial state to prevent animation on load)
      setTimeout(() => {
        content.style.transition = 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out';
      }, 10);
    });
  }
  
  updateParameterValue(slider) {
    // Find the associated value display
    const container = slider.closest('.slider-with-value');
    const valueDisplay = container.querySelector('.parameter-value');
    
    if (valueDisplay) {
      // Format value with units if needed
      let value = slider.value;
      let unit = '';
      
      // Determine appropriate unit based on slider ID
      if (slider.id === 'initial-velocity') {
        unit = ' m/s';
      } else if (slider.id === 'launch-angle') {
        unit = '°';
      } else if (slider.id === 'gravity') {
        unit = ' m/s²';
      }
      
      // Update display
      valueDisplay.textContent = value + unit;
      
      // Dispatch event for visualization to update
      const event = new CustomEvent('parameterChanged', {
        detail: {
          parameter: slider.id,
          value: parseFloat(value)
        }
      });
      document.dispatchEvent(event);
    }
  }
  
  toggleAnimation() {
    this.toggleAnimationBtn.classList.toggle('active');
    
    // Dispatch event for visualization to handle
    const isAnimating = this.toggleAnimationBtn.classList.contains('active');
    const event = new CustomEvent('animationToggled', {
      detail: { isAnimating: isAnimating }
    });
    document.dispatchEvent(event);
  }
  
  toggleDimension() {
    const dimensionText = this.toggleDimensionBtn.querySelector('span');
    const currentDimension = dimensionText.textContent;
    const newDimension = currentDimension === '3D' ? '2D' : '3D';
    
    dimensionText.textContent = newDimension;
    
    // Dispatch event for visualization to handle
    const event = new CustomEvent('dimensionToggled', {
      detail: { is3D: newDimension === '3D' }
    });
    document.dispatchEvent(event);
  }
  
  resetView() {
    // Dispatch event for visualization to handle
    const event = new CustomEvent('viewReset');
    document.dispatchEvent(event);
    
    // Add visual feedback
    this.resetViewBtn.classList.add('pulse');
    setTimeout(() => {
      this.resetViewBtn.classList.remove('pulse');
    }, 500);
  }
  
  updateVisualizationOption(checkbox) {
    // Dispatch event for visualization to handle
    const event = new CustomEvent('visualizationOptionChanged', {
      detail: {
        option: checkbox.id,
        checked: checkbox.checked
      }
    });
    document.dispatchEvent(event);
  }
  
  // Method to update UI based on loaded example
  updateUIForExample(exampleData) {
    // Update concept heading and description
    const conceptHeading = document.getElementById('concept-heading');
    const conceptDescription = document.getElementById('concept-description');
    
    if (conceptHeading && exampleData.concept) {
      conceptHeading.textContent = exampleData.concept;
    }
    
    if (conceptDescription && exampleData.description) {
      conceptDescription.textContent = exampleData.description;
    }
    
    // Update parameter sliders
    if (exampleData.parameters) {
      Object.entries(exampleData.parameters).forEach(([paramId, paramData]) => {
        const slider = document.getElementById(paramId);
        if (slider) {
          // Update slider attributes
          if (paramData.min !== undefined) slider.min = paramData.min;
          if (paramData.max !== undefined) slider.max = paramData.max;
          if (paramData.step !== undefined) slider.step = paramData.step;
          if (paramData.value !== undefined) {
            slider.value = paramData.value;
            // Trigger update to display the value
            this.updateParameterValue(slider);
          }
        }
      });
    }
    
    // Update visualization options
    if (exampleData.options) {
      Object.entries(exampleData.options).forEach(([optionId, checked]) => {
        const checkbox = document.getElementById(optionId);
        if (checkbox) {
          checkbox.checked = checked;
          // Trigger the change event
          this.updateVisualizationOption(checkbox);
        }
      });
    }
  }
}
