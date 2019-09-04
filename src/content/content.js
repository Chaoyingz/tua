import Vue from "vue";
import App from "./Content.vue";
import Storage from "@/storage";
import VueClipboard from "vue-clipboard2";
import Notifications from "vue-notification";
import { mouseupOutside } from "@/directive";

/**
 * create app element
 */
function createContentApp() {
  let app = document.createElement("div");
  app.setAttribute("id", "tua-app");
  document.body.appendChild(app);
}
createContentApp();

Vue.directive("mouseup-outside", mouseupOutside);

VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

Vue.use(Notifications);

Vue.use({
  install: Vue => {
    Vue.prototype.$storage = Storage;
  }
});

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
