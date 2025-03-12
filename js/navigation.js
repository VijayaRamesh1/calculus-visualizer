/**
 * navigation.js
 * Handles all screen navigation and transitions for the Calculus Visualizer
 */

class Navigation {
  constructor() {
    // Initialize screen elements
    this.introScreen = document.getElementById('intro-screen');
    this.exampleSelectScreen = document.getElementById('example-select-screen');
    this.visualizationScreen = document.getElementById('visualization-screen');
    
    // Initialize navigation buttons
    this.backToIntroButton = document.getElementById('back-to-intro');
    this.backToExamplesButton = document.getElementById('back-to-examples');
    this.categoryCards = document.querySelectorAll('.category-card');
    this.exampleCards = document.querySelectorAll('.example-card');
    
    // Current state tracking
    this.currentCategory = null;
    this.currentExample = null;
    
    // Add event listeners
    this.attachEventListeners();
  }
  
  attachEventListeners() {
    // Category selection
    this.categoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const category = card.getAttribute('data-category');
        this.navigateToExampleSelection(category);
      });
    });
    
    // Example selection
    this.exampleCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const example = card.getAttribute('data-example');
        this.navigateToVisualization(example);
      });
    });
    
    // Back navigation
    this.backToIntroButton.addEventListener('click', () => {
      this.navigateBack('intro');
    });
    
    this.backToExamplesButton.addEventListener('click', () => {
      this.navigateBack('examples');
    });
    
    // Focus mode toggle
    const focusModeBtn = document.getElementById('focus-mode-btn');
    if (focusModeBtn) {
      focusModeBtn.addEventListener('click', this.toggleFocusMode.bind(this));
    }
  }
  
  navigateToExampleSelection(category) {
    // Store current category
    this.currentCategory = category;
    
    // Update category title
    const categoryTitle = document.getElementById('category-title');
    categoryTitle.textContent = this.formatCategoryTitle(category);
    
    // Hide all example grids
    const exampleGrids = document.querySelectorAll('.examples-grid');
    exampleGrids.forEach(grid => {
      grid.style.display = 'none';
    });
    
    // Show the appropriate example grid
    const selectedGrid = document.getElementById(`${category}-examples`);
    if (selectedGrid) {
      selectedGrid.style.display = 'grid';
    }
    
    // Transition screens
    this.hideScreen(this.introScreen);
    this.showScreen(this.exampleSelectScreen);
  }
  
  navigateToVisualization(example) {
    // Store current example
    this.currentExample = example;
    
    // Update example title
    const exampleTitle = document.getElementById('example-title');
    exampleTitle.textContent = this.formatExampleTitle(example);
    
    // Load example data and update visualization (implemented in examples-loader.js)
    if (window.examplesLoader) {
      window.examplesLoader.loadExample(example);
    }
    
    // Transition screens
    this.hideScreen(this.exampleSelectScreen);
    this.showScreen(this.visualizationScreen);
  }
  
  navigateBack(target) {
    if (target === 'intro') {
      this.hideScreen(this.exampleSelectScreen);
      this.showScreen(this.introScreen);
      this.currentCategory = null;
    } else if (target === 'examples') {
      this.hideScreen(this.visualizationScreen);
      this.showScreen(this.exampleSelectScreen);
      this.currentExample = null;
      
      // Reset focus mode if active
      document.body.classList.remove('focus-mode');
    }
  }
  
  showScreen(screenElement) {
    screenElement.classList.add('active');
    screenElement.style.display = 'flex';
    
    // Use setTimeout to ensure the display change takes effect before animation
    setTimeout(() => {
      screenElement.style.opacity = '1';
    }, 10);
  }
  
  hideScreen(screenElement) {
    screenElement.style.opacity = '0';
    
    // Use setTimeout to ensure the transition completes before hiding
    setTimeout(() => {
      screenElement.style.display = 'none';
      screenElement.classList.remove('active');
    }, 300); // Match this with your CSS transition time
  }
  
  toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
  }
  
  formatCategoryTitle(category) {
    // Convert category to title case with "Examples" suffix
    return category.charAt(0).toUpperCase() + category.slice(1) + ' Examples';
  }
  
  formatExampleTitle(example) {
    // Convert kebab-case to Title Case
    return example
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
