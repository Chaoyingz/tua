export const mouseupOutside = {
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
};
