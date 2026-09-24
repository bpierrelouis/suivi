import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";
import InventoryPreviewView from "../views/InventoryPreviewView.vue";
import ProjectsView from "../views/ProjectsView.vue";
import ProjectDetailView from "../views/ProjectDetailView.vue";
import ProjectCreateView from "../views/ProjectCreateView.vue";
import UsersView from "../views/UsersView.vue";
import NotificationsView from "../views/NotificationsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/connexion", name: "connexion", component: LoginView, meta: { public: true } },
    { path: "/", name: "dashboard", component: DashboardView },
    { path: "/inventaire", name: "inventaire", component: InventoryPreviewView },
    {
      path: "/projets",
      name: "projets",
      component: ProjectsView,
      meta: { interditGestionnaire: true },
      children: [
        { path: "nouveau", name: "projet-nouveau", component: ProjectCreateView },
        { path: ":id", name: "projet-detail", component: ProjectDetailView },
      ],
    },
    { path: "/utilisateurs", name: "utilisateurs", component: UsersView, meta: { administrateur: true } },
    { path: "/notifications", name: "notifications", component: NotificationsView },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.initialiser();

  if (!to.meta.public && !auth.estConnecte) return { name: "connexion" };
  if (to.name === "connexion" && auth.estConnecte) return { name: "dashboard" };
  if (to.meta.interditGestionnaire && auth.utilisateur?.role === "gestionnaire") return { name: "dashboard" };
  if (to.meta.administrateur && auth.utilisateur?.role !== "administrateur") return { name: "dashboard" };
});

export default router;
