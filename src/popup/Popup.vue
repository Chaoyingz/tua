<template>
  <div class="popup">
    <div class="popup-header">
      <div class="logo">
        <img src="@/assets/img/tua-logo-text.svg" alt="tua translate" />
      </div>
      <div class="switch">
        <input
          type="checkbox"
          v-model="isTrans"
          @change="setStorage({ statusTrans: isTrans ? 'on' : 'off' })"
          id="switch"
        /><label for="switch">开关</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isTrans: true
    };
  },
  mounted() {
    console.log(this.getStorage("statusTrans"));
    this.isTrans = this.getStorage("statusTrans") === "off" ? false : true;
  },
  methods: {
    setStorage(kv) {
      // eslint-disable-next-line no-undef
      chrome.storage.local.set(kv);
    },
    getStorage(key) {
      // eslint-disable-next-line no-undef
      chrome.storage.local.get(key, function(result) {
        return result[key];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/popup.scss";
</style>
