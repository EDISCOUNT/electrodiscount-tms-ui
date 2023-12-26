// Composables
import { createRouter, createWebHistory } from 'vue-router'


import { routes as adminRoutes } from '@/admin/router'
import { routes as carrierRoutes } from '@/carrier/router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      // {
      //   path: '',
      //   name: 'Home',
      //   // route level code-splitting
      //   // this generates a separate chunk (about.[hash].js) for this route
      //   // which is lazy-loaded when the route is visited.
      //   component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      // },

      {
        path: 'login',
        name: 'auth:login',
        component: () => import(/* webpackChunkName: "login" */ '@/layouts/login/Default.vue'),
      },
      //
      {
        path: '',
        redirect: { name: 'admin:home' },
      },
      //
      {
        path: '/carrier',
        name: 'carrier',
        children: carrierRoutes,
        meta: {
          // isProtected: true,
          roles: ['ROLE_CARRIER', 'ROLE_CARRIER_OPERATOR'],
        }
      },

      //
      {
        path: '/admin',
        name: 'Admin',
        children: adminRoutes,
        meta: {
          isProtected: true,
          roles: ['ROLE_ADMIN'],
        }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
