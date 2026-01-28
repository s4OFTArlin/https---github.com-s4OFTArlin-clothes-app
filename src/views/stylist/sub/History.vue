<template>
  <div class="page-container">
    <div class="nav-bar">
      <div class="left" @click="goBack"><ChevronLeft :size="24" /></div>
      <div class="title">我的足迹</div>
      <div class="right"></div>
    </div>

    <div class="timeline-content">
      <div class="time-group" v-for="(group, gIdx) in historyData" :key="gIdx">
        <div class="group-title">{{ group.date }}</div>
        <div class="h-list">
          <div class="h-item" v-for="(item, iIdx) in group.items" :key="iIdx">
            <img 
              :src="item.img" 
              class="h-img" 
              @error="handleImgError"
            />
            <div class="h-text">
              <p class="name">{{ item.name }}</p>
              <p class="meta">{{ item.meta }}</p>
            </div>
            <div class="re-view">查看</div>
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

const handleImgError = (e) => {
  e.target.src = 'https://api.dicebear.com/7.x/bottts/svg?seed=item'
}

const historyData = [
  {
    date: '今天',
    items: [
      { name: '设计感衬衫', meta: '浏览 2次 · 停留 30秒', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200' },
      { name: '复古厚底鞋', meta: '浏览 1次', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200' }
    ]
  },
  {
    date: '昨天',
    items: [
      { name: '阔腿牛仔裤', meta: '浏览 1次', img: 'https://images.unsplash.com/photo-1551488852-0801751ac367?w=200' }
    ]
  }
]
</script>

<style scoped>
.page-container { 
  background: #fff; 
  height: 100vh; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden;
}

.nav-bar { 
  height: 54px; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  padding: 0 15px; 
  border-bottom: 1px solid #f8f8f8;
  flex-shrink: 0;
}

.title { font-size: 16px; font-weight: 800; color: #1a1a1a; }

.timeline-content { 
  padding: 20px; 
  overflow-y: auto; 
  flex: 1; 
  -webkit-overflow-scrolling: touch;
}

.time-group { margin-bottom: 30px; }
.group-title { 
  font-size: 22px; 
  font-weight: 900; 
  margin-bottom: 20px; 
  color: #00695c; /* 标题采用深绿 */
}

.h-list { display: flex; flex-direction: column; gap: 20px; }
.h-item { 
  display: flex; 
  gap: 15px; 
  align-items: center; 
  padding: 10px;
  background: #fcfcfc;
  border-radius: 12px;
}

.h-img { 
  width: 64px; 
  height: 64px; 
  border-radius: 12px; 
  object-fit: cover; 
  flex-shrink: 0;
  border: 1px solid #f0f0f0;
}

.h-text { flex: 1; }
.name { font-size: 15px; font-weight: 700; margin: 0 0 4px 0; color: #333; }
.meta { font-size: 11px; color: #999; margin: 0; }

.re-view {
  background: #d1f2eb;
  color: #00695c;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}
</style>