<template>
  <div>
    <transition name="tua-content">
      <div
        class="tua-content"
        :style="pos"
        v-show="!isHidden"
        v-mouseup-outside="mouseUp"
        v-mousedown="mouseDown"
      >
        <div class="tua-content-result">{{ result }}</div>
        <div class="tua-content-triangle"></div>
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
  TRS_SELECTION_BLACK_LIST,
  TRS_TAG_PAGE_WHITE_LIST,
  TRS_TAG_PAGE_CONTENT_LIST
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
      this.translateNode(document.body);
    },
    /**
     * Listen mouseUp event
     */
    async mouseUp(e) {
      if (TRS_SELECTION_BLACK_LIST.includes(this.srcElement)) {
        return;
      }
      let isTuaOpen = await this.$storage.get(KEY_STATUS_TUA);
      this.srcElement = "";
      this.q = window
        .getSelection()
        .toString()
        .trim();
      if (this.q == "" || !isTuaOpen) {
        this.isHidden = true;
        this.result = "";
        this.q = "";
      } else {
        this.pos.top = e.pageY + 30 + "px";
        this.pos.left = e.pageX - 210 + "px";
        this.translate(this.q, "selection");
      }
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
            this.result = "请选择适当的文本后重试.";
            this.isHidden = false;
          }
        }
      }
    },
    async translateNode(node) {
      if (node) {
        let target = null;
        const children = Array.from(node.children);
        if (
          children.length === 0 &&
          TRS_TAG_PAGE_WHITE_LIST.includes(node.nodeName)
        ) {
          let q = node.innerText || node.textContent;
          if (q) {
            const translation = await this.translate(q, "page");
            let translationNode = node.cloneNode();
            translationNode.textContent = translation;
            node.classList.add("tua-trans", "tua-trans-source");
            translationNode.classList.add("tua-trans", "tua-trans-result");
            node.parentNode.insertBefore(translationNode, node.nextSibling);
          }
        } else if (TRS_TAG_PAGE_CONTENT_LIST.includes(node.nodeName)) {
          let q = node.innerText;
          const translation = await this.translate(q, "page");
          let translationNode = node.cloneNode();
          translationNode.innerText = translation;
          node.classList.add("tua-trans", "tua-trans-source");
          translationNode.classList.add("tua-trans", "tua-trans-result");
          node.parentNode.insertBefore(translationNode, node.nextSibling);
          // eslint-disable-next-line no-unused-vars
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
