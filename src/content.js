const intervalRateMs = 1000;

const cssClassName_Wrapper = `auto-closer-for-canva-wrapper`;
const cssClassName_MainPopOver = `auto-closer-for-canva-main-pop-over`;
const cssClassName_CountdownText = `auto-closer-for-canva-countdown-text`;
const cssClassName_CloseNowBtn = `auto-closer-for-canva-close-now-btn`;
const cssClassName_StopLink = `auto-closer-for-canva-stop-link`;

const cssClassName_SettingsMenu = `auto-closer-for-canva-settings-menu`;
const cssClassName_SettingsOption = `auto-closer-for-canva-settings-option`;

function log(text) {
  console.log(`ACFC: ${text}`);
}

log('loaded...');

let timeTillCloseMs = 5 * 1000;

function getWrapperEl() {
  return document.documentElement.querySelector(`.${cssClassName_Wrapper}`);
}

function countdownWithText(countdownTimeMs) {
  if (false) {//Used for freezing the countdown to debugging styling
    countdownTimeMs = timeTillCloseMs;
    clearInterval(intervalId);
  }

  let wrapperEl = getWrapperEl();

  if (!wrapperEl) { // Lazy init the element
    wrapperEl = document.createElement('div');
    wrapperEl.classList.add(cssClassName_Wrapper);
    wrapperEl.innerHTML = `
    <div class='${cssClassName_MainPopOver}'>
      <div class='${cssClassName_CountdownText}'></div>
      <a class='${cssClassName_StopLink}'>cancel</a>
      <a class='${cssClassName_CloseNowBtn}'>close now</a>
    </div>
    `;
    document.body.appendChild(wrapperEl);

    wrapperEl.querySelector(`.${cssClassName_CloseNowBtn}`).onclick = () => {
      log('Closing tab now');
      closeThisTabNow();
    };

    wrapperEl.querySelector(`.${cssClassName_StopLink}`).onclick = () => {
      log('Canceled the countdown');
      clearInterval(intervalId);
      wrapperEl.remove();
    };
  }

  const countdownEl = wrapperEl.querySelector(`.${cssClassName_CountdownText}`);
  countdownEl.innerText = `Closing page in ${Math.round(countdownTimeMs / 1000)} seconds`;
}

function getUrl() {
  return new URL(window.location.href);
}

function isPageTextLikeDesktopAppOpened() {
  const pageText = document?.body?.innerText?.toLowerCase() || '';
  if (pageText.includes('opening in the desktop app')) {
    return true;
  }
  return false;
}

function countDownToClose() {
  timeTillCloseMs -= intervalRateMs;
  log(`TimeMs left: ${timeTillCloseMs} isDesktopAppOpened=${isPageTextLikeDesktopAppOpened()}`);

  if (isPageTextLikeDesktopAppOpened()) {
    log(`All checks good to auto close`);
  } else {
    timeTillCloseMs += intervalRateMs; // Put back the time
    return;
  }

  countdownWithText(timeTillCloseMs);

  if (timeTillCloseMs > 0) { return; }

  clearInterval(intervalId);

  closeThisTabNow();
}

function closeThisTabNow() {
  chrome.runtime.sendMessage({ pleaseCloseThisTab: true });
}

let intervalId = setInterval(countDownToClose, intervalRateMs);
