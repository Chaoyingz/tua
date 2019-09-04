<template>
  <transition name="bounce">
    <div
      class="tua-content"
      :style="pos"
      v-show="!isHidden"
      v-mouseup-outside="mouseUp"
    >
      <div class="tua-content-menu">
        <div class="tua-content-menu__item">
          <button v-show="isPause" @click="speechPlay" title="阅读翻译">
            <PlayButtonSvg />
          </button>
          <button v-show="!isPause" @click="speechPause" title="停止阅读">
            <PauseButtonSvg />
          </button>
        </div>
        <div class="tua-content-menu__item">
          <button
            title="复制文本内容"
            v-clipboard:copy="result"
            v-clipboard:success="onCopy"
          >
            <CopyButtonSvg />
          </button>
        </div>
      </div>
      <div class="tua-content-result">
        {{ result }}
      </div>
    </div>
  </transition>
</template>

<script>
import { KEY_STATUS_TUA } from "@/constant";
import md5 from "md5";

import PlayButtonSvg from "@/assets/svg/play-button.svg";
import PauseButtonSvg from "@/assets/svg/pause-button.svg";
import CopyButtonSvg from "@/assets/svg/copy-button.svg";
export default {
  data() {
    return {
      q: "",
      result: "",
      pos: {
        top: "0px",
        left: "0px"
      },
      isHidden: true,
      speech: null,
      isPause: true
    };
  },
  components: {
    PlayButtonSvg,
    PauseButtonSvg,
    CopyButtonSvg
  },
  methods: {
    /**
     * Listen mouseUp event
     */
    async mouseUp(e) {
      let isTuaOpen = await this.$storage.get(KEY_STATUS_TUA);
      this.q = window
        .getSelection()
        .toString()
        .trim();
      if (!this.q || !isTuaOpen) {
        this.isHidden = true;
        this.result = "";
        this.q = "";
        if (this.speech) {
          this.speech.pause();
        }
        this.isPause = true;
        return;
      }
      this.pos.top = e.pageY + 15 + "px";
      this.pos.left = e.pageX + "px";
      let parameter = this.makeParameter();
      this.translate(parameter);
    },
    /**
     * make parameters with baidu translate API
     */
    makeParameter() {
      const appid = process.env.BAIDU_APPID;
      let salt =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      let sign = md5(appid + this.q + salt + process.env.BAIDU_KEY);
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
          type: "get",
          url: `https://fanyi-api.baidu.com/api/trans/vip/translate?${parameter}`
        },
        response => {
          let result = JSON.parse(response).trans_result;
          if (result && result.length >= 0) {
            this.result = result[0].dst.replace(/([\x20-\xFF]+)/g, " $1 ");
            this.isHidden = false;
            this.textToSpeech();
          }
        }
      );
    },
    textToSpeech() {
      let data = {
        input: {
          text: this.result
        },
        voice: {
          languageCode: "cmn-CN",
          name: "cmn-CN-Wavenet-A",
          ssmlGender: "FEMALE"
        },
        audioConfig: {
          audioEncoding: "MP3"
        }
      };
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage(
        {
          type: "post",
          url: `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${
            process.env.GOOGLE_TTS_KEY
          }`,
          data: data
        },
        response => {
          let result = JSON.parse(response);
          this.speech = new Audio(
            "data:audio/wav;base64," + result.audioContent
          );
          // this.speech.play();
        }
      );
    },
    speechPlay() {
      this.speech.play();
      this.isPause = false;
    },
    speechPause() {
      this.speech.pause();
      this.isPause = true;
    },
    onCopy() {}
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+SC:400,500,700&display=swap&subset=chinese-simplified");
@import "../assets/scss/content.scss";
</style>
