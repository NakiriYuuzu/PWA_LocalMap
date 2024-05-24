import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes: routes
})