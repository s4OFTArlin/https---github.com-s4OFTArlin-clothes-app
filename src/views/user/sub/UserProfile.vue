<template>
  <div class="page-container">
    <div class="nav-bar">
      <div class="left" @click="goBack"><ChevronLeft :size="24" /></div>
      <div class="username">首席搭配师_Ann</div>
      <div class="right"><MoreHorizontal :size="24" /></div>
    </div>

    <div class="profile-scroll">
      <!-- 1. 头部信息 -->
      <div class="profile-header">
        <div class="avatar-big">STY</div>
        <div class="stats-row">
          <div class="stat-item"><strong>128</strong><span>帖子</span></div>
          <div class="stat-item"><strong>4.2w</strong><span>粉丝</span></div>
          <div class="stat-item"><strong>105</strong><span>关注</span></div>
        </div>
      </div>

      <div class="bio-section">
        <div class="real-name">Ann Style</div>
        <p class="bio-text">专注于极简风与法式穿搭 🎨<br>接个人穿搭咨询，私信联系</p>
      </div>

      <!-- 2. 操作按钮 -->
      <div class="action-buttons">
        <button class="btn follow">关注</button>
        <button class="btn msg" @click="goChat">私聊</button>
      </div>

      <!-- 3. 作品网格 -->
      <div class="grid-tabs">
        <div class="tab active"><Grid3X3 :size="20" /></div>
        <div class="tab"><User :size="20" /></div>
      </div>
      
      <div class="photo-grid">
        <div class="photo-item" v-for="n in 12" :key="n" @click="goToPost">
          <div class="img-box">Post {{ n }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChevronLeft, MoreHorizontal, Grid3X3, User } from 'lucide-vue-next'

const router = useRouter()
const goBack = () => router.back()

const goChat = () => {
  router.push('/user/message/chat?name=首席搭配师_Ann')
}

const goToPost = () => {
  // 点击网格里的图片，进入帖子详情
  router.push('/user/post/1')
}
</script>

<style scoped>
.page-container { background: #fff; height: 100%; display: flex; flex-direction: column; }
.nav-bar { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; flex-shrink: 0; }
.username { font-weight: 600; font-size: 16px; }

.profile-scroll { flex: 1; overflow-y: auto; }

.profile-header { display: flex; padding: 20px 20px 0; align-items: center; }
.avatar-big { width: 80px; height: 80px; border-radius: 50%; background: #a7ffeb; color: #00695c; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 20px; border: 1px solid #eee; }

.stats-row { flex: 1; display: flex; justify-content: space-around; }
.stat-item { display: flex; flex-direction: column; align-items: center; }
.stat-item strong { font-size: 18px; }
.stat-item span { font-size: 12px; color: #666; }

.bio-section { padding: 15px 20px; }
.real-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.bio-text { font-size: 13px; color: #333; line-height: 1.4; }

.action-buttons { display: flex; gap: 10px; padding: 0 20px 20px; }
.btn { flex: 1; height: 32px; border-radius: 6px; border: none; font-weight: 600; font-size: 13px; cursor: pointer; }
.btn.follow { background: #ff80ab; color: #fff; }
.btn.msg { background: #f5f5f5; color: #333; border: 1px solid #ddd; }

.grid-tabs { display: flex; border-top: 1px solid #eee; border-bottom: 1px solid #eee; height: 44px; }
.tab { flex: 1; display: flex; align-items: center; justify-content: center; color: #ccc; }
.tab.active { color: #333; border-bottom: 1px solid #000; }

.photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
.photo-item { aspect-ratio: 1; background: #eee; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 12px; cursor: pointer; }
</style>