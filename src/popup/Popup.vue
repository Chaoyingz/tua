<template>
  <div class="popup">
    <tua-loading v-if="!isLoaded" />
    <div v-if="isLoaded">
      <div class="popup-header">
        <div class="logo">
          <img src="@/assets/img/tua-logo-text.svg" alt="tua translate" />
        </div>
        <div class="switch">
          <input type="checkbox" v-model="isTuaOpen" id="switch" /><label
            for="switch"
            >开关</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { KEY_STATUS_TUA } from "@/constant";
import TuaLoading from "@/components/Loading";
export default {
  data() {
    return {
      isTuaOpen: true,
      isLoaded: false
    };
  },
  components: {
    "tua-loading": TuaLoading
  },
  async mounted() {
    this.isTuaOpen = await this.$storage.get(KEY_STATUS_TUA);
    this.isLoaded = true;
  },
  watch: {
    isTuaOpen: function(val) {
      this.$storage.set(KEY_STATUS_TUA, val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/popup.scss";
</style>
