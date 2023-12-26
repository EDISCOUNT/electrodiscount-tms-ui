// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [


  {
    path: '',
    name: 'carrier:home',
    component: () => import(/* webpackChunkName: "home" */ '@/carrier/layouts/home/Default.vue'),
  },

  //
  {
    path: 'shipment/shipments',
    name: 'carrier:shipment',
    component: () => import('@/carrier/layouts/shipment/Default.vue'),
    children: [
      {
        path: '',
        name: 'carrier:shipment:index',
        component: () => import('@/carrier/views/shipment/shipment/Index.vue')
      },
      {
        path: 'create',
        name: 'carrier:shipment:create',
        component: () => import('@/carrier/views/shipment/shipment/Create.vue'),
        props: true
      },
      {
        path: ':id/edit',
        name: 'carrier:shipment:edit',
        component: () => import('@/carrier/views/shipment/shipment/Edit.vue'),
        props: true

      },
      {
        path: ':id',
        name: 'carrier:shipment:show',
        component: () => import('@/carrier/views/shipment/shipment/Show.vue'),
        props: true

      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.ADMIN_BASE_URL),//createWebHistory(process.env.BASE_URL),
  routes: [],
})

export { routes };

export default router
