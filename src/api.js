import md5 from "md5";
import axios from "axios";

export const translateBaidu = function(q) {
  const appid = process.env.BAIDU_APPID;
  const key = process.env.BAIDU_KEY;
  const from = "auto";
  const to = "zh";
  const salt = getSalt();
  const sign = md5(appid + q + salt + key);
  const payload = {
    from,
    to,
    q: q,
    appid,
    salt,
    sign
  };
  const param = Object.entries(payload)
    .map(([k, v]) => k + "=" + v)
    .join("&");
  const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?${param}`;

  return axios({
    url: url,
    method: "GET"
  });
};

export const translateSougou = function(q) {
  const pid = process.env.SOUGOU_PID;
  const key = process.env.SOUGOU_KEY;
  const from = "auto";
  const to = "zh-CHS";
  let salt = getSalt();
  let sign = md5(pid + q + salt + key);
  const payload = {
    from,
    to,
    pid,
    q: q,
    sign,
    salt
  };
  const data = Object.entries(payload)
    .map(([k, v]) => k + "=" + v)
    .join("&");
  const url = "http://fanyi.sogou.com/reventondc/api/sogouTranslate";
  return axios({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    data: data
  });
};

function getSalt() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}
