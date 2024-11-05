import Dashboard from '@/components/Dashboard.vue'
import Description from '@/components/Description.vue'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/description/:id',
      name: 'Description',
      component: Description,
      props: true 
    },

  ]
})

export default router
