const URL_WORKFLOW_MAP = {
  '#create/Microsoft.VirtualMachine':                           'compute/create-vm',
  '#create/Microsoft.VMSSWizard':                               'compute/create-vmss',
  '#create/Microsoft.VirtualNetwork':                           'networking/create-vnet',
  '#create/Microsoft.Network/networkSecurityGroups':            'networking/create-nsg',
  '#create/Microsoft.LoadBalancer-ARM':                         'networking/create-load-balancer',
  '#create/Microsoft.StorageAccount-ARM':                       'storage/create-storage-account',
  '#create/Microsoft.Web/WebApps':                              'app-services/create-app-service',
  '#create/Microsoft.AppServicePlanCreate':                     'app-services/create-app-service-plan',
  '#create/Microsoft.ContainerService/ManagedClusters':         'containers/create-aks',
  '#create/Microsoft.ContainerInstancesWizard':                 'containers/create-container-instance',
  '#create/Microsoft.ContainerRegistry':                        'containers/create-container-registry',
  '#create/Microsoft.SQLDatabase':                              'databases/create-sql-database',
  '#create/Microsoft.DocumentDB':                               'databases/create-cosmos-db',
  'Microsoft_AAD_RegisteredApps/CreateApplicationBlade':        'identity/create-app-registration',
};

let tour = null;

// ─── Tour engine ──────────────────────────────────────────────────────────────

function detectCurrentWorkflow() {
  const url = window.location.href;
  for (const [pattern, workflowId] of Object.entries(URL_WORKFLOW_MAP)) {
    if (url.includes(pattern)) return workflowId;
  }
  return null;
}

async function waitForElement(selectors, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const sel of selectors) {
      try {
        const candidates = document.querySelectorAll(sel);
        for (const el of candidates) {
          const tag  = el.tagName.toLowerCase();
          const rect = el.getBoundingClientRect();
          // Skip invisible elements
          if (rect.width === 0 || rect.height === 0) continue;
          // Skip tiny icon/info buttons (smaller than 24x24)
          if (rect.width < 24 && rect.height < 24) continue;
          // Skip pure icon tags
          if (tag === 'i' || tag === 'svg' || tag === 'img') continue;
          return el;
        }
      } catch (_) {}
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return null;
}

class ClippyTour {
  constructor(workflow) {
    this.workflow  = workflow;
    this.steps     = workflow.steps || [];
    this.index     = 0;
    this.ring      = null;
    this.balloon   = null;
    this.resizeObs = null;

    this._injectCSS();
    this._buildDOM();
  }

  _injectCSS() {
    if (document.getElementById('clippy-tour-css')) return;
    const link = document.createElement('link');
    link.id   = 'clippy-tour-css';
    link.rel  = 'stylesheet';
    link.href = chrome.runtime.getURL('clippy-tour.css');
    document.head.appendChild(link);
  }

  _buildDOM() {
    // Arrow pointer
    this.ring = document.createElement('div');
    this.ring.className = 'clippy-highlight-arrow';
    document.body.appendChild(this.ring);

    // Balloon
    this.balloon = document.createElement('div');
    this.balloon.id = 'clippy-tour-balloon';
    this.balloon.innerHTML = `
      <div id="clippy-tour-header">
        <span id="clippy-tour-step-badge"></span>
        <span id="clippy-tour-title"></span>
      </div>
      <div id="clippy-tour-progress"><div id="clippy-tour-progress-fill"></div></div>
      <div id="clippy-tour-body"></div>
      <div id="clippy-tour-footer">
        <button class="clippy-tour-btn ghost" id="clippy-tour-stop">✕ Stop</button>
        <div id="clippy-tour-footer-spacer"></div>
        <button class="clippy-tour-btn secondary" id="clippy-tour-prev">← Prev</button>
        <button class="clippy-tour-btn primary"   id="clippy-tour-next">Next →</button>
      </div>
    `;
    document.body.appendChild(this.balloon);

    this.balloon.querySelector('#clippy-tour-stop').addEventListener('click', () => this.destroy());
    this.balloon.querySelector('#clippy-tour-prev').addEventListener('click', () => this.go(this.index - 1));
    this.balloon.querySelector('#clippy-tour-next').addEventListener('click', () => this.go(this.index + 1));

    // Reposition on scroll/resize
    const reposition = () => this._position();
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition, { passive: true });
    this._scrollListener = reposition;
  }

  async go(idx) {
    if (idx < 0 || idx >= this.steps.length) {
      if (idx >= this.steps.length) this.finish();
      return;
    }
    this.index = idx;
    const step = this.steps[idx];

    // Show content immediately — don't wait for element first
    this.balloon.querySelector('#clippy-tour-step-badge').textContent =
      `${idx + 1} / ${this.steps.length}`;
    this.balloon.querySelector('#clippy-tour-title').textContent = step.title;
    this.balloon.querySelector('#clippy-tour-body').textContent  = step.explanation;
    this.balloon.querySelector('#clippy-tour-progress-fill').style.width =
      `${((idx + 1) / this.steps.length) * 100}%`;

    const nextBtn = this.balloon.querySelector('#clippy-tour-next');
    const prevBtn = this.balloon.querySelector('#clippy-tour-prev');
    nextBtn.textContent = idx === this.steps.length - 1 ? 'Finish ✓' : 'Next →';
    prevBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';

    // Anchor balloon immediately — fixed position, never blocks form
    this._positionFixed();

    // Find and highlight the element
    const selectors = [step.selector, step.fallbackSelector].filter(Boolean);
    const el = await waitForElement(selectors, 8000);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(r => setTimeout(r, 300));
      this._highlightElement(el);
    } else {
      this._clearHighlight();
    }
  }

  _highlightElement(el) {
    const rect  = el.getBoundingClientRect();
    const arrowW = 46; // shaft (32) + head (14)
    // Arrow points RIGHT → sits just to the left of the element, vertically centered
    Object.assign(this.ring.style, {
      display: 'flex',
      top:    `${rect.top + rect.height / 2 - 9}px`,
      left:   `${rect.left - arrowW - 6}px`,
    });
    this._highlightedEl = el;
  }

  _clearHighlight() {
    this.ring.style.display = 'none';
    this._highlightedEl = null;
  }

  _positionFixed() {
    // Always anchor balloon at bottom-right, above Clippy — never blocks the form
    this.balloon.style.top       = '';
    this.balloon.style.left      = '';
    this.balloon.style.bottom    = '160px';
    this.balloon.style.right     = '24px';
    this.balloon.style.transform = '';
    this.balloon.className       = 'arrow-bottom';
  }

  _position() {
    this._positionFixed();
    if (this._highlightedEl) this._highlightElement(this._highlightedEl);
  }

  start() {
    this.go(0);
    if (window.__clippyShowWorkflowStart) window.__clippyShowWorkflowStart();
  }

  finish() {
    if (window.__clippyShowWorkflowDone) window.__clippyShowWorkflowDone(this.workflow.title);
    this.destroy();
  }

  destroy() {
    if (this.ring)   this.ring.remove();
    if (this.balloon) this.balloon.remove();
    window.removeEventListener('scroll', this._scrollListener);
    window.removeEventListener('resize', this._scrollListener);
    tour = null;
  }
}

async function runWorkflow(workflow) {
  if (tour) { tour.destroy(); }
  tour = new ClippyTour(workflow);
  tour.start();
}

// ─── Message listener ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'START_WORKFLOW') {
    runWorkflow(msg.workflow);
  }
  if (msg.type === 'STOP_WORKFLOW') {
    if (tour) { tour.destroy(); }
  }
  if (msg.type === 'GET_SUGGESTED_WORKFLOW') {
    const suggested = detectCurrentWorkflow();
    chrome.runtime.sendMessage({ type: 'SUGGESTED_WORKFLOW', workflowId: suggested });
  }
  if (msg.type === 'WORKFLOW_STARTED') {
    if (window.__clippyShowWorkflowStart) window.__clippyShowWorkflowStart(msg.title);
  }
  if (msg.type === 'WORKFLOW_DONE') {
    if (window.__clippyShowWorkflowDone) window.__clippyShowWorkflowDone(msg.title);
  }
});
