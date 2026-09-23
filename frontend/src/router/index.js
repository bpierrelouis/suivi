import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import InventoryPreviewView from "../views/InventoryPreviewView.vue";
import ProjectsPreviewView from "../views/ProjectsPreviewView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/connexion", name: "connexion", component: LoginView, meta: { public: true } },
    { path: "/", name: "dashboard", component: DashboardView },
    { path: "/inventaire", name: "inventaire", component: InventoryPreviewView },
    { path: "/projets", name: "projets", component: ProjectsPreviewView, meta: { interditGestionnaire: true } },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.initialiser();

  if (!to.meta.public && !auth.estConnecte) return { name: "connexion" };
  if (to.name === "connexion" && auth.estConnecte) return { name: "dashboard" };
  if (to.meta.interditGestionnaire && auth.utilisateur?.role === "gestionnaire") return { name: "dashboard" };
});

export default router;
