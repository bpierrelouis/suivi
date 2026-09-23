import { defineStore } from "pinia";
import { api } from "../services/api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    utilisateur: null,
    initialise: false,
  }),
  getters: {
    estConnecte: (state) => Boolean(state.utilisateur),
  },
  actions: {
    async initialiser() {
      if (this.initialise) return;
      try {
        const data = await api("/auth/me");
        this.utilisateur = data.utilisateur;
      } catch {
        this.utilisateur = null;
      } finally {
        this.initialise = true;
      }
    },
    async connexion(identifiant, motDePasse) {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifiant, motDePasse }),
      });
      this.utilisateur = data.utilisateur;
      this.initialise = true;
    },
    async deconnexion() {
      try {
        await api("/auth/logout", { method: "POST" });
      } finally {
        this.utilisateur = null;
        this.initialise = true;
      }
    },
  },
});
