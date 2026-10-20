/**
 * Well Chosen - Interactive Gift Finder Quiz Engine
 * Matches user preferences (recipient, occasion, vibe, budget) to catalog products
 */

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
});

const quizState = {
  currentStep: 1,
  totalSteps: 4,
  answers: {
    recipient: null,
    occasion: null,
    vibe: null,
    budget: null
  }
};

function initQuiz() {
  const options = document.querySelectorAll(".quiz-option");
  const nextBtn = document.getElementById("nextStepBtn");
  const prevBtn = document.getElementById("prevStepBtn");
  const restartBtn = document.getElementById("restartQuizBtn");

  // Selection handlers
  options.forEach(option => {
    option.addEventListener("click", () => {
      const step = option.closest(".quiz-step");
      const stepKey = step.dataset.stepKey;
      const value = option.dataset.value;

      // Unselect siblings
      step.querySelectorAll(".quiz-option").forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");

      quizState.answers[stepKey] = value;

      // Auto-advance after small delay for great UX
      setTimeout(() => {
        if (quizState.currentStep < quizState.totalSteps) {
          goToStep(quizState.currentStep + 1);
        } else {
          calculateAndShowResults();
        }
      }, 250);
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (quizState.currentStep < quizState.totalSteps) {
        goToStep(quizState.currentStep + 1);
      } else {
        calculateAndShowResults();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (quizState.currentStep > 1) {
        goToStep(quizState.currentStep - 1);
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", resetQuiz);
  }

  updateProgress();
}

function goToStep(stepNum) {
  const steps = document.querySelectorAll(".quiz-step");
  steps.forEach(s => s.classList.remove("active"));

  const target = document.querySelector(`.quiz-step[data-step="${stepNum}"]`);
  if (target) {
    target.classList.add("active");
    quizState.currentStep = stepNum;
    updateProgress();
  }
}

function updateProgress() {
  const progressBar = document.getElementById("quizProgressBar");
  const stepNumber = document.getElementById("quizStepNumber");
  const prevBtn = document.getElementById("prevStepBtn");

  if (progressBar) {
    const percentage = ((quizState.currentStep) / quizState.totalSteps) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  if (stepNumber) {
    stepNumber.textContent = `Question ${quizState.currentStep} of ${quizState.totalSteps}`;
  }

  if (prevBtn) {
    prevBtn.style.visibility = quizState.currentStep > 1 ? "visible" : "hidden";
  }
}

function calculateAndShowResults() {
  const quizForm = document.getElementById("quizContainer");
  const loadingEl = document.getElementById("quizLoading");
  const resultsContainer = document.getElementById("quizResultsContainer");

  if (quizForm) quizForm.style.display = "none";
  if (loadingEl) loadingEl.style.display = "flex";

  setTimeout(() => {
    if (loadingEl) loadingEl.style.display = "none";
    if (resultsContainer) resultsContainer.style.display = "block";

    renderResults();
  }, 650);
}

function renderResults() {
  const grid = document.getElementById("quizResultsGrid");
  const subtitle = document.getElementById("quizResultsSubtitle");
  if (!grid || typeof products === "undefined") return;

  const { recipient, occasion, vibe, budget } = quizState.answers;

  // Score each product
  const scored = products.map(product => {
    let score = 0;
    const reasons = [];

    // Recipient match (weight: 35)
    if (recipient && product.recipient.includes(recipient)) {
      score += 35;
      reasons.push(`Tailored for ${capitalize(recipient)}`);
    }

    // Occasion match (weight: 30)
    if (occasion && product.occasion.includes(occasion)) {
      score += 30;
      reasons.push(`Perfect for ${capitalize(occasion)}`);
    }

    // Vibe match (weight: 25)
    if (vibe && (product.vibe === vibe || product.category === vibe)) {
      score += 25;
      reasons.push(product.vibeLabel);
    }

    // Budget match (weight: 20)
    if (budget) {
      if (budget === "under500" && product.price <= 500) {
        score += 20;
        reasons.push("Budget-friendly");
      } else if (budget === "500-1000" && product.price >= 500 && product.price <= 1000) {
        score += 20;
        reasons.push("Within target budget");
      } else if (budget === "above1000" && product.price > 1000) {
        score += 20;
        reasons.push("Luxury selection");
      } else if (budget === "any") {
        score += 20;
      }
    }

    // Normalize match percentage (max 100%, min 60% for top recommendations)
    const matchPercentage = Math.min(99, Math.max(68, Math.round((score / 110) * 100)));

    return {
      product,
      score,
      matchPercentage,
      reasons
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);

  // Top 4-6 matches
  const topMatches = scored.slice(0, 6);

  if (subtitle) {
    subtitle.innerHTML = `Based on your choices (<strong>${capitalize(recipient || 'Someone special')}</strong> • <strong>${capitalize(occasion || 'Celebration')}</strong> • <strong>${capitalize(vibe || 'Curated')}</strong>), here are the most thoughtful gifts curated for you:`;
  }

  grid.innerHTML = topMatches.map((item, index) => {
    const p = item.product;
    const isTop = index === 0;

    return `
      <div class="product-card quiz-result-card ${isTop ? 'highlight-card' : ''}">
        <div class="result-badge-row">
          <span class="match-score-badge"><i class="fa-solid fa-wand-magic-sparkles"></i> ${item.matchPercentage}% Match</span>
          ${isTop ? `<span class="top-pick-badge">🌟 Best Recommendation</span>` : `<span class="category-chip-small">${p.categoryLabel}</span>`}
        </div>
        <div class="card-img-wrap" onclick="openProductQuickView(${p.id})">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="card-details">
          <h3>${p.name}</h3>
          <p class="quiz-match-reason">${item.reasons.slice(0, 2).join(" • ")}</p>
          <div class="price-rating-row">
            <span class="price">₹${p.price}</span>
            <span class="rating"><i class="fa-solid fa-star"></i> ${p.rating}</span>
          </div>
          <div class="card-action-btns">
            <button class="buy-btn" onclick="addToCart(${p.id})">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
            <button class="quick-view-btn" onclick="openProductQuickView(${p.id})" title="View Details">
              <i class="fa-solid fa-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function resetQuiz() {
  quizState.currentStep = 1;
  quizState.answers = {
    recipient: null,
    occasion: null,
    vibe: null,
    budget: null
  };

  document.querySelectorAll(".quiz-option").forEach(opt => opt.classList.remove("selected"));

  const quizForm = document.getElementById("quizContainer");
  const resultsContainer = document.getElementById("quizResultsContainer");

  if (quizForm) quizForm.style.display = "block";
  if (resultsContainer) resultsContainer.style.display = "none";

  goToStep(1);
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
