<template>
  <div>
    <transition name="bounce">
      .
      <div
        class="tua-content"
        :style="pos"
        v-show="!isHidden"
        v-mouseup-outside="mouseUp"
        v-mousedown="mouseDown"
      >
        <div class="tua-content-source">
          {{ this.q }}
        </div>
        <div class="tua-content-result">
          {{ result }}
        </div>
      </div>
    </transition>
    <div class="tua-menu">
      <button @click="translatePage">
        <TuaLogo />
      </button>
    </div>
  </div>
</template>

<script>
import {
  KEY_STATUS_TUA,
  TRANS_BLACK_LIST_CONTENT,
  TRANS_WHITE_LIST_PAGE
} from "@/constant";
import TuaLogo from "@/assets/svg/tua-logo.svg";

export default {
  components: {
    TuaLogo
  },
  data() {
    return {
      q: "",
      result: "",
      translation: "",
      pos: {
        top: "0px",
        left: "0px"
      },
      srcElement: "",
      isHidden: true
    };
  },
  mounted() {},
  methods: {
    mouseDown(e) {
      this.srcElement = e.srcElement.nodeName;
    },
    translatePage() {
      try {
        this.translateNode(document.body);
      } catch (e) {
        if (e !== this.breakException) throw e;
      }
    },
    /**
     * Listen mouseUp event
     */
    async mouseUp(e) {
      if (TRANS_BLACK_LIST_CONTENT.includes(this.srcElement)) {
        return;
      }
      let isTuaOpen = await this.$storage.get(KEY_STATUS_TUA);
      this.srcElement = "";
      this.q = window
        .getSelection()
        .toString()
        .trim();
      if (!this.q || !isTuaOpen) {
        this.isHidden = true;
        this.result = "";
        this.q = "";
        return;
      }
      this.pos.top = e.pageY + "px";
      this.pos.left = e.pageX + "px";
      this.translate(this.q, "selection");
    },
    /**
     * Translate other languages to Chinese
     */
    async translate(q, source) {
      switch (source) {
        case "page": {
          const response = await this.$message.send({
            type: "translate-sougou",
            q: q
          });
          let translation = response.data.translation;
          if (translation) {
            return translation.replace(/([\x20-\xFF]+)/g, " $1 ");
          } else {
            return "";
          }
        }
        case "selection": {
          const response = await this.$message.send({
            type: "translate-baidu",
            q: q
          });
          let translation = response.data.trans_result;
          if (translation && translation.length >= 0) {
            this.result = translation[0].dst.replace(/([\x20-\xFF]+)/g, " $1 ");
            this.isHidden = false;
          } else {
            this.result = "获取翻译失败, 请重试.";
            this.isHidden = false;
          }
        }
      }
    },
    async translateNode(parentNode) {
      if (parentNode) {
        let target = null;
        const children = Array.from(parentNode.children);
        if (children.length === 0) {
          if (TRANS_WHITE_LIST_PAGE.includes(parentNode.nodeName)) {
            let q = parentNode.innerText || parentNode.textContent;
            if (q) {
              const translation = await this.translate(q, "page");
              let translationNode = parentNode.cloneNode();
              translationNode.textContent = translation;
              parentNode.classList.add("tua-trans", "tua-trans-source");
              translationNode.classList.add("tua-trans", "tua-trans-result");
              parentNode.parentNode.insertBefore(
                translationNode,
                parentNode.nextSibling
              );
              // console.log(`[${this.counter}]`, parentNode, q, translation);
            }
            // if (this.counter > 100) {
            //   throw this.breakException;
            // }
          }
        }
        for (let i = 0; i < children.length; i++) {
          target = await this.translateNode(children[i]);
          if (target) {
            return target;
          }
        }
      }
      return null;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/scss/tua-trans.scss";
</style>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Lora|Noto+Sans+SC&display=swap");
@import "../assets/scss/content.scss";
</style>
