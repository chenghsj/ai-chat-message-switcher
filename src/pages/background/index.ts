// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTabId' && sender.tab) {
    sendResponse({ tabId: sender.tab.id });
  }
});

// Listen for tab closure and remove associated data
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`${tabId}`);
});
