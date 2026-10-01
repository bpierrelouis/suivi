import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/index.js";
import { useThemeStore } from "./stores/theme.js";
import "./styles/main.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
useThemeStore().initialiser();
app.mount("#app");
