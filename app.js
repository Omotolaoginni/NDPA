/* ═══════════════════════════════════════════════════════════════════════════
   NDPA Compliance Self-Audit Tool — Application Logic
   Version: v1.0
   Architecture: Vanilla JS SPA, fully client-side, no server dependencies
   Storage: sessionStorage only (cleared on restart / session end)
   ═══════════════════════════════════════════════════════════════════════════ */

"use strict";

// ─────────────────────────────────────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────────────────────────────────────
const STATE = {
  lang: "en",           // "en" | "pidgin"
  sector: null,         // "retail" | "logistics" | "digital"
  size: null,           // "lt200" | "200to1000" | "gt1000" | "notSure"
  currentQ: 0,          // 0-indexed into QUESTIONS array
  answers: {},          // { [questionId]: "yes" | "no" | "notSure" }
  results: null,        // computed results object
  previousScreen: null, // for back navigation from modals
  lastTransitionIndex: null, // last completed question index at a category boundary
};

// ─────────────────────────────────────────────────────────────────────────────
//  SESSION STORAGE
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_KEY = "ndpa_session";

function saveSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      lang: STATE.lang,
      sector: STATE.sector,
      size: STATE.size,
      currentQ: STATE.currentQ,
      answers: STATE.answers,
    }));
  } catch (e) {
    // sessionStorage not available — continue silently
  }
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    STATE.lang = data.lang || "en";
    STATE.sector = data.sector || null;
    STATE.size = data.size || null;
    STATE.currentQ = data.currentQ || 0;
    STATE.answers = data.answers || {};
    return true;
  } catch (e) {
    return false;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}
  STATE.lang = "en";
  STATE.sector = null;
  STATE.size = null;
  STATE.currentQ = 0;
  STATE.answers = {};
  STATE.results = null;
  STATE.lastTransitionIndex = null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  ROUTER — show / hide screens
// ─────────────────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("is-active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("is-active");
    target.focus({ preventScroll: false });
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  // Show/hide header based on screen
  const headerHidden = ["screen-landing"];
  const header = document.querySelector(".app-header");
  if (header) {
    if (headerHidden.includes(id)) {
      header.classList.add("app-header--hidden");
    } else {
      header.classList.remove("app-header--hidden");
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  LANGUAGE / COPY HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function t(path) {
  const keys = path.split(".");
  let obj = LANG[STATE.lang];
  for (const k of keys) {
    if (obj == null) return path;
    obj = obj[k];
  }
  return obj ?? path;
}

// Return the language-appropriate value for a question field
function localize(q, field) {
  if (STATE.lang === "pidgin") {
    const pid = q[field + "Pidgin"];
    if (pid) return pid;
  }
  return q[field];
}

// Re-render the currently active screen after a language change so that
// dynamically-generated copy (questions, results, options) switches too.
function renderCurrentScreen() {
  const active = document.querySelector(".screen.is-active")?.id;
  if (!active) return;
  if (active === "screen-sector") renderSector();
  else if (active === "screen-size") renderSize();
  else if (active === "screen-assessment") renderQuestion(STATE.currentQ);
  else if (active === "screen-transition" && typeof STATE.lastTransitionIndex === "number") {
    renderTransition(STATE.lastTransitionIndex);
  } else if (active === "screen-results" && STATE.results) {
    renderResults(STATE.results);
  } else if (active === "screen-whatsapp" && STATE.results) {
    renderWhatsAppScreen();
  }
}

function applyLang() {
  const lang = STATE.lang;
  document.documentElement.setAttribute("lang", lang === "en" ? "en" : "pcm");

  // Update all [data-i18n] elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = t(key);
    if (typeof value === "string") {
      el.textContent = value;
    }
  });

  // Update all [data-i18n-placeholder]
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = t(key);
    if (typeof value === "string") {
      el.setAttribute("placeholder", value);
    }
  });

  // Update language toggle buttons
  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  saveSession();
  renderCurrentScreen();
}

// ─────────────────────────────────────────────────────────────────────────────
//  LANDING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function initLanding() {
  applyLang();

  // Language toggle in header/landing
  document.querySelectorAll(".lang-toggle__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      STATE.lang = btn.dataset.lang;
      applyLang();
    });
  });

  // Privacy link (footer)
  document.querySelectorAll(".js-privacy-link").forEach((el) => {
    el.addEventListener("click", () => {
      STATE.previousScreen = document.querySelector(".screen.is-active")?.id || "screen-landing";
      renderPrivacy();
      showModal("modal-privacy");
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTOR SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function renderSector() {
  const options = [
    { value: "retail", labelKey: "sector.option_retail" },
    { value: "logistics", labelKey: "sector.option_logistics" },
    { value: "digital", labelKey: "sector.option_digital" },
  ];
  const group = document.getElementById("sector-options");
  group.innerHTML = "";
  options.forEach(({ value, labelKey }) => {
    const btn = createSelectionOption({
      label: t(labelKey),
      value,
      isSelected: STATE.sector === value,
      id: `sector-${value}`,
    });
    btn.addEventListener("click", () => {
      STATE.sector = value;
      document.querySelectorAll("#sector-options .selection-option").forEach((b) =>
        b.classList.toggle("is-selected", b.dataset.value === value)
      );
      document.querySelectorAll("#sector-options .selection-option__check").forEach((c) => {
        c.closest(".selection-option").classList.contains("is-selected")
          ? (c.textContent = "✓")
          : (c.textContent = "");
      });
      document.getElementById("sector-continue").disabled = false;
      document.getElementById("sector-continue").removeAttribute("aria-disabled");
      saveSession();
    });
    group.appendChild(btn);
  });

  const heading = document.getElementById("sector-heading");
  if (heading) heading.textContent = t("sector.heading");

  const continueBtn = document.getElementById("sector-continue");
  if (continueBtn) {
    continueBtn.textContent = t("sector.cta");
    continueBtn.disabled = !STATE.sector;
    if (!STATE.sector) continueBtn.setAttribute("aria-disabled", "true");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  BUSINESS SIZE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function renderSize() {
  const options = [
    { value: "lt200", labelKey: "size.option_lt200", hintKey: "size.option_lt200_hint" },
    { value: "200to1000", labelKey: "size.option_200to1000", hintKey: "size.option_200to1000_hint" },
    { value: "gt1000", labelKey: "size.option_gt1000", hintKey: "size.option_gt1000_hint" },
    { value: "notSure", labelKey: "size.option_notSure", hintKey: "size.option_notSure_hint" },
  ];
  const group = document.getElementById("size-options");
  group.innerHTML = "";
  options.forEach(({ value, labelKey, hintKey }) => {
    const btn = createSelectionOption({
      label: t(labelKey),
      hint: t(hintKey),
      value,
      isSelected: STATE.size === value,
      id: `size-${value}`,
    });
    btn.addEventListener("click", () => {
      STATE.size = value;
      document.querySelectorAll("#size-options .selection-option").forEach((b) =>
        b.classList.toggle("is-selected", b.dataset.value === value)
      );
      document.querySelectorAll("#size-options .selection-option__check").forEach((c) => {
        c.closest(".selection-option").classList.contains("is-selected")
          ? (c.textContent = "✓")
          : (c.textContent = "");
      });
      document.getElementById("size-continue").disabled = false;
      document.getElementById("size-continue").removeAttribute("aria-disabled");
      saveSession();
    });
    group.appendChild(btn);
  });

  const heading = document.getElementById("size-heading");
  if (heading) heading.textContent = t("size.heading");

  const continueBtn = document.getElementById("size-continue");
  if (continueBtn) {
    continueBtn.textContent = t("size.cta");
    continueBtn.disabled = !STATE.size;
    if (!STATE.size) continueBtn.setAttribute("aria-disabled", "true");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  ASSESSMENT ENGINE
// ─────────────────────────────────────────────────────────────────────────────

// A question is applicable when all of its dependency conditions are satisfied.
function isQuestionApplicable(q, answers) {
  if (!q.dependsOn) return true;
  return q.dependsOn.every((dep) => dep.showIf.includes(answers[dep.on]));
}

// Ordered list of questions that are currently applicable, given the answers so far.
// Skipped (not applicable) questions are excluded from this path.
function getApplicablePath() {
  return QUESTIONS.filter((q) => isQuestionApplicable(q, STATE.answers));
}

function renderQuestion(qIndex) {
  const path = getApplicablePath();
  const q = path[qIndex];
  if (!q) return;
  const total = path.length;
  const current = qIndex + 1;
  const pct = Math.round((qIndex / total) * 100);

  // Progress
  const counter = document.getElementById("q-counter");
  if (counter) counter.textContent = t("assessment.questionCounter")(current);

  const progressFill = document.getElementById("q-progress-fill");
  if (progressFill) progressFill.style.width = pct + "%";

  const progressLabel = document.getElementById("q-progress-label");
  if (progressLabel) {
    progressLabel.textContent = t("assessment.progressLabel")(pct);
    progressLabel.setAttribute("aria-valuenow", pct);
  }

  // Category label
  const catLabel = document.getElementById("q-category");
  if (catLabel) catLabel.textContent = t(`categories.${q.category}`);

  // Question text
  const qText = document.getElementById("q-text");
  if (qText) qText.textContent = localize(q, "text");

  // Render answers
  const answersContainer = document.getElementById("q-answers");
  if (answersContainer) {
    const currentAnswer = STATE.answers[q.id];
    answersContainer.innerHTML = "";
    const options = [
      { value: "yes", labelKey: "assessment.yes" },
      { value: "no", labelKey: "assessment.no" },
      { value: "notSure", labelKey: "assessment.notSure" },
    ];
    options.forEach(({ value, labelKey }) => {
      const btn = document.createElement("button");
      btn.className = "answer-option" + (currentAnswer === value ? " is-selected" : "");
      btn.textContent = t(labelKey);
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", currentAnswer === value ? "true" : "false");
      btn.setAttribute("aria-label", t(labelKey));
      btn.setAttribute("id", `answer-${value}`);
      btn.addEventListener("click", () => {
        STATE.answers[q.id] = value;
        saveSession();
        document.querySelectorAll(".answer-option").forEach((b) => {
          const isThis = b.id === `answer-${value}`;
          b.classList.toggle("is-selected", isThis);
          b.setAttribute("aria-checked", isThis ? "true" : "false");
        });
        // Enable next button
        const nextBtn = document.getElementById("q-next");
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.removeAttribute("aria-disabled");
        }
      });
      answersContainer.appendChild(btn);
    });
  }

  // Next / Finish button
  const nextBtn = document.getElementById("q-next");
  if (nextBtn) {
    const isLast = qIndex === total - 1;
    nextBtn.textContent = isLast ? t("assessment.finish") : t("assessment.next");
    nextBtn.disabled = !STATE.answers[q.id];
    if (!STATE.answers[q.id]) nextBtn.setAttribute("aria-disabled", "true");
    else nextBtn.removeAttribute("aria-disabled");
    nextBtn.dataset.isLast = isLast ? "true" : "false";
  }

  // Previous button — hidden on question 1, otherwise navigates back
  const prevBtn = document.getElementById("q-prev");
  if (prevBtn) {
    prevBtn.textContent = t("assessment.previous");
    prevBtn.hidden = qIndex === 0;
    prevBtn.disabled = qIndex === 0;
    if (qIndex === 0) prevBtn.setAttribute("aria-disabled", "true");
    else prevBtn.removeAttribute("aria-disabled");
  }

  // Restart link
  const restartLink = document.getElementById("q-restart");
  if (restartLink) restartLink.textContent = t("assessment.restart");
}

// Advance to the next applicable question (or finish if on the last one).
function goNext() {
  const nextBtn = document.getElementById("q-next");
  if (nextBtn && nextBtn.dataset.isLast === "true") {
    startProcessing();
    return;
  }

  const current = STATE.currentQ;
  STATE.currentQ++;

  // Check if we crossed a category boundary → show transition
  if (isLastInCategory(current)) {
    STATE.lastTransitionIndex = current;
    renderTransition(current);
    showScreen("screen-transition");
  } else {
    renderQuestion(STATE.currentQ);
  }
}

// Category transition logic (works on the currently applicable path)
function getCategoryAtIndex(idx) {
  const path = getApplicablePath();
  return path[idx] ? CATEGORIES.find((c) => c.key === path[idx].category) || null : null;
}

function isLastInCategory(idx) {
  const path = getApplicablePath();
  const cur = path[idx];
  const next = path[idx + 1];
  if (!cur || !next) return false;
  return next.category !== cur.category;
}

function getCompletedCategories(idx) {
  const path = getApplicablePath();
  const completed = [];
  const seen = new Set();
  for (let i = 0; i <= idx && i < path.length; i++) {
    const key = path[i].category;
    if (!seen.has(key)) {
      seen.add(key);
      const cat = CATEGORIES.find((c) => c.key === key);
      if (cat) completed.push(cat);
    }
  }
  return completed;
}

function getNextCategory(idx) {
  const path = getApplicablePath();
  const next = path[idx + 1];
  if (!next) return null;
  const cur = path[idx];
  if (cur && next.category === cur.category) return null;
  return CATEGORIES.find((c) => c.key === next.category) || null;
}

function applicableCountForCategory(catKey) {
  return getApplicablePath().filter((q) => q.category === catKey).length;
}

function renderTransition(afterIndex) {
  const completedCats = getCompletedCategories(afterIndex);
  const nextCat = getNextCategory(afterIndex);

  const heading = document.getElementById("trans-heading");
  if (heading) heading.textContent = t("transition.heading");

  const completedLabel = document.getElementById("trans-completed-label");
  if (completedLabel) completedLabel.textContent = t("transition.completedLabel");

  const list = document.getElementById("trans-completed-list");
  if (list) {
    list.innerHTML = "";
    completedCats.forEach((cat) => {
      const li = document.createElement("li");
      li.className = "transition__list-item";
      li.innerHTML = `
        <span class="transition__list-icon" aria-hidden="true">✓</span>
        <span class="transition__list-text">
          <span class="transition__list-name">${t("categories." + cat.key)}</span>
          <span class="transition__list-count">${t("transition.questionCount")(applicableCountForCategory(cat.key))}</span>
        </span>`;
      list.appendChild(li);
    });
  }

  const upNext = document.getElementById("trans-up-next");
  if (upNext && nextCat) {
    upNext.textContent = t("transition.upNextLabel");
  }

  const nextName = document.getElementById("trans-next-cat-name");
  if (nextName && nextCat) {
    nextName.textContent = t("categories." + nextCat.key);
  }

  const nextCount = document.getElementById("trans-next-cat-count");
  if (nextCount && nextCat) {
    nextCount.textContent = t("transition.questionCount")(applicableCountForCategory(nextCat.key));
  }

  // Accessible label for the clickable "Up next" card
  const card = document.getElementById("trans-next-card");
  if (card && nextCat) {
    card.setAttribute("aria-label", t("transition.upNextAria")(t("categories." + nextCat.key)));
  }

  const cta = document.getElementById("trans-continue");
  if (cta) cta.textContent = t("transition.cta");
}

// Continue from a category-completion screen to the next applicable question.
// Shared by the "Continue" CTA and the clickable "Up next" card, so both
// interaction paths always lead to the same destination.
function continueFromTransition() {
  renderQuestion(STATE.currentQ);
  showScreen("screen-assessment");
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────
function computeResults() {
  // Only applicable questions count toward the score.
  // Skipped (not applicable) questions are excluded from every denominator.
  const applicable = getApplicablePath();

  // Category scores
  const catScores = {};
  CATEGORIES.forEach((cat) => {
    const catQs = applicable.filter((q) => q.category === cat.key);
    const maxPoints = catQs.length; // 1 point each
    const earnedPoints = catQs.reduce((sum, q) => {
      const ans = STATE.answers[q.id];
      return sum + (ANSWER_SCORES[ans] ?? 0);
    }, 0);
    catScores[cat.key] = maxPoints > 0 ? earnedPoints / maxPoints : 0;
  });

  // Weighted composite score (0–1)
  // Categories with no applicable questions are excluded and the
  // remaining weights are renormalised so they never penalise the user.
  let rawScore = 0;
  let totalWeight = 0;
  CATEGORIES.forEach((cat) => {
    if (catScores[cat.key] === 0 && !applicable.some((q) => q.category === cat.key)) return;
    rawScore += catScores[cat.key] * cat.weight;
    totalWeight += cat.weight;
  });

  // Normalise to 0–100
  const overallScore = totalWeight > 0 ? Math.round((rawScore / totalWeight) * 100) : 0;

  // Risk tier
  let tier;
  if (overallScore >= 70) tier = "green";
  else if (overallScore >= 40) tier = "amber";
  else tier = "red";

  // Strengths — top 2 categories by score
  const sortedCats = [...CATEGORIES].sort((a, b) => catScores[b.key] - catScores[a.key]);
  const topTwo = sortedCats.slice(0, 2);
  const strengthNames = topTwo.map((c) => t(`categories.${c.key}`));

  // Priority actions — up to 5, from failed/uncertain answers on applicable questions
  // Ordered by: category weight DESC then "no" before "notSure"
  const actionPool = [];
  CATEGORIES.slice() // copy, then sort by weight desc for ordering
    .sort((a, b) => b.weight - a.weight)
    .forEach((cat) => {
      applicable.filter((q) => q.category === cat.key).forEach((q) => {
        const ans = STATE.answers[q.id];
        if (q.triggeredBy.includes(ans)) {
          actionPool.push({
            question: q,
            answer: ans,
            priority: ans === "no" ? 0 : 1, // no = higher priority
            categoryWeight: cat.weight,
          });
        }
      });
    });

  // Sort: no before notSure, then by category weight
  actionPool.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.categoryWeight - a.categoryWeight;
  });

  const priorityActions = actionPool.slice(0, 5);

  return {
    overallScore,
    tier,
    catScores,
    strengthNames,
    priorityActions,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  RESULTS RENDERER
// ─────────────────────────────────────────────────────────────────────────────
// Risk tier icons (Material Symbols — grayscale wireframe)
const RISK_ICONS = {
  green: '<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M424-296l282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>',
  amber: '<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M40-120l440-760 440 760H40Zm138-80h604L480-720 178-200Zm330.5-51.5Q520-263 520-280t-11.5-28.5Q497-320 480-320t-28.5 11.5Q440-297 440-280t11.5 28.5Q463-240 480-240t28.5-11.5ZM440-360h80v-200h-80v200Zm40-100Z"/></svg>',
  red: '<svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M40-120l440-760 440 760H40Zm138-80h604L480-720 178-200Zm330.5-51.5Q520-263 520-280t-11.5-28.5Q497-320 480-320t-28.5 11.5Q440-297 440-280t11.5 28.5Q463-240 480-240t28.5-11.5ZM440-360h80v-200h-80v200Zm40-100Z"/></svg>',
};

function renderResults(results) {
  const { overallScore, tier, catScores, strengthNames, priorityActions } = results;

  // Score
  const scoreNum = document.getElementById("results-score-number");
  if (scoreNum) scoreNum.textContent = overallScore + "%";

  const scoreLabel = document.getElementById("results-score-label");
  if (scoreLabel) scoreLabel.textContent = t("results.scoreLabel");

  // Risk badge
  const badge = document.getElementById("results-tier-badge");
  if (badge) {
    badge.className = `risk-badge risk-badge--${tier}`;
    const iconEl = badge.querySelector(".risk-badge__icon");
    if (iconEl) iconEl.innerHTML = RISK_ICONS[tier] || "";
    const labelEl = badge.querySelector(".risk-badge__label");
    if (labelEl) labelEl.textContent = t(`results.tier${capitalize(tier)}`);
  }

  // Interpretation
  const interp = document.getElementById("results-interpretation");
  if (interp) interp.textContent = t(`results.tier${capitalize(tier)}Msg`);

  // Strengths
  const strengthsSection = document.getElementById("results-strengths");
  const strengthsText = document.getElementById("results-strengths-text");
  if (strengthsText) {
    strengthsText.textContent = t("results.strengthsSummary")(strengthNames.join(" and "));
  }

  // Category breakdown
  const breakdown = document.getElementById("cat-breakdown");
  if (breakdown) {
    breakdown.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const pct = Math.round(catScores[cat.key] * 100);
      const item = document.createElement("div");
      item.className = "cat-score-item";
      item.innerHTML = `
        <div class="cat-score-item__header">
          <span class="cat-score-item__name">${t("categories." + cat.key)}</span>
          <span class="cat-score-item__pct">${pct}%</span>
        </div>
        <div class="cat-score-item__bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${t("categories." + cat.key)}: ${pct}%">
          <div class="cat-score-item__bar-fill" style="width:0%" data-target="${pct}"></div>
        </div>
      `;
      breakdown.appendChild(item);
    });
    // Animate bars after a tick
    setTimeout(() => {
      breakdown.querySelectorAll(".cat-score-item__bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.target + "%";
      });
    }, 100);
  }

  // Collapsible breakdown toggle
  const collapsible = document.getElementById("breakdown-collapsible");
  const trigger = document.getElementById("breakdown-toggle");
  if (trigger && collapsible) {
    trigger.textContent = t("results.breakdownToggle");
    trigger.querySelector && void 0;

    trigger.onclick = () => {
      const isOpen = collapsible.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      trigger.textContent = isOpen ? t("results.breakdownToggleClose") : t("results.breakdownToggle");
    };
  }

  // Priority actions
  const actionsList = document.getElementById("actions-list");
  if (actionsList) {
    actionsList.innerHTML = "";
    if (priorityActions.length === 0) {
      const p = document.createElement("p");
      p.className = "text-sm text-muted";
      p.textContent = t("results.actionsEmpty");
      actionsList.appendChild(p);
    } else {
      priorityActions.forEach(({ question }) => {
        const card = document.createElement("div");
        card.className = "action-card";
        card.innerHTML = `
          <p class="action-card__title">${localize(question, "actionTitle")}</p>
          <p class="action-card__why">${localize(question, "actionWhy")}</p>
          <button class="action-card__link" aria-label="${t("results.guideLink")(question.actionModule)}">${t("results.guideLink")(question.actionModule)}</button>
        `;
        // Module link — TBD URL
        card.querySelector(".action-card__link").addEventListener("click", () => {
          alert(`[TBD] Link to ${question.actionModule}. URL to be confirmed by product owner.`);
        });
        actionsList.appendChild(card);
      });
    }
  }

  // CTAs copy
  const whatsappLabel = document.querySelector("#results-whatsapp .btn__label");
  if (whatsappLabel) whatsappLabel.textContent = t("results.whatsappCta");

  const saveLabel = document.querySelector("#results-save .btn__label");
  if (saveLabel) saveLabel.textContent = t("results.saveCta");

  const restartLabel = document.querySelector("#results-restart .btn__label");
  if (restartLabel) restartLabel.textContent = t("results.restartCta");

  // Disclaimer
  const disc = document.getElementById("results-disclaimer");
  if (disc) disc.textContent = t("results.disclaimer");

  // Headings
  const strengthsHeading = document.getElementById("results-strengths-heading");
  if (strengthsHeading) strengthsHeading.textContent = t("results.strengthsHeading");

  const actionsHeading = document.getElementById("results-actions-heading");
  if (actionsHeading) actionsHeading.textContent = t("results.actionsHeading");

  const breakdownHeading = document.getElementById("results-breakdown-heading");
  if (breakdownHeading) breakdownHeading.textContent = t("results.breakdownHeading");
}

// ─────────────────────────────────────────────────────────────────────────────
//  WHATSAPP
// ─────────────────────────────────────────────────────────────────────────────
function buildWhatsAppMessage(results) {
  const { overallScore, tier, priorityActions } = results;
  const tierLabel = t(`results.tier${capitalize(tier)}`);
  const topActions = priorityActions.slice(0, 3).map((a) => localize(a.question, "actionTitle"));
  return t("whatsapp.messageTemplate")(tierLabel, overallScore, topActions);
}

function openWhatsApp(results) {
  const msg = buildWhatsAppMessage(results);
  if (msg.length > 1000) {
    console.warn("WhatsApp message exceeds 1000 chars, truncation may occur.");
  }
  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/?text=${encoded}`;

  // Try to open; if WhatsApp unavailable, show fallback UI
  const win = window.open(waUrl, "_blank");
  if (!win) {
    renderWhatsAppFallback(msg);
  }
}

function renderWhatsAppScreen() {
  if (!STATE.results) return;
  const preview = document.getElementById("whatsapp-preview-text");
  if (preview) renderWhatsAppPreview(preview, STATE.results);
  const fallback = document.getElementById("whatsapp-fallback");
  if (fallback) fallback.style.display = "none";
}

// Structured preview of the WhatsApp message, using the product typography.
function renderWhatsAppPreview(box, results) {
  const { overallScore, tier, priorityActions } = results;
  const tierLabel = t(`results.tier${capitalize(tier)}`);
  const topActions = priorityActions.slice(0, 3);
  const items = topActions
    .map((a) => `<li>${localize(a.question, "actionTitle")}</li>`)
    .join("");
  box.innerHTML = `
    <p class="whatsapp-preview__risk">
      <span class="whatsapp-preview__label">${t("whatsapp.riskLevel")}:</span>
      <span class="whatsapp-preview__value">${tierLabel}</span>
    </p>
    <p class="whatsapp-preview__score">${overallScore}%</p>
    <p class="whatsapp-preview__actions-label">${t("whatsapp.topActions")}</p>
    <ol class="whatsapp-preview__actions">${items}</ol>
  `;
}

function renderWhatsAppFallback(msg) {
  const fallbackSection = document.getElementById("whatsapp-fallback");
  const copyText = document.getElementById("whatsapp-copy-text");
  if (fallbackSection) fallbackSection.style.display = "block";
  if (copyText) copyText.textContent = msg;
}

// ─────────────────────────────────────────────────────────────────────────────
//  SAVE FLOW
// ─────────────────────────────────────────────────────────────────────────────
function renderConsentScreen() {
  const heading = document.getElementById("consent-heading");
  if (heading) heading.textContent = t("save.consentHeading");

  const body = document.getElementById("consent-body");
  if (body) body.textContent = t("save.consentBody");

  const checkLabel = document.getElementById("consent-check-label");
  if (checkLabel) checkLabel.textContent = t("save.consentCheck");

  const cta = document.getElementById("consent-cta");
  if (cta) {
    cta.textContent = t("save.consentCta");
    cta.disabled = true;
    cta.setAttribute("aria-disabled", "true");
  }

  const decline = document.getElementById("consent-decline");
  if (decline) decline.textContent = t("save.consentDecline");

  // Checkbox logic
  const checkbox = document.getElementById("consent-checkbox");
  if (checkbox) {
    checkbox.checked = false;
    checkbox.onchange = () => {
      const agreed = checkbox.checked;
      if (cta) {
        cta.disabled = !agreed;
        agreed ? cta.removeAttribute("aria-disabled") : cta.setAttribute("aria-disabled", "true");
      }
    };
  }
}

function renderEmailScreen() {
  const heading = document.getElementById("email-heading");
  if (heading) heading.textContent = t("save.emailHeading");

  const emailInput = document.getElementById("email-input");
  if (emailInput) emailInput.setAttribute("placeholder", t("save.emailPlaceholder"));

  const cta = document.getElementById("email-submit");
  if (cta) cta.textContent = t("save.emailCta");

  const back = document.getElementById("email-back");
  if (back) back.textContent = t("save.emailBack");
}

// ─────────────────────────────────────────────────────────────────────────────
//  PRIVACY MODAL
// ─────────────────────────────────────────────────────────────────────────────
function renderPrivacy() {
  const heading = document.getElementById("privacy-modal-heading");
  if (heading) heading.textContent = t("privacy.heading");

  const body = document.getElementById("privacy-modal-body");
  if (body) body.innerHTML = t("privacy.body");

  const closeBtn = document.getElementById("privacy-modal-close");
  if (closeBtn) closeBtn.textContent = t("privacy.close");
}

// ─────────────────────────────────────────────────────────────────────────────
//  MODAL MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("is-active");
    // Trap focus inside modal
    const firstFocusable = modal.querySelector("button, input, [tabindex]");
    if (firstFocusable) firstFocusable.focus();
  }
}

function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("is-active");
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROCESSING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function startProcessing() {
  const heading = document.getElementById("processing-heading");
  if (heading) heading.textContent = t("processing.heading");

  const subtext = document.getElementById("processing-subtext");
  if (subtext) subtext.textContent = t("processing.subtext");

  showScreen("screen-processing");

  // Simulate processing — compute synchronously but add brief delay for UX
  setTimeout(() => {
    STATE.results = computeResults();
    renderResults(STATE.results);
    showScreen("screen-results");
  }, 1500);
}

// ─────────────────────────────────────────────────────────────────────────────
//  RESTART
// ─────────────────────────────────────────────────────────────────────────────
function confirmRestart() {
  const heading = document.getElementById("restart-modal-heading");
  if (heading) heading.textContent = t("restart.heading");

  const body = document.getElementById("restart-modal-body");
  if (body) body.textContent = t("restart.body");

  const confirm = document.getElementById("restart-modal-confirm");
  if (confirm) confirm.textContent = t("restart.confirm");

  const cancel = document.getElementById("restart-modal-cancel");
  if (cancel) cancel.textContent = t("restart.cancel");

  showModal("modal-restart");
}

function doRestart() {
  hideModal("modal-restart");
  clearSession();
  applyLang();
  showScreen("screen-landing");
}

// ─────────────────────────────────────────────────────────────────────────────
//  OFFLINE DETECTION
// ─────────────────────────────────────────────────────────────────────────────
function initOfflineHandling() {
  const render = () => {
    const heading = document.getElementById("offline-heading");
    if (heading) heading.textContent = t("offline.heading");

    const body = document.getElementById("offline-body");
    if (body) body.textContent = t("offline.body");

    const cta = document.getElementById("offline-cta");
    if (cta) cta.textContent = t("offline.cta");
  };

  // Only show offline screen if we're genuinely offline and assessment not started
  window.addEventListener("offline", () => {
    // If user is mid-assessment or viewing results, show inline notice not full screen
    const banner = document.getElementById("offline-banner");
    if (banner) {
      banner.style.display = "block";
      banner.textContent = t("offline.heading") + ". " + t("offline.body");
    }
  });

  window.addEventListener("online", () => {
    const banner = document.getElementById("offline-banner");
    if (banner) banner.style.display = "none";
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  COMPONENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function createSelectionOption({ label, hint, value, isSelected, id }) {
  const btn = document.createElement("button");
  btn.className = "selection-option" + (isSelected ? " is-selected" : "");
  btn.dataset.value = value;
  btn.id = id;
  btn.setAttribute("role", "radio");
  btn.setAttribute("aria-checked", isSelected ? "true" : "false");
  btn.setAttribute("type", "button");

  const textWrap = document.createElement("div");
  const mainSpan = document.createElement("div");
  mainSpan.className = "selection-option__main";
  mainSpan.textContent = label;
  textWrap.appendChild(mainSpan);

  if (hint) {
    const hintSpan = document.createElement("div");
    hintSpan.className = "selection-option__hint";
    hintSpan.textContent = hint;
    textWrap.appendChild(hintSpan);
  }

  const check = document.createElement("span");
  check.className = "selection-option__check";
  check.setAttribute("aria-hidden", "true");
  check.textContent = isSelected ? "✓" : "";

  btn.appendChild(textWrap);
  btn.appendChild(check);
  return btn;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─────────────────────────────────────────────────────────────────────────────
//  EMAIL VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ── Wire up landing screen ──
  initLanding();

  // Start button
  document.getElementById("landing-cta")?.addEventListener("click", () => {
    applyLang();
    renderSector();
    showScreen("screen-sector");
  });

  // ── Sector screen ──
  document.getElementById("sector-continue")?.addEventListener("click", () => {
    renderSize();
    showScreen("screen-size");
  });

  // ── Size screen ──
  document.getElementById("size-continue")?.addEventListener("click", () => {
    STATE.currentQ = 0;
    renderQuestion(STATE.currentQ);
    showScreen("screen-assessment");
  });

  // ── Assessment: Next / Finish ──
  document.getElementById("q-next")?.addEventListener("click", goNext);

  // ── Assessment: Previous ──
  document.getElementById("q-prev")?.addEventListener("click", () => {
    if (STATE.currentQ > 0) {
      STATE.currentQ--;
      renderQuestion(STATE.currentQ);
    }
  });

  // ── Category transition: Continue ──
  document.getElementById("trans-continue")?.addEventListener("click", continueFromTransition);

  // ── Category transition: Up-next card (same destination as Continue) ──
  document.getElementById("trans-next-card")?.addEventListener("click", continueFromTransition);

  // ── Assessment restart link ──
  document.getElementById("q-restart")?.addEventListener("click", confirmRestart);

  // ── Results: WhatsApp ──
  document.getElementById("results-whatsapp")?.addEventListener("click", () => {
    if (STATE.results) {
      renderWhatsAppScreen();
      showScreen("screen-whatsapp");
    }
  });

  // ── WhatsApp screen: Open WhatsApp ──
  document.getElementById("whatsapp-open")?.addEventListener("click", () => {
    if (STATE.results) openWhatsApp(STATE.results);
  });

  // ── Results: Save ──
  document.getElementById("results-save")?.addEventListener("click", () => {
    renderConsentScreen();
    showScreen("screen-consent");
  });

  // ── Results: Restart ──
  document.getElementById("results-restart")?.addEventListener("click", confirmRestart);

  // ── Header logo: go back to landing ──
  document.getElementById("header-logo")?.addEventListener("click", () => {
    const active = document.querySelector(".screen.is-active")?.id;
    const hasProgress = Object.keys(STATE.answers).length > 0 ||
      ["screen-assessment", "screen-transition", "screen-results"].includes(active);
    if (hasProgress) {
      confirmRestart();
    } else {
      showScreen("screen-landing");
    }
  });

  // ── WhatsApp screen: back ──
  document.getElementById("whatsapp-back")?.addEventListener("click", () => {
    showScreen("screen-results");
  });

  // ── WhatsApp copy button ──
  document.getElementById("whatsapp-copy-btn")?.addEventListener("click", () => {
    const text = document.getElementById("whatsapp-copy-text")?.textContent || "";
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById("whatsapp-copy-btn");
      if (btn) {
        btn.textContent = t("whatsapp.copied");
        setTimeout(() => {
          btn.textContent = t("whatsapp.copyBtn");
        }, 2000);
      }
    });
  });

  // ── Consent: checkbox ──
  document.getElementById("consent-checkbox")?.addEventListener("change", function () {
    const cta = document.getElementById("consent-cta");
    if (cta) {
      cta.disabled = !this.checked;
      this.checked ? cta.removeAttribute("aria-disabled") : cta.setAttribute("aria-disabled", "true");
    }
  });

  // ── Consent: Continue to email ──
  document.getElementById("consent-cta")?.addEventListener("click", () => {
    renderEmailScreen();
    showScreen("screen-email");
  });

  // ── Consent: Decline ──
  document.getElementById("consent-decline")?.addEventListener("click", () => {
    showScreen("screen-results");
  });

  // ── Email: Back ──
  document.getElementById("email-back")?.addEventListener("click", () => {
    showScreen("screen-consent");
  });

  // ── Email: Submit ──
  document.getElementById("email-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("email-input");
    const email = emailInput?.value || "";

    if (!isValidEmail(email)) {
      const err = document.getElementById("email-error");
      if (err) {
        err.textContent = t("save.emailInvalid");
        err.style.display = "block";
      }
      emailInput?.classList.add("is-error");
      return;
    }

    // Clear error
    const err = document.getElementById("email-error");
    if (err) err.style.display = "none";
    emailInput?.classList.remove("is-error");

    // Show loading
    const submitBtn = document.getElementById("email-submit");
    if (submitBtn) {
      submitBtn.classList.add("btn-loading");
      submitBtn.disabled = true;
    }

    // Simulate email send (backend TBD)
    setTimeout(() => {
      // 90% success simulation
      const success = Math.random() > 0.1;
      if (success) {
        showScreen("screen-save-success");
        const heading = document.getElementById("save-success-heading");
        if (heading) heading.textContent = t("save.successHeading");
        const body = document.getElementById("save-success-body");
        if (body) body.textContent = t("save.successBody");
        const cta = document.getElementById("save-success-cta");
        if (cta) {
          cta.textContent = t("save.successCta");
          cta.onclick = () => showScreen("screen-results");
        }
      } else {
        showScreen("screen-save-error");
        const heading = document.getElementById("save-error-heading");
        if (heading) heading.textContent = t("save.errorHeading");
        const body = document.getElementById("save-error-body");
        if (body) body.textContent = t("save.errorBody");
        const retry = document.getElementById("save-error-retry");
        if (retry) {
          retry.textContent = t("save.errorRetry");
          retry.onclick = () => showScreen("screen-email");
        }
        const back = document.getElementById("save-error-back");
        if (back) {
          back.textContent = t("save.errorBack");
          back.onclick = () => showScreen("screen-results");
        }
      }
      if (submitBtn) {
        submitBtn.classList.remove("btn-loading");
        submitBtn.disabled = false;
      }
    }, 2000);
  });

  // ── Restart modal ──
  document.getElementById("restart-modal-confirm")?.addEventListener("click", doRestart);
  document.getElementById("restart-modal-cancel")?.addEventListener("click", () => hideModal("modal-restart"));

  // ── Privacy modal ──
  document.getElementById("privacy-modal-close")?.addEventListener("click", () => hideModal("modal-privacy"));

  // Close modals on backdrop click
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("is-active");
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.is-active").forEach((m) =>
        m.classList.remove("is-active")
      );
    }
  });

  // ── Offline detection ──
  initOfflineHandling();

  // ── Error state refresh ──
  document.getElementById("error-cta")?.addEventListener("click", () => {
    window.location.reload();
  });

  // ── Start on landing ──
  showScreen("screen-landing");
  applyLang();
});
