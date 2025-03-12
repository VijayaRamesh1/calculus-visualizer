/**
 * Chart Utilities for Calculus Visualizer
 * 
 * Provides functionality for creating and manipulating 2D charts and graphs
 * Pure JavaScript implementation without external dependencies
 * Includes:
 * - Line charts
 * - Function graphs
 * - Scatter plots
 * - Coordinate grids
 * - Derivative visualization
 * - Tangent lines
 * - Area under curve (integrals)
 */

class ChartUtils {
    constructor(container) {
        // Create the canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        container.appendChild(this.canvas);
        
        // Get the 2D context
        this.ctx = this.canvas.getContext('2d');
        
        // Store container reference
        this.container = container;
        
        // Default chart settings
        this.settings = {
            padding: 40,
            axisColor: '#666',
            gridColor: '#ddd',
            textColor: '#333',
            lineWidth: 2,
            pointRadius: 4,
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            showGrid: true,
            showAxis: true,
            showLabels: true,
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10,
            xStep: 1,
            yStep: 1
        };
        
        // Handle window resize
        window.addEventListener('resize', () => this.resize());
        
        // Handle theme changes
        window.addEventListener('themechange', (e) => {
            if (e.detail && e.detail.theme) {
                this.updateThemeColors(e.detail.theme);
                this.redraw();
            }
        });
        
        // Initialize theme colors
        this.updateThemeColors(document.body.getAttribute('data-theme') || 'light');
    }
    
    /**
     * Update colors based on theme
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    updateThemeColors(theme) {
        if (theme === 'dark') {
            this.settings.axisColor = '#aaa';
            this.settings.gridColor = '#444';
            this.settings.textColor = '#eee';
            this.settings.backgroundColor = '#1e293b';
        } else {
            this.settings.axisColor = '#666';
            this.settings.gridColor = '#ddd';
            this.settings.textColor = '#333';
            this.settings.backgroundColor = '#ffffff';
        }
    }
    
    /**
     * Resize the canvas to match container size
     */
    resize() {
        if (!this.container) return;
        
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        
        this.redraw();
    }
    
    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = this.settings.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Convert a mathematical x-coordinate to canvas x-coordinate
     * @param {number} x - Mathematical x-coordinate
     * @returns {number} Canvas x-coordinate
     */
    xToCanvas(x) {
        const { padding, xMin, xMax } = this.settings;
        const width = this.canvas.width - 2 * padding;
        
        return padding + (x - xMin) * width / (xMax - xMin);
    }
    
    /**
     * Convert a mathematical y-coordinate to canvas y-coordinate
     * @param {number} y - Mathematical y-coordinate
     * @returns {number} Canvas y-coordinate
     */
    yToCanvas(y) {
        const { padding, yMin, yMax } = this.settings;
        const height = this.canvas.height - 2 * padding;
        
        // Invert y because canvas y increases downward
        return this.canvas.height - padding - (y - yMin) * height / (yMax - yMin);
    }
    
    /**
     * Convert a canvas x-coordinate to mathematical x-coordinate
     * @param {number} x - Canvas x-coordinate
     * @returns {number} Mathematical x-coordinate
     */
    canvasToX(x) {
        const { padding, xMin, xMax } = this.settings;
        const width = this.canvas.width - 2 * padding;
        
        return xMin + (x - padding) * (xMax - xMin) / width;
    }
    
    /**
     * Convert a canvas y-coordinate to mathematical y-coordinate
     * @param {number} y - Canvas y-coordinate
     * @returns {number} Mathematical y-coordinate
     */
    canvasToY(y) {
        const { padding, yMin, yMax } = this.settings;
        const height = this.canvas.height - 2 * padding;
        
        // Invert y because canvas y increases downward
        return yMin + (this.canvas.height - padding - y) * (yMax - yMin) / height;
    }
    
    /**
     * Draw coordinate grid
     */
    drawGrid() {
        const { xMin, xMax, yMin, yMax, xStep, yStep, gridColor, showGrid } = this.settings;
        
        if (!showGrid) return;
        
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 0.5;
        this.ctx.setLineDash([5, 5]);
        
        // Draw vertical grid lines
        for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.xToCanvas(x), this.yToCanvas(yMin));
            this.ctx.lineTo(this.xToCanvas(x), this.yToCanvas(yMax));
            this.ctx.stroke();
        }
        
        // Draw horizontal grid lines
        for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.xToCanvas(xMin), this.yToCanvas(y));
            this.ctx.lineTo(this.xToCanvas(xMax), this.yToCanvas(y));
            this.ctx.stroke();
        }
        
        // Reset dash setting
        this.ctx.setLineDash([]);
    }
    
    /**
     * Draw coordinate axes
     */
    drawAxes() {
        const { xMin, xMax, yMin, yMax, axisColor, showAxis, showLabels, textColor, fontSize, fontFamily } = this.settings;
        
        if (!showAxis) return;
        
        this.ctx.strokeStyle = axisColor;
        this.ctx.lineWidth = 1;
        
        // X-axis (if visible)
        if (yMin <= 0 && yMax >= 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.xToCanvas(xMin), this.yToCanvas(0));
            this.ctx.lineTo(this.xToCanvas(xMax), this.yToCanvas(0));
            this.ctx.stroke();
            
            // X-axis arrow
            this.ctx.beginPath();
            this.ctx.moveTo(this.xToCanvas(xMax), this.yToCanvas(0));
            this.ctx.lineTo(this.xToCanvas(xMax) - 10, this.yToCanvas(0) - 5);
            this.ctx.lineTo(this.xToCanvas(xMax) - 10, this.yToCanvas(0) + 5);
            this.ctx.closePath();
            this.ctx.fillStyle = axisColor;
            this.ctx.fill();
        }
        
        // Y-axis (if visible)
        if (xMin <= 0 && xMax >= 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.xToCanvas(0), this.yToCanvas(yMin));
            this.ctx.lineTo(this.xToCanvas(0), this.yToCanvas(yMax));
            this.ctx.stroke();
            
            // Y-axis arrow
            this.ctx.beginPath();
            this.ctx.moveTo(this.xToCanvas(0), this.yToCanvas(yMax));
            this.ctx.lineTo(this.xToCanvas(0) - 5, this.yToCanvas(yMax) + 10);
            this.ctx.lineTo(this.xToCanvas(0) + 5, this.yToCanvas(yMax) + 10);
            this.ctx.closePath();
            this.ctx.fillStyle = axisColor;
            this.ctx.fill();
        }
        
        if (showLabels) {
            const { xStep, yStep } = this.settings;
            
            this.ctx.fillStyle = textColor;
            this.ctx.font = `${fontSize}px ${fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            
            // X-axis labels
            for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
                if (Math.abs(x) > 0.001) { // Skip zero for clarity
                    this.ctx.fillText(x.toString(), this.xToCanvas(x), this.yToCanvas(0) + 5);
                }
            }
            
            // Y-axis labels
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            
            for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
                if (Math.abs(y) > 0.001) { // Skip zero for clarity
                    this.ctx.fillText(y.toString(), this.xToCanvas(0) - 5, this.yToCanvas(y));
                }
            }
            
            // Axis labels
            this.ctx.fillText('x', this.xToCanvas(xMax) + 15, this.yToCanvas(0));
            this.ctx.fillText('y', this.xToCanvas(0), this.yToCanvas(yMax) - 15);
        }
    }
    
    /**
     * Plot a function
     * @param {Function} func - Function that takes x and returns y
     * @param {string} color - Line color
     * @param {number} lineWidth - Line width
     */
    plotFunction(func, color = '#ff0000', lineWidth = 2) {
        const { xMin, xMax } = this.settings;
        const steps = this.canvas.width;
        const dx = (xMax - xMin) / steps;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        
        let lastY = null;
        let discontinuity = false;
        
        for (let i = 0; i <= steps; i++) {
            const x = xMin + i * dx;
            const y = func(x);
            
            // Check for discontinuities or out-of-range values
            if (isNaN(y) || !isFinite(y)) {
                discontinuity = true;
                continue;
            }
            
            // Start a new path after a discontinuity
            if (discontinuity && lastY !== null) {
                this.ctx.stroke();
                this.ctx.beginPath();
                discontinuity = false;
            }
            
            if (i === 0 || discontinuity) {
                this.ctx.moveTo(this.xToCanvas(x), this.yToCanvas(y));
            } else {
                // Check for large jumps which might indicate discontinuities
                if (lastY !== null && Math.abs(y - lastY) > (this.settings.yMax - this.settings.yMin) / 10) {
                    this.ctx.stroke();
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.xToCanvas(x), this.yToCanvas(y));
                } else {
                    this.ctx.lineTo(this.xToCanvas(x), this.yToCanvas(y));
                }
            }
            
            lastY = y;
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Plot a derivative of a function
     * @param {Function} func - Function that takes x and returns y
     * @param {string} color - Line color
     * @param {number} lineWidth - Line width
     * @param {number} h - Step size for numerical differentiation
     */
    plotDerivative(func, color = '#0000ff', lineWidth = 2, h = 0.001) {
        // Define the derivative function using central difference
        const derivFunc = (x) => {
            return (func(x + h) - func(x - h)) / (2 * h);
        };
        
        // Plot the derivative function
        this.plotFunction(derivFunc, color, lineWidth);
    }
    
    /**
     * Plot a definite integral (area under curve)
     * @param {Function} func - Function that takes x and returns y
     * @param {number} a - Lower bound
     * @param {number} b - Upper bound
     * @param {string} fillColor - Fill color
     * @param {number} alpha - Fill opacity (0-1)
     */
    plotIntegral(func, a, b, fillColor = '#00ff00', alpha = 0.3) {
        const steps = Math.max(Math.floor((b - a) * 100), 100);
        const dx = (b - a) / steps;
        
        this.ctx.fillStyle = fillColor;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        
        // Start at the lower bound
        this.ctx.moveTo(this.xToCanvas(a), this.yToCanvas(0));
        
        // Draw upper curve
        for (let i = 0; i <= steps; i++) {
            const x = a + i * dx;
            const y = func(x);
            
            if (!isNaN(y) && isFinite(y)) {
                this.ctx.lineTo(this.xToCanvas(x), this.yToCanvas(y));
            }
        }
        
        // Back to the x-axis
        this.ctx.lineTo(this.xToCanvas(b), this.yToCanvas(0));
        this.ctx.closePath();
        this.ctx.fill();
        
        // Reset opacity
        this.ctx.globalAlpha = 1.0;
        
        // Draw the bounding lines
        this.ctx.strokeStyle = fillColor;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 3]);
        
        // Lower bound line
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToCanvas(a), this.yToCanvas(0));
        this.ctx.lineTo(this.xToCanvas(a), this.yToCanvas(func(a)));
        this.ctx.stroke();
        
        // Upper bound line
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToCanvas(b), this.yToCanvas(0));
        this.ctx.lineTo(this.xToCanvas(b), this.yToCanvas(func(b)));
        this.ctx.stroke();
        
        // Reset dash setting
        this.ctx.setLineDash([]);
    }
    
    /**
     * Plot a tangent line at a specific point on a function
     * @param {Function} func - Function that takes x and returns y
     * @param {number} x0 - x-coordinate of the point
     * @param {string} color - Line color
     * @param {number} lineWidth - Line width
     * @param {number} length - Length of the tangent line
     * @param {number} h - Step size for numerical differentiation
     */
    plotTangent(func, x0, color = '#ff00ff', lineWidth = 2, length = 2, h = 0.001) {
        const y0 = func(x0);
        
        // Calculate derivative at x0
        const derivative = (func(x0 + h) - func(x0 - h)) / (2 * h);
        
        // Calculate points on the tangent line
        const x1 = x0 - length / 2;
        const y1 = y0 - derivative * (length / 2);
        
        const x2 = x0 + length / 2;
        const y2 = y0 + derivative * (length / 2);
        
        // Draw the tangent line
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToCanvas(x1), this.yToCanvas(y1));
        this.ctx.lineTo(this.xToCanvas(x2), this.yToCanvas(y2));
        this.ctx.stroke();
        
        // Draw the point of tangency
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(this.xToCanvas(x0), this.yToCanvas(y0), 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    /**
     * Plot a series of points (scatter plot)
     * @param {Array} points - Array of {x, y} objects
     * @param {string} color - Point color
     * @param {number} radius - Point radius
     */
    plotPoints(points, color = '#ff0000', radius = 4) {
        this.ctx.fillStyle = color;
        
        points.forEach(point => {
            if (!isNaN(point.x) && !isNaN(point.y) && isFinite(point.x) && isFinite(point.y)) {
                this.ctx.beginPath();
                this.ctx.arc(this.xToCanvas(point.x), this.yToCanvas(point.y), radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }
    
    /**
     * Plot a vector from origin to a point
     * @param {Object} point - End point {x, y}
     * @param {Object} start - Start point {x, y}, defaults to origin
     * @param {string} color - Vector color
     * @param {number} lineWidth - Line width
     */
    plotVector(point, start = {x: 0, y: 0}, color = '#ff9900', lineWidth = 2) {
        const headLength = 10; // Length of the arrow head in pixels
        const headAngle = Math.PI / 6; // 30 degrees
        
        // Draw the line
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToCanvas(start.x), this.yToCanvas(start.y));
        this.ctx.lineTo(this.xToCanvas(point.x), this.yToCanvas(point.y));
        this.ctx.stroke();
        
        // Calculate the arrow head
        const angle = Math.atan2(this.yToCanvas(start.y) - this.yToCanvas(point.y), 
                                 this.xToCanvas(point.x) - this.xToCanvas(start.x));
        
        // Draw the arrow head
        this.ctx.beginPath();
        this.ctx.moveTo(this.xToCanvas(point.x), this.yToCanvas(point.y));
        this.ctx.lineTo(
            this.xToCanvas(point.x) - headLength * Math.cos(angle - headAngle),
            this.yToCanvas(point.y) + headLength * Math.sin(angle - headAngle)
        );
        this.ctx.lineTo(
            this.xToCanvas(point.x) - headLength * Math.cos(angle + headAngle),
            this.yToCanvas(point.y) + headLength * Math.sin(angle + headAngle)
        );
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    /**
     * Add a text label to the chart
     * @param {string} text - Text to display
     * @param {Object} position - Position {x, y}
     * @param {string} color - Text color
     * @param {string} align - Text alignment ('left', 'center', 'right')
     * @param {string} baseline - Text baseline ('top', 'middle', 'bottom')
     */
    addLabel(text, position, color = '#000000', align = 'center', baseline = 'middle') {
        const { fontSize, fontFamily } = this.settings;
        
        this.ctx.fillStyle = color;
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, this.xToCanvas(position.x), this.yToCanvas(position.y));
    }
    
    /**
     * Set the viewing window
     * @param {number} xMin - Minimum x value
     * @param {number} xMax - Maximum x value
     * @param {number} yMin - Minimum y value
     * @param {number} yMax - Maximum y value
     * @param {number} xStep - Step size for x-axis grid and labels
     * @param {number} yStep - Step size for y-axis grid and labels
     */
    setWindow(xMin, xMax, yMin, yMax, xStep = 1, yStep = 1) {
        this.settings.xMin = xMin;
        this.settings.xMax = xMax;
        this.settings.yMin = yMin;
        this.settings.yMax = yMax;
        this.settings.xStep = xStep;
        this.settings.yStep = yStep;
        
        this.redraw();
    }
    
    /**
     * Redraw the chart (called after changes)
     */
    redraw() {
        this.clear();
        this.drawGrid();
        this.drawAxes();
    }
}

// Export the ChartUtils class for use in other modules
export default ChartUtils;