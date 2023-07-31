import { createRouter, createWebHistory } from "vue-router";
import stringFormatting from "../components/stringFormatting.vue"

const routes = [
    { path: "/", redirect: "/formatting" },
    { path: "/formatting", component: stringFormatting },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;