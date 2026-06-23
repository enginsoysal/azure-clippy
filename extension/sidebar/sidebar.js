const GITHUB_RAW = 'https://raw.githubusercontent.com/enginsoysal/azure-clippy/master';

// Workflow index embedded directly — no fetch needed for the list.
// Update this when workflows/index.json changes.
const WORKFLOW_INDEX = [
  { id: "compute/create-vm",                   title: "Create a Virtual Machine",       category: "Compute",      tags: ["vm","virtual machine","iaas","server","compute"] },
  { id: "compute/create-vmss",                 title: "Create a VM Scale Set",          category: "Compute",      tags: ["vmss","scale set","autoscale","compute"] },
  { id: "networking/create-vnet",              title: "Create a Virtual Network",        category: "Networking",   tags: ["vnet","virtual network","networking"] },
  { id: "networking/create-nsg",               title: "Create a Network Security Group", category: "Networking",   tags: ["nsg","firewall","security group","network","rules"] },
  { id: "networking/create-load-balancer",     title: "Create a Load Balancer",          category: "Networking",   tags: ["load balancer","lb","traffic","balancing"] },
  { id: "storage/create-storage-account",      title: "Create a Storage Account",        category: "Storage",      tags: ["storage","account","blob","files","queues","tables"] },
  { id: "storage/create-blob-container",       title: "Create a Blob Container",         category: "Storage",      tags: ["blob","container","storage","object storage"] },
  { id: "app-services/create-app-service",     title: "Create an App Service",           category: "App Services", tags: ["app service","web app","webapp","paas","website","api"] },
  { id: "app-services/create-app-service-plan",title: "Create an App Service Plan",      category: "App Services", tags: ["app service plan","hosting plan","paas","compute plan"] },
  { id: "containers/create-aks",               title: "Create an AKS Cluster",           category: "Containers",   tags: ["aks","kubernetes","k8s","cluster","containers"] },
  { id: "containers/create-container-instance",title: "Create a Container Instance",     category: "Containers",   tags: ["aci","container instance","docker","container"] },
  { id: "containers/create-container-registry",title: "Create a Container Registry",     category: "Containers",   tags: ["acr","container registry","docker","images","registry"] },
  { id: "identity/create-app-registration",    title: "Create an App Registration",      category: "Identity",     tags: ["app registration","aad","entra","oauth","service principal","client id"] },
  { id: "identity/assign-rbac",                title: "Assign an RBAC Role",             category: "Identity",     tags: ["rbac","role","role assignment","iam","access","permissions"] },
  { id: "databases/create-sql-database",       title: "Create a SQL Database",           category: "Databases",    tags: ["sql","database","azure sql","relational","db"] },
  { id: "databases/create-cosmos-db",          title: "Create a Cosmos DB",              category: "Databases",    tags: ["cosmos","cosmosdb","nosql","mongodb","database"] },
];

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

  try {
    const res = await fetch(`${GITHUB_RAW}/workflows/${wf.id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const workflow = await res.json();
    setStatus('');

    const needsNav = workflow.startUrl &&
      !tab.url.includes(workflow.startUrl.replace('https://portal.azure.com/', ''));

    if (needsNav) {
      await chrome.tabs.update(tab.id, { url: workflow.startUrl });
      setTimeout(() => chrome.tabs.sendMessage(tab.id, { type: 'START_WORKFLOW', workflow }), 2500);
    } else {
      chrome.tabs.sendMessage(tab.id, { type: 'START_WORKFLOW', workflow });
    }
  } catch (err) {
    setStatus(`Could not load workflow content. Check your internet connection.`, 'error');
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

// Render immediately from embedded index — no network needed
renderList(allWorkflows);
checkSuggestedWorkflow();

// Try to fetch a fresher index from GitHub in the background
fetch(`${GITHUB_RAW}/workflows/index.json`)
  .then(r => r.json())
  .then(data => {
    allWorkflows = data.workflows;
    renderList(filterWorkflows(searchEl.value.trim()));
  })
  .catch(() => {}); // silently ignore if offline
