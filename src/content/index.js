import Vue from "vue";
import App from "./Content.vue";
import Storage from "@/lib/storage";
import Message from "@/lib/message";
import { mouseupOutside, mousedown } from "@/lib/directive";

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
Vue.directive("mousedown", mousedown);
Vue.config.devtools = false;
Vue.config.productionTip = false;

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
