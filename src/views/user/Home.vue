<template>
  <div class="page-container">
    <!-- 顶部固定导航 & 搜索 -->
    <div class="sticky-header">
      <div class="search-row">
        <div class="search-input-box">
          <Search :size="16" color="#999" />
          <input type="text" placeholder="搜索穿搭灵感" />
        </div>
      </div>
      
      <!-- 发现 / 关注 切换 -->
      <div class="tab-switch">
        <span 
          :class="{ active: currentTab === 'discover' }" 
          @click="currentTab = 'discover'"
        >发现</span>
        <span 
          :class="{ active: currentTab === 'following' }" 
          @click="currentTab = 'following'"
        >关注</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-feed">
      <!-- 发现页 (瀑布流模拟) -->
      <div v-if="currentTab === 'discover'" class="grid-feed">
        <div class="feed-card" v-for="i in 6" :key="'d'+i">
          <div class="img-box" :style="{ height: i % 2 === 0 ? '200px' : '160px' }">
            OOTD {{ i }}
          </div>
          <div class="card-info">
            <span class="desc">今日甜美穿搭分享</span>
            <div class="interactive">
              <Heart :size="14" /> <span>128</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 关注页 (列表流) -->
      <div v-else class="list-feed">
        <div class="feed-row" v-for="i in 4" :key="'f'+i">
          <div class="avatar-row">
            <div class="avatar">STY</div>
            <span class="name">首席搭配师_Ann</span>
          </div>
          <div class="big-img">New Collection {{ i }}</div>
          <div class="actions">
            <Heart :size="24" />
            <MessageCircle :size="24" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Heart, MessageCircle } from 'lucide-vue-next'

const currentTab = ref('discover')
</script>

<style scoped>
.page-container {
  background: #fff;
  padding:0;
}

/* 顶部样式 */
.sticky-header {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
  padding: 30px 28px 10px 28px;
  border-bottom: 1px solid #f0f0f0;
}

.search-input-box {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}
.search-input-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  width: 100%;
}

.tab-switch {
  display: flex;
  gap: 30px;
  padding-bottom: 10px;
}
.tab-switch span {
  font-size: 16px;
  color: #999;
  font-weight: 600;
  cursor: pointer;
  position: relative;
}
.tab-switch span.active {
  color: #000;
  font-size: 18px;
}
.tab-switch span.active::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #ff80ab; /* 粉色高亮 */
  border-radius: 2px;
}

/* 内容流 */
.content-feed { 
  padding: 23px; 
}

/* 发现页瀑布流 */
.grid-feed {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.feed-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}
.img-box {
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
}
.card-info { padding: 10px; }
.desc { font-size: 12px; display: block; margin-bottom: 6px; }
.interactive { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #999; }

/* 关注页列表 */
.list-feed { display: flex; flex-direction: column; gap: 30px; }
.avatar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.avatar { width: 32px; height: 32px; background: #a7ffeb; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; }
.name { font-size: 14px; font-weight: 600; }
.big-img { width: 100%; height: 250px; background: #eee; border-radius: 12px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; }
.actions { display: flex; gap: 15px; }
</style>