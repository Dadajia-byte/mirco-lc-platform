import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

const routes = [
  { path: '/', component: () => import('./views/Home.vue') }
]

const router = createRouter({
  history: createWebHistory('/renderer'),
  routes
})

createApp(App)
  .use(router)
  .mount('#app')
