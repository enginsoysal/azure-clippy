const CLIPPY_SPRITE_URL = chrome.runtime.getURL('images/clippy-sprite.png');

const IDLE_MESSAGES = [
  "It looks like you're trying to do something in Azure. Can I help?",
  "Need a guide? Click me to see available workflows!",
  "I know every corner of Azure Portal. Just ask!",
  "Pro tip: use the search bar above to find any Azure service.",
  "Did you know? You can pin your favourite services to the left sidebar.",
];

let clippyEl = null;
let bubbleTimeout = null;
let currentWorkflowRunning = false;

function createClippy() {
  if (document.getElementById('azure-clippy-character')) return;

  clippyEl = document.createElement('div');
  clippyEl.id = 'azure-clippy-character';

  const bubble = document.createElement('div');
  bubble.id = 'azure-clippy-bubble';
  bubble.className = 'clippy-bubble hidden';

  const sprite = document.createElement('div');
  sprite.id = 'azure-clippy-sprite';
  const img = document.createElement('img');
  img.src = CLIPPY_SPRITE_URL;
  img.alt = 'Clippy';
  img.draggable = false;
  sprite.appendChild(img);

  clippyEl.appendChild(bubble);
  clippyEl.appendChild(sprite);

  const style = document.createElement('style');
  style.textContent = `
    #azure-clippy-character {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      user-select: none;
    }
    #azure-clippy-sprite {
      width: 64px;
      height: 64px;
      cursor: pointer;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
      transition: transform 0.15s ease;
    }
    #azure-clippy-sprite:hover { transform: scale(1.1); }
    #azure-clippy-sprite img {
      width: 64px;
      height: 64px;
      image-rendering: pixelated;
    }
    .clippy-bubble {
      background: #fff;
      border: 2px solid #0078d4;
      border-radius: 12px 12px 2px 12px;
      padding: 10px 14px;
      max-width: 240px;
      font-size: 12px;
      line-height: 1.5;
      color: #1a1a1a;
      box-shadow: 0 4px 16px rgba(0,120,212,0.2);
      animation: clippy-pop 0.2s ease;
    }
    .clippy-bubble.hidden { display: none; }
    .clippy-bubble-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .clippy-btn {
      padding: 4px 10px;
      border-radius: 4px;
      border: 1px solid #0078d4;
      background: #0078d4;
      color: #fff;
      font-size: 11px;
      cursor: pointer;
      font-family: inherit;
    }
    .clippy-btn.secondary {
      background: transparent;
      color: #0078d4;
    }
    @keyframes clippy-pop {
      from { opacity: 0; transform: scale(0.8) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(clippyEl);

  sprite.addEventListener('click', onClippyClick);

  setTimeout(() => showIdleBubble(), 3000);
}

function makeBubbleContent(text, buttons) {
  const bubble = document.getElementById('azure-clippy-bubble');
  if (!bubble) return;
  bubble.innerHTML = '';

  const msg = document.createElement('div');
  msg.innerHTML = text;
  bubble.appendChild(msg);

  if (buttons && buttons.length) {
    const actions = document.createElement('div');
    actions.className = 'clippy-bubble-actions';
    for (const { label, secondary, onClick } of buttons) {
      const btn = document.createElement('button');
      btn.className = 'clippy-btn' + (secondary ? ' secondary' : '');
      btn.textContent = label;
      btn.addEventListener('click', onClick);
      actions.appendChild(btn);
    }
    bubble.appendChild(actions);
  }

  bubble.classList.remove('hidden');
  clearTimeout(bubbleTimeout);
}

function hideBubble() {
  const bubble = document.getElementById('azure-clippy-bubble');
  if (bubble) bubble.classList.add('hidden');
}

function showIdleBubble() {
  if (currentWorkflowRunning) return;
  const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
  makeBubbleContent(msg, [
    { label: 'Show workflows', onClick: () => { chrome.runtime.sendMessage({ type: 'OPEN_SIDEBAR' }); hideBubble(); } },
    { label: 'Dismiss', secondary: true, onClick: hideBubble },
  ]);
  bubbleTimeout = setTimeout(hideBubble, 8000);
}

function onClippyClick() {
  const bubble = document.getElementById('azure-clippy-bubble');
  if (bubble && !bubble.classList.contains('hidden')) {
    hideBubble();
    return;
  }
  makeBubbleContent('<strong>Hi, I\'m Clippy!</strong><br>I can guide you through any Azure task step by step.', [
    { label: 'Open workflows', onClick: () => { chrome.runtime.sendMessage({ type: 'OPEN_SIDEBAR' }); hideBubble(); } },
    { label: 'Hide me', secondary: true, onClick: () => { hideBubble(); if (clippyEl) clippyEl.style.display = 'none'; } },
  ]);
}

window.__clippyHide = function () {
  hideBubble();
  if (clippyEl) clippyEl.style.display = 'none';
};

window.__clippyOpenSidebar = function () {
  chrome.runtime.sendMessage({ type: 'OPEN_SIDEBAR' });
  hideBubble();
};

window.__clippyShowWorkflowStart = function (title) {
  currentWorkflowRunning = true;
  makeBubbleContent(`Starting: <strong>${title}</strong><br>Follow the highlighted steps!`, null);
  bubbleTimeout = setTimeout(hideBubble, 5000);
};

window.__clippyShowWorkflowDone = function (title) {
  currentWorkflowRunning = false;
  makeBubbleContent(`✅ Done! <strong>${title}</strong> completed.<br>Need anything else?`, null);
  bubbleTimeout = setTimeout(hideBubble, 6000);
};

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'WORKFLOW_STARTED') window.__clippyShowWorkflowStart(msg.title);
  if (msg.type === 'WORKFLOW_DONE')    window.__clippyShowWorkflowDone(msg.title);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createClippy);
} else {
  createClippy();
}
