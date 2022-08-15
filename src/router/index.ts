import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/experience",
      name: "experience",
      component: () => import("@/views/ExperienceView.vue"),
    },
    {
      path: "/fun",
      name: "fun",
      component: () => import("@/views/FunView.vue"),
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("@/views/ProjectsView.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("@/views/ContactView.vue"),
    },
    {
      path: "/skills",
      name: "skills",
      component: () => import("@/views/SkillsView.vue"),
    },
  ],
});

export default router;
