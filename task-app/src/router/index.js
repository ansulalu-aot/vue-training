import { createRouter, createWebHistory } from "vue-router";
import TaskList from "../components/TaskList.vue";
import AddEditTask from "../components/AddEditTask.vue";
import LoginView from "../views/LoginView.vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: LoginView, meta: { requiresAuth: false } },
  { path: "/tasks", component: TaskList, meta: { requiresAuth: true } },
  { path: "/add", component: AddEditTask, meta: { requiresAuth: true } },
  {
    path: "/edit/:taskId",
    component: AddEditTask,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to check if the user is authenticated before accessing certain routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else {
    next();
  }
});

export default router;
