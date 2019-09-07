import Vue from "vue";
import App from "./Popup.vue";
import Storage from "@/lib/storage";
import Message from "@/lib/message";
import VueClipboard from "vue-clipboard2";

Vue.use({
  install: Vue => {
    Vue.prototype.$storage = Storage;
    Vue.prototype.$message = Message;
  }
});

Vue.use(VueClipboard);

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
