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
        const el = document.querySelector(sel);
        if (el) return el;
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
    // Highlight ring
    this.ring = document.createElement('div');
    this.ring.className = 'clippy-highlight-ring';
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

    // Position center-screen while we find the element
    this._positionCenter();

    // Now find and highlight the element
    const selectors = [step.selector, step.fallbackSelector].filter(Boolean);
    const el = await waitForElement(selectors, 8000);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(r => setTimeout(r, 300));
      this._highlightElement(el);
      this._position(el);
    } else {
      this._clearHighlight();
    }
  }

  _highlightElement(el) {
    const rect = el.getBoundingClientRect();
    const pad  = 4;
    Object.assign(this.ring.style, {
      display: 'block',
      top:    `${rect.top    - pad}px`,
      left:   `${rect.left   - pad}px`,
      width:  `${rect.width  + pad * 2}px`,
      height: `${rect.height + pad * 2}px`,
    });
    this._highlightedEl = el;
  }

  _clearHighlight() {
    this.ring.style.display = 'none';
    this._highlightedEl = null;
  }

  _positionCenter() {
    this.balloon.style.top       = '50%';
    this.balloon.style.left      = '50%';
    this.balloon.style.transform = 'translate(-50%, -50%)';
    this.balloon.className       = '';
  }

  _position(el) {
    const el2 = el || this._highlightedEl;
    if (!el2) {
      this._positionCenter();
      return;
    }

    this.balloon.style.transform = '';
    const rect   = el2.getBoundingClientRect();
    const bw     = this.balloon.offsetWidth  || 300;
    const bh     = this.balloon.offsetHeight || 180;
    const vw     = window.innerWidth;
    const vh     = window.innerHeight;
    const margin = 16;
    const pad    = 4;

    let top, left, arrowClass = 'arrow-top';

    // Prefer below the element
    if (rect.bottom + bh + margin < vh) {
      top       = rect.bottom + pad + margin;
      arrowClass = 'arrow-top';
    } else if (rect.top - bh - margin > 0) {
      top       = rect.top - bh - pad - margin;
      arrowClass = 'arrow-bottom';
    } else {
      top = Math.max(margin, Math.min(vh - bh - margin, rect.top));
      arrowClass = rect.left + rect.width / 2 > vw / 2 ? 'arrow-right' : 'arrow-left';
    }

    left = Math.max(margin, Math.min(vw - bw - margin, rect.left));

    this.balloon.style.top  = `${top}px`;
    this.balloon.style.left = `${left}px`;
    this.balloon.className  = arrowClass;

    // Update ring position too
    if (this._highlightedEl) this._highlightElement(this._highlightedEl);
  }

  start() {
    this.go(0);
    chrome.runtime.sendMessage({ type: 'WORKFLOW_STARTED', title: this.workflow.title });
  }

  finish() {
    chrome.runtime.sendMessage({ type: 'WORKFLOW_DONE', title: this.workflow.title });
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
