import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {path: '/', redirect: '/home'},
  {path: '/home', component: () => import('../pages/home.vue')},
  {path: '/room', component: () => import('../pages/room.vue')}
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})