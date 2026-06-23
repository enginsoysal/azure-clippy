let allWorkflows = [];
let index = null;

const searchEl      = document.getElementById('search');
const categoryListEl = document.getElementById('category-list');
const suggestedEl   = document.getElementById('suggested');
const suggestedList = document.getElementById('suggested-list');
const statusEl      = document.getElementById('status');

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
    for (const wf of items) {
      group.appendChild(renderWorkflowCard(wf));
    }
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
  setStatus(`Workflow laden: ${wf.title}...`, 'loading');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('portal.azure.com')) {
    setStatus('Open portal.azure.com om een workflow te starten.', 'error');
    return;
  }

  chrome.runtime.sendMessage({ type: 'FETCH_WORKFLOW', id: wf.id }, (res) => {
    if (!res?.ok) {
      setStatus(`Fout bij laden workflow: ${res?.error || 'onbekend'}`, 'error');
      return;
    }
    setStatus('');
    const workflow = res.data;
    if (workflow.startUrl && !tab.url.includes(workflow.startUrl.replace('https://portal.azure.com/', ''))) {
      chrome.tabs.update(tab.id, { url: workflow.startUrl }, () => {
        setTimeout(() => sendStartMessage(tab.id, workflow), 2000);
      });
    } else {
      sendStartMessage(tab.id, workflow);
    }
  });
}

function sendStartMessage(tabId, workflow) {
  chrome.tabs.sendMessage(tabId, { type: 'START_WORKFLOW', workflow });
}

async function loadIndex() {
  setStatus('Workflows laden...', 'loading');
  chrome.runtime.sendMessage({ type: 'FETCH_INDEX' }, (res) => {
    if (!res?.ok) {
      setStatus('Kan workflows niet laden. Controleer je internetverbinding.', 'error');
      return;
    }
    index = res.data;
    allWorkflows = index.workflows;
    setStatus('');
    renderList(allWorkflows);
    checkSuggestedWorkflow();
  });
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

loadIndex();
