// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.type);
  if (request.type == "fetch") {
    fetch(request.url)
      .then(response => response.text())
      .then(text => sendResponse(text))
      .catch(error => {
        console.log(error);
      });
    return true;
  }
});
