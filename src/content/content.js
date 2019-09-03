import Vue from "vue";
import App from "./Content.vue";

function createApp() {
  let app = document.createElement("div");
  app.setAttribute("id", "app");
  document.body.appendChild(app);
}

createApp();

new Vue({
  el: "#app",
  render: h => h(App)
});
