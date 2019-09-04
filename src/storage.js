/* eslint-disable no-undef */
class Storage {
  async set(key, value) {
    return new Promise(resolve => {
      chrome.storage.local.set({ [key]: value }, async () => {
        resolve();
      });
    });
  }

  async get(key) {
    return new Promise(resolve => {
      chrome.storage.local.get(key, result => {
        resolve(result[key]);
      });
    });
  }
}

export default new Storage();
