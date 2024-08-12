import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeRoutes from "@/home/router/HomeRoutes";
import BoardRoutes from "@/board/router/BoardRoutes";
import AccountRoutes from "@/account/router/AccountRoutes";

const routes: Array<RouteRecordRaw> = [
    ...HomeRoutes,
    ...BoardRoutes,
    ...AccountRoutes];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
