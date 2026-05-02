/**
 * MATEMATICAS AVENTURA — script.js
 * Lucide init · Eventos táctiles · Quiz interactivo
 * Usa pointerdown para respuesta inmediata en tablets
 */
"use strict";

/* ════════════════════════════════════════════
   INICIALIZACIÓN GLOBAL
════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();

  bindPointerButtons();
  initPageSpecific();
  preventZoom();
});

/* ════════════════════════════════════════════
   BINDS TÁCTILES GLOBALES
════════════════════════════════════════════ */
function bindPointerButtons() {
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sinkEffect(backBtn);
    });
  }

  document.querySelectorAll(".map-node").forEach((node) => {
    node.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sinkEffect(node, () => {
        const href = node.getAttribute("href");
        if (href) window.location.href = href;
      });
    });
  });

  document.querySelectorAll(".game-card[data-href]").forEach((card) => {
    card.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sinkEffect(card, () => {
        window.open(card.dataset.href, "_blank", "noopener,noreferrer");
      });
    });
  });

  document.querySelectorAll(".game-link-item[data-href]").forEach((item) => {
    item.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sinkEffect(item, () => {
        window.open(item.dataset.href, "_blank", "noopener,noreferrer");
      });
    });
  });
}

function sinkEffect(el, callback) {
  el.classList.add("btn-pressed");
  setTimeout(() => {
    el.classList.remove("btn-pressed");
    if (callback) callback();
  }, 140);
}

/* ════════════════════════════════════════════
   LÓGICA ESPECÍFICA POR PÁGINA
════════════════════════════════════════════ */
function initPageSpecific() {
  const body = document.body;
  if (body.classList.contains("page-ejercicios")) initQuiz();
  if (body.classList.contains("page-juegos"))     initJuegos();
}

/* ════════════════════════════════════════════
   QUIZ INTERACTIVO (ejercicios.html)
   — Suma de Fracciones / Resta de Fracciones / Fracciones
════════════════════════════════════════════ */
const QUESTIONS = {
  sumaFrac: [
    { q: "1/4 + 2/4 = ?",   opts: ["2/4","3/4","4/4","1/4"],  ans: "3/4"  },
    { q: "1/3 + 1/3 = ?",   opts: ["1/3","2/6","2/3","3/3"],  ans: "2/3"  },
    { q: "2/5 + 2/5 = ?",   opts: ["4/5","4/10","2/5","3/5"], ans: "4/5"  },
    { q: "1/6 + 3/6 = ?",   opts: ["3/6","4/6","2/6","5/6"],  ans: "4/6"  },
    { q: "3/8 + 3/8 = ?",   opts: ["5/8","6/16","6/8","7/8"], ans: "6/8"  },
  ],
  restaFrac: [
    { q: "3/4 - 1/4 = ?",   opts: ["1/4","3/4","2/4","2/8"],  ans: "2/4"  },
    { q: "4/5 - 2/5 = ?",   opts: ["1/5","2/5","2/10","3/5"], ans: "2/5"  },
    { q: "5/6 - 2/6 = ?",   opts: ["2/6","4/6","3/6","1/6"],  ans: "3/6"  },
    { q: "7/8 - 3/8 = ?",   opts: ["3/8","5/8","4/8","4/16"], ans: "4/8"  },
    { q: "2/3 - 1/3 = ?",   opts: ["2/3","0/3","1/3","1/6"],  ans: "1/3"  },
  ],
  fracciones: [
    { q: "1/2 de 10 = ?",       opts: ["3","4","5","6"],    ans: "5" },
    { q: "1/4 de 8 = ?",        opts: ["1","2","3","4"],    ans: "2" },
    { q: "1/3 de 9 = ?",        opts: ["2","3","4","5"],    ans: "3" },
    { q: "2/4 es igual a 1/?",  opts: ["1","2","3","4"],    ans: "2" },
    { q: "3/6 es igual a 1/?",  opts: ["2","3","4","6"],    ans: "2" },
  ],
};

let quizState = {
  topic:    "sumaFrac",
  index:    0,
  score:    0,
  answered: false,
};

function initQuiz() {
  document.querySelectorAll(".topic-tab").forEach((tab) => {
    tab.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      document.querySelectorAll(".topic-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      quizState.topic    = tab.dataset.topic;
      quizState.index    = 0;
      quizState.score    = 0;
      quizState.answered = false;
      showQuestion();
      hideResult();
    });
  });

  const btnNext = document.getElementById("btnNextQ");
  if (btnNext) {
    btnNext.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sinkEffect(btnNext, nextQuestion);
    });
  }

  const btnRestart = document.getElementById("btnRestart");
  if (btnRestart) {
    btnRestart.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      sinkEffect(btnRestart, () => {
        quizState.index    = 0;
        quizState.score    = 0;
        quizState.answered = false;
        hideResult();
        showQuestion();
      });
    });
  }

  showQuestion();
}

function showQuestion() {
  const qs    = QUESTIONS[quizState.topic];
  const total = qs.length;
  const idx   = quizState.index;

  if (idx >= total) { showResult(); return; }

  const q = qs[idx];

  const fill  = document.getElementById("qpFill");
  const label = document.getElementById("qpLabel");
  if (fill)  fill.style.width = `${((idx) / total) * 100}%`;
  if (label) label.textContent = `${idx + 1} / ${total}`;

  const numEl  = document.getElementById("questionNum");
  const textEl = document.getElementById("questionText");
  if (numEl)  numEl.textContent  = `Pregunta ${idx + 1}`;
  if (textEl) textEl.textContent = q.q;

  const btns = document.querySelectorAll(".answer-btn");
  btns.forEach((btn, i) => {
    btn.textContent = q.opts[i];
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
    btn.style.animation = "";
    btn.addEventListener("pointerdown", onAnswerDown, { once: true });
  });

  const fb   = document.getElementById("feedbackBar");
  const next = document.getElementById("btnNextQ");
  if (fb)   { fb.classList.remove("show","fb-correct","fb-wrong"); fb.innerHTML = ""; }
  if (next) next.classList.remove("show");

  quizState.answered = false;
}

function onAnswerDown(e) {
  e.preventDefault();
  if (quizState.answered) return;
  quizState.answered = true;

  const btn     = e.currentTarget;
  const qs      = QUESTIONS[quizState.topic];
  const correct = qs[quizState.index].ans;
  const chosen  = btn.textContent.trim();
  const isRight = chosen === correct;

  document.querySelectorAll(".answer-btn").forEach(b => b.disabled = true);

  if (isRight) {
    btn.classList.add("correct");
    quizState.score++;
  } else {
    btn.classList.add("wrong");
    document.querySelectorAll(".answer-btn").forEach(b => {
      if (b.textContent.trim() === correct) b.classList.add("correct");
    });
  }

  showFeedback(isRight, correct);

  const next = document.getElementById("btnNextQ");
  if (next) {
    setTimeout(() => {
      next.classList.add("show");
      if (window.lucide) lucide.createIcons();
    }, 400);
  }
}

function showFeedback(correct, correctAnswer) {
  const fb = document.getElementById("feedbackBar");
  if (!fb) return;

  if (correct) {
    fb.className = "feedback-bar fb-correct";
    fb.innerHTML = `<i data-lucide="check-circle-2"></i><span>Excelente. Eso es correcto.</span>`;
  } else {
    fb.className = "feedback-bar fb-wrong";
    fb.innerHTML = `<i data-lucide="x-circle"></i><span>Casi. La respuesta era ${correctAnswer}.</span>`;
  }
  if (window.lucide) lucide.createIcons();
  requestAnimationFrame(() => fb.classList.add("show"));
}

function nextQuestion() {
  quizState.index++;
  showQuestion();
}

function showResult() {
  const qc = document.getElementById("quizContent");
  const rs = document.getElementById("resultScreen");
  if (qc) qc.style.display = "none";
  if (rs) {
    rs.classList.add("show");
    const total   = QUESTIONS[quizState.topic].length;
    const scoreEl = document.getElementById("resultScore");
    const msgEl   = document.getElementById("resultMsg");
    if (scoreEl) scoreEl.textContent = `${quizState.score} / ${total}`;
    if (msgEl) {
      const pct = quizState.score / total;
      msgEl.textContent =
        pct >= 0.8 ? "Muy bien. Sigues aprendiendo muy rapido." :
        pct >= 0.6 ? "Bien hecho. Sigue practicando para mejorar." :
                     "Sigue intentando. Puedes hacerlo mejor.";
    }
    if (window.lucide) lucide.createIcons();
  }
}

function hideResult() {
  const qc = document.getElementById("quizContent");
  const rs = document.getElementById("resultScreen");
  if (qc) qc.style.display = "";
  if (rs) rs.classList.remove("show");
}

/* ════════════════════════════════════════════
   JUEGOS — abrir URL externa
════════════════════════════════════════════ */
function initJuegos() {
  // Los game-card con data-href se manejan en bindPointerButtons
}

/* ════════════════════════════════════════════
   PREVENCIÓN ZOOM EN TABLETS
════════════════════════════════════════════ */
function preventZoom() {
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1 && e.cancelable) e.preventDefault();
  }, { passive: false });

  let lastTap = 0;
  document.addEventListener("touchend", (e) => {
    const now = Date.now();
    if (now - lastTap < 280) { e.preventDefault(); }
    lastTap = now;
  }, { passive: false });
}
