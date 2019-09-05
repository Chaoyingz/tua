<template>
  <div class="popup">
    <tua-loading v-if="!isLoaded" />
    <div v-if="isLoaded">
      <div class="popup-header">
        <div class="logo">
          <tua-logo-text />
        </div>
        <div class="switch">
          <input type="checkbox" v-model="isTuaOpen" id="switch" /><label
            for="switch"
            >开关</label
          >
        </div>
      </div>

      <div class="popup-content">
        <div class="popup-content-source">
          <textarea
            cols="30"
            rows="8"
            v-model="q"
            @keyup="translate"
          ></textarea>
        </div>
        <div class="popup-content-target">
          <!--
          <div class="popup-content-target__item">
            <button
              @click="target = 'zh-CHS'"
              :class="{ active: target === 'zh-CHS' }"
            >
              中文
            </button>
            <button @click="target = 'en'" :class="{ active: target === 'en' }">
              英文
            </button>
          </div>
        --></div>
        <div class="popup-content-result">
          <span>{{ result }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { KEY_STATUS_TUA } from "@/constant";
import TuaLoading from "@/components/Loading";
import TuaLogoText from "@/assets/svg/tua-logo-text.svg";

import md5 from "md5";
import axios from "axios";
export default {
  data() {
    return {
      isTuaOpen: true,
      isLoaded: false,
      q: "",
      result: "",
      target: "zh-CHS"
    };
  },
  components: {
    "tua-loading": TuaLoading,
    "tua-logo-text": TuaLogoText
  },
  async mounted() {
    this.isTuaOpen = await this.$storage.get(KEY_STATUS_TUA);
    this.isLoaded = true;
  },
  watch: {
    isTuaOpen: function(val) {
      this.$storage.set(KEY_STATUS_TUA, val);
    }
  },
  methods: {
    /**
     * make payload with sougou translate API
     */
    makePayload() {
      const pid = process.env.SOUGOU_PID;
      const key = process.env.SOUGOU_KEY;
      let salt =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      let sign = md5(pid + this.q + salt + key);
      let payload = `from=auto&to=${this.target}&pid=${pid}&q=${
        this.q
      }&sign=${sign}&salt=${salt}`;
      return payload;
    },
    async translate() {
      let payload = this.makePayload();
      await axios({
        method: "POST",
        url: "http://fanyi.sogou.com/reventondc/api/sogouTranslate",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // eslint-disable-next-line prettier/prettier
          "Accept": "application/json"
        },
        data: payload
      }).then(res => {
        this.result = res.data.translation;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/popup.scss";
</style>
