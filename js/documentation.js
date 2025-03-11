/**
 * documentation.js - Level-specific documentation and content
 */

const Documentation = {
    /**
     * Concept documentation by user level
     */
    concepts: {
        derivatives: {
            beginner: {
                title: "Derivatives - The Basics",
                explanation: `
                    <p>A derivative shows how quickly a function changes at any point. Think of it as the <strong>slope</strong> of the curve at that point.</p>
                    
                    <p>When driving a car, your <strong>speed</strong> is the derivative of your position. When you speed up, the derivative increases!</p>
                    
                    <div class="concept-image">
                        <img src="https://images.unsplash.com/photo-1580942151273-8c2371f926fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" alt="Car speedometer" />
                        <p class="caption">Your car's speedometer measures the derivative of your position</p>
                    </div>
                    
                    <p>Use the controls to:</p>
                    <ul>
                        <li>See the derivative curve (f'(x))</li>
                        <li>Examine a tangent line at any point</li>
                        <li>Observe how the slope changes</li>
                    </ul>
                    
                    <div class="math-formula">
                        f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h
                        <span class="formula-caption">The formal definition of a derivative</span>
                    </div>
                `
            },
            expert: {
                title: "Derivatives - Advanced Analysis",
                explanation: `
                    <p>The derivative represents the instantaneous rate of change of a function with respect to its independent variable. Geometrically, it's the slope of the tangent line to the graph at a specific point.</p>
                    
                    <p>The derivative is fundamental to calculus and has numerous applications in physics, economics, and engineering. The functions f'(x), f''(x), and higher derivatives provide insight into the behavior of the original function.</p>
                    
                    <div class="math-formula">
                        f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)] / h
                        <span class="formula-caption">Limit definition of the derivative</span>
                    </div>
                    
                    <p>Key derivative properties:</p>
                    <ul>
                        <li>When f'(x) > 0, the function is increasing</li>
                        <li>When f'(x) < 0, the function is decreasing</li>
                        <li>When f'(x) = 0, the function has a critical point (potential extrema)</li>
                        <li>The second derivative f''(x) indicates concavity</li>
                    </ul>
                    
                    <p>Common derivative rules:</p>
                    <ul>
                        <li>Power Rule: d/dx[x<sup>n</sup>] = n·x<sup>n-1</sup></li>
                        <li>Product Rule: d/dx[f(x)·g(x)] = f'(x)·g(x) + f(x)·g'(x)</li>
                        <li>Chain Rule: d/dx[f(g(x))] = f'(g(x))·g'(x)</li>
                    </ul>
                `
            },
            professional: {
                title: "Derivatives - Analytical Framework",
                explanation: `
                    <p>The derivative represents the instantaneous rate of change of a function with respect to its independent variable. For a function f: ℝ → ℝ, the derivative at a point x₀ is defined as:</p>
                    
                    <div class="math-formula">
                        f'(x₀) = lim<sub>x→x₀</sub> [f(x) - f(x₀)] / (x - x₀) = lim<sub>h→0</sub> [f(x₀+h) - f(x₀)] / h
                    </div>
                    
                    <p>When the function is differentiable on an interval, we can analyze its behavior using differential calculus. The derivative operator D maps a function to its derivative function.</p>
                    
                    <p>Differential analysis framework:</p>
                    <ul>
                        <li>First derivative test: Critical points occur at x where f'(x) = 0 or f'(x) is undefined</li>
                        <li>Second derivative test: If f'(x₀) = 0 and f''(x₀) > 0, then f has a local minimum at x₀</li>
                        <li>Taylor series expansion: f(x) = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...</li>
                    </ul>
                    
                    <p>The visualization allows precise examination of function behavior, critical points, and higher-order derivatives. Professional tools include higher-precision calculations and advanced analytical methods.</p>
                    
                    <p>Differential operators form a rich algebraic structure, with rules governing their composition, inversion, and application to function spaces.</p>
                `
            }
        },
        integrals: {
            beginner: {
                title: "Integrals - The Basics",
                explanation: `
                    <p>An integral represents the <strong>area under a curve</strong>. It's like adding up all the little pieces between the function and the x-axis.</p>
                    
                    <p>If a car's speed is measured over time, the integral of speed gives the <strong>total distance traveled</strong>.</p>
                    
                    <div class="concept-image">
                        <img src="https://images.unsplash.com/photo-1520586492-c5ae8f975ce7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" alt="Distance marker" />
                        <p class="caption">Distance traveled is the integral of speed over time</p>
                    </div>
                    
                    <p>Use the controls to:</p>
                    <ul>
                        <li>See the area under the curve</li>
                        <li>Change the range of integration</li>
                        <li>View the antiderivative function (F(x))</li>
                    </ul>
                    
                    <div class="math-formula">
                        ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) - F(a)
                        <span class="formula-caption">The Fundamental Theorem of Calculus</span>
                    </div>
                `
            },
            expert: {
                title: "Integrals - Advanced Analysis",
                explanation: `
                    <p>Integration is the inverse operation of differentiation. A definite integral represents the signed area between the function and the x-axis over a specific interval, while an indefinite integral represents a family of antiderivative functions.</p>
                    
                    <div class="math-formula">
                        ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) - F(a)
                        <span class="formula-caption">Fundamental Theorem of Calculus</span>
                    </div>
                    
                    <p>Integration techniques:</p>
                    <ul>
                        <li>Substitution: Set u = g(x) to simplify the integrand</li>
                        <li>Integration by parts: ∫u dv = uv - ∫v du</li>
                        <li>Partial fractions: Decompose rational functions</li>
                        <li>Numerical methods: Riemann sums, trapezoidal rule, Simpson's rule</li>
                    </ul>
                    
                    <p>Applications of integration include:</p>
                    <ul>
                        <li>Computing areas, volumes, and arc lengths</li>
                        <li>Finding centers of mass and moments of inertia</li>
                        <li>Analyzing differential equations</li>
                        <li>Probability distributions and expected values</li>
                    </ul>
                    
                    <p>When a function lacks an elementary antiderivative, numerical integration methods become essential.</p>
                `
            },
            professional: {
                title: "Integrals - Analytical Framework",
                explanation: `
                    <p>Integration provides a framework for measuring accumulation, with the Riemann integral defined as:</p>
                    
                    <div class="math-formula">
                        ∫<sub>a</sub><sup>b</sup> f(x) dx = lim<sub>n→∞</sub> Σ<sub>i=1</sub><sup>n</sup> f(x<sub>i</sub>*) Δx<sub>i</sub>
                    </div>
                    
                    <p>For functions with discontinuities or unbounded domains, we employ improper integrals and specialized techniques. The Lebesgue integral extends integration to more general classes of functions.</p>
                    
                    <p>Integration theory extends to:</p>
                    <ul>
                        <li>Measure theory: Lebesgue integration provides a more general foundation</li>
                        <li>Multiple integrals: ∫∫∫ f(x,y,z) dV measures volume in ℝ³</li>
                        <li>Line and surface integrals: ∫<sub>C</sub> F·dr and ∫∫<sub>S</sub> F·dS</li>
                        <li>Complex analysis: Integration in the complex plane</li>
                    </ul>
                    
                    <p>The fundamental theorems of calculus establish the critical relationship between differentiation and integration, forming the backbone of mathematical analysis.</p>
                    
                    <p>Precision considerations include convergence criteria for improper integrals, error bounds in numerical methods, and singularity handling. Professional tools in this visualization support high-precision numerical integration and sophisticated analytical techniques.</p>
                `
            }
        },
        limits: {
            beginner: {
                title: "Limits - The Basics",
                explanation: `
                    <p>A limit describes what happens to a function as x gets closer and closer to a specific value. It tells us what value the function <strong>approaches</strong>, even if it's not defined at that exact point.</p>
                    
                    <p>Think of approaching a railroad crossing. As you get closer, you can see where the roads meet, even if you stop before reaching that point.</p>
                    
                    <div class="concept-image">
                        <img src="https://images.unsplash.com/photo-1517691102118-8113f9b0a5bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" alt="Road converging to horizon" />
                        <p class="caption">As you approach the horizon, you can see where the road leads</p>
                    </div>
                    
                    <p>Use the controls to:</p>
                    <ul>
                        <li>See what happens as x approaches a value</li>
                        <li>Try approaching from the left or right</li>
                        <li>Explore functions with "holes" or jumps</li>
                    </ul>
                    
                    <div class="math-formula">
                        lim<sub>x→c</sub> f(x) = L
                        <span class="formula-caption">Read as: "the limit of f(x) as x approaches c equals L"</span>
                    </div>
                `
            },
            expert: {
                title: "Limits - Advanced Analysis",
                explanation: `
                    <p>Limits form the foundation of calculus by precisely defining the behavior of functions as their inputs approach specific values. The notation lim<sub>x→c</sub> f(x) = L means that f(x) can be made arbitrarily close to L by taking x sufficiently close (but not equal) to c.</p>
                    
                    <div class="math-formula">
                        lim<sub>x→c</sub> f(x) = L ⟺ ∀ε > 0, ∃δ > 0 such that |f(x) - L| < ε whenever 0 < |x - c| < δ
                        <span class="formula-caption">Formal epsilon-delta definition</span>
                    </div>
                    
                    <p>Key limit concepts:</p>
                    <ul>
                        <li>One-sided limits: lim<sub>x→c⁺</sub> f(x) and lim<sub>x→c⁻</sub> f(x)</li>
                        <li>Limits at infinity: lim<sub>x→∞</sub> f(x) and lim<sub>x→-∞</sub> f(x)</li>
                        <li>Infinite limits: When f(x) grows without bound</li>
                        <li>Limit evaluation techniques: Direct substitution, factoring, rationalization, L'Hôpital's rule</li>
                    </ul>
                    
                    <p>Limits are essential for defining:</p>
                    <ul>
                        <li>Continuity: f is continuous at c if lim<sub>x→c</sub> f(x) = f(c)</li>
                        <li>Derivatives: f'(x) = lim<sub>h→0</sub> [f(x+h) - f(x)]/h</li>
                        <li>Integrals: As the limit of Riemann sums</li>
                        <li>Convergence of sequences and series</li>
                    </ul>
                `
            },
            professional: {
                title: "Limits - Analytical Framework",
                explanation: `
                    <p>Limits formalize the concept of function convergence and provide the foundation for calculus and analysis. In metric spaces, we characterize limits using the precise ε-δ definition:</p>
                    
                    <div class="math-formula">
                        lim<sub>x→c</sub> f(x) = L ⟺ ∀ε > 0, ∃δ > 0 such that |f(x) - L| < ε whenever 0 < |x - c| < δ
                    </div>
                    
                    <p>Topological framework: In more general topological spaces, limits are defined using open neighborhoods, providing an abstract framework that extends beyond metric spaces.</p>
                    
                    <p>Limits appear throughout mathematics:</p>
                    <ul>
                        <li>Sequences and series: Convergence criteria and sum calculations</li>
                        <li>Functional analysis: Pointwise vs. uniform convergence</li>
                        <li>Measure theory: Almost everywhere convergence</li>
                        <li>Complex analysis: Analytic functions and residue theory</li>
                    </ul>
                    
                    <p>Special limiting behaviors include:</p>
                    <ul>
                        <li>Asymptotic analysis: O, o, Θ, Ω notations</li>
                        <li>Indeterminate forms: L'Hôpital's rule and Taylor expansions</li>
                        <li>Essential singularities: Behavior near poles and branch points</li>
                    </ul>
                    
                    <p>The professional tools in this visualization allow precise examination of limiting behavior with high-resolution numerical approximations and advanced analytical techniques.</p>
                `
            }
        }
    },
    
    /**
     * Get explanation content for a specific concept and user level
     * @param {string} concept - The concept name
     * @param {string} level - The user level
     * @returns {object} - Content object with title and explanation
     */
    getConceptContent(concept, level) {
        if (!this.concepts[concept]) {
            return {
                title: "Concept not found",
                explanation: "<p>The requested concept information is not available.</p>"
            };
        }
        
        // Get content for the specified level or fallback to a lower level
        let content;
        switch (level) {
            case Config.USER_LEVELS.PROFESSIONAL:
                content = this.concepts[concept].professional || 
                         this.concepts[concept].expert ||
                         this.concepts[concept].beginner;
                break;
            case Config.USER_LEVELS.EXPERT:
                content = this.concepts[concept].expert || 
                         this.concepts[concept].beginner;
                break;
            default:
                content = this.concepts[concept].beginner;
        }
        
        return content || {
            title: concept.charAt(0).toUpperCase() + concept.slice(1),
            explanation: "<p>No specific content available for this level.</p>"
        };
    },
    
    /**
     * Update concept explanation based on user level
     * @param {string} concept - The concept name
     */
    updateConceptExplanation(concept) {
        const level = Config.getCurrentUserLevel();
        const content = this.getConceptContent(concept, level);
        
        // Update UI elements
        const titleEl = document.getElementById('concept-title');
        const explanationEl = document.getElementById('concept-explanation');
        
        if (titleEl) {
            titleEl.textContent = content.title;
        }
        
        if (explanationEl) {
            explanationEl.innerHTML = content.explanation;
            
            // Add fade-in animation
            explanationEl.classList.add('fade-in');
            setTimeout(() => {
                explanationEl.classList.remove('fade-in');
            }, 500);
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Listen for concept changes
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            const concept = e.target.getAttribute('data-concept');
            Documentation.updateConceptExplanation(concept);
        });
    });
    
    // Listen for user level changes
    document.addEventListener('userlevelchanged', (e) => {
        const activeConceptLink = document.querySelector('nav a.active');
        if (activeConceptLink) {
            const concept = activeConceptLink.getAttribute('data-concept');
            Documentation.updateConceptExplanation(concept);
        }
    });
});
