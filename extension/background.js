const GITHUB_RAW = 'https://raw.githubusercontent.com/enginsoysal/azure-clippy/main';

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'FETCH_INDEX') {
    fetch(`${GITHUB_RAW}/workflows/index.json`)
      .then(r => r.json())
      .then(data => sendResponse({ ok: true, data }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (msg.type === 'FETCH_WORKFLOW') {
    fetch(`${GITHUB_RAW}/workflows/${msg.id}.json`)
      .then(r => r.json())
      .then(data => sendResponse({ ok: true, data }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }
});
