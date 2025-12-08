<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- 使用 v-slot 获取当前组件 -->
  <RouterView v-slot="{ Component }">
    <!-- 添加过渡动画组件 -->
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
/* 全局样式引入 */
@import './assets/main.css';

/* --- 1. 全局淡入淡出动画 (Fade) --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>