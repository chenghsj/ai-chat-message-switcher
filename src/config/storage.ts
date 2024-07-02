import { Position } from './types';

// Define the type for the storage object
type StorageData = {
  'chatgpt-message-switcher': {
    draggable?: boolean;
    draggedPosition?: Position;
    size?: { width: number; height: number };
    pinned?: boolean;
  };
};

const DEFAULT_KEY: keyof StorageData = 'chatgpt-message-switcher';

// Function to get storage data in a type-safe manner using the default key
export function getStorageData(): Promise<StorageData[typeof DEFAULT_KEY]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(DEFAULT_KEY, (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(data[DEFAULT_KEY] as StorageData[typeof DEFAULT_KEY]);
      }
    });
  });
}

// Function to set storage data in a type-safe manner using a callback
export function setStorageData(
  callback: (
    currentData: StorageData[typeof DEFAULT_KEY]
  ) => StorageData[typeof DEFAULT_KEY]
): Promise<void> {
  return new Promise((resolve, reject) => {
    getStorageData()
      .then((currentData) => {
        const newData = callback(currentData);
        chrome.storage.sync.set({ [DEFAULT_KEY]: newData }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Function to clear a specific item from storage in a type-safe manner using the default key
export function clearStorageData(): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.remove(DEFAULT_KEY, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

// Example usage of the getStorageData function
// getStorageData()
//   .then((settings) => {
//     const isDraggable: boolean = settings.draggable ?? true;
//     setIsDraggable(isDraggable);
//     handleSize(settings.size ?? { width: 0, height: 0 });
//   })
//   .catch((error) => {
//     console.error('Error getting storage data:', error);
//   });

// Example usage of the setStorageData function with a callback
// setStorageData((currentData) => {
//   return {
//     ...currentData,
//     draggable: !currentData.draggable,
//     size: !currentData.size
//       ? {
//           width: 400,
//           height: 400,
//         }
//       : {
//           width: currentData.size.width + 100,
//           height: currentData.size.height + 100,
//         },
//   };
// })
//   .then(() => {
//     console.log('Storage data set successfully.');
//   })
//   .catch((error) => {
//     console.error('Error setting storage data:', error);
//   });