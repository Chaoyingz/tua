import Vue from "vue";
import App from "./Popup.vue";
import Storage from "@/lib/storage";
import Message from "@/lib/message";

Vue.use({
  install: Vue => {
    Vue.prototype.$storage = Storage;
    Vue.prototype.$message = Message;
  }
});

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
