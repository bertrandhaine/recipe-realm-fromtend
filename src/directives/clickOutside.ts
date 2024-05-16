// src/directives/clickOutside.ts
import { DirectiveBinding } from "vue";

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const clickHandler = (event: MouseEvent) => {
      if (!el.contains(event.target as Node)) {
        binding.value(event);
      }
    };
    (el as any).__clickOutsideHandler__ = clickHandler;
    document.addEventListener("click", clickHandler);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener("click", (el as any).__clickOutsideHandler__);
    delete (el as any).__clickOutsideHandler__;
  },
};
