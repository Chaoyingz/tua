import Vue from "vue";
import App from "./Content.vue";
import { mouseupOutside } from "@/directive";

function createContentApp() {
  let app = document.createElement("div");
  app.setAttribute("id", "tua-app");
  document.body.appendChild(app);
}
createContentApp();

Vue.directive("mouseup-outside", mouseupOutside);

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
