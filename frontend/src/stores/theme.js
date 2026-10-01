import { defineStore } from "pinia";

const STORAGE_KEY = "suivi-theme";

function preferSombre() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export const useThemeStore = defineStore("theme", {
  state: () => ({
    sombre: localStorage.getItem(STORAGE_KEY) === "dark" || (!localStorage.getItem(STORAGE_KEY) && preferSombre()),
  }),
  actions: {
    appliquer() {
      document.documentElement.setAttribute("data-theme", this.sombre ? "dark" : "light");
    },
    basculer() {
      this.sombre = !this.sombre;
      localStorage.setItem(STORAGE_KEY, this.sombre ? "dark" : "light");
      this.appliquer();
    },
    initialiser() {
      this.appliquer();
    },
  },
});
