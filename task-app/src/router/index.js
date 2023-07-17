import { createRouter, createWebHistory } from "vue-router";
import TaskList from "../components/TaskList.vue";
import AddEditTask from "../components/AddEditTask.vue";

const routes = [
  { path: "/", component: TaskList },
  { path: "/add", component: AddEditTask },
  { path: "/edit/:taskId", component: AddEditTask, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
