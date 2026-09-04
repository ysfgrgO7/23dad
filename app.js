/**
 * برنامج أسدين وبس — محرك التحكم في شاشة العرض المسرحي
 * (Stage Projector Display Engine - 2 Views: Studio & Full Babylon Map)
 * Completely Silent Operation (No Sound Effects)
 */

(() => {
  'use strict';

  // DOM Elements
  const viewport = document.getElementById('stage-viewport');
  const sceneIndicatorIcon = document.getElementById('indicator-icon');
  const sceneIndicatorText = document.getElementById('indicator-text');
  const techPanel = document.getElementById('tech-panel');
  const techCloseBtn = document.getElementById('tech-close-btn');
  const techToggleTrigger = document.getElementById('tech-toggle-trigger');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnResetHunt = document.getElementById('btn-reset-hunt');
  const btnLionRoar = document.getElementById('btn-lion-roar');

  // Bottom-Left Quick Controls
  const btnQuickSoundStudio = document.getElementById('btn-quick-sound-studio');
  const btnQuickSoundRoar = document.getElementById('btn-quick-sound-roar');
  const btnQuickToggleView = document.getElementById('btn-quick-toggle-view');
  const quickViewIcon = document.getElementById('quick-view-icon');

  // Spotlight Dialogue Modal Elements
  const stationModal = document.getElementById('station-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPortraitImg = document.getElementById('modal-portrait-img');
  const modalLocationIcon = document.getElementById('modal-location-icon');
  const modalLocationText = document.getElementById('modal-location-text');
  const modalStageBadge = document.getElementById('modal-stage-badge');
  const modalCharacterName = document.getElementById('modal-character-name');
  const modalDialogueText = document.getElementById('modal-dialogue-text');
  const btnUnlockNext = document.getElementById('btn-unlock-next');

  // 2 Master Scenes: 1. Live Studio | 2. Full Babylon Map
  const SCENES = {
    studio: {
      name: 'studio',
      title: 'الاستوديو الرئيسي — بث مباشر',
      icon: '🎙️'
    },
    map: {
      name: 'map',
      title: 'خريطة بابل — رحلة استكشاف المحطات',
      icon: '🗺️'
    }
  };

  // Station Data: Station 1 = Admins -> Station 2 = King -> Station 3 = Daniel
  // Spoiler-free button text: NEVER leak what or who the next station is!
  const STATIONS_DATA = {
    admins: {
      id: 'station-admins',
      order: 1,
      stageBadge: 'المحطة الأولى 📜',
      characterName: 'الوزراء والولاة الملكيون',
      locationIcon: '🏛️',
      locationText: 'مجلس الوزراء وقاعة الحكم الإمبراطورية',
      portrait: 'assets/Admins.png',
      dialogue: '«إحنا وزراء ورؤساء الملك داريوس.. شوفنا إن دانيال أفضل مننا والملك هيرقّيه فوق المملكة كلها! غِيرتنا خلتنا نخطط لمؤامرة ذكية.. استغللنا أمانته في الصلاة لإلهه وخلينا الملك يوقّع القانون عشان نرمي دانيال في الجُب!»',
      nextKey: 'king',
      nextButtonText: 'فتح المحطة التالية 🔓'
    },
    king: {
      id: 'station-king',
      order: 2,
      stageBadge: 'المحطة الثانية 👑',
      characterName: 'الملك داريوس',
      locationIcon: '🏛️',
      locationText: 'قصر الملك داريوس — بوابة عشتار الإمبراطورية',
      portrait: 'assets/King Darius.png',
      dialogue: '«أنا داريوس ملك مادي وفارس.. الوزراء بتوعي طلبوا مني إصدار مرسوم ملكي صارم ومختوم بخاتمي، أن أي حد يطلب طلب أو يصلي لأي إنسان أو إله غيري لمدة ٣٠ يوماً، يُلقى فوراً في جُب الأسود!»',
      nextKey: 'daniel',
      nextButtonText: 'فتح المحطة التالية 🔓'
    },
    daniel: {
      id: 'station-daniel',
      order: 3,
      stageBadge: 'المحطة الثالثة 🦁',
      characterName: 'دانيال النبي',
      locationIcon: '🦁',
      locationText: 'جُب الأسود الملكي (Palace Menagerie)',
      portrait: 'assets/Daniel.png',
      dialogue: '«أنا دانيال.. فضلت أميناً لإلهي وفتحت طاقاتي نحو أورشليم وركعت وصليت ثلاث مرات في اليوم كعادتي. رَموني في جُب الأسود الجائعة.. ولكن: «إِلَهِي أَرْسَلَ مَلاَكَهُ وَسَدَّ أَفْوَاهَ الأُسُودِ فَلَمْ تَضُرَّنِي»!»',
      nextKey: null,
      nextButtonText: 'اكتملت القصة بنجاح 🌟'
    }
  };

  // Progression: ALL stations are hidden/unrevealed at first!
  const stationUnlockedState = {
    admins: false,
    king: false,
    daniel: false
  };

  // Which station is currently accessible to click/start
  let currentAccessibleStep = 'admins';

  // Scene Buttons in Technician HUD
  const sceneButtons = {
    studio: document.getElementById('btn-scene-1'),
    map: document.getElementById('btn-scene-2')
  };

  let currentScene = 'studio';
  let activeStationKey = null;
  let idleTimeout = null;
  const IDLE_DELAY_MS = 3000;

  // Studio Sound Effect (Loaded from assets/news.mp3)
  const studioSound = new Audio('assets/news.mp3');
  studioSound.preload = 'auto';

  function playStudioSound() {
    try {
      studioSound.pause();
      studioSound.currentTime = 0;
      const playPromise = studioSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Audio playback deferred until user interaction:', err.message);
        });
      }
      if (btnQuickSoundStudio) {
        btnQuickSoundStudio.classList.remove('btn-active-trigger');
        void btnQuickSoundStudio.offsetWidth;
        btnQuickSoundStudio.classList.add('btn-active-trigger');
      }
    } catch (e) {
      console.warn('Error playing studio sound effect:', e);
    }
  }

  // Lion Roar Sound Effect (Loaded from assets/lioRoar.mp3)
  const lionRoarSound = new Audio('assets/lioRoar.mp3');
  lionRoarSound.preload = 'auto';

  function playLionRoar() {
    try {
      lionRoarSound.pause();
      lionRoarSound.currentTime = 0;
      const playPromise = lionRoarSound.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Lion roar playback deferred until user interaction:', err.message);
        });
      }
      if (btnLionRoar) {
        btnLionRoar.classList.remove('roaring');
        void btnLionRoar.offsetWidth;
        btnLionRoar.classList.add('roaring');
      }
      if (btnQuickSoundRoar) {
        btnQuickSoundRoar.classList.remove('btn-active-trigger');
        void btnQuickSoundRoar.offsetWidth;
        btnQuickSoundRoar.classList.add('btn-active-trigger');
      }
    } catch (e) {
      console.warn('Error playing lion roar sound effect:', e);
    }
  }

  // Update Visual State of Map Nodes
  function updateStationNodesUI() {
    Object.keys(STATIONS_DATA).forEach(stationKey => {
      const data = STATIONS_DATA[stationKey];
      const nodeEl = document.getElementById(data.id);
      if (!nodeEl) return;

      const isUnlocked = stationUnlockedState[stationKey];
      const isReadyToExplore = (stationKey === currentAccessibleStep);

      nodeEl.classList.toggle('unlocked', isUnlocked);
      nodeEl.classList.toggle('locked', !isUnlocked);
      nodeEl.classList.toggle('ready-target', isReadyToExplore && !isUnlocked);

      if (isUnlocked) {
        nodeEl.setAttribute('aria-label', `${data.stageBadge} - ${data.characterName}`);
      } else if (isReadyToExplore) {
        nodeEl.setAttribute('aria-label', `محطة جاهزة للاستكشاف (اضغط للفتح)`);
      } else {
        nodeEl.setAttribute('aria-label', `محطة سرية مغلقة`);
      }
    });
  }

  // Switch between the 2 Master Views (1: studio, 2: map)
  function setScene(sceneName) {
    if (!SCENES[sceneName]) return;
    currentScene = sceneName;

    // Close any open modal on scene switch
    closeStationModal();

    // 1. Update Viewport data-scene attribute
    viewport.setAttribute('data-scene', sceneName);

    // 2. Update Top Bar Indicator
    const config = SCENES[sceneName];
    sceneIndicatorIcon.textContent = config.icon;
    sceneIndicatorText.textContent = config.title;

    // 3. Update Technician HUD buttons
    Object.keys(sceneButtons).forEach(key => {
      if (sceneButtons[key]) {
        sceneButtons[key].classList.toggle('active', key === sceneName);
      }
    });

    // 4. Update Quick Toggle View Icon (shows what next click will switch to)
    if (quickViewIcon) {
      quickViewIcon.textContent = sceneName === 'studio' ? '🗺️' : '🎙️';
    }
    if (btnQuickToggleView) {
      btnQuickToggleView.setAttribute(
        'title',
        sceneName === 'studio' ? 'الانتقال إلى خريطة بابل (مسطرة المسافات)' : 'الانتقال إلى استوديو البث (مسطرة المسافات)'
      );
    }

    // 5. Play studio sound effect every time user goes to studio
    if (sceneName === 'studio') {
      playStudioSound();
    }
  }

  // Toggle between Studio and Map views
  function toggleScene() {
    const nextScene = currentScene === 'studio' ? 'map' : 'studio';
    setScene(nextScene);
    if (btnQuickToggleView) {
      btnQuickToggleView.classList.remove('btn-active-trigger');
      void btnQuickToggleView.offsetWidth;
      btnQuickToggleView.classList.add('btn-active-trigger');
    }
  }

  // Open Station Character Spotlight Dialogue Modal
  function openStationModal(stationKey) {
    const isUnlocked = stationUnlockedState[stationKey];
    const isReady = (stationKey === currentAccessibleStep);
    const data = STATIONS_DATA[stationKey];
    const nodeEl = document.getElementById(data.id);

    // If station is neither unlocked nor the current accessible step, lock it!
    if (!isUnlocked && !isReady) {
      if (nodeEl) {
        nodeEl.classList.remove('shake-locked');
        void nodeEl.offsetWidth; // trigger reflow
        nodeEl.classList.add('shake-locked');
      }
      return;
    }

    // Reveal station on the map upon opening!
    if (!isUnlocked && isReady) {
      stationUnlockedState[stationKey] = true;
      updateStationNodesUI();
      if (nodeEl) {
        nodeEl.classList.add('just-unlocked');
        setTimeout(() => nodeEl.classList.remove('just-unlocked'), 1200);
      }
    }

    activeStationKey = stationKey;
    modalPortraitImg.src = data.portrait;
    modalPortraitImg.alt = data.characterName;
    modalLocationIcon.textContent = data.locationIcon;
    modalLocationText.textContent = data.locationText;
    modalStageBadge.textContent = data.stageBadge;
    modalCharacterName.textContent = data.characterName;
    modalDialogueText.textContent = data.dialogue;

    // Configure Spoiler-Free Unlock Button
    btnUnlockNext.style.display = 'inline-flex';
    btnUnlockNext.querySelector('span').textContent = data.nextButtonText;

    // Highlight active station pin
    document.querySelectorAll('.map-station-node').forEach(node => {
      node.classList.toggle('active-station', node.id === data.id);
    });

    // Show modal
    stationModal.classList.add('visible');
    stationModal.setAttribute('aria-hidden', 'false');
  }

  // Close Station Modal
  function closeStationModal() {
    activeStationKey = null;
    stationModal.classList.remove('visible');
    stationModal.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.map-station-node').forEach(node => {
      node.classList.remove('active-station');
    });
  }

  // Mission Complete Toast & Grand Finale Elements
  const missionToast = document.getElementById('mission-toast');
  const missionToastTitle = document.getElementById('mission-toast-title');
  const missionToastDesc = document.getElementById('mission-toast-desc');
  const grandFinaleOverlay = document.getElementById('grand-finale-overlay');
  const finaleCloseBtn = document.getElementById('finale-close-btn');
  const finaleBackdrop = document.getElementById('finale-backdrop');
  const btnFinaleRestart = document.getElementById('btn-finale-restart');
  const btnFinaleRoar = document.getElementById('btn-finale-roar');
  const btnFinaleStudio = document.getElementById('btn-finale-studio');
  const confettiCanvas = document.getElementById('confetti-canvas');

  // Track Completed Stations: Set of completed keys
  const completedStations = new Set();
  let toastTimer = null;
  let confettiAnimId = null;
  let confettiParticles = [];

  // Update Visual State of Map Nodes & Adventure Progress Tracker
  function updateStationNodesUI() {
    Object.keys(STATIONS_DATA).forEach(stationKey => {
      const data = STATIONS_DATA[stationKey];
      const nodeEl = document.getElementById(data.id);
      const trackNode = document.getElementById(`track-node-${data.order}`);
      const trackDiv = document.getElementById(`track-div-${data.order}`);
      if (!nodeEl) return;

      const isUnlocked = stationUnlockedState[stationKey];
      const isReadyToExplore = (stationKey === currentAccessibleStep);
      const isCompleted = completedStations.has(stationKey);

      nodeEl.classList.toggle('unlocked', isUnlocked);
      nodeEl.classList.toggle('locked', !isUnlocked);
      nodeEl.classList.toggle('ready-target', isReadyToExplore && !isUnlocked);
      nodeEl.classList.toggle('station-solved', isCompleted);

      // Update Tracker Node
      if (trackNode) {
        trackNode.classList.toggle('active', isReadyToExplore);
        trackNode.classList.toggle('completed', isCompleted);
        const statusEl = trackNode.querySelector('.track-status');
        if (statusEl) {
          statusEl.textContent = isCompleted ? '✓' : data.order.toString();
        }
      }
      if (trackDiv) {
        trackDiv.classList.toggle('completed', isCompleted);
      }

      if (isCompleted) {
        nodeEl.setAttribute('aria-label', `${data.stageBadge} - ${data.characterName} (مكتملة)`);
      } else if (isUnlocked) {
        nodeEl.setAttribute('aria-label', `${data.stageBadge} - ${data.characterName}`);
      } else if (isReadyToExplore) {
        nodeEl.setAttribute('aria-label', `محطة جاهزة للاستكشاف (اضغط للفتح)`);
      } else {
        nodeEl.setAttribute('aria-label', `محطة سرية مغلقة`);
      }
    });
  }

  // Show "Mission Complete" celebration toast after solving a station
  function showMissionCompleteToast(title, desc) {
    if (!missionToast) return;
    clearTimeout(toastTimer);

    if (missionToastTitle) missionToastTitle.textContent = title;
    if (missionToastDesc) missionToastDesc.textContent = desc;

    missionToast.classList.add('visible');
    missionToast.setAttribute('aria-hidden', 'false');

    toastTimer = setTimeout(() => {
      missionToast.classList.remove('visible');
      missionToast.setAttribute('aria-hidden', 'true');
    }, 2800);
  }

  // High-Performance Confetti Particle Engine for Grand Finale
  function startConfettiCelebration() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    confettiCanvas.width = viewport.clientWidth || window.innerWidth;
    confettiCanvas.height = viewport.clientHeight || window.innerHeight;

    const colors = ['#ffd700', '#ffaa00', '#ff2a6d', '#8a2be2', '#00e5ff', '#ffffff', '#00ff88'];
    confettiParticles = Array.from({ length: 140 }, () => ({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      size: Math.random() * 9 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2.5,
      speedX: (Math.random() - 0.5) * 2.5,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
      opacity: Math.random() * 0.4 + 0.6
    }));

    function renderConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      confettiParticles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > confettiCanvas.height) {
          p.y = -20;
          p.x = Math.random() * confettiCanvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (grandFinaleOverlay.classList.contains('visible')) {
        confettiAnimId = requestAnimationFrame(renderConfetti);
      }
    }

    cancelAnimationFrame(confettiAnimId);
    confettiAnimId = requestAnimationFrame(renderConfetti);
  }

  function stopConfettiCelebration() {
    cancelAnimationFrame(confettiAnimId);
    if (confettiCanvas) {
      const ctx = confettiCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // Open Grand Finale Celebration Screen
  function triggerGrandFinale() {
    closeStationModal();
    if (!grandFinaleOverlay) return;

    grandFinaleOverlay.classList.add('visible');
    grandFinaleOverlay.setAttribute('aria-hidden', 'false');
    startConfettiCelebration();
  }

  // Close Grand Finale Screen
  function closeGrandFinale() {
    if (!grandFinaleOverlay) return;
    grandFinaleOverlay.classList.remove('visible');
    grandFinaleOverlay.setAttribute('aria-hidden', 'true');
    stopConfettiCelebration();
  }

  // Unlock the Next Station / Complete Current Station
  function unlockNextStation() {
    if (!activeStationKey) return;
    const currentData = STATIONS_DATA[activeStationKey];
    const nextKey = currentData.nextKey;

    // Mark current station as completed
    completedStations.add(activeStationKey);
    updateStationNodesUI();

    if (nextKey) {
      // Mission complete for station 1 or 2
      const toastTitle = activeStationKey === 'admins' 
        ? 'تم إنجاز المحطة الأولى بنجاح! ✦'
        : 'تم إنجاز المحطة الثانية بنجاح! ✦';
      const toastDesc = activeStationKey === 'admins'
        ? 'تم فك لغز مجلس الوزراء وانكشف مسار المحطة التالية على الخريطة!'
        : 'تم توقيع واكتشاف أسرار القصر الملكي وانكشف مسار المحطة التالية!';

      showMissionCompleteToast(toastTitle, toastDesc);

      // Set next station as accessible and revealed
      currentAccessibleStep = nextKey;
      stationUnlockedState[nextKey] = true;
      updateStationNodesUI();

      const nextNode = document.getElementById(STATIONS_DATA[nextKey].id);
      if (nextNode) {
        nextNode.classList.add('just-unlocked');
        setTimeout(() => nextNode.classList.remove('just-unlocked'), 1600);
      }

      // Close modal to reveal the newly discovered station on the map
      closeStationModal();
    } else {
      // Final Station (Daniel) Solved: Launch Grand Finale!
      showMissionCompleteToast('اكتملت جميع المحطات بنجاح! 🌟', 'تمت نجاة دانيال وتحقيق الانتصار العظيم في بابل!');
      triggerGrandFinale();
    }
  }

  // Reset Scavenger Hunt Progress (ALL stations hidden with '?', Station 1 ready)
  function resetHuntProgress() {
    stationUnlockedState.admins = false;
    stationUnlockedState.king = false;
    stationUnlockedState.daniel = false;
    completedStations.clear();
    currentAccessibleStep = 'admins';
    updateStationNodesUI();
    closeStationModal();
    closeGrandFinale();
    console.log('🔄 تم إعادة ضبط الخريطة: جميع المحطات مخفية، المحطة ١ جاهزة للاكتشاف.');
  }

  // Toggle Fullscreen Mode
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Toggle Backstage Technician Control Panel
  function toggleTechPanel(forceState) {
    const isVisible = techPanel.classList.contains('visible');
    const newState = forceState !== undefined ? forceState : !isVisible;
    
    techPanel.classList.toggle('visible', newState);
    techPanel.setAttribute('aria-hidden', (!newState).toString());

    if (newState) {
      document.body.classList.remove('idle-cursor');
    }
  }

  // 3-Second Idle Mouse Cursor Auto-Hide
  function resetIdleTimer() {
    document.body.classList.remove('idle-cursor');
    clearTimeout(idleTimeout);

    if (techPanel.classList.contains('visible') || 
        stationModal.classList.contains('visible') || 
        (grandFinaleOverlay && grandFinaleOverlay.classList.contains('visible'))) {
      return;
    }

    idleTimeout = setTimeout(() => {
      if (!techPanel.classList.contains('visible') && 
          !stationModal.classList.contains('visible') && 
          (!grandFinaleOverlay || !grandFinaleOverlay.classList.contains('visible'))) {
        document.body.classList.add('idle-cursor');
      }
    }, IDLE_DELAY_MS);
  }

  // Keyboard Event Handlers
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key;

    switch (key) {
      case '1':
      case 'Num1':
      case 'Numpad1':
        e.preventDefault();
        setScene('studio');
        break;

      case '2':
      case 'Num2':
      case 'Numpad2':
        e.preventDefault();
        setScene('map');
        break;

      case 'r':
      case 'R':
      case 'ق':
        e.preventDefault();
        resetHuntProgress();
        break;

      case 'f':
      case 'F':
      case 'ب':
        e.preventDefault();
        toggleFullscreen();
        break;

      case 'h':
      case 'H':
      case 'ا':
        e.preventDefault();
        toggleTechPanel();
        break;

      case 'l':
      case 'L':
      case 'م': // Arabic keyboard layout equivalent for L
        e.preventDefault();
        playLionRoar();
        break;

      case ' ':
      case 'Spacebar':
        // Only toggle view if modal or finale is not open
        if (!stationModal.classList.contains('visible') && 
            (!grandFinaleOverlay || !grandFinaleOverlay.classList.contains('visible'))) {
          e.preventDefault();
          toggleScene();
        }
        break;

      case 'Escape':
        if (grandFinaleOverlay && grandFinaleOverlay.classList.contains('visible')) {
          closeGrandFinale();
        } else if (stationModal.classList.contains('visible')) {
          closeStationModal();
        } else if (techPanel.classList.contains('visible')) {
          toggleTechPanel(false);
        }
        break;
    }

    resetIdleTimer();
  });

  // Attach Station Click / Touch / Enter Handlers
  Object.keys(STATIONS_DATA).forEach(stationKey => {
    const data = STATIONS_DATA[stationKey];
    const nodeEl = document.getElementById(data.id);
    if (nodeEl) {
      nodeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        openStationModal(stationKey);
      });
      nodeEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openStationModal(stationKey);
        }
      });
    }
  });

  // Unlock next button in modal
  btnUnlockNext.addEventListener('click', (e) => {
    e.stopPropagation();
    unlockNextStation();
  });

  // Modal backdrop and close button handlers
  modalCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeStationModal();
  });
  modalBackdrop.addEventListener('click', closeStationModal);

  // Grand Finale Event Listeners
  if (finaleCloseBtn) {
    finaleCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGrandFinale();
    });
  }
  if (finaleBackdrop) {
    finaleBackdrop.addEventListener('click', closeGrandFinale);
  }
  if (btnFinaleRestart) {
    btnFinaleRestart.addEventListener('click', (e) => {
      e.stopPropagation();
      resetHuntProgress();
    });
  }
  if (btnFinaleRoar) {
    btnFinaleRoar.addEventListener('click', (e) => {
      e.stopPropagation();
      playLionRoar();
    });
  }
  if (btnFinaleStudio) {
    btnFinaleStudio.addEventListener('click', (e) => {
      e.stopPropagation();
      closeGrandFinale();
      setScene('studio');
    });
  }

  // Mouse & Touch Activity Listeners for Idle Detection
  window.addEventListener('mousemove', resetIdleTimer, { passive: true });
  window.addEventListener('mousedown', resetIdleTimer, { passive: true });
  window.addEventListener('touchstart', resetIdleTimer, { passive: true });

  // Technician Panel Buttons
  Object.keys(sceneButtons).forEach(key => {
    const btn = sceneButtons[key];
    if (btn) {
      btn.addEventListener('click', () => setScene(key));
    }
  });

  btnFullscreen.addEventListener('click', toggleFullscreen);
  if (btnLionRoar) {
    btnLionRoar.addEventListener('click', playLionRoar);
  }
  if (btnResetHunt) {
    btnResetHunt.addEventListener('click', resetHuntProgress);
  }
  techCloseBtn.addEventListener('click', () => toggleTechPanel(false));
  techToggleTrigger.addEventListener('click', () => toggleTechPanel());

  // Bottom-Left Quick Controls Event Listeners
  if (btnQuickSoundStudio) {
    btnQuickSoundStudio.addEventListener('click', (e) => {
      e.stopPropagation();
      playStudioSound();
    });
  }
  if (btnQuickSoundRoar) {
    btnQuickSoundRoar.addEventListener('click', (e) => {
      e.stopPropagation();
      playLionRoar();
    });
  }
  if (btnQuickToggleView) {
    btnQuickToggleView.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleScene();
    });
  }

  // Prevent default context menu outside tech panel
  window.addEventListener('contextmenu', (e) => {
    if (!techPanel.contains(e.target)) {
      e.preventDefault();
    }
  });

  // Initialize UI & Default State
  updateStationNodesUI();
  setScene('studio');
  resetIdleTimer();

  console.log('🦁 برنامج أسدين وبس: نظام العرض المسرحي جاهز (صامت بدون مؤثرات صوتية)');
})();
