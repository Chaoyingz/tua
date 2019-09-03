import Vue from "vue";
import App from "./Content.vue";

function createApp() {
  let app = document.createElement("div");
  app.setAttribute("id", "tua-app");
  document.body.appendChild(app);
}

createApp();

Vue.directive("mouseup-outside", {
  bind(el, binding, vnode) {
    el.monuseUpEvent = function(event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("mouseup", el.monuseUpEvent);
  },
  unbind(el) {
    document.body.removeEventListener("mouseup", el.monuseUpEvent);
  }
});

new Vue({
  el: "#tua-app",
  render: h => h(App)
});
