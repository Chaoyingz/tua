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
            placeholder="请输入任意文本..."
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

export default {
  data() {
    return {
      isTuaOpen: true,
      isLoaded: false,
      q: "",
      result: ""
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
    async translate() {
      const response = await this.$message.send({
        type: "translate-sougou",
        q: this.q
      });
      let translation = response.data.translation;
      if (translation) {
        this.result = translation.replace(/([\x20-\xFF]+)/g, " $1 ");
      } else {
        this.result = this.q;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/popup.scss";
</style>
