import { translateBaidu, translateSougou } from "@/api";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const { type } = request;
  switch (type) {
    case "translate-baidu": {
      translateBaidu(request.q).then(async res => {
        sendResponse(res);
      });
      return true;
    }
    case "translate-sougou": {
      translateSougou(request.q).then(async res => {
        await sleep(50);
        sendResponse(res);
      });
      return true;
    }
  }
});
