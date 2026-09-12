// ==========================================================================
// NUTRILEARN - PARENT LEARNING & MEAL PLANNING MODULE
// Curricula, Interactive Quizzes, Pinggang Pinoy, Certificate
// ==========================================================================

const ParentModule = {
  currentModuleId: 'mod-1',
  currentQuizQuestionIndex: 0,
  currentQuizAnswers: {},
  selectedQuizOption: null,

  init() {
    this.renderModuleCards();
    this.renderRecipes();
    this.updateProgressHeader();
    this.initCustomMealBuilder();
  },

  // Render Parent Learning Modules Cards
  renderModuleCards() {
    const container = document.getElementById('parent-modules-container');
    if (!container) return;

    const modules = NutriStorage.getModules();
    const progress = NutriStorage.getParentProgress();
    const completedList = progress.completedModules || [];

    container.innerHTML = modules.map(mod => {
      const isCompleted = completedList.includes(mod.id);
      const score = progress.quizScores ? progress.quizScores[mod.id] : null;

      return `
        <div class="module-card">
          <div class="module-card-header">
            <div class="module-number">${mod.number} • ${mod.duration}</div>
            <div class="module-card-title">${mod.title}</div>
          </div>
          <div class="module-card-body">
            <div>
              <p class="module-desc">${mod.summary}</p>
              <div style="margin-bottom: 0.85rem;">
                <span class="badge ${isCompleted ? 'badge-improved' : 'badge-normal'}">
                  ${isCompleted ? `✓ Completed (${score || 100}%)` : 'Ready to Start'}
                </span>
              </div>
            </div>
            <div>
              <div class="module-footer-meta">
                <span>WHO & DOH Aligned</span>
                <span>${mod.quiz ? mod.quiz.length : 0} Questions</span>
              </div>
              <div style="display:flex; gap:0.5rem; margin-top:0.85rem;">
                <button class="btn btn-primary btn-sm" style="flex:1;" onclick="ParentModule.openLesson('${mod.id}')">
                  Read Lesson
                </button>
                <button class="btn btn-accent btn-sm" onclick="ParentModule.startQuiz('${mod.id}')">
                  Take Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // Update top progress summary in Parent View
  updateProgressHeader() {
    const progress = NutriStorage.getParentProgress();
    const completed = progress.completedModules || [];
    const total = NutriStorage.getModules().length;
    const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    const barFill = document.getElementById('parent-progress-fill');
    const textLabel = document.getElementById('parent-progress-text');
    const badgeElem = document.getElementById('parent-progress-badge');

    if (barFill) barFill.style.width = `${pct}%`;
    if (textLabel) textLabel.textContent = `${completed.length} of ${total} Modules Completed (${pct}%)`;
    if (badgeElem) {
      badgeElem.textContent = pct === 100 ? '🏆 Certified Parent Nutrition Champion' : 'Progressing Well';
    }

    // Dynamic Parent Dashboard metrics updates
    const dashProgressVal = document.getElementById('parent-dash-progress-val');
    const dashProgressSub = document.getElementById('parent-dash-progress-sub');
    if (dashProgressVal) dashProgressVal.textContent = `${pct}%`;
    if (dashProgressSub) {
      dashProgressSub.textContent = `${completed.length} of ${total} Modules Done (${pct === 100 ? 'Certified Champion' : 'Certificate Pending'})`;
    }

    const currentUser = NutriStorage.getCurrentUser();
    const greetingName = document.getElementById('parent-dash-greeting-name');
    if (greetingName && currentUser && currentUser.name) {
      greetingName.textContent = currentUser.name;
    }
  },

  // Open Lesson Reader
  openLesson(moduleId) {
    const mod = NutriStorage.getModules().find(m => m.id === moduleId);
    if (!mod) return;

    this.currentModuleId = moduleId;
    document.getElementById('lesson-title').textContent = `${mod.number}: ${mod.title}`;
    
    // Objectives HTML
    const objHtml = `
      <div style="background:#F0FDF4; border-left:4px solid #16A34A; padding:0.85rem 1rem; border-radius:4px; margin-bottom:1.25rem;">
        <strong style="color:#14532D;">What you will learn in this lesson:</strong>
        <ul style="margin-left:1.25rem; margin-top:0.35rem; line-height:1.5; color:#1F2937; font-size:0.88rem;">
          ${(mod.objectives || []).map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
    `;

    document.getElementById('lesson-body-content').innerHTML = objHtml + (mod.content || '<p>Lesson content coming soon.</p>');
    NutriApp.openModal('modal-lesson-viewer');
  },

  // Start Interactive Quiz
  startQuiz(moduleId) {
    const mod = NutriStorage.getModules().find(m => m.id === moduleId);
    if (!mod || !mod.quiz || !mod.quiz.length) {
      NutriApp.showToast('No quiz available for this module.', 'info');
      return;
    }

    this.currentModuleId = moduleId;
    this.currentQuizQuestionIndex = 0;
    this.currentQuizAnswers = {};
    this.selectedQuizOption = null;

    NutriApp.closeModal('modal-lesson-viewer');
    NutriApp.openModal('modal-quiz');
    this.renderCurrentQuizQuestion();
  },

  // Render current quiz question
  renderCurrentQuizQuestion() {
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId);
    const q = mod.quiz[this.currentQuizQuestionIndex];
    const totalQuestions = mod.quiz.length;

    document.getElementById('quiz-mod-title').textContent = `${mod.number} Knowledge Check`;
    document.getElementById('quiz-q-counter').textContent = `Question ${this.currentQuizQuestionIndex + 1} of ${totalQuestions}`;

    const container = document.getElementById('quiz-content-area');
    container.innerHTML = `
      <div class="quiz-question-box">
        <div class="quiz-question-text">${q.question}</div>
        <div class="quiz-options-list">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" id="opt-btn-${idx}" onclick="ParentModule.selectQuizOption(${idx})">
              <span style="font-weight:700; width:22px; height:22px; border-radius:50%; background:#F1F5F9; display:inline-flex; align-items:center; justify-content:center; font-size:0.78rem;">
                ${String.fromCharCode(65 + idx)}
              </span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
        <div id="quiz-feedback-container" style="display:none;"></div>
      </div>
    `;

    document.getElementById('btn-quiz-submit').style.display = 'inline-flex';
    document.getElementById('btn-quiz-submit').textContent = 'Verify Answer';
    document.getElementById('btn-quiz-next').style.display = 'none';
  },

  // User taps an option
  selectQuizOption(index) {
    this.selectedQuizOption = index;
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId);
    const q = mod.quiz[this.currentQuizQuestionIndex];

    for (let i = 0; i < q.options.length; i++) {
      const btn = document.getElementById(`opt-btn-${i}`);
      if (btn) btn.classList.toggle('selected', i === index);
    }
  },

  // Verify answer and provide instant feedback explanation
  verifyCurrentAnswer() {
    if (this.selectedQuizOption === null) {
      NutriApp.showToast('Please select an option before continuing.', 'warning');
      return;
    }

    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId);
    const q = mod.quiz[this.currentQuizQuestionIndex];
    const isCorrect = this.selectedQuizOption === q.answerIndex;

    this.currentQuizAnswers[this.currentQuizQuestionIndex] = isCorrect;

    // Highlight correct & incorrect
    for (let i = 0; i < q.options.length; i++) {
      const btn = document.getElementById(`opt-btn-${i}`);
      if (btn) {
        btn.disabled = true;
        if (i === q.answerIndex) {
          btn.classList.add('correct');
        } else if (i === this.selectedQuizOption && !isCorrect) {
          btn.classList.add('incorrect');
        }
      }
    }

    // Feedback box
    const feedbackBox = document.getElementById('quiz-feedback-container');
    feedbackBox.style.display = 'block';
    feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackBox.innerHTML = `
      <div style="font-weight:700; margin-bottom:0.25rem;">
        ${isCorrect ? '🎉 Correct! Well done!' : '💡 Learning Moment:'}
      </div>
      <div>${q.explanation}</div>
    `;

    document.getElementById('btn-quiz-submit').style.display = 'none';
    const nextBtn = document.getElementById('btn-quiz-next');
    nextBtn.style.display = 'inline-flex';
    
    if (this.currentQuizQuestionIndex === mod.quiz.length - 1) {
      nextBtn.textContent = 'Finish & See Results';
    } else {
      nextBtn.textContent = 'Next Question →';
    }
  },

  // Advance to next question or complete
  nextQuestion() {
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId);
    if (this.currentQuizQuestionIndex < mod.quiz.length - 1) {
      this.currentQuizQuestionIndex++;
      this.selectedQuizOption = null;
      this.renderCurrentQuizQuestion();
    } else {
      this.finishQuiz();
    }
  },

  // Calculate final score, save progress, and award certificate
  finishQuiz() {
    const mod = NutriStorage.getModules().find(m => m.id === this.currentModuleId);
    const totalQ = mod.quiz.length;
    let correctCount = 0;
    for (let i = 0; i < totalQ; i++) {
      if (this.currentQuizAnswers[i] === true) correctCount++;
    }

    const finalPct = Math.round((correctCount / totalQ) * 100);

    // Save to parent progress
    const progress = NutriStorage.getParentProgress();
    if (!progress.completedModules.includes(this.currentModuleId)) {
      progress.completedModules.push(this.currentModuleId);
    }
    progress.quizScores[this.currentModuleId] = finalPct;
    NutriStorage.saveParentProgress(progress);

    NutriApp.closeModal('modal-quiz');

    // Show Results & Certificate
    this.showCertificate(mod, finalPct, correctCount, totalQ);
    this.renderModuleCards();
    this.updateProgressHeader();
  },

  // Show Certificate Modal
  showCertificate(mod, scorePct, correctCount, total) {
    document.getElementById('cert-module-name').textContent = `${mod.number}: ${mod.title}`;
    document.getElementById('cert-score').textContent = `${scorePct}% (${correctCount}/${total} Correct)`;
    document.getElementById('cert-date').textContent = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    NutriApp.openModal('modal-certificate');
  },

  // Render Affordable Local Recipes
  renderRecipes() {
    const container = document.getElementById('recipes-container');
    if (!container) return;

    container.innerHTML = NUTRI_DATA.recipes.map(rec => `
      <div class="recipe-card">
        <div class="recipe-header">
          <span style="font-weight: 700; color: var(--color-primary-900);">${rec.title}</span>
          <span class="recipe-cost">${rec.costPerServing}</span>
        </div>
        <div class="recipe-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            👶 Recommended for: <strong>${rec.targetAge}</strong> • ⏱️ Prep: ${rec.prepTime}
          </div>
          
          <div style="font-size: 0.82rem; font-weight: 600; color: var(--color-primary-800); margin-top: 0.5rem;">
            Pinggang Pinoy Food Group Balance:
          </div>
          <div class="ingredient-tags">
            <span class="food-tag" style="background:#FEF3C7; color:#92400E;">🟡 GO: ${rec.foodGroups.go}</span>
            <span class="food-tag" style="background:#FEE2E2; color:#991B1B;">🔴 GROW: ${rec.foodGroups.grow}</span>
            <span class="food-tag local">🟢 GLOW: ${rec.foodGroups.glow}</span>
          </div>

          <div style="margin-top: 0.75rem; font-size: 0.84rem; line-height: 1.5;">
            <strong>Affordable Local Ingredients:</strong>
            <ul style="margin-left: 1.25rem; color: var(--text-secondary); margin-top: 0.25rem;">
              ${rec.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-top: 0.75rem; padding: 0.5rem 0.75rem; background: #F0FDF4; border-radius: 6px; font-size: 0.8rem; color: #166534;">
            ✨ <strong>Key Nutrients:</strong> ${rec.keyNutrients}
          </div>
        </div>
      </div>
    `).join('');
  },

  // Interactive Pinggang Pinoy Meal Builder
  initCustomMealBuilder() {
    const goSelect = document.getElementById('meal-builder-go');
    const growSelect = document.getElementById('meal-builder-grow');
    const glowSelect = document.getElementById('meal-builder-glow');

    const updateMealCalculation = () => {
      if (!goSelect || !growSelect || !glowSelect) return;

      const goCost = parseInt(goSelect.selectedOptions[0]?.dataset.cost || 10, 10);
      const growCost = parseInt(growSelect.selectedOptions[0]?.dataset.cost || 15, 10);
      const glowCost = parseInt(glowSelect.selectedOptions[0]?.dataset.cost || 5, 10);

      const totalCost = goCost + growCost + glowCost;
      const displayElem = document.getElementById('meal-calc-total');
      if (displayElem) {
        displayElem.textContent = `₱${totalCost} per serving`;
      }
    };

    [goSelect, growSelect, glowSelect].forEach(el => {
      if (el) el.addEventListener('change', updateMealCalculation);
    });

    updateMealCalculation();
  }
};
