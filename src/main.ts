import { createApp } from "vue";
import "./assets/globals.css";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import clickOutside from "./directives/clickOutside";

const pinia = createPinia();
createApp(App)
  .use(router)
  .use(pinia)
  .directive("click-outside", clickOutside)
  .mount("#app");
