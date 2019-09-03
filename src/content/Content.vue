<template>
  <transition name="bounce">
    <div class="content" :style="pos" v-show="!isHide">
      {{ result }}
    </div>
  </transition>
</template>

<script>
import md5 from "md5";
export default {
  data() {
    return {
      q: "",
      qv: "qv",
      result: "",
      pos: {
        top: "0px",
        left: "0px"
      },
      isHide: true
    };
  },
  mounted() {
    window.addEventListener("mouseup", this.mouseUp);
  },
  destroyed() {
    window.removeEventListener("mouseup", this.mouseUp);
  },
  methods: {
    /**
     * Listen mouseUp event
     */
    mouseUp(e) {
      this.q = window
        .getSelection()
        .toString()
        .trim();
      if (!this.q || this.q === this.qv) {
        this.isHide = true;
        this.result = "";
        this.q = "";
        this.qv = "qv";
        return;
      }
      this.qv = this.q;
      this.pos.top = e.pageY + 15 + "px";
      this.pos.left = e.pageX + "px";
      let parameter = this.makeParameter();
      this.translate(parameter);
    },
    /**
     * make parameters with baidu translate API
     */
    makeParameter() {
      const appid = process.env.APPID;
      let salt =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      let sign = md5(appid + this.q + salt + process.env.KEY);
      let parameter = `from=auto&to=zh&q=${
        this.q
      }&appid=${appid}&salt=${salt}&sign=${sign}`;
      return parameter;
    },
    /**
     * Translate other languages to Chinese
     */
    translate(parameter) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage(
        {
          type: "fetch",
          url: `https://fanyi-api.baidu.com/api/trans/vip/translate?${parameter}`
        },
        response => {
          let result = JSON.parse(response).trans_result;
          if (result && result.length >= 0) {
            this.result = result[0].dst.replace(/([\x20-\xFF]+)/g, " $1 ");
            this.isHide = false;
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+SC:400,500,700&display=swap&subset=chinese-simplified");
@import "../assets/scss/content.scss";
</style>
