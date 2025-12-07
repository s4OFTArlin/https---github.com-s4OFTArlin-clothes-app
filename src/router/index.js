import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Login from '../pages/Login/Login.vue'
import StylistHome from '../pages/Stylist/messageStylist.vue' 
import UserHome from '../pages/User/user.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/stylist',
    name: 'StylistHome',
    component: StylistHome
  },
  {
    path: '/user', 
    name: 'UserHome',
    component: UserHome
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router