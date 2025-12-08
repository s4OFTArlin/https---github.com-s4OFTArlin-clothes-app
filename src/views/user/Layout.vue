<template>
  <div class="main-layout">
    <div class="content-wrapper">
      <router-view v-slot="{ Component }">
        <transition name="slide-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <TabBar :items="navItems" />
  </div>
</template>

<script setup>
import TabBar from '../../components/TabBar.vue'
import { Home, ShoppingBag, MessageSquare, User } from 'lucide-vue-next'

const navItems = [
  { label: '首页', path: '/user/home', icon: Home },
  { label: '商城', path: '/user/mall', icon: ShoppingBag },
  { label: '消息', path: '/user/message', icon: MessageSquare },
  { label: '我的', path: '/user/mine', icon: User },
]
</script>

<style scoped>
.main-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.content-wrapper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* --- Slide Fade 动画 --- */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>