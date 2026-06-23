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

let activeDriver = null;

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

  chrome.runtime.sendMessage({ type: 'WORKFLOW_STARTED', title: workflow.title });

  const steps = [];
  for (const step of workflow.steps) {
    const el = await waitForElement([step.selector, step.fallbackSelector].filter(Boolean));
    if (!el) {
      console.warn(`[Azure Clippy] Selector not found for step: ${step.title}`);
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
    onDestroyStarted: () => {
      activeDriver = null;
      chrome.runtime.sendMessage({ type: 'WORKFLOW_DONE', title: workflow.title });
    },
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
  if (msg.type === 'WORKFLOW_STARTED') {
    if (window.__clippyShowWorkflowStart) window.__clippyShowWorkflowStart(msg.title);
  }
  if (msg.type === 'WORKFLOW_DONE') {
    if (window.__clippyShowWorkflowDone) window.__clippyShowWorkflowDone(msg.title);
  }
});
