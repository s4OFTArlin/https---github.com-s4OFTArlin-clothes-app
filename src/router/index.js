import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  // 使用 Hash 模式
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'RoleSelect',
      component: Login
    },
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
        
        // --- 修正后的路径 ---
        { 
          path: 'recycle-promo', 
          name: 'RecyclePromo',
          // 这里确保指向你实际创建的 src/views/user/ 目录
          component: () => import('../views/user/RecyclePromo.vue') 
        },

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