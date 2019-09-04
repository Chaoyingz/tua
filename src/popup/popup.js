import Vue from "vue";
import App from "./Popup.vue";
import Storage from "@/storage";

Vue.use({
  install: Vue => {
    Vue.prototype.$storage = Storage;
  }
});

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
