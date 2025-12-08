<template>
  <div class="page-container">
    <div class="nav-bar">
      <div class="left" @click="goBack">
        <ChevronLeft :size="24" />
      </div>
      <div class="title">我的足迹</div>
      <div class="right"></div> <!-- 占位 -->
    </div>

    <div class="timeline-content">
      <div class="time-group">
        <div class="group-title">今天</div>
        <div class="h-list">
          <div class="h-item" v-for="i in 3" :key="i">
            <div class="h-img"></div>
            <div class="h-text">
              <p class="name">设计感衬衫 {{ i }}</p>
              <p class="meta">浏览 2次 · 停留 30秒</p>
            </div>
          </div>
        </div>
      </div>

      <div class="time-group">
        <div class="group-title">昨天</div>
        <div class="h-list">
          <div class="h-item" v-for="i in 4" :key="i">
            <div class="h-img"></div>
            <div class="h-text">
              <p class="name">阔腿牛仔裤 {{ i }}</p>
              <p class="meta">浏览 1次</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const goBack = () => router.back()
</script>

<style scoped>
.page-container { background: #fff; height: 100%; display: flex; flex-direction: column; }
.nav-bar { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border-bottom: 1px solid #f5f5f5; background: #fff; }
.title { font-size: 16px; font-weight: 600; }
.timeline-content { padding: 20px; overflow-y: auto; flex: 1; }
.time-group { margin-bottom: 30px; }
.group-title { font-size: 20px; font-weight: bold; margin-bottom: 15px; }
.h-list { display: flex; flex-direction: column; gap: 15px; }
.h-item { display: flex; gap: 15px; }
.h-img { width: 70px; height: 70px; background: #eee; border-radius: 8px; }
.h-text { display: flex; flex-direction: column; justify-content: center; }
.name { font-size: 14px; margin: 0 0 5px 0; }
.meta { font-size: 12px; color: #999; margin: 0; }
</style>