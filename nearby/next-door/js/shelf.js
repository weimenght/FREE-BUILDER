    /* ENVIRONMENT & BACK-SHELF */
    let envKey = '';
    function applyCafeOrBarEnvironment() {
      const isBar = AppState.isBarOpen;
      const t = i18n[AppState.lang];
      if (envKey === isBar + AppState.lang) return;
      envKey = isBar + AppState.lang;

      const stageBox = document.getElementById('stage-counter-box');
      const cellarBanner = document.getElementById('cellar-banner-text');
      const shelfLeft = document.getElementById('shelf-icon-left');
      const shelfRight = document.getElementById('shelf-icon-right');
      const outfitBar = document.getElementById('outfit-bar');
      const outfitCafe = document.getElementById('outfit-cafe');

      if (isBar) {
        if (cellarBanner) cellarBanner.textContent = t.cellarBannerBar;
        if (shelfLeft) shelfLeft.textContent = "🍾🍷🍸🍶";
        if (shelfRight) shelfRight.textContent = "🥃🍹🍵☕";
        if (outfitBar) outfitBar.classList.remove('hidden');
        if (outfitCafe) outfitCafe.classList.add('hidden');
        if (stageBox) stageBox.classList.toggle("cafe-mode", !isBar);
      } else {
        if (cellarBanner) cellarBanner.textContent = t.cellarBannerCafe;
        if (shelfLeft) shelfLeft.textContent = "☕🫖🥐🍰";
        if (shelfRight) shelfRight.textContent = "🌾🥛🫘🍶";
        if (outfitBar) outfitBar.classList.add('hidden');
        if (outfitCafe) outfitCafe.classList.remove('hidden');
        if (stageBox) stageBox.classList.toggle("cafe-mode", !isBar);
      }

      populateCodexContent();
    }

    /* HOST SLEEP SYSTEM: 12am-6am & 12pm-2pm SLEEPING */
    function evaluateWeiState() {
      const awakeLayer = document.getElementById('avatar-layer-awake');
      const sleepLayer = document.getElementById('avatar-layer-sleeping');
      const zzzParticles = document.getElementById('wei-zzz-particles');
      const weiContainer = document.getElementById('sprite-wei-container');

      const h = AppState.hour % 24;      

      // RULE: 12am-6am (0.0 to 6.0) & 12pm-2pm (12.0 to 14.0) the barista/bartender is sleeping
      const isSleepHour = (h >= 0.0 && h < 6.0) || (h >= 12.0 && h < 14.0);
      if (isSleepHour) {
        AppState.weiState = 'asleep';
        if (awakeLayer) awakeLayer.classList.add('hidden');
        if (sleepLayer) sleepLayer.classList.remove('hidden');
        if (zzzParticles) zzzParticles.classList.remove('hidden');
        
        if (weiContainer) {
          weiContainer.classList.remove('sway-idle');
          weiContainer.classList.add('sleep-breathing');
        }

      } else {
        AppState.weiState = 'awake';
        if (awakeLayer) awakeLayer.classList.remove('hidden');
        if (sleepLayer) sleepLayer.classList.add('hidden');
        if (zzzParticles) zzzParticles.classList.add('hidden');

        if (weiContainer) {
          weiContainer.classList.add('sway-idle');
          weiContainer.classList.remove('sleep-breathing');
        }

      }

    }

  
