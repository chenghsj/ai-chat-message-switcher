import {
  Position,
  initialOpacity,
  initialSize,
  parsedInitialControlPanelPosition,
} from './types';

type StoredData = {
  draggable?: boolean;
  draggedPosition?: Position;
  offset?: { x: number; y: number };
  size?: { width: number; height: number };
  pinned?: boolean;
  opacity?: number;
};

// Function to request tab ID from the background script
function getCurrentTabId(): Promise<number> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'getTabId' }, (response) => {
      if (response && response.tabId) {
        resolve(response.tabId);
      } else {
        reject(new Error('Failed to retrieve tab ID'));
      }
    });
  });
}

// Function to get storage data for the current tab
export function getStorageData(): Promise<StoredData> {
  return new Promise((resolve, reject) => {
    getCurrentTabId()
      .then((tabId) => {
        chrome.storage.local.get(`${tabId}`, (data) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(data[tabId] || {});
          }
        });
      })
      .catch(reject);
  });
}

// Function to set storage data for the current tab
export function setStorageData(
  callback: (currentData: StoredData) => StoredData
): Promise<void> {
  return new Promise((resolve, reject) => {
    getCurrentTabId()
      .then((tabId) => {
        getStorageData()
          .then((currentData) => {
            const newData = callback(currentData);
            chrome.storage.local.set({ [tabId]: newData }, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve();
              }
            });
          })
          .catch(reject);
      })
      .catch(reject);
  });
}

// Function to reset storage data for the current tab
export function resetStorageData(): Promise<void> {
  return new Promise((resolve, reject) => {
    getCurrentTabId()
      .then((tabId) => {
        const defaultData: StoredData = {
          draggable: true,
          draggedPosition: parsedInitialControlPanelPosition,
          size: initialSize,
          pinned: false,
          opacity: initialOpacity,
        };
        chrome.storage.local.set({ [tabId]: defaultData }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      })
      .catch(reject);
  });
}

// Function to clear storage data for the current tab
export function clearStorageData(): Promise<void> {
  return new Promise((resolve, reject) => {
    getCurrentTabId()
      .then((tabId) => {
        chrome.storage.local.remove(`${tabId}`, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      })
      .catch(reject);
  });
}
