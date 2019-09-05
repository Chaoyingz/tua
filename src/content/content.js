import Vue from "vue";
import App from "./Content.vue";
import Storage from "@/storage";
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

Vue.use({
  install: Vue => {
    Vue.prototype.$storage = Storage;
  }
});

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
