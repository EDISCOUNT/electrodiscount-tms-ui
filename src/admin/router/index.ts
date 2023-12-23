// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // {
  //   // path: '/',
  //   path:'',
  //   component: () => import('@/layouts/default/Default.vue'),
  //   children: [
  //     {
  //       path: '',
  //       name: 'Home',
  //       // route level code-splitting
  //       // this generates a separate chunk (about.[hash].js) for this route
  //       // which is lazy-loaded when the route is visited.
  //       component: () => import(/* webpackChunkName: "home" */ '@/admin/layouts/home/Default.vue'),
  //     },
  //     {
  //       path: 'login',
  //       name: 'Login',
  //       component: () => import(/* webpackChunkName: "login" */ '@/admin/layouts/login/Default.vue'),
  //     },
  //   ],
  // },

  {
    path: '',
    name: 'admin:home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ '@/admin/layouts/home/Default.vue'),
  },
  // {
  //   path: 'login',
  //   name: 'admin:login',
  //   component: () => import(/* webpackChunkName: "login" */ '@/admin/layouts/login/Default.vue'),
  // },
  {
    path: 'channel/channels',
    name: 'admin:channel',
    component: () => import('@/admin/layouts/channel/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin:channel:index',
        component: () => import('@/admin/views/channel/Index.vue')

      },
      {
        path: ':type/create',
        name: 'admin:channel:create',
        component: () => import('@/admin/views/channel/Create.vue'),
        props: true
      },
      {
        path: ':id/edit',
        name: 'admin:channel:edit',
        component: () => import('@/admin/views/channel/Edit.vue'),
        props: true

      },
    ]
  },
  // >> ORDER
  // >> ORDER >> ORDERS
  {
    path: 'order/orders',
    name: 'admin:order',
    component: () => import('@/admin/layouts/order/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin:order:index',
        component: () => import('@/admin/views/order/order/Index.vue')

      },
      // {
      //   path: 'create',
      //   name: 'admin:order:create',
      //   component: () => import('@/admin/views/order/order/Create.vue'),
      //   props: true
      // },
      // {
      //   path: ':id/edit',
      //   name: 'admin:order:edit',
      //   component: () => import('@/admin/views/order/order/Edit.vue'),
      //   props: true

      // },
    ]
  },
  // >> ORDER >> ADDITIONAL SERVICE
  {
    path: 'order/additional_services',
    name: 'admin:order:additional_service',
    component: () => import('@/admin/layouts/order/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin:order:additional_service:index',
        component: () => import('@/admin/views/order/additional_service/Index.vue')

      },
      {
        path: 'create',
        name: 'admin:order:additional_service:create',
        component: () => import('@/admin/views/order/additional_service/Create.vue'),
        props: true
      },
      {
        path: ':id/edit',
        name: 'admin:order:additional_service:edit',
        component: () => import('@/admin/views/order/additional_service/Edit.vue'),
        props: true

      },
    ]
  },
  // 


  // >> CARRIER
  // >> CARRIER >> CARRIER
  {
    path: 'carrier/carriers',
    name: 'admin:carrier',
    component: () => import('@/admin/layouts/carrier/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin:carrier:index',
        component: () => import('@/admin/views/carrier/carrier/Index.vue')

      },
      {
        path: 'create',
        name: 'admin:carrier:create',
        component: () => import('@/admin/views/carrier/carrier/Create.vue'),
        props: true
      },
      {
        path: ':id/edit',
        name: 'admin:carrier:edit',
        component: () => import('@/admin/views/carrier/carrier/Edit.vue'),
        props: true
      },
    ]
  },



  // >> CATLOG
  // >> CATALOG >> PRODUCT
  {
    path: 'catalog/products',
    name: 'admin:catalog:product',
    component: () => import('@/admin/layouts/catalog/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin:catalog:product:index',
        component: () => import('@/admin/views/catalog/product/Index.vue')
      },
      {
        path: 'create',
        name: 'admin:catalog:product:create',
        component: () => import('@/admin/views/catalog/product/Create.vue'),
        props: true
      },
      {
        path: ':id/edit',
        name: 'admin:catalog:product:edit',
        component: () => import('@/admin/views/catalog/product/Edit.vue'),
        props: true

      },
    ]
  },


  //
  //
  {
    path: 'shipment/shipments',
    name: 'admin:shipment',
    component: () => import('@/admin/layouts/shipment/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin:shipment:index',
        component: () => import('@/admin/views/shipment/shipment/Index.vue')
      },
      {
        path: 'create',
        name: 'admin:shipment:create',
        component: () => import('@/admin/views/shipment/shipment/Create.vue'),
        props: true
      },
      {
        path: ':id/edit',
        name: 'admin:shipment:edit',
        component: () => import('@/admin/views/shipment/shipment/Edit.vue'),
        props: true

      },
      {
        path: ':id',
        name: 'admin:shipment:show',
        component: () => import('@/admin/views/shipment/shipment/Show.vue'),
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
