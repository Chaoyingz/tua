/* eslint-disable no-undef */
class Message {
  async send(request) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(request, response => {
        if (response.status == 200) {
          resolve(response);
        } else {
          reject();
        }
      });
    });
  }
}

export default new Message();
