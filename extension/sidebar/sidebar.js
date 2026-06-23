// WORKFLOW_INDEX and WORKFLOWS_DATA are loaded from workflows-data.js

const WORKFLOW_INDEX = Object.values(WORKFLOWS_DATA).map(wf => ({
  id: wf.id,
  title: wf.title,
  category: wf.category || 'Other',
  tags: wf.tags || [],
}));

let allWorkflows = [...WORKFLOW_INDEX];

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

  const title = document.createElement('span');
  title.className = 'workflow-title';
  title.textContent = wf.title;

  const btn = document.createElement('span');
  btn.className = 'workflow-start';
  btn.textContent = '▶ Start';

  card.appendChild(title);
  card.appendChild(btn);
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
  // Load from bundled data — no network needed
  const workflow = WORKFLOWS_DATA[wf.id];
  if (!workflow) {
    setStatus(`Workflow not found: ${wf.id}`, 'error');
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.includes('portal.azure.com')) {
    setStatus('Open portal.azure.com to start a workflow.', 'error');
    return;
  }

  setStatus('');

  const needsNav = workflow.startUrl &&
    !tab.url.includes(workflow.startUrl.replace('https://portal.azure.com/', ''));

  if (needsNav) {
    await chrome.tabs.update(tab.id, { url: workflow.startUrl });
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { type: 'START_WORKFLOW', workflow });
    }, 3000);
  } else {
    chrome.tabs.sendMessage(tab.id, { type: 'START_WORKFLOW', workflow });
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

renderList(allWorkflows);
checkSuggestedWorkflow();
