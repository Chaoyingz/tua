// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == "get") {
    fetch(request.url)
      .then(response => response.text())
      .then(text => sendResponse(text))
      .catch(error => {
        console.log(error);
      });
    return true;
  }
  if (request.type == "post") {
    fetch(request.url, {
      method: "POST",
      body: JSON.stringify(request.data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.text())
      .then(text => sendResponse(text))
      .catch(error => {
        console.log(error);
      });
    return true;
  }
});
