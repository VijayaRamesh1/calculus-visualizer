# Calculus Visualizer

An interactive tool for visualizing calculus concepts through 3D representations and real-world examples.

## Enhanced Accessibility Features

This branch contains accessibility enhancements that implement the following key UX/UI design principles:

### Accessibility Principles
- **Perceptibility**: Content is perceptible to all users through improved color contrast, semantic HTML, ARIA labels, and keyboard focus indicators.
- **Operability**: All functionality is usable through keyboard navigation and touch interfaces, with clear focus states and reduced motion options.
- **Simplicity**: The interface is designed to be intuitive, with clear content structure and progressive disclosure of complex information.
- **Forgiveness**: The system helps prevent errors and provides clear feedback with easy recovery options.

### UI/UX Design Principles Implemented
- **Aesthetic-Usability Effect**: Improved visual design while maintaining accessibility.
- **Affordance**: Clear visual and interactive cues for all interface elements.
- **Consistency**: Uniform patterns for interactions, visual style, and behavior.
- **Constraint**: Limiting options to prevent errors, particularly in complex interactions.
- **Control**: Users can customize their experience with theme options and focus mode.
- **Cost-Benefit**: Optimized interactions to minimize user effort.
- **Entry Point**: Simplified landing page with clear paths to different modules.
- **Feedback Loop**: Immediate visual, auditory, and haptic feedback for user actions.
- **Flexibility-Usability Tradeoff**: Balanced specialized features with overall usability.
- **Legibility**: Enhanced typography with proper font sizes, contrast, and spacing.
- **Mapping**: Intuitive relationship between controls and their effects.
- **Mental Model**: Interface aligned with users' understanding of calculus concepts.
- **Ockham's Razor**: Simplified design elements for clarity.
- **Performance Load**: Reduced cognitive effort through clear organization.
- **Progressive Disclosure**: Complex information presented gradually.
- **Proximity**: Related elements grouped visually and functionally.
- **Recognition Over Recall**: Clear labels and familiar patterns.
- **Signal-to-Noise Ratio**: Maximized relevant information and minimized distractions.
- **Visibility**: Clear system status and available actions.

## Key Improvements

1. **Screen Reader Support**: 
   - Semantic HTML5 structure with proper landmarks
   - ARIA attributes for dynamic content
   - Live regions for updates
   - Alternative text for visual elements

2. **Keyboard Navigation**:
   - Proper focus management
   - Visible focus indicators
   - Skip navigation links
   - Keyboard shortcuts with a visible reference

3. **Visual Accessibility**:
   - High contrast color scheme
   - Dark mode support
   - Proper text sizing and spacing
   - Support for browser zoom

4. **Cognitive Accessibility**:
   - Consistent layout and interaction patterns
   - Clear instructions and feedback
   - Progressive disclosure of complex information
   - Focus mode for distraction-free learning
   - Simplified language and consistent terminology

5. **Technical Improvements**:
   - Responsive design for various devices
   - Reduced motion preference detection
   - High contrast mode support
   - Error prevention and recovery mechanisms
   - Proper form labeling and validation

## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser
3. Explore the different calculus modules

## Keyboard Shortcuts

- `Alt + T`: Toggle dark/light theme
- `Alt + F`: Toggle focus mode
- `Alt + K` or `?`: Show keyboard shortcuts
- `Alt + R`: Reset visualization
- `Space`: Play/pause animation (when not focused on input controls)
- `Tab`: Navigate through interactive elements

## Accessibility Statement

See our full [Accessibility Statement](accessibility.html) for details on our approach to accessibility, conformance status, and known limitations.

## License

MIT

## Acknowledgments

- [Three.js](https://threejs.org/) for 3D visualizations
- [MathJS](https://mathjs.org/) for mathematical functions