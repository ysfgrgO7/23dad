/**
 * Interactive Real-World Scavenger Hunt Web App (دانيال وجب الأسود)
 * Full-Screen Map Game Logic (No Sound Effects)
 */

// ==========================================
// 1. Station Data & Egyptian Arabic Dialogues
// ==========================================
const STATIONS_DATA = [
  {
    id: 1,
    name: "الملك داريوس",
    image: "assets/King Darius.png",
    dialogue:
      "انا داريوس ملك فارس، وجولي الوزراء بتوعي قالولي اني اصدر امر ملكي ان اي حد يطلب طلب او يصلي لانسان او اله غيري لمدة ٣٠ يوم يترمي في جب الاسود.",
    buttonText: "لقيتها! افتح المحطة التالية 🔍",
  },
  {
    id: 2,
    name: "الوزراء",
    image: "assets/Admins.png",
    dialogue:
      "احنا وزراء الملك داريوس وشوفنا ان دانيال احسن مننا.. فكنا غيرانين منه وكنا عايزين نأذيه، واحنا عارفين انه كل يوم بيصلي لإلهه وهو سايب الشباك مفتوح، فجتلنا فكرة شريرة وهي اننا نروح نطلب من الملك ان اي حد بيصلي لإلهه يترمي في جب الاسود!",
    buttonText: "عرفنا خطتهم! ابحث عن دانيال في الجب 🦁",
  },
  {
    id: 3,
    name: "دانيال النبي",
    image: "assets/Daniel.png",
    dialogue:
      "انا دانيال كنت احسن وزير عند الملك داريوس وكنت بصلي لإلهي كل يوم عشان هو وقف معايا في السبي من ساعة ما جيت، ودلوقتي هيرموني في جب الاسود!",
    buttonText: "رؤية المعجزة والنجاة! 🌟",
  },
];

// ==========================================
// 2. Canvas Confetti (Visual feedback only)
// ==========================================
class ConfettiEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(duration = 3000) {
    this.resize();
    const colors = [
      "#f59e0b",
      "#fbbf24",
      "#10b981",
      "#ef4444",
      "#60a5fa",
      "#f472b6",
      "#ffffff",
    ];
    const particleCount = 120;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: this.canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: this.canvas.height * 0.4 + (Math.random() - 0.5) * 100,
        w: Math.random() * 10 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 16,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.35,
        drag: 0.98,
        opacity: 1,
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.005;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      this.ctx.restore();

      if (p.opacity <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

let confetti = null;

// ==========================================
// 3. Game State & Persistence
// ==========================================
const STORAGE_KEY = "daniel_hunt_state_3stations_v1";

class GameState {
  constructor() {
    this.completedStations = [];
    this.activeStation = 1;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.completedStations = parsed.completedStations || [];
        this.activeStation = parsed.activeStation || 1;
      }
    } catch (e) {
      console.warn("Failed to load state:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedStations: this.completedStations,
          activeStation: this.activeStation,
        }),
      );
    } catch (e) {
      console.warn("Failed to save state:", e);
    }
  }

  completeStation(id) {
    if (!this.completedStations.includes(id)) {
      this.completedStations.push(id);
    }
    if (this.activeStation === id && id < 3) {
      this.activeStation = id + 1;
    }
    this.save();
  }

  reset() {
    this.completedStations = [];
    this.activeStation = 1;
    this.save();
  }
}

const game = new GameState();

// ==========================================
// 4. DOM Elements & UI Controllers
// ==========================================
const DOM = {
  resetBtn: document.getElementById("reset-btn"),
  nodes: [
    document.getElementById("node-1"),
    document.getElementById("node-2"),
    document.getElementById("node-3"),
  ],

  // Modal Elements
  stationModal: document.getElementById("station-modal"),
  modalClose: document.getElementById("modal-close"),
  modalCharName: document.getElementById("modal-char-name"),
  modalCharImg: document.getElementById("modal-char-img"),
  modalDialogueText: document.getElementById("modal-dialogue-text"),
  modalActionBtn: document.getElementById("modal-action-btn"),
  modalBtnText: document.getElementById("modal-btn-text"),

  // Finale Elements
  finaleOverlay: document.getElementById("finale-overlay"),
  finaleReplayBtn: document.getElementById("finale-replay-btn"),
  finaleBackBtn: document.getElementById("finale-back-btn"),

  // Confirm Modal
  confirmModal: document.getElementById("confirm-modal"),
  confirmResetYes: document.getElementById("confirm-reset-yes"),
  confirmResetNo: document.getElementById("confirm-reset-no"),
};

let currentModalStationId = null;

// ==========================================
// 5. UI Update Logic
// ==========================================
function updateUI() {
  [1, 2, 3].forEach((stationId) => {
    const nodeEl = DOM.nodes[stationId - 1];
    if (!nodeEl) return;
    const isCompleted = game.completedStations.includes(stationId);
    const isActive = game.activeStation === stationId;

    nodeEl.classList.remove("locked", "active", "completed");

    const badgeNum = nodeEl.querySelector(".badge-num");
    const arabicNums = ["١", "٢", "٣"];
    const numStr = arabicNums[stationId - 1] || stationId;

    if (isCompleted) {
      nodeEl.classList.add("completed");
      if (badgeNum) badgeNum.textContent = `✓ محطة ${numStr}`;
    } else if (isActive) {
      nodeEl.classList.add("active");
      if (badgeNum) badgeNum.textContent = `⭐ محطة ${numStr}`;
    } else {
      nodeEl.classList.add("locked");
      if (badgeNum) badgeNum.textContent = `🔒 محطة ${numStr}`;
    }
  });
}

// ==========================================
// 6. Modal Handlers
// ==========================================
function openStationModal(stationId) {
  const data = STATIONS_DATA.find((s) => s.id === stationId);
  if (!data) return;

  currentModalStationId = stationId;
  DOM.modalCharName.textContent = data.name;
  DOM.modalCharImg.src = data.image;
  DOM.modalDialogueText.textContent = data.dialogue;
  DOM.modalBtnText.textContent = data.buttonText;

  DOM.stationModal.classList.add("open");
  DOM.stationModal.setAttribute("aria-hidden", "false");
}

function closeStationModal() {
  DOM.stationModal.classList.remove("open");
  DOM.stationModal.setAttribute("aria-hidden", "true");
  currentModalStationId = null;
}

function openFinale() {
  DOM.finaleOverlay.classList.add("open");
  DOM.finaleOverlay.setAttribute("aria-hidden", "false");
  confetti.fire(4000);
}

function closeFinale() {
  DOM.finaleOverlay.classList.remove("open");
  DOM.finaleOverlay.setAttribute("aria-hidden", "true");
}

// ==========================================
// 7. Event Listeners & Interactions
// ==========================================
function setupEventListeners() {
  // Reset flow
  DOM.resetBtn.addEventListener("click", () => {
    DOM.confirmModal.classList.add("open");
  });

  DOM.confirmResetNo.addEventListener("click", () => {
    DOM.confirmModal.classList.remove("open");
  });

  DOM.confirmResetYes.addEventListener("click", () => {
    game.reset();
    updateUI();
    DOM.confirmModal.classList.remove("open");
    closeStationModal();
    closeFinale();
  });

  // Map Node Clicks (3 Stations)
  DOM.nodes.forEach((nodeEl, idx) => {
    const stationId = idx + 1;
    nodeEl.addEventListener("click", () => {
      const isCompleted = game.completedStations.includes(stationId);
      const isActive = game.activeStation === stationId;

      if (isCompleted || isActive) {
        openStationModal(stationId);
      }
    });
  });

  // Modal actions
  DOM.modalClose.addEventListener("click", closeStationModal);

  DOM.modalActionBtn.addEventListener("click", () => {
    if (currentModalStationId) {
      const finishedId = currentModalStationId;
      game.completeStation(finishedId);
      confetti.fire(1500);

      closeStationModal();
      updateUI();

      // If station 3 (Daniel in the den) was completed, show Grand Finale
      if (finishedId === 3) {
        setTimeout(() => {
          openFinale();
        }, 500);
      }
    }
  });

  // Finale Actions
  DOM.finaleReplayBtn.addEventListener("click", () => {
    game.reset();
    closeFinale();
    updateUI();
  });

  DOM.finaleBackBtn.addEventListener("click", () => {
    closeFinale();
  });

  // Close modals on overlay backdrop click
  DOM.stationModal.addEventListener("click", (e) => {
    if (e.target === DOM.stationModal) closeStationModal();
  });

  DOM.finaleOverlay.addEventListener("click", (e) => {
    if (e.target === DOM.finaleOverlay) closeFinale();
  });

  DOM.confirmModal.addEventListener("click", (e) => {
    if (e.target === DOM.confirmModal)
      DOM.confirmModal.classList.remove("open");
  });
}

// ==========================================
// 8. App Initialization
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  confetti = new ConfettiEffect("confetti-canvas");
  setupEventListeners();
  updateUI();

  if (window.location.search.includes("noanim")) {
    document.body.classList.add("no-anim");
  }

  const handleHash = () => {
    if (window.location.hash === "#modal1") openStationModal(1);
    else if (window.location.hash === "#modal2") openStationModal(2);
    else if (window.location.hash === "#modal3") openStationModal(3);
    else if (window.location.hash === "#finale") openFinale();
    else if (window.location.hash === "#confirm")
      DOM.confirmModal.classList.add("open");
  };
  handleHash();
  window.addEventListener("hashchange", handleHash);
});
