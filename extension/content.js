const URL_WORKFLOW_MAP = {
  '#create/Microsoft.VirtualMachine':                           'compute/create-vm',
  '#create/Microsoft.VirtualNetwork':                           'networking/create-vnet',
  '#create/Microsoft.Network/networkSecurityGroups':            'networking/create-nsg',
  '#create/Microsoft.Storage/storageAccounts':                  'storage/create-storage-account',
  '#create/Microsoft.Web/WebApps':                              'app-services/create-app-service',
  '#create/Microsoft.ContainerService/ManagedClusters':         'containers/create-aks',
  '#create/Microsoft.ContainerInstance/containerGroups':        'containers/create-container-instance',
};

let activeDriver = null;

function detectCurrentWorkflow() {
  const hash = window.location.hash;
  for (const [pattern, workflowId] of Object.entries(URL_WORKFLOW_MAP)) {
    if (hash.includes(pattern)) return workflowId;
  }
  return null;
}

async function waitForElement(selectors, timeoutMs = 10000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    await new Promise(r => setTimeout(r, 300));
  }
  return null;
}

async function runWorkflow(workflow) {
  if (activeDriver) {
    activeDriver.destroy();
    activeDriver = null;
  }

  const steps = [];
  for (const step of workflow.steps) {
    const el = await waitForElement([step.selector, step.fallbackSelector].filter(Boolean));
    if (!el) {
      console.warn(`[Azure Clippy] Selector niet gevonden voor stap: ${step.title}`);
      continue;
    }
    steps.push({
      element: step.selector,
      popover: {
        title: step.title,
        description: step.explanation,
        side: 'bottom',
        align: 'start',
      },
    });
  }

  activeDriver = window.driver.js.driver({
    showProgress: true,
    steps,
    onDestroyStarted: () => { activeDriver = null; },
  });

  activeDriver.drive();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'START_WORKFLOW') {
    runWorkflow(msg.workflow);
  }
  if (msg.type === 'STOP_WORKFLOW') {
    if (activeDriver) { activeDriver.destroy(); activeDriver = null; }
  }
  if (msg.type === 'GET_SUGGESTED_WORKFLOW') {
    const suggested = detectCurrentWorkflow();
    chrome.runtime.sendMessage({ type: 'SUGGESTED_WORKFLOW', workflowId: suggested });
  }
});
