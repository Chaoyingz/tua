<template>
  <div class="popup">
    <div class="popup-header">
      <div class="logo">
        <img src="@/assets/img/tua-logo-text.svg" alt="tua translate" />
      </div>
      <div class="switch">
        <input type="checkbox" v-model="isTuaOn" id="switch" /><label
          for="switch"
          >开关</label
        >
      </div>
    </div>
  </div>
</template>

<script>
import { KEY_STATUS_TUA } from "@/constant";
export default {
  data() {
    return {
      isTuaOn: true
    };
  },
  async mounted() {
    this.isTuaOn = await this.$storage.get(KEY_STATUS_TUA);
  },
  watch: {
    isTuaOn: function(val) {
      this.$storage.set(KEY_STATUS_TUA, val);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/popup.scss";
</style>
