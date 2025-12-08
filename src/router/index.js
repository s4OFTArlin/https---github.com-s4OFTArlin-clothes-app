import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'RoleSelect', // 原 Login 改名为 RoleSelect 更贴切
      component: Login
    },
    // --- 新增登录表单页 ---
    {
      path: '/login',
      name: 'SignIn',
      component: () => import('../views/SignIn.vue')
    },
    // -------------------
    {
      path: '/stylist',
      component: () => import('../views/stylist/Layout.vue'),
      children: [
        { path: '', redirect: '/stylist/wardrobe' },
        { path: 'message', component: () => import('../views/stylist/Message.vue') },
        { path: 'wardrobe', component: () => import('../views/stylist/Wardrobe.vue') },
        { path: 'mine', component: () => import('../views/stylist/Mine.vue') },
        { path: 'wardrobe/Favorites', component: () => import('../views/stylist/sub/Favorites.vue')},
        { path: 'wardrobe/history', component: () => import('../views/stylist/sub/History.vue') }
      ]
    },
    {
      path: '/user',
      component: () => import('../views/user/Layout.vue'),
      children: [
        { path: '', redirect: '/user/home' },
        { path: 'home', component: () => import('../views/user/Home.vue') },
        { path: 'mall', component: () => import('../views/user/Mall.vue') },
        { path: 'message', component: () => import('../views/user/Message.vue') },
        { path: 'mine', component: () => import('../views/user/Mine.vue') }
      ]
    }
  ]
})

export default router