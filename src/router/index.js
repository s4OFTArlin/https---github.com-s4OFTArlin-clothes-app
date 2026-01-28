// 1. 修改 import 导入，增加 Hash 支持
import { createRouter, createWebHashHistory } from 'vue-router' 
import Login from '../views/Login.vue'

const router = createRouter({
  // 2. 修改这里：把 createWebHistory 改为 createWebHashHistory
  // 记得删掉里面的 BASE_URL，Hash 模式通常不需要它
  history: createWebHashHistory(), 
  
  routes: [
    {
      path: '/',
      name: 'RoleSelect',
      component: Login
    },
    // ... 下面其他的路由配置保持不变 ...
    {
      path: '/login',
      name: 'SignIn',
      component: () => import('../views/SignIn.vue')
    },
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
        { path: 'mine', component: () => import('../views/user/Mine.vue') },
        { path: 'mall/service', component: () => import('../views/user/sub/CustomerService.vue') },
        { path: 'message/chat', component: () => import('../views/user/sub/ChatDetail.vue') },
        { path: 'post/:id', component: () => import('../views/user/sub/PostDetail.vue') },
        { path: 'profile/:id', component: () => import('../views/user/sub/UserProfile.vue') },
        { path: 'settings', component: () => import('../views/user/sub/Settings.vue') },
        { path: 'vip', component: () => import('../views/user/sub/VipLevel.vue') }
      ]
    }
  ]
})

export default router