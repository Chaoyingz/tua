/* eslint-disable no-undef */
import { translateBaidu, translateSougou } from "@/api";
import { KEY_STATUS_TUA } from "@/lib/constant";
import Storage from "@/lib/storage";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onInstalled.addListener(async reason => {
  if (reason !== "update") {
    Storage.set(KEY_STATUS_TUA, true);
  }
});

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
