/**
 * Quiz Manager Module
 * Provides mini-quizzes and checkpoints to assess understanding
 */

class QuizManager {
  constructor() {
    this.currentQuiz = null;
    this.currentQuestion = 0;
    this.selectedAnswer = null;
    this.score = 0;
    this.container = null;
    
    // Initialize quiz data
    this.quizzes = {
      derivatives: {
        title: "Derivatives Knowledge Check",
        questions: [
          {
            text: "What does the derivative of a function represent?",
            options: [
              "The area under the curve",
              "The rate of change at a point",
              "The volume of a solid",
              "The average value of the function"
            ],
            correct: 1,
            explanation: "The derivative represents the rate of change or slope of the function at a specific point.",
            hint: "Think about what the slope of a tangent line tells us."
          },
          {
            text: "If f(x) = x², what is f'(x)?",
            options: [
              "2x",
              "x²",
              "2",
              "x"
            ],
            correct: 0,
            explanation: "Using the power rule: if f(x) = xⁿ, then f'(x) = n·xⁿ⁻¹. For x², n=2, so f'(x) = 2x¹ = 2x.",
            hint: "Apply the power rule: for xⁿ, the derivative is n·xⁿ⁻¹."
          },
          {
            text: "The derivative of sin(x) is:",
            options: [
              "cos(x)",
              "-cos(x)",
              "sin(x)",
              "-sin(x)"
            ],
            correct: 0,
            explanation: "The derivative of sin(x) is cos(x), a fundamental rule in calculus.",
            hint: "This is one of the basic trigonometric derivatives."
          },
          {
            text: "What is the second derivative of x³?",
            options: [
              "3x²",
              "6x",
              "3x",
              "6"
            ],
            correct: 1,
            explanation: "First derivative: 3x². Second derivative: 6x.",
            hint: "Find the derivative of the first derivative."
          },
          {
            text: "At which point(s) is the derivative of f(x) = x² - 4x + 3 equal to zero?",
            options: [
              "x = 1",
              "x = 2",
              "x = 3",
              "x = 4"
            ],
            correct: 1,
            explanation: "f'(x) = 2x - 4. Setting equal to zero: 2x - 4 = 0, so x = 2.",
            hint: "Find f'(x), set it equal to zero, and solve for x."
          }
        ]
      },
      integrals: {
        title: "Integrals Knowledge Check",
        questions: [
          {
            text: "The integral ∫ f(x) dx represents:",
            options: [
              "The slope of f(x)",
              "The area under the curve of f(x)",
              "The value of f(x) at a point",
              "The rate of change of f(x)"
            ],
            correct: 1,
            explanation: "The integral represents the accumulated area under the curve of f(x).",
            hint: "Think about what the area between the curve and the x-axis represents."
          },
          {
            text: "What is ∫ 2x dx?",
            options: [
              "x²",
              "x² + C",
              "2x² + C",
              "x² - C"
            ],
            correct: 1,
            explanation: "The integral of 2x is x² + C, where C is the constant of integration.",
            hint: "Apply the power rule for integration and remember the constant of integration."
          },
          {
            text: "The definite integral ∫(a to b) f(x) dx gives:",
            options: [
              "The area under f(x) from x = a to x = b",
              "The value of f(b) - f(a)",
              "The slope of f(x) at x = b",
              "The average value of f(x) from x = a to x = b"
            ],
            correct: 0,
            explanation: "The definite integral calculates the net area under the curve between the specified bounds.",
            hint: "Think about the geometric interpretation of the definite integral."
          },
          {
            text: "What is ∫(0 to 2) x² dx?",
            options: [
              "2",
              "4",
              "8/3",
              "4/3"
            ],
            correct: 2,
            explanation: "∫(0 to 2) x² dx = [x³/3](0 to 2) = 2³/3 - 0³/3 = 8/3.",
            hint: "First find the antiderivative, then apply the bounds."
          },
          {
            text: "The Fundamental Theorem of Calculus relates:",
            options: [
              "Derivatives and limits",
              "Integrals and derivatives",
              "Limits and continuity",
              "Continuity and differentiability"
            ],
            correct: 1,
            explanation: "The Fundamental Theorem of Calculus establishes the relationship between differentiation and integration as inverse processes.",
            hint: "It connects the two major operations in calculus."
          }
        ]
      },
      limits: {
        title: "Limits Knowledge Check",
        questions: [
          {
            text: "If the limit of f(x) as x approaches c is L, then:",
            options: [
              "f(c) must equal L",
              "f(c) does not need to equal L",
              "f(c) must be defined",
              "f(x) must be continuous at c"
            ],
            correct: 1,
            explanation: "The limit of f(x) as x approaches c can exist even if f(c) is undefined or different from the limit.",
            hint: "The function value at c and the limit as x approaches c can be different."
          },
          {
            text: "The limit of 1/x as x approaches 0 is:",
            options: [
              "0",
              "1",
              "Infinity",
              "Does not exist"
            ],
            correct: 3,
            explanation: "The left limit is negative infinity and the right limit is positive infinity, so the limit does not exist.",
            hint: "Consider the left and right limits separately."
          },
          {
            text: "For a function to be continuous at x = c, which of the following must be true?",
            options: [
              "The limit must exist at x = c",
              "f(c) must be defined",
              "The limit must equal f(c)",
              "All of the above"
            ],
            correct: 3,
            explanation: "Continuity at x = c requires that f(c) is defined, the limit exists as x approaches c, and the limit equals f(c).",
            hint: "Continuity has three requirements."
          },
          {
            text: "The limit of (x² - 1)/(x - 1) as x approaches 1 is:",
            options: [
              "0",
              "1",
              "2",
              "Does not exist"
            ],
            correct: 2,
            explanation: "By factoring: (x² - 1)/(x - 1) = (x + 1)(x - 1)/(x - 1) = x + 1 for x ≠ 1. As x approaches 1, the limit is 1 + 1 = 2.",
            hint: "Try factoring the numerator."
          },
          {
            text: "The limit of sin(x)/x as x approaches 0 is:",
            options: [
              "0",
              "1",
              "Infinity",
              "Does not exist"
            ],
            correct: 1,
            explanation: "This is a famous limit in calculus. As x approaches 0, sin(x)/x approaches 1.",
            hint: "This is a fundamental limit that can be proven using geometric reasoning."
          }
        ]
      }
    };
  }

  initialize() {
    this.createQuizUI();
    this.setupEventListeners();
  }

  createQuizUI() {
    // Create modal container for quizzes
    this.container = document.createElement('div');
    this.container.className = 'quiz-container';
    this.container.innerHTML = `
      <div class="quiz-modal">
        <div class="quiz-header">
          <h3 class="quiz-title"></h3>
          <button class="btn-close" id="close-quiz">&times;</button>
        </div>
        <div class="quiz-content">
          <div class="question-counter"></div>
          <div class="question-text"></div>
          <div class="answer-options"></div>
          <div class="feedback-container" style="display: none;">
            <div class="feedback-message"></div>
            <div class="answer-explanation"></div>
          </div>
          <div class="hint-container">
            <button class="btn btn-outline btn-sm" id="show-hint">Show Hint</button>
            <div class="hint-text" style="display: none;"></div>
          </div>
        </div>
        <div class="quiz-controls">
          <button class="btn btn-secondary" id="skip-question">Skip</button>
          <button class="btn btn-primary" id="check-answer" disabled>Check Answer</button>
          <button class="btn btn-primary" id="next-question" style="display: none;">Next Question</button>
          <button class="btn btn-primary" id="finish-quiz" style="display: none;">Finish Quiz</button>
        </div>
      </div>
      <div class="quiz-results" style="display: none;">
        <div class="results-content">
          <h3>Quiz Results</h3>
          <div class="score-display">
            <div class="score-circle">
              <span class="score-value">0%</span>
            </div>
          </div>
          <div class="results-message"></div>
          <button class="btn btn-primary" id="review-quiz">Review Answers</button>
          <button class="btn btn-secondary" id="close-results">Continue</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.container);
    this.container.style.display = 'none';
  }

  setupEventListeners() {
    // Quiz controls
    document.getElementById('check-answer')?.addEventListener('click', () => this.checkAnswer());
    document.getElementById('next-question')?.addEventListener('click', () => this.nextQuestion());
    document.getElementById('finish-quiz')?.addEventListener('click', () => this.showResults());
    document.getElementById('skip-question')?.addEventListener('click', () => this.skipQuestion());
    document.getElementById('close-quiz')?.addEventListener('click', () => this.closeQuiz());
    document.getElementById('show-hint')?.addEventListener('click', () => this.showHint());
    
    // Results controls
    document.getElementById('review-quiz')?.addEventListener('click', () => this.reviewQuiz());
    document.getElementById('close-results')?.addEventListener('click', () => this.closeResults());
    
    // Add quiz start buttons to concept cards
    this.addQuizButtons();
  }

  addQuizButtons() {
    Object.keys(this.quizzes).forEach(concept => {
      const conceptCard = document.querySelector(`#${concept}-card`);
      if (!conceptCard) return;
      
      const quizButton = document.createElement('button');
      quizButton.className = 'btn btn-primary quiz-start-btn';
      quizButton.textContent = 'Take Quiz';
      quizButton.setAttribute('data-quiz', concept);
      quizButton.addEventListener('click', (e) => {
        const quizType = e.target.getAttribute('data-quiz');
        this.startQuiz(quizType);
      });
      
      // Add to card
      const quizSection = document.createElement('div');
      quizSection.className = 'quiz-section';
      quizSection.innerHTML = '<h4>Knowledge Check</h4>';
      quizSection.appendChild(quizButton);
      
      conceptCard.appendChild(quizSection);
    });
  }

  startQuiz(concept) {
    if (!this.quizzes[concept]) return;
    
    // Set up current quiz
    this.currentQuiz = concept;
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    
    // Update title
    document.querySelector('.quiz-title').textContent = this.quizzes[concept].title;
    
    // Show the quiz modal
    this.container.style.display = 'flex';
    document.querySelector('.quiz-modal').style.display = 'block';
    document.querySelector('.quiz-results').style.display = 'none';
    
    // Load first question
    this.loadQuestion();
    
    // Track event
    this.trackProgress('quiz_started', {
      quiz_type: concept,
      question_count: this.quizzes[concept].questions.length
    });
  }

  loadQuestion() {
    const quiz = this.quizzes[this.currentQuiz];
    const question = quiz.questions[this.currentQuestion];
    
    // Reset state
    this.selectedAnswer = null;
    
    // Update question counter
    document.querySelector('.question-counter').textContent = 
      `Question ${this.currentQuestion + 1} of ${quiz.questions.length}`;
    
    // Update question text
    document.querySelector('.question-text').textContent = question.text;
    
    // Create answer options
    const optionsContainer = document.querySelector('.answer-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'answer-option';
      optionElement.innerHTML = `
        <input type="radio" name="quiz-answer" id="option-${index}" value="${index}">
        <label for="option-${index}">${option}</label>
      `;
      optionsContainer.appendChild(optionElement);
      
      // Add event listener to the radio button
      optionElement.querySelector('input').addEventListener('change', () => {
        this.selectedAnswer = index;
        document.getElementById('check-answer').disabled = false;
      });
    });
    
    // Reset UI elements
    document.querySelector('.feedback-container').style.display = 'none';
    document.querySelector('.hint-text').style.display = 'none';
    document.getElementById('check-answer').disabled = true;
    document.getElementById('check-answer').style.display = 'block';
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('finish-quiz').style.display = 'none';
  }

  checkAnswer() {
    const quiz = this.quizzes[this.currentQuiz];
    const question = quiz.questions[this.currentQuestion];
    
    // Store answer
    this.answers.push(this.selectedAnswer);
    
    // Check if correct
    const isCorrect = this.selectedAnswer === question.correct;
    if (isCorrect) {
      this.score++;
    }
    
    // Show feedback
    const feedbackContainer = document.querySelector('.feedback-container');
    const feedbackMessage = document.querySelector('.feedback-message');
    const explanation = document.querySelector('.answer-explanation');
    
    feedbackContainer.style.display = 'block';
    feedbackMessage.textContent = isCorrect ? 'Correct!' : 'Incorrect';
    feedbackMessage.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
    explanation.textContent = question.explanation;
    
    // Highlight correct answer
    document.querySelectorAll('.answer-option').forEach((option, index) => {
      if (index === question.correct) {
        option.classList.add('correct-answer');
      } else if (index === this.selectedAnswer && !isCorrect) {
        option.classList.add('incorrect-answer');
      }
    });
    
    // Update buttons
    document.getElementById('check-answer').style.display = 'none';
    
    if (this.currentQuestion < quiz.questions.length - 1) {
      document.getElementById('next-question').style.display = 'block';
    } else {
      document.getElementById('finish-quiz').style.display = 'block';
    }
    
    // Track progress
    this.trackProgress('question_answered', {
      quiz_type: this.currentQuiz,
      question_index: this.currentQuestion,
      is_correct: isCorrect
    });
  }

  nextQuestion() {
    // Check if there are more questions
    if (this.currentQuestion < this.quizzes[this.currentQuiz].questions.length - 1) {
      this.currentQuestion++;
      this.loadQuestion();
    }
  }

  skipQuestion() {
    // Record as skipped
    this.answers.push(null);
    
    // Move to next question or finish
    if (this.currentQuestion < this.quizzes[this.currentQuiz].questions.length - 1) {
      this.currentQuestion++;
      this.loadQuestion();
    } else {
      this.showResults();
    }
    
    // Track event
    this.trackProgress('question_skipped', {
      quiz_type: this.currentQuiz,
      question_index: this.currentQuestion
    });
  }

  showHint() {
    const quiz = this.quizzes[this.currentQuiz];
    const question = quiz.questions[this.currentQuestion];
    
    const hintText = document.querySelector('.hint-text');
    hintText.textContent = question.hint;
    hintText.style.display = 'block';
    
    // Track hint usage
    this.trackProgress('hint_viewed', {
      quiz_type: this.currentQuiz,
      question_index: this.currentQuestion
    });
  }

  showResults() {
    // Calculate score percentage
    const totalQuestions = this.quizzes[this.currentQuiz].questions.length;
    const percentage = Math.round((this.score / totalQuestions) * 100);
    
    // Update UI
    document.querySelector('.quiz-modal').style.display = 'none';
    document.querySelector('.quiz-results').style.display = 'block';
    
    document.querySelector('.score-value').textContent = `${percentage}%`;
    
    // Set results message based on score
    const resultsMessage = document.querySelector('.results-message');
    if (percentage >= 90) {
      resultsMessage.textContent = 'Excellent! You have a strong understanding of this topic.';
    } else if (percentage >= 70) {
      resultsMessage.textContent = 'Good job! You understand most of the key concepts.';
    } else if (percentage >= 50) {
      resultsMessage.textContent = 'You\'re making progress. Review the topics you missed and try again.';
    } else {
      resultsMessage.textContent = 'Keep practicing. Consider reviewing the concepts and trying the walkthroughs again.';
    }
    
    // Update progress tracking
    if (window.progressTracker) {
      window.progressTracker.updateQuizScore(this.currentQuiz, percentage);
    }
    
    // Track completion
    this.trackProgress('quiz_completed', {
      quiz_type: this.currentQuiz,
      score_percentage: percentage,
      correct_answers: this.score,
      total_questions: totalQuestions
    });
  }

  reviewQuiz() {
    // Implementation for reviewing quiz answers would go here
    // This would show all questions with correct/incorrect answers marked
    alert('Quiz review feature coming soon!');
  }

  closeQuiz() {
    this.container.style.display = 'none';
    
    // Track event
    this.trackProgress('quiz_abandoned', {
      quiz_type: this.currentQuiz,
      question_index: this.currentQuestion
    });
  }

  closeResults() {
    this.container.style.display = 'none';
    
    // Show topic recommendation based on quiz performance
    this.showRecommendation();
  }

  showRecommendation() {
    const percentage = Math.round((this.score / this.quizzes[this.currentQuiz].questions.length) * 100);
    
    if (percentage < 70) {
      // Create recommendation notification
      const notification = document.createElement('div');
      notification.className = 'recommendation-notification';
      notification.innerHTML = `
        <div class="recommendation-content">
          <h4>Recommendation</h4>
          <p>Based on your quiz results, we recommend reviewing the ${this.quizzes[this.currentQuiz].title} walkthrough.</p>
          <button class="btn btn-primary" id="start-recommended-walkthrough">Start Walkthrough</button>
          <button class="btn btn-outline" id="dismiss-recommendation">Later</button>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Add event listeners
      document.getElementById('start-recommended-walkthrough')?.addEventListener('click', () => {
        document.body.removeChild(notification);
        if (window.walkthroughManager) {
          window.walkthroughManager.startWalkthrough(`${this.currentQuiz}-intro`);
        }
      });
      
      document.getElementById('dismiss-recommendation')?.addEventListener('click', () => {
        document.body.removeChild(notification);
      });
    }
  }

  offerQuiz(concept) {
    if (!this.quizzes[concept]) return;
    
    // Check if user has already taken this quiz recently
    if (this.hasRecentlyTakenQuiz(concept)) return;
    
    // Create quiz offer notification
    const notification = document.createElement('div');
    notification.className = 'quiz-offer-notification';
    notification.innerHTML = `
      <div class="offer-content">
        <h4>Ready to Test Your Knowledge?</h4>
        <p>Take a quick quiz on ${concept} to check your understanding.</p>
        <div class="offer-buttons">
          <button class="btn btn-primary" id="accept-quiz-offer">Take Quiz</button>
          <button class="btn btn-outline" id="decline-quiz-offer">Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listeners
    document.getElementById('accept-quiz-offer')?.addEventListener('click', () => {
      document.body.removeChild(notification);
      this.startQuiz(concept);
    });
    
    document.getElementById('decline-quiz-offer')?.addEventListener('click', () => {
      document.body.removeChild(notification);
    });
  }

  hasRecentlyTakenQuiz(concept) {
    // Check local storage for quiz history
    const quizHistory = localStorage.getItem('calculusVisualizerQuizHistory');
    if (!quizHistory) return false;
    
    try {
      const history = JSON.parse(quizHistory);
      const lastTaken = history[concept];
      
      if (!lastTaken) return false;
      
      // Consider "recently" as within the last hour
      const oneHourAgo = new Date().getTime() - (60 * 60 * 1000);
      return lastTaken > oneHourAgo;
    } catch (e) {
      console.error('Error checking quiz history:', e);
      return false;
    }
  }

  trackProgress(event, data) {
    // Track events for learning analytics
    if (window.analyticsTracker) {
      window.analyticsTracker.trackEvent(event, data);
    }
    
    // For debugging
    console.log(`[Quiz] ${event}`, data);
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.quizManager = new QuizManager();
  window.quizManager.initialize();
});
