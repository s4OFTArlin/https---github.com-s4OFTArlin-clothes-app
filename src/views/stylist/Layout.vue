<template>
  <div class="main-layout">
    <!-- 核心修改：包裹 Transition -->
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
import { MessageSquare, Shirt, User } from 'lucide-vue-next'

const navItems = [
  { label: '消息', path: '/stylist/message', icon: MessageSquare },
  { label: '衣橱', path: '/stylist/wardrobe', icon: Shirt },
  { label: '我的', path: '/stylist/mine', icon: User },
]
</script>

<style scoped>
.main-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* 防止动画溢出 */
}

.content-wrapper {
  flex: 1;
  overflow: hidden; /* 确保页面内部滚动，不影响整体 */
  display: flex;
  flex-direction: column;
}

/* --- 2. 内部侧滑淡入动画 (Slide Fade) --- */
/* 进入阶段：从右边稍微滑进来，变清晰 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

/* 离开阶段：向左边稍微滑出去，变透明 */
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