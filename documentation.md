# Calculus Visualizer User Guide

## Introduction

Welcome to the Calculus Visualizer, an interactive tool designed to help you understand calculus concepts through intuitive 3D visualizations. This guide will help you navigate the application and get the most out of its features, with detailed descriptions of the user interface.

## Application Appearance

### Overall Design

The Calculus Visualizer features a modern, clean interface with a pleasing color scheme dominated by indigo and teal tones. The layout is intuitive and visually appealing:

- **Color Palette**: Soft indigo (#6366f1) for primary elements, teal (#14b8a6) for secondary actions, with accent colors of rose (#f43f5e) and orange (#fb923c) for highlighting important elements
- **Typography**: Clean, sans-serif Inter font throughout the interface for excellent readability
- **Shadows and Elevation**: Subtle shadows create depth and hierarchy, with important elements like cards slightly elevated from the background
- **Rounded Corners**: All UI elements have gently rounded corners for a modern, friendly appearance
- **Responsive Design**: The interface adapts seamlessly to different screen sizes

### Interface Layout

The application is organized into four main visual sections:

1. **Header (Top)**: A navigation bar with app logo and controls spanning the width of the screen
2. **Visualization Area (Left)**: A large 3D canvas occupying about 70% of the main content area
3. **Control Sidebar (Right)**: A narrower panel (about 30% width) containing controls and options
4. **Footer (Bottom)**: A minimal footer with copyright information

## Getting Started

### Accessing the Application

1. Open the Calculus Visualizer in your web browser
2. The application loads with an animated splash screen that transitions to the main interface
3. The default view shows a 3D graph of a basic function (f(x) = x²) with a pleasing gradient color scheme

### Understanding the Interface

#### Header Area

The top navigation bar contains:

- **Logo**: On the left, featuring a circular calculus symbol with the text "Calculus Visualizer" in the primary indigo color
- **Concept Navigation**: Three text links in the center (Derivatives, Integrals, Limits), with the active concept underlined
- **User Level Control**: A segmented control on the right with three options (Beginner, Expert, Pro), with the active level highlighted in indigo and a smooth sliding animation when switching

#### Visualization Area

The main visualization panel features:

- **3D Canvas**: A large, high-contrast canvas with a subtle grid and coordinate axes
- **Floating Controls**:
  - Top-right: A pill-shaped 2D/3D toggle button with an icon
  - Top-left: A circular play/pause button for animations
  - Bottom-left: Reset view, zoom in/out buttons
  - Bottom-right: Three circular color theme selectors (gradient, height-based, solid)

#### Control Sidebar

The right sidebar contains stacked card elements:

- **Function Input Card**: A white card with subtle shadow containing:
  - Card title "Function Input" in bold
  - Text input field with the current function (e.g., "x²")
  - "Update" button in indigo with white text

- **Controls Card**: Contains concept-specific controls like:
  - Checkboxes with labels
  - Sliders with numerical displays
  - Toggle switches for options

- **Examples Card**: Features a dropdown menu for selecting pre-built examples

- **Explanation Card**: Text area with:
  - Title of the current concept
  - Descriptive paragraphs
  - Mathematical notation when needed
  - Color-coded badges showing the appropriate user level

## Adjusting Your Experience Level

At the top of the screen, you'll find a sleek segmented control for three experience levels:

- **Beginner** (default): Shows simplified controls and basic explanations with larger text and more visual aids
- **Expert**: Reveals additional controls and shows more detailed mathematical explanations including formulas
- **Pro**: Unlocks high-precision controls and advanced visualization options in a separate card at the bottom of the sidebar

When you click a different level, a smooth animation slides an indicator to highlight your choice, and the interface updates instantly to show or hide appropriate controls.

## Core Features

### Exploring Different Calculus Concepts

The top navigation features three concept links with subtle hover effects:

- **Derivatives**: When selected, shows a function with its derivative curve
- **Integrals**: Displays a function with shaded area underneath representing the integral
- **Limits**: Shows a function with point indicators for limit approaches

Clicking a concept triggers a smooth transition animation as the visualization and controls update.

### Working with Custom Functions

The Function Input card provides:

1. A clean text field with subtle border that glows indigo when focused
2. Support for standard mathematical notation: `x^2`, `sin(x)`, `e^x`, `x^3 - 2*x`
3. An "Update" button that triggers a satisfying animation in the visualization when clicked

### Using the Visualization Controls

The 3D visualization includes intuitive controls that appear as floating buttons:

- **2D/3D Toggle**: A pill-shaped button with "3D" label and cube icon that switches to "2D" with a flat icon when toggled
- **Animation Controls**: A circular button with play/pause icon that changes based on state
- **View Controls**: Three circular buttons for reset (curved arrow icon), zoom in (+), and zoom out (-)
- **Color Theme**: Three circular buttons showing miniature versions of the color schemes

The 3D navigation is intuitive:
- **Rotate**: Click and drag to orbit the visualization with smooth motion
- **Pan**: Right-click and drag to move the view with inertia effects
- **Zoom**: Mouse wheel zooms smoothly or use the dedicated zoom buttons

## Exploring Examples

### Car Acceleration Example

When you select "Car Acceleration" from the Examples dropdown, the visualization transforms to show:

- **3D Scene**: A road extending from left to right with distance markers
- **Animated Car**: A sleek, modern car model in red and teal that moves along the path
- **Position Graph**: A blue curve rising above the road showing the position function
- **Velocity Graph**: A red line below the position curve showing the derivative
- **Acceleration Graph**: A teal horizontal line showing the constant acceleration

The animation shows the car smoothly accelerating along the path with wheels that rotate faster as velocity increases.

Controls include:
- **Show Derivative** checkbox that toggles visibility of the red and teal graphs
- **Show Tangent** checkbox that displays a tangent line on the position curve
- **Animation Controls** that start/pause the car movement
- **View Controls** to adjust your perspective of the 3D scene

### Other Examples

Each example transforms the visualization with its own unique 3D scene:

- **Spring Oscillation**: Shows a realistic 3D spring that compresses and extends with overlaid sine waves
- **Wave Propagation**: Displays animated 3D wave surfaces with color gradients representing amplitude
- **Population Growth**: Visualizes growing bar charts or surfaces with time-series overlays
- **Market Equilibrium**: Shows intersecting 3D supply and demand curves with equilibrium points

## Visualization Features

### Derivative Visualization

The derivatives view features:

- **Main Function**: A 3D surface or 2D curve in indigo gradient
- **Derivative Curve**: A red curve showing the derivative value at each point
- **Tangent Line**: An orange line that touches the function at a single point
- **Tangent Point Control**: A slider that smoothly moves the tangent point along the curve
- **Point Indicators**: Small spheres that highlight important points on the curves

### Integral Visualization

The integrals view shows:

- **Main Function**: The function curve in indigo
- **Shaded Area**: A semi-transparent filled region between the curve and x-axis
- **Boundary Controls**: Two draggable handles to set the integration limits
- **Approximation Methods**: Toggleable overlays showing rectangles or trapezoids
- **Result Display**: A prominent box showing the calculated integral value that updates in real-time

### Limit Visualization

The limits visualization features:

- **Function Graph**: The main function with any discontinuities clearly visible
- **Approach Indicators**: Animated arrows showing the approach to the limit point
- **Value Display**: A dynamic readout showing function values as you approach the limit
- **Epsilon-Delta Bands**: Optional visual bands showing the formal definition of limits

## Tips for Better Understanding

- The 3D visualizations respond to your interactions in real-time with smooth animations
- Color coding is consistent throughout: indigo for functions, red for derivatives, teal for second derivatives
- Hover over any control to see a helpful tooltip explaining its purpose
- The explanation panel updates automatically based on what you're currently exploring
- Dark mode is supported and automatically activates based on your system preferences

## Troubleshooting

If you encounter any issues:

- The visualization has a "Reset View" button (circular button with curved arrow) if you lose orientation
- All animations can be paused and restarted using the play/pause button
- Refreshing the page will reset all settings to defaults
- The application works best in modern browsers with WebGL support
- A notification will appear if your browser doesn't support required features

Happy exploring!
