import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";

// Lazy load route components
const RecipesPage = () => import("@/pages/RecipesPage.vue");
const RecipePage = () => import("@/pages/RecipePage.vue");
const MyListPage = () => import("@/pages/MyListPage.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: RecipesPage,
  },
  {
    path: "/recipe/:slug",
    name: "recipe",
    component: RecipePage,
    props: true,
  },
  {
    path: "/my-list",
    name: "mylist",
    component: MyListPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
