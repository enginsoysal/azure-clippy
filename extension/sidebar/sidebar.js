const GITHUB_RAW = 'https://raw.githubusercontent.com/enginsoysal/azure-clippy/master';

let allWorkflows = [];

const searchEl       = document.getElementById('search');
const categoryListEl = document.getElementById('category-list');
const suggestedEl    = document.getElementById('suggested');
const suggestedList  = document.getElementById('suggested-list');
const statusEl       = document.getElementById('status');

function setStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = `status ${type}`;
}

function groupByCategory(workflows) {
  const groups = {};
  for (const wf of workflows) {
    if (!groups[wf.category]) groups[wf.category] = [];
    groups[wf.category].push(wf);
  }
  return groups;
}

function renderWorkflowCard(wf, isSuggested = false) {
  const card = document.createElement('div');
  card.className = `workflow-card${isSuggested ? ' suggested' : ''}`;
  card.innerHTML = `
    <span class="workflow-title">${wf.title}</span>
    <span class="workflow-start">▶ Start</span>
  `;
  card.addEventListener('click', () => startWorkflow(wf));
  return card;
}

function renderList(workflows) {
  categoryListEl.innerHTML = '';
  const groups = groupByCategory(workflows);
  for (const [category, items] of Object.entries(groups)) {
    const group = document.createElement('div');
    group.className = 'category-group';
    const catName = document.createElement('div');
    catName.className = 'category-name';
    catName.textContent = category;
    group.appendChild(catName);
    for (const wf of items) group.appendChild(renderWorkflowCard(wf));
    categoryListEl.appendChild(group);
  }
}

function filterWorkflows(query) {
  if (!query) return allWorkflows;
  const q = query.toLowerCase();
  return allWorkflows.filter(wf =>
    wf.title.toLowerCase().includes(q) ||
    (wf.tags || []).some(t => t.toLowerCase().includes(q))
  );
}

searchEl.addEventListener('input', () => {
  renderList(filterWorkflows(searchEl.value.trim()));
});

async function startWorkflow(wf) {
  setStatus(`Loading: ${wf.title}...`, 'loading');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('portal.azure.com')) {
    setStatus('Open portal.azure.com to start a workflow.', 'error');
    return;
  }

  // Try GitHub first, no fallback needed for individual workflows
  try {
    const res = await fetch(`${GITHUB_RAW}/workflows/${wf.id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const workflow = await res.json();
    setStatus('');

    const navigate = workflow.startUrl &&
      !tab.url.includes(workflow.startUrl.replace('https://portal.azure.com/', ''));

    if (navigate) {
      await chrome.tabs.update(tab.id, { url: workflow.startUrl });
      setTimeout(() => chrome.tabs.sendMessage(tab.id, { type: 'START_WORKFLOW', workflow }), 2500);
    } else {
      chrome.tabs.sendMessage(tab.id, { type: 'START_WORKFLOW', workflow });
    }
  } catch (err) {
    setStatus(`Could not load workflow: ${err.message}`, 'error');
  }
}

function checkSuggestedWorkflow() {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.url?.includes('portal.azure.com')) return;
    chrome.tabs.sendMessage(tab.id, { type: 'GET_SUGGESTED_WORKFLOW' });
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SUGGESTED_WORKFLOW' && msg.workflowId) {
    const wf = allWorkflows.find(w => w.id === msg.workflowId);
    if (wf) {
      suggestedList.innerHTML = '';
      suggestedList.appendChild(renderWorkflowCard(wf, true));
      suggestedEl.style.display = 'block';
    }
  }
});

async function loadIndex() {
  setStatus('Loading workflows...', 'loading');

  // Try GitHub first
  try {
    const res = await fetch(`${GITHUB_RAW}/workflows/index.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allWorkflows = data.workflows;
    setStatus('');
    renderList(allWorkflows);
    checkSuggestedWorkflow();
    return;
  } catch (_) {
    // GitHub unreachable — fall back to bundled index
  }

  // Fallback: bundled index.json shipped with the extension
  try {
    const res = await fetch(chrome.runtime.getURL('workflows-index.json'));
    const data = await res.json();
    allWorkflows = data.workflows;
    setStatus('Offline mode — workflow list may be outdated.');
    renderList(allWorkflows);
    checkSuggestedWorkflow();
  } catch (err) {
    setStatus('Could not load workflows.', 'error');
  }
}

loadIndex();
